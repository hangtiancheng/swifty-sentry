import { Eye, MousePointerClick, Route, Timer } from "lucide-react";
import type { ReactNode } from "react";

import { CodeBlock } from "@/components/ui/code-block";
import { MonoTag, Pill } from "@/components/ui/pill";
import { Reveal, RevealItem, RevealList } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

const PV_CODE = `// Automatic — no wiring required.
// PageLoad · HistoryChange · HashChange · PageDwell

import { tracePageView } from "@swifty.js/sentry";

tracePageView({
  name: "ProductDetail",
  message: location.href,
  extra: { productId: "sku-001" },
});`;

const CLICK_HTML = `<a
  swifty-sentry-ev="open-banner"
  swifty-sentry-msg="Open campaign banner"
  swifty-sentry-campaign="spring"
  swifty-sentry-rank="1"
>
  Campaign
</a>`;

const EXPOSURE_CODE = `const exposure = new ExposurePlugin();
enablePlugin(exposure);

exposure.observe({
  target: document.querySelector("#banner"),
  threshold: 0.5,
  params: { bannerId: "spring-001" },
});`;

const DWELL_ROWS = [
  {
    label: "PageLoad",
    value: "2.4s",
    width: "22%",
    tone: "from-brand-500 to-brand-400",
  },
  {
    label: "HistoryChange",
    value: "8.1s",
    width: "64%",
    tone: "from-accent-500 to-accent-400",
  },
  {
    label: "PageDwell",
    value: "12.4s",
    width: "92%",
    tone: "from-brand-400 to-accent-400",
  },
] as const;

function AnalyticsCard({
  icon: Icon,
  label,
  title,
  children,
}: {
  readonly icon: typeof Timer;
  readonly label: string;
  readonly title: string;
  readonly children: ReactNode;
}) {
  return (
    <RevealItem className="h-full">
      <article className="flex h-full flex-col rounded-3xl border border-slate-900/10 bg-white p-6 dark:border-white/10 dark:bg-white/3">
        <span className="from-brand-500/15 to-accent-500/15 text-brand-600 ring-brand-500/20 dark:text-brand-300 grid size-11 place-items-center rounded-xl bg-linear-to-br ring-1">
          <Icon className="size-5" />
        </span>
        <p className="text-brand-500/80 dark:text-brand-300/80 mt-4 text-[11px] font-bold tracking-[0.16em] uppercase">
          {label}
        </p>
        <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <div className="mt-4 flex-1">{children}</div>
      </article>
    </RevealItem>
  );
}

function DwellVisual() {
  return (
    <div className="space-y-3">
      {DWELL_ROWS.map((row) => (
        <div key={row.label}>
          <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-300">
              {row.label}
            </span>
            <span className="font-mono text-slate-400">{row.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-900/5 dark:bg-white/5">
            <div
              className={`h-full rounded-full bg-linear-to-r ${row.tone}`}
              style={{ width: row.width }}
            />
          </div>
        </div>
      ))}
      <p className="pt-1 text-xs text-slate-500 dark:text-slate-400">
        Dwell under 100&nbsp;ms is dropped as noise. The final window is flushed
        on <MonoTag>pagehide</MonoTag> so mobile sessions are never lost.
      </p>
    </div>
  );
}

function ExposureVisual() {
  return (
    <div className="space-y-3">
      <div className="border-brand-400/50 bg-brand-500/5 relative overflow-hidden rounded-xl border border-dashed p-4">
        <div className="via-accent-400/70 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent" />
        <div className="flex items-center justify-between">
          <span className="dark:bg-ink-800 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-sm dark:text-white">
            <Eye className="text-brand-500 dark:text-brand-300 size-3.5" />
            #banner
          </span>
          <span className="bg-accent-500/15 text-accent-600 dark:text-accent-300 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold">
            visible 4.8s
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-900/10 dark:bg-white/10">
          <div className="from-brand-500 to-accent-500 h-full w-3/4 rounded-full bg-linear-to-r" />
        </div>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        One observer per unique threshold, reused across every target. Reported
        when an element leaves the viewport after being visible.
      </p>
    </div>
  );
}

export function Analytics() {
  return (
    <Section
      id="analytics"
      eyebrow="Product analytics"
      title="Understand journeys,"
      accent="not just crashes."
      description="Behavioural signals live next to your error data. See which page a session lingered on, what people clicked and how long a promotion stayed on screen."
    >
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-3xl border border-slate-900/10 bg-white p-6 dark:border-white/10 dark:bg-white/3">
            <DwellVisual />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <CodeBlock code={PV_CODE} filename="analytics.ts" />
        </Reveal>
      </div>

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
        <Reveal className="lg:order-2">
          <div className="rounded-3xl border border-slate-900/10 bg-white p-6 dark:border-white/10 dark:bg-white/3">
            <p className="mb-4 text-sm font-bold text-slate-900 dark:text-white">
              Declarative click attributes
            </p>
            <dl className="space-y-3 text-sm">
              {[
                ["swifty-sentry-ev", "Explicit event id, first priority."],
                ["swifty-sentry-msg", "Human-readable message."],
                ["swifty-sentry-view", "Container id fallback."],
                ["swifty-sentry-*", "Any other attribute becomes a param."],
              ].map(([attr, description]) => (
                <div
                  key={attr}
                  className="flex flex-col gap-0.5 sm:flex-row sm:gap-3"
                >
                  <dt className="w-44 shrink-0">
                    <MonoTag>{attr}</MonoTag>
                  </dt>
                  <dd className="text-slate-600 dark:text-slate-400">
                    {description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:order-1">
          <CodeBlock code={CLICK_HTML} filename="hero.html" />
        </Reveal>
      </div>

      <RevealList className="mt-14 grid gap-5 lg:grid-cols-3">
        <AnalyticsCard
          icon={Route}
          label="Signals"
          title="Automatic page views"
        >
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            <MonoTag>PageLoad</MonoTag>, <MonoTag>HistoryChange</MonoTag> and{" "}
            <MonoTag>HashChange</MonoTag> are captured from day one, each with
            its URL, referrer and entry time.
          </p>
        </AnalyticsCard>

        <AnalyticsCard
          icon={MousePointerClick}
          label="Interaction"
          title="Zero-code click tracking"
        >
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Clicks report coordinates, element path, custom params and resolved
            event id — plain clicks stay out of your bill.
          </p>
        </AnalyticsCard>

        <AnalyticsCard icon={Eye} label="Visibility" title="Exposure durations">
          <ExposureVisual />
        </AnalyticsCard>
      </RevealList>

      <Reveal delay={0.1} className="mt-10">
        <div className="overflow-hidden rounded-3xl border border-slate-900/10 dark:border-white/10">
          <CodeBlock code={EXPOSURE_CODE} filename="exposure.ts" />
        </div>
      </Reveal>

      <RevealItem className="mt-8 flex flex-wrap gap-3">
        <Pill icon={Timer}>Dwell-time reporting</Pill>
        <Pill icon={MousePointerClick}>Throttled clicks</Pill>
        <Pill icon={Eye}>Threshold-aware observers</Pill>
      </RevealItem>
    </Section>
  );
}
