<script setup lang="ts">
import type { RevisiItem } from '@/types/sita'

defineProps<{
  seminar: RevisiItem[]
  sidang: RevisiItem[]
}>()

function getStatusClass(status: string): string {
  if (!status) return ''
  const s = status.toLowerCase()
  if (s.includes('divalidasi') || s.includes('selesai') || s.includes('acc')) return 'validated'
  if (s.includes('belum') || s.includes('pending') || s.includes('proses')) return 'pending'
  if (s.includes('ditolak') || s.includes('revisi')) return 'revision'
  return ''
}
</script>

<template>
  <div class="card revisi-card">
    <div class="card-header">
      <span class="card-icon">📝</span>
      <span class="card-title">Revisi Penguji</span>
    </div>

    <!-- Seminar Revisi -->
    <div v-if="seminar.length > 0" class="revisi-section">
      <span class="section-label">Seminar Proposal</span>
      <div v-for="(rev, idx) in seminar" :key="'sem-' + idx" class="revisi-item">
        <div class="revisi-header">
          <div class="penguji-info">
            <div>
              <span class="revisi-status" :class="getStatusClass(rev.status)">
                {{ rev.status || 'Belum diketahui' }}
              </span>
              <span class="penguji-name">{{ rev.penguji || 'Penguji' }}</span>
              <span v-if="rev.role" class="penguji-role">{{ rev.role }}</span>
            </div>
          </div>
        </div>
        <p v-if="rev.uraian" class="revisi-uraian">{{ rev.uraian }}</p>
      </div>
    </div>

    <!-- Sidang Revisi -->
    <div v-if="sidang.length > 0" class="revisi-section">
      <span class="section-label">Sidang Akhir</span>
      <div v-for="(rev, idx) in sidang" :key="'sid-' + idx" class="revisi-item">
        <div class="revisi-header">
          <div class="penguji-info">
            <div>
              <span class="penguji-name">{{ rev.penguji || 'Penguji' }}</span>
              <span v-if="rev.role" class="penguji-role">{{ rev.role }}</span>
            </div>
          </div>
          <span class="revisi-status" :class="getStatusClass(rev.status)">
            {{ rev.status || 'Belum diketahui' }}
          </span>
        </div>
        <p v-if="rev.uraian" class="revisi-uraian">{{ rev.uraian }}</p>
      </div>
    </div>

    <div v-if="seminar.length === 0 && sidang.length === 0" class="empty-state">
      <span class="empty-icon">✅</span>
      <span class="empty-text">Belum ada revisi</span>
    </div>
  </div>
</template>

<style scoped>
.revisi-card {
  padding: 16px;
}

.revisi-section {
  margin-bottom: 14px;
}

.revisi-section:last-child {
  margin-bottom: 0;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
  display: block;
  margin-bottom: 8px;
}

.revisi-item {
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 8px;
  transition: all 0.2s;
}

.revisi-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.revisi-item:last-child {
  margin-bottom: 0;
}

.revisi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.penguji-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.penguji-name {
  font-size: 12px;
  font-weight: 600;
  color: #e2e8f0;
  display: block;
}

.penguji-role {
  font-size: 10px;
  color: #94a3b8;
  display: block;
}

.revisi-status {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
  white-space: nowrap;
}

.revisi-status.validated {
  background: rgba(52, 211, 153, 0.12);
  color: #34d399;
}

.revisi-status.pending {
  background: rgba(251, 191, 36, 0.12);
  color: #fbbf24;
}

.revisi-status.revision {
  background: rgba(248, 113, 113, 0.12);
  color: #f87171;
}

.revisi-uraian {
  font-size: 11px;
  color: #94a3b8;
  margin: 8px 0 0;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  line-height: 1.5;
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
