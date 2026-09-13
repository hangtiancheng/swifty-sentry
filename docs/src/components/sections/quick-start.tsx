import {
  Package,
  Plug,
  Radio,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";

import { CodeBlock } from "@/components/ui/code-block";
import { Reveal, RevealItem, RevealList } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

interface Step {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly code: string;
  readonly filename: string;
}

const STEPS: readonly Step[] = [
  {
    icon: Package,
    title: "Install the SDK",
    description:
      "One package. React, Vue, Vite and webpack are optional peers you only install when you use them.",
    filename: "terminal",
    code: "npm install @swifty.js/sentry",
  },
  {
    icon: Radio,
    title: "Initialize once",
    description:
      "Point the SDK at your report endpoint. Everything else falls back to sensible defaults.",
    filename: "src/main.ts",
    code: `import { init } from "@swifty.js/sentry";

init({
  dsn: "/api/log",
  projectId: "checkout-web",
  userId: "user-001",
});`,
  },
  {
    icon: Plug,
    title: "Enable the plugins you need",
    description:
      "Performance, screen recording and exposure tracking are opt-in and tree-shakeable.",
    filename: "src/plugins.ts",
    code: `import { enablePlugin } from "@swifty.js/sentry";
import {
  PerformancePlugin,
  ScreenRecordPlugin,
  ExposurePlugin,
} from "@swifty.js/sentry/plugins";

enablePlugin(
  new PerformancePlugin(),
  new ScreenRecordPlugin({ durationMs: 5000 }),
  new ExposurePlugin(),
);`,
  },
  {
    icon: WandSparkles,
    title: "Trace your own events",
    description:
      "Send business events, timings and manual errors with the same pipeline and hooks.",
    filename: "src/checkout.ts",
    code: `import { traceCustomEvent, traceError } from "@swifty.js/sentry";

traceCustomEvent({
  name: "CheckoutSuccess",
  message: "Submit order",
  extra: { orderId: "order-001" },
});

try {
  await pay();
} catch (error) {
  traceError(error);
}`,
  },
];

export function QuickStart() {
  return (
    <Section
      id="quickstart"
      eyebrow="Quick start"
      title="From zero to production"
      accent="in four steps."
      description="No agent, no config file, no build plugin required. This is the entire happy path."
    >
      <RevealList className="grid gap-6 lg:grid-cols-2">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <RevealItem key={step.title} className="h-full">
              <div className="flex h-full flex-col rounded-3xl border border-slate-900/10 bg-white p-6 dark:border-white/10 dark:bg-white/3">
                <div className="mb-5 flex items-center gap-3">
                  <span className="from-brand-500 to-accent-500 shadow-brand-500/25 relative grid size-11 place-items-center rounded-2xl bg-linear-to-br text-lg font-black text-white shadow-lg">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                      <Icon className="text-brand-500 dark:text-brand-300 size-4" />
                      {step.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="mt-auto">
                  <CodeBlock code={step.code} filename={step.filename} />
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealList>

      <Reveal delay={0.15} className="mt-8">
        <div className="border-brand-400/40 from-brand-500/10 to-accent-500/10 rounded-3xl border bg-linear-to-r via-transparent p-6 sm:p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Already initialized somewhere else?
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            The SDK is safe to guard with{" "}
            <span className="text-brand-600 dark:text-brand-300 font-mono text-[0.85em]">
              isInitialized()
            </span>
            , can be fully torn down with{" "}
            <span className="text-brand-600 dark:text-brand-300 font-mono text-[0.85em]">
              destroy()
            </span>
            , and keeps globalThis.__sentry__ available for live inspection
            while debugging.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
