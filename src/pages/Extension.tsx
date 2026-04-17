import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ConnectExtension from "@/components/ConnectExtension";
import TopNav from "@/components/TopNav";

const setMeta = (name: string, content: string) => {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
};

const Extension = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Connect Chrome Extension – Send Smart";
    setMeta(
      "description",
      "Pair the Send Smart Chrome extension with your account using a one-time code. Manage connected devices.",
    );
    return () => {
      document.title = prevTitle;
    };
  }, []);

  const steps = [
    {
      n: 1,
      title: "Install the extension",
      body: "Download and load the Send Smart Chrome extension in your browser.",
    },
    {
      n: 2,
      title: "Generate a pairing code",
      body: "Click the button below to create a one-time code that's valid for 10 minutes.",
    },
    {
      n: 3,
      title: "Paste it in the extension",
      body: "Open the extension popup and enter the code to link this account.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="container mx-auto max-w-4xl px-6 py-10 space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Chrome Extension
          </h1>
          <p className="text-muted-foreground">
            Connect the Send Smart extension to your account.
          </p>
        </header>

        <section aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="mb-4 text-lg font-semibold text-foreground">
            How it works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((s) => (
              <Card key={s.n}>
                <CardHeader className="pb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-foreground">
                    {s.n}
                  </div>
                  <CardTitle className="text-base pt-2">{s.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{s.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="pair">
          <h2 id="pair" className="mb-4 text-lg font-semibold text-foreground">
            Pair your extension
          </h2>
          <ConnectExtension />
        </section>

        <section aria-labelledby="download">
          <h2 id="download" className="mb-4 text-lg font-semibold text-foreground">
            Download the extension
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Send Smart for Chrome</CardTitle>
              <CardDescription>
                Get the latest build, then load it as an unpacked extension in Chrome.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Replace with the real release URL once the .zip is hosted. */}
              <Button asChild variant="outline">
                <a href="#" target="_blank" rel="noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download (coming soon)
                </a>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Extension;
