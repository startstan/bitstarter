#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
// Adding restler to get the url and its contents.
var util = require('util');
var rest = require('restler');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://boiling-cove-3955.herokuapp.com";
var URLFILE_DEFAULT = "urlIndex.html";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var checkURL = function(result, checksfile){
    $ = cheerio.load(result);
    var checks = loadChecks(checksfile).sort();
        var out = {};
        for(var ii in checks) {
	            var present = $(checks[ii]).length > 0;
	            out[checks[ii]] = present;
	        }
    return out;  
}

if(require.main == module) {
    program
    // The original grader.js code had a bug which would always use the default options
    // using <> or [] in the option makes it either a required or optional argument respectively
    
        .option('-c, --checks <check_file>', 'Path to checks.json', assertFileExists, CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', assertFileExists, HTMLFILE_DEFAULT)
        .option('-u, --url [URL]', 
		'URL of the Optional BitStarter site (will default to http://boiling-cove-3955.herokuapp.com)',
		 URL_DEFAULT)
        .parse(process.argv);
    var outJson = JSON.stringify("Insufficient arguments!", null, 4);
    if(program.url && program.checks){
	rest.get(program.url).on('complete', function(result){
	    if(result instanceof Error){
		console.error('Error: ' + util.format(result.message));
		} else {
		    //console.log(result);
		    var checkJson = checkURL(result,program.checks);
		    outJson = JSON.stringify(checkJson, null, 4); 
		    console.log(outJson);
		}    
	    });
	//var checkJson = rest.get(program.url).on('complete', function(result){checkURL(result,program.checks)});
	//outJson = JSON.stringify(checkJson, null, 4);      
	//console.log(outJson);	 
    }
    else if(program.file && program.checks){
	var checkJson = checkHtmlFile(program.file, program.checks);
	outJson = JSON.stringify(checkJson, null, 4);      
	console.log(outJson);
    }
    else
	console.log(outJson);
    
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
