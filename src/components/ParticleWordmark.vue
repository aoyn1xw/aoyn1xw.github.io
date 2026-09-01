<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  heat: number;
}

interface PointerState {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  vx: number;
  vy: number;
  active: boolean;
}

const host = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const particles: Particle[] = [];
const pointer: PointerState = {
  x: 0,
  y: 0,
  previousX: 0,
  previousY: 0,
  vx: 0,
  vy: 0,
  active: false
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let context: CanvasRenderingContext2D | null = null;
let frame = 0;
let width = 0;
let height = 0;
let visible = true;
let resizeObserver: ResizeObserver | undefined;
let visibilityObserver: IntersectionObserver | undefined;

function wordmarkMetrics() {
  const compact = width < 720;
  return {
    compact,
    sampleGap: compact ? 5 : 6,
    radius: compact ? 70 : 104,
    force: compact ? 1.35 : 1.8,
    spring: compact ? 0.032 : 0.026,
    damping: compact ? 0.865 : 0.88,
    size: compact ? 1.15 : 1.35
  };
}

function sampleLine(
  sampleContext: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  centerY: number,
  gap: number
) {
  sampleContext.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
  sampleContext.textAlign = 'center';
  sampleContext.textBaseline = 'middle';
  sampleContext.fillText(text, width / 2, centerY);

  const pixels = sampleContext.getImageData(0, 0, width, height).data;
  const points: Array<{ x: number; y: number }> = [];
  for (let y = gap; y < height - gap; y += gap) {
    for (let x = gap; x < width - gap; x += gap) {
      if (pixels[(y * width + x) * 4 + 3] > 100) points.push({ x, y });
    }
  }
  return points;
}

function buildParticles() {
  if (!canvas.value || !host.value) return;

  const rect = host.value.getBoundingClientRect();
  width = Math.max(1, Math.floor(rect.width));
  height = Math.max(1, Math.floor(rect.height));
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  canvas.value.width = Math.floor(width * dpr);
  canvas.value.height = Math.floor(height * dpr);
  canvas.value.style.width = `${width}px`;
  canvas.value.style.height = `${height}px`;
  context = canvas.value.getContext('2d');
  context?.setTransform(dpr, 0, 0, dpr, 0, 0);

  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const sampleContext = offscreen.getContext('2d', { willReadFrequently: true });
  if (!sampleContext) return;

  sampleContext.fillStyle = '#fff';
  const metrics = wordmarkMetrics();
  const markSize = Math.min(width * (metrics.compact ? 0.162 : 0.148), height * 0.32);

  const points = sampleLine(sampleContext, 'AYON1XW', markSize, height / 2, metrics.sampleGap);

  particles.length = 0;
  points.forEach((point, index) => {
    const angle = index * 2.399963;
    const distance = Math.min(width, height) * 0.03;
    particles.push({
      x: point.x + Math.cos(angle) * distance,
      y: point.y + Math.sin(angle) * distance,
      tx: point.x,
      ty: point.y,
      vx: 0,
      vy: 0,
      heat: 0
    });
  });

  if (reducedMotion.matches) {
    particles.forEach(particle => {
      particle.x = particle.tx;
      particle.y = particle.ty;
    });
    draw(0);
  }
}

function draw(time: number) {
  if (!context) return;
  context.clearRect(0, 0, width, height);
  const metrics = wordmarkMetrics();

  particles.forEach((particle, index) => {
    if (!reducedMotion.matches) {
      const micro = Math.sin(time * 0.00065 + index * 0.19) * 0.22;
      const targetX = particle.tx + micro;
      const targetY = particle.ty + Math.cos(time * 0.00055 + index * 0.13) * 0.18;

      if (pointer.active) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance < metrics.radius) {
          const strength = Math.pow(1 - distance / metrics.radius, 2);
          const nx = dx / distance;
          const ny = dy / distance;
          const speed = Math.min(12, Math.hypot(pointer.vx, pointer.vy));
          particle.vx += nx * strength * metrics.force + pointer.vx * strength * 0.038;
          particle.vy += ny * strength * metrics.force + pointer.vy * strength * 0.038;
          particle.vx += -ny * strength * speed * 0.016;
          particle.vy += nx * strength * speed * 0.016;
          particle.heat = Math.max(particle.heat, strength);
        }
      }

      particle.vx += (targetX - particle.x) * metrics.spring;
      particle.vy += (targetY - particle.y) * metrics.spring;
      particle.vx *= metrics.damping;
      particle.vy *= metrics.damping;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.heat *= 0.93;
    }

    const heat = Math.min(1, particle.heat);
    const radius = metrics.size + heat * 0.8;
    context!.fillStyle = heat > 0.05
      ? `rgba(${Math.round(235 - heat * 110)}, ${Math.round(239 - heat * 65)}, 255, ${0.76 + heat * 0.24})`
      : 'rgba(242, 240, 234, 0.86)';
    context!.beginPath();
    context!.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
    context!.fill();
  });
}

function animate(time: number) {
  if (visible && !reducedMotion.matches) draw(time);
  frame = requestAnimationFrame(animate);
}

function updatePointer(event: PointerEvent) {
  if (!host.value || reducedMotion.matches) return;
  const rect = host.value.getBoundingClientRect();
  const nextX = event.clientX - rect.left;
  const nextY = event.clientY - rect.top;
  pointer.previousX = pointer.active ? pointer.x : nextX;
  pointer.previousY = pointer.active ? pointer.y : nextY;
  pointer.x = nextX;
  pointer.y = nextY;
  pointer.vx = pointer.x - pointer.previousX;
  pointer.vy = pointer.y - pointer.previousY;
  pointer.active = true;
}

function leavePointer() {
  pointer.active = false;
  pointer.vx = 0;
  pointer.vy = 0;
}

function handleMotionPreference() {
  cancelAnimationFrame(frame);
  buildParticles();
  frame = requestAnimationFrame(animate);
}

onMounted(async () => {
  await document.fonts.ready;
  buildParticles();
  resizeObserver = new ResizeObserver(buildParticles);
  if (host.value) resizeObserver.observe(host.value);

  visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting);
  }, { threshold: 0.02 });
  if (host.value) visibilityObserver.observe(host.value);

  reducedMotion.addEventListener('change', handleMotionPreference);
  frame = requestAnimationFrame(animate);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  resizeObserver?.disconnect();
  visibilityObserver?.disconnect();
  reducedMotion.removeEventListener('change', handleMotionPreference);
});
</script>

<template>
  <div
    ref="host"
    class="particle-wordmark"
    @pointermove="updatePointer"
    @pointerdown="updatePointer"
    @pointerleave="leavePointer"
    @pointercancel="leavePointer"
  >
    <canvas ref="canvas" aria-hidden="true">AYON1XW</canvas>
  </div>
</template>
