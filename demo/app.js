const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const WindowStateManager = require('electron-window-state-manager');
var Menu = require("electron").Menu;

// Create a new instance of the WindowStateManager
// and pass it the name and the default properties
const mainWindowState = new WindowStateManager('mainWindow', {
    defaultWidth: 700,
    defaultHeight: 700
});
let willQuitApp = false;
let mainWindow;
app.on('ready', () => {
    // When creating a new BrowserWindow
    // you can assign the properties of the mainWindowState.
    // If a window with the name 'main' was saved before,
    // the saved values will now be assigned to the BrowserWindow again
    mainWindow = new BrowserWindow({
      titleBarStyle: "hidden",
      width: mainWindowState.width,
      height: mainWindowState.height,
      x: mainWindowState.x,
      y: mainWindowState.y,
    });
    const { blockWindowAds, adBlocker } = require('electron-ad-blocker');
        blockWindowAds(mainWindow);

        // You can also provide options, like so:
        blockWindowAds(mainWindow, {});

        // You can also use the adBlocker to provide custom rules as described in the brave ad-block.
        // (https://github.com/brave/ad-block) For example, blacklist a website:
        adBlocker.parse('||blacklistwebsite.com')
        // Check this page for rule info: https://adblockplus.org/filters.
        // This means you can also whitelist a website:
        adBlocker.parse('@@||whitelistwebsite.com');
    
    mainWindow.loadURL('file://' + __dirname + '/app/html/electron-tabs.html');

    // You can check if the window was closed in a maximized saveState
    // If so you can maximize the BrowserWindow again
    if (mainWindowState.maximized) {
        mainWindow.maximize();
    }

    // Don't forget to save the current state
    // of the Browser window when it's about to be closed
    mainWindow.on('close', (e) => {
        if (willQuitApp) {
            /* the user tried to quit the app */
            mainWindow = null;
        } else {
            /* the user only tried to close the window */
            e.preventDefault();
            if (mainWindow.isFullScreen()) {
                mainWindow.once('leave-full-screen', function () {
                    mainWindow.hide();
                })
                mainWindow.setFullScreen(false);
            } else {
                mainWindow.hide();
            }
        }
    });
    // Create the Application's main menu
    var template = [{
        label: "Application",
        submenu: [{
                label: "About Application",
                selector: "orderFrontStandardAboutPanel:"
            },
            {
                type: "separator"
            },
            {
                label: "Quit",
                accelerator: "Command+Q",
                click: function () {
                    app.quit();
                }
            }
        ]
    }, {
        label: "Edit",
        submenu: [{
                label: "Undo",
                accelerator: "CmdOrCtrl+Z",
                selector: "undo:"
            },
            {
                label: "Redo",
                accelerator: "Shift+CmdOrCtrl+Z",
                selector: "redo:"
            },
            {
                type: "separator"
            },
            {
                label: "Cut",
                accelerator: "CmdOrCtrl+X",
                selector: "cut:"
            },
            {
                label: "Copy",
                accelerator: "CmdOrCtrl+C",
                selector: "copy:"
            },
            {
                label: "Paste",
                accelerator: "CmdOrCtrl+V",
                selector: "paste:"
            },
            {
                label: "Select All",
                accelerator: "CmdOrCtrl+A",
                selector: "selectAll:"
            }
        ]
    }];

    //Menu.setApplicationMenu(Menu.buildFromTemplate(template));
});
app.on('activate', () => mainWindow.show());

app.on('before-quit', () => willQuitApp = true);
