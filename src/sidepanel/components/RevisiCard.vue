<script setup lang="ts">
import { ref } from 'vue'
import type { RevisiItem } from '@/types/sita'

defineProps<{
  seminar: RevisiItem[]
  sidang: RevisiItem[]
}>()

const expandedItems = ref<Set<string>>(new Set())

function toggleUraian(key: string) {
  if (expandedItems.value.has(key)) {
    expandedItems.value.delete(key)
  } else {
    expandedItems.value.add(key)
  }
}

function isExpanded(key: string): boolean {
  return expandedItems.value.has(key)
}

function getStatusClass(status: string): string {
  if (!status) return ''
  const s = status.toLowerCase()
  if (s.includes('divalidasi') || s.includes('selesai') || s.includes('acc')) return 'validated'
  if (s.includes('belum') || s.includes('pending') || s.includes('proses')) return 'pending'
  if (s.includes('ditolak') || s.includes('revisi')) return 'revision'
  return ''
}

function getStatusLabel(status: string): string {
  if (!status) return 'Belum'
  const s = status.toLowerCase()
  if (s.includes('divalidasi') || s.includes('selesai')) return 'Selesai'
  if (s.includes('belum')) return 'Belum'
  return status
}
</script>

<template>
  <div class="card revisi-card">
    <div class="card-header">
      <span class="card-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </span>
      <span class="card-title">Revisi Penguji</span>
    </div>

    <!-- Seminar Proposal Section -->
    <div v-if="seminar.length > 0" class="revisi-section">
      <span class="section-label">Seminar Proposal</span>
      <div v-for="(rev, idx) in seminar" :key="'sem-' + idx" class="revisi-item" :class="{ expanded: isExpanded('sem-' + idx) }">
        <div class="revisi-header" :class="{ clickable: rev.uraian }" @click="rev.uraian ? toggleUraian('sem-' + idx) : undefined">
          <div class="penguji-row">
            <div class="penguji-meta">
              <span class="penguji-role-badge" :class="getStatusClass(rev.status)">{{ rev.role || 'Penguji' }}</span>
              <span class="penguji-name">{{ rev.penguji || 'Penguji' }}</span>
            </div>
            <div class="revisi-right">
              <span class="revisi-status" :class="getStatusClass(rev.status)">
                <svg v-if="getStatusClass(rev.status) === 'validated'" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <svg v-else width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {{ getStatusLabel(rev.status) }}
              </span>
              <button v-if="rev.uraian" class="uraian-toggle" :class="{ active: isExpanded('sem-' + idx) }" @click.stop="toggleUraian('sem-' + idx)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div v-if="rev.uraian && isExpanded('sem-' + idx)" class="uraian-panel">
          <div class="uraian-inner">
            <div class="uraian-header">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              <span>Uraian Revisi</span>
            </div>
            <div class="uraian-body" v-html="rev.uraian"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidang Akhir Section -->
    <div v-if="sidang.length > 0" class="revisi-section">
      <span class="section-label">Sidang Akhir</span>
      <div v-for="(rev, idx) in sidang" :key="'sid-' + idx" class="revisi-item" :class="{ expanded: isExpanded('sid-' + idx) }">
        <div class="revisi-header" :class="{ clickable: rev.uraian }" @click="rev.uraian ? toggleUraian('sid-' + idx) : undefined">
          <div class="penguji-row">
            <div class="penguji-meta">
              <span class="penguji-role-badge" :class="getStatusClass(rev.status)">{{ rev.role || 'Penguji' }}</span>
              <span class="penguji-name">{{ rev.penguji || 'Penguji' }}</span>
            </div>
            <div class="revisi-right">
              <span class="revisi-status" :class="getStatusClass(rev.status)">
                <svg v-if="getStatusClass(rev.status) === 'validated'" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <svg v-else width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {{ getStatusLabel(rev.status) }}
              </span>
              <button v-if="rev.uraian" class="uraian-toggle" :class="{ active: isExpanded('sid-' + idx) }" @click.stop="toggleUraian('sid-' + idx)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div v-if="rev.uraian && isExpanded('sid-' + idx)" class="uraian-panel">
          <div class="uraian-inner">
            <div class="uraian-header">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              <span>Uraian Revisi</span>
            </div>
            <div class="uraian-body" v-html="rev.uraian"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="seminar.length === 0 && sidang.length === 0" class="empty-state">
      <span class="empty-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </span>
      <span class="empty-title">Tidak ada revisi</span>
      <span class="empty-subtitle">Data revisi belum tersedia</span>
    </div>
  </div>
</template>

<style scoped>
.revisi-card { padding: 16px; }

.card-icon {
  color: var(--accent-indigo);
  display: flex;
  align-items: center;
}

/* ── Sections ── */
.revisi-section { margin-bottom: 14px; }
.revisi-section:last-of-type { margin-bottom: 0; }

.section-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 8px;
}

/* ── Each Revisi Item ── */
.revisi-item {
  border-radius: 10px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  margin-bottom: 8px;
  transition: all 0.2s;
  overflow: hidden;
}

.revisi-item:last-child { margin-bottom: 0; }
.revisi-item:hover { border-color: var(--border-hover, var(--border-subtle)); }
.revisi-item.expanded { border-color: var(--accent-indigo-border); }

.revisi-header {
  padding: 10px 12px;
}

.revisi-header.clickable { cursor: pointer; }

.penguji-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.penguji-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.penguji-role-badge {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.penguji-role-badge.validated { color: var(--accent-success); }
.penguji-role-badge.pending { color: var(--accent-warning); }
.penguji-role-badge.revision { color: var(--accent-danger); }

.penguji-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.revisi-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

/* ── Status Badge ── */
.revisi-status {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 600;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.revisi-status.validated { background: var(--accent-success-bg); color: var(--accent-success); }
.revisi-status.pending { background: var(--accent-warning-bg); color: var(--accent-warning); }
.revisi-status.revision { background: var(--accent-danger-bg); color: var(--accent-danger); }

/* ── Toggle Button ── */
.uraian-toggle {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.uraian-toggle:hover {
  background: var(--accent-indigo-bg);
  color: var(--accent-indigo);
  border-color: var(--accent-indigo-border);
}

.uraian-toggle svg {
  transition: transform 0.25s ease;
}

.uraian-toggle.active {
  background: var(--accent-indigo-bg);
  color: var(--accent-indigo);
  border-color: var(--accent-indigo-border);
}

.uraian-toggle.active svg {
  transform: rotate(180deg);
}

/* ── Uraian Panel ── */
.uraian-panel {
  padding: 0 12px 10px;
  animation: uraianSlide 0.25s ease;
}

@keyframes uraianSlide {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.uraian-inner {
  padding: 10px 12px;
  background: var(--bg-elevated);
  border-radius: 8px;
  border-left: 3px solid var(--accent-indigo);
}

.uraian-header {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  font-weight: 700;
  color: var(--accent-indigo);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
}

.uraian-header svg {
  flex-shrink: 0;
  opacity: 0.7;
}

.uraian-body {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.7;
  max-height: 400px;
  overflow-y: auto;
  word-break: break-word;
}

.uraian-body :deep(p) {
  margin: 0 0 8px;
}

.uraian-body :deep(p:last-child) {
  margin-bottom: 0;
}

.uraian-body :deep(br) {
  display: block;
  margin-top: 3px;
}

/* Custom scrollbar for uraian */
.uraian-body::-webkit-scrollbar {
  width: 4px;
}

.uraian-body::-webkit-scrollbar-track {
  background: transparent;
}

.uraian-body::-webkit-scrollbar-thumb {
  background: var(--border-subtle);
  border-radius: 4px;
}

/* ── Empty State ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  gap: 4px;
}

.empty-icon {
  color: var(--accent-success);
  opacity: 0.4;
  display: flex;
  margin-bottom: 4px;
}

.empty-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.empty-subtitle {
  font-size: 11px;
  color: var(--text-dim);
}
</style>
