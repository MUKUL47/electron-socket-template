import { io } from 'socket.io-client';
import * as CryptoJS from 'crypto-js';
const socket = io('http://localhost:3000');
const renderKey = window.renderKey;
console.log(renderKey)
socket.emit('REMOVE_KEY', { key : renderKey })
let isFetching = false;
window.btn.addEventListener('click', () => {
    if(isFetching){
        return
    }
    window.btn.innerHTML = 'Fetching...'
    window.h.innerHTML = ''
    isFetching = new Date().valueOf();
    socket.emit('FROM_RENDER', CryptoJS.AES.encrypt(JSON.stringify({ message : 'FROM RENDER' }), renderKey).toString())
})
socket.on('FROM_SERVER', data => {
    window.h.innerHTML = `Fetched from socket server after ${((new Date().valueOf() - `${isFetching}`)/1000).toFixed()} seconds of synchronous computation`;
    isFetching = null;
    window.btn.innerHTML = 'Fetch'
    const decryptedData = CryptoJS.AES.decrypt(data, renderKey).toString(CryptoJS.enc.Utf8)
    console.log('decrypted-data-server: ',JSON.parse(decryptedData))
})