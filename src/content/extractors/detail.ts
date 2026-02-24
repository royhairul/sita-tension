/**
 * Detail page extractor — /apps/jadwal-seminar/{id}/detail or /apps/jadwal-sidang/{id}/detail
 *
 * Extracts:
 *   - Revisi uraian from #revisionTab table
 *   - Detailed penilaian per dosen from #ratingTab cards
 *   - Rekapitulasi from #ratingRecapTab table
 *
 * Revisi table structure (#revisionTab):
 *   <table>
 *     <tr>
 *       <td>No.</td>
 *       <td><strong>Name</strong><p>Penguji N</p><span class="badge">Status</span></td>
 *       <td><p>uraian text</p></td>
 *     </tr>
 *
 * Penilaian cards (#ratingTab):
 *   Each .card has:
 *     <strong>(Dosen Name)</strong>
 *     <p class="text-muted small">Pembimbing 1 / Penguji 2</p>
 *     <table> with aspek rows and tfoot totals
 *
 * Rekapitulasi table (#ratingRecapTab):
 *   <table> with Pembimbing 1, Pembimbing 2, Penguji 1, Penguji 2 rows
 *   tfoot: Nilai Angka, Nilai Huruf
 */
import type { NilaiItem, RevisiItem } from '@/types/sita'

export interface DetailData {
  revisiItems: RevisiItem[]
  nilaiItems: NilaiItem[]
  rekapNilai: string
}

export function extractDetail(doc: Document): DetailData {
  const result: DetailData = {
    revisiItems: [],
    nilaiItems: [],
    rekapNilai: '',
  }

  try {
    // --- Extract Revisi from #revisionTab ---
    result.revisiItems = extractRevisiFromDetail(doc)

    // --- Extract Penilaian from #ratingRecapTab ---
    const rekapData = extractRekapFromDetail(doc)
    result.nilaiItems = rekapData.items
    result.rekapNilai = rekapData.rekap

    console.log('[SITA-EXT] Detail page extracted:', {
      revisiCount: result.revisiItems.length,
      nilaiCount: result.nilaiItems.length,
      rekap: result.rekapNilai,
    })
  } catch (err) {
    console.warn('[SITA-EXT] Error extracting detail page:', err)
  }

  return result
}

/**
 * Extract revisi uraian from the #revisionTab table.
 */
function extractRevisiFromDetail(doc: Document): RevisiItem[] {
  const revisions: RevisiItem[] = []
  const tab = doc.querySelector('#revisionTab')
  if (!tab) return revisions

  const rows = tab.querySelectorAll('table tbody tr')
  rows.forEach((tr) => {
    const cells = tr.querySelectorAll('td')
    if (cells.length < 3) return

    // Cell 1: penguji info
    const nameEl = cells[1].querySelector('strong')
    const penguji = nameEl?.textContent?.trim() || ''

    const roleEl = cells[1].querySelector('p.text-muted')
    const role = roleEl?.textContent?.trim() || ''

    const badgeEl = cells[1].querySelector('.badge')
    const status = badgeEl?.textContent?.trim() || ''

    // Cell 2: uraian — use innerHTML to preserve formatting
    const uraian = cells[2]?.innerHTML?.trim() || ''

    if (penguji) {
      revisions.push({ penguji, role, status, uraian })
    }
  })

  return revisions
}

/**
 * Build a role→name mapping from #ratingTab penilaian cards.
 * Each card has: <strong>(Dosen Name)</strong> + <p class="text-muted small">Role</p>
 */
function buildNameMap(doc: Document): Map<string, string> {
  const nameMap = new Map<string, string>()
  const tab = doc.querySelector('#ratingTab')
  if (!tab) return nameMap

  const cards = tab.querySelectorAll('.card')
  cards.forEach((card) => {
    const nameStrong = card.querySelector('.text-center strong')
    const roleP = card.querySelector('.text-center p.text-muted')
    if (nameStrong && roleP) {
      let name = nameStrong.textContent?.trim() || ''
      const role = roleP.textContent?.trim() || ''
      // Remove surrounding parentheses: "(Name)" → "Name"
      if (name.startsWith('(') && name.endsWith(')')) {
        name = name.slice(1, -1)
      }
      if (role && name) {
        nameMap.set(role, name)
      }
    }
  })

  return nameMap
}

/**
 * Extract rekapitulasi nilai from #ratingRecapTab.
 */
function extractRekapFromDetail(doc: Document): { items: NilaiItem[]; rekap: string } {
  const items: NilaiItem[] = []
  let rekap = ''

  const tab = doc.querySelector('#ratingRecapTab')
  if (!tab) return { items, rekap }

  // Build name mapping from penilaian cards
  const nameMap = buildNameMap(doc)

  // Parse the recap table rows
  const rows = tab.querySelectorAll('table tbody tr')
  rows.forEach((tr) => {
    const cells = tr.querySelectorAll('td')
    if (cells.length < 4) return

    const role = cells[1]?.textContent?.trim() || ''
    const nilai = cells[2]?.textContent?.trim() || ''
    const bobotText = cells[3]?.textContent?.trim() || ''

    // Extract the weighted value from "30% X 81.67 = 24.50"
    const bobotMatch = bobotText.match(/=\s*([\d.]+)/)
    const bobot = bobotMatch ? bobotMatch[1] : ''

    // Look up the dosen name from the rating tab
    const nama = nameMap.get(role) || ''

    if (role) {
      items.push({ nama, role, nilai, bobot })
    }
  })

  // Get Nilai Angka from tfoot
  const tfoot = tab.querySelector('table tfoot')
  if (tfoot) {
    const footRows = tfoot.querySelectorAll('tr')
    footRows.forEach((tr) => {
      const cells = tr.querySelectorAll('td')
      if (cells.length < 2) return
      const label = cells[0]?.textContent?.trim() || ''
      const value = cells[1]?.textContent?.trim() || ''
      if (label.includes('Nilai Angka')) {
        rekap = value
      }
    })
  }

  return { items, rekap }
}
