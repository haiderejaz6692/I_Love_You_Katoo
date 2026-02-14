import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative py-16 px-4 overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(36, 100%, 97%) 0%, hsl(351, 78%, 92%) 100%)',
        }}
      />
      
      <div className="relative container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Rose decoration */}
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className="text-3xl"
                animate={{ y: [0, -8, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              >
                🌹
              </motion.span>
            ))}
          </div>
          
          <h3 className="font-serif text-3xl text-rose-deep mb-4">
            Happy Valentine's Day, Katto
          </h3>
          
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            A little corner of the internet for my Katze. Soft roses, warm light, and all my love.
          </p>
          
          {/* Social share hint */}
          <div className="flex justify-center gap-4 mb-8">
            <button 
              className="p-3 rounded-full bg-rose-soft/50 hover:bg-rose-soft transition-colors group"
              data-interactive
            >
              <svg className="w-5 h-5 text-rose-deep group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </button>
            <button 
              className="p-3 rounded-full bg-rose-soft/50 hover:bg-rose-soft transition-colors group"
              data-interactive
            >
              <svg className="w-5 h-5 text-rose-deep group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </button>
            <button 
              className="p-3 rounded-full bg-rose-soft/50 hover:bg-rose-soft transition-colors group"
              data-interactive
            >
              <svg className="w-5 h-5 text-rose-deep group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" fill="none" stroke="hsl(36, 100%, 97%)" strokeWidth="2" />
              </svg>
            </button>
          </div>
          
          {/* Valentine's week */}
          <div className="max-w-md mx-auto mb-10 rounded-2xl p-[1px] bg-gradient-to-br from-rose-soft/70 via-white/40 to-rose-glow/60 shadow-rose/60">
            <div className="glass rounded-2xl p-6">
              <h4 className="font-serif text-lg text-foreground mb-3">Valentine Special for Katto</h4>
              <p className="text-sm text-muted-foreground">
                Schönes Katze, you make every day feel like a celebration.
              </p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Made with 💕 and 🐾 • Valentine's Day 2026
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
