import { Compass, LogOut, Map, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface NavbarProps { onGetStarted: () => void; }

const Navbar = ({ onGetStarted }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/75 backdrop-blur-xl border-b border-border/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-ocean flex items-center justify-center group-hover:shadow-glow transition-shadow">
            <Compass className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight">Wanderly</span>
        </button>
        <div className="flex items-center gap-1">
          {user ? (
            <>
              <button onClick={() => navigate("/saved-trips")} className="h-9 px-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
                <Map className="w-4 h-4" /><span className="hidden sm:inline">My Trips</span>
              </button>
              <button onClick={() => navigate("/profile")} className="h-9 px-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
                <User className="w-4 h-4" /><span className="hidden sm:inline">Profile</span>
              </button>
              <button onClick={onGetStarted} className="h-9 px-4 ml-1 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Plan a Trip
              </button>
              <button onClick={() => signOut()} className="h-9 w-9 ml-1 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/auth")} className="h-9 px-4 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">Sign In</button>
              <button onClick={onGetStarted} className="h-9 px-4 ml-1 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Plan a Trip
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
