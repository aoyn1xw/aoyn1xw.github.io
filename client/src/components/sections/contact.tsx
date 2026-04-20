import { motion } from "framer-motion";
import { Github, Twitter, Link, Mail } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-28 md:py-32 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mb-14 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display mb-5 uppercase leading-[0.95]"
          >
            Let’s Build <br />
            <span className="text-primary">Your Next Interface</span>
          </motion.h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Need a frontend developer for a launch, redesign, or product sprint? I am open to freelance and collaborative remote work.
          </p>
        </div>

        <div className="max-w-4xl">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div>
              <h3 className="text-xs uppercase tracking-[0.14em] text-primary mb-6">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:ayon1xw@proton.me" className="text-lg">ayon1xw@proton.me</a>
                </li>
                <li className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                  <Github className="w-5 h-5" />
                  <a href="https://github.com/aoyn1xw" className="text-lg">github.com/aoyn1xw</a>
                </li>
                <li className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                  <a href="https://x.com/aoyn1xw" className="text-lg">x.com/aoyn1xw</a>
                </li>
                <li className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                  <Link className="w-5 h-5" />
                  <a href="https://guns.lol/ayon1xw" className="text-lg">all social links</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.14em] text-primary mb-6">Availability</h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-5">
                Based in Germany and available for remote projects worldwide.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Focus areas: React interfaces, component systems, landing pages, and frontend implementation from design files.
              </p>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-24 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs uppercase tracking-[0.12em] text-muted-foreground">
          <p>© 2026 AOYN1XW. All rights reserved.</p>
          <p>Designed and built with React + TypeScript.</p>
        </div>
      </div>
    </section>
  );
}
