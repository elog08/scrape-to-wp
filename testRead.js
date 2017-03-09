const { List } = require ('./lib/read');
let file = new List('./data/source.csv');
file.read().then(console.log, console.error);