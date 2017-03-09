const csv = require('fast-csv'),
        fs = require('fs');
        
class List {
     
    constructor (filePath, limit = 500) {
        
        this.filePath = filePath || null;
        this.limit = limit;
        this.data = [];
        this.stream = null;
        
    }
    
    read () {
        return new Promise ((resolve, reject) => {
            if (!(this.filePath && fs.existsSync(this.filePath)))
            {
                return reject('File does not exist');
            }
            // TODO: impement scalable streaming.
            this.stream = fs.createReadStream(this.filePath);
            this.stream.pipe(csv())
                .on("data", (raw) => {
                    if (this.data.length > this.limit)
                    {
                        console.log("Read", "Limit exceeded");
                        return this.stream.destroy();
                    }
                    this.data.push(raw);
                })
                .on("end", () => {
                    resolve(this.data)
                });
            
        })
    }
}

module.exports = { List };