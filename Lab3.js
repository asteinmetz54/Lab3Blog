var fs = require('fs');//Loads File System
var http = require('http');
var url = require('url');
var q = require('querystring');

///Creates a server listening on port 3000. Loads Landing page with login hyperlink
http.createServer(function (req, res) {
    var resBody = '';
    var resMsg = '';
    var urlObj = url.parse(req.url, true, false);
    var qstr = urlObj.query;
    
    //when user submits login infomation console prints what was typed in
    if (req.method == "POST"){
        var reqData = '';
        req.on('data', function(chunk){
            reqData += chunk;
        });
        req.on('end', function(){
            console.log(reqData);
            var loginInfo = q.parse(reqData);
            console.log(loginInfo);
            /*
            var pos = reqData.indexOf("&");
            var username = reqData.slice(9, pos);
            console.log("username is " + username);
            var pos2 = reqData.lastIndexOf("=");
            var password = reqData.slice((pos2+1));
            console.log("password is: " + password);
            */
        });
        
    }else if (!qstr.msg) {
        resBody = resBody + '<html><head><title>Index</title></head>\n';
        resMsg = '<h2>Blog Home Page</h2>\n';
        resMsg += '<a href="?msg=login">Login</a>';
        resBody += '<body>' + resMsg;
        resMsg = resBody + '\n</body></html>';
    }else if(qstr.msg='login'){
        resMsg = fs.readFileSync("auth/login.html");
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

