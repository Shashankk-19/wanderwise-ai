import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass } from "lucide-react";

const IntroAnimation = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem("wanderly_intro_shown");
  });

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      sessionStorage.setItem("wanderly_intro_shown", "1");
      setShow(false);
    }, 2600);
    return () => clearTimeout(t);
  }, [show]);

  const word = "Wanderly".split("");

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary"
        >
          <div className="absolute inset-0 bg-gradient-glow opacity-60" />

          {/* Animated route line */}
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 1000 600">
            <motion.path
              d="M 50 450 Q 250 200 500 300 T 950 150"
              stroke="hsl(var(--accent))"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>

          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="w-20 h-20 rounded-2xl bg-gradient-sunset flex items-center justify-center shadow-glow"
            >
              <Compass className="w-10 h-10 text-primary-foreground" />
            </motion.div>

            <div className="flex overflow-hidden">
              {word.map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="font-heading text-5xl md:text-7xl font-bold text-primary-foreground tracking-tight"
                >
                  {c}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="font-body text-primary-foreground/70 text-sm tracking-[0.3em] uppercase"
            >
              Travel, intelligently
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
