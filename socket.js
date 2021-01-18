const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const crypto = require('crypto-js');
const fs = require('fs')
const path = require('path')
const renderKey = generateRenderSocketKey();
io.on('connection', (socket) => {
    socket.on('FROM_RENDER', data => {
        const decryptedData = crypto.AES.decrypt(data, renderKey).toString(crypto.enc.Utf8)
        console.log('decrypted-data-render: ',JSON.parse(decryptedData))
        /**this useless loop is to simulate some hugh synchronous computation 
        (storing into db (multiple queries)/ fetching huge amounts of drive data etc) is going on behind the render scenes
        without actually blocking render process.
        **/
        for(let i = 0;i< 7300000000 ;i++){} 
        io.emit('FROM_SERVER', crypto.AES.encrypt(JSON.stringify({ message : 'FROM SERVER' }), renderKey).toString())
    })
});
http.listen(3000);

function generateRenderSocketKey(){
    /**
     * Generate any random key, point to the frontend dist & attach to window element
     * later this key will be used for data exchange
     */
    const renderKey = `${Math.random()}-${Math.random()}-${Math.random()}` //lul
    fs.writeFileSync(path.join(__dirname, './frontend/renderKey.js'), `window.renderKey="${renderKey}"`, { encoding : 'utf-8' });
    return renderKey;
}