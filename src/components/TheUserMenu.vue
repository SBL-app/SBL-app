<script setup>
import { ref } from "vue";
import { onMounted, onUnmounted } from "vue";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const menuOpen = ref(false);
const menuRef = ref(null);

function getAvatarUrl(user) {
  if (user.discord_avatar && user.discord_id) {
    return `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png?size=64`;
  }
  return `https://cdn.discordapp.com/embed/avatars/0.png`;
}

function handleClickOutside(event) {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    menuOpen.value = false;
  }
}

onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onUnmounted(() => document.removeEventListener("mousedown", handleClickOutside));
</script>

<template>
  <div class="user-menu" ref="menuRef">
    <button class="user-trigger" @click="menuOpen = !menuOpen" aria-label="Menu utilisateur">
      <img
        :src="getAvatarUrl(auth.user)"
        :alt="auth.user.discord_username"
        class="user-avatar"
      />
      <span class="user-name">{{ auth.user.discord_username }}</span>
    </button>

    <div v-if="menuOpen" class="user-dropdown">
      <button class="logout-btn" @click="auth.logout(); menuOpen = false">
        Se déconnecter
      </button>
    </div>
  </div>
</template>

<style scoped>
.user-menu {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 8px;
  padding: 4px 10px 4px 4px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
}

.user-trigger:hover {
  background: rgba(124, 58, 237, 0.15);
  border-color: var(--accent-violet);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: rgba(18, 18, 28, 0.95);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 8px;
  padding: 4px;
  min-width: 160px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 1001;
}

.logout-btn {
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}
</style>
