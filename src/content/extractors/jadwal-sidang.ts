/**
 * Jadwal Sidang extractor — /apps/jadwal-sidang
 * Extracts: judul TA, jadwal sidang, pemberkasan sidang, revisi sidang
 *
 * Same HTML structure as jadwal-seminar:
 *   #datatable tbody tr → td[0..4]
 *   Pemberkasan in modal #myModalUploadNNN
 *   Schedule in td[3]: <strong>ruangan</strong> + <p>Tanggal/Waktu</p>
 */
import type { BerkasItem, JadwalItem, NilaiItem, RevisiItem } from '@/types/sita'

export interface SidangData {
  judulTA?: string
  tipeTA?: string
  statusSidang?: string
  detailUrl?: string
  jadwalSidang: JadwalItem | null
  pemberkasanSidang: BerkasItem[]
  revisiSidang: RevisiItem[]
  nilaiSidang: NilaiItem[]
  rekapNilaiSidang: string
}

export function extractJadwalSidang(doc: Document = document): SidangData {
  const result: SidangData = {
    jadwalSidang: null,
    pemberkasanSidang: [],
    revisiSidang: [],
    nilaiSidang: [],
    rekapNilaiSidang: '',
  }

  try {
    const row = doc.querySelector('#datatable tbody tr')
    if (!row) {
      console.warn('[SITA-EXT] jadwal-sidang: no data row found')
      return result
    }

    const cells = row.querySelectorAll('td')
    console.log('[SITA-EXT] jadwal-sidang: found', cells.length, 'cells')

    // --- Cell 1 (index 1): Judul ---
    if (cells[1]) {
      const judulEl = cells[1].querySelector('h5')
      if (judulEl?.textContent) {
        result.judulTA = judulEl.textContent.trim()
      }

      // Status badge
      const statusBadge = cells[1].querySelector('.badge')
      if (statusBadge?.textContent) {
        result.statusSidang = statusBadge.textContent.trim()
      }
    }

    // --- Cell 3 (index 3): Schedule ---
    if (cells[3]) {
      result.jadwalSidang = extractScheduleFromCell(cells[3])
    }

    // --- Cell 4 (index 4): Aksi — extract detail link ---
    if (cells[4]) {
      const detailLink = cells[4].querySelector('a[href*="detail"]') as HTMLAnchorElement | null
      if (detailLink?.href) {
        result.detailUrl = detailLink.href
      }
    }

    // --- Pemberkasan: from modal upload forms ---
    result.pemberkasanSidang = extractBerkas(doc)

    // --- Revisi: from penguji check icons ---
    result.revisiSidang = extractRevisi(cells[2])

    // --- Penilaian: from dosen cell ---
    const nilaiData = extractNilai(cells[2])
    result.nilaiSidang = nilaiData.items
    result.rekapNilaiSidang = nilaiData.rekap

    console.log('[SITA-EXT] jadwal-sidang extracted:', {
      judulTA: result.judulTA,
      jadwal: result.jadwalSidang,
      berkasCount: result.pemberkasanSidang.length,
      revisiCount: result.revisiSidang.length,
    })
  } catch (err) {
    console.warn('[SITA-EXT] Error extracting jadwal-sidang:', err)
  }

  return result
}

/**
 * Extract schedule from cell:
 *   <strong>Ruangan</strong>
 *   <p>Tanggal: dd/mm/yyyy</p>
 *   <p>Waktu: HH:MM - HH:MM</p>
 */
function extractScheduleFromCell(cell: Element): JadwalItem | null {
  const schedule: JadwalItem = { tanggal: '', waktu: '', ruangan: '' }

  const ruanganEl = cell.querySelector('strong')
  if (ruanganEl?.textContent) {
    schedule.ruangan = ruanganEl.textContent.trim()
  }

  const paragraphs = cell.querySelectorAll('p')
  paragraphs.forEach((p) => {
    const text = p.textContent?.trim() || ''
    if (text.toLowerCase().startsWith('tanggal')) {
      const val = text.split(':').slice(1).join(':').trim()
      if (val) schedule.tanggal = val
    }
    if (text.toLowerCase().startsWith('waktu')) {
      const val = text.replace(/^waktu\s*:\s*/i, '').trim()
      if (val) schedule.waktu = val
    }
  })

  if (schedule.tanggal || schedule.waktu || schedule.ruangan) return schedule
  return null
}

/**
 * Extract pemberkasan from modal upload forms.
 * Each document item: div[id^="document"] with .file-icon and .fw-bold name
 */
function extractBerkas(doc: Document): BerkasItem[] {
  const berkas: BerkasItem[] = []

  const docItems = doc.querySelectorAll('[id^="document"]')

  docItems.forEach((item) => {
    const nameDiv = item.querySelector('.fw-bold')
    if (!nameDiv) return

    // Get document name from text nodes (not child elements)
    let name = ''
    const childNodes = Array.from(nameDiv.childNodes)
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i]
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim()
        if (text && text.length > 1) {
          name = text
          break
        }
      }
    }
    if (!name) return

    const icon = item.querySelector('.file-icon')
    const iconClasses = icon?.className || ''
    const uploaded = iconClasses.includes('text-success') || iconClasses.includes('bx-check-circle')

    // Get file link URL
    const fileLink = item.querySelector('.file-desc a[href]') as HTMLAnchorElement | null
    const fileUrl = fileLink?.getAttribute('href') || ''
    const verified = !!fileLink

    berkas.push({ nama: name, uploaded, verified, fileUrl: fileUrl || undefined })
  })

  return berkas
}

/**
 * Extract revisi from penguji list check icons.
 */
function extractRevisi(dosenCell?: Element): RevisiItem[] {
  const revisions: RevisiItem[] = []
  if (!dosenCell) return revisions

  const lists = dosenCell.querySelectorAll('ol')
  if (lists.length < 2) return revisions

  const pengujiList = lists[1]
  const items = pengujiList.querySelectorAll('li')

  items.forEach((li, idx) => {
    const nameEl = li.querySelector('p')
    const pengujiName = nameEl?.textContent?.trim() || li.textContent?.trim() || ''
    if (!pengujiName) return

    const checkIcon = li.querySelector('.bx-check-circle')
    const status = checkIcon ? 'Selesai' : 'Belum'

    // Extract uraian
    let uraian = ''
    const uraianParts: string[] = []
    const smallEls = li.querySelectorAll('small, .text-muted, span.d-block')
    smallEls.forEach((el) => {
      const t = el.textContent?.trim()
      if (t && t.length > 2 && !t.includes('Nilai') && !t.includes('check')) {
        uraianParts.push(t)
      }
    })
    uraian = uraianParts.join('; ')

    revisions.push({
      penguji: pengujiName,
      role: `Penguji ${idx + 1}`,
      status,
      uraian,
    })
  })

  return revisions
}

/**
 * Extract penilaian from the dosen cell.
 */
function extractNilai(dosenCell?: Element): { items: NilaiItem[]; rekap: string } {
  const items: NilaiItem[] = []
  let rekap = ''
  if (!dosenCell) return { items, rekap }

  const lists = dosenCell.querySelectorAll('ol')
  const roles = ['Pembimbing', 'Penguji']

  for (let listIdx = 0; listIdx < lists.length; listIdx++) {
    const role = roles[listIdx] || 'Dosen'
    const lis = lists[listIdx].querySelectorAll('li')

    lis.forEach((li, liIdx) => {
      const nameEl = li.querySelector('p')
      const nama = nameEl?.textContent?.trim() || ''
      if (!nama) return
      const numberedRole = `${role} ${liIdx + 1}`

      const strongEl = li.querySelector('strong')
      const nilai = strongEl?.textContent?.trim() || ''

      let bobot = ''
      const spans = li.querySelectorAll('span[style]')
      spans.forEach((sp) => {
        const t = sp.textContent?.trim() || ''
        if (t.startsWith('(') && t.endsWith(')')) {
          bobot = t.slice(1, -1)
        }
      })

      items.push({ nama, role: numberedRole, nilai, bobot })
    })
  }

  const boldPs = dosenCell.querySelectorAll('p.fw-bold')
  boldPs.forEach((p) => {
    const text = p.textContent?.trim() || ''
    if (text.toLowerCase().includes('rekapitulasi')) {
      const match = text.match(/[\d.]+\s*$/)
      if (match) rekap = match[0].trim()
    }
  })

  return { items, rekap }
}
