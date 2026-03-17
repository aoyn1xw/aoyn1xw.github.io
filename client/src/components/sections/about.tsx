import { motion } from "framer-motion";

const skills = [
  "HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "React", "Next.js", "Node.js",
  "Tailwind CSS", "Framer Motion", "PostgreSQL","AWS", "Docker", "Git", "Swift", "UI/UX Design"
];

export default function About() {
  return (
    <section id="about" className="py-32 bg-secondary/10 border-y border-border">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-display font-bold mb-8 leading-none"
          >
            BEYOND <br />
            <span className="bg-primary text-background px-2">THE CODE</span>
          </motion.h2>
        </div>

        <div>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed font-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            I’m a student who got into programming by trying to make things I wanted exist. 
Sometimes that’s a website, sometimes a small tool, sometimes just breaking something until I understand it.
          </motion.p>
          
          <motion.p 
            className="text-lg text-muted-foreground mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            I like practical projects, clean solutions, and interfaces that feel nice to use instead of just technically correct. 
            I’m still learning, which honestly just means I build a lot and Google a lot..
          </motion.p>

          <div>
            <h3 className="text-lg font-mono uppercase tracking-widest text-primary mb-6">Technologies</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 bg-background border border-border hover:border-primary hover:text-primary transition-colors cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
