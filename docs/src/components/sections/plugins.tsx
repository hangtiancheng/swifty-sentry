import {
  Camera,
  Eye,
  Gauge,
  Plug,
  Puzzle,
  type LucideIcon,
} from "lucide-react";

import { CodeBlock } from "@/components/ui/code-block";
import { MonoTag } from "@/components/ui/pill";
import { Reveal, RevealItem, RevealList } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

interface PluginCard {
  readonly icon: LucideIcon;
  readonly name: string;
  readonly tagline: string;
  readonly constructorLine: string;
  readonly bullets: readonly string[];
}

const PLUGINS: readonly PluginCard[] = [
  {
    icon: Gauge,
    name: "PerformancePlugin",
    tagline: "Field performance, out of the box.",
    constructorLine: "enablePlugin(new PerformancePlugin())",
    bullets: [
      "LCP, FCP, CLS, INP and TTFB from web-vitals",
      "Custom First Screen Paint from DOM mutations",
      "Navigation, resource, long-task and memory data",
      "Zero constructor options, safe capability checks",
    ],
  },
  {
    icon: Camera,
    name: "ScreenRecordPlugin",
    tagline: "Replay the seconds that matter.",
    constructorLine: "new ScreenRecordPlugin({ durationMs: 5000 })",
    bullets: [
      "Rolling rrweb window, gzip + base64 encoded",
      "Configurable trigger event types",
      "Canvas recording and inline images enabled",
      "Decode with unzipScreenRecord() anywhere",
    ],
  },
  {
    icon: Eye,
    name: "ExposurePlugin",
    tagline: "Measure what people actually see.",
    constructorLine: "exposure.observe({ target, threshold, params })",
    bullets: [
      "IntersectionObserver with per-threshold reuse",
      "Visible duration, show times and custom params",
      "Batch observe and unobserve helpers",
      "Zod-validated targets and thresholds",
    ],
  },
];

const CUSTOM_PLUGIN_CODE = `import { SentryPlugin, enablePlugin } from "@swifty.js/sentry";

class HeartbeatPlugin extends SentryPlugin {
  private timer: ReturnType<typeof setInterval> | null = null;

  init(): void {
    this.timer = setInterval(() => {
      // traceCustomEvent({ name: "Heartbeat", message: "alive" });
    }, 30_000);
  }

  override destroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}

enablePlugin(new HeartbeatPlugin());`;

export function Plugins() {
  return (
    <Section
      id="plugins"
      eyebrow="Plugins"
      title="Optional power,"
      accent="opt-in bundle cost."
      description="Capabilities like performance, screen recording and exposure tracking live in @swifty.js/sentry/plugins. Import only what you enable — the core entry stays lean."
    >
      <RevealList className="grid gap-5 lg:grid-cols-3">
        {PLUGINS.map((plugin) => {
          const Icon = plugin.icon;
          return (
            <RevealItem key={plugin.name} className="h-full">
              <article className="group hover:border-brand-400/50 hover:shadow-brand-500/10 dark:hover:border-brand-400/40 flex h-full flex-col rounded-3xl border border-slate-900/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-white/3">
                <span className="from-brand-500/15 to-accent-500/15 text-brand-600 ring-brand-500/20 dark:text-brand-300 grid size-12 place-items-center rounded-2xl bg-linear-to-br ring-1 transition group-hover:scale-105">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 font-mono text-base font-bold text-slate-900 dark:text-white">
                  {plugin.name}
                </h3>
                <p className="text-brand-600 dark:text-brand-300 mt-1 text-sm font-medium">
                  {plugin.tagline}
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {plugin.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                    >
                      <span className="from-brand-500 to-accent-500 mt-1.5 size-1.5 shrink-0 rounded-full bg-linear-to-r" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 rounded-xl border border-slate-900/10 bg-slate-900/3 px-3 py-2 font-mono text-[11px] text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  {plugin.constructorLine}
                </p>
              </article>
            </RevealItem>
          );
        })}
      </RevealList>

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div>
            <span className="bg-brand-500/10 text-brand-600 dark:text-brand-300 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold">
              <Puzzle className="size-3.5" />
              Bring your own
            </span>
            <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Extend the SDK with a{" "}
              <span className="from-brand-500 to-accent-500 bg-linear-to-r bg-clip-text text-transparent">
                single class.
              </span>
            </h3>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
              Implement <MonoTag>SentryPlugin</MonoTag> and get lifecycle-aware{" "}
              <MonoTag>init()</MonoTag> and optional{" "}
              <MonoTag>destroy()</MonoTag> hooks. Plugins are registered once,
              stored in a set and cleaned up with <MonoTag>destroy()</MonoTag>.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-slate-900/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <Plug className="text-brand-500 dark:text-brand-300 size-4" />
                Abstract base class
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-slate-900/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <Camera className="text-brand-500 dark:text-brand-300 size-4" />
                Shared reporter instance
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <CodeBlock code={CUSTOM_PLUGIN_CODE} filename="heartbeat.plugin.ts" />
        </Reveal>
      </div>
    </Section>
  );
}
