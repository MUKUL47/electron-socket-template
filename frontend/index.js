const { ipcRenderer } = require('electron')
let isFetching = false;
window.btn.addEventListener('click', () => {
    if(isFetching){
        return
    }
    isFetching = new Date().valueOf()
    window.btn.innerHTML = 'Fetching...'
    window.h.innerHTML = ''
    ipcRenderer.send('COMPUTE')
})
ipcRenderer.on('COMPUTED', data => {
    window.h.innerHTML = `Fetched from worker thread after ${((new Date().valueOf() - `${isFetching}`)/1000).toFixed()} seconds of synchronous computation`;
    isFetching = null;
    window.btn.innerHTML = 'Fetch'
})