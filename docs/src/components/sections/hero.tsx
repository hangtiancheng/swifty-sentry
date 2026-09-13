import { GithubIcon } from "@/components/icons/github-icon";
import { Icon } from "@/components/icons/icon";
import { handleAnchorClick } from "@/lib/scroll";
import { HERO_CODE } from "./snippets";

const TRUST_ITEMS = [
  "TypeScript-first",
  "React & Vue",
  "Tree-shakeable",
  "MIT licensed",
] as const;

const STATS = [
  { value: "5 lines", label: "to full observability" },
  { value: "16", label: "captured event types" },
  { value: "6", label: "tree-shakeable entry points" },
  { value: "100%", label: "typed public surface" },
] as const;

interface FloatingCard {
  readonly icon: string;
  readonly title: string;
  readonly subtitle: string;
  readonly className: string;
  readonly delay: number;
  readonly accent: string;
}

const FLOATING_CARDS: readonly FloatingCard[] = [
  {
    icon: "bug",
    title: "Error captured",
    subtitle: "deduplicated · batched",
    className: "-top-6 -left-4 sm:-left-10",
    delay: 0.5,
    accent: "text-accent-500 dark:text-accent-400",
  },
  {
    icon: "gauge",
    title: "LCP 1.24s",
    subtitle: "rating: good",
    className: "-right-3 top-24 sm:-right-8",
    delay: 0.7,
    accent: "text-emerald-500 dark:text-emerald-400",
  },
  {
    icon: "timer",
    title: "PV recorded",
    subtitle: "dwell 12.4s",
    className: "-bottom-6 left-6 sm:left-10",
    delay: 0.9,
    accent: "text-brand-500 dark:text-brand-300",
  },
];

function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="from-brand-100/70 dark:from-brand-950/50 dark:via-ink-950 dark:to-ink-950 absolute inset-0 bg-linear-to-b via-white to-white" />
      <div className="bg-brand-500/25 dark:bg-brand-600/30 absolute -top-48 left-1/2 h-136 w-216 -translate-x-1/2 rounded-full blur-[130px]" />
      <loop-effect
        keyframes={{ x: [0, 40, 0], y: [0, 30, 0] }}
        duration={16}
        className="bg-accent-500/25 absolute top-44 -left-24 h-72 w-72 rounded-full blur-[110px]"
      />
      <loop-effect
        keyframes={{ x: [0, -40, 0], y: [0, -30, 0] }}
        duration={18}
        className="bg-brand-400/25 absolute right-0 bottom-0 h-80 w-80 rounded-full blur-[120px]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,110,180,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,110,180,0.14)_1px,transparent_1px)] mask-[radial-gradient(ellipse_65%_55%_at_50%_35%,black,transparent)] bg-size-[56px_56px] dark:bg-[linear-gradient(to_right,rgba(168,140,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,140,255,0.1)_1px,transparent_1px)]" />
    </div>
  );
}

function FloatingBadge({ card }: { readonly card: FloatingCard }) {
  return (
    <enter-effect
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      duration={0.6}
      delay={card.delay}
      className={`dark:bg-ink-900/90 dark:shadow-brand-950/40 absolute z-20 hidden items-center gap-2.5 rounded-2xl border border-slate-900/10 bg-white/90 px-3.5 py-2.5 shadow-xl shadow-slate-900/10 backdrop-blur md:flex dark:border-white/10 ${card.className}`}
    >
      <loop-effect
        keyframes={{ y: [0, -4, 0] }}
        duration={4}
        className="bg-brand-100/70 grid size-8 place-items-center rounded-xl dark:bg-white/5"
      >
        <Icon name={card.icon} className={`size-4 ${card.accent}`} />
      </loop-effect>
      <span className="leading-tight">
        <span className="block text-xs font-bold text-slate-900 dark:text-white">
          {card.title}
        </span>
        <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400">
          {card.subtitle}
        </span>
      </span>
    </enter-effect>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-36">
      <HeroBackdrop />
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <ui-reveal>
              <a
                href="#features"
                onClick={(event) => handleAnchorClick(event, "#features")}
                className="group border-brand-300/60 text-brand-700 hover:border-brand-400 dark:border-brand-400/25 dark:bg-brand-500/10 dark:text-brand-200 inline-flex max-w-full items-center gap-2 rounded-full border bg-white/70 py-1.5 pr-4 pl-1.5 text-xs font-semibold shadow-sm backdrop-blur transition"
              >
                <span className="from-brand-500 to-accent-500 inline-flex items-center gap-1.5 rounded-full bg-linear-to-r px-2.5 py-1 text-[11px] font-bold text-white">
                  <Icon name="sparkles" className="size-3" />
                  v0.0.7
                </span>
                Plugins, offline reporting & dev-time source maps
                <Icon
                  name="arrow-right"
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </ui-reveal>

            <ui-reveal delay={0.05}>
              <h1 className="mt-7 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white">
                Ship fast.
                <br />
                <span className="from-brand-500 via-brand-400 to-accent-500 bg-linear-to-r bg-clip-text text-transparent">
                  Miss nothing.
                </span>
              </h1>
            </ui-reveal>

            <ui-reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Swifty Sentry is a framework-agnostic monitoring SDK that
                catches errors, HTTP, Web Vitals, page views, clicks, exposure,
                blank screens and sessions — from five lines of code.
              </p>
            </ui-reveal>

            <ui-reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#quickstart"
                  onClick={(event) => handleAnchorClick(event, "#quickstart")}
                  className="group from-brand-500 to-accent-500 shadow-brand-500/30 hover:shadow-brand-500/50 inline-flex items-center gap-2 rounded-xl bg-linear-to-r px-5 py-3 text-sm font-bold text-white shadow-xl transition"
                >
                  Get started
                  <Icon
                    name="arrow-right"
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </a>
                <a
                  href="https://github.com/hangtiancheng/swifty-sentry"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:border-brand-400/60 hover:text-brand-600 dark:hover:text-brand-200 inline-flex items-center gap-2 rounded-xl border border-slate-900/15 bg-white/60 px-5 py-3 text-sm font-bold text-slate-700 backdrop-blur transition dark:border-white/15 dark:bg-white/5 dark:text-slate-200"
                >
                  <GithubIcon className="size-4" />
                  Star on GitHub
                </a>
              </div>
            </ui-reveal>

            <ui-reveal delay={0.24}>
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {TRUST_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400"
                  >
                    <Icon
                      name="check"
                      className="text-brand-500 dark:text-brand-300 size-3.5"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </ui-reveal>
          </div>

          <div className="relative">
            <FloatingBadge card={FLOATING_CARDS[0]!} />
            <FloatingBadge card={FLOATING_CARDS[1]!} />
            <FloatingBadge card={FLOATING_CARDS[2]!} />
            <enter-effect
              initial={{ opacity: 0, y: 30, rotateX: 8 }}
              duration={0.8}
              delay={0.15}
              className="relative z-10"
            >
              <div className="from-brand-500/30 to-accent-500/30 absolute -inset-4 -z-10 rounded-4xl bg-linear-to-br via-transparent blur-2xl" />
              <code-block
                code={HERO_CODE}
                filename="src/main.ts"
                showLineNumbers
              />
            </enter-effect>
          </div>
        </div>

        <ui-reveal delay={0.2} className="mt-20">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-900/10 bg-slate-900/10 lg:grid-cols-4 dark:border-white/10 dark:bg-white/10">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="dark:bg-ink-950 flex flex-col-reverse bg-white px-6 py-6 text-center"
              >
                <dt className="mt-1 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                  {stat.label}
                </dt>
                <dd className="from-brand-600 to-accent-500 bg-linear-to-r bg-clip-text text-3xl font-black text-transparent">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </ui-reveal>
      </div>
    </section>
  );
}
