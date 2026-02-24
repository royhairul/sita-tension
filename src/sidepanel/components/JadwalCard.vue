<script setup lang="ts">
import type { JadwalItem } from '@/types/sita'

defineProps<{
  seminar: JadwalItem | null
  sidang: JadwalItem | null
}>()

function hasData(item: JadwalItem | null): boolean {
  return !!item && !!(item.tanggal || item.waktu || item.ruangan)
}
</script>

<template>
  <div class="card jadwal-card">
    <div class="card-header">
      <span class="card-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </span>
      <span class="card-title">Jadwal</span>
    </div>

    <div class="jadwal-grid">
      <div class="jadwal-item" :class="{ empty: !hasData(seminar) }">
        <div class="jadwal-type">
          <span class="type-dot seminar-dot"></span>
          <span class="type-label">Seminar Proposal</span>
        </div>
        <template v-if="hasData(seminar)">
          <div class="jadwal-detail">
            <div class="detail-row">
              <span class="detail-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              <span class="detail-text">{{ seminar!.tanggal || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <span class="detail-text">{{ seminar!.waktu || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span class="detail-text">{{ seminar!.ruangan || '-' }}</span>
            </div>
          </div>
        </template>
        <span v-else class="no-data">Belum dijadwalkan</span>
      </div>

      <div class="jadwal-item" :class="{ empty: !hasData(sidang) }">
        <div class="jadwal-type">
          <span class="type-dot sidang-dot"></span>
          <span class="type-label">Sidang Akhir</span>
        </div>
        <template v-if="hasData(sidang)">
          <div class="jadwal-detail">
            <div class="detail-row">
              <span class="detail-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              <span class="detail-text">{{ sidang!.tanggal || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <span class="detail-text">{{ sidang!.waktu || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span class="detail-text">{{ sidang!.ruangan || '-' }}</span>
            </div>
          </div>
        </template>
        <span v-else class="no-data">Belum dijadwalkan</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.jadwal-card { padding: 16px; }

.card-icon {
  color: var(--accent-indigo);
  display: flex;
  align-items: center;
}

.jadwal-grid { display: flex; gap: 10px; }

.jadwal-item {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  transition: all 0.2s;
}

.jadwal-item:hover { background: var(--bg-elevated); }
.jadwal-item.empty { opacity: 0.7; }

.jadwal-type { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }

.type-dot { width: 8px; height: 8px; border-radius: 50%; }

.seminar-dot {
  background: var(--accent-blue);
  box-shadow: 0 0 6px var(--accent-blue-glow);
}

.sidang-dot {
  background: var(--accent-violet);
  box-shadow: 0 0 6px var(--accent-violet-glow);
}

.type-label { font-size: 12px; font-weight: 600; color: var(--text-secondary); }

.jadwal-detail { display: flex; flex-direction: column; gap: 6px; }
.detail-row { display: flex; align-items: center; gap: 6px; }
.detail-icon { color: var(--text-dim); display: flex; align-items: center; flex-shrink: 0; }
.detail-text { font-size: 11px; color: var(--text-muted); }
.no-data { font-size: 11px; color: var(--text-dim); font-style: italic; }
</style>
