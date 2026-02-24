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
      <span class="card-icon">📅</span>
      <span class="card-title">Jadwal</span>
    </div>

    <div class="jadwal-grid">
      <!-- Seminar -->
      <div class="jadwal-item" :class="{ empty: !hasData(seminar) }">
        <div class="jadwal-type">
          <span class="type-dot seminar-dot"></span>
          <span class="type-label">Seminar Proposal</span>
        </div>
        <template v-if="hasData(seminar)">
          <div class="jadwal-detail">
            <div class="detail-row">
              <span class="detail-icon">📆</span>
              <span class="detail-text">{{ seminar!.tanggal || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-icon">🕐</span>
              <span class="detail-text">{{ seminar!.waktu || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-icon">🏫</span>
              <span class="detail-text">{{ seminar!.ruangan || '-' }}</span>
            </div>
          </div>
        </template>
        <span v-else class="no-data">Belum dijadwalkan</span>
      </div>

      <!-- Sidang -->
      <div class="jadwal-item" :class="{ empty: !hasData(sidang) }">
        <div class="jadwal-type">
          <span class="type-dot sidang-dot"></span>
          <span class="type-label">Sidang Akhir</span>
        </div>
        <template v-if="hasData(sidang)">
          <div class="jadwal-detail">
            <div class="detail-row">
              <span class="detail-icon">📆</span>
              <span class="detail-text">{{ sidang!.tanggal || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-icon">🕐</span>
              <span class="detail-text">{{ sidang!.waktu || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-icon">🏫</span>
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
.jadwal-card {
  padding: 16px;
}

.jadwal-grid {
  display: flex;
  gap: 10px;
}

.jadwal-item {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.2s;
}

.jadwal-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.jadwal-item.empty {
  opacity: 0.7;
}

.jadwal-type {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.type-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.seminar-dot {
  background: #60a5fa;
  box-shadow: 0 0 6px rgba(96, 165, 250, 0.4);
}

.sidang-dot {
  background: #a78bfa;
  box-shadow: 0 0 6px rgba(167, 139, 250, 0.4);
}

.type-label {
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
}

.jadwal-detail {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-icon {
  font-size: 12px;
  flex-shrink: 0;
}

.detail-text {
  font-size: 11px;
  color: #94a3b8;
}

.no-data {
  font-size: 11px;
  color: #64748b;
  font-style: italic;
}
</style>
