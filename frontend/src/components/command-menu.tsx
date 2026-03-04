"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  MessageSquareText,
  ScanSearch,
  FileText,
  ClipboardList,
  Settings,
  Sun,
  Moon,
  Plus,
  HelpCircle,
  LogOut,
  Search,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  /* global Ctrl+K / Cmd+K binding */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(path: string) {
    setOpen(false);
    router.push(path);
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
    setOpen(false);
  }

  function handleSignOut() {
    localStorage.removeItem("access_token");
    setOpen(false);
    router.push("/auth/signin");
  }

  return (
    <>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Quick Actions"
        description="Search pages, actions, and settings"
      >
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* ── Navigation ── */}
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => go("/dashboard")}>
              <LayoutDashboard className="mr-2 size-4" />
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => go("/dashboard/chat")}>
              <MessageSquareText className="mr-2 size-4" />
              Chat
            </CommandItem>
            <CommandItem onSelect={() => go("/dashboard/identification")}>
              <ScanSearch className="mr-2 size-4" />
              Identification
            </CommandItem>
            <CommandItem onSelect={() => go("/dashboard/report")}>
              <FileText className="mr-2 size-4" />
              Report
            </CommandItem>
            <CommandItem onSelect={() => go("/dashboard/symptom")}>
              <ClipboardList className="mr-2 size-4" />
              Symptoms
            </CommandItem>
            <CommandItem onSelect={() => go("/dashboard/settings")}>
              <Settings className="mr-2 size-4" />
              Settings
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* ── Quick Actions ── */}
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => go("/dashboard/chat")}>
              <Plus className="mr-2 size-4" />
              New Chat Session
            </CommandItem>
            <CommandItem onSelect={() => go("/dashboard/identification")}>
              <Plus className="mr-2 size-4" />
              New Skin Scan
            </CommandItem>
            <CommandItem onSelect={() => go("/dashboard/report")}>
              <Plus className="mr-2 size-4" />
              Upload Report
            </CommandItem>
            <CommandItem onSelect={() => go("/dashboard/symptom")}>
              <Plus className="mr-2 size-4" />
              Log Symptom
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* ── Preferences ── */}
          <CommandGroup heading="Preferences">
            <CommandItem onSelect={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="mr-2 size-4" />
              ) : (
                <Moon className="mr-2 size-4" />
              )}
              Toggle {theme === "dark" ? "Light" : "Dark"} Mode
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* ── Account ── */}
          <CommandGroup heading="Account">
            <CommandItem onSelect={handleSignOut}>
              <LogOut className="mr-2 size-4" />
              Sign Out
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

/* Export a trigger hook so the sidebar Search button can open it */
let externalOpen: ((v: boolean) => void) | null = null;

export function useCommandMenu() {
  return {
    open: () => externalOpen?.(true),
  };
}

/* Wrapper that wires the external trigger */
export function CommandMenuProvider() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    externalOpen = setOpen;
    return () => { externalOpen = null; };
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(path: string) {
    setOpen(false);
    router.push(path);
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
    setOpen(false);
  }

  function handleSignOut() {
    localStorage.removeItem("access_token");
    setOpen(false);
    router.push("/auth/signin");
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Quick Actions"
      description="Search pages, actions, and settings"
    >
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => go("/dashboard")}>
            <LayoutDashboard className="mr-2 size-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/chat")}>
            <MessageSquareText className="mr-2 size-4" />
            Chat
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/identification")}>
            <ScanSearch className="mr-2 size-4" />
            Identification
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/report")}>
            <FileText className="mr-2 size-4" />
            Report
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/symptom")}>
            <ClipboardList className="mr-2 size-4" />
            Symptoms
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/settings")}>
            <Settings className="mr-2 size-4" />
            Settings
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => go("/dashboard/chat")}>
            <Plus className="mr-2 size-4" />
            New Chat Session
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/identification")}>
            <Plus className="mr-2 size-4" />
            New Skin Scan
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/report")}>
            <Plus className="mr-2 size-4" />
            Upload Report
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/symptom")}>
            <Plus className="mr-2 size-4" />
            Log Symptom
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Preferences">
          <CommandItem onSelect={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="mr-2 size-4" />
            ) : (
              <Moon className="mr-2 size-4" />
            )}
            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          <CommandItem onSelect={handleSignOut}>
            <LogOut className="mr-2 size-4" />
            Sign Out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
