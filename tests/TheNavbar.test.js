import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TheNavbar from "../src/components/TheNavbar.vue";

// Stub minimal de RouterLink (rendu en <a>) pour tester le composant isolément.
const RouterLinkStub = {
  props: ["to", "ariaLabel"],
  template: "<a :href=\"to\"><slot /></a>",
};

function mountNavbar() {
  return mount(TheNavbar, {
    global: { stubs: { RouterLink: RouterLinkStub } },
  });
}

describe("TheNavbar (accessibilité)", () => {
  it("utilise un landmark <nav> avec un libellé", () => {
    const wrapper = mountNavbar();
    const nav = wrapper.find("nav");
    expect(nav.exists()).toBe(true);
    expect(nav.attributes("aria-label")).toBeTruthy();
  });

  it("expose les liens de navigation principaux", () => {
    const wrapper = mountNavbar();
    const text = wrapper.text();
    expect(text).toContain("Accueil");
    expect(text).toContain("Saisons");
    expect(text).toContain("Équipes");
  });

  it("donne un nom accessible aux liens sociaux (icônes)", () => {
    const wrapper = mountNavbar();
    const socialLinks = wrapper.findAll(".socials a");
    expect(socialLinks.length).toBeGreaterThanOrEqual(2);
    for (const link of socialLinks) {
      expect(link.attributes("aria-label")).toBeTruthy();
      expect(link.attributes("rel")).toContain("noopener");
    }
  });

  it("masque les icônes décoratives aux lecteurs d'écran", () => {
    const wrapper = mountNavbar();
    expect(wrapper.find(".discord-logo").attributes("aria-hidden")).toBe("true");
    expect(wrapper.find(".x-logo").attributes("aria-hidden")).toBe("true");
  });
});
