import { GithubIcon } from "./icons/github-icon";
import { Icon } from "./icons/icon";
import { Logo } from "./logo";
import { handleAnchorClick } from "@/lib/scroll";

const REPO = "https://github.com/hangtiancheng/swifty-sentry";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Analytics", href: "#analytics" },
      { label: "Performance", href: "#performance" },
      { label: "Plugins", href: "#plugins" },
      { label: "Reliability", href: "#reliability" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Quick start", href: "#quickstart" },
      { label: "Frameworks", href: "#frameworks" },
      { label: "Configuration", href: "#options" },
      { label: "API reference", href: "#api" },
      { label: "Integrations", href: "#integrations" },
    ],
  },
] as const;

const EXTERNAL_LINKS = [
  { label: "GitHub", href: REPO },
  {
    label: "npm package",
    href: "https://www.npmjs.com/package/@swifty.js/sentry",
  },
  { label: "Report an issue", href: `${REPO}/issues` },
  { label: "MIT License", href: `${REPO}/blob/main/LICENSE` },
] as const;

export function Footer() {
  return (
    <footer className="dark:bg-ink-950 border-t border-slate-900/10 bg-white dark:border-white/10">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              A framework-agnostic browser monitoring SDK for errors, network,
              performance, behaviour and reliability. Built to be small, typed
              and pleasant to integrate.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={REPO}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub repository"
                className="hover:border-brand-400/60 hover:text-brand-600 dark:hover:text-brand-200 grid size-9 place-items-center rounded-xl border border-slate-900/10 text-slate-600 transition dark:border-white/10 dark:text-slate-300"
              >
                <GithubIcon className="size-4.5" />
              </a>
              <span className="rounded-full border border-slate-900/10 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-white/10 dark:text-slate-400">
                v0.0.7
              </span>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title}>
              <h3 className="text-xs font-bold tracking-[0.18em] text-slate-900 uppercase dark:text-white">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(event) => handleAnchorClick(event, link.href)}
                      className="hover:text-brand-600 dark:hover:text-brand-200 inline-block py-1.5 text-sm text-slate-600 transition dark:text-slate-400"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav>
            <h3 className="text-xs font-bold tracking-[0.18em] text-slate-900 uppercase dark:text-white">
              Resources
            </h3>
            <ul className="mt-4 space-y-2.5">
              {EXTERNAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group hover:text-brand-600 dark:hover:text-brand-200 inline-flex items-center gap-1 py-1.5 text-sm text-slate-600 transition dark:text-slate-400"
                  >
                    {link.label}
                    <Icon
                      name="arrow-up-right"
                      className="size-3.5 opacity-0 transition group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-900/10 pt-6 sm:flex-row dark:border-white/10">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Swifty Sentry. Released under the MIT
            License.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Made for developers who ship.
          </p>
        </div>
      </div>
    </footer>
  );
}
