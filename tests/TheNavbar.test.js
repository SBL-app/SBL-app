import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import TheNavbar from "../src/components/TheNavbar.vue";

// Routeur mémoire minimal : toutes les routes pointent vers un composant vide,
// il ne sert qu'à faire réagir le `watch` sur le changement de page.
const RouteStub = { template: "<div />" };
function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", redirect: "/home" },
      { path: "/home", component: RouteStub },
      { path: "/seasons", component: RouteStub },
      { path: "/events", component: RouteStub },
      { path: "/teams", component: RouteStub },
      { path: "/:pathMatch(.*)*", component: RouteStub },
    ],
  });
}

// Stub minimal de RouterLink (rendu en <a>) pour tester le composant isolément.
const RouterLinkStub = {
  props: ["to", "ariaLabel"],
  template: "<a :href=\"to\"><slot /></a>",
};

function mountNavbar() {
  // La navbar utilise le store d'authentification (Pinia) : on installe une
  // instance fraîche par montage pour l'isoler.
  return mount(TheNavbar, {
    global: {
      plugins: [createPinia()],
      stubs: { RouterLink: RouterLinkStub },
    },
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

  it("referme le menu mobile lors d'un changement de page", async () => {
    const router = makeRouter();
    router.push("/home");
    await router.isReady();
    const wrapper = mount(TheNavbar, {
      global: { plugins: [createPinia(), router] },
    });

    // Ouvre le menu mobile via le hamburger.
    await wrapper.find(".burger").trigger("click");
    expect(wrapper.find(".links").classes()).toContain("open");

    // Le changement de route déclenche le watch qui referme le menu.
    await router.push("/seasons");
    await nextTick();
    expect(wrapper.find(".links").classes()).not.toContain("open");
  });
});
