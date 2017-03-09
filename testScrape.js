const { Scrape } = require ('./lib/scrape');
let page = new Scrape('http://example.org/', function (window) {
    return {title: window.title, body: window.jQuery('p').text()}
})
page.scrape().then(console.log, console.error);