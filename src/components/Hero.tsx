import { motion } from 'motion/react';
import { Github, Instagram, Mail, ArrowDown, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useGitHubUser } from '../hooks/useGitHub';

export function Hero() {
  const { user, loading } = useGitHubUser();

  return (
    <section id="hero" className="min-h-screen pt-16 md:pt-20 flex items-center justify-center relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 w-full pt-8 md:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-4 md:space-y-6 text-center w-full flex flex-col items-center"
        >
          {/* Profile Picture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center items-center w-full"
          >
            <div className="relative inline-flex justify-center items-center">
              {loading ? (
                <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-muted animate-pulse mx-auto" />
              ) : (
                <motion.img
                  src={user?.avatar_url}
                  alt="aoyn1xw profile"
                  className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-primary/20 shadow-lg mx-auto block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <div className="absolute bottom-0 right-0 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full border-2 border-background animate-pulse translate-x-1 translate-y-1"></div>
            </div>
          </motion.div>

          {/* Greeting with sparkle */}
          <motion.div 
            className="flex items-center justify-center gap-2 text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-mono text-sm tracking-wide">Hello, world!</span>
            <Sparkles className="w-4 h-4" />
          </motion.div>

          <div className="space-y-6 w-full flex flex-col items-center">
            <motion.h1 
              className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-none text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              I'm{' '}
              <span className="gradient-text inline-block">
                {user?.name || 'aoyn1xw'}
              </span>
            </motion.h1>
            
            <motion.div
              className="space-y-2 sm:space-y-3 w-full flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance text-center">
                {user?.bio || 'A software developer who loves crafting beautiful, functional, and meaningful digital experiences'}
              </p>
              
              <motion.p 
                className="font-mono text-xs sm:text-sm text-primary bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full inline-block mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Currently open for new opportunities
              </motion.p>

              {user?.location && (
                <motion.p 
                  className="font-mono text-xs sm:text-sm text-muted-foreground text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  📍 {user.location}
                </motion.p>
              )}
            </motion.div>
          </div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center w-full mt-0 sm:mt-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Button 
              size="default" 
              className="font-medium text-sm sm:text-base bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View my work
            </Button>
            <Button 
              variant="outline" 
              size="default" 
              className="font-medium text-sm sm:text-base border-2 hover:bg-primary/5 transition-all duration-300"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Let's connect
            </Button>
          </motion.div>

          <motion.div 
            className="flex justify-center items-center space-x-4 sm:space-x-6 pt-2 sm:pt-4 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {[
              { icon: Github, href: user?.html_url || "https://github.com/aoyn1xw", label: "GitHub" },
              { icon: Instagram, href: "https://instagram.com/ayon1xw", label: "Instagram" },
              { icon: Mail, href: "mailto:hello@ayon1xw.me", label: "Email" }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="p-2 sm:p-3 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label={social.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
            ))}
          </motion.div>

          {/* GitHub Stats */}
          {user && (
            <motion.div
              className="flex justify-center items-center space-x-5 sm:space-x-8 pt-2 sm:pt-4 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <div className="text-center">
                <div className="font-semibold text-base sm:text-lg">{user.public_repos}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Repositories</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-base sm:text-lg">{user.followers}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-base sm:text-lg">{user.following}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Following</div>
              </div>
            </motion.div>
          )}

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-muted-foreground"
            >
              <ArrowDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-blue-500/3 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}