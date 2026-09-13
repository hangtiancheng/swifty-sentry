import { motion, useScroll, useSpring } from "motion/react";

import { Footer } from "./components/footer";
import { Navbar } from "./components/navbar";
import { Analytics } from "./components/sections/analytics";
import { Api } from "./components/sections/api";
import { CTA } from "./components/sections/cta";
import { DeveloperFirst } from "./components/sections/developer-first";
import { Features } from "./components/sections/features";
import { Frameworks } from "./components/sections/frameworks";
import { Hero } from "./components/sections/hero";
import { Integrations } from "./components/sections/integrations";
import { Options } from "./components/sections/options";
import { Performance } from "./components/sections/performance";
import { Plugins } from "./components/sections/plugins";
import { QuickStart } from "./components/sections/quick-start";
import { Reliability } from "./components/sections/reliability";

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });

  return (
    <div className="selection:bg-brand-500/30 selection:text-brand-950 dark:bg-ink-950 dark:selection:bg-brand-400/30 min-h-dvh bg-white text-slate-900 dark:text-slate-100 dark:selection:text-white">
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="from-brand-500 via-accent-500 to-brand-400 fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-linear-to-r"
      />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <DeveloperFirst />
        <Analytics />
        <Performance />
        <Reliability />
        <Plugins />
        <Frameworks />
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

export default App;
