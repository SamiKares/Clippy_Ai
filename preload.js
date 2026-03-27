const { ipcRenderer } = require('electron');

// Expose safe IPC methods to renderer
window.electronAPI = {
  setIgnoreMouse: (ignore) => ipcRenderer.send('set-ignore-mouse', ignore),
  dragWindow: (delta) => ipcRenderer.send('drag-window', delta),
  closeApp: () => ipcRenderer.send('close-app'),
  hideApp: () => ipcRenderer.send('hide-app'),
};
