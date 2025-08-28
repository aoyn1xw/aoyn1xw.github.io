import { motion } from 'motion/react';
import { Code2, Coffee, Music, Camera, Heart, Loader2 } from 'lucide-react';
import { useGitHubLanguages, useGitHubUser } from '../hooks/useGitHub';

export function About() {
  const { languages, loading: languagesLoading } = useGitHubLanguages();
  const { user, loading: userLoading } = useGitHubUser();
  
  const fallbackTechnologies = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 
    'Node.js', 'Python', 'PostgreSQL', 'Git', 'Docker', 'AWS'
  ];

  const interests = [
    { icon: Code2, label: 'Clean Code' },
    { icon: Coffee, label: 'Coffee' },
    { icon: Music, label: 'Music' },
    { icon: Camera, label: 'Photography' },
  ];

  const displayTechnologies = languages.length > 0 ? languages.map(lang => lang.name) : fallbackTechnologies;

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-muted/30 to-muted/10">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* Section header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-mono text-sm"
            >
              <Heart className="w-4 h-4" />
              About me
            </motion.div>
            <h2 className="font-display text-4xl md:text-5xl text-center">
              Building with{' '}
              <span className="gradient-text">passion</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-muted-foreground">
                  {user?.bio || "I'm a software developer with a genuine passion for creating digital experiences that matter. What started as curiosity about \"how websites work\" has evolved into a deep love for"}{' '}
                  <span className="text-foreground font-medium">crafting clean, efficient code</span> and{' '}
                  <span className="text-foreground font-medium">solving complex problems</span>.
                </p>
                
                <p className="text-muted-foreground">
                  I believe great software is born from the intersection of technical excellence and human empathy. 
                  Whether I'm building user interfaces, architecting backend systems, or debugging tricky issues, 
                  I approach each challenge with <span className="text-foreground font-medium">curiosity</span> and{' '}
                  <span className="text-foreground font-medium">attention to detail</span>.
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-xl p-6 space-y-4"
                >
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="text-2xl">💭</span>
                    Current Focus
                  </h4>
                  <p className="text-muted-foreground text-base">
                    I'm particularly excited about full-stack development with React and Node.js, 
                    exploring new frontend frameworks, and contributing to open-source projects that 
                    make developers' lives easier.
                  </p>
                </motion.div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">When I'm not coding</h4>
                <div className="flex flex-wrap gap-3">
                  {interests.map((interest, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg text-sm border border-border/50"
                    >
                      <interest.icon className="w-4 h-4 text-primary" />
                      <span>{interest.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Technologies */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  {languagesLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading my GitHub languages...
                    </>
                  ) : (
                    "Technologies I love working with"
                  )}
                </h3>
                <p className="text-muted-foreground">
                  {languages.length > 0 
                    ? "Based on my recent GitHub activity:" 
                    : "I enjoy learning new tools and technologies, but here are some of my current favorites:"
                  }
                </p>
              </div>

              {languagesLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="h-12 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {displayTechnologies.slice(0, 10).map((tech, index) => {
                    const languageData = languages.find(lang => lang.name === tech);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        viewport={{ once: true }}
                        className="group relative gradient-border"
                      >
                        <div className="p-3 text-center hover:bg-primary/5 transition-all duration-300 rounded-lg">
                          <div className="space-y-1">
                            <span className="font-mono text-sm font-medium group-hover:text-primary transition-colors block">
                              {tech}
                            </span>
                            {languageData && (
                              <div className="text-xs text-muted-foreground">
                                {languageData.percentage}% of repos
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-xl p-6 border border-primary/20"
              >
                <h4 className="font-semibold mb-2 text-primary">Always Learning</h4>
                <p className="text-sm text-muted-foreground">
                  Technology evolves fast, and I love keeping up! Currently exploring Rust, 
                  diving deeper into system design, and experimenting with AI/ML integrations.
                </p>
                {user && (
                  <p className="text-xs text-muted-foreground mt-2">
                    GitHub member since {new Date(user.created_at).getFullYear()}
                  </p>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}