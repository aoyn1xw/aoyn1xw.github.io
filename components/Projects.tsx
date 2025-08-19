import { motion } from 'motion/react';
import { ExternalLink, Github, Star, Calendar, GitFork, Loader2 } from 'lucide-react';
import { useGitHubRepositories } from '../hooks/useGitHub';

export function Projects() {
  const { repositories, loading } = useGitHubRepositories();

  // Fallback projects if GitHub API fails
  const fallbackProjects = [
    {
      name: "Portfolio Website",
      description: "A clean, responsive portfolio built with React and Tailwind CSS featuring smooth animations and dark mode support.",
      language: "TypeScript",
      stargazers_count: 0,
      forks_count: 0,
      html_url: "https://github.com/aoyn1xw/aoyn1xw.github.io",
      homepage: "https://ayon1xw.me",
      updated_at: "2025-01-01T00:00:00Z",
      topics: ["react", "typescript", "tailwind", "portfolio"]
    }
  ];

  const displayProjects = repositories.length > 0 ? repositories : fallbackProjects;
  const featuredProjects = displayProjects.slice(0, 2);
  const otherProjects = displayProjects.slice(2, 8);

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'HTML': '#e34c26',
      'CSS': '#1572B6',
      'Vue': '#4FC08D',
      'React': '#61dafb',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'C++': '#f34b7d',
      'C': '#555555',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'Dart': '#00B4AB',
      'Shell': '#89e051',
    };
    return colors[language] || '#6b7280';
  };

  if (loading) {
    return (
      <section id="projects" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-mono text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading repositories...
            </div>
            <h2 className="font-display text-4xl md:text-5xl">
              Projects I'm <span className="gradient-text">proud of</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-48 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-mono text-sm"
          >
            <Star className="w-4 h-4" />
            {repositories.length > 0 ? 'Live from GitHub' : 'Featured work'}
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl">
            Projects I'm <span className="gradient-text">proud of</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {repositories.length > 0 
              ? 'Here are some of my recent repositories and projects from GitHub.'
              : 'A collection of projects that showcase my skills and passion for creating meaningful digital experiences.'
            }
          </p>
        </motion.div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="space-y-16 mb-20">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.name || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
              >
                {/* Project Info */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md font-mono text-xs">
                        <Calendar className="w-3 h-3" />
                        {formatDate(project.updated_at)}
                      </span>
                      {project.language && (
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-white"
                          style={{ backgroundColor: getLanguageColor(project.language) }}
                        >
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                          ></div>
                          {project.language}
                        </span>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {project.stargazers_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" />
                          {project.forks_count}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="font-display text-2xl md:text-3xl">{project.name}</h3>
                    
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {project.description || 'A project that showcases modern web development practices and clean code architecture.'}
                    </p>
                  </div>
                  
                  {project.topics && project.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.topics.slice(0, 6).map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="font-mono text-xs px-3 py-1 bg-muted text-muted-foreground rounded-full border border-border"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4">
                    {project.homepage && (
                      <motion.a
                        href={project.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Live
                      </motion.a>
                    )}
                    <motion.a
                      href={project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-border text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="w-4 h-4" />
                      Source Code
                    </motion.a>
                  </div>
                </div>

                {/* Project Visual */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <motion.div 
                    className="aspect-video bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl border border-border/50 flex items-center justify-center group overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center space-y-2 opacity-50 group-hover:opacity-70 transition-opacity">
                      <div className="w-16 h-16 bg-primary/20 rounded-xl mx-auto flex items-center justify-center">
                        <span className="font-display text-2xl font-bold text-primary">
                          {project.name.split(/[-_\s]/).map(word => word[0]?.toUpperCase()).join('').slice(0, 2)}
                        </span>
                      </div>
                      <p className="font-mono text-sm text-muted-foreground">Repository Preview</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="font-display text-2xl text-center">Other Repositories</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={project.name || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">{project.name}</h4>
                          <span className="text-xs text-muted-foreground font-mono">{formatDate(project.updated_at)}</span>
                          {project.language && (
                            <div className="flex items-center gap-1 text-xs">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: getLanguageColor(project.language) }}
                              ></div>
                              <span className="text-muted-foreground">{project.language}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {project.description || 'A repository showcasing modern development practices.'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {project.stargazers_count}
                          </div>
                          <div className="flex items-center gap-1">
                            <GitFork className="w-3 h-3" />
                            {project.forks_count}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {project.homepage && (
                          <a
                            href={project.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <a
                          href={project.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    
                    {project.topics && project.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.topics.slice(0, 4).map((topic, topicIndex) => (
                          <span
                            key={topicIndex}
                            className="font-mono text-xs px-2 py-1 bg-muted/50 text-muted-foreground rounded border border-border/50"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a
            href="https://github.com/aoyn1xw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 font-medium group"
          >
            <span>Explore more on GitHub</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}