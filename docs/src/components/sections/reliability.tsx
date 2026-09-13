import { motion, useReducedMotion } from "motion/react";
import {
  Bug,
  Database,
  Filter,
  Layers,
  RefreshCw,
  Send,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { CodeBlock } from "@/components/ui/code-block";
import { Pill } from "@/components/ui/pill";
import { Reveal, RevealItem, RevealList } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

const RELIABILITY_CODE = `import { init, beforeSend, beforeSendBatch, afterSend } from "@swifty.js/sentry";

init({
  dsn: "/api/log",
  cacheMaxLength: 10,        // flush when 10 events queue up
  cacheWaitingTime: 2000,    // or after 2s, whichever first
  maxQueueLength: 200,       // cap while offline
  ignoreErrors: [/ResizeObserver loop limit exceeded/],
  excludeAPIs: ["/api/log", /\\/health$/],
});

beforeSend((event) => {
  if (event.type === "Click") return false;  // drop entirely
  return event;
});

beforeSendBatch((batch) => batch.filter((e) => e.status !== "OK"));
afterSend((batch) => console.log("sent", batch.length));`;

const PIPELINE: readonly {
  label: string;
  caption: string;
  icon: LucideIcon;
}[] = [
  { label: "Capture", caption: "Handlers normalize every signal", icon: Bug },
  {
    label: "Queue",
    caption: "In-memory batch with FIFO limits",
    icon: Database,
  },
  {
    label: "Persist",
    caption: "localStorage mirror while offline",
    icon: Layers,
  },
  { label: "Transport", caption: "sendBeacon ≤60KB, else fetch", icon: Send },
  { label: "Recover", caption: "HEAD probe with backoff", icon: RefreshCw },
];

const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: "Bounded memory",
    description:
      "Breadcrumbs and the error-dedup set are LRU-capped, so long-lived SPAs never grow without limit.",
  },
  {
    icon: Filter,
    title: "Precision filtering",
    description:
      "ignoreErrors matches message substrings or patterns; excludeAPIs uses exact URLs or regex.",
  },
  {
    icon: Layers,
    title: "Atomic batches",
    description:
      "A failed batch is pushed back to the queue head and persisted, so ordering is preserved end-to-end.",
  },
] as const;

export function Reliability() {
  const reduceMotion = useReducedMotion();

  return (
    <Section
      id="reliability"
      eyebrow="Reliability"
      title="Reporting that survives"
      accent="bad networks."
      description="A production monitoring client cannot afford to lose data or block the page. Swifty Sentry keeps a durable queue, ships asynchronously and never lets one failed batch stall the rest."
    >
      <Reveal>
        <div className="rounded-3xl border border-slate-900/10 bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-white/3">
          <div className="grid gap-6 md:grid-cols-5">
            {PIPELINE.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="relative">
                  <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-3">
                    <span className="from-brand-500/15 to-accent-500/15 text-brand-600 ring-brand-500/20 dark:text-brand-300 grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-br ring-1">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {step.label}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {step.caption}
                      </p>
                    </div>
                  </div>
                  {index < PIPELINE.length - 1 ? (
                    <motion.span
                      aria-hidden
                      initial={reduceMotion ? { opacity: 0.4 } : { scaleX: 0 }}
                      whileInView={{ scaleX: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.12 }}
                      className="from-brand-400/70 to-accent-400/70 absolute top-5 -right-3 hidden h-px w-6 origin-left bg-linear-to-r md:block"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <RevealList className="space-y-4">
          {GUARANTEES.map((item) => {
            const Icon = item.icon;
            return (
              <RevealItem key={item.title}>
                <article className="flex gap-4 rounded-2xl border border-slate-900/10 bg-white p-5 dark:border-white/10 dark:bg-white/3">
                  <span className="bg-brand-500/10 text-brand-600 dark:text-brand-300 grid size-10 shrink-0 place-items-center rounded-xl">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealList>

        <Reveal delay={0.1}>
          <CodeBlock code={RELIABILITY_CODE} filename="sentry.config.ts" />
        </Reveal>
      </div>

      <RevealItem className="mt-8 flex flex-wrap gap-3">
        <Pill icon={Send}>sendBeacon first</Pill>
        <Pill icon={Layers}>keepalive-aware fetch</Pill>
        <Pill icon={RefreshCw}>exponential recovery</Pill>
        <Pill icon={Database}>localStorage mirror</Pill>
      </RevealItem>
    </Section>
  );
}
