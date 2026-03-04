"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Paperclip,
  Mic,
  Plus,
  History,
  Sparkles,
  MessageSquareText,
  ScanSearch,
  Pill,
  HeartPulse,
  Trash2,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { sendMessage } from "@/api/services/ai/chat";
import { HealthDot } from "@/components/health-dot";
import { useServiceHealth } from "@/hooks/use-service-health";

/* ─── types ─── */
type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  date: string;
  isPrivate: boolean;
}

/* ─── starter prompts ─── */
const starterPrompts = [
  {
    icon: ScanSearch,
    title: "Identify a skin condition",
    prompt: "I have a red, itchy rash on my arm. What could it be?",
  },
  {
    icon: Pill,
    title: "Treatment options",
    prompt: "What are the best treatments for eczema?",
  },
  {
    icon: HeartPulse,
    title: "Skincare routine",
    prompt: "Can you suggest a daily skincare routine for sensitive skin?",
  },
  {
    icon: MessageSquareText,
    title: "Understand symptoms",
    prompt: "What does it mean when a mole changes color?",
  },
];

/* ─── mock history ─── */
const mockSessions: ChatSession[] = [
  {
    id: "s1",
    title: "Eczema treatment advice",
    preview: "What are the best treatments for...",
    date: "Today",
    isPrivate: false,
  },
  {
    id: "s2",
    title: "Mole analysis discussion",
    preview: "I noticed a mole on my back that...",
    date: "Today",
    isPrivate: false,
  },
  {
    id: "s3",
    title: "Acne skincare routine",
    preview: "Can you suggest a morning routine...",
    date: "Yesterday",
    isPrivate: true,
  },
  {
    id: "s4",
    title: "Psoriasis flare-up",
    preview: "My psoriasis has gotten worse...",
    date: "Mar 1",
    isPrivate: false,
  },
  {
    id: "s5",
    title: "Rosacea triggers",
    preview: "What foods should I avoid if...",
    date: "Feb 28",
    isPrivate: false,
  },
];

/* ─── page ─── */
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const health = useServiceHealth("chat");
  const hasMessages = messages.length > 0;

  /* auto-scroll on new message */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /* auto-resize textarea */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  /* send message */
  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await sendMessage({ user_id: "demo-user", query: text });
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: res.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleStarterClick(prompt: string) {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };
    setMessages([userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await sendMessage({ user_id: "demo-user", query: prompt });
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: res.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewChat() {
    setMessages([]);
    setInput("");
    setHistoryOpen(false);
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* ── Top bar with history toggle ── */}
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <History className="size-4" />
              <span className="sr-only">Chat history</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0" showCloseButton={false}>
            <SheetHeader className="border-b px-4 py-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-base">Chat History</SheetTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={handleNewChat}
                >
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
                      <span className="truncate text-sm font-medium">
                        {session.title}
                      </span>
                      <div className="flex items-center gap-1">
                        {session.isPrivate && (
                          <Lock className="size-3 text-muted-foreground" />
                        )}
                        <Trash2 className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </div>
                    <span className="truncate text-xs text-muted-foreground">
                      {session.preview}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
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
          <Sparkles className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Dermi</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">— your AI skin health assistant</span>
          <HealthDot status={health} />
        </div>

        <div className="ml-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" onClick={handleNewChat}>
                  <Plus className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* ── Messages area ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            /* ── Empty state ── */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex h-full flex-col items-center justify-center px-4"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl border-2 border-foreground/10 bg-accent">
                  <Sparkles className="size-7 text-foreground/70" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    Chat with Dermi
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your AI dermatology assistant. Ask about skin conditions,
                    treatments, or skincare routines.
                  </p>
                </div>

                {/* starter prompts grid */}
                <div className="mt-4 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
                  {starterPrompts.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => handleStarterClick(item.prompt)}
                      className="group flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:bg-accent"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent group-hover:bg-background">
                        <item.icon className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                          {item.prompt}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* ── Message list ── */
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto w-full max-w-3xl px-4 py-6"
            >
              <div className="flex flex-col gap-6">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* avatar */}
                    <Avatar size="sm" className="mt-0.5 shrink-0">
                      <AvatarFallback
                        className={`text-[10px] font-medium ${
                          msg.role === "assistant"
                            ? "bg-foreground text-background"
                            : "bg-accent text-foreground"
                        }`}
                      >
                        {msg.role === "assistant" ? "D" : "U"}
                      </AvatarFallback>
                    </Avatar>

                    {/* bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[75%] ${
                        msg.role === "user"
                          ? "bg-foreground text-background"
                          : "bg-accent text-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p
                        className={`mt-1.5 text-[10px] ${
                          msg.role === "user"
                            ? "text-background/50"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* typing indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <Avatar size="sm" className="mt-0.5 shrink-0">
                      <AvatarFallback className="bg-foreground text-background text-[10px] font-medium">
                        D
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1 rounded-2xl bg-accent px-4 py-3">
                      <span className="size-1.5 animate-bounce rounded-full bg-foreground/40 [animation-delay:0ms]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-foreground/40 [animation-delay:150ms]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-foreground/40 [animation-delay:300ms]" />
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Input bar ── */}
      <div className="border-t bg-background px-2 py-2 sm:px-4 sm:py-3">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-end gap-2 rounded-2xl border bg-card px-3 py-2 shadow-sm transition-shadow focus-within:shadow-md">
            {/* attachment */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <Paperclip className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Attach file</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* textarea */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Dermi anything about skin health..."
              rows={1}
              className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
            />

            {/* mic */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <Mic className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voice input</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* send */}
            <Button
              size="icon"
              className="size-8 shrink-0 rounded-full"
              disabled={!input.trim() || isLoading}
              onClick={handleSend}
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground/60">
            Dermi may make mistakes. Consult a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
