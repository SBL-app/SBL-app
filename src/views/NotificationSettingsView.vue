<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const channels = ref({ discord: true, push: false, mail: false });
const email = ref("");
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const saved = ref(false);

const LABELS = {
  discord: "Discord (message privé)",
  push: "Notification push (navigateur / mobile)",
  mail: "Email",
};

function apply(data) {
  channels.value = { discord: false, push: false, mail: false, ...data.channels };
  email.value = data.email ?? "";
}

onMounted(async () => {
  try {
    apply(await auth.api.get("users/me/notification-preferences").json());
  } catch {
    error.value = "Impossible de charger vos préférences.";
  } finally {
    loading.value = false;
  }
});

async function save() {
  error.value = "";
  saved.value = false;
  if (channels.value.mail && !email.value.trim()) {
    error.value = "Un email est requis pour activer les notifications par mail.";
    return;
  }
  saving.value = true;
  try {
    apply(
      await auth.api
        .put("users/me/notification-preferences", {
          json: { channels: channels.value, email: email.value.trim() },
        })
        .json()
    );
    saved.value = true;
  } catch (e) {
    error.value =
      e?.response?.status === 422
        ? "Email invalide ou préférences refusées."
        : "Échec de l'enregistrement.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <section class="notif-settings">
    <h1>Notifications</h1>
    <p v-if="loading">Chargement…</p>
    <form v-else @submit.prevent="save">
      <label v-for="(label, key) in LABELS" :key="key" class="row">
        <input v-model="channels[key]" type="checkbox" :data-test="`channel-${key}`" />
        {{ label }}
      </label>
      <label class="row">
        Email
        <input v-model="email" type="email" placeholder="vous@exemple.fr" data-test="email" />
      </label>
      <button type="submit" :disabled="saving">Enregistrer</button>
      <p v-if="error" role="alert">{{ error }}</p>
      <p v-if="saved" role="status">Préférences enregistrées.</p>
    </form>
  </section>
</template>

<style scoped>
.notif-settings { max-width: 32rem; margin: 2rem auto; padding: 0 1rem; }
.row { display: flex; gap: 0.5rem; align-items: center; margin: 0.75rem 0; }
</style>
