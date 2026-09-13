import type { ReactNode } from "react";

import { Reveal } from "./reveal";

interface SectionProps {
  readonly id?: string;
  readonly eyebrow?: string;
  readonly title: ReactNode;
  readonly accent?: ReactNode;
  readonly description?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly contentClassName?: string;
}

export function Section({
  id,
  eyebrow,
  title,
  accent,
  description,
  children,
  className,
  contentClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 py-20 sm:py-28 ${className ?? ""}`}
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          {eyebrow ? (
            <p className="text-brand-600 dark:text-brand-300 mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase">
              <span className="from-brand-500 to-accent-500 h-px w-8 bg-linear-to-r" />
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-3xl font-black tracking-tight text-balance text-slate-900 sm:text-4xl lg:text-[2.9rem] lg:leading-[1.08] dark:text-white">
            {title}
            {accent ? (
              <>
                {" "}
                <span className="from-brand-500 via-brand-400 to-accent-500 bg-linear-to-r bg-clip-text text-transparent">
                  {accent}
                </span>
              </>
            ) : null}
          </h2>
          {description ? (
            <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              {description}
            </p>
          ) : null}
        </Reveal>
        <div className={`mt-12 sm:mt-14 ${contentClassName ?? ""}`}>
          {children}
        </div>
      </div>
    </section>
  );
}
