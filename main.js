const { app, BrowserWindow, ipcMain, screen, globalShortcut, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let mainWindow;
let tray;
let isClickThrough = false;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 340,
    height: 480,
    x: width - 360,
    y: height - 500,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.setIgnoreMouseEvents(false);

  // Make window visible on all workspaces/virtual desktops
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // Open DevTools only in development
  mainWindow.webContents.openDevTools({ mode: 'detach' });
}

function createTray() {
  // Create a simple tray icon (1x1 transparent, will use default)
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Clippy',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: 'Hide Clippy',
      click: () => mainWindow.hide()
    },
    { type: 'separator' },
    {
      label: 'Toggle Click-Through',
      click: () => {
        isClickThrough = !isClickThrough;
        mainWindow.setIgnoreMouseEvents(isClickThrough, { forward: true });
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => app.quit()
    }
  ]);

  tray.setToolTip('Clippy AI');
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow();

  // Register global shortcut to toggle Clippy
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// IPC handlers
ipcMain.on('set-ignore-mouse', (event, ignore) => {
  isClickThrough = ignore;
  mainWindow.setIgnoreMouseEvents(ignore, { forward: true });
});

ipcMain.on('drag-window', (event, { deltaX, deltaY }) => {
  const [x, y] = mainWindow.getPosition();
  mainWindow.setPosition(x + deltaX, y + deltaY);
});

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('hide-app', () => {
  mainWindow.hide();
});
