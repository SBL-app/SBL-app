import { describe, it, expect, vi } from "vitest";
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
