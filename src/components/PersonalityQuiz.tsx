import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Moon, Sun, Coffee, Camera, Users, Wallet, Compass, Cloud, Volume2, Shuffle } from "lucide-react";

export interface PersonalityProfile {
  sleepType: "early-bird" | "night-owl" | "flexible";
  foodStyle: "street-local" | "cafe-brunch" | "fine-dining" | "mix";
  planningStyle: "ultra-planned" | "loose-plan" | "spontaneous";
  socialBattery: "solo-recharge" | "small-group" | "loves-crowds";
  photographyInterest: "none" | "casual" | "enthusiast" | "obsessed";
  spendingStyle: "budget-hacker" | "value-seeker" | "splurge-worthy" | "luxury-only";
  travelPace: "slow-immersive" | "moderate" | "whirlwind";
  weatherPref: "cold-crisp" | "warm-sunny" | "tropical-humid" | "any";
  crowdTolerance: "hate-crowds" | "tolerates" | "loves-energy";
  structureVsSpontaneous: "structured" | "balanced" | "go-with-flow";
}

interface QuizQuestion {
  id: keyof PersonalityProfile;
  icon: React.ReactNode;
  question: string;
  subtitle?: string;
  options: { value: string; label: string; desc?: string; emoji: string }[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: "sleepType",
    icon: <Moon className="w-5 h-5" />,
    question: "When do you come alive?",
    subtitle: "This shapes your entire daily itinerary rhythm",
    options: [
      { value: "early-bird", label: "Early bird", desc: "Up at 6am, golden hour lover", emoji: "🌅" },
      { value: "night-owl", label: "Night owl", desc: "The best stories happen after midnight", emoji: "🦉" },
      { value: "flexible", label: "Flexible", desc: "I adapt — just give me coffee", emoji: "☕" },
    ],
  },
  {
    id: "foodStyle",
    icon: <Coffee className="w-5 h-5" />,
    question: "Food is part of the trip. Your style?",
    subtitle: "Your answer shapes every restaurant recommendation",
    options: [
      { value: "street-local", label: "Street & local", desc: "Plastic chairs, best food in town", emoji: "🥘" },
      { value: "cafe-brunch", label: "Cafe culture", desc: "Aesthetics, oat lattes, journaling", emoji: "🥐" },
      { value: "fine-dining", label: "Fine dining", desc: "One special meal that costs 3x my budget", emoji: "🍷" },
      { value: "mix", label: "A mix of everything", desc: "Chaotic eater, proud of it", emoji: "🍜" },
    ],
  },
  {
    id: "planningStyle",
    icon: <Compass className="w-5 h-5" />,
    question: "How do you like your days structured?",
    options: [
      { value: "ultra-planned", label: "Planned to the hour", desc: "Every slot filled, backups ready", emoji: "📋" },
      { value: "loose-plan", label: "Loose framework", desc: "Morning plan, afternoons free", emoji: "🗺️" },
      { value: "spontaneous", label: "Pure spontaneity", desc: "Book hotel on arrival, figure it out", emoji: "🎲" },
    ],
  },
  {
    id: "socialBattery",
    icon: <Users className="w-5 h-5" />,
    question: "What drains and fills your energy?",
    subtitle: "Critical for group-size and activity selection",
    options: [
      { value: "solo-recharge", label: "Solo recharger", desc: "Too much people-time = exhausted", emoji: "🔋" },
      { value: "small-group", label: "Small group joy", desc: "A few deep conversations > loud parties", emoji: "🫂" },
      { value: "loves-crowds", label: "Crowd energizer", desc: "Festivals, bars, human energy = life", emoji: "🎉" },
    ],
  },
  {
    id: "photographyInterest",
    icon: <Camera className="w-5 h-5" />,
    question: "What's your relationship with your camera?",
    options: [
      { value: "none", label: "Just the memories", desc: "Phone stays in pocket, eyes stay open", emoji: "👁️" },
      { value: "casual", label: "Casual snapper", desc: "A few good shots, nothing obsessive", emoji: "📸" },
      { value: "enthusiast", label: "Golden hour chaser", desc: "Up early for the shot, stay late for the light", emoji: "🌇" },
      { value: "obsessed", label: "Content creator mode", desc: "Every meal is staged, reels planned ahead", emoji: "🎬" },
    ],
  },
  {
    id: "spendingStyle",
    icon: <Wallet className="w-5 h-5" />,
    question: "How does money flow on trips?",
    options: [
      { value: "budget-hacker", label: "Budget hacker", desc: "Hostels, locals spots, zero tourist traps", emoji: "🎯" },
      { value: "value-seeker", label: "Value seeker", desc: "Spend where it counts, save the rest", emoji: "⚖️" },
      { value: "splurge-worthy", label: "Selective splurger", desc: "One fancy thing per day is fine", emoji: "✨" },
      { value: "luxury-only", label: "Comfort first", desc: "Bad sleep ruins everything, always upgrade", emoji: "🛋️" },
    ],
  },
  {
    id: "travelPace",
    icon: <Compass className="w-5 h-5" />,
    question: "What's your ideal travel speed?",
    options: [
      { value: "slow-immersive", label: "Slow & immersive", desc: "Same cafe twice, learn neighbourhood names", emoji: "🐢" },
      { value: "moderate", label: "Moderate explorer", desc: "Enough depth, enough breadth", emoji: "🚶" },
      { value: "whirlwind", label: "Whirlwind tour", desc: "Maximum places, minimum rest", emoji: "🌪️" },
    ],
  },
  {
    id: "weatherPref",
    icon: <Cloud className="w-5 h-5" />,
    question: "Your weather personality?",
    subtitle: "We'll factor this into destination warnings",
    options: [
      { value: "cold-crisp", label: "Cold & crisp", desc: "Sweaters, mist, mountain air", emoji: "🌨️" },
      { value: "warm-sunny", label: "Warm & sunny", desc: "Vitamin D or nothing", emoji: "☀️" },
      { value: "tropical-humid", label: "Tropical vibes", desc: "Sweat is just the body crying happy tears", emoji: "🌴" },
      { value: "any", label: "Unbothered", desc: "Waterproof jacket, anywhere", emoji: "🧥" },
    ],
  },
  {
    id: "crowdTolerance",
    icon: <Volume2 className="w-5 h-5" />,
    question: "Crowds and tourist spots — your honest feeling?",
    options: [
      { value: "hate-crowds", label: "Avoid at all costs", desc: "Hidden alleys, off-peak timing, please", emoji: "🤫" },
      { value: "tolerates", label: "Tolerates if worth it", desc: "Will queue for the Eiffel Tower once", emoji: "😅" },
      { value: "loves-energy", label: "Loves the energy", desc: "Busy markets, street performers, yes please", emoji: "🥳" },
    ],
  },
  {
    id: "structureVsSpontaneous",
    icon: <Shuffle className="w-5 h-5" />,
    question: "Deep down — are you this traveler?",
    subtitle: "No judgment. This is the most honest question.",
    options: [
      { value: "structured", label: "The Planner", desc: "Spreadsheet, confirmations, backup options", emoji: "📊" },
      { value: "balanced", label: "The Flexitarian", desc: "Some anchors, some space to breathe", emoji: "🌊" },
      { value: "go-with-flow", label: "The Wanderer", desc: "No itinerary is the itinerary", emoji: "🍃" },
    ],
  },
];

interface PersonalityQuizProps {
  onComplete: (profile: PersonalityProfile) => void;
  onSkip: () => void;
}

const TRAVEL_ARCHETYPES: Record<string, { name: string; desc: string; emoji: string }> = {
  "early-bird-street-local-spontaneous": { name: "The Soul Traveler", desc: "You go where the road takes you, eating where locals eat", emoji: "🌿" },
  "night-owl-fine-dining-ultra-planned": { name: "The Luxury Nomad", desc: "Every detail curated, every experience elevated", emoji: "💎" },
  "flexible-mix-loose-plan": { name: "The Balanced Explorer", desc: "Present in every moment, adaptable to any adventure", emoji: "⚖️" },
};

function deriveArchetype(profile: Partial<PersonalityProfile>): { name: string; desc: string; emoji: string } {
  if (profile.spendingStyle === "luxury-only") return { name: "The Luxury Nomad", desc: "Comfort-first, curated experiences, nothing but the best", emoji: "💎" };
  if (profile.planningStyle === "spontaneous" && profile.socialBattery === "solo-recharge") return { name: "The Soul Wanderer", desc: "Introspective journeys, hidden gems, authentic connections", emoji: "🌿" };
  if (profile.photographyInterest === "obsessed" && profile.travelPace === "whirlwind") return { name: "The Content Creator", desc: "Every destination is a story, every moment is a reel", emoji: "🎬" };
  if (profile.foodStyle === "street-local" && profile.crowdTolerance === "loves-energy") return { name: "The Cultural Immersionist", desc: "Markets, festivals, midnight street food — you live it all", emoji: "🥘" };
  if (profile.travelPace === "slow-immersive" && profile.socialBattery === "solo-recharge") return { name: "The Slow Traveler", desc: "Depth over breadth, neighborhoods over landmarks", emoji: "🐢" };
  if (profile.planningStyle === "ultra-planned" && profile.spendingStyle === "budget-hacker") return { name: "The Smart Explorer", desc: "Maximum experiences, minimum waste — you've cracked the code", emoji: "🎯" };
  return { name: "The Curious Wanderer", desc: "Open, adaptable, endlessly curious about what's around the corner", emoji: "🧭" };
}

const PersonalityQuiz = ({ onComplete, onSkip }: PersonalityQuizProps) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<PersonalityProfile>>({});
  const [showResult, setShowResult] = useState(false);
  const [direction, setDirection] = useState(1);

  const question = QUESTIONS[step];
  const progress = ((step) / QUESTIONS.length) * 100;

  const handleAnswer = (value: string) => {
    const updated = { ...answers, [question.id]: value as any };
    setAnswers(updated);
    if (step < QUESTIONS.length - 1) {
      setDirection(1);
      setTimeout(() => setStep(step + 1), 200);
    } else {
      setShowResult(true);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    onComplete(answers as PersonalityProfile);
  };

  const archetype = deriveArchetype(answers);

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 text-center py-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
          className="text-6xl mb-4"
        >
          {archetype.emoji}
        </motion.div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2" style={{ fontFamily: "var(--font-ui)" }}>You are</p>
          <h3 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>{archetype.name}</h3>
          <p className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">{archetype.desc}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto mt-4">
          {Object.entries(answers).slice(0, 4).map(([key, val]) => {
            const q = QUESTIONS.find(q => q.id === key);
            const opt = q?.options.find(o => o.value === val);
            if (!opt) return null;
            return (
              <div key={key} className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary text-left">
                <span className="text-lg">{opt.emoji}</span>
                <span className="text-xs text-foreground font-medium">{opt.label}</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleFinish}
          className="w-full h-12 rounded-2xl bg-gradient-warm text-primary-foreground font-medium text-base btn-glow mt-2"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          Build my itinerary
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground" style={{ fontFamily: "var(--font-ui)" }}>
            <span className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-accent">
              {question.icon}
            </span>
            <span>{step + 1} of {QUESTIONS.length}</span>
          </div>
          <button onClick={onSkip} className="text-xs text-muted-foreground hover:text-foreground transition-colors" style={{ fontFamily: "var(--font-ui)" }}>
            Skip quiz
          </button>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-warm"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="space-y-4"
        >
          <div>
            <h3 className="text-xl font-semibold text-foreground leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
              {question.question}
            </h3>
            {question.subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{question.subtitle}</p>
            )}
          </div>

          <div className="space-y-2">
            {question.options.map((opt) => {
              const isSelected = answers[question.id] === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all border-2 ${
                    isSelected
                      ? "bg-accent/10 border-accent mood-active"
                      : "bg-card border-border hover:border-accent/40 hover:bg-secondary/50"
                  }`}
                >
                  <span className="text-2xl shrink-0">{opt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground" style={{ fontFamily: "var(--font-ui)" }}>{opt.label}</p>
                    {opt.desc && <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>}
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
      )}
    </div>
  );
};

export default PersonalityQuiz;
