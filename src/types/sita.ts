/**
 * Unified Data Model for SITA Monitoring Extension
 * Matches the PRD specification (Section 6)
 */

export interface JadwalItem {
  tanggal: string
  waktu: string
  ruangan: string
  status?: string
}

export interface BerkasItem {
  nama: string
  uploaded: boolean
  verified?: boolean
  fileUrl?: string
}

export interface RevisiItem {
  penguji: string
  role: string
  status: string
  uraian: string
}

export interface NilaiItem {
  nama: string
  role: string
  nilai: string
  bobot: string
}

export interface ProfileData {
  nama: string
  nim: string
  prodi: string
  angkatan: string
  kelas: string
  email: string
  telp: string
  pembimbing1: string
  pembimbing2: string
  penguji1: string
  penguji2: string
  photoUrl: string
}

export interface TahapTA {
  pengajuan: string
  seminar: string
  sidang: string
}

export interface SitaData {
  profile: ProfileData
  judulTA: string
  tipeTA?: string
  statusTA?: string

  tahap: TahapTA

  jadwal: {
    seminar: JadwalItem | null
    sidang: JadwalItem | null
  }

  pemberkasan: {
    seminar: BerkasItem[]
    sidang: BerkasItem[]
  }

  revisi: {
    seminar: RevisiItem[]
    sidang: RevisiItem[]
  }

  penilaian: {
    seminar: NilaiItem[]
    sidang: NilaiItem[]
    rekapSeminar: string
    rekapSidang: string
  }

  lastSync: number | null
}

export function createEmptyProfile(): ProfileData {
  return { nama: '', nim: '', prodi: '', angkatan: '', kelas: '', email: '', telp: '', pembimbing1: '', pembimbing2: '', penguji1: '', penguji2: '', photoUrl: '' }
}

export function createEmptySitaData(): SitaData {
  return {
    profile: createEmptyProfile(),
    judulTA: '',
    tipeTA: '',
    statusTA: '',
    tahap: {
      pengajuan: '',
      seminar: '',
      sidang: '',
    },
    jadwal: {
      seminar: null,
      sidang: null,
    },
    pemberkasan: {
      seminar: [],
      sidang: [],
    },
    revisi: {
      seminar: [],
      sidang: [],
    },
    penilaian: {
      seminar: [],
      sidang: [],
      rekapSeminar: '',
      rekapSidang: '',
    },
    lastSync: null,
  }
}
