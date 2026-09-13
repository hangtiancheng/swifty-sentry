import { motion, useReducedMotion } from "motion/react";
import {
  Braces,
  Bug,
  Camera,
  Database,
  Globe,
  RefreshCw,
  Route,
  Send,
  TriangleAlert,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Pill } from "@/components/ui/pill";
import { RevealItem, RevealList } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

function DevCard({
  border,
  glow,
  title,
  description,
  children,
}: {
  readonly border: string;
  readonly glow: string;
  readonly title: string;
  readonly description: ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <RevealItem className="h-full">
      <div
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 ${border} dark:bg-ink-900/50 bg-white p-5 transition duration-300 hover:-translate-y-1 sm:p-6`}
      >
        <span
          className={`pointer-events-none absolute -top-24 -right-24 size-56 rounded-full ${glow} blur-3xl`}
        />
        <div className="bg-ink-950 relative mb-6 rounded-2xl border border-white/10 p-4 shadow-xl shadow-black/30">
          {children}
        </div>
        <h3 className="relative text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="relative mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
    </RevealItem>
  );
}

function TerminalMock() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="font-mono text-[13px] leading-6">
      <div className="flex items-center gap-2">
        <span className="text-emerald-400">➜</span>
        <span className="text-brand-300">~</span>
        <span className="text-slate-200">npm install @swifty.js/sentry</span>
        <motion.span
          aria-hidden
          animate={reduceMotion ? undefined : { opacity: [1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          className="bg-brand-400 inline-block h-4 w-2"
        />
      </div>
      <p className="mt-2 text-slate-500">added 1 package in 1.2s</p>
      <p className="text-slate-500">
        ready to monitor — no agent, no build step
      </p>
    </div>
  );
}

const CLASSIFICATION = [
  { label: "Code error", kind: "code", icon: Bug, tone: "text-accent-300" },
  {
    label: "Resource error",
    kind: "resource",
    icon: Globe,
    tone: "text-amber-300",
  },
  {
    label: "Runtime error",
    kind: "runtime",
    icon: TriangleAlert,
    tone: "text-brand-300",
  },
  {
    label: "Unknown reason",
    kind: "unknown",
    icon: Wifi,
    tone: "text-sky-300",
  },
] as const;

function ClassificationMock() {
  return (
    <ul className="space-y-2 font-mono text-xs">
      {CLASSIFICATION.map((item) => {
        const Icon = item.icon;
        return (
          <li
            key={item.label}
            className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
          >
            <span className="flex items-center gap-2 text-slate-200">
              <Icon className={`size-3.5 ${item.tone}`} />
              {item.label}
            </span>
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-300">
              {item.kind}
            </span>
          </li>
        );
      })}
      <li className="pt-1 text-[11px] text-slate-500">
        deduplicated · grouped after 2s · batched at 5
      </li>
    </ul>
  );
}

const WAVEFORM = [
  10, 18, 26, 16, 30, 22, 34, 20, 28, 14, 24, 32, 18, 26, 12, 22, 30, 16, 24,
  20,
];

function TimelineMock() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Camera className="size-3.5 text-lime-300" />
        Rolling rrweb window · gzip + base64
      </div>
      <div className="flex h-14 items-end gap-1">
        {WAVEFORM.map((height, index) => (
          <motion.span
            key={index}
            initial={reduceMotion ? { opacity: 0 } : { scaleY: 0.1 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.02,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ height: `${height * 1.6}px` }}
            className="from-brand-500/40 flex-1 origin-bottom rounded-sm bg-linear-to-t to-lime-300/80"
          />
        ))}
      </div>
      <ul className="space-y-1.5 font-mono text-[11px] text-slate-400">
        <li className="flex items-center gap-2">
          <Route className="text-brand-300 size-3" /> HistoryChange → /checkout
        </li>
        <li className="flex items-center gap-2">
          <Braces className="size-3 text-sky-300" /> POST /api/order · 500
        </li>
        <li className="flex items-center gap-2">
          <Bug className="text-accent-300 size-3" /> TypeError: total is
          undefined
        </li>
      </ul>
    </div>
  );
}

const QUEUE_STEPS: readonly {
  label: string;
  icon: LucideIcon;
  tone: string;
}[] = [
  { label: "Capture", icon: Bug, tone: "text-accent-300" },
  { label: "Queue", icon: Database, tone: "text-brand-300" },
  { label: "Beacon", icon: Send, tone: "text-sky-300" },
  { label: "Recover", icon: RefreshCw, tone: "text-lime-300" },
];

function OfflineMock() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {QUEUE_STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <span key={step.label} className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200">
                <Icon className={`size-3.5 ${step.tone}`} />
                {step.label}
              </span>
              {index < QUEUE_STEPS.length - 1 ? (
                <span className="text-slate-600">→</span>
              ) : null}
            </span>
          );
        })}
      </div>
      <div className="rounded-lg bg-white/5 p-3 font-mono text-[11px] text-slate-400">
        <p>
          localStorage["swifty_sentry_offline_cache"]{" "}
          <span className="text-lime-300">· 42 events</span>
        </p>
        <p className="mt-1">
          retry probe <span className="text-brand-300">HEAD /api/log</span> ·
          backoff 1s → 60s
        </p>
      </div>
    </div>
  );
}

export function DeveloperFirst() {
  return (
    <Section
      eyebrow="Developer first"
      title="Built for the people"
      accent="who ship."
      description="No agents to install, no dashboards to learn. A tiny client, honest defaults and escape hatches everywhere."
    >
      <RevealList className="grid gap-5 lg:grid-cols-2">
        <DevCard
          border="border-brand-400/50"
          glow="bg-brand-500/20"
          title="Monitor in five lines"
          description="Drop in the SDK and you are done. The core is tree-shakeable, framework agnostic and safe to import on any page."
        >
          <TerminalMock />
        </DevCard>

        <DevCard
          border="border-accent-400/50"
          glow="bg-accent-500/20"
          title="Classify every issue automatically"
          description="Code, resource, runtime and unknown errors each take a dedicated path, so routing, dedup and batching behave predictably."
        >
          <ClassificationMock />
        </DevCard>

        <DevCard
          border="border-lime-400/50"
          glow="bg-lime-400/20"
          title="See the session, not just the stack"
          description="Breadcrumbs and a compressed rrweb window replay the moments before a failure — clicks, routes, requests and the DOM."
        >
          <TimelineMock />
        </DevCard>

        <DevCard
          border="border-sky-400/50"
          glow="bg-sky-400/20"
          title="Stay in the flow, even offline"
          description="Events persist to localStorage, ship with sendBeacon and recover through an exponential health probe when the network returns."
        >
          <OfflineMock />
        </DevCard>
      </RevealList>

      <RevealItem className="mt-8 flex flex-wrap items-center gap-3">
        <Pill icon={Bug}>Dedup by error identity</Pill>
        <Pill icon={Database}>Bounded FIFO breadcrumbs</Pill>
        <Pill icon={RefreshCw}>Zero-loss offline queue</Pill>
        <Pill icon={Camera}>Screen record on demand</Pill>
      </RevealItem>
    </Section>
  );
}
