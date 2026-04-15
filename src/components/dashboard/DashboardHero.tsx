import { Button } from "@/components/ui/button";
import { Download, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useExtensionDownload } from "@/hooks/use-extension-download";

const DashboardHero = () => {
  const { user } = useAuth();
  const { handleDownload } = useExtensionDownload();
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardHero;
