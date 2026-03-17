import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <motion.p 
            className="text-primary font-mono mb-4 tracking-widest uppercase text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            student & frontend developer
          </motion.p>
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-none mb-6">
            CRAFTING <br />
            <span className="bg-primary text-background px-2">DIGITAL</span> <br />
            EXPERIENCES
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mb-8 leading-relaxed">
            I'm a passionate student and frontend developer creating modern, responsive web applications. yet im still leanring how to programm.          </p>
          
          <div className="flex gap-4">
            <Button size="lg" className="rounded-none bg-primary text-background hover:bg-white font-bold text-lg px-8 h-14">
              View Work
            </Button>
            <Button variant="outline" size="lg" className="rounded-none border-border hover:border-primary hover:text-primary h-14 px-8 group">
              Contact Me <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
}
