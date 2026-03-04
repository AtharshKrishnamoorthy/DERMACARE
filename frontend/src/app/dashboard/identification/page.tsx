"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  History,
  Plus,
  Trash2,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  ScanSearch,
  ImageIcon,
  RotateCcw,
  SwitchCamera,
  Sparkles,
  ShieldCheck,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { predictAndDescribe } from "@/api/services/ai/identification";
import { HealthDot } from "@/components/health-dot";
import { useServiceHealth } from "@/hooks/use-service-health";

/* ─── types ─── */
interface IdentificationResult {
  id: string;
  imageSrc: string;
  predicted_disease: string;
  description: string;
  timestamp: Date;
}

interface IdentificationSession {
  id: string;
  disease: string;
  preview: string;
  date: string;
  status: "completed" | "failed";
}

/* ─── mock history ─── */
const mockSessions: IdentificationSession[] = [
  {
    id: "i1",
    disease: "Eczema",
    preview: "Identified from uploaded arm photo",
    date: "Today",
    status: "completed",
  },
  {
    id: "i2",
    disease: "Psoriasis",
    preview: "Captured via camera — elbow area",
    date: "Today",
    status: "completed",
  },
  {
    id: "i3",
    disease: "Contact Dermatitis",
    preview: "Uploaded photo of hand rash",
    date: "Yesterday",
    status: "completed",
  },
  {
    id: "i4",
    disease: "Melanoma Screening",
    preview: "Mole on back — low confidence result",
    date: "Mar 1",
    status: "completed",
  },
  {
    id: "i5",
    disease: "Unknown",
    preview: "Image too blurry to process",
    date: "Feb 28",
    status: "failed",
  },
];

/* ─── page ─── */
export default function IdentificationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [tab, setTab] = useState("upload");

  /* camera state */
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const health = useServiceHealth("identification");

  /* ── camera management ── */
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setCameraActive(true);
    } catch {
      setError("Unable to access camera. Please check your permissions.");
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }

  function toggleFacingMode() {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }

  /* restart camera on facingMode change */
  useEffect(() => {
    if (tab === "camera" && cameraActive) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  /* cleanup camera on unmount / tab switch */
  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab !== "camera") stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      setFile(capturedFile);
      setPreview(canvas.toDataURL("image/jpeg"));
      setResult(null);
      setError(null);
      stopCamera();
    }, "image/jpeg", 0.92);
  }

  /* ── file upload ── */
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
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setResult(null);
      setError(null);
    } else {
      setError("Please upload an image file (JPG, PNG, WEBP).");
    }
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith("image/")) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError(null);
    }
  }

  function removeImage() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /* ── analyze ── */
  async function handleAnalyze() {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await predictAndDescribe(file, "demo-user");
      setResult({
        id: crypto.randomUUID(),
        imageSrc: preview ?? "",
        predicted_disease: res.predicted_disease,
        description: res.description,
        timestamp: new Date(),
      });
    } catch {
      setError("Failed to analyze the image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleNewScan() {
    removeImage();
    setHistoryOpen(false);
    stopCamera();
    setTab("upload");
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* ── Top bar ── */}
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <History className="size-4" />
              <span className="sr-only">Identification history</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0" showCloseButton={false}>
            <SheetHeader className="border-b px-4 py-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-base">Scan History</SheetTitle>
                <Button variant="ghost" size="icon" className="size-7" onClick={handleNewScan}>
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
                        <ScanSearch className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate text-sm font-medium">{session.disease}</span>
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
          <ScanSearch className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Skin Identification</span>
          <HealthDot status={health} />
        </div>

        <div className="ml-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" onClick={handleNewScan}>
                  <Plus className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New scan</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:py-8">
          <AnimatePresence mode="wait">
            {!result ? (
              /* ── Capture / Upload state ── */
              <motion.div
                key="capture"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="flex flex-col gap-6"
              >
                {/* heading */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold tracking-tight">
                    Identify Skin Condition
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload a photo or use your camera — our AI will analyze it instantly.
                  </p>
                </div>

                {/* tabs: Upload / Camera */}
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="gap-2">
                      <Upload className="size-4" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="camera" className="gap-2">
                      <Camera className="size-4" />
                      Camera
                    </TabsTrigger>
                  </TabsList>

                  {/* ── Upload tab ── */}
                  <TabsContent value="upload" className="mt-4">
                    {!preview ? (
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
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <div className="flex size-14 items-center justify-center rounded-2xl border-2 border-foreground/10 bg-accent">
                          <ImageIcon className="size-6 text-foreground/60" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            Drag & drop your image here
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            or click to browse · JPG, PNG, WEBP up to 10MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* image preview */
                      <div className="relative overflow-hidden rounded-2xl border">
                        <img
                          src={preview}
                          alt="Selected skin image"
                          className="w-full max-h-80 object-cover"
                        />
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-3 top-3 size-8 rounded-full bg-background/80 backdrop-blur-sm"
                          onClick={removeImage}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* ── Camera tab ── */}
                  <TabsContent value="camera" className="mt-4">
                    {!preview ? (
                      <div className="flex flex-col gap-4">
                        <div className="relative overflow-hidden rounded-2xl border bg-black aspect-video">
                          {cameraActive ? (
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-white/60">
                              <Camera className="size-12" />
                              <p className="text-sm">Camera is off</p>
                            </div>
                          )}
                          {/* hidden canvas for capture */}
                          <canvas ref={canvasRef} className="hidden" />
                        </div>

                        <div className="flex items-center justify-center gap-3">
                          {!cameraActive ? (
                            <Button onClick={startCamera} className="gap-2">
                              <Camera className="size-4" />
                              Start Camera
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="size-10 rounded-full"
                                onClick={toggleFacingMode}
                              >
                                <SwitchCamera className="size-4" />
                              </Button>
                              <Button
                                size="lg"
                                className="h-14 w-14 rounded-full p-0"
                                onClick={capturePhoto}
                              >
                                <div className="size-10 rounded-full border-2 border-white/60" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="size-10 rounded-full"
                                onClick={stopCamera}
                              >
                                <X className="size-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* captured preview */
                      <div className="relative overflow-hidden rounded-2xl border">
                        <img
                          src={preview}
                          alt="Captured skin image"
                          className="w-full max-h-80 object-cover"
                        />
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-3 top-3 size-8 rounded-full bg-background/80 backdrop-blur-sm"
                          onClick={removeImage}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

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
                      <ScanSearch className="mr-2 size-4" />
                      Identify Condition
                    </>
                  )}
                </Button>

                {/* hints */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { icon: Camera, label: "Clear, close-up photo" },
                    { icon: Sparkles, label: "Good lighting helps" },
                    { icon: ShieldCheck, label: "Data stays private" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-2 rounded-xl border bg-accent/30 p-3 text-center sm:p-4"
                    >
                      <Icon className="size-5 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
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
                {/* image + status */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                        <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Analysis Complete</CardTitle>
                        <CardDescription>
                          Scanned{" "}
                          {result.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleNewScan}>
                      <RotateCcw className="mr-1.5 size-3.5" />
                      New Scan
                    </Button>
                  </CardHeader>
                  {result.imageSrc && (
                    <CardContent className="pt-0">
                      <div className="overflow-hidden rounded-xl border">
                        <img
                          src={result.imageSrc}
                          alt="Analyzed skin"
                          className="w-full max-h-64 object-cover"
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* predicted disease */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-foreground text-background text-sm px-3 py-1 font-semibold">
                        {result.predicted_disease}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">Predicted Condition</CardDescription>
                  </CardHeader>
                </Card>

                {/* description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">AI Analysis</CardTitle>
                    <CardDescription>Detailed description of the identified condition</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                      {result.description}
                    </p>
                  </CardContent>
                </Card>

                {/* disclaimer */}
                <p className="text-center text-[11px] text-muted-foreground/60">
                  This analysis is AI-generated and may contain errors. Always consult a
                  dermatologist for medical decisions.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
