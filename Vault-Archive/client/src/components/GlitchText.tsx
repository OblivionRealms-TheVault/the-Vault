import { motion } from "framer-motion";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <motion.span
        className="absolute top-0 left-0 -z-10 opacity-70 text-red-600"
        animate={{
          x: [-2, 2, -1, 0],
          y: [1, -1, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 0.4,
          repeatType: "mirror",
          repeatDelay: 5,
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 -z-10 opacity-70 text-cyan-600"
        animate={{
          x: [2, -2, 1, 0],
          y: [-1, 1, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 0.5,
          repeatType: "mirror",
          repeatDelay: 3,
        }}
      >
        {text}
      </motion.span>
      <span className="relative z-10">{text}</span>
    </div>
  );
}
