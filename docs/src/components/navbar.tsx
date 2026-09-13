import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

import { handleAnchorClick } from "@/lib/scroll";
import { useTheme } from "@/lib/theme";

import { GithubIcon } from "./icons/github-icon";
import { Logo } from "./logo";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Analytics", href: "#analytics" },
  { label: "Performance", href: "#performance" },
  { label: "Plugins", href: "#plugins" },
  { label: "Frameworks", href: "#frameworks" },
  { label: "API", href: "#api" },
] as const;

const GITHUB_URL = "https://github.com/hangtiancheng/swifty-sentry";

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "dark:bg-ink-950/80 border-b border-slate-900/10 bg-white/80 backdrop-blur-xl dark:border-white/10"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-5 sm:px-8">
        <Logo />

        <div className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => {
                handleAnchorClick(event, link.href);
              }}
              className="hover:text-brand-600 dark:hover:text-brand-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle color theme"
            className="hover:border-brand-400/50 hover:text-brand-600 dark:hover:text-brand-200 relative grid size-9 place-items-center overflow-hidden rounded-xl border border-slate-900/10 text-slate-600 transition dark:border-white/10 dark:text-slate-300"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.22 }}
                className="grid place-items-center"
              >
                {theme === "dark" ? (
                  <Moon className="size-4.5" />
                ) : (
                  <Sun className="size-4.5" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="hover:border-brand-400/50 hover:text-brand-600 dark:hover:text-brand-200 hidden size-9 place-items-center rounded-xl border border-slate-900/10 text-slate-600 transition sm:grid dark:border-white/10 dark:text-slate-300"
          >
            <GithubIcon className="size-4.5" />
          </a>

          <a
            href="#quickstart"
            onClick={(event) => {
              handleAnchorClick(event, "#quickstart");
            }}
            className="group from-brand-500 to-accent-500 shadow-brand-500/25 hover:shadow-brand-500/40 hidden items-center gap-1.5 rounded-xl bg-linear-to-r px-4 py-2 text-sm font-bold text-white shadow-lg transition sm:inline-flex"
          >
            Get started
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            className="grid size-9 place-items-center rounded-xl border border-slate-900/10 text-slate-600 lg:hidden dark:border-white/10 dark:text-slate-300"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="dark:bg-ink-950 overflow-hidden border-t border-slate-900/10 bg-white lg:hidden dark:border-white/10"
          >
            <div className="space-y-1 px-5 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    handleAnchorClick(event, link.href);
                    setOpen(false);
                  }}
                  className="hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-200 block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition dark:text-slate-200"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href="#quickstart"
                  onClick={(event) => {
                    handleAnchorClick(event, "#quickstart");
                    setOpen(false);
                  }}
                  className="from-brand-500 to-accent-500 inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r px-4 py-2.5 text-sm font-bold text-white"
                >
                  Get started
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub repository"
                  className="grid size-10 place-items-center rounded-xl border border-slate-900/10 text-slate-600 dark:border-white/10 dark:text-slate-300"
                >
                  <GithubIcon className="size-5" />
                </a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
