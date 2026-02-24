/**
 * Background service worker for SITA Monitoring Extension.
 * Opens the side panel when the extension icon is clicked.
 */

// Make clicking the extension icon open the side panel directly
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .catch((err: Error) => console.warn('[SITA-EXT] setPanelBehavior failed:', err))
