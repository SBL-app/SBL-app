<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useSearchStore } from "@/stores/search";

const router = useRouter();
const searchStore = useSearchStore();

const query = ref("");
const inputRef = ref(null);

const CATEGORIES = ["Saison", "Division", "Équipe", "Joueur"];
const MAX_PER_CAT = 5;

const results = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return [];

  return CATEGORIES.flatMap(type => {
    const matches = searchStore.allItems
      .filter(item =>
        item.type === type &&
        (item.label.toLowerCase().includes(q) ||
          (item.sublabel && item.sublabel.toLowerCase().includes(q)))
      )
      .slice(0, MAX_PER_CAT);

    if (!matches.length) return [];
    return [{ isHeader: true, type }, ...matches];
  });
});

const hasResults = computed(() => results.value.length > 0);

const emit = defineEmits(["close"]);

function navigate(route) {
  router.push(route);
  emit("close");
}

function onKeydown(e) {
  if (e.key === "Escape") emit("close");
}

onMounted(async () => {
  document.addEventListener("keydown", onKeydown);
  try {
    await searchStore.load();
  } catch {
    // le store gère isLoading via finally
  }
  await nextTick();
  inputRef.value?.focus();
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <div class="search-dropdown glass-card" role="search">
    <div class="search-input-row">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        ref="inputRef"
        v-model="query"
        class="search-input"
        placeholder="Rechercher..."
        type="text"
        aria-label="Rechercher dans la ligue"
        aria-autocomplete="list"
        :aria-expanded="hasResults"
        aria-controls="search-listbox"
      />
      <span v-if="searchStore.isLoading" class="loading-dot"></span>
    </div>

    <div v-if="query.trim() && !hasResults && !searchStore.isLoading" class="no-results">
      Aucun résultat pour "{{ query }}"
    </div>

    <div v-if="hasResults" id="search-listbox" class="results-list" role="listbox">
      <template v-for="item in results" :key="item.isHeader ? item.type : item.route">
        <div v-if="item.isHeader" class="result-category">{{ item.type }}</div>
        <div
          v-else
          class="result-item"
          role="option"
          tabindex="0"
          @click="navigate(item.route)"
          @keydown.enter.prevent="navigate(item.route)"
          @keydown.space.prevent="navigate(item.route)"
        >
          <span class="result-label">{{ item.label }}</span>
          <span v-if="item.sublabel" class="result-sublabel">{{ item.sublabel }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  z-index: 200;
  padding: 0;
  overflow: hidden;
  border-radius: 12px;
}

.search-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(124, 58, 237, 0.2);
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 14px;
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.loading-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-cyan);
  animation: pulse 1s infinite;
  flex-shrink: 0;
}

.results-list {
  max-height: 360px;
  overflow-y: auto;
  padding: 8px 0;
}

.result-category {
  padding: 6px 16px 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-violet);
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
  gap: 8px;
}

.result-item:hover {
  background: rgba(124, 58, 237, 0.12);
}

.result-label {
  color: var(--text-primary);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-sublabel {
  color: var(--text-muted);
  font-size: 12px;
  flex-shrink: 0;
  white-space: nowrap;
}

.no-results {
  padding: 16px;
  color: var(--text-muted);
  font-size: 13px;
  text-align: center;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
