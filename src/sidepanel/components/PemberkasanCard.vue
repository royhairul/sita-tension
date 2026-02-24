<script setup lang="ts">
import { ref } from 'vue'
import type { BerkasItem } from '@/types/sita'

defineProps<{
  seminar: BerkasItem[]
  sidang: BerkasItem[]
}>()

const collapsedSections = ref<Set<string>>(new Set())

function toggleSection(key: string) {
  if (collapsedSections.value.has(key)) {
    collapsedSections.value.delete(key)
  } else {
    collapsedSections.value.add(key)
  }
}

function isOpen(key: string): boolean {
  return !collapsedSections.value.has(key)
}

function getProgress(items: BerkasItem[]): { uploaded: number; total: number; percent: number } {
  const total = items.length
  const uploaded = items.filter(i => i.uploaded).length
  return { uploaded, total, percent: total > 0 ? Math.round((uploaded / total) * 100) : 0 }
}

function openFile(url: string) {
  chrome.tabs.create({ url })
}
</script>

<template>
  <div class="card pemberkasan-card">
    <div class="card-header">
      <span class="card-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      </span>
      <span class="card-title">Pemberkasan</span>
    </div>

    <!-- Seminar Proposal Section -->
    <div v-if="seminar.length > 0" class="berkas-section">
      <button class="section-toggle" @click="toggleSection('seminar')">
        <div class="section-left">
          <svg class="toggle-chevron" :class="{ open: isOpen('seminar') }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span class="section-label">Seminar Proposal</span>
        </div>
        <div class="section-right">
          <span class="progress-badge" :class="{ complete: getProgress(seminar).percent === 100 }">
            {{ getProgress(seminar).uploaded }}/{{ getProgress(seminar).total }}
          </span>
        </div>
      </button>

      <div v-if="isOpen('seminar')" class="section-body">
        <div class="progress-bar">
          <div class="progress-fill seminar-fill" :style="{ width: getProgress(seminar).percent + '%' }"></div>
        </div>
        <ul class="berkas-list">
          <li v-for="item in seminar" :key="item.nama" class="berkas-item" :class="{ uploaded: item.uploaded }">
            <span class="berkas-icon">
              <svg v-if="item.uploaded" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </span>
            <span class="berkas-nama">{{ item.nama }}</span>
            <button v-if="item.fileUrl" class="berkas-link" @click="openFile(item.fileUrl!)" title="Lihat Berkas">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Sidang Akhir Section -->
    <div v-if="sidang.length > 0" class="berkas-section">
      <button class="section-toggle" @click="toggleSection('sidang')">
        <div class="section-left">
          <svg class="toggle-chevron" :class="{ open: isOpen('sidang') }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span class="section-label">Sidang Akhir</span>
        </div>
        <div class="section-right">
          <span class="progress-badge" :class="{ complete: getProgress(sidang).percent === 100 }">
            {{ getProgress(sidang).uploaded }}/{{ getProgress(sidang).total }}
          </span>
        </div>
      </button>

      <div v-if="isOpen('sidang')" class="section-body">
        <div class="progress-bar">
          <div class="progress-fill sidang-fill" :style="{ width: getProgress(sidang).percent + '%' }"></div>
        </div>
        <ul class="berkas-list">
          <li v-for="item in sidang" :key="item.nama" class="berkas-item" :class="{ uploaded: item.uploaded }">
            <span class="berkas-icon">
              <svg v-if="item.uploaded" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </span>
            <span class="berkas-nama">{{ item.nama }}</span>
            <button v-if="item.fileUrl" class="berkas-link" @click="openFile(item.fileUrl!)" title="Lihat Berkas">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="seminar.length === 0 && sidang.length === 0" class="empty-state">
      <span class="empty-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          <line x1="9" y1="13" x2="15" y2="13" />
        </svg>
      </span>
      <span class="empty-title">Tidak ada berkas</span>
      <span class="empty-subtitle">Data pemberkasan belum tersedia</span>
    </div>
  </div>
</template>

<style scoped>
.pemberkasan-card { padding: 16px; }

.card-icon {
  color: var(--accent-indigo);
  display: flex;
  align-items: center;
}

/* ── Section ── */
.berkas-section {
  margin-bottom: 10px;
  border-radius: 10px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  overflow: hidden;
}

.berkas-section:last-of-type { margin-bottom: 0; }

/* ── Section Toggle Header ── */
.section-toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s;
}

.section-toggle:hover {
  background: var(--bg-elevated);
}

.section-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toggle-chevron {
  color: var(--text-muted);
  flex-shrink: 0;
  transition: transform 0.25s ease;
}

.toggle-chevron.open {
  transform: rotate(90deg);
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.section-right {
  display: flex;
  align-items: center;
}

.progress-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--accent-warning-bg);
  color: var(--accent-warning);
}

.progress-badge.complete {
  background: var(--accent-success-bg);
  color: var(--accent-success);
}

/* ── Section Body ── */
.section-body {
  padding: 0 12px 10px;
  animation: sectionSlide 0.2s ease;
}

@keyframes sectionSlide {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── Progress Bar ── */
.progress-bar {
  height: 3px;
  background: var(--border-subtle);
  border-radius: 3px;
  margin-bottom: 8px;
  overflow: hidden;
}

.progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
.seminar-fill { background: var(--progress-seminar); }
.sidang-fill { background: var(--progress-sidang); }

/* ── Berkas List ── */
.berkas-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; }

.berkas-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 6px;
  transition: background 0.15s;
}

.berkas-item:hover { background: var(--bg-elevated); }

.berkas-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.berkas-item.uploaded .berkas-icon { color: var(--accent-success); }
.berkas-item:not(.uploaded) .berkas-icon { color: var(--accent-danger); }

.berkas-nama {
  font-size: 11px;
  color: var(--text-secondary);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.berkas-item:not(.uploaded) .berkas-nama { color: var(--text-muted); }

.berkas-link {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  color: var(--accent-indigo);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}

.berkas-link:hover {
  background: var(--accent-indigo-bg);
  border-color: var(--accent-indigo-border);
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
  color: var(--text-dim);
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
