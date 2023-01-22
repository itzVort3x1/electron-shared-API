// Modules
const {app, BrowserWindow, ipcMain} = require('electron');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

ipcMain.handle('app-path', () => {
  return app.getAppPath('desktop')
});

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  let progress = 0.01

  let progressInterval = setInterval(() => {
    mainWindow.setProgressBar(progress)
    progress += 0.01
    if (progress <= 1){
      progress += 0.01
    } else {
      mainWindow.setProgressBar(-1)
      clearInterval(progressInterval)
    }
      
  }, 100);

  mainWindow.setProgressBar(progress)

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html')

  // let i = 1;
  // mainWindow.webContents.on('paint', (e, dirty, image) => {
  //   let screenshot = image.toPNG();
  //   fstat.writeFile(app.getPath('desktop') + `/screenshot_${i}.png`, screenshot, console.log)
  //   i++;
  // })

  // mainWindow.webContents.on('did-finish-load', () => {
  //   console.log(mainWindow.getTitle());
  //   mainWindow.close();
  //   mainWindow = null;
  // })

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on( 'crashed', () => {

    setTimeout( () => {
      mainWindow.reload()
    }, 1000)
  })

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
