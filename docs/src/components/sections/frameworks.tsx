import { AnimatePresence, motion } from "motion/react";
import { Boxes, Component, Layers, TriangleAlert } from "lucide-react";
import { useState } from "react";

import { CodeBlock } from "@/components/ui/code-block";
import { MonoTag } from "@/components/ui/pill";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

type FrameworkKey = "vanilla" | "react" | "vue";

interface FrameworkTab {
  readonly key: FrameworkKey;
  readonly label: string;
  readonly icon: typeof Boxes;
  readonly filename: string;
  readonly code: string;
  readonly note: string;
}

const TABS: readonly FrameworkTab[] = [
  {
    key: "vanilla",
    label: "Vanilla",
    icon: Boxes,
    filename: "main.ts",
    code: `import { init, enablePlugin } from "@swifty.js/sentry";
import { PerformancePlugin } from "@swifty.js/sentry/plugins";

init({ dsn: "/api/log", projectId: "vanilla-app" });

enablePlugin(new PerformancePlugin());`,
    note: "The core entry is framework agnostic and safe to import anywhere. No framework dependency is ever pulled into your bundle.",
  },
  {
    key: "react",
    label: "React",
    icon: Component,
    filename: "app.tsx",
    code: `import { init } from "@swifty.js/sentry";
import { ReactErrorBoundary } from "@swifty.js/sentry/react";

init({ dsn: "/api/log", projectId: "react-app" });

export function App() {
  return (
    <ReactErrorBoundary
      fallback={(error) => <div>{error.message}</div>}
    >
      <Page />
    </ReactErrorBoundary>
  );
}`,
    note: "The boundary reports caught render errors as React events with the component stack. Async callbacks, event handlers and SSR errors still need traceError().",
  },
  {
    key: "vue",
    label: "Vue 3",
    icon: Layers,
    filename: "main.ts",
    code: `import { createApp } from "vue";
import { vuePlugin } from "@swifty.js/sentry/vue";
import App from "./app.vue";

const app = createApp(App);

app.use(vuePlugin, {
  dsn: "/api/log",
  projectId: "vue-app",
});

app.mount("#app");`,
    note: "vuePlugin wraps app.config.errorHandler, reports Vue errors with the instance and info string, then calls any handler you had installed before.",
  },
];

const HIGHLIGHTS = [
  {
    title: "One boundary, full context",
    body: "Caught React errors carry the ErrorInfo component stack straight into the report context.",
  },
  {
    title: "Chain-safe error handlers",
    body: "The Vue plugin captures the previous handler and always delegates after reporting.",
  },
  {
    title: "Any other framework",
    body: "Call reportFrameworkError with EventType.OtherFrameworks and your own context object.",
  },
] as const;

export function Frameworks() {
  const [active, setActive] = useState<FrameworkKey>("react");
  const current = TABS.find((tab) => tab.key === active) ?? TABS[0]!;

  return (
    <Section
      id="frameworks"
      eyebrow="Frameworks"
      title="First-class where it counts."
      accent=""
      description="React and Vue ship as dedicated subpath exports. Everyone else uses the same typed core with reportFrameworkError."
    >
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div className="flex flex-col gap-2">
            <div className="inline-flex rounded-2xl border border-slate-900/10 bg-white p-1.5 dark:border-white/10 dark:bg-white/3">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.key === active;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActive(tab.key)}
                    className="relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition"
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="framework-tab"
                        className="from-brand-500 to-accent-500 shadow-brand-500/25 absolute inset-0 rounded-xl bg-linear-to-r shadow-lg"
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 30,
                        }}
                      />
                    ) : null}
                    <span
                      className={`relative z-10 flex items-center gap-2 ${
                        isActive
                          ? "text-white"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Icon className="size-4" />
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-slate-900/10 bg-white p-5 dark:border-white/10 dark:bg-white/3">
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                >
                  {current.note}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-2 space-y-3">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-900/10 bg-white p-4 dark:border-white/10 dark:bg-white/3"
                >
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <CodeBlock
                code={current.code}
                filename={current.filename}
                showLineNumbers
              />
            </motion.div>
          </AnimatePresence>
          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
            Boundaries only catch synchronous render errors. Use{" "}
            <MonoTag>traceError()</MonoTag> for async and event-handler
            failures.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
