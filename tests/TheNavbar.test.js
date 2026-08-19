import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import { setActivePinia, createPinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";

// L'API Notification n'existe pas sous happy-dom : le composable est simulé
// pour que le bouton de notifications soit rendu et testable.
const push = {
  isSupported: true,
  permission: ref("default"),
  isSubscribed: ref(false),
  isLoading: ref(false),
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
  checkSubscriptionStatus: vi.fn(),
};
vi.mock("@/composables/usePushNotifications", () => ({
  usePushNotifications: () => push,
}));

import TheNavbar from "../src/components/TheNavbar.vue";

// Stub minimal de RouterLink (rendu en <a>) pour tester le composant isolément.
const RouterLinkStub = {
  props: ["to", "ariaLabel"],
  template: "<a :href=\"to\"><slot /></a>",
};

// Le composant appelle `useRouter().afterEach(...)` : un routeur mémoire suffit.
function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/:pathMatch(.*)*", component: { template: "<div />" } }],
  });
}

function mountNavbar() {
  return mount(TheNavbar, {
    global: {
      plugins: [createTestRouter()],
      stubs: { RouterLink: RouterLinkStub },
    },
  });
}

describe("TheNavbar (accessibilité)", () => {
  // Le composant consomme le store d'authentification : Pinia doit être actif.
  beforeEach(() => {
    setActivePinia(createPinia());
    push.isSubscribed.value = false;
    push.isLoading.value = false;
    vi.clearAllMocks();
  });

  it("utilise un landmark <nav> avec un libellé", () => {
    const wrapper = mountNavbar();
    const nav = wrapper.find("nav");
    expect(nav.exists()).toBe(true);
    expect(nav.attributes("aria-label")).toBeTruthy();
  });

  it("expose les liens de navigation principaux", () => {
    const wrapper = mountNavbar();
    const text = wrapper.text();
    expect(text).toContain("Home");
    expect(text).toContain("saisons");
    expect(text).toContain("équipes");
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

  it("le bouton burger reflète l'état du menu via aria-expanded", async () => {
    const wrapper = mountNavbar();
    const burger = wrapper.find(".burger");
    expect(burger.attributes("aria-expanded")).toBe("false");
    expect(burger.attributes("aria-controls")).toBe("nav-links");
    expect(burger.attributes("aria-label")).toBe("Ouvrir le menu");

    await burger.trigger("click");
    expect(burger.attributes("aria-expanded")).toBe("true");
    expect(burger.attributes("aria-label")).toBe("Fermer le menu");
  });

  it("referme le menu mobile après une navigation", async () => {
    const router = createTestRouter();
    const wrapper = mount(TheNavbar, {
      global: { plugins: [router], stubs: { RouterLink: RouterLinkStub } },
    });

    await wrapper.find(".burger").trigger("click");
    expect(wrapper.find(".burger").attributes("aria-expanded")).toBe("true");

    await router.push("/seasons");
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".burger").attributes("aria-expanded")).toBe("false");
  });

  it("le bouton de notifications bascule l'abonnement et annonce son état", async () => {
    const wrapper = mountNavbar();
    const notif = wrapper.find(".notif-btn");
    expect(notif.exists()).toBe(true);
    expect(notif.attributes("aria-label")).toBe("Activer les notifications");

    await notif.trigger("click");
    expect(push.subscribe).toHaveBeenCalledOnce();
    expect(push.unsubscribe).not.toHaveBeenCalled();

    push.isSubscribed.value = true;
    await wrapper.vm.$nextTick();
    expect(notif.attributes("aria-label")).toBe("Désactiver les notifications");

    await notif.trigger("click");
    expect(push.unsubscribe).toHaveBeenCalledOnce();
  });

  it("masque les icônes décoratives aux lecteurs d'écran", () => {
    const wrapper = mountNavbar();
    expect(wrapper.find(".discord-logo").attributes("aria-hidden")).toBe("true");
    expect(wrapper.find(".x-logo").attributes("aria-hidden")).toBe("true");
  });
});
