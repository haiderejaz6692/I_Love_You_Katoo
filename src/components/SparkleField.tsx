import { motion, useReducedMotion } from "framer-motion";

interface SparkleFieldProps {
  density?: "soft" | "rich";
  className?: string;
}

const SparkleField = ({ density = "soft", className = "" }: SparkleFieldProps) => {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  const opacity = density === "rich" ? 0.45 : 0.28;
  const backgroundSize = density === "rich" ? "160px 160px, 240px 240px" : "220px 220px, 320px 320px";

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[2] mix-blend-screen ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(255, 239, 247, 0.9) 0px, rgba(255, 239, 247, 0.3) 2px, transparent 4px), radial-gradient(circle at 80% 30%, rgba(255, 216, 230, 0.9) 0px, rgba(255, 216, 230, 0.35) 2px, transparent 4px)",
        backgroundSize,
        backgroundPosition: "0% 0%, 0% 0%",
        filter: "blur(0.2px)",
        opacity,
      }}
      animate={{
        backgroundPosition: ["0% 0%, 0% 0%", "120% 120%, -60% -60%"],
      }}
      transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
    />
  );
};

export default SparkleField;
