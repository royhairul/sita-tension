import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: 'SITA Monitoring — Poliwangi',
  description: 'Monitor progres Tugas Akhir dari sistem SITA Poliwangi secara cepat.',
  version: pkg.version,
  icons: {
    48: 'public/logo.png',
    128: 'public/logo.png',
  },
  action: {
    default_icon: {
      48: 'public/logo.png',
    },
  },
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module',
  },
  content_scripts: [{
    js: ['src/content/main.ts'],
    matches: ['https://ta.poliwangi.ac.id/*'],
  }],
  permissions: [
    'storage',
    'sidePanel',
  ],
  side_panel: {
    default_path: 'src/sidepanel/index.html',
  },
})
