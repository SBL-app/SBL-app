<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const deferredPrompt = ref(null)
const isVisible = ref(false)

function onBeforeInstallPrompt(event) {
  event.preventDefault()
  deferredPrompt.value = event
  isVisible.value = true
}

async function install() {
  if (!deferredPrompt.value) return
  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice
  if (outcome === 'accepted') {
    isVisible.value = false
  }
  deferredPrompt.value = null
}

function dismiss() {
  isVisible.value = false
  deferredPrompt.value = null
}

onMounted(() => window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt))
onUnmounted(() => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt))
</script>

<template>
  <div v-if="isVisible" class="install-banner">
    <span>Installer l'application SBL</span>
    <div class="install-actions">
      <button class="btn-install" @click="install">Installer</button>
      <button class="btn-dismiss" @click="dismiss" aria-label="Fermer">✕</button>
    </div>
  </div>
</template>

<style scoped>
.install-banner {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(8, 8, 15, 0.95);
  border: 1px solid rgba(124, 58, 237, 0.4);
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  backdrop-filter: blur(12px);
  z-index: 2000;
  white-space: nowrap;
  color: var(--text-primary);
  font-size: 14px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.install-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-install {
  background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4rem 1rem;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-install:hover {
  opacity: 0.85;
}

.btn-dismiss {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  padding: 0.25rem;
  line-height: 1;
  transition: color 0.2s;
}

.btn-dismiss:hover {
  color: var(--text-primary);
}
</style>
