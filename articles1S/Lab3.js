var fs = require('fs');//Loads File System
var http = require('http');
var url = require('url');

///These are the .art filenames to test in an array
var messages = ["foodPoisoning.art", "weightLifting.art", "nutrition.art"];

///Creates a server listening on port 3000. If the user types http://localhost:3000/?msg=0 
/// or msg=1, or msg=2 it will display the files. If msg=  nothing then it will display No msg parameter. 
/// Otherwise an error.
http.createServer(function (req, res) {
    var resBody = '';
    var resMsg = '';
    var urlObj = url.parse(req.url, true, false);
    var qstr = urlObj.query;
    console.log(urlObj);
    if (!qstr.msg) {
        resBody = resBody + '<html><head><title>Simple HTTP Server</title></head>';
        resMsg = '<h2>No msg parameter</h2>\n';
        resBody = resBody + '<body>' + resMsg;
        resMsg = resBody + '\n</body></html>';
        console.log(resMsg);
    } else {
        resMsg = loadArt(fs.readFileSync(messages[qstr.msg]));
    }
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(resMsg);
}).listen(3000, function(){
    console.log("Server is ready");
});

function loadArt(artFile)
{   
    var JSONarray = JSON.parse(artFile);
    var concatContent='';
    concatContent = concatContent.concat(fs.readFileSync("blogs/header.html").toString());
       
    for(var i = 0; i < JSONarray.Fragments.length; i++){
        var fragment=fs.readFileSync("blogs/" + JSONarray.Fragments[i]).toString();
        concatContent=concatContent.concat(fragment);
    }
    concatContent = concatContent.concat(fs.readFileSync("blogs/footer.html").toString());
    return concatContent;
        
}

