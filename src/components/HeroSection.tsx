import { motion, useReducedMotion } from 'framer-motion';
import KatooLogoShowcase from './KatooLogoShowcase';

const HeroSection = () => {
  const prefersReducedMotion = useReducedMotion();

  const scrollToId = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Vignette effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, hsl(351, 78%, 92%, 0.3) 70%, hsl(351, 60%, 85%, 0.6) 100%)',
          }}
        />
        
        {/* Decorative circles */}
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-rose-soft/20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-rose-glow/20 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Valentine's Week Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="glass px-6 py-2 rounded-full flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Valentine Special</span>
          <span className="w-1 h-1 rounded-full bg-rose-deep" />
          <span className="text-sm font-semibold text-rose-deep">Valentine's Day • Feb 14</span>
          <span className="animate-pulse">🌹</span>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        {/* Text Content */}
        <motion.div 
          className="text-center lg:text-left max-w-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="text-6xl">🌹</span>
          </motion.div>
          
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-romantic">Happy Valentine's Day,</span>
            <br />
            <span className="text-foreground">my schöne Katze</span>
          </h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-8 italic font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            "For my Katze, every petal 🌹 is a promise"
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            <button
              type="button"
              onClick={() => scrollToId('valentine-question')}
              className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium shadow-rose hover:shadow-glow transition-all duration-300 overflow-hidden hover:-translate-y-0.5 active:translate-y-0"
              data-interactive
            >
              <span className="relative z-10">Ask Katto</span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-deep to-rose-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <button
              type="button"
              onClick={() => scrollToId('rose-garden')}
              className="px-8 py-4 border-2 border-rose-soft text-rose-deep rounded-full font-medium hover:bg-rose-soft/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              data-interactive
            >
              Explore Garden
            </button>
          </motion.div>
        </motion.div>

        {/* Katoo Logo Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, type: "spring" }}
          className="w-full max-w-md lg:max-w-lg aspect-square"
        >
          <KatooLogoShowcase />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
