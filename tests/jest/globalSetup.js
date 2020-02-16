require('babel-register')
require('@babel/polyfill/noConflict')
const server = require('../../src/server').default

module.exports = async () => {
    global.httpServer = await server.start({ port:4000 }, () => {
        console.log('\n Server is running ʕ•́ᴥ•̀ʔっ \n\n');
    });
}