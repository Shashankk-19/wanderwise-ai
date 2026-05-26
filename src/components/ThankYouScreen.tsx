import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Heart, Star } from "lucide-react";

interface ThankYouScreenProps {
  destination: string;
  onClose: () => void;
}

const TRAVEL_QUOTES = [
  { quote: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { quote: "Travel is the only thing you buy that makes you richer.", author: "Unknown" },
  { quote: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
  { quote: "To travel is to live.", author: "Hans Christian Andersen" },
  { quote: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
];

const PEXELS_TRAVEL_IMAGES = [
  "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1802255/pexels-photo-1802255.jpeg?auto=compress&cs=tinysrgb&w=800",
];

const ThankYouScreen = ({ destination, onClose }: ThankYouScreenProps) => {
  const [visible, setVisible] = useState(true);
  const quote = TRAVEL_QUOTES[Math.floor(Math.random() * TRAVEL_QUOTES.length)];
  const image = PEXELS_TRAVEL_IMAGES[Math.floor(Math.random() * PEXELS_TRAVEL_IMAGES.length)];

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 700);
    }, 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  const letters = "Thank you".split("");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          onClick={() => { setVisible(false); setTimeout(onClose, 600); }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src={image}
              alt="Travel"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/75" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-8 max-w-2xl mx-auto">
            {/* Animated compass */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
              className="w-16 h-16 rounded-2xl bg-gradient-warm mx-auto mb-8 flex items-center justify-center shadow-warm"
            >
              <Compass className="w-8 h-8 text-white" />
            </motion.div>

            {/* Letter-by-letter animation */}
            <div className="flex justify-center gap-0 mb-2 overflow-hidden">
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.5 + i * 0.06,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-5xl md:text-7xl font-bold text-white"
                  style={{ fontFamily: "var(--font-heading)", letterSpacing: letter === " " ? "0.3em" : "-0.02em" }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
              className="text-xl text-white/85 mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              for using Wanderly
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.7 }}
              className="space-y-2"
            >
              <p
                className="text-2xl text-white font-semibold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {destination} awaits you.
              </p>

              <div className="flex items-center justify-center gap-1 mt-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2 + i * 0.1 }}
                  >
                    <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.blockquote
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 0.8 }}
              className="mt-8 border-l-2 border-white/40 pl-4 text-left"
            >
              <p className="text-white/80 italic text-base leading-relaxed" style={{ fontFamily: "var(--font-heading)" }}>
                "{quote.quote}"
              </p>
              <p className="text-white/50 text-sm mt-1" style={{ fontFamily: "var(--font-ui)" }}>
                — {quote.author}
              </p>
            </motion.blockquote>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5 }}
              className="text-white/40 text-xs mt-8"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              Tap anywhere to continue
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThankYouScreen;
