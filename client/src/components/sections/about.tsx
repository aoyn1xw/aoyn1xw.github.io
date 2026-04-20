import { motion } from "framer-motion";

const skills = [
  "HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "React", "Next.js", "Node.js",
  "Tailwind CSS", "Framer Motion", "PostgreSQL", "AWS", "Docker", "Git", "Swift", "UI Systems"
];

export default function About() {
  return (
    <section id="about" className="py-28 md:py-32 bg-secondary/22 border-b border-border">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display mb-6 leading-[0.95] uppercase"
          >
            About <br />
            <span className="text-primary">How I Work</span>
          </motion.h2>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold">
            UI clarity · Product thinking · Continuous iteration
          </p>
        </div>

        <div>
          <motion.p 
            className="text-lg md:text-2xl text-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            I build frontend experiences that balance visual quality with engineering reliability.
            Every screen is treated as both design and product logic.
          </motion.p>
          
          <motion.p 
            className="text-base md:text-lg text-muted-foreground mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            As a student developer, I learn in public through real projects: shipping quickly, measuring results,
            and refining interaction details until the product feels intentional.
          </motion.p>

          <div>
            <h3 className="text-xs uppercase tracking-[0.14em] text-primary mb-6">Core Toolkit</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 bg-white/80 border border-border rounded-full hover:border-primary hover:text-primary transition-colors cursor-default text-sm"
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
