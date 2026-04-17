import { Button } from "@/components/ui/button";
import { Download, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useExtensionDownload } from "@/hooks/use-extension-download";

const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { handleDownload } = useExtensionDownload();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <a href="/dashboard" className="text-xl font-bold tracking-tight">
          <span className="text-gradient">Send Smart</span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          <a href="/dashboard" className="text-sm text-foreground transition-colors">Dashboard</a>
          <a href="/extension" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Extension</a>
          <a href="#setup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Setup</a>
          <a href="#settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Settings</a>
          <a href="#usage" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Usage</a>
          <a href="#help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help</a>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[180px]">
            {user?.email}
          </span>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5">
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardHeader;
