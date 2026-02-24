<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { SitaData } from '@/types/sita'
import { createEmptySitaData } from '@/types/sita'
import { loadSitaData } from '@/utils/storage'
import { useTheme } from '@/composables/useTheme'

const data = ref<SitaData>(createEmptySitaData())
const loading = ref(true)

const { theme, toggleTheme } = useTheme()


onMounted(async () => {
  try {
    data.value = await loadSitaData()
  } catch (err) {
    console.error('[SITA-EXT] Failed to load data:', err)
  } finally {
    loading.value = false
  }
})

function openSidePanel() {
  chrome.runtime.sendMessage({ action: 'openSidePanel' })
}

function getStatusClass(status: string): string {
  if (!status) return 'empty'
  const s = status.toLowerCase()
  if (s.includes('disetujui') || s.includes('selesai') || s.includes('lulus')) return 'success'
  if (s.includes('ditolak') || s.includes('gagal')) return 'danger'
  return 'warning'
}

function formatTime(ts: number | null): string {
  if (!ts) return 'Belum sinkron'
  const diffMin = Math.floor((Date.now() - ts) / 60000)
  if (diffMin < 1) return 'Baru saja'
  if (diffMin < 60) return `${diffMin}m lalu`
  return new Date(ts).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function uploadedCount(items: { uploaded: boolean }[]): number {
  return items.filter(i => i.uploaded).length
}
</script>

<template>
  <div class="popup">
    <!-- Header -->
    <header class="popup-header">
      <div class="header-left">
        <div class="logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#g1)" />
            <path d="M2 17l10 5 10-5" stroke="url(#g2)" stroke-width="2" fill="none" />
            <path d="M2 12l10 5 10-5" stroke="url(#g2)" stroke-width="2" fill="none" />
            <defs>
              <linearGradient id="g1" x1="2" y1="2" x2="22" y2="12">
                <stop stop-color="#6366f1" /><stop offset="1" stop-color="#8b5cf6" />
              </linearGradient>
              <linearGradient id="g2" x1="2" y1="12" x2="22" y2="22">
                <stop stop-color="#8b5cf6" /><stop offset="1" stop-color="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="header-title">SITA Monitor</span>
      </div>
      <div class="header-right">
        <button class="theme-btn" @click="toggleTheme">
          <svg v-if="theme === 'dark'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
        <div class="sync-info" :class="{ synced: data.lastSync }">
          <span class="sync-dot"></span>
          <span>{{ formatTime(data.lastSync) }}</span>
        </div>
      </div>
    </header>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
    </div>

    <div v-else class="body">
      <!-- Judul TA -->
      <div v-if="data.judulTA" class="judul">
        <span class="judul-label">Judul TA</span>
        <p class="judul-text">{{ data.judulTA }}</p>
      </div>

      <!-- Tahap Quick View -->
      <div class="quick-row">
        <div class="quick-item">
          <span class="qi-label">Pengajuan</span>
          <span class="qi-status" :class="getStatusClass(data.tahap.pengajuan)">
            {{ data.tahap.pengajuan || '—' }}
          </span>
        </div>
        <div class="quick-item">
          <span class="qi-label">Seminar</span>
          <span class="qi-status" :class="getStatusClass(data.tahap.seminar)">
            {{ data.tahap.seminar || '—' }}
          </span>
        </div>
        <div class="quick-item">
          <span class="qi-label">Sidang</span>
          <span class="qi-status" :class="getStatusClass(data.tahap.sidang)">
            {{ data.tahap.sidang || '—' }}
          </span>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat" v-if="data.pemberkasan.seminar.length > 0">
          <span class="stat-value">{{ uploadedCount(data.pemberkasan.seminar) }}/{{ data.pemberkasan.seminar.length }}</span>
          <span class="stat-label">Berkas Seminar</span>
        </div>
        <div class="stat" v-if="data.pemberkasan.sidang.length > 0">
          <span class="stat-value">{{ uploadedCount(data.pemberkasan.sidang) }}/{{ data.pemberkasan.sidang.length }}</span>
          <span class="stat-label">Berkas Sidang</span>
        </div>
        <div class="stat" v-if="data.revisi.seminar.length + data.revisi.sidang.length > 0">
          <span class="stat-value">{{ data.revisi.seminar.length + data.revisi.sidang.length }}</span>
          <span class="stat-label">Revisi</span>
        </div>
      </div>

      <!-- Hint if no data -->
      <div v-if="!data.lastSync" class="hint">
        <svg class="hint-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" />
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
        </svg>
        Buka SITA untuk sinkronisasi data
      </div>
    </div>

    <!-- Open Side Panel button -->
    <button class="open-panel-btn" @click="openSidePanel">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="15" y1="3" x2="15" y2="21" />
      </svg>
      Buka Detail Panel
    </button>
  </div>
</template>

<style scoped>
.popup {
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--header-gradient);
  border-bottom: 1px solid var(--border-subtle);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--logo-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.theme-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-btn:hover {
  background: var(--bg-elevated-hover);
  color: var(--accent-indigo);
}

.sync-info {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: var(--text-dim);
}

.sync-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--text-dim);
}

.sync-info.synced .sync-dot {
  background: var(--accent-success);
  box-shadow: 0 0 4px var(--accent-success-glow);
}

.loading {
  display: flex;
  justify-content: center;
  padding: 30px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--accent-indigo-bg);
  border-top-color: var(--accent-indigo);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.body {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.judul {
  padding: 8px 10px;
  background: var(--accent-indigo-bg);
  border-radius: 8px;
  border: 1px solid var(--accent-indigo-border);
}

.judul-label {
  font-size: 9px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.judul-text {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 2px 0 0;
  line-height: 1.4;
  font-weight: 500;
}

.quick-row {
  display: flex;
  gap: 6px;
}

.quick-item {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  text-align: center;
}

.qi-label {
  font-size: 9px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.qi-status {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  display: inline-block;
}

.qi-status.success { color: var(--accent-success); background: var(--accent-success-bg); }
.qi-status.danger { color: var(--accent-danger, #f87171); background: var(--accent-danger-bg); }
.qi-status.warning { color: var(--accent-warning, #fbbf24); background: var(--accent-warning-bg); }
.qi-status.empty { color: var(--text-dim); }

.stats-row {
  display: flex;
  gap: 6px;
}

.stat {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  text-align: center;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-secondary);
  display: block;
}

.stat-label {
  font-size: 9px;
  color: var(--text-muted);
  margin-top: 2px;
  display: block;
}

.hint {
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.hint-icon {
  flex-shrink: 0;
  color: var(--accent-warning, #fbbf24);
}

.open-panel-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 4px 16px 12px;
  padding: 8px 14px;
  border: 1px solid var(--panel-btn-border);
  border-radius: 8px;
  background: var(--panel-btn-bg);
  color: var(--panel-btn-text);
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.open-panel-btn:hover {
  background: var(--panel-btn-bg-hover);
  border-color: var(--panel-btn-border-hover);
  color: var(--panel-btn-text-hover);
}
</style>
