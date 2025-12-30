import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ReturnVisitorMessage() {
  const [isReturning, setIsReturning] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if visitor has been here before
    const lastVisit = localStorage.getItem("vaultLastVisit");
    
    if (lastVisit) {
      // They're returning - show the message after a delay
      setIsReturning(true);
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    } else {
      // First visit - set the timestamp
      localStorage.setItem("vaultLastVisit", new Date().toISOString());
    }
  }, []);

  return (
    <AnimatePresence>
      {isReturning && show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="relative return-visitor-message">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-lg" />
            <p className="relative font-mono text-sm text-primary/70 tracking-[0.2em] whitespace-nowrap px-6 py-3 border border-primary/30 rounded-sm backdrop-blur-sm">
              You've been here before.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
