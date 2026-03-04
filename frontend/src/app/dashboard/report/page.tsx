"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  History,
  Plus,
  Trash2,
  Loader2,
  FileUp,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { analyzeReport } from "@/api/services/ai/report";
import { HealthDot } from "@/components/health-dot";
import { useServiceHealth } from "@/hooks/use-service-health";

/* ─── types ─── */
interface AnalysisResult {
  id: string;
  fileName: string;
  fileSize: string;
  analysis: Record<string, unknown>;
  timestamp: Date;
}

interface ReportSession {
  id: string;
  fileName: string;
  preview: string;
  date: string;
  status: "completed" | "failed";
}

/* ─── mock history ─── */
const mockSessions: ReportSession[] = [
  {
    id: "r1",
    fileName: "blood_work_cbc.pdf",
    preview: "Complete blood count analysis — all values within normal range",
    date: "Today",
    status: "completed",
  },
  {
    id: "r2",
    fileName: "skin_biopsy_report.pdf",
    preview: "Biopsy results indicate mild dermatitis",
    date: "Today",
    status: "completed",
  },
  {
    id: "r3",
    fileName: "allergy_panel.pdf",
    preview: "IgE levels elevated for dust mites and pollen",
    date: "Yesterday",
    status: "completed",
  },
  {
    id: "r4",
    fileName: "thyroid_panel.pdf",
    preview: "TSH and T4 levels slightly elevated",
    date: "Mar 1",
    status: "completed",
  },
  {
    id: "r5",
    fileName: "corrupted_scan.jpg",
    preview: "Failed to process — unsupported format",
    date: "Feb 28",
    status: "failed",
  },
];

/* ─── helpers ─── */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── page ─── */
export default function ReportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const health = useServiceHealth("report");

  /* drag & drop */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setResult(null);
      setError(null);
    }
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setResult(null);
      setError(null);
    }
  }

  function removeFile() {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleAnalyze() {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await analyzeReport(file);
      setResult({
        id: crypto.randomUUID(),
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        analysis: res.response,
        timestamp: new Date(),
      });
    } catch {
      setError("Failed to analyze the report. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleNewReport() {
    setFile(null);
    setResult(null);
    setError(null);
    setHistoryOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* ── Top bar ── */}
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <History className="size-4" />
              <span className="sr-only">Report history</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0" showCloseButton={false}>
            <SheetHeader className="border-b px-4 py-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-base">Report History</SheetTitle>
                <Button variant="ghost" size="icon" className="size-7" onClick={handleNewReport}>
                  <Plus className="size-4" />
                </Button>
              </div>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className="flex flex-col gap-1 p-2">
                {mockSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setHistoryOpen(false)}
                    className="group flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate text-sm font-medium">{session.fileName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {session.status === "completed" ? (
                          <CheckCircle2 className="size-3 text-emerald-500" />
                        ) : (
                          <AlertCircle className="size-3 text-red-500" />
                        )}
                        <Trash2 className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </div>
                    <span className="truncate text-xs text-muted-foreground pl-5.5">
                      {session.preview}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 pl-5.5">
                      {session.date}
                    </span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <Separator orientation="vertical" className="h-4" />

        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Report Analysis</span>
          <HealthDot status={health} />
        </div>

        <div className="ml-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" onClick={handleNewReport}>
                  <Plus className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New analysis</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:py-8">
          <AnimatePresence mode="wait">
            {!result ? (
              /* ── Upload state ── */
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="flex flex-col gap-6"
              >
                {/* heading */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold tracking-tight">
                    Analyze Medical Reports
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload your medical report and get an AI-powered analysis in seconds.
                  </p>
                </div>

                {/* drop zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-6 transition-colors sm:p-12 ${
                    isDragging
                      ? "border-foreground/40 bg-accent"
                      : "border-border hover:border-foreground/20 hover:bg-accent/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex size-14 items-center justify-center rounded-2xl border-2 border-foreground/10 bg-accent">
                    <Upload className="size-6 text-foreground/60" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      Drag & drop your report here
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      or click to browse · PDF, JPG, PNG, DOC up to 10MB
                    </p>
                  </div>
                </div>

                {/* selected file preview */}
                {file && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                  >
                    <Card>
                      <CardContent className="flex items-center gap-3 py-3 px-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                          <FileUp className="size-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                          }}
                        >
                          <X className="size-3.5" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* error */}
                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                    <AlertCircle className="size-4 shrink-0" />
                    {error}
                  </div>
                )}

                {/* analyze button */}
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!file || isAnalyzing}
                  onClick={handleAnalyze}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 size-4" />
                      Analyze Report
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              /* ── Results state ── */
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="flex flex-col gap-6"
              >
                {/* file info */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                        <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{result.fileName}</CardTitle>
                        <CardDescription>
                          {result.fileSize} · Analyzed{" "}
                          {result.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleNewReport}>
                      <Plus className="mr-1.5 size-3.5" />
                      New
                    </Button>
                  </CardHeader>
                </Card>

                {/* analysis results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Results</CardTitle>
                    <CardDescription>
                      AI-generated breakdown of your medical report
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {Object.entries(result.analysis).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-accent text-xs font-medium capitalize"
                            >
                              {key.replace(/_/g, " ")}
                            </Badge>
                          </div>
                          <p className="text-sm leading-relaxed text-foreground/90 pl-1">
                            {typeof value === "string"
                              ? value
                              : JSON.stringify(value, null, 2)}
                          </p>
                          <Separator className="mt-2" />
                        </div>
                      ))}

                      {Object.keys(result.analysis).length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No structured analysis returned. The report may need a different format.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* disclaimer */}
                <p className="text-center text-[11px] text-muted-foreground/60">
                  This analysis is AI-generated and may contain errors. Always consult a healthcare
                  professional for medical decisions.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


