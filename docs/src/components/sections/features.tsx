import { FEATURES } from "@/lib/data";

import { RevealItem, RevealList } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

export function Features() {
  return (
    <Section
      id="features"
      eyebrow="Platform"
      title="One SDK,"
      accent="every signal."
      description="Everything the browser can tell you about a session — errors, network, performance, behaviour and reliability — captured by a single, fully typed client that never blocks your app."
    >
      <RevealList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <RevealItem key={feature.title} className="h-full">
              <article className="group hover:border-brand-400/60 hover:shadow-brand-500/10 dark:hover:border-brand-400/40 relative h-full overflow-hidden rounded-2xl border border-slate-900/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-white/3 dark:hover:bg-white/5">
                <span className="via-brand-500/70 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                <span className="bg-brand-500/10 pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-2xl transition duration-300 group-hover:opacity-100" />
                <span className="from-brand-500/15 to-accent-500/15 text-brand-600 ring-brand-500/20 group-hover:ring-brand-500/40 dark:text-brand-300 relative grid size-11 place-items-center rounded-xl bg-linear-to-br ring-1 transition duration-300 group-hover:scale-105">
                  <Icon className="size-5" strokeWidth={2.2} />
                </span>
                <p className="text-brand-500/80 dark:text-brand-300/80 mt-4 text-[11px] font-bold tracking-[0.16em] uppercase">
                  {feature.tag}
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </article>
            </RevealItem>
          );
        })}
      </RevealList>
    </Section>
  );
}
