import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Pill({
  children,
  icon: Icon,
  className,
}: {
  readonly children: ReactNode;
  readonly icon?: LucideIcon;
  readonly className?: string;
}) {
  return (
    <span
      className={`border-brand-300/60 text-brand-700 shadow-brand-500/10 dark:border-brand-400/25 dark:bg-brand-500/10 dark:text-brand-200 inline-flex items-center gap-2 rounded-full border bg-white/70 px-3.5 py-1.5 text-xs font-semibold shadow-sm backdrop-blur ${className ?? ""}`}
    >
      {Icon ? <Icon className="size-3.5" /> : null}
      {children}
    </span>
  );
}

export function MonoTag({
  children,
  className,
}: {
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <code
      className={`border-brand-200/70 bg-brand-50 text-brand-700 dark:border-brand-400/20 dark:bg-brand-500/10 dark:text-brand-200 rounded-md border px-1.5 py-0.5 font-mono text-[0.8em] font-medium ${className ?? ""}`}
    >
      {children}
    </code>
  );
}
