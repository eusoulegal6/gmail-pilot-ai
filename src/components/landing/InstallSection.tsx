import { Download, FolderOpen, Chrome, ToggleRight, Upload, KeyRound, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExtensionDownload } from "@/hooks/use-extension-download";

const steps = [
  {
    icon: Download,
    title: "Download the extension",
    description: "Download the Send Smart extension archive from the link provided.",
  },
  {
    icon: FolderOpen,
    title: "Extract the archive",
    description: "Extract the downloaded archive to a folder on your computer. You'll need the extracted folder for the next step.",
  },
  {
    icon: Chrome,
    title: "Open chrome://extensions",
    description: "In Chrome (or any Chromium browser like Edge, Brave, or Arc), type chrome://extensions in the address bar.",
  },
  {
    icon: ToggleRight,
    title: "Enable Developer Mode",
    description: "Toggle the Developer mode switch in the top-right corner of the extensions page.",
  },
  {
    icon: Upload,
    title: 'Click "Load unpacked"',
    description: "Click the Load unpacked button that appears, then select the folder you extracted in step 2.",
  },
  {
    icon: KeyRound,
    title: "Pair with your account",
    description: "Sign in to your Send Smart dashboard, generate a pairing code, and paste it into the extension popup to link it to your account.",
  },
  {
    icon: CheckCircle,
    title: "You're ready",
    description: "Send Smart will now appear in your Chrome toolbar. Open Gmail and the extension will start working with your unread emails.",
  },
];

const InstallSection = () => {
  const { handleDownload } = useExtensionDownload();
  return (
    <section id="install" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Install in under two minutes
          </h2>
          <p className="text-muted-foreground text-lg">
            Send Smart is currently distributed as a manually loaded Chrome extension. Here's how to set it up.
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <step.icon size={18} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">Step {i + 1}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button variant="hero" size="lg" onClick={handleDownload} className="gap-2">
            <Download size={18} />
            Download Send Smart
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Works with Chrome, Edge, Brave, Arc, and other Chromium-based browsers.
        </p>
      </div>
    </section>
  );
};

export default InstallSection;
