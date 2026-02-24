import type { SitaData } from '@/types/sita'
import { createEmptySitaData, createEmptyProfile } from '@/types/sita'

const STORAGE_KEY = 'sitaData'

/**
 * Save SITA data to Chrome local storage
 */
export async function saveSitaData(data: Partial<SitaData>): Promise<void> {
  const existing = await loadSitaData()
  const merged: SitaData = {
    ...existing,
    ...data,
    profile: { ...existing.profile, ...(data.profile || {}) },
    tahap: { ...existing.tahap, ...(data.tahap || {}) },
    jadwal: { ...existing.jadwal, ...(data.jadwal || {}) },
    pemberkasan: {
      seminar: data.pemberkasan?.seminar ?? existing.pemberkasan.seminar,
      sidang: data.pemberkasan?.sidang ?? existing.pemberkasan.sidang,
    },
    revisi: {
      seminar: data.revisi?.seminar ?? existing.revisi.seminar,
      sidang: data.revisi?.sidang ?? existing.revisi.sidang,
    },
    lastSync: Date.now(),
  }
  await chrome.storage.local.set({ [STORAGE_KEY]: merged })
}

/**
 * Load SITA data from Chrome local storage
 */
export async function loadSitaData(): Promise<SitaData> {
  const result = await chrome.storage.local.get(STORAGE_KEY) as Record<string, SitaData>
  const stored = result[STORAGE_KEY]
  if (!stored) return createEmptySitaData()
  // Ensure backward compat: old data may lack newer fields
  return {
    ...createEmptySitaData(),
    ...stored,
    profile: { ...createEmptyProfile(), ...(stored.profile || {}) },
  }
}

/**
 * Listen for changes to SITA data in storage
 */
export function onSitaDataChanged(callback: (data: SitaData) => void): () => void {
  const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (changes[STORAGE_KEY]) {
      const raw = changes[STORAGE_KEY].newValue as SitaData | undefined
      const data: SitaData = {
        ...createEmptySitaData(),
        ...(raw || {}),
        profile: { ...createEmptyProfile(), ...(raw?.profile || {}) },
      }
      callback(data)
    }
  }
  chrome.storage.onChanged.addListener(listener)
  return () => chrome.storage.onChanged.removeListener(listener)
}

/**
 * Clear all stored SITA data
 */
export async function clearSitaData(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEY)
}
