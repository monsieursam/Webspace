const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const WindowStateManager = require('electron-window-state-manager');

// Create a new instance of the WindowStateManager
// and pass it the name and the default properties
const mainWindowState = new WindowStateManager('mainWindow', {
    defaultWidth: 1024,
    defaultHeight: 768
});

app.on('ready', () => {
    // When creating a new BrowserWindow
    // you can assign the properties of the mainWindowState.
    // If a window with the name 'main' was saved before,
    // the saved values will now be assigned to the BrowserWindow again
    const mainWindow = new BrowserWindow({titleBarStyle: 'hidden',
        width: mainWindowState.width,
        height: mainWindowState.height,
        x: mainWindowState.x,
        y: mainWindowState.y
    });
    mainWindow.loadURL('file://' + __dirname + '/electron-tabs.html');

    // You can check if the window was closed in a maximized saveState
    // If so you can maximize the BrowserWindow again
    if (mainWindowState.maximized) {
        mainWindow.maximize();
    }

    // Don't forget to save the current state
    // of the Browser window when it's about to be closed
    mainWindow.on('close', () => {
        mainWindowState.saveState(mainWindow);
    });

});
app.on('window-all-closed', () => {
if (process.platform !== 'darwin') {
  app.quit()
  }
})
app.on('activate', () => {
  const mainWindow = new BrowserWindow({titleBarStyle: 'hidden',
      width: mainWindowState.width,
      height: mainWindowState.height,
      x: mainWindowState.x,
      y: mainWindowState.y
  });
  mainWindow.loadURL('file://' + __dirname + '/electron-tabs.html');

  // You can check if the window was closed in a maximized saveState
  // If so you can maximize the BrowserWindow again
  if (mainWindowState.maximized) {
      mainWindow.maximize();
  }

  // Don't forget to save the current state
  // of the Browser window when it's about to be closed
  mainWindow.on('close', () => {
      mainWindowState.saveState(mainWindow);
  });
})
