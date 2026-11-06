import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useApiStatusStore } from "../src/stores/apiStatus.js";

const jsonResponse = (data, ok = true, status = 200) => ({
  ok,
  status,
  headers: { get: () => "application/json" },
  json: async () => data,
});

describe("useApiStatusStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it("API en ligne : statut, code, latence et infos", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ name: "SBL", version: "1.2" })));
    const store = useApiStatusStore();
    await store.checkStatus();
    expect(store.online).toBe(true);
    expect(store.httpStatus).toBe(200);
    expect(store.responseTime).toBeGreaterThanOrEqual(0);
    expect(store.info).toEqual({ name: "SBL", version: "1.2", status: undefined });
    expect(store.loading).toBe(false);
  });

  it("réponse non ok : hors ligne avec le code HTTP", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, false, 503)));
    const store = useApiStatusStore();
    await store.checkStatus();
    expect(store.online).toBe(false);
    expect(store.httpStatus).toBe(503);
  });

  it("timeout : message dédié", async () => {
    const err = new Error("t");
    err.name = "TimeoutError";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(err));
    const store = useApiStatusStore();
    await store.checkStatus();
    expect(store.online).toBe(false);
    expect(store.error).toMatch(/Timeout/);
  });

  it("erreur réseau : message de l'erreur", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    const store = useApiStatusStore();
    await store.checkStatus();
    expect(store.online).toBe(false);
    expect(store.error).toBe("ECONNREFUSED");
  });
});
