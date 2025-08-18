import { ButtonHTMLAttributes, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <motion.div
        whileTap={{ scale: 0.95 }}
      >
        <Button
          ref={ref}
          className={cn(className)}
          variant={variant}
          size={size}
          {...props}
        />
      </motion.div>
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";