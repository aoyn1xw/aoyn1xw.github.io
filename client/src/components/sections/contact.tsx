import { motion } from "framer-motion";
import { Github, Twitter, Link, Mail } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-display font-bold mb-6"
          >
            LET'S WORK <br />
            <span className="text-primary">TOGETHER</span>
          </motion.h2>
          <p className="text-xl text-muted-foreground">
            Have a project in mind? Let's build something.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="flex flex-col justify-center space-y-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-2xl font-display font-bold mb-6">Contact Info</h3>
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
                  <a href="https://x.com/aoyn1xw" className="text-lg">twitter.com/aoyn1xw</a>
                </li>
                <li className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                  <Link className="w-5 h-5" />
                  <a href="https://guns.lol/ayon1xw" className="text-lg">all my socials</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-display font-bold mb-4">Location</h3>
              <p className="text-lg text-muted-foreground">
                Based in Germany<br />
                Available for remote work worldwide.
              </p>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-32 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2026 Portfolio. All rights reserved.</p>
          <p className="font-mono">DESIGNED & BUILT WITH ❤️</p>
        </div>
      </div>
    </section>
  );
}
