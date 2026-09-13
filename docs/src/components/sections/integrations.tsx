import { FileCode, Server, Terminal, type LucideIcon } from "lucide-react";

import { CodeBlock } from "@/components/ui/code-block";
import { Pill } from "@/components/ui/pill";
import { Reveal, RevealItem, RevealList } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

const VITE_CODE = `// vite.config.ts
import { defineConfig } from "vite";
import { sentryPlugin } from "@swifty.js/sentry/vite";

export default defineConfig({
  plugins: [sentryPlugin({ dsn: "/api/log" })],
});`;

const WEBPACK_CODE = `// webpack.config.mjs
import { sentryPlugin } from "@swifty.js/sentry/webpack";

export default {
  plugins: [sentryPlugin({ dsn: "/api/log" })],
  devServer: { /* your config */ },
};`;

const RESOLVED_FRAME = `TypeError: total is undefined
  at calculateTotal (src/cart.ts:42:18)   // ← original source
    40 |   const items = cart.lineItems;
    41 |   const total = items.reduce((sum, item) => sum + item.price, 0);
  > 42 |   return total.toFixed(2);
       |                ^
    43 | }`;

interface DevTool {
  readonly icon: LucideIcon;
  readonly name: string;
  readonly blurb: string;
  readonly code: string;
  readonly filename: string;
}

const DEV_TOOLS: readonly DevTool[] = [
  {
    icon: Server,
    name: "Vite dev server",
    blurb:
      "Intercepts the mock endpoint, writes timestamped JSONL logs and resolves stacks from the in-memory module graph.",
    code: VITE_CODE,
    filename: "vite.config.ts",
  },
  {
    icon: Terminal,
    name: "webpack-dev-server",
    blurb:
      "Collects emitted .map assets with assetEmitted and enriches error records before writing them to disk.",
    code: WEBPACK_CODE,
    filename: "webpack.config.mjs",
  },
];

export function Integrations() {
  return (
    <Section
      id="integrations"
      eyebrow="Developer tooling"
      title="Readable stacks"
      accent="during development."
      description="Both dev-server plugins mock your report endpoint so nothing hits production, then map bundled positions back to the original source with inline snippets."
    >
      <RevealList className="grid gap-5 lg:grid-cols-2">
        {DEV_TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <RevealItem key={tool.name} className="h-full">
              <div className="flex h-full flex-col rounded-3xl border border-slate-900/10 bg-white p-6 dark:border-white/10 dark:bg-white/3">
                <div className="mb-5 flex items-center gap-3">
                  <span className="from-brand-500/15 to-accent-500/15 text-brand-600 ring-brand-500/20 dark:text-brand-300 grid size-11 place-items-center rounded-xl bg-linear-to-br ring-1">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {tool.name}
                  </h3>
                </div>
                <p className="mb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {tool.blurb}
                </p>
                <div className="mt-auto">
                  <CodeBlock code={tool.code} filename={tool.filename} />
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealList>

      <Reveal delay={0.1} className="mt-6">
        <div className="grid items-center gap-8 rounded-3xl border border-slate-900/10 bg-white p-6 sm:p-8 lg:grid-cols-2 dark:border-white/10 dark:bg-white/3">
          <div>
            <span className="bg-brand-500/10 text-brand-600 dark:text-brand-300 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold">
              <FileCode className="size-3.5" />
              Source map resolution
            </span>
            <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Minified in the browser.{" "}
              <span className="from-brand-500 to-accent-500 bg-linear-to-r bg-clip-text text-transparent">
                Readable in your logs.
              </span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Error, stack-like and framework records are enriched with original
              file, line, column, symbol name and a three-line snippet on each
              side of the failing line. Resolution failures stay silent and
              never corrupt the raw report.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Pill icon={FileCode}>Code errors</Pill>
              <Pill icon={Terminal}>Stack strings</Pill>
              <Pill icon={Server}>React · Vue · Other</Pill>
            </div>
          </div>
          <CodeBlock
            code={RESOLVED_FRAME}
            filename="resolved-frame.log"
            chrome
          />
        </div>
      </Reveal>
    </Section>
  );
}
