import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I install an unpacked extension?",
    a: "Download the extension archive, extract it to a folder, then go to chrome://extensions, enable Developer Mode, and click 'Load unpacked'. Select the extracted folder.",
  },
  {
    q: "How do I update the extension?",
    a: "Download the latest version, extract it to the same folder (replacing old files), then go to chrome://extensions and click the refresh icon on the Send Smart card.",
  },
  {
    q: "Chrome says the extension is blocked or disabled",
    a: "This can happen with unpacked extensions. Go to chrome://extensions, make sure Developer Mode is enabled, and re-load the unpacked extension. You may need to remove and re-add it.",
  },
  {
    q: "Where is the dist folder?",
    a: "After extracting the downloaded archive, the dist folder is the top-level folder you extracted. Point Chrome's 'Load unpacked' dialog to this folder.",
  },
  {
    q: "What's the difference between Review Mode and Auto-Send?",
    a: "In Review Mode, the AI drafts replies and shows them to you for approval before sending. In Auto-Send Mode, replies are sent automatically without manual review.",
  },
  {
    q: "Does it work with browsers other than Chrome?",
    a: "Yes! Send Smart works with any Chromium-based browser including Edge, Brave, Arc, and Opera. Use the same installation steps.",
  },
  {
    q: "How does the unread email detection work?",
    a: "Send Smart uses a dedicated Gmail view that shows only unread emails. This ensures the AI only processes new, unread messages and won't accidentally reply to conversations you've already handled.",
  },
];

const HelpSection = () => {
  return (
    <Card id="help">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <HelpCircle size={18} className="text-primary" />
          Help & Troubleshooting
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default HelpSection;
