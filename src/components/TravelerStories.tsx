import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

const STORIES = [
  {
    name: "Priya Sharma",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
    destination: "Manali, Himachal Pradesh",
    mood: "Healing",
    quote: "I went to Manali after a really rough year. Wanderly built me an itinerary that started every day slowly — sunrise tea on the balcony, no rushing. By day three I cried at the mountains, and it wasn't sadness. I'd never felt so held by a place before.",
    rating: 5,
    image: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Arjun & Meera",
    avatar: "https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=100",
    destination: "Goa, India",
    mood: "Romantic",
    quote: "Our 5th anniversary trip was everything. Wanderly found us a tiny beach shack for breakfast, a hidden cliff at sunset, and a seafood spot lit by lanterns. My partner said it felt like the trip actually understood us. We've already planned our next one.",
    rating: 5,
    image: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Rafi Mohammed",
    avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100",
    destination: "Kyoto, Japan",
    mood: "Soulful",
    quote: "I'm a solo traveler who gets overwhelmed by tourist crowds. Wanderly routed me through the backstreets of Fushimi Inari at 5:30am, completely alone with the foxes and the torii gates. That silence changed something in me permanently.",
    rating: 5,
    image: "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "The Kapoor Family",
    avatar: "https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=100",
    destination: "Rajasthan, India",
    mood: "Cultural Dive",
    quote: "Traveling with 3 kids and grandparents is chaos. But Wanderly balanced everyone — fort walks for the history buffs, camel rides for the kids, an Ayurvedic massage for grandma, and a rooftop dinner for us parents. No one compromised. Everyone was happy.",
    rating: 5,
    image: "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Zoe Chen",
    avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100",
    destination: "Bali, Indonesia",
    mood: "Nature Detox",
    quote: "I asked for a digital detox trip. Wanderly gave me rice terrace walks at dawn, a cooking class with a local family, and days with no wifi. I came back and deleted 3 apps permanently. Best ROI I've ever gotten from a vacation.",
    rating: 5,
    image: "https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const MOOD_COLORS: Record<string, string> = {
  "Healing": "hsl(140, 30%, 48%)",
  "Romantic": "hsl(355, 65%, 55%)",
  "Soulful": "hsl(30, 45%, 50%)",
  "Cultural Dive": "hsl(28, 55%, 48%)",
  "Nature Detox": "hsl(130, 35%, 42%)",
};

const TravelerStories = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = () => {
    setDirection(1);
    setActive((p) => (p + 1) % STORIES.length);
  };

  const prev = () => {
    setDirection(-1);
    setActive((p) => (p - 1 + STORIES.length) % STORIES.length);
  };

  const story = STORIES[active];
  const moodColor = MOOD_COLORS[story.mood] || "hsl(22, 80%, 55%)";

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.97 }),
  };

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "hsl(var(--secondary))" }}>
      <div className="absolute inset-0 bg-gradient-glow opacity-40 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-3 py-1 rounded-full bg-accent/12 text-accent text-xs font-medium tracking-wide uppercase mb-4"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            Real moments
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Travel stories that stayed
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
            The moments travelers remember long after they're home.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image side */}
          <div className="relative h-[420px] rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active + "-img"}
                custom={direction}
                variants={{
                  enter: (d) => ({ opacity: 0, scale: 1.08 }),
                  center: { opacity: 1, scale: 1 },
                  exit: (d) => ({ opacity: 0, scale: 0.96 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={story.image}
                  alt={story.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span
                    className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                    style={{ background: `${moodColor}cc`, fontFamily: "var(--font-ui)" }}
                  >
                    {story.mood} trip
                  </span>
                  <p className="text-white font-semibold mt-1.5" style={{ fontFamily: "var(--font-heading)" }}>
                    {story.destination}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Story side */}
          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active + "-story"}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="space-y-6"
              >
                <Quote className="w-10 h-10 opacity-20 text-foreground" />

                <blockquote
                  className="text-lg leading-relaxed text-foreground/85"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  "{story.quote}"
                </blockquote>

                <div className="flex items-center gap-3">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-border"
                  />
                  <div>
                    <p className="font-semibold text-foreground text-sm" style={{ fontFamily: "var(--font-ui)" }}>
                      {story.name}
                    </p>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: story.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: moodColor }} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {STORIES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                    className={`transition-all rounded-full ${
                      i === active ? "w-6 h-2 bg-accent" : "w-2 h-2 bg-border hover:bg-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelerStories;
