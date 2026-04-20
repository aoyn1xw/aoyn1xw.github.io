import { motion } from "framer-motion";
import { ExternalLink, Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  stargazers_count: number;
  language: string;
  topics: string[];
}

export default function Projects() {
  const { data: repos, isLoading, isError } = useQuery<Repo[]>({
    queryKey: ["github-repos"],
    queryFn: async () => {
      const response = await fetch("https://api.github.com/users/aoyn1xw/repos?sort=updated&per_page=6");
      if (!response.ok) throw new Error("Failed to fetch repos");
      return response.json();
    },
  });

  return (
    <section id="projects" className="py-28 md:py-32 bg-background/70 relative border-b border-border">
      <div className="container mx-auto px-6">
        <div className="mb-14 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display mb-4 uppercase leading-[0.95]"
          >
            Selected <span className="text-primary">Work</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-2xl text-base md:text-lg leading-relaxed">
            A live feed from GitHub showing recent builds, frontend experiments, and product-focused implementations.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : isError ? (
          <div className="border border-border bg-card/90 rounded-2xl p-8 md:p-10">
            <p className="text-lg text-foreground mb-2">Unable to load repositories right now.</p>
            <p className="text-muted-foreground">Please refresh in a moment or view all projects directly on GitHub.</p>
            <Button variant="outline" className="mt-6 uppercase tracking-[0.14em] text-xs" asChild>
              <a href="https://github.com/aoyn1xw" target="_blank" rel="noopener noreferrer">
                Open GitHub Profile
              </a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {repos?.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
              >
                <Card className="group overflow-hidden h-full bg-white/92 hover:border-primary transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex-1">
                        <span className="text-primary text-[10px] uppercase tracking-[0.14em] font-semibold">
                          {project.language || "Project"}
                        </span>
                        <h3 className="text-2xl font-display mt-2 group-hover:text-primary transition-colors line-clamp-1 uppercase">
                          {project.name.replace(/-/g, ' ')}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        {project.homepage && (
                          <Button size="icon" variant="outline" className="h-9 w-9" asChild>
                            <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <Button size="icon" variant="outline" className="h-9 w-9" asChild>
                          <a href={project.html_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6 line-clamp-3 flex-grow leading-relaxed">
                      {project.description || "No description provided for this repository."}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.topics?.slice(0, 4).map((topic) => (
                        <span key={topic} className="px-3 py-1 border border-border bg-secondary/35 text-[10px] uppercase tracking-[0.12em] text-muted-foreground rounded-full">
                          {topic}
                        </span>
                      ))}
                      {project.stargazers_count > 0 && (
                        <span className="px-3 py-1 border border-primary/30 bg-primary/10 text-[10px] uppercase tracking-[0.12em] text-primary rounded-full">
                          ★ {project.stargazers_count}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
