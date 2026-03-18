import { Compass } from "lucide-react";

interface NavbarProps {
  onGetStarted: () => void;
}

const Navbar = ({ onGetStarted }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-primary" />
          <span className="font-heading text-xl font-bold text-foreground">Wanderly</span>
        </div>
        <button
          onClick={onGetStarted}
          className="h-9 px-4 rounded-lg text-sm font-body font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Plan a Trip
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
