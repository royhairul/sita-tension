
# 📄 **PRD.md — SITA Monitoring Extension Poliwangi**

# Product Requirements Document (PRD)
# SITA Monitoring Extension – Poliwangi

## 1. Product Overview

### Product Name
sita-tension

### Product Type
Browser Extension (Chrome / Edge)

### Target System
https://ta.poliwangi.ac.id/~sita

### Product Description
SITA Monitoring Extension adalah browser extension yang membantu mahasiswa Politeknik Negeri Banyuwangi memonitor progres Tugas Akhir secara cepat melalui ringkasan informasi penting dari sistem SITA tanpa perlu membuka banyak halaman.

Extension melakukan akuisisi data otomatis dari halaman SITA yang telah login melalui SSO dan menampilkan:

- tahap Tugas Akhir mahasiswa
- judul TA aktif
- status seminar dan sidang
- status pemberkasan
- revisi penguji
- jadwal TA

Extension bersifat read-only dan tidak memodifikasi sistem SITA.

---

## 2. Problem Statement

Mahasiswa mengalami kesulitan karena:

- Informasi TA tersebar di banyak halaman
- Tidak ada dashboard progres TA
- Sulit mengetahui tahap TA saat ini
- Sulit mengetahui berkas yang belum diupload
- Revisi dosen tidak mudah dipantau
- Navigasi sistem memakan waktu

---

## 3. Goals & Objectives

### Primary Goals
- Menyediakan monitoring cepat progres TA
- Menampilkan ringkasan status TA
- Menampilkan kelengkapan berkas
- Menampilkan revisi penguji
- Meningkatkan user experience sistem SITA

### Success Metrics
- User dapat melihat progres TA dalam < 5 detik
- User mengetahui berkas yang belum upload
- User mengetahui revisi terbaru
- Extension stabil mengambil data dari SITA

---

## 4. Target Users

### Primary Users
- Mahasiswa Poliwangi pengguna SITA
- Mahasiswa tingkat akhir

### Secondary Users (Future)
- Dosen pembimbing
- Admin akademik



## 5. Core Features (MVP)


### 5.1 Monitoring Tahap Tugas Akhir

#### Source
/apps/dashboard

#### Data
- Status pengajuan TA
- Status seminar proposal
- Status sidang akhir

#### Output
```

Pengajuan TA → Sudah Disetujui
Seminar Proposal → Sudah Pemberkasan
Sidang Akhir → Ditolak / Disetujui

```

---

### 5.2 Monitoring Judul Tugas Akhir

#### Source
/apps/jadwal-seminar  
/apps/jadwal-sidang

#### Data
- Judul TA aktif
- Status TA
- Tipe TA (kelompok/individu)

---

### 5.3 Monitoring Jadwal Seminar dan Sidang

#### Data
- Tanggal
- Waktu
- Ruangan
- Status kegiatan

---

### 5.4 Monitoring Pemberkasan Seminar

#### Source
/apps/jadwal-seminar (modal unggah berkas)

#### Data
- Daftar berkas wajib
- Status upload
- Status verifikasi

#### Output
```

✓ Proposal
✓ Scan KHS
✗ Poster
✗ Berita Acara

```

---

### 5.5 Monitoring Pemberkasan Sidang

#### Source
/apps/jadwal-sidang (modal unggah berkas)

#### Data
- Laporan akhir
- Form sidang
- Kartu bimbingan
- Jurnal
- Sertifikat
- Poster
- Dokumen pendukung lain

---

### 5.6 Monitoring Revisi Penguji Seminar

#### Data
- Catatan revisi
- Status validasi revisi
- Penguji terkait

---

### 5.7 Monitoring Revisi Penguji Sidang

#### Source
/apps/jadwal-sidang/{id}/detail

#### Data
- Nama penguji
- Role penguji
- Status validasi
- Uraian revisi

#### Output
```

Penguji 1 — Sudah Divalidasi
revisi sudah diselesaikan

````

---

### 5.8 Quick Monitoring Popup

Popup extension menampilkan:

- Judul TA
- Tahap TA
- Progres TA
- Status pemberkasan
- Revisi terbaru
- Jadwal terdekat

---

## 6. Unified Data Model

```javascript
{
  judulTA: "",

  tahap: {
    pengajuan: "",
    seminar: "",
    sidang: ""
  },

  jadwal: {
    seminar: { tanggal, waktu, ruangan },
    sidang: { tanggal, waktu, ruangan }
  },

  pemberkasan: {
    seminar: [{ nama, uploaded }],
    sidang: [{ nama, uploaded }]
  },

  revisi: {
    seminar: [],
    sidang: [
      {
        penguji,
        role,
        status,
        uraian
      }
    ]
  }
}
````

---

## 7. User Flow

```
User login SSO
↓
User membuka SITA
↓
Extension mendeteksi halaman
↓
Content script melakukan scraping data
↓
Data disimpan di browser storage
↓
User membuka popup extension
↓
Ringkasan progres TA ditampilkan
```

---

## 8. Technical Requirements

### Platform

* Chrome Extension Manifest V3

### Data Source

* HTML response dari halaman SITA
* Session login via SSO browser

### Extraction Strategy

* DOM query selector
* Page-specific extractor
* MutationObserver untuk dynamic content

### Storage

* Chrome Storage API

### Security Requirements

* Tidak menyimpan credential user
* Read-only data
* Tidak bypass authentication

---

## 9. Non-Functional Requirements

* Ringan dan cepat
* Tidak memperlambat halaman SITA
* Maintainable code
* Modular architecture
* Stabil terhadap perubahan UI minor

