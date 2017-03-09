const { API } = require ('./lib/api');
let api = new API();
api.initialize().then(console.log, console.error);
