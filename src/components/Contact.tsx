import { motion } from 'motion/react';
import { Mail, Github, Instagram, MessageCircle, Send, Coffee } from 'lucide-react';

export function Contact() {
  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@ayon1xw.me",
      href: "mailto:hello@ayon1xw.me",
      description: "Best for project inquiries and professional opportunities",
      primary: true
    },
    {
      icon: Github,
      label: "GitHub",
      value: "aoyn1xw",
      href: "https://github.com/aoyn1xw",
      description: "Check out my code and open-source contributions",
      primary: false
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "ayon1xw",
      href: "https://instagram.com/ayon1xw",
      description: "Follow my journey and behind-the-scenes content",
      primary: false
    }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-primary/5 to-blue-500/5">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* Header */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-mono text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Let's chat
            </motion.div>
            
            <div className="space-y-4">
              <h2 className="font-display text-4xl md:text-5xl">
                Ready to <span className="gradient-text">collaborate?</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
                I'm always excited to discuss new projects, creative ideas, or opportunities to 
                contribute to something meaningful. Whether you're looking for a developer or 
                just want to say hello, I'd love to hear from you!
              </p>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="grid gap-6">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                  method.primary 
                    ? 'bg-gradient-to-r from-primary to-blue-600 border-primary text-primary-foreground shadow-lg hover:shadow-xl' 
                    : 'bg-card border-border hover:border-primary/50 hover:bg-card/80'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative p-6 flex items-center gap-6">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    method.primary 
                      ? 'bg-white/20' 
                      : 'bg-primary/10 group-hover:bg-primary/20 transition-colors'
                  }`}>
                    <method.icon className={`w-6 h-6 ${
                      method.primary 
                        ? 'text-white' 
                        : 'text-primary'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`font-semibold text-lg ${
                        method.primary 
                          ? 'text-white' 
                          : 'text-foreground group-hover:text-primary transition-colors'
                      }`}>
                        {method.label}
                      </h3>
                      {method.primary && (
                        <span className="inline-flex items-center gap-1 bg-white/20 text-white px-2 py-1 rounded-md text-xs font-medium">
                          <Send className="w-3 h-3" />
                          Preferred
                        </span>
                      )}
                    </div>
                    <p className={`font-medium mb-2 ${
                      method.primary 
                        ? 'text-white/90' 
                        : 'text-foreground'
                    }`}>
                      {method.value}
                    </p>
                    <p className={`text-sm ${
                      method.primary 
                        ? 'text-white/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {method.description}
                    </p>
                  </div>

                  <div className={`flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity ${
                    method.primary ? 'text-white' : 'text-muted-foreground group-hover:text-primary'
                  }`}>
                    <Send className="w-5 h-5" />
                  </div>
                </div>

                {/* Hover effect overlay */}
                {!method.primary && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </motion.a>
            ))}
          </div>

          {/* Fun addition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 bg-muted/50 px-6 py-4 rounded-xl border border-border">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Coffee className="w-4 h-4" />
                <span className="font-mono text-sm">
                  Response time: Usually within 24 hours ⚡
                </span>
              </div>
            </div>
          </motion.div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <p className="text-muted-foreground">
              Looking for something specific? Feel free to reach out with any questions, 
              project ideas, or just to say hello. I believe the best projects start with great conversations.
            </p>
            <p className="font-medium text-primary">
              Let's build something amazing together! 🚀
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}