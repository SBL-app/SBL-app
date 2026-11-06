import { describe, it, expect, vi, afterEach } from "vitest";
import { createErrorReporter, installErrorReporting } from "../src/utils/errorReporter.js";

function make(overrides = {}) {
  const send = vi.fn(() => Promise.resolve());
  const reporter = createErrorReporter({ endpoint: "/x", send, getRoute: () => "/saisons", getUrl: () => "http://t/saisons", ...overrides });
  return { send, reporter };
}

describe("createErrorReporter", () => {
  it("envoie message, stack, route et source", () => {
    const { send, reporter } = make();
    expect(reporter.report(new Error("boom"), "vue:render")).toBe(true);
    const [url, body] = send.mock.calls[0];
    const payload = JSON.parse(body);
    expect(url).toBe("/x");
    expect(payload).toMatchObject({ message: "boom", source: "vue:render", route: "/saisons", url: "http://t/saisons" });
    expect(payload.stack).toContain("boom");
  });

  it("dédoublonne les erreurs identiques", () => {
    const { send, reporter } = make();
    const err = new Error("même erreur");
    reporter.report(err);
    expect(reporter.report(err)).toBe(false);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("plafonne le nombre d'envois", () => {
    const { send, reporter } = make();
    for (let i = 0; i < 25; i++) reporter.report(`erreur ${i}`);
    expect(send).toHaveBeenCalledTimes(10);
  });

  it("accepte une valeur non-Error et tronque les messages longs", () => {
    const { send, reporter } = make();
    reporter.report("x".repeat(5000));
    reporter.report(undefined);
    expect(JSON.parse(send.mock.calls[0][1]).message).toHaveLength(1000);
    expect(JSON.parse(send.mock.calls[1][1]).message).toBe("Erreur inconnue");
  });

  it("ne propage jamais un échec d'envoi", () => {
    const { reporter } = make({ send: () => Promise.reject(new Error("réseau")) });
    expect(() => reporter.report("a")).not.toThrow();
    const sync = make({ send: () => { throw new Error("sync"); } });
    expect(() => sync.reporter.report("b")).not.toThrow();
  });
});

describe("installErrorReporting", () => {
  it("relaie les erreurs Vue, window.onerror et unhandledrejection", () => {
    const reporter = { report: vi.fn() };
    const app = { config: {} };
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    installErrorReporting(app, reporter);

    app.config.errorHandler(new Error("vue"), null, "render");
    expect(reporter.report).toHaveBeenCalledWith(expect.any(Error), "vue:render");
    expect(spy).toHaveBeenCalled();

    window.dispatchEvent(Object.assign(new Event("error"), { error: new Error("win") }));
    expect(reporter.report).toHaveBeenCalledWith(expect.objectContaining({ message: "win" }), "window.onerror");

    window.dispatchEvent(Object.assign(new Event("unhandledrejection"), { reason: "rejet" }));
    expect(reporter.report).toHaveBeenCalledWith("rejet", "unhandledrejection");
    spy.mockRestore();
  });

  it("conserve un errorHandler existant", () => {
    const previous = vi.fn();
    const app = { config: { errorHandler: previous } };
    installErrorReporting(app, { report: vi.fn() });
    app.config.errorHandler(new Error("e"), null, "x");
    expect(previous).toHaveBeenCalled();
  });
});

describe("valeurs par défaut", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("envoie via fetch (POST JSON, keepalive) vers /client-logs avec route et url courantes", () => {
    const fetchMock = vi.fn(() => Promise.resolve());
    vi.stubGlobal("fetch", fetchMock);
    createErrorReporter().report(new Error("défaut"));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/client-logs$/);
    expect(init).toMatchObject({ method: "POST", keepalive: true, headers: { "Content-Type": "application/json" } });
    const payload = JSON.parse(init.body);
    expect(payload.route).toBe(window.location.pathname);
    expect(payload.url).toBe(window.location.href);
  });

  it("source par défaut « window » et stack tronquée", () => {
    const { send, reporter } = make();
    const err = new Error("long");
    err.stack = "s".repeat(9000);
    reporter.report(err);
    const payload = JSON.parse(send.mock.calls[0][1]);
    expect(payload.source).toBe("window");
    expect(payload.stack).toHaveLength(4000);
  });

  it("omet la stack quand l'erreur n'en a pas", () => {
    const { send, reporter } = make();
    reporter.report("texte seul");
    expect(JSON.parse(send.mock.calls[0][1]).stack).toBeUndefined();
  });

  it("distingue deux erreurs de même message mais de stack différente", () => {
    const { send, reporter } = make();
    const a = new Error("m"); a.stack = "A";
    const b = new Error("m"); b.stack = "B";
    reporter.report(a);
    expect(reporter.report(b)).toBe(true);
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("ne compte pas les doublons dans le plafond", () => {
    const { send, reporter } = make();
    for (let i = 0; i < 50; i++) reporter.report("toujours la même");
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("window.onerror sans objet error retombe sur le message", () => {
    const reporter = { report: vi.fn() };
    installErrorReporting({ config: {} }, reporter);
    window.dispatchEvent(Object.assign(new Event("error"), { message: "Script error." }));
    expect(reporter.report).toHaveBeenCalledWith("Script error.", "window.onerror");
  });

  it("errorHandler Vue sans info utilise une source vide et renvoie le rapporteur", () => {
    const reporter = { report: vi.fn() };
    const app = { config: {} };
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(installErrorReporting(app, reporter)).toBe(reporter);
    app.config.errorHandler(new Error("e"));
    expect(reporter.report).toHaveBeenCalledWith(expect.any(Error), "vue:");
    spy.mockRestore();
  });

  it("l'errorHandler précédent remplace console.error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const app = { config: { errorHandler: vi.fn() } };
    installErrorReporting(app, { report: vi.fn() });
    app.config.errorHandler(new Error("e"), null, "x");
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
