const cluster = require('cluster');
if(cluster.isMaster){
  //check main thread => if yes => wait for window initialization of electron window & ipcMain
  const worker = cluster.fork()  
  const fs = require('fs')
  const electron = require('electron');
  const ipcMain = electron.ipcMain;
  //keep track of the events coming from workers thread to main(window browser) thread
  let ipcEvents = {};
  worker.on('message', function(msg) {
    //wait untill worker thread is initialized => create window
    if(msg && msg.appReady){
      initalizeWindow()
    }  

    //handle workers events from here
    else if(msg.type === 'COMPUTE'){
      console.log('from worker-to-main')
      if(ipcEvents['COMPUTE']){
        ipcEvents['COMPUTE'].sender.send('COMPUTED', { ...msg })
        setTimeout(() => delete ipcEvents['COMPUTE'])
      }
    }
  });

  ipcMain.on('COMPUTE', (event) =>{
    console.log('from renderer-to-main')
    /**
     * //this will cause UI to freeze(not responding) since browser window is running on the same thread
      for(let i = 0;i< 7300000000 ;i++){} 
      event.sender.send('COMPUTED'); return;
     */
    //keep track of the event after worker does the heavy synchronous work
    ipcEvents['COMPUTE'] = event;
    worker.send({ type : 'COMPUTE' })
  })

  function initalizeWindow(){
    const app = electron.app;
    const BrowserWindow = electron.BrowserWindow;
    let mainWindow = null;
    app.on('window-all-closed', function () {
      if (process.platform != 'darwin') {
        app.quit();
      }
    });
    try{
        mainWindow = new BrowserWindow({
        minWidth: 400, minHeight: 600,
        transparent: false,
        frame: true,
        webPreferences : { nodeIntegration : true}
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
  }
}
if(!cluster.isMaster){
  //
  process.send({ appReady : true })
  process.on('message', data => {
    if(data?.type === 'COMPUTE'){
      console.log('from main-to-worker',data)
      //this will not cause UI to freeze since heavy computation is going on a different thread. 
      //this useless loop is to demonstrate some synchronous work is going on
      for(let i = 0;i< 7300000000 ;i++){} 
      process.send(data)
    }
  })
}