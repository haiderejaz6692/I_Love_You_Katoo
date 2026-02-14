import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface KatooSplashProps {
  visible: boolean;
}

const KatooSplash = ({ visible }: KatooSplashProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    if (visible) setSeed((prev) => prev + 1);
  }, [visible]);

  const burstCount = prefersReducedMotion ? 6 : 18;
  const heartOutline = useMemo(() => {
    const points: Array<{ x: number; y: number }> = [];
    const steps = 48;
    for (let i = 0; i < steps; i += 1) {
      const t = (i / steps) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      points.push({ x, y: -y });
    }
    return points;
  }, []);
  const burstItems = useMemo(
    () =>
      Array.from({ length: burstCount }, (_, i) => {
        const point = heartOutline[Math.floor(Math.random() * heartOutline.length)];
        const scale = prefersReducedMotion ? 6.2 : 7.4;
        const startX = point.x * scale;
        const startY = point.y * scale;
        const expansion = prefersReducedMotion ? 1.2 : 1.35 + Math.random() * 0.25;
        return {
          id: `${seed}-${i}`,
          startX,
          startY,
          endX: startX * expansion,
          endY: startY * expansion,
          rotate: Math.random() * 180,
          scale: 0.8 + Math.random() * 0.6,
          delay: Math.random() * (prefersReducedMotion ? 0.6 : 1),
        };
      }),
    [burstCount, heartOutline, prefersReducedMotion, seed]
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-rose-soft/70 pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.4 }}
          role="presentation"
          aria-hidden
        >
          <div className="absolute inset-0 backdrop-blur-md" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {burstItems.map((heart, index) => (
              <motion.span
                key={heart.id}
                className="absolute text-2xl"
                initial={{ opacity: 0, scale: 0, x: heart.startX, y: heart.startY }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, heart.scale, 0.8],
                  x: heart.endX,
                  y: heart.endY,
                  rotate: heart.rotate,
                }}
                transition={{
                  duration: prefersReducedMotion ? 1 : 1.6,
                  delay: heart.delay + index * 0.02,
                  repeat: Infinity,
                  repeatDelay: prefersReducedMotion ? 0.8 : 0.5,
                }}
              >
                💖
              </motion.span>
            ))}
          </div>
          <motion.div
            className="relative flex flex-col items-center gap-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
          >
            <div className="relative flex flex-col items-center">
              <img
                src="/katoo_studio_dev_logo.png"
                alt="Katoo Studio"
                className="h-56 w-56 md:h-72 md:w-72 heartbeat drop-shadow-[0_8px_24px_rgba(193,18,31,0.35)]"
              />
              
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KatooSplash;
