// Lightweight behavioral → archetype inference used to personalize itineraries.

export type Chronotype = "early-bird" | "balanced" | "night-owl";
export type FoodProfile = "street-food" | "balanced" | "fine-dining";
export type PlanningStyle = "structured" | "balanced" | "spontaneous";
export type SocialBattery = "introvert" | "ambivert" | "extrovert";
export type Interest1to5 = 1 | 2 | 3 | 4 | 5;
export type SpendingStyle = "frugal" | "balanced" | "splurge";
export type Pace = "slow" | "balanced" | "packed";
export type WeatherPref = "cool" | "mild" | "warm";
export type CrowdTolerance = "avoid" | "okay" | "loves-buzz";
export type Spontaneity = "structured" | "flexible" | "go-with-flow";

export interface BehavioralProfile {
  chronotype: Chronotype;
  foodProfile: FoodProfile;
  planningStyle: PlanningStyle;
  socialBattery: SocialBattery;
  photoInterest: Interest1to5;
  spendingStyle: SpendingStyle;
  pace: Pace;
  weatherPref: WeatherPref;
  crowdTolerance: CrowdTolerance;
  spontaneity: Spontaneity;
  /** Derived "archetype label" computed client-side for display */
  derivedArchetype: string;
}

export const DEFAULT_PROFILE: BehavioralProfile = {
  chronotype: "balanced",
  foodProfile: "balanced",
  planningStyle: "balanced",
  socialBattery: "ambivert",
  photoInterest: 3,
  spendingStyle: "balanced",
  pace: "balanced",
  weatherPref: "mild",
  crowdTolerance: "okay",
  spontaneity: "flexible",
  derivedArchetype: "Curious Wanderer",
};

/** Derive a poetic archetype from the answers — used as a chip on the itinerary */
export function deriveArchetype(p: Omit<BehavioralProfile, "derivedArchetype">): string {
  if (p.socialBattery === "extrovert" && p.chronotype === "night-owl") return "Night-Bloom Socialite";
  if (p.crowdTolerance === "avoid" && p.pace === "slow") return "Slow Soul Seeker";
  if (p.foodProfile === "street-food" && p.spontaneity === "go-with-flow") return "Hungry Wanderer";
  if (p.spendingStyle === "splurge" && p.foodProfile === "fine-dining") return "Quiet Luxury Lover";
  if (p.photoInterest >= 4 && p.pace !== "slow") return "Frame-Chasing Explorer";
  if (p.weatherPref === "cool" && p.crowdTolerance === "avoid") return "Misty Mountain Mind";
  if (p.planningStyle === "structured" && p.pace === "packed") return "Optimized Trailblazer";
  if (p.socialBattery === "introvert" && p.foodProfile === "balanced") return "Reflective Roamer";
  return "Curious Wanderer";
}

export const PROBE_QUESTIONS: Array<{
  key: keyof Omit<BehavioralProfile, "derivedArchetype" | "photoInterest">;
  question: string;
  options: { value: string; label: string; emoji: string }[];
}> = [
  {
    key: "chronotype",
    question: "When do you feel most alive on a trip?",
    options: [
      { value: "early-bird", label: "Sunrise mornings", emoji: "🌅" },
      { value: "balanced", label: "Midday flow", emoji: "☀️" },
      { value: "night-owl", label: "Late nights", emoji: "🌙" },
    ],
  },
  {
    key: "foodProfile",
    question: "Your kind of food adventure?",
    options: [
      { value: "street-food", label: "Street food crawls", emoji: "🥟" },
      { value: "balanced", label: "Mix of both", emoji: "🍜" },
      { value: "fine-dining", label: "Slow, curated meals", emoji: "🍷" },
    ],
  },
  {
    key: "planningStyle",
    question: "How do you like a day to unfold?",
    options: [
      { value: "structured", label: "Mapped, hour by hour", emoji: "🗺️" },
      { value: "balanced", label: "Loose plan, room to drift", emoji: "🧭" },
      { value: "spontaneous", label: "Wing it entirely", emoji: "🍃" },
    ],
  },
  {
    key: "socialBattery",
    question: "After a long day you recharge by…",
    options: [
      { value: "introvert", label: "A quiet room + window", emoji: "🪴" },
      { value: "ambivert", label: "A few close friends", emoji: "🫶" },
      { value: "extrovert", label: "More people, more places", emoji: "✨" },
    ],
  },
  {
    key: "spendingStyle",
    question: "When you find something special you…",
    options: [
      { value: "frugal", label: "Save smart, hunt deals", emoji: "💚" },
      { value: "balanced", label: "Splurge on a few things", emoji: "💛" },
      { value: "splurge", label: "Pay for the memory", emoji: "🤍" },
    ],
  },
  {
    key: "pace",
    question: "Your ideal travel rhythm?",
    options: [
      { value: "slow", label: "Slow mornings, one place", emoji: "🍵" },
      { value: "balanced", label: "Balanced & paced", emoji: "🌿" },
      { value: "packed", label: "See everything I can", emoji: "🏃" },
    ],
  },
  {
    key: "weatherPref",
    question: "Weather that feels like home?",
    options: [
      { value: "cool", label: "Misty & cool", emoji: "🌫️" },
      { value: "mild", label: "Mild & golden", emoji: "🍂" },
      { value: "warm", label: "Warm & tropical", emoji: "🌴" },
    ],
  },
  {
    key: "crowdTolerance",
    question: "Crowds — your honest reaction?",
    options: [
      { value: "avoid", label: "I retreat", emoji: "🌾" },
      { value: "okay", label: "Tolerable in short bursts", emoji: "🌼" },
      { value: "loves-buzz", label: "Energy! I thrive", emoji: "🎇" },
    ],
  },
  {
    key: "spontaneity",
    question: "On a free afternoon you…",
    options: [
      { value: "structured", label: "Stick to the plan", emoji: "📅" },
      { value: "flexible", label: "Bend it a little", emoji: "🧶" },
      { value: "go-with-flow", label: "Vanish into the unknown", emoji: "🌊" },
    ],
  },
];

export const TRIP_MOODS = [
  { id: "peaceful", label: "Peaceful", emoji: "🕊️" },
  { id: "healing", label: "Healing", emoji: "🌿" },
  { id: "social", label: "Social", emoji: "✨" },
  { id: "adventurous", label: "Adventurous", emoji: "🏔️" },
  { id: "luxury", label: "Luxury", emoji: "🕯️" },
  { id: "soulful", label: "Soulful", emoji: "🪷" },
  { id: "dopamine-heavy", label: "Dopamine-heavy", emoji: "🎉" },
  { id: "nature-detox", label: "Nature detox", emoji: "🌲" },
  { id: "romantic", label: "Romantic", emoji: "🥂" },
  { id: "productive-escape", label: "Productive escape", emoji: "💻" },
] as const;

export type TripMood = (typeof TRIP_MOODS)[number]["id"];
