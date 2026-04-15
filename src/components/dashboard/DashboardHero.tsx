import { Button } from "@/components/ui/button";
import { Download, BookOpen, Play } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useExtensionDownload } from "@/hooks/use-extension-download";

const DashboardHero = () => {
  const { user } = useAuth();
  const { handleDownload } = useExtensionDownload();
  const [showVideo, setShowVideo] = useState(false);
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Welcome back, <span className="text-gradient">{firstName}</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Set up your extension, configure your reply settings, and start letting AI handle your Gmail inbox.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" onClick={handleDownload} className="gap-2">
              <Download size={18} />
              Download Extension
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <a href="#setup" className="gap-2">
                <BookOpen size={18} />
                Install Guide
              </a>
            </Button>
            <Button variant="hero-outline" size="lg" onClick={() => setShowVideo(true)} className="gap-2">
              <Play size={18} />
              Watch Demo
            </Button>
          </div>
        </div>

        {showVideo && (
          <div className="mt-8 max-w-3xl">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xl">
              <video
                className="w-full"
                controls
                autoPlay
                playsInline
              >
                <source src="/videos/send-smart-demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardHero;
