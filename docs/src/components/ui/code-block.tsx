import { Check, Copy } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "var",
  "function",
  "return",
  "new",
  "await",
  "async",
  "if",
  "else",
  "for",
  "of",
  "in",
  "try",
  "catch",
  "finally",
  "throw",
  "typeof",
  "instanceof",
  "void",
  "class",
  "extends",
  "implements",
  "interface",
  "type",
  "readonly",
  "true",
  "false",
  "null",
  "undefined",
  "this",
  "super",
  "as",
  "satisfies",
]);

const TOKEN_PATTERN =
  /(\/\/[^\n]*|#[^\n]*|`[^`]*`|"[^"\n]*"|'[^'\n]*'|\b\d[\d_]*(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b)/g;

function classify(token: string, rest: string): string {
  if (token.startsWith("//") || token.startsWith("#")) {
    return "text-slate-500 italic";
  }
  if (/^[`"']/.test(token)) {
    return "text-emerald-300";
  }
  if (/^\d/.test(token)) {
    return "text-amber-300";
  }
  if (KEYWORDS.has(token)) {
    return "text-brand-300";
  }
  if (/^[A-Z]/.test(token)) {
    return "text-sky-300";
  }
  if (rest.startsWith("(")) {
    return "text-yellow-200";
  }
  return "text-slate-200";
}

function highlight(line: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of line.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(line.slice(lastIndex, index));
    }
    const token = match[0];
    const rest = line.slice(index + token.length);
    nodes.push(
      <span key={key++} className={classify(token, rest)}>
        {token}
      </span>,
    );
    lastIndex = index + token.length;
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }
  return nodes;
}

interface CodeBlockProps {
  readonly code: string;
  readonly filename?: string;
  readonly showLineNumbers?: boolean;
  readonly className?: string;
  readonly chrome?: boolean;
}

export function CodeBlock({
  code,
  filename,
  showLineNumbers = false,
  className,
  chrome = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(() => {
    const write = navigator.clipboard?.writeText(code);
    void write?.catch(() => undefined);
    setCopied(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setCopied(false), 1600);
  }, [code]);

  const lines = code.replace(/\n$/, "").split("\n");

  return (
    <div
      className={`bg-ink-950 shadow-brand-950/40 overflow-hidden rounded-2xl border border-white/10 shadow-2xl ring-1 ring-black/5 ${className ?? ""}`}
    >
      {chrome ? (
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/3 px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          {filename ? (
            <span className="ml-2 truncate font-mono text-xs text-slate-400">
              {filename}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy code"
            className="hover:border-brand-400/50 ml-auto inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:text-white"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 text-[13px] leading-6 sm:p-5">
        <code className="font-mono">
          {lines.map((line, index) => (
            <div key={index} className="flex">
              {showLineNumbers ? (
                <span className="mr-4 w-6 shrink-0 text-right text-slate-600 select-none">
                  {index + 1}
                </span>
              ) : null}
              <span className="flex-1 whitespace-pre">
                {line ? highlight(line) : " "}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
