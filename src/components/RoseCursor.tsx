import { useEffect, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

interface Position {
  x: number;
  y: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
}

interface PetalBurst {
  id: number;
  x: number;
  y: number;
}

const RoseCursor = () => {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 520, damping: 30, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 520, damping: 30, mass: 0.6 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [petalBursts, setPetalBursts] = useState<PetalBurst[]>([]);
  const rotation = useMotionValue(0);
  const rotateSpring = useSpring(rotation, { stiffness: 120, damping: 18 });
  const lastPosition = useRef<Position>({ x: 0, y: 0 });
  const sparkleId = useRef(0);
  const burstId = useRef(0);
  const lastSparkleTime = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    x.set(e.clientX);
    y.set(e.clientY);
    
    // Calculate rotation based on movement direction
    const dx = e.clientX - lastPosition.current.x;
    const dy = e.clientY - lastPosition.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    
    if (speed > 2) {
      rotation.set(rotation.get() + speed * 0.5);
      
      // Add sparkle trail
      const now = performance.now();
      if (!prefersReducedMotion && now - lastSparkleTime.current > 80) {
        lastSparkleTime.current = now;
        const newSparkle: Sparkle = {
          id: sparkleId.current++,
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
        };
        setSparkles(prev => [...prev.slice(-8), newSparkle]);
        
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
        }, 600);
      }
    }
    
    lastPosition.current = { x: e.clientX, y: e.clientY };
  }, [prefersReducedMotion, rotation, x, y]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsClicking(true);
    
    // Create petal burst
    if (!prefersReducedMotion) {
      const burst: PetalBurst = {
        id: burstId.current++,
        x: e.clientX,
        y: e.clientY,
      };
      setPetalBursts(prev => [...prev, burst]);
      
      setTimeout(() => {
        setPetalBursts(prev => prev.filter(b => b.id !== burst.id));
      }, 800);
    }
  }, [prefersReducedMotion]);

  const handleMouseUp = useCallback(() => {
    setIsClicking(false);
  }, []);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const updateEnabled = () => setEnabled(!coarsePointer.matches);
    updateEnabled();
    coarsePointer.addEventListener("change", updateEnabled);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, [role="button"], input, textarea, select, [data-interactive]');
      setIsHovering(!!isInteractive);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      coarsePointer.removeEventListener("change", updateEnabled);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp]);

  if (!enabled) return null;

  return (
    <>
      {/* Sparkle Trail */}
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed pointer-events-none z-[9998]"
            style={{ left: sparkle.x, top: sparkle.y }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" className="translate-x-[-6px] translate-y-[-6px]">
              <circle cx="6" cy="6" r="3" fill="url(#sparkleGradient)" />
              <defs>
                <radialGradient id="sparkleGradient">
                  <stop offset="0%" stopColor="hsl(351, 100%, 86%)" />
                  <stop offset="100%" stopColor="hsl(355, 85%, 41%)" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Petal Burst on Click */}
      <AnimatePresence>
        {petalBursts.map(burst => (
          <div key={burst.id} className="fixed pointer-events-none z-[9997]" style={{ left: burst.x, top: burst.y }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0.5],
                  x: Math.cos((i * Math.PI * 2) / 8) * 60,
                  y: Math.sin((i * Math.PI * 2) / 8) * 60,
                  rotate: 360,
                  opacity: 0,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute"
                style={{ transformOrigin: 'center' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" className="translate-x-[-8px] translate-y-[-8px]">
                  <ellipse
                    cx="8"
                    cy="8"
                    rx="6"
                    ry="4"
                    fill={`hsl(${351 + i * 5}, ${80 + i * 2}%, ${60 + i * 3}%)`}
                    transform={`rotate(${i * 45} 8 8)`}
                  />
                </svg>
              </motion.div>
            ))}
          </div>
        ))}
      </AnimatePresence>

      {/* Main Cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.25 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      >
        {/* Rose Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            opacity: isHovering ? 0.8 : 0.4,
            scale: isHovering ? 1.5 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{
            width: 50,
            height: 50,
            marginLeft: -25,
            marginTop: -25,
            background: 'radial-gradient(circle, hsl(351, 100%, 75%, 0.5) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />

        {/* Rose SVG Cursor */}
        <motion.svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          style={{ rotate: rotateSpring }}
          className="translate-x-[-16px] translate-y-[-16px]"
        >
          {/* Center */}
          <circle cx="16" cy="16" r="3" fill="hsl(355, 85%, 35%)" />
          
          {/* Inner Petals */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse
              key={`inner-${i}`}
              cx="16"
              cy="11"
              rx="4"
              ry="6"
              fill={`hsl(355, 85%, ${45 + i * 3}%)`}
              transform={`rotate(${angle} 16 16)`}
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
            />
          ))}
          
          {/* Outer Petals */}
          {[36, 108, 180, 252, 324].map((angle, i) => (
            <ellipse
              key={`outer-${i}`}
              cx="16"
              cy="7"
              rx="5"
              ry="8"
              fill={`hsl(351, 100%, ${70 + i * 2}%)`}
              transform={`rotate(${angle} 16 16)`}
              opacity={0.9}
            />
          ))}
          
          {/* Highlight */}
          <circle cx="14" cy="14" r="1.5" fill="hsl(351, 100%, 90%)" opacity={0.6} />
        </motion.svg>
      </motion.div>
    </>
  );
};

export default RoseCursor;
