/**
 * Profile extractor — /apps/profile
 * Extracts student profile from the SITA profile form page.
 */
import type { ProfileData } from '@/types/sita'
import { createEmptyProfile } from '@/types/sita'

export function extractProfile(doc: Document = document): ProfileData {
  const profile = createEmptyProfile()

  try {
    // Read form input values
    profile.nim = getInputValue(doc, 'nim')
    profile.nama = getInputValue(doc, 'name')
    profile.email = getInputValue(doc, 'email')
    profile.prodi = getInputValue(doc, 'programStudi')
    profile.kelas = getInputValue(doc, 'kelas')
    profile.telp = getInputValue(doc, 'telp')

    // Fallback: sidebar user widget
    if (!profile.nama) {
      const sidebarName = doc.querySelector('.user-wid .text-reset')
      if (sidebarName?.textContent) {
        profile.nama = sidebarName.textContent.trim()
      }
    }

    // Fallback: header dropdown name
    if (!profile.nama) {
      const headerName = doc.querySelector('#page-header-user-dropdown .d-xl-inline-block')
      if (headerName?.textContent) {
        profile.nama = headerName.textContent.trim()
      }
    }
  } catch (err) {
    console.warn('[SITA-EXT] Error extracting profile:', err)
  }

  return profile
}

function getInputValue(doc: Document, name: string): string {
  const input = doc.querySelector(`input[name="${name}"]`) as HTMLInputElement | null
  return input?.value?.trim() || ''
}
