import { Toast, ToastProps } from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";

export function AnimatedToast(props: ToastProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      >
        <Toast {...props} />
      </motion.div>
    </AnimatePresence>
  );
}