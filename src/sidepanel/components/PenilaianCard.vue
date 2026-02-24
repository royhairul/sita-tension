<script setup lang="ts">
import type { NilaiItem } from '@/types/sita'

defineProps<{
  seminar: NilaiItem[]
  sidang: NilaiItem[]
  rekapSeminar: string
  rekapSidang: string
}>()

function getHurufMutu(score: string): { huruf: string; cls: string } {
  const n = parseFloat(score)
  if (isNaN(n)) return { huruf: '', cls: '' }
  if (n > 80) return { huruf: 'A', cls: 'grade-a' }
  if (n > 75) return { huruf: 'AB', cls: 'grade-ab' }
  if (n > 65) return { huruf: 'B', cls: 'grade-b' }
  if (n > 60) return { huruf: 'BC', cls: 'grade-bc' }
  if (n > 55) return { huruf: 'C', cls: 'grade-c' }
  if (n > 40) return { huruf: 'D', cls: 'grade-d' }
  return { huruf: 'E', cls: 'grade-e' }
}
</script>

<template>
  <div class="card penilaian-card">
    <div class="card-header">
      <span class="card-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
        </svg>
      </span>
      <span class="card-title">Penilaian</span>
    </div>

    <!-- Seminar -->
    <div v-if="seminar.length > 0" class="nilai-section">
      <div class="section-header">
        <span class="section-label">Seminar Proposal</span>
        <span v-if="rekapSeminar" class="rekap-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          {{ rekapSeminar }}
          <span v-if="getHurufMutu(rekapSeminar).huruf" class="huruf-mutu" :class="getHurufMutu(rekapSeminar).cls">
            {{ getHurufMutu(rekapSeminar).huruf }}
          </span>
        </span>
      </div>
      <div class="nilai-table">
        <div class="nilai-row header-row">
          <span class="col-name">Dosen</span>
          <span class="col-nilai">Nilai</span>
          <span class="col-bobot">Bobot</span>
        </div>
        <div v-for="item in seminar" :key="item.nama" class="nilai-row">
          <div class="col-name">
            <span class="dosen-name">{{ item.nama }}</span>
            <span class="dosen-role">{{ item.role }}</span>
          </div>
          <span class="col-nilai" :class="{ 'has-nilai': item.nilai }">{{ item.nilai || '-' }}</span>
          <span class="col-bobot" :class="{ 'has-bobot': item.bobot }">{{ item.bobot || '-' }}</span>
        </div>
      </div>
    </div>

    <!-- Sidang -->
    <div v-if="sidang.length > 0" class="nilai-section">
      <div class="section-header">
        <span class="section-label">Sidang Akhir</span>
        <span v-if="rekapSidang" class="rekap-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          {{ rekapSidang }}
          <span v-if="getHurufMutu(rekapSidang).huruf" class="huruf-mutu" :class="getHurufMutu(rekapSidang).cls">
            {{ getHurufMutu(rekapSidang).huruf }}
          </span>
        </span>
      </div>
      <div class="nilai-table">
        <div class="nilai-row header-row">
          <span class="col-name">Dosen</span>
          <span class="col-nilai">Nilai</span>
          <span class="col-bobot">Bobot</span>
        </div>
        <div v-for="item in sidang" :key="item.nama" class="nilai-row">
          <div class="col-name">
            <span class="dosen-name">{{ item.nama }}</span>
            <span class="dosen-role">{{ item.role }}</span>
          </div>
          <span class="col-nilai" :class="{ 'has-nilai': item.nilai }">{{ item.nilai || '-' }}</span>
          <span class="col-bobot" :class="{ 'has-bobot': item.bobot }">{{ item.bobot || '-' }}</span>
        </div>
      </div>
    </div>

    <div v-if="seminar.length === 0 && sidang.length === 0" class="empty-state">
      <span class="empty-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
        </svg>
      </span>
      <span class="empty-text">Belum ada data penilaian</span>
    </div>
  </div>
</template>

<style scoped>
.penilaian-card { padding: 16px; }

.card-icon {
  color: var(--accent-violet);
  display: flex;
  align-items: center;
}

.nilai-section { margin-bottom: 14px; }
.nilai-section:last-child { margin-bottom: 0; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.rekap-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 8px;
  background: var(--accent-indigo-bg);
  color: var(--accent-indigo);
  border: 1px solid var(--accent-indigo-border);
}

.nilai-table {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-radius: 10px;
  overflow: hidden;
}

.nilai-row {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background: var(--bg-input);
  transition: background 0.2s;
}

.nilai-row:hover:not(.header-row) {
  background: var(--bg-elevated);
}

.header-row {
  background: var(--bg-elevated);
  padding: 6px 10px;
}

.header-row span {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.col-name {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.dosen-name {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dosen-role {
  font-size: 10px;
  color: var(--text-dim);
}

.col-nilai {
  width: 50px;
  text-align: center;
  font-size: 12px;
  color: var(--text-dim);
  font-weight: 500;
  flex-shrink: 0;
}

.col-nilai.has-nilai {
  color: var(--accent-indigo);
  font-weight: 700;
}

.col-bobot {
  width: 50px;
  text-align: center;
  font-size: 11px;
  color: var(--text-dim);
  font-weight: 500;
  flex-shrink: 0;
}

.col-bobot.has-bobot {
  color: var(--accent-success);
  font-weight: 600;
}

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 20px; gap: 8px; }
.empty-icon { color: var(--text-dim); opacity: 0.5; display: flex; }
.empty-text { font-size: 12px; color: var(--text-dim); font-style: italic; }

.huruf-mutu {
  font-size: 11px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 4px;
  letter-spacing: 0.02em;
}

.grade-a { background: rgba(52, 211, 153, 0.15); color: #34d399; }
.grade-ab { background: rgba(96, 165, 250, 0.15); color: #60a5fa; }
.grade-b { background: rgba(167, 139, 250, 0.15); color: #a78bfa; }
.grade-bc { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
.grade-c { background: rgba(251, 146, 60, 0.15); color: #fb923c; }
.grade-d { background: rgba(248, 113, 113, 0.15); color: #f87171; }
.grade-e { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
</style>
