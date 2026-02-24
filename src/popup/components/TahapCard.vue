<script setup lang="ts">
import type { TahapTA } from '@/types/sita'

defineProps<{
  tahap: TahapTA
  judulTA: string
}>()

const stages = [
  { key: 'pengajuan' as const, label: 'Pengajuan', icon: '📋' },
  { key: 'seminar' as const, label: 'Seminar', icon: '🎤' },
  { key: 'sidang' as const, label: 'Sidang', icon: '🎓' },
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
      <span class="card-icon">📊</span>
      <span class="card-title">Tahap Tugas Akhir</span>
    </div>

    <div v-if="judulTA" class="judul-section">
      <span class="judul-label">Judul TA</span>
      <p class="judul-text">{{ judulTA }}</p>
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
            <span class="step-emoji">{{ stage.icon }}</span>
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

.judul-section {
  margin-bottom: 16px;
  padding: 10px 12px;
  background: rgba(99, 102, 241, 0.08);
  border-radius: 10px;
  border: 1px solid rgba(99, 102, 241, 0.15);
}

.judul-label {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.judul-text {
  font-size: 13px;
  color: #e2e8f0;
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.step-emoji {
  font-size: 16px;
}

.step-line {
  width: 2px;
  height: 20px;
  background: rgba(255, 255, 255, 0.08);
  transition: background 0.3s;
}

.step-line.active {
  background: linear-gradient(to bottom, #6366f1, rgba(99, 102, 241, 0.2));
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
  color: #e2e8f0;
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

.status-success {
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
}

.status-danger {
  color: #f87171;
  background: rgba(248, 113, 113, 0.1);
}

.status-warning {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
}

.status-info {
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.1);
}

.status-empty {
  color: #64748b;
  background: rgba(100, 116, 139, 0.1);
  font-style: italic;
}

.step-dot.status-success {
  border-color: rgba(52, 211, 153, 0.3);
  background: rgba(52, 211, 153, 0.1);
}

.step-dot.status-danger {
  border-color: rgba(248, 113, 113, 0.3);
  background: rgba(248, 113, 113, 0.1);
}

.step-dot.status-warning {
  border-color: rgba(251, 191, 36, 0.3);
  background: rgba(251, 191, 36, 0.1);
}
</style>
