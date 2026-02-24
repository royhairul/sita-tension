<script setup lang="ts">
import type { BerkasItem } from '@/types/sita'

defineProps<{
  seminar: BerkasItem[]
  sidang: BerkasItem[]
}>()

function getProgress(items: BerkasItem[]): { uploaded: number; total: number; percent: number } {
  const total = items.length
  const uploaded = items.filter(i => i.uploaded).length
  return { uploaded, total, percent: total > 0 ? Math.round((uploaded / total) * 100) : 0 }
}
</script>

<template>
  <div class="card pemberkasan-card">
    <div class="card-header">
      <span class="card-icon">📁</span>
      <span class="card-title">Pemberkasan</span>
    </div>

    <!-- Seminar Berkas -->
    <div v-if="seminar.length > 0" class="berkas-section">
      <div class="section-header">
        <span class="section-label">Seminar Proposal</span>
        <span class="progress-text">{{ getProgress(seminar).uploaded }}/{{ getProgress(seminar).total }}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill seminar-fill" :style="{ width: getProgress(seminar).percent + '%' }"></div>
      </div>
      <ul class="berkas-list">
        <li v-for="item in seminar" :key="item.nama" class="berkas-item" :class="{ uploaded: item.uploaded }">
          <span class="berkas-icon">{{ item.uploaded ? '✓' : '✗' }}</span>
          <span class="berkas-nama">{{ item.nama }}</span>
          <span v-if="item.verified" class="verified-badge">Verified</span>
        </li>
      </ul>
    </div>

    <!-- Sidang Berkas -->
    <div v-if="sidang.length > 0" class="berkas-section">
      <div class="section-header">
        <span class="section-label">Sidang Akhir</span>
        <span class="progress-text">{{ getProgress(sidang).uploaded }}/{{ getProgress(sidang).total }}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill sidang-fill" :style="{ width: getProgress(sidang).percent + '%' }"></div>
      </div>
      <ul class="berkas-list">
        <li v-for="item in sidang" :key="item.nama" class="berkas-item" :class="{ uploaded: item.uploaded }">
          <span class="berkas-icon">{{ item.uploaded ? '✓' : '✗' }}</span>
          <span class="berkas-nama">{{ item.nama }}</span>
          <span v-if="item.verified" class="verified-badge">Verified</span>
        </li>
      </ul>
    </div>

    <div v-if="seminar.length === 0 && sidang.length === 0" class="empty-state">
      <span class="empty-icon">📂</span>
      <span class="empty-text">Belum ada data pemberkasan</span>
    </div>
  </div>
</template>

<style scoped>
.pemberkasan-card {
  padding: 16px;
}

.berkas-section {
  margin-bottom: 14px;
}

.berkas-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
}

.progress-text {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  margin-bottom: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.seminar-fill {
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
}

.sidang-fill {
  background: linear-gradient(90deg, #a78bfa, #8b5cf6);
}

.berkas-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.berkas-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  transition: background 0.2s;
}

.berkas-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.berkas-icon {
  font-size: 12px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 700;
}

.berkas-item.uploaded .berkas-icon {
  color: #34d399;
  background: rgba(52, 211, 153, 0.15);
}

.berkas-item:not(.uploaded) .berkas-icon {
  color: #f87171;
  background: rgba(248, 113, 113, 0.15);
}

.berkas-nama {
  font-size: 12px;
  color: #cbd5e1;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.berkas-item:not(.uploaded) .berkas-nama {
  color: #94a3b8;
}

.verified-badge {
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 8px;
}

.empty-icon {
  font-size: 24px;
  opacity: 0.5;
}

.empty-text {
  font-size: 12px;
  color: #64748b;
  font-style: italic;
}
</style>
