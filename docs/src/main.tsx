import { createRoot } from "@swifty.js/lit-jsx";

import { App } from "./app";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
