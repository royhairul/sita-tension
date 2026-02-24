/**
 * Dashboard extractor — /apps/dashboard
 * Extracts tahap TA statuses (pengajuan, seminar, sidang)
 */
import type { TahapTA } from '@/types/sita'

export function extractDashboard(doc: Document = document): Partial<{ tahap: TahapTA }> {
  const tahap: TahapTA = {
    pengajuan: '',
    seminar: '',
    sidang: '',
  }

  try {
    const cards = doc.querySelectorAll('.card, .card-body, .info-box, .small-box')

    cards.forEach((card) => {
      const text = card.textContent?.toLowerCase() || ''

      if (text.includes('pengajuan') || text.includes('judul')) {
        const statusEl = card.querySelector('.badge, .label, .status, .text-bold, strong, b')
        tahap.pengajuan = statusEl?.textContent?.trim() || extractStatusFromText(text, 'pengajuan')
      }

      if (text.includes('seminar') && !text.includes('sidang')) {
        const statusEl = card.querySelector('.badge, .label, .status, .text-bold, strong, b')
        tahap.seminar = statusEl?.textContent?.trim() || extractStatusFromText(text, 'seminar')
      }

      if (text.includes('sidang')) {
        const statusEl = card.querySelector('.badge, .label, .status, .text-bold, strong, b')
        tahap.sidang = statusEl?.textContent?.trim() || extractStatusFromText(text, 'sidang')
      }
    })

    // Fallback: try table rows
    if (!tahap.pengajuan && !tahap.seminar && !tahap.sidang) {
      const rows = doc.querySelectorAll('table tr, .timeline-item, .list-group-item')
      rows.forEach((row) => {
        const text = row.textContent?.toLowerCase() || ''
        const cells = row.querySelectorAll('td, .timeline-body, span')
        const statusText = cells.length > 1 ? cells[cells.length - 1]?.textContent?.trim() : ''

        if (text.includes('pengajuan')) tahap.pengajuan = statusText || ''
        if (text.includes('seminar') && !text.includes('sidang')) tahap.seminar = statusText || ''
        if (text.includes('sidang')) tahap.sidang = statusText || ''
      })
    }
  } catch (err) {
    console.warn('[SITA-EXT] Error extracting dashboard:', err)
  }

  return { tahap }
}

function extractStatusFromText(text: string, _keyword: string): string {
  const statusPatterns = [
    'sudah disetujui', 'disetujui', 'ditolak',
    'sudah pemberkasan', 'belum pemberkasan',
    'selesai', 'proses', 'menunggu', 'pending',
    'sudah dijadwalkan', 'belum dijadwalkan',
  ]

  for (const pattern of statusPatterns) {
    if (text.includes(pattern)) {
      return pattern.charAt(0).toUpperCase() + pattern.slice(1)
    }
  }
  return ''
}
