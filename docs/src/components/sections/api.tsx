import { API_ITEMS } from "@/lib/data";

import { RevealItem, RevealList } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

export function Api() {
  return (
    <Section
      id="api"
      eyebrow="API reference"
      title="A small surface,"
      accent="fully typed."
      description="Everything you can call lives on the root entry. No hidden singletons, no framework coupling — just functions with obvious contracts."
    >
      <RevealList
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.05}
      >
        {API_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <RevealItem key={item.name} className="h-full">
              <article className="group hover:border-brand-400/60 hover:shadow-brand-500/10 dark:hover:border-brand-400/40 flex h-full flex-col rounded-2xl border border-slate-900/10 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/3">
                <div className="flex items-center gap-3">
                  <span className="from-brand-500/15 to-accent-500/15 text-brand-600 ring-brand-500/20 dark:text-brand-300 grid size-10 place-items-center rounded-xl bg-linear-to-br ring-1">
                    <Icon className="size-4.5" />
                  </span>
                  <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </h3>
                </div>
                <code className="text-brand-700 dark:text-brand-200 mt-4 block overflow-x-auto rounded-lg bg-slate-900/4 px-3 py-2 font-mono text-[11px] leading-relaxed whitespace-pre dark:bg-white/5">
                  {item.signature}
                </code>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </article>
            </RevealItem>
          );
        })}
      </RevealList>
    </Section>
  );
}
