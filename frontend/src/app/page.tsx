"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ScanEye,
  MessageSquareText,
  FileText,
  Activity,
  LayoutDashboard,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Upload,
  Brain,
  Clipboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DottedBackground } from "@/components/dotted-background";

/* ───── animation helpers ───── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ───── data ───── */
const features = [
  {
    icon: ScanEye,
    title: "Skin Disease Identification",
    description:
      "Upload a photo and get an instant AI-powered diagnosis across 8 common skin conditions.",
  },
  {
    icon: FileText,
    title: "Medical Report Analysis",
    description:
      "Upload medical reports in any format and receive a clear, structured analysis with actionable insights.",
  },
  {
    icon: MessageSquareText,
    title: "AI Chat Assistant",
    description:
      "Chat with our AI dermatology assistant for personalized guidance, recommendations, and answers.",
  },
  {
    icon: Activity,
    title: "Symptom Tracking",
    description:
      "Log and monitor your skin symptoms over time to identify patterns and track progress.",
  },
  {
    icon: LayoutDashboard,
    title: "Personal Dashboard",
    description:
      "View your identification history, reports, chat logs, and settings all in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description:
      "Your health data is encrypted and secure. We never share your information with third parties.",
  },
];

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload",
    description: "Take a photo of the skin area or upload your medical report.",
  },
  {
    icon: Brain,
    step: "02",
    title: "Analyze",
    description:
      "Our AI model analyzes the image or document and identifies conditions.",
  },
  {
    icon: Clipboard,
    step: "03",
    title: "Get Results",
    description:
      "Receive a detailed report with diagnosis, severity, and next steps.",
  },
];

/* ───── page ───── */
export default function Home() {
  return (
    <DottedBackground>
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-foreground bg-background">
              <ScanEye className="h-4 w-4 text-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              DermaCare
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="transition hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-foreground">
              How It Works
            </a>
            <a href="#cta" className="transition hover:text-foreground">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/signup">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-28 pb-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col items-center gap-6"
        >
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              AI-Powered Dermatology
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Your Skin Health,{" "}
            <span className="text-muted-foreground">Simplified</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Instant skin disease identification, smart report analysis, and an
            AI assistant — all in one clean, secure platform.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Start Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#features">
                See Features <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Hero illustration placeholder — gradient blur orbs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative mt-20 w-full max-w-4xl"
        >
          <div className="rounded-2xl border border-border/60 bg-card p-2 shadow-xl shadow-primary/5">
            <div className="flex h-64 items-center justify-center rounded-xl bg-muted/50 sm:h-80">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <ScanEye className="h-12 w-12 text-primary/60" />
                <p className="text-sm font-medium">
                  AI-Powered Skin Analysis Dashboard
                </p>
              </div>
            </div>
          </div>
          {/* Decorative blurs */}
          <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        </motion.div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* ── Features ── */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="max-w-lg text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Everything You Need for{" "}
            <span className="text-muted-foreground">Skin Health</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-3 max-w-md text-muted-foreground"
          >
            A complete AI-driven platform to identify, analyze, track, and
            understand your skin conditions.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f, i) => (
            <motion.div key={f.title} variants={fadeUp} custom={i}>
              <Card className="group h-full border-border/60 transition-shadow hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="flex flex-col gap-3 pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* ── How It Works ── */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="outline" className="mb-4">
              How It Works
            </Badge>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="max-w-lg text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Three Simple <span className="text-muted-foreground">Steps</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-3 max-w-md text-muted-foreground"
          >
            From upload to diagnosis in under a minute.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="mt-14 grid gap-8 sm:grid-cols-3"
        >
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              variants={fadeUp}
              custom={i}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <s.icon className="h-7 w-7" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-foreground bg-background text-xs font-bold text-foreground">
                  {s.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                {s.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* ── CTA ── */}
      <section id="cta" className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="flex flex-col items-center rounded-3xl border border-border/60 bg-card px-8 py-16 text-center shadow-lg shadow-primary/5"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="max-w-lg text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Ready to Take Control of Your{" "}
            <span className="text-muted-foreground">Skin Health</span>?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="mt-4 max-w-md text-muted-foreground"
          >
            Join thousands of users who trust DermaCare for fast, accurate, and
            private skin analysis.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="mt-8">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 bg-card/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-foreground bg-background">
              <ScanEye className="h-3 w-3 text-foreground" />
            </div>
            <span className="font-medium text-foreground">DermaCare</span>
          </div>
          <p>&copy; {new Date().getFullYear()} DermaCare. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition hover:text-foreground">
              Terms
            </a>
            <a href="#" className="transition hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </DottedBackground>
  );
}
