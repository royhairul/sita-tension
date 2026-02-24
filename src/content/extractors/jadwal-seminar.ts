/**
 * Jadwal Seminar extractor — /apps/jadwal-seminar
 * Extracts: judul TA, jadwal seminar, pemberkasan seminar, revisi seminar
 *
 * Real HTML structure (from #datatable tbody tr):
 *   td[0] = No
 *   td[1] = badge(status) + h5(judul) + p(tipeTA) + badge(kelompok)
 *   td[2] = Dosen: pembimbing ol + penguji ol + rekapitulasi nilai
 *   td[3] = Ruangan + tanggal + waktu
 *   td[4] = Aksi buttons + modal(pemberkasan upload form)
 *
 * Pemberkasan is inside modal #myModalUploadNNN:
 *   div.d-flex[id^="document"] contains:
 *     i.file-icon  (bx-check-circle text-success = uploaded, bx-x-circle text-danger = not)
 *     div.fw-bold  (document name as text node, link in p.file-desc)
 */
import type { BerkasItem, JadwalItem, NilaiItem, RevisiItem } from '@/types/sita'

export interface SeminarData {
  judulTA?: string
  tipeTA?: string
  statusSeminar?: string
  detailUrl?: string
  jadwalSeminar: JadwalItem | null
  pemberkasanSeminar: BerkasItem[]
  revisiSeminar: RevisiItem[]
  nilaiSeminar: NilaiItem[]
  rekapNilaiSeminar: string
}

export function extractJadwalSeminar(doc: Document = document): SeminarData {
  const result: SeminarData = {
    jadwalSeminar: null,
    pemberkasanSeminar: [],
    revisiSeminar: [],
    nilaiSeminar: [],
    rekapNilaiSeminar: '',
  }

  try {
    const row = doc.querySelector('#datatable tbody tr')
    if (!row) {
      console.warn('[SITA-EXT] jadwal-seminar: no data row found')
      return result
    }

    const cells = row.querySelectorAll('td')
    console.log('[SITA-EXT] jadwal-seminar: found', cells.length, 'cells')

    // --- Cell 1 (index 1): Judul, status badge, tipe ---
    if (cells[1]) {
      const judulEl = cells[1].querySelector('h5')
      if (judulEl?.textContent) {
        result.judulTA = judulEl.textContent.trim()
      }

      // Status badge (e.g. "Disetujui dengan revisi")
      const statusBadge = cells[1].querySelector('.badge')
      if (statusBadge?.textContent) {
        result.statusSeminar = statusBadge.textContent.trim()
      }
    }

    // --- Cell 3 (index 3): Schedule (ruangan, tanggal, waktu) ---
    if (cells[3]) {
      result.jadwalSeminar = extractScheduleFromCell(cells[3])
    }

    // --- Cell 4 (index 4): Aksi — extract detail link ---
    if (cells[4]) {
      const detailLink = cells[4].querySelector('a[href*="detail"]') as HTMLAnchorElement | null
      if (detailLink?.href) {
        result.detailUrl = detailLink.href
      }
    }

    // --- Pemberkasan: from modal upload forms ---
    result.pemberkasanSeminar = extractBerkas(doc)

    // --- Revisi: from penguji status icons ---
    result.revisiSeminar = extractRevisi(doc, cells[2])

    // --- Penilaian: from dosen cell ---
    const nilaiData = extractNilai(cells[2])
    result.nilaiSeminar = nilaiData.items
    result.rekapNilaiSeminar = nilaiData.rekap

    console.log('[SITA-EXT] jadwal-seminar extracted:', {
      judulTA: result.judulTA,
      jadwal: result.jadwalSeminar,
      berkasCount: result.pemberkasanSeminar.length,
      revisiCount: result.revisiSeminar.length,
    })
  } catch (err) {
    console.warn('[SITA-EXT] Error extracting jadwal-seminar:', err)
  }

  return result
}

/**
 * Extract schedule from the ruangan cell.
 * Structure:
 *   <strong>Lab. Coworking</strong>
 *   <p>Tanggal: 29/01/2026</p>
 *   <p>Waktu: 14:00 - 14:45</p>
 */
function extractScheduleFromCell(cell: Element): JadwalItem | null {
  const schedule: JadwalItem = { tanggal: '', waktu: '', ruangan: '' }

  // Ruangan from <strong>
  const ruanganEl = cell.querySelector('strong')
  if (ruanganEl?.textContent) {
    schedule.ruangan = ruanganEl.textContent.trim()
  }

  // Parse all <p> elements for tanggal and waktu
  const paragraphs = cell.querySelectorAll('p')
  paragraphs.forEach((p) => {
    const text = p.textContent?.trim() || ''
    if (text.toLowerCase().startsWith('tanggal')) {
      // "Tanggal: 29/01/2026" → extract after ":"
      const val = text.split(':').slice(1).join(':').trim()
      if (val) schedule.tanggal = val
    }
    if (text.toLowerCase().startsWith('waktu')) {
      // "Waktu: 14:00 - 14:45" → extract after first ":"
      const val = text.replace(/^waktu\s*:\s*/i, '').trim()
      if (val) schedule.waktu = val
    }
  })

  // Get status from the badge in the judul cell (cell index 1)
  // We handle this outside since we need the correct cell

  if (schedule.tanggal || schedule.waktu || schedule.ruangan) return schedule
  return null
}

/**
 * Extract pemberkasan from modal upload forms.
 * Each document item:
 *   <div class="d-flex align-items-center gap-2 mb-3" id="documentN">
 *     <i class="file-icon bx bx-check-circle text-success"></i>
 *     <div class="w-100 fw-bold text-start">
 *       Document Name
 *       <p class="file-desc text-muted small m-0 p-0"><a href="...">Lihat berkas</a></p>
 *     </div>
 *   </div>
 */
function extractBerkas(doc: Document): BerkasItem[] {
  const berkas: BerkasItem[] = []

  // Find all document upload items by their ID pattern
  const docItems = doc.querySelectorAll('[id^="document"]')

  docItems.forEach((item) => {
    // Get the document name from the fw-bold div
    const nameDiv = item.querySelector('.fw-bold')
    if (!nameDiv) return

    // The name is the first text content, excluding children like <p>
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

    // Check uploaded status from the file-icon
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
 * Extract revisi info from the dosen cell.
 * Penguji entries with bx-check-circle = revision completed.
 */
function extractRevisi(doc: Document, dosenCell?: Element): RevisiItem[] {
  const revisions: RevisiItem[] = []
  if (!dosenCell) return revisions

  // Find Penguji section — second <ol> in the dosen cell
  const lists = dosenCell.querySelectorAll('ol')
  if (lists.length < 2) return revisions

  const pengujiList = lists[1]
  const items = pengujiList.querySelectorAll('li')

  items.forEach((li, idx) => {
    const nameEl = li.querySelector('p')
    const pengujiName = nameEl?.textContent?.trim() || li.textContent?.trim() || ''
    if (!pengujiName) return

    // Check if revision is done (has check icon)
    const checkIcon = li.querySelector('.bx-check-circle')
    const status = checkIcon ? 'Selesai' : 'Belum'

    // Extract uraian — look for text in spans, small tags, or remaining text after name
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
 * Extract penilaian (scoring) from the dosen cell.
 * Each li in pembimbing/penguji ol has:
 *   <p>Name</p>
 *   <span class="text-muted">Nilai : <strong>81.67</strong> <span>(24.50)</span></span>
 * Rekapitulasi at the bottom: <p class="fw-bold">Rekapitulasi Nilai : 82.90</p>
 */
function extractNilai(dosenCell?: Element): { items: NilaiItem[]; rekap: string } {
  const items: NilaiItem[] = []
  let rekap = ''
  if (!dosenCell) return { items, rekap }

  const lists = dosenCell.querySelectorAll('ol')

  // Process each ol (0=Pembimbing, 1=Penguji)
  const roles = ['Pembimbing', 'Penguji']
  for (let listIdx = 0; listIdx < lists.length; listIdx++) {
    const role = roles[listIdx] || 'Dosen'
    const lis = lists[listIdx].querySelectorAll('li')

    lis.forEach((li, liIdx) => {
      const nameEl = li.querySelector('p')
      const nama = nameEl?.textContent?.trim() || ''
      if (!nama) return
      const numberedRole = `${role} ${liIdx + 1}`

      // Nilai from <strong>
      const strongEl = li.querySelector('strong')
      const nilai = strongEl?.textContent?.trim() || ''

      // Bobot from <span> with parentheses like "(24.50)"
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

  // Rekapitulasi Nilai from the last fw-bold paragraph
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
