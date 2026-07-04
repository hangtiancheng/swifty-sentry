// npm view vite versions
// pnpm add -D vite7@npm:vite@7.3.3
// pnpm add -D vite

import { type Plugin as Plugin7 } from "vite7";
import { type Plugin } from "vite";
import { Buffer } from "node:buffer";
import { join } from "node:path";
import { createWriteStream, existsSync, mkdirSync, WriteStream } from "node:fs";
import { sentryLogger, sentry } from "./utils";

function appendChunk(body: string, chunk: unknown): string {
  if (typeof chunk === "string") {
    return body + chunk;
  }

  if (Buffer.isBuffer(chunk)) {
    return body + chunk.toString("utf8");
  }

  if (chunk instanceof Uint8Array) {
    return body + Buffer.from(chunk).toString("utf8");
  }

  return body;
}

function parseSentryPayload(body: string): unknown {
  return JSON.parse(body);
}

const configureServer7: (
  url: string,
  fileStream: WriteStream,
) => NonNullable<Plugin7["configureServer"]> = (url, fileStream) => (server) => {
  server.middlewares.use((req, res, next) => {
    if (req.url === url && req.method === "POST") {
      let body = "";
      req.on("data", (chunk: unknown) => {
        body = appendChunk(body, chunk);
      });
      req.on("end", () => {
        if (body) {
          try {
            const parsedBody = parseSentryPayload(body);
            fileStream.write(JSON.stringify(parsedBody) + "\n");
          } catch {
            fileStream.write(body + "\n");
          }
        }
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify({ code: 0, message: "success" }));
      });
    } else {
      next();
    }
  });
};

const configureServer: (
  url: string,
  fileStream: WriteStream,
) => NonNullable<Plugin["configureServer"]> = (url, fileStream) => (server) => {
  server.middlewares.use((req, res, next) => {
    if (req.url === url && req.method === "POST") {
      let body = "";
      req.on("data", (chunk: unknown) => {
        body = appendChunk(body, chunk);
      });
      req.on("end", () => {
        if (body) {
          try {
            const parsedBody = parseSentryPayload(body);
            fileStream.write(JSON.stringify(parsedBody) + "\n");
          } catch {
            fileStream.write(body + "\n");
          }
        }
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify({ code: 0, message: "success" }));
      });
    } else {
      next();
    }
  });
};

export interface ISentryPluginOptions {
  dsn?: string;
}

function ensureLogStream(): { fileStream: WriteStream; logFile: string } {
  const logsDir = join(process.cwd(), "logs");
  if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
  }
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 14);
  const logFile = join(logsDir, `sentry_${timestamp}.jsonl`);
  const fileStream = createWriteStream(logFile, { flags: "a" });
  return { fileStream, logFile };
}

export function sentryPlugin7({ dsn }: ISentryPluginOptions = {}): Plugin7 {
  const { fileStream, logFile } = ensureLogStream();
  sentryLogger.info(`Sentry mock plugin initialized, logs will be written to ${logFile}`);
  return {
    name: "vite-plugin-sentry",
    configureServer: configureServer7(dsn || sentry.options.dsn || "/sentry", fileStream),
    closeBundle() {
      if (fileStream) {
        fileStream.close();
      }
    },
  };
}

export function sentryPlugin({ dsn }: ISentryPluginOptions): Plugin {
  const { fileStream, logFile } = ensureLogStream();
  sentryLogger.info(`Sentry mock plugin initialized, logs will be written to ${logFile}`);
  return {
    name: "vite-plugin-sentry",
    configureServer: configureServer(dsn || sentry.options.dsn || "/sentry", fileStream),
    closeBundle() {
      if (fileStream) {
        fileStream.close();
      }
    },
  };
}

export default sentryPlugin;
