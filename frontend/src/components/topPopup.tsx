import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopPopup({
  text = "✨ Done!",
  type = "success", // success, error, warning, info
  duration = 2000,
  show,
  onClose,
}:any) {
  const [visible, setVisible] = useState(false);

  // Colors based on type
  const colors:any = {
    success: "bg-gradient-to-r from-green-500 to-emerald-500 border-l-4 border-green-300",
    error: "bg-gradient-to-r from-red-500 to-rose-500 border-l-4 border-red-300",
    warning: "bg-gradient-to-r from-orange-500 to-amber-500 border-l-4 border-amber-300",
    info: "bg-gradient-to-r from-blue-500 to-indigo-500 border-l-4 border-blue-300"
  };

  // Icons based on type
  const icons:any = {
    success: "🎉",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️"
  };

  useEffect(() => {
    if (show) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.5 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            duration: 0.4
          }}
          className={`
            fixed top-6 left-1/2 z-50 
            -translate-x-1/2
            px-5 py-3 rounded-xl 
            text-white text-sm font-medium
            shadow-2xl shadow-black/25
            flex items-center gap-3
            backdrop-blur-sm backdrop-filter
            ${colors[type]}
          `}
        >
          {/* Icon with bounce animation */}
          <motion.span
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1
            }}
            className="text-lg"
          >
            {icons[type]}
          </motion.span>

          {/* Text */}
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.span>

          {/* Progress bar */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{
              duration: duration / 1000,
              ease: "linear"
            }}
            className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}