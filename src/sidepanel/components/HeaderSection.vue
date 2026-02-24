<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import type { ProfileData, TahapTA } from '@/types/sita'
import { createEmptyProfile } from '@/types/sita'

const props = withDefaults(defineProps<{
  lastSync: number | null
  profile?: ProfileData
  tahap?: TahapTA
}>(), {
  profile: () => createEmptyProfile(),
  tahap: () => ({ pengajuan: '', seminar: '', sidang: '' }),
})

const { theme, toggleTheme } = useTheme()

/** Determine the current active step and its status */
const currentStatus = computed(() => {
  const { pengajuan, seminar, sidang } = props.tahap

  // Show the furthest step that has a status
  if (sidang) return { step: 'Sidang', status: sidang, icon: 'graduation' }
  if (seminar) return { step: 'Seminar', status: seminar, icon: 'presentation' }
  if (pengajuan) return { step: 'Pengajuan', status: pengajuan, icon: 'clipboard' }
  return null
})

function getStatusType(status: string): string {
  if (!status) return 'neutral'
  const s = status.toLowerCase()
  if (s.includes('disetujui') || s.includes('selesai') || s.includes('lulus')) return 'success'
  if (s.includes('ditolak') || s.includes('gagal')) return 'danger'
  if (s.includes('proses') || s.includes('menunggu') || s.includes('pending') || s.includes('pemberkasan')) return 'warning'
  return 'info'
}

function formatSync(ts: number | null): string {
  if (!ts) return 'Belum sinkron'
  const diffMin = Math.floor((Date.now() - ts) / 60000)
  if (diffMin < 1) return 'Baru saja'
  if (diffMin < 60) return `${diffMin}m lalu`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}j lalu`
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}
</script>

<template>
  <header class="hero">
    <div class="hero-top">
      <button class="icon-btn" @click="toggleTheme" :title="theme === 'dark' ? 'Light Mode' : 'Dark Mode'">
        <svg v-if="theme === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
      <div class="sync-pill" :class="{ synced: lastSync }">
        <span class="sync-dot"></span>
        <span>{{ formatSync(lastSync) }}</span>
      </div>
    </div>

    <div class="hero-greeting">
      <h1 class="greeting-text">Hello,</h1>
      <h1 v-if="profile.nama" class="greeting-text">{{ profile.nama }}</h1>
      <h1 v-else class="greeting-text">SITA Monitor</h1>
      <p class="greeting-sub">Monitoring Tugas Akhir</p>
    </div>

    <div v-if="currentStatus" class="status-card">
      <div class="status-left">
        <span class="status-step">{{ currentStatus.step }}</span>
        <span class="status-value" :class="'st-' + getStatusType(currentStatus.status)">
          {{ currentStatus.status }}
        </span>
      </div>
      <div class="status-icon-wrap" :class="'st-bg-' + getStatusType(currentStatus.status)">
        <!-- Clipboard -->
        <svg v-if="currentStatus.icon === 'clipboard'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
        <!-- Presentation -->
        <svg v-else-if="currentStatus.icon === 'presentation'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 3h20" /><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
          <path d="m7 21 5-5 5 5" />
        </svg>
        <!-- Graduation -->
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
        </svg>
      </div>
    </div>

    <div v-else class="status-card status-empty-card">
      <span class="status-empty-text">Buka halaman SITA untuk sinkronisasi data</span>
    </div>
  </header>
</template>

<style scoped>
.hero {
  padding: 20px;
  background: var(--hero-gradient);
  border-bottom: 1px solid var(--border-subtle);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -40%;
  right: -20%;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: var(--hero-blob);
  filter: blur(50px);
  pointer-events: none;
}

.hero-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--border-subtle);
  background: var(--hero-btn-bg);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
}

.icon-btn:hover {
  background: var(--bg-elevated-hover);
  color: var(--accent-indigo);
}

.sync-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  background: var(--hero-btn-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-subtle);
  font-size: 11px;
  color: var(--text-muted);
}

.sync-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-dim);
}

.sync-pill.synced .sync-dot {
  background: var(--accent-success);
  box-shadow: 0 0 6px var(--accent-success-glow);
}

.hero-greeting {
  position: relative;
  z-index: 1;
  margin-bottom: 16px;
}

.greeting-text {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.greeting-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin: 4px 0 0;
  font-weight: 400;
}

.status-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--status-card-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-subtle);
  position: relative;
  z-index: 1;
}

.status-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.status-step {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-value {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.st-success { color: var(--accent-success); }
.st-danger { color: var(--accent-danger); }
.st-warning { color: var(--accent-warning); }
.st-info { color: var(--accent-blue); }
.st-neutral { color: var(--text-secondary); }

.status-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.st-bg-success { background: var(--accent-success-bg); color: var(--accent-success); }
.st-bg-danger { background: var(--accent-danger-bg); color: var(--accent-danger); }
.st-bg-warning { background: var(--accent-warning-bg); color: var(--accent-warning); }
.st-bg-info { background: var(--accent-blue-bg); color: var(--accent-blue); }
.st-bg-neutral { background: var(--bg-elevated); color: var(--text-muted); }

.status-empty-card {
  justify-content: center;
}

.status-empty-text {
  font-size: 12px;
  color: var(--text-dim);
  font-style: italic;
}
</style>
