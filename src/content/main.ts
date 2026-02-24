/**
 * SITA Monitoring Extension — Content Script Entry
 *
 * When the user visits ANY SITA page, this script fetches all
 * monitored pages in the background (using the same session cookies)
 * and extracts data from each without requiring manual navigation.
 */
import { extractDashboard } from './extractors/dashboard'
import { extractDetail } from './extractors/detail'
import { extractJadwalSeminar } from './extractors/jadwal-seminar'
import { extractJadwalSidang } from './extractors/jadwal-sidang'
import { extractPengajuanTA } from './extractors/pengajuan-ta'
import { extractProfile } from './extractors/profile'
import { saveSitaData } from '@/utils/storage'
import type { SitaData } from '@/types/sita'

const SITA_BASE = 'https://ta.poliwangi.ac.id/~sita'

const PAGES = {
  profile: `${SITA_BASE}/apps/profile`,
  dashboard: `${SITA_BASE}/apps/dashboard`,
  pengajuanTA: `${SITA_BASE}/apps/pengajuan-ta`,
  jadwalSeminar: `${SITA_BASE}/apps/jadwal-seminar`,
  jadwalSidang: `${SITA_BASE}/apps/jadwal-sidang`,
}

/**
 * Fetch a SITA page and parse it into a Document.
 * Uses same-origin fetch so session cookies are included automatically.
 */
async function fetchPage(url: string): Promise<Document | null> {
  try {
    const response = await fetch(url, { credentials: 'same-origin' })
    if (!response.ok) {
      console.warn(`[SITA-EXT] Failed to fetch ${url}: ${response.status}`)
      return null
    }
    const html = await response.text()
    const parser = new DOMParser()
    return parser.parseFromString(html, 'text/html')
  } catch (err) {
    console.warn(`[SITA-EXT] Error fetching ${url}:`, err)
    return null
  }
}

/**
 * Fetch all SITA pages and extract data from each.
 */
async function fetchAndExtractAll(): Promise<void> {
  console.log('[SITA-EXT] Fetching all SITA pages for data extraction...')

  // Fetch all pages in parallel
  const [profileDoc, dashboardDoc, pengajuanDoc, seminarDoc, sidangDoc] = await Promise.all([
    fetchPage(PAGES.profile),
    fetchPage(PAGES.dashboard),
    fetchPage(PAGES.pengajuanTA),
    fetchPage(PAGES.jadwalSeminar),
    fetchPage(PAGES.jadwalSidang),
  ])

  const update: Partial<SitaData> = {}

  // Extract profile
  if (profileDoc) {
    update.profile = extractProfile(profileDoc)
    console.log('[SITA-EXT] Profile extracted:', update.profile)
  }

  // Extract dashboard (tahap TA)
  if (dashboardDoc) {
    const dashData = extractDashboard(dashboardDoc)
    if (dashData.tahap) update.tahap = dashData.tahap
    console.log('[SITA-EXT] Dashboard extracted:', dashData)
  }

  // Extract pengajuan TA (judul, tipe, status, pembimbing, penguji)
  if (pengajuanDoc) {
    const pengData = extractPengajuanTA(pengajuanDoc)
    if (pengData.judulTA) update.judulTA = pengData.judulTA
    if (pengData.tipeTA) update.tipeTA = pengData.tipeTA
    if (pengData.statusTA) update.statusTA = pengData.statusTA
    // Merge pembimbing/penguji into profile
    const profileUpdate = update.profile || {} as SitaData['profile']
    if (pengData.pembimbing1) profileUpdate.pembimbing1 = pengData.pembimbing1
    if (pengData.pembimbing2) profileUpdate.pembimbing2 = pengData.pembimbing2
    if (pengData.penguji1) profileUpdate.penguji1 = pengData.penguji1
    if (pengData.penguji2) profileUpdate.penguji2 = pengData.penguji2
    update.profile = profileUpdate
    console.log('[SITA-EXT] Pengajuan TA extracted:', pengData)
  }

  // Extract jadwal seminar
  let statusSeminar = ''
  if (seminarDoc) {
    const semData = extractJadwalSeminar(seminarDoc)
    if (semData.judulTA && !update.judulTA) update.judulTA = semData.judulTA
    if (semData.tipeTA && !update.tipeTA) update.tipeTA = semData.tipeTA
    if (semData.statusSeminar) statusSeminar = semData.statusSeminar
    update.jadwal = { ...update.jadwal, seminar: semData.jadwalSeminar } as SitaData['jadwal']
    update.pemberkasan = { ...update.pemberkasan, seminar: semData.pemberkasanSeminar } as SitaData['pemberkasan']
    update.revisi = { ...update.revisi, seminar: semData.revisiSeminar } as SitaData['revisi']
    update.penilaian = {
      ...update.penilaian,
      seminar: semData.nilaiSeminar,
      rekapSeminar: semData.rekapNilaiSeminar,
    } as SitaData['penilaian']
    console.log('[SITA-EXT] Jadwal Seminar extracted:', semData)
  }

  // Extract jadwal sidang
  let statusSidang = ''
  if (sidangDoc) {
    const sidData = extractJadwalSidang(sidangDoc)
    if (sidData.judulTA && !update.judulTA) update.judulTA = sidData.judulTA
    if (sidData.tipeTA && !update.tipeTA) update.tipeTA = sidData.tipeTA
    if (sidData.statusSidang) statusSidang = sidData.statusSidang
    update.jadwal = { ...update.jadwal, sidang: sidData.jadwalSidang } as SitaData['jadwal']
    update.pemberkasan = { ...update.pemberkasan, sidang: sidData.pemberkasanSidang } as SitaData['pemberkasan']
    update.revisi = { ...update.revisi, sidang: sidData.revisiSidang } as SitaData['revisi']
    update.penilaian = {
      ...update.penilaian,
      sidang: sidData.nilaiSidang,
      rekapSidang: sidData.rekapNilaiSidang,
    } as SitaData['penilaian']
    console.log('[SITA-EXT] Jadwal Sidang extracted:', sidData)
  }

  // --- Fetch detail pages for uraian revisi + detailed penilaian ---
  let semDetailUrl: string | undefined
  let sidDetailUrl: string | undefined

  // Get detail URLs directly from the parsed docs (the extractors already found the links)
  if (seminarDoc) {
    const row = seminarDoc.querySelector('#datatable tbody tr')
    if (row) {
      const cells = row.querySelectorAll('td')
      const link = cells[4]?.querySelector('a[href*="detail"]') as HTMLAnchorElement | null
      if (link?.href) semDetailUrl = link.href
    }
  }
  if (sidangDoc) {
    const row = sidangDoc.querySelector('#datatable tbody tr')
    if (row) {
      const cells = row.querySelectorAll('td')
      const link = cells[4]?.querySelector('a[href*="detail"]') as HTMLAnchorElement | null
      if (link?.href) sidDetailUrl = link.href
    }
  }

  // Fetch detail pages in parallel
  const [seminarDetailDoc, sidangDetailDoc] = await Promise.all([
    semDetailUrl ? fetchPage(semDetailUrl) : Promise.resolve(null),
    sidDetailUrl ? fetchPage(sidDetailUrl) : Promise.resolve(null),
  ])

  // Merge seminar detail data
  if (seminarDetailDoc) {
    const detailData = extractDetail(seminarDetailDoc)
    if (detailData.revisiItems.length > 0) {
      update.revisi = { ...update.revisi, seminar: detailData.revisiItems } as SitaData['revisi']
    }
    // Only override rekapNilai from detail page — keep nilaiItems from main page (they have dosen names)
    if (detailData.rekapNilai) {
      update.penilaian = {
        ...update.penilaian,
        rekapSeminar: detailData.rekapNilai,
      } as SitaData['penilaian']
    }
    console.log('[SITA-EXT] Seminar detail extracted:', detailData)
  }

  // Merge sidang detail data
  if (sidangDetailDoc) {
    const detailData = extractDetail(sidangDetailDoc)
    if (detailData.revisiItems.length > 0) {
      update.revisi = { ...update.revisi, sidang: detailData.revisiItems } as SitaData['revisi']
    }
    // Only override rekapNilai from detail page
    if (detailData.rekapNilai) {
      update.penilaian = {
        ...update.penilaian,
        rekapSidang: detailData.rekapNilai,
      } as SitaData['penilaian']
    }
    console.log('[SITA-EXT] Sidang detail extracted:', detailData)
  }

  // Derive tahap — jadwal/pengajuan status always takes precedence over dashboard
  const tahap = update.tahap || { pengajuan: '', seminar: '', sidang: '' }

  // Sanitize dashboard values (it often picks up garbage like "Hari:")
  const isValidStatus = (s: string) => {
    if (!s || s.length < 3) return false
    const lower = s.toLowerCase()
    const keywords = ['disetujui', 'ditolak', 'selesai', 'proses', 'menunggu', 'pending',
      'pemberkasan', 'dijadwalkan', 'lulus', 'gagal', 'revisi', 'belum', 'sudah', 'acc']
    return keywords.some(k => lower.includes(k))
  }
  if (!isValidStatus(tahap.pengajuan)) tahap.pengajuan = ''
  if (!isValidStatus(tahap.seminar)) tahap.seminar = ''
  if (!isValidStatus(tahap.sidang)) tahap.sidang = ''

  // Override with reliable sources
  if (update.statusTA) tahap.pengajuan = update.statusTA
  if (statusSeminar) tahap.seminar = statusSeminar
  if (statusSidang) tahap.sidang = statusSidang
  update.tahap = tahap
  console.log('[SITA-EXT] Tahap derived:', tahap)

  // Save all extracted data at once
  await saveSitaData(update)
  console.log('[SITA-EXT] All data saved successfully.')
}

/**
 * Initialize: run extraction once when on any SITA page.
 */
function init(): void {
  const path = window.location.pathname
  if (!path.includes('/~sita')) {
    console.log('[SITA-EXT] Not on SITA, skipping.')
    return
  }

  console.log('[SITA-EXT] Content script loaded on:', window.location.href)

  // Wait for page to be ready, then fetch all data
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(fetchAndExtractAll, 500)
    })
  } else {
    setTimeout(fetchAndExtractAll, 500)
  }
}

init()
