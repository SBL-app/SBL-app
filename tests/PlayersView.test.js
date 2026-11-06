import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import ky from "ky";
import PlayersView from "../src/views/PlayersView.vue";

vi.mock("ky", () => ({ default: { get: vi.fn() } }));

const RouterLinkStub = { props: ["to"], template: "<a><slot /></a>" };

async function mountView(data) {
  ky.get.mockResolvedValue({ json: async () => data });
  const wrapper = mount(PlayersView, {
    global: { stubs: { RouterLink: RouterLinkStub } },
  });
  await flushPromises();
  return wrapper;
}

describe("PlayersView", () => {
  beforeEach(() => setActivePinia(createPinia()));

  it("liste les joueurs triés par nom avec leur équipe", async () => {
    const w = await mountView([
      { id: 2, name: "Zoé", team_name: "Alpha" },
      { id: 1, name: "Alice", team_name: "Beta" },
    ]);
    const names = w.findAll(".player-name").map((n) => n.text());
    expect(names).toEqual(["Alice", "Zoé"]);
    expect(w.text()).toContain("Beta");
  });

  it("filtre par nom ou équipe", async () => {
    const w = await mountView([
      { id: 1, name: "Alice", team_name: "Beta" },
      { id: 2, name: "Zoé", team_name: "Alpha" },
    ]);
    await w.find("input").setValue("alp");
    expect(w.findAll(".player-card")).toHaveLength(1);
    await w.find("input").setValue("xyz");
    expect(w.text()).toContain("Aucun joueur trouvé");
  });
});
