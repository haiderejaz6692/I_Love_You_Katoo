import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

type FlowerDrop = {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
  emoji: string;
};

type Sparkle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
};

const FLOWER_EMOJIS = ["🌸", "🌺", "🌷", "🌼"];

const KatooLogoShowcase = () => {
  const prefersReducedMotion = useReducedMotion();

  const flowers = useMemo<FlowerDrop[]>(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 18 + Math.random() * 18,
        delay: Math.random() * 3,
        duration: 4.6 + Math.random() * 2.2,
        rotate: (Math.random() - 0.5) * 40,
        emoji: FLOWER_EMOJIS[i % FLOWER_EMOJIS.length],
      })),
    []
  );

  const sparkles = useMemo<Sparkle[]>(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 6 + Math.random() * 6,
        delay: Math.random() * 1.6,
      })),
    []
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-80 h-80 md:w-[26rem] md:h-[26rem] lg:w-[30rem] lg:h-[30rem]">
        <motion.div
          className="absolute inset-0 rounded-full bg-rose-glow/30 blur-3xl"
          animate={prefersReducedMotion ? { opacity: 0.6 } : { scale: [1, 1.12, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: prefersReducedMotion ? 0 : Infinity }}
        />

        <motion.img
          src="/katoo_studio_dev_logo.png"
          alt="Katoo Studio"
          className="relative z-10 w-full h-full object-contain drop-shadow-[0_22px_50px_rgba(193,18,31,0.45)]"
          animate={prefersReducedMotion ? { scale: 1 } : { scale: [1, 1.05, 1], rotate: [0, 1.5, -1, 0] }}
          transition={{ duration: 5, repeat: prefersReducedMotion ? 0 : Infinity }}
        />

        {!prefersReducedMotion && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full mix-blend-screen pointer-events-none"
              style={{
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0) 15%, rgba(255,255,255,0.65) 35%, rgba(255,255,255,0) 55%)",
              }}
              animate={{ x: ["-40%", "40%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="pointer-events-none absolute inset-0">
              {sparkles.map((sparkle) => (
                <motion.span
                  key={sparkle.id}
                  className="absolute rounded-full bg-white/80"
                  style={{
                    left: `${sparkle.x}%`,
                    top: `${sparkle.y}%`,
                    width: sparkle.size,
                    height: sparkle.size,
                    filter: "blur(0.5px)",
                  }}
                  animate={{ opacity: [0, 1, 0], scale: [0.6, 1.2, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: sparkle.delay }}
                />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
              {flowers.map((flower) => (
                <motion.span
                  key={flower.id}
                  className="absolute"
                  style={{ left: `${flower.x}%` }}
                  initial={{ y: "-20%", opacity: 0, rotate: flower.rotate }}
                  animate={{ y: "120%", opacity: [0, 1, 0.8, 0], rotate: flower.rotate + 60 }}
                  transition={{
                    duration: flower.duration,
                    delay: flower.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span style={{ fontSize: flower.size }}>{flower.emoji}</span>
                </motion.span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default KatooLogoShowcase;
