/**
 * 로깅 유틸리티
 */

type LogLevel = "dev" | "log" | "warn" | "error" | "store";

const isDev = process.env.NODE_ENV === "development";

const colors = {
  dev: "\x1b[36m", // Cyan
  log: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
  store: "\x1b[35m", // Magenta
  reset: "\x1b[0m",
};

function formatTimestamp(): string {
  const now = new Date();
  return now.toISOString().slice(11, 23); // HH:MM:SS.mmm
}

function log(level: LogLevel, message: string, ...args: unknown[]): void {
  if (!isDev) return;

  const timestamp = formatTimestamp();
  const color = colors[level];
  const prefix = `${color}[${level.toUpperCase()}]${colors.reset} ${timestamp}`;

  console.log(`${prefix} ${message}`, ...args);
}

export const logger = {
  dev: (message: string, ...args: unknown[]) => log("dev", message, ...args),
  log: (message: string, ...args: unknown[]) => log("log", message, ...args),
  warn: (message: string, ...args: unknown[]) => log("warn", message, ...args),
  error: (message: string, ...args: unknown[]) => log("error", message, ...args),
  store: (message: string, ...args: unknown[]) => log("store", message, ...args),
};
