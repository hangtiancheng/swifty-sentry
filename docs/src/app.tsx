import { Footer } from "./components/footer";
import { Analytics } from "./components/sections/analytics";
import { Api } from "./components/sections/api";
import { CTA } from "./components/sections/cta";
import { DeveloperFirst } from "./components/sections/developer-first";
import { Features } from "./components/sections/features";
import { Hero } from "./components/sections/hero";
import { Integrations } from "./components/sections/integrations";
import { Options } from "./components/sections/options";
import { Performance } from "./components/sections/performance";
import { Plugins } from "./components/sections/plugins";
import { QuickStart } from "./components/sections/quick-start";
import { Reliability } from "./components/sections/reliability";

// Defines every custom element used below before the first render.
import "./components/elements";

export function App() {
  return (
    <div className="selection:bg-brand-500/30 selection:text-brand-950 dark:bg-ink-950 dark:selection:bg-brand-400/30 min-h-dvh overflow-x-clip bg-white text-slate-900 dark:text-slate-100 dark:selection:text-white">
      <scroll-progress className="from-brand-500 via-accent-500 to-brand-400 fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-linear-to-r" />
      <site-navbar />
      <main>
        <Hero />
        <Features />
        <DeveloperFirst />
        <Analytics />
        <Performance />
        <Reliability />
        <Plugins />
        <frameworks-section />
        <QuickStart />
        <Options />
        <Api />
        <Integrations />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
