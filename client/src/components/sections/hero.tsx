import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24 relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-24 left-10 w-56 h-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-12 right-8 w-64 h-64 rounded-full bg-accent/22 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-5xl"
        >
          <motion.p 
            className="inline-flex items-center gap-2 mb-7 uppercase tracking-[0.14em] text-xs font-semibold bg-white/80 border border-border rounded-full px-4 py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Frontend Developer · Student · Building From Germany
          </motion.p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display leading-[0.92] mb-8 uppercase">
            I Build Web Experiences <br />
            That Feel <span className="text-primary">Fast</span>, <span className="text-accent">Clear</span>, and <span className="text-primary">Memorable</span>
          </h1>
          <p className="text-base md:text-xl max-w-3xl mb-10 leading-relaxed text-muted-foreground">
            I turn ideas into polished interfaces using React, TypeScript, and modern design systems.
            From portfolio sites to product UI, I focus on clarity, interaction quality, and real-world performance.
          </p>
          
          <div className="flex flex-wrap gap-4 items-center">
            <Button size="lg" className="uppercase tracking-[0.14em] text-xs" asChild>
              <a href="#projects">View Projects</a>
            </Button>
            <Button variant="outline" size="lg" className="uppercase tracking-[0.14em] text-xs group" asChild>
              <a href="#contact">
                Book Collaboration <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Scroll</span>
        <div className="w-px h-12 bg-border" />
      </motion.div>
    </section>
  );
}
