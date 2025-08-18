import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  direction = "up", 
  duration = 0.5 
}: FadeInProps) {
  const directionValues = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0,
        ...directionValues[direction]
      }}
      animate={{ 
        opacity: 1,
        y: 0,
        x: 0
      }}
      transition={{
        delay,
        duration
      }}
    >
      {children}
    </motion.div>
  );
}