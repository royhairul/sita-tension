<script setup lang="ts">
defineProps<{
  lastSync: number | null
}>()

function formatTime(ts: number | null): string {
  if (!ts) return 'Belum sinkron'
  const d = new Date(ts)
  const now = Date.now()
  const diffMs = now - ts
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Baru saja'
  if (diffMin < 60) return `${diffMin} menit lalu`
  return d.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <header class="header">
    <div class="header-left">
      <div class="logo-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#grad1)" />
          <path d="M2 17l10 5 10-5" stroke="url(#grad2)" stroke-width="2" fill="none" />
          <path d="M2 12l10 5 10-5" stroke="url(#grad2)" stroke-width="2" fill="none" />
          <defs>
            <linearGradient id="grad1" x1="2" y1="2" x2="22" y2="12">
              <stop stop-color="#6366f1" />
              <stop offset="1" stop-color="#8b5cf6" />
            </linearGradient>
            <linearGradient id="grad2" x1="2" y1="12" x2="22" y2="22">
              <stop stop-color="#8b5cf6" />
              <stop offset="1" stop-color="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="header-text">
        <h1 class="title">SITA Monitor</h1>
        <span class="subtitle">Poliwangi — Tugas Akhir</span>
      </div>
    </div>
    <div class="sync-badge" :class="{ synced: lastSync }">
      <span class="sync-dot"></span>
      <span class="sync-text">{{ formatTime(lastSync) }}</span>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.header-text {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 1px;
}

.sync-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.sync-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #64748b;
  transition: background 0.3s;
}

.sync-badge.synced .sync-dot {
  background: #34d399;
  box-shadow: 0 0 6px rgba(52, 211, 153, 0.5);
}

.sync-text {
  font-size: 10px;
  color: #94a3b8;
  white-space: nowrap;
}
</style>
