"use client";

import { useEffect, useState } from "react";
import {
  HelpCircle,
  Keyboard,
  MessageSquareText,
  BookOpen,
  Mail,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ─── externalised open trigger ─── */
let externalOpen: ((v: boolean) => void) | null = null;

export function useHelpDialog() {
  return {
    open: () => externalOpen?.(true),
  };
}

/* ─── shortcuts ─── */
const shortcuts = [
  { keys: ["Ctrl", "K"], description: "Open command palette" },
  { keys: ["Ctrl", "B"], description: "Toggle sidebar" },
  { keys: ["Enter"], description: "Send message (chat)" },
  { keys: ["Shift", "Enter"], description: "New line (chat)" },
];

/* ─── FAQs ─── */
const faqs = [
  {
    q: "How accurate is the skin identification?",
    a: "Our AI model is trained on dermatology datasets and provides predictions for educational purposes. Always consult a dermatologist for a professional diagnosis.",
  },
  {
    q: "What image formats are supported?",
    a: "You can upload JPG, PNG, and WEBP images up to 10 MB. For best results, use clear, well-lit close-up photos.",
  },
  {
    q: "Is my data stored securely?",
    a: "All uploads are processed securely and not shared with third parties. You can delete your data at any time from Settings.",
  },
  {
    q: "Can I use the camera on desktop?",
    a: "Yes — any device with a webcam can use the camera capture feature on the Identification page.",
  },
  {
    q: "How do I analyze a medical report?",
    a: "Go to the Report page, upload a PDF or image of your medical report, and click Analyze. The AI will extract and summarize key findings.",
  },
];

/* ─── component ─── */
export function HelpDialogProvider() {
  const [open, setOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    externalOpen = setOpen;
    return () => {
      externalOpen = null;
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <HelpCircle className="size-5" />
            Help & Support
          </DialogTitle>
          <DialogDescription>
            Keyboard shortcuts, FAQs, and how to get in touch.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="px-6 pb-6 space-y-6">
            {/* ── Keyboard Shortcuts ── */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Keyboard className="size-4 text-muted-foreground" />
                Keyboard Shortcuts
              </h4>
              <div className="space-y-2">
                {shortcuts.map(({ keys, description }) => (
                  <div
                    key={description}
                    className="flex items-center justify-between rounded-lg bg-accent/40 px-3 py-2"
                  >
                    <span className="text-sm text-foreground/80">{description}</span>
                    <div className="flex items-center gap-1">
                      {keys.map((key) => (
                        <Badge
                          key={key}
                          variant="secondary"
                          className="px-2 py-0.5 text-[11px] font-mono font-medium"
                        >
                          {key}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* ── FAQ ── */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <BookOpen className="size-4 text-muted-foreground" />
                Frequently Asked Questions
              </h4>
              <div className="space-y-2">
                {faqs.map(({ q, a }, i) => (
                  <div key={i} className="rounded-lg border">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="flex w-full items-center justify-between px-3 py-2.5 text-left"
                    >
                      <span className="text-sm font-medium pr-2">{q}</span>
                      <ChevronDown
                        className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                          expandedFaq === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedFaq === i && (
                      <div className="px-3 pb-3 pt-0">
                        <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* ── Contact ── */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <MessageSquareText className="size-4 text-muted-foreground" />
                Need More Help?
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button variant="outline" className="justify-start gap-2 h-auto py-3" asChild>
                  <a href="mailto:support@dermacare.app">
                    <Mail className="size-4" />
                    <div className="text-left">
                      <p className="text-sm font-medium">Email Support</p>
                      <p className="text-[11px] text-muted-foreground">support@dermacare.app</p>
                    </div>
                  </a>
                </Button>
                <Button variant="outline" className="justify-start gap-2 h-auto py-3" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" />
                    <div className="text-left">
                      <p className="text-sm font-medium">Documentation</p>
                      <p className="text-[11px] text-muted-foreground">docs.dermacare.app</p>
                    </div>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
