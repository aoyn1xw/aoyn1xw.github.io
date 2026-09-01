const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealElements = Array.from(document.querySelectorAll('.reveal'));
const scenes = Array.from(document.querySelectorAll('[data-scene]'));
const sceneNumber = document.querySelector('[data-scene-number]');
const sceneLabel = document.querySelector('[data-scene-label]');
const progressBar = document.querySelector('[data-scroll-progress]');

let scrollFrame = 0;

function setScene(scene) {
    if (!scene || !sceneNumber || !sceneLabel) {
        return;
    }

    sceneNumber.textContent = scene.dataset.scene || '01';
    sceneLabel.textContent = scene.dataset.sceneLabelValue || 'INTAKE';
}

function updateScrollState() {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const progress = available > 0 ? Math.min(1, window.scrollY / available) : 0;

    if (progressBar) {
        progressBar.style.transform = `scaleX(${progress})`;
    }

    const viewportAnchor = window.innerHeight * 0.48;
    let activeScene = scenes[0];

    scenes.forEach((scene) => {
        if (scene.getBoundingClientRect().top <= viewportAnchor) {
            activeScene = scene;
        }
    });

    setScene(activeScene);
    scrollFrame = 0;
}

function onScroll() {
    if (scrollFrame) {
        return;
    }

    scrollFrame = window.requestAnimationFrame(updateScrollState);
}

function initReveals() {
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
        revealElements.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08
    });

    revealElements.forEach((element) => observer.observe(element));
}

initReveals();
updateScrollState();
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
