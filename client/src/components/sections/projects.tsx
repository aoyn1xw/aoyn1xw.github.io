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
  const { data: repos, isLoading } = useQuery<Repo[]>({
    queryKey: ["github-repos"],
    queryFn: async () => {
      const response = await fetch("https://api.github.com/users/aoyn1xw/repos?sort=updated&per_page=6");
      if (!response.ok) throw new Error("Failed to fetch repos");
      return response.json();
    },
  });

  return (
    <section id="projects" className="py-32 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-display font-bold mb-6"
          >
            GITHUB <span className="text-primary">PROJECTS</span>
          </motion.h2>
          <div className="h-1 w-24 bg-primary" />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {repos?.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden border-none bg-secondary/20 rounded-none hover:bg-secondary/40 transition-colors duration-500 h-full">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <span className="text-primary text-xs font-mono uppercase tracking-wider">
                          {project.language || "Project"}
                        </span>
                        <h3 className="text-2xl font-display font-bold mt-1 group-hover:text-primary transition-colors line-clamp-1">
                          {project.name.replace(/-/g, ' ')}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        {project.homepage && (
                          <Button size="icon" variant="outline" className="rounded-full bg-background/10 backdrop-blur-md border-white/20 text-white hover:bg-primary hover:text-black hover:border-primary" asChild>
                            <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <Button size="icon" variant="outline" className="rounded-full bg-background/10 backdrop-blur-md border-white/20 text-white hover:bg-primary hover:text-black hover:border-primary" asChild>
                          <a href={project.html_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6 line-clamp-3 flex-grow">
                      {project.description || "No description provided for this repository."}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.topics?.slice(0, 4).map((topic) => (
                        <span key={topic} className="px-3 py-1 bg-background/50 border border-border text-[10px] uppercase tracking-wider rounded-none text-muted-foreground">
                          {topic}
                        </span>
                      ))}
                      {project.stargazers_count > 0 && (
                        <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-[10px] uppercase tracking-wider rounded-none text-primary">
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
