const async = require('async');
const { List } = require('./lib/read'), 
	  { Scrape } = require('./lib/scrape'), 
	  { API } = require('./lib/api');

const csvFilePath = './data/source.csv',
	LIMIT_PARALLEL = 5;

// Step 1 - Init WP
let api = new API();


// Step 2 - Read CSV
const readTheFile = function() {
	let file = new List(csvFilePath);
	console.log('Reading file...');
	return file.read();
};

// Step 3 - Process multiple URLs
const processPages = function(data) {
	data.shift(); // CSV header
	console.log('Processing', data.length, 'pages');
	async.forEachLimit(data, LIMIT_PARALLEL, processSingle, (err)=>{
	    if (err)
	    {
	        return console.error(err);
	    }
	    console.log("Done!");
	});
};


// Step 4 - Get a JSON version of a URL
const scrapePage = function(url) {
	return new Promise((resolve, reject) => {
		if (url.indexOf('http') !== 0) {
			reject('Invalid URL');
		}
		let page = new Scrape(url, fnScrape);
		page.scrape().then((data) => {
			console.log(">> >> Scraped data", data.body.length);
			resolve(data);
		}, (err) => reject);
	});
};

// Scrape function to be executed in DOM
const fnScrape = function(window) {

	// From
	//   The Bhagavad Gita (Arnold translation)/Chapter 1 
	// To
	//   Chapter 1

	let $ = window.jQuery;
	let title = $('#header_section_text').text().replace(/["()]/g, ""),
		body = $('.poem').text()
	return {
		title, 
		body
	};
}


// Step 3 - Get a JSON version of a URL
const processSingle = function(data, cb) {
	let [url] = data;
	console.log(">> Processing ", url);
	scrapePage(url).then((data) => {
		// Step 5 - Add page to WordPress
		api.addPage(data.title, data.body).then((wpId) => {
			console.log(">> Processed ", wpId);
			cb();
		}, cb)
	}, cb);
}


// Kick start the process
api.initialize()
	.then(readTheFile, console.error)
	.then(processPages, console.error);
console.log('WP Auth...');
