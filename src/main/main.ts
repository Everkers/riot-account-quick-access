/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Tray,
  Menu,
  globalShortcut,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
import keySender from 'node-key-sender';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click() {
        mainWindow?.show();
      },
    },
    {
      label: 'Quit',
      click() {
        mainWindow?.destroy();
        app.quit();
      },
    },
  ]);
  const appIcon = new Tray(getAssetPath('icon.png'));
  appIcon.on('click', () => mainWindow?.show());
  appIcon.setContextMenu(contextMenu);
  mainWindow = new BrowserWindow({
    width: 616,
    show: true,
    frame: false,
    titleBarStyle: 'hidden',
    height: 628,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    globalShortcut.register('Alt+S', () => mainWindow?.show());
    mainWindow.minimize();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Setup protocol
 */

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('qs', process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  } else {
    app.setAsDefaultProtocolClient('qs');
  }
} else {
  app.setAsDefaultProtocolClient('qs');
}

const appIsLocked = app.requestSingleInstanceLock();
if (!appIsLocked) {
  app.quit();
} else {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.on('second-instance', (_e, argv) => {
    console.log('test');
    log.info('test');
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      log.warn(
        'Attempt to open another instance of the app. Focusing the existing window.'
      );
      mainWindow.focus();

      // Check if the second-instance was fired through a protocol link.
      const isProtocol = argv.find((arg) => arg.startsWith('qs://'));
      if (isProtocol) {
        log.info('protocol link detected');

        const formattedURL: URL = new URL(isProtocol);
        mainWindow.webContents.send('open-protocol', {
          full: isProtocol,
          location: isProtocol.match(/^qs:\/\/(.+?)\//)?.[1],
          query: Object.fromEntries(
            new URLSearchParams(formattedURL.search) as unknown as Iterable<
              [string, string]
            >
          ),
        });
      }
    }
  });
}

/**
 * IPC Events
 */

ipcMain.on('select-account', async (_, account) => {
  mainWindow?.minimize();
  await keySender.sendKey('tab');
  await keySender.sendText(account[0].username);
  await keySender.sendKey('tab');
  await keySender.sendText(account[0].password);
  await keySender.sendCombination(['shift', 'tab']);
  await keySender.sendCombination(['shift', 'tab']);
});
ipcMain.on('minimize', async () => {
  ipcMain.on('minimize', async () => mainWindow?.hide());
});
/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
