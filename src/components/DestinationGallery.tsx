import { motion } from "framer-motion";
import SmartImage from "./SmartImage";

interface Props { destination: string; baseKeyword?: string; }

const VARIANTS = [
  "landscape", "street architecture", "food cuisine",
  "sunset scenic", "people culture", "hidden gem",
  "market colorful", "nature trail", "skyline night",
];

const DestinationGallery = ({ destination, baseKeyword }: Props) => {
  const base = baseKeyword || destination;
  return (
    <section className="py-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent font-medium mb-1">Visual inspiration</p>
            <h3 className="font-heading text-2xl md:text-3xl font-semibold">A glimpse of {destination}</h3>
          </div>
          <p className="hidden md:block text-xs text-muted-foreground">Scroll → for more</p>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-3 -mx-6 px-6">
          {VARIANTS.map((v, i) => (
            <motion.div
              key={v}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className={`relative shrink-0 snap-start shadow-soft border border-border bg-muted rounded-2xl overflow-hidden ${
                i % 3 === 0 ? "w-[260px] h-[340px]" : i % 3 === 1 ? "w-[220px] h-[290px]" : "w-[280px] h-[220px]"
              }`}
            >
              <SmartImage
                query={`${destination} ${v}`}
                alt={`${destination} ${v}`}
                rounded=""
                className="w-full h-full"
                imgClassName="hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationGallery;
