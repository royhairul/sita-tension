<script setup lang="ts">
import type { TahapTA, ProfileData } from '@/types/sita'

const props = defineProps<{
  tahap: TahapTA
  judulTA: string
  profile: ProfileData
}>()

const dosenList = [
  { key: 'pembimbing1' as const, label: 'Pembimbing 1' },
  { key: 'pembimbing2' as const, label: 'Pembimbing 2' },
  { key: 'penguji1' as const, label: 'Penguji 1' },
  { key: 'penguji2' as const, label: 'Penguji 2' },
]

const stages = [
  { key: 'pengajuan' as const, label: 'Pengajuan', icon: 'clipboard' },
  { key: 'seminar' as const, label: 'Seminar', icon: 'presentation' },
  { key: 'sidang' as const, label: 'Sidang', icon: 'graduation' },
]

function getStatusClass(status: string): string {
  if (!status) return 'status-empty'
  const s = status.toLowerCase()
  if (s.includes('disetujui') || s.includes('selesai') || s.includes('lulus')) return 'status-success'
  if (s.includes('ditolak') || s.includes('gagal')) return 'status-danger'
  if (s.includes('proses') || s.includes('menunggu') || s.includes('pending') || s.includes('pemberkasan')) return 'status-warning'
  return 'status-info'
}
</script>

<template>
  <div class="card tahap-card">
    <div class="card-header">
      <span class="card-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      </span>
      <span class="card-title">Tahap Tugas Akhir</span>
    </div>

    <div v-if="judulTA" class="judul-section">
      <span class="judul-label">Judul TA</span>
      <p class="judul-text">{{ judulTA }}</p>
    </div>

    <div v-if="profile.pembimbing1 || profile.pembimbing2 || profile.penguji1 || profile.penguji2" class="dosen-section">
      <div class="dosen-grid">
        <div
          v-for="dosen in dosenList"
          :key="dosen.key"
          v-show="profile[dosen.key]"
          class="dosen-item"
        >
          <span class="dosen-role" :class="dosen.key.startsWith('pembimbing') ? 'role-pembimbing' : 'role-penguji'">
            {{ dosen.label }}
          </span>
          <span class="dosen-name">{{ profile[dosen.key] }}</span>
        </div>
      </div>
    </div>

    <div class="stepper">
      <div
        v-for="(stage, idx) in stages"
        :key="stage.key"
        class="step"
        :class="{ 'has-status': tahap[stage.key] }"
      >
        <div class="step-indicator">
          <div class="step-dot" :class="getStatusClass(tahap[stage.key])">
            <span class="step-icon">
              <!-- Clipboard -->
              <svg v-if="stage.icon === 'clipboard'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
              <!-- Presentation / Mic -->
              <svg v-else-if="stage.icon === 'presentation'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h20" /><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
                <path d="m7 21 5-5 5 5" />
              </svg>
              <!-- Graduation -->
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
              </svg>
            </span>
          </div>
          <div v-if="idx < stages.length - 1" class="step-line" :class="{ active: tahap[stage.key] }"></div>
        </div>
        <div class="step-content">
          <span class="step-label">{{ stage.label }}</span>
          <span
            v-if="tahap[stage.key]"
            class="step-status"
            :class="getStatusClass(tahap[stage.key])"
          >
            {{ tahap[stage.key] }}
          </span>
          <span v-else class="step-status status-empty">Belum ada data</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tahap-card {
  padding: 16px;
}

.card-icon {
  color: var(--accent-indigo);
  display: flex;
  align-items: center;
}

.judul-section {
  margin-bottom: 12px;
  padding: 10px 12px;
  background: var(--accent-indigo-bg-light);
  border-radius: 10px;
  border: 1px solid var(--accent-indigo-border);
}

.judul-label {
  font-size: 10px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.judul-text {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 4px 0 0;
  line-height: 1.4;
  font-weight: 500;
}

.stepper {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-dot {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  transition: all 0.3s;
}

.step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.step-dot.status-success .step-icon { color: var(--accent-success); }
.step-dot.status-danger .step-icon { color: var(--accent-danger); }
.step-dot.status-warning .step-icon { color: var(--accent-warning); }

.step-line {
  width: 2px;
  height: 20px;
  background: var(--border-subtle);
  transition: background 0.3s;
}

.step-line.active {
  background: linear-gradient(to bottom, var(--accent-indigo), transparent);
}

.step-content {
  display: flex;
  flex-direction: column;
  padding: 6px 0 18px;
  min-width: 0;
}

.step-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.step-status {
  font-size: 11px;
  margin-top: 2px;
  padding: 2px 8px;
  border-radius: 6px;
  display: inline-block;
  width: fit-content;
  font-weight: 500;
}

.status-success { color: var(--accent-success); background: var(--accent-success-bg); }
.status-danger { color: var(--accent-danger); background: var(--accent-danger-bg); }
.status-warning { color: var(--accent-warning); background: var(--accent-warning-bg); }
.status-info { color: var(--accent-blue); background: var(--accent-blue-bg); }

.status-empty {
  color: var(--text-dim);
  background: var(--bg-elevated);
  font-style: italic;
}

.step-dot.status-success { border-color: var(--accent-success-bg); background: var(--accent-success-bg); }
.step-dot.status-danger { border-color: var(--accent-danger-bg); background: var(--accent-danger-bg); }
.step-dot.status-warning { border-color: var(--accent-warning-bg); background: var(--accent-warning-bg); }

/* ── Dosen Section ── */
.dosen-section {
  margin-bottom: 14px;
}

.dosen-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.dosen-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 7px 10px;
  border-radius: 8px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  transition: background 0.15s;
}

.dosen-item:hover {
  background: var(--bg-elevated);
}

.dosen-role {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.role-pembimbing {
  color: var(--accent-indigo);
}

.role-penguji {
  color: var(--accent-warning);
}

.dosen-name {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

