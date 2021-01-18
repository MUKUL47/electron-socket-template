  
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var mainWindow = null;
const fs = require('fs')
app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', async function () {
  try{
    mainWindow = new BrowserWindow({
      minWidth: 400, minHeight: 600,
      transparent: false,
      frame: true
    });
    mainWindow.loadURL('file://' + __dirname + '/frontend/index.html');
    mainWindow.on('closed', function () {
      mainWindow = null;
      const file = './frontend/renderKey.js';
      if(fs.existsSync(file)){
        fs.unlinkSync(file)
      }
    });
  }catch(ee){
    console.log(ee)
  }
});
