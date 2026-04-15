import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const links = [
    { label: "How it works", href: "#how-it-works" },
    { label: "Modes", href: "#modes" },
    { label: "Benefits", href: "#benefits" },
    { label: "Install", href: "#install" },
    { label: "Pricing", href: "#pricing" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <a href="/" className="text-xl font-bold tracking-tight">
          <span className="text-gradient">Send Smart</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <User size={14} />
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut size={16} className="mr-1" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button variant="hero" size="sm" asChild>
                <a href="#install">Get the Extension</a>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl px-6 pb-6 pt-4 animate-fade-in">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => { navigate("/auth"); setMobileOpen(false); }}>
                  Sign In
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <a href="#install" onClick={() => setMobileOpen(false)}>
                    Get the Extension
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
