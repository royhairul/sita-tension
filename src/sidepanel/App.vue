<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { SitaData } from '@/types/sita'
import { createEmptySitaData } from '@/types/sita'
import { loadSitaData, onSitaDataChanged } from '@/utils/storage'
import { useTheme } from '@/composables/useTheme'
import HeaderSection from './components/HeaderSection.vue'
import TahapCard from './components/TahapCard.vue'
import JadwalCard from './components/JadwalCard.vue'
import PemberkasanCard from './components/PemberkasanCard.vue'
import PenilaianCard from './components/PenilaianCard.vue'
import RevisiCard from './components/RevisiCard.vue'

const data = ref<SitaData>(createEmptySitaData())
const loading = ref(true)
const activeTab = ref<'beranda' | 'jadwal' | 'berkas' | 'penilaian' | 'revisi'>('beranda')

useTheme()

let unsubscribe: (() => void) | null = null

onMounted(async () => {
  try {
    data.value = await loadSitaData()
  } catch (err) {
    console.error('[SITA-EXT] Failed to load data:', err)
  } finally {
    loading.value = false
  }

  unsubscribe = onSitaDataChanged((newData) => {
    data.value = newData
  })
})

onUnmounted(() => {
  unsubscribe?.()
})

const tabs = [
  { id: 'beranda' as const, label: 'Beranda', icon: 'home' },
  { id: 'jadwal' as const, label: 'Jadwal', icon: 'calendar' },
  { id: 'berkas' as const, label: 'Berkas', icon: 'folder' },
  { id: 'penilaian' as const, label: 'Nilai', icon: 'star' },
  { id: 'revisi' as const, label: 'Revisi', icon: 'edit' },
]
</script>

<template>
  <div class="panel-root">
    <HeaderSection :last-sync="data.lastSync" :profile="data.profile" :tahap="data.tahap" />

    <!-- Tab Navigation -->
    <nav class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <!-- Home icon -->
        <svg v-if="tab.icon === 'home'" class="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <!-- Calendar icon -->
        <svg v-else-if="tab.icon === 'calendar'" class="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <!-- Folder icon -->
        <svg v-else-if="tab.icon === 'folder'" class="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <!-- Star icon -->
        <svg v-else-if="tab.icon === 'star'" class="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <!-- Edit icon -->
        <svg v-else-if="tab.icon === 'edit'" class="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </nav>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Memuat data...</span>
    </div>

    <main v-else class="content">
      <!-- Beranda tab -->
      <template v-if="activeTab === 'beranda'">
        <TahapCard :tahap="data.tahap" :judul-t-a="data.judulTA" :profile="data.profile" />
        <JadwalCard :seminar="data.jadwal.seminar" :sidang="data.jadwal.sidang" />
      </template>

      <!-- Jadwal tab -->
      <template v-if="activeTab === 'jadwal'">
        <JadwalCard :seminar="data.jadwal.seminar" :sidang="data.jadwal.sidang" />
      </template>

      <!-- Berkas tab -->
      <template v-if="activeTab === 'berkas'">
        <PemberkasanCard :seminar="data.pemberkasan.seminar" :sidang="data.pemberkasan.sidang" />
      </template>

      <!-- Penilaian tab -->
      <template v-if="activeTab === 'penilaian'">
        <PenilaianCard
          :seminar="data.penilaian.seminar"
          :sidang="data.penilaian.sidang"
          :rekap-seminar="data.penilaian.rekapSeminar"
          :rekap-sidang="data.penilaian.rekapSidang"
        />
      </template>

      <!-- Revisi tab -->
      <template v-if="activeTab === 'revisi'">
        <RevisiCard :seminar="data.revisi.seminar" :sidang="data.revisi.sidang" />
      </template>

      <div v-if="!data.lastSync" class="hint-banner">
        <span class="hint-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" />
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
          </svg>
        </span>
        <span class="hint-text">Buka halaman SITA untuk sinkronisasi data otomatis</span>
      </div>
    </main>

    <footer class="panel-footer">
      <span>SITA Monitoring v1.0 — Poliwangi</span>
    </footer>
  </div>
</template>

<style scoped>
.panel-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ── Tab Bar ── */
.tab-bar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 12px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 4px 6px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--text-dim);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.tab-item:hover {
  color: var(--text-muted);
  background: var(--bg-elevated);
}

.tab-item.active {
  color: var(--accent-indigo);
  background: var(--accent-indigo-bg);
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 2px;
  border-radius: 2px;
  background: var(--accent-indigo);
}

.tab-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.tab-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.content {
  flex: 1;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #94a3b8;
  font-size: 13px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.hint-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.06) 100%);
  border: 1px solid rgba(99, 102, 241, 0.15);
}

.hint-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--accent-warning, #fbbf24);
}

.hint-text {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.4;
}

.panel-footer {
  padding: 10px 16px;
  text-align: center;
  font-size: 10px;
  color: #475569;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}
</style>
