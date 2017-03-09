const jsdom = require('jsdom');

class Scrape {
    constructor(url, fnProcess = null, libs = []) {
        this.url = url || null;
        this.libs = [...["http://code.jquery.com/jquery.js"], libs];
        this.fnProcess = (typeof fnProcess === 'function') ? fnProcess : function(window) {
            return {body: window.document.body.innerHTML, title: window.document.title};
        }
        this.output = null;
    }
    
    scrape() {
        return new Promise ((resolve, reject) => {
            jsdom.env(
             this.url,
              ["http://code.jquery.com/jquery.js"],
               (err, window) => {
                if (err)
                {
                    return reject(err);
                }
                this.output = this.fnProcess(window);
                resolve(this.output);
              }
            );
        });
    }
}

module.exports = { Scrape }