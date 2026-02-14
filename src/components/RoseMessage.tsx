import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const RoseMessage = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = "This rose carries every soft secret I saved for you, Katto";
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(351, 78%, 94%) 0%, hsl(36, 100%, 97%) 100%)',
          }}
        />
        
        {/* Decorative roses */}
        <motion.div
          className="absolute top-10 left-10 text-6xl opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          🌹
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-10 text-6xl opacity-20"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          🌹
        </motion.div>
      </div>

      <div className="relative container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-20 bg-gradient-to-r from-transparent to-rose-soft" />
            <motion.span 
              className="text-3xl heartbeat"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              💕
            </motion.span>
            <span className="h-px w-20 bg-gradient-to-l from-transparent to-rose-soft" />
          </div>

          {/* Typewriter text */}
          <div className="relative">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-rose-deep leading-relaxed">
              <span className="italic">"</span>
              {displayText}
              <motion.span
                className="inline-block w-0.5 h-8 md:h-10 bg-rose-deep ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <span className="italic">"</span>
            </h2>
            
            {/* Rose emoji that appears after text */}
            <motion.span
              className="inline-block text-4xl ml-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={displayText === fullText ? { opacity: 1, scale: 1 } : {}}
              transition={{ type: "spring", delay: 0.3 }}
            >
              🌹
            </motion.span>
          </div>

          {/* Hearts decoration */}
          <motion.div
            className="mt-12 flex justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {['❤️', '🌹', '💕', '🌹', '❤️'].map((emoji, i) => (
              <motion.span
                key={i}
                className="text-2xl"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>

          {/* Pulse glow background */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              background: 'radial-gradient(circle, hsl(351, 100%, 75%, 0.3) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default RoseMessage;
