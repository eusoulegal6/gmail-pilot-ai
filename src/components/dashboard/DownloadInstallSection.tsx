import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FolderOpen, Chrome, ToggleRight, Upload, KeyRound, CheckCircle } from "lucide-react";
import { useExtensionDownload } from "@/hooks/use-extension-download";

const steps = [
  { icon: Download, title: "Download the package", desc: "Click the button below to download the Send Smart extension archive." },
  { icon: FolderOpen, title: "Extract the archive", desc: "Unzip / extract the downloaded file to a folder on your computer." },
  { icon: Chrome, title: "Open chrome://extensions", desc: "Type chrome://extensions in your browser's address bar." },
  { icon: ToggleRight, title: "Enable Developer Mode", desc: "Toggle Developer mode ON in the top-right corner." },
  { icon: Upload, title: "Load unpacked", desc: "Click 'Load unpacked' and select the extracted folder." },
  { icon: KeyRound, title: "Pair the extension", desc: "Generate a pairing code in the 'Pairing code' card above and paste it into the extension popup." },
  { icon: CheckCircle, title: "You're ready", desc: "Send Smart appears in your toolbar. Open Gmail to start." },
];

const DownloadInstallSection = () => {
  const { handleDownload } = useExtensionDownload();

  return (
    <Card id="setup">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Download size={18} className="text-primary" />
          Download & Install
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button variant="hero" size="lg" onClick={handleDownload} className="w-full gap-2">
          <Download size={18} />
          Download Send Smart Extension
        </Button>

        <div className="grid sm:grid-cols-2 gap-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 rounded-lg border border-border p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 shrink-0">
                <step.icon size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Step {i + 1}</p>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Works with Chrome, Edge, Brave, Arc, and all Chromium-based browsers.
        </p>
      </CardContent>
    </Card>
  );
};

export default DownloadInstallSection;
