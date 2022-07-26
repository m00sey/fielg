// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const {spawn} = require("child_process");
const log = require('electron-log');
const kill  = require('tree-kill');
let server = null;

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    mainWindow.webContents.openDevTools()

    if (server === null) {
        server = spawn(path.join('./node'), ['server.js']);
        server.on('error', function (err) {
            log.error('spawn error' + err);
        });

        server.stdout.on('data', (data) => {
            let buffer = Buffer.from(data);
            log.info('out:', buffer.toString());
        });

        server.stderr.on('data', (data) => {
            let buffer = Buffer.from(data);
            let err = buffer.toString()
            log.error('err:', err);
        });

        server.on('close', (code) => {
            log.info(`server process exited with code ${code}`);
        });
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    kill(server.pid);
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.