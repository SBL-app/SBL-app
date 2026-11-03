import { API_URL } from "../../API_URL.js";

const MAX_REPORTS = 10; // plafond par session de navigation
const MAX_MESSAGE = 1000;
const MAX_STACK = 4000;

/**
 * Remonte les erreurs JavaScript du navigateur vers l'API (POST /client-logs),
 * qui les écrit dans ses logs. Les envois sont dédoublonnés et plafonnés, et
 * un échec d'envoi est silencieux : le rapport d'erreur ne doit jamais en
 * provoquer une autre.
 */
export function createErrorReporter({
  endpoint = `${API_URL}/client-logs`,
  send = (url, body) => fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }),
  getRoute = () => window.location.pathname,
  getUrl = () => window.location.href,
} = {}) {
  const seen = new Set();
  let count = 0;

  function report(error, source = "window") {
    const message = String(error?.message ?? error ?? "Erreur inconnue").slice(0, MAX_MESSAGE);
    const stack = typeof error?.stack === "string" ? error.stack.slice(0, MAX_STACK) : undefined;
    const key = `${message}|${stack ?? ""}`;
    if (seen.has(key) || count >= MAX_REPORTS) return false;
    seen.add(key);
    count += 1;

    try {
      const result = send(endpoint, JSON.stringify({ message, stack, source, route: getRoute(), url: getUrl() }));
      result?.catch?.(() => {});
    } catch {
      // volontairement ignoré
    }
    return true;
  }

  return { report };
}

/** Branche le rapporteur sur Vue et sur les événements globaux du navigateur. */
export function installErrorReporting(app, reporter = createErrorReporter()) {
  const previous = app.config.errorHandler;
  app.config.errorHandler = (err, instance, info) => {
    reporter.report(err, `vue:${info ?? ""}`);
    if (previous) previous(err, instance, info);
    else console.error(err);
  };
  window.addEventListener("error", (event) => reporter.report(event.error ?? event.message, "window.onerror"));
  window.addEventListener("unhandledrejection", (event) => reporter.report(event.reason, "unhandledrejection"));
  return reporter;
}
