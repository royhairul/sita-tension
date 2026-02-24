/**
 * Pengajuan TA extractor — /apps/pengajuan-ta
 * Extracts: judul TA, tipe TA, status, pembimbing, penguji
 *
 * Table structure (#datatable):
 *   thead: No | Judul | Dosen | Status | Aksi
 *   tbody tr:
 *     td[0] = "1"
 *     td[1] = badge(tipe) + h5(judul) + p(keterangan)
 *     td[2] = pembimbing ol + penguji ol
 *     td[3] = status badge
 *     td[4] = aksi link
 */

export interface PengajuanData {
  judulTA: string
  tipeTA: string
  statusTA: string
  pembimbing1: string
  pembimbing2: string
  penguji1: string
  penguji2: string
}

export function extractPengajuanTA(doc: Document = document): PengajuanData {
  const result: PengajuanData = {
    judulTA: '',
    tipeTA: '',
    statusTA: '',
    pembimbing1: '',
    pembimbing2: '',
    penguji1: '',
    penguji2: '',
  }

  try {
    // Get the first data row from #datatable tbody
    const row = doc.querySelector('#datatable tbody tr')
    if (!row) {
      console.warn('[SITA-EXT] pengajuan-ta: no tbody tr found')
      return result
    }

    const cells = row.querySelectorAll('td')
    console.log('[SITA-EXT] pengajuan-ta: found', cells.length, 'cells')
    if (cells.length < 4) return result

    // Cell index 1: Judul info
    const judulCell = cells[1]
    if (judulCell) {
      // Judul — try h5 first, then any bold element, then first line of text
      const judulEl =
        judulCell.querySelector('h5') ||
        judulCell.querySelector('.fw-bold:not(.badge)') ||
        judulCell.querySelector('strong')

      if (judulEl?.textContent) {
        result.judulTA = judulEl.textContent.trim()
      }

      // If still empty, grab the longest text node in the cell
      if (!result.judulTA) {
        const allText = Array.from(judulCell.querySelectorAll('*'))
          .map(el => el.textContent?.trim() || '')
          .filter(t => t.length > 20)
          .sort((a, b) => b.length - a.length)
        if (allText[0]) result.judulTA = allText[0]
      }

      // Tipe from badge
      const badge = judulCell.querySelector('.badge')
      if (badge?.textContent) {
        result.tipeTA = badge.textContent.trim()
      }
    }

    // Cell index 2: Dosen info (Pembimbing & Penguji)
    const dosenCell = cells[2]
    if (dosenCell) {
      const lists = dosenCell.querySelectorAll('ol')

      // First ol = Pembimbing
      if (lists[0]) {
        const items = lists[0].querySelectorAll('li')
        if (items[0]?.textContent) result.pembimbing1 = items[0].textContent.trim()
        if (items[1]?.textContent) result.pembimbing2 = items[1].textContent.trim()
      }

      // Second ol = Penguji
      if (lists[1]) {
        const items = lists[1].querySelectorAll('li')
        if (items[0]?.textContent) result.penguji1 = items[0].textContent.trim()
        if (items[1]?.textContent) result.penguji2 = items[1].textContent.trim()
      }
    }

    // Cell index 3: Status badge
    const statusCell = cells[3]
    if (statusCell) {
      const statusBadge = statusCell.querySelector('.badge')
      if (statusBadge?.textContent) {
        result.statusTA = statusBadge.textContent.trim()
      }
    }

    console.log('[SITA-EXT] Extracted pengajuan TA:', result)
  } catch (err) {
    console.warn('[SITA-EXT] Error extracting pengajuan-ta:', err)
  }

  return result
}
