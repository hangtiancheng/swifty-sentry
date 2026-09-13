import { init } from "@swifty.js/sentry";
import { ReactErrorBoundary } from "@swifty.js/sentry/react";

init({ dsn: "/api/log", projectId: "react-app" });

export function App() {
  return (
    <ReactErrorBoundary fallback={(error) => <div>{error.message}</div>}>
      <Page />
    </ReactErrorBoundary>
  );
}
