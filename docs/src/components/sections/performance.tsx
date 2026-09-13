import { motion, useReducedMotion } from "motion/react";
import {
  Activity,
  Gauge,
  Layers,
  MemoryStick,
  Route,
  Timer,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { CodeBlock } from "@/components/ui/code-block";
import { Pill } from "@/components/ui/pill";
import { Reveal, RevealItem, RevealList } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

const PERFORMANCE_CODE = `import { enablePlugin, tracePerformance } from "@swifty.js/sentry";
import { PerformancePlugin } from "@swifty.js/sentry/plugins";

enablePlugin(new PerformancePlugin());

tracePerformance({
  name: "SearchLatency",
  message: "/api/search",
  value: 128,
});`;

const VITALS = [
  {
    name: "LCP",
    label: "Largest Contentful Paint",
    value: "1.24s",
    width: "38%",
    rating: "good",
  },
  {
    name: "FCP",
    label: "First Contentful Paint",
    value: "0.90s",
    width: "28%",
    rating: "good",
  },
  {
    name: "CLS",
    label: "Cumulative Layout Shift",
    value: "0.02",
    width: "12%",
    rating: "good",
  },
  {
    name: "INP",
    label: "Interaction to Next Paint",
    value: "86ms",
    width: "22%",
    rating: "good",
  },
  {
    name: "TTFB",
    label: "Time to First Byte",
    value: "0.31s",
    width: "16%",
    rating: "good",
  },
  {
    name: "FSP",
    label: "First Screen Paint",
    value: "1.10s",
    width: "34%",
    rating: "custom",
  },
] as const;

interface MetricSource {
  readonly icon: LucideIcon;
  readonly name: string;
  readonly source: string;
  readonly description: string;
}

const METRIC_SOURCES: readonly MetricSource[] = [
  {
    icon: Activity,
    name: "NavigationTiming",
    source: "Navigation Timing API",
    description:
      "paint, DOM, load, DNS, TCP, TLS, TTFB, transfer and redirect breakdown.",
  },
  {
    icon: Layers,
    name: "ResourceList",
    source: "performance.getEntriesByType",
    description:
      "Snapshot of every buffered resource with cache and transfer sizes.",
  },
  {
    icon: Route,
    name: "ResourceTiming",
    source: "PerformanceObserver",
    description:
      "Per-resource durations as they complete, with element fallback.",
  },
  {
    icon: Zap,
    name: "LongTask",
    source: "PerformanceObserver",
    description:
      "Main-thread tasks that block interaction, reported as entries.",
  },
  {
    icon: MemoryStick,
    name: "Memory",
    source: "measureUserAgentSpecificMemory",
    description: "Chrome-only memory attribution when the API is available.",
  },
];

export function Performance() {
  const reduceMotion = useReducedMotion();

  return (
    <Section
      id="performance"
      eyebrow="Performance"
      title="Real user metrics,"
      accent="measured in the field."
      description="Web Vitals and a full navigation timing breakdown run beside your errors, so a slow request and a crash are one story."
    >
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <div className="h-full rounded-3xl border border-slate-900/10 bg-white p-6 dark:border-white/10 dark:bg-white/3">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="from-brand-500/15 to-accent-500/15 text-brand-600 ring-brand-500/20 dark:text-brand-300 grid size-9 place-items-center rounded-xl bg-linear-to-br ring-1">
                  <Gauge className="size-4" />
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Web Vitals
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-300">
                all good
              </span>
            </div>
            <div className="space-y-5">
              {VITALS.map((vital, index) => (
                <div key={vital.name}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      <span className="text-brand-600 dark:text-brand-300 font-mono text-xs font-bold">
                        {vital.name}
                      </span>
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        {vital.label}
                      </span>
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      {vital.value}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-900/5 dark:bg-white/5">
                    <motion.div
                      initial={reduceMotion ? { opacity: 0 } : { width: 0 }}
                      whileInView={{ width: vital.width, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.9,
                        delay: index * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="from-brand-500 to-accent-500 h-full rounded-full bg-linear-to-r"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="h-full">
          <CodeBlock
            code={PERFORMANCE_CODE}
            filename="performance.ts"
            className="h-full"
          />
        </Reveal>
      </div>

      <RevealList className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {METRIC_SOURCES.map((source) => {
          const Icon = source.icon;
          return (
            <RevealItem key={source.name} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-slate-900/10 bg-white p-5 dark:border-white/10 dark:bg-white/3">
                <div className="flex items-center gap-2.5">
                  <span className="bg-brand-500/10 text-brand-600 dark:text-brand-300 grid size-9 place-items-center rounded-lg">
                    <Icon className="size-4" />
                  </span>
                  <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {source.name}
                  </h3>
                </div>
                <p className="text-brand-500/80 dark:text-brand-300/80 mt-3 text-[11px] font-bold tracking-wide uppercase">
                  {source.source}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {source.description}
                </p>
              </article>
            </RevealItem>
          );
        })}
        <RevealItem className="h-full">
          <article className="border-brand-400/40 from-brand-500/10 to-accent-500/10 flex h-full flex-col justify-center rounded-2xl border bg-linear-to-br p-5">
            <Timer className="text-brand-600 dark:text-brand-300 size-5" />
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              Report your own
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Any timing you own can be sent as a performance event with{" "}
              <span className="font-mono text-[0.85em]">tracePerformance</span>.
            </p>
          </article>
        </RevealItem>
      </RevealList>

      <RevealItem className="mt-8 flex flex-wrap gap-3">
        <Pill icon={Gauge}>Web Vitals via web-vitals</Pill>
        <Pill icon={Activity}>Field navigation timing</Pill>
        <Pill icon={Zap}>Long task visibility</Pill>
        <Pill icon={MemoryStick}>Memory attribution</Pill>
      </RevealItem>
    </Section>
  );
}
