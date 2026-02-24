import { ref, watch, onMounted } from 'vue'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'sitaTheme'
const theme = ref<Theme>('dark')

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
}

export function useTheme() {
  onMounted(async () => {
    try {
      const result = await chrome.storage.local.get(THEME_KEY) as Record<string, Theme>
      if (result[THEME_KEY]) {
        theme.value = result[THEME_KEY]
      }
    } catch {
      // Fallback to default
    }
    applyTheme(theme.value)
  })

  watch(theme, (newTheme) => {
    applyTheme(newTheme)
    try {
      chrome.storage.local.set({ [THEME_KEY]: newTheme })
    } catch {
      // Storage not available
    }
  })

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggleTheme }
}
