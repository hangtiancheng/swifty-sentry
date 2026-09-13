import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

import { handleAnchorClick } from "@/lib/scroll";

import { GithubIcon } from "@/components/icons/github-icon";
import { Reveal } from "@/components/ui/reveal";

export function CTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="scroll-mt-28 px-5 pb-24 sm:px-8">
      <Reveal className="mx-auto w-full max-w-7xl">
        <div className="bg-ink-950 relative overflow-hidden rounded-4xl border border-white/10 px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="bg-brand-500/40 absolute -top-32 left-1/2 h-80 w-160 -translate-x-1/2 rounded-full blur-[120px]" />
            <div className="bg-accent-500/30 absolute -bottom-24 -left-16 h-64 w-64 rounded-full blur-[110px]" />
            <div className="bg-brand-400/30 absolute -right-16 -bottom-24 h-64 w-64 rounded-full blur-[110px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,140,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,140,255,0.08)_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] bg-size-[48px_48px]" />
          </div>

          <div className="relative">
            <motion.span
              animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-brand-200 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold backdrop-blur"
            >
              <Sparkles className="size-3.5" />
              Five lines. Every signal.
            </motion.span>

            <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
              Start catching what breaks
              <span className="from-brand-300 to-accent-300 block bg-linear-to-r via-white bg-clip-text text-transparent">
                before your users tell you.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              Install the SDK, point it at an endpoint and ship. Swifty Sentry
              handles the classification, batching, retries and session context
              for you.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#quickstart"
                onClick={(event) => handleAnchorClick(event, "#quickstart")}
                className="group text-ink-950 hover:bg-brand-100 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold shadow-xl shadow-black/30 transition"
              >
                Get started free
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="https://github.com/hangtiancheng/swifty-sentry"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
              >
                <GithubIcon className="size-4" />
                Browse the source
              </a>
            </div>

            <p className="mt-8 font-mono text-xs text-slate-400">
              <span className="text-brand-300">$</span> npm install{" "}
              @swifty.js/sentry
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
