var fs = require('fs');//Loads File System
var http = require('http');
var url = require('url');
var q = require('querystring');

///Creates a server listening on port 3000. If the user types http://localhost:3000/?msg=0 
/// or msg=1, or msg=2 it will display the files. If msg=  nothing then it will display No msg parameter. 
/// Otherwise an error.
http.createServer(function (req, res) {
    var resBody = '';
    var resMsg = '';
    var urlObj = url.parse(req.url, true, false);
    var qstr = urlObj.query;
    if (!qstr.msg) {
        resBody = resBody + '<html><head><title>Index</title></head>\n';
        resMsg = '<h2>Blog Home Page</h2>\n';
        resMsg += '<a href="?msg=login">Login</a>';
        resBody += '<body>' + resMsg;
        resMsg = resBody + '\n</body></html>';
        console.log(resMsg);
    } else if(qstr.msg='login'){
        resMsg = fs.readFileSync("blogs/login.html");
    }else {
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

