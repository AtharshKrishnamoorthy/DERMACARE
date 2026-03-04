"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  History,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock,
  CalendarDays,
  Send,
  Stethoscope,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addSymptom, getUserSymptoms, deleteSymptom } from "@/api/services/dashboard/symptoms";
import { HealthDot } from "@/components/health-dot";
import { useServiceHealth } from "@/hooks/use-service-health";
import type { Symptom } from "@/api/types";

/* ─── quick prompts ─── */
const quickPrompts = [
  "Itchy red rash on forearms",
  "Dry, flaky patches on elbows",
  "Small blisters on fingers",
  "Burning sensation after sun exposure",
  "Dark spot that changed shape",
  "Persistent acne on jawline",
];

/* ─── helpers ─── */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ─── page ─── */
export default function SymptomPage() {
  const [description, setDescription] = useState("");
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const health = useServiceHealth("symptoms");

  /* fetch symptoms on mount */
  useEffect(() => {
    async function load() {
      try {
        const data = await getUserSymptoms("demo-user");
        setSymptoms(data);
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  /* log new symptom */
  async function handleSubmit() {
    const text = description.trim();
    if (!text || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newSymptom = await addSymptom({
        user_id: "demo-user",
        description: text,
      });
      setSymptoms((prev) => [newSymptom, ...prev]);
      setDescription("");
    } catch {
      setError("Failed to log symptom. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  /* delete symptom */
  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteSymptom(deleteId);
      setSymptoms((prev) => prev.filter((s) => s.id !== deleteId));
    } catch {
      // silent
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  /* quick prompt click */
  function handleQuickPrompt(prompt: string) {
    setDescription(prompt);
  }

  /* keyboard shortcut */
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  /* group symptoms by date */
  const grouped = symptoms.reduce<Record<string, Symptom[]>>((acc, symptom) => {
    const label = formatDate(symptom.logged_at);
    if (!acc[label]) acc[label] = [];
    acc[label].push(symptom);
    return acc;
  }, {});

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* ── Top bar ── */}
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <History className="size-4" />
              <span className="sr-only">Symptom history</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0" showCloseButton={false}>
            <SheetHeader className="border-b px-4 py-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-base">All Symptom Logs</SheetTitle>
                <Badge variant="secondary" className="text-xs">
                  {symptoms.length}
                </Badge>
              </div>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className="flex flex-col gap-1 p-2">
                {symptoms.length === 0 ? (
                  <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No symptoms logged yet.
                  </p>
                ) : (
                  symptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      className="group flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <Stethoscope className="size-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate text-sm font-medium">
                            {symptom.description}
                          </span>
                        </div>
                        <button
                          onClick={() => setDeleteId(symptom.id)}
                          className="shrink-0"
                        >
                          <Trash2 className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 pl-5.5">
                        {formatDate(symptom.logged_at)} · {formatTime(symptom.logged_at)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <Separator orientation="vertical" className="h-4" />

        <div className="flex items-center gap-2">
          <ClipboardList className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Symptom Logger</span>
          <HealthDot status={health} />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Badge variant="secondary" className="text-xs">
            {symptoms.length} logged
          </Badge>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {/* heading */}
            <div className="text-center">
              <h3 className="text-xl font-semibold tracking-tight">
                Log Your Symptoms
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Track and record symptoms over time — helps build a clearer picture for your
                dermatologist.
              </p>
            </div>

            {/* input card */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your symptom in detail — location, severity, when it started…"
                    className="min-h-[120px] resize-none text-sm"
                  />

                  {/* quick prompts */}
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="rounded-full border bg-accent/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  {/* error */}
                  {error && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                      <AlertCircle className="size-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">
                      Press Ctrl+Enter to submit
                    </p>
                    <Button
                      onClick={handleSubmit}
                      disabled={!description.trim() || isSubmitting}
                      className="gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Logging…
                        </>
                      ) : (
                        <>
                          <Send className="size-4" />
                          Log Symptom
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── Logged symptoms timeline ── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  Recent Logs
                </h4>
                {symptoms.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setHistoryOpen(true)}
                  >
                    View all
                  </Button>
                )}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : symptoms.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl border-2 border-foreground/10 bg-accent mb-4">
                      <ClipboardList className="size-6 text-foreground/60" />
                    </div>
                    <p className="text-sm font-medium">No symptoms logged yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Start by describing a symptom above — your logs will appear here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <AnimatePresence mode="popLayout">
                  {Object.entries(grouped).map(([dateLabel, items]) => (
                    <motion.div
                      key={dateLabel}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[11px] font-medium">
                          {dateLabel}
                        </Badge>
                        <div className="flex-1 border-t" />
                      </div>

                      {items.map((symptom) => (
                        <motion.div
                          key={symptom.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                        >
                          <Card className="group transition-colors hover:bg-accent/30">
                            <CardContent className="flex items-start gap-3 py-3 px-4">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent mt-0.5">
                                <Stethoscope className="size-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm leading-relaxed text-foreground/90">
                                  {symptom.description}
                                </p>
                                <div className="mt-1.5 flex items-center gap-2">
                                  <Clock className="size-3 text-muted-foreground" />
                                  <span className="text-[11px] text-muted-foreground">
                                    {formatTime(symptom.logged_at)}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => setDeleteId(symptom.id)}
                              >
                                <Trash2 className="size-3.5 text-muted-foreground" />
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Delete confirmation dialog ── */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Symptom Log</DialogTitle>
            <DialogDescription>
              This will permanently remove this symptom entry. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
