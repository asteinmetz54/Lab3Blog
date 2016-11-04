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
    var cookies = [];
    
    //when user submits login infomation console prints what was typed in
    if (req.method == "POST"){
        var reqData = '';
        req.on('data', function(chunk){
            reqData += chunk;
        });
        req.on('end', function(){
            var reqObj = q.parse(reqData);

            resBody = resBody + '<html><head><title>Index</title></head>\n';
        resMsg = '<h2>Blog Home Page</h2><br>';
        
            if(reqObj.username == reqObj.password){
                resMsg += '<h3>Welcome ' + reqObj.username + '!</h3>';
                res.writeHead(200,{
                   'Content-Type': "text/html",
                   'Set-Cookie': ['username=' + reqObj.username,'role=reviewer']
               });
               // res.setHeader('Set-Cookie', ['username='+reqObj.username,'role=reviewer']);
            }else{
               resMsg += '<h3>Welcome Visitor!</h3><br>';
               res.writeHead(200,{
                   'Content-Type': "text/html",
                   'Set-Cookie': ['username=','role=visitor']
               });
            }
            resMsg += loadTitles();
            resBody += '<body>' + resMsg;
            resMsg = resBody + '\n</body></html>';
            res.end(resMsg);
        });
    //landing page    
    }else if (!qstr.msg) {
        resBody = resBody + '<html><head><title>Index</title></head>\n';
        resMsg = '<h2>Blog Home Page</h2>\n';
        resMsg += '<a href="?msg=login">Login</a><br>';
        resMsg += loadTitles();

        resBody += '<body>' + resMsg;
        resMsg = resBody + '\n</body></html>';
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(resMsg);
    }else if(qstr.msg=='login'){ //load login page
        resMsg = fs.readFileSync("auth/login.html");
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(resMsg);
    }else { //load art files
        resMsg = loadArt(qstr.msg);
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(resMsg);
    }
   
}).listen(3000, function(){
    console.log("Server is ready");
});

function loadTitles(){
    var articles = fs.readdirSync("../Lab3Blog");
    var art = [];
    for (var i = 0; i < articles.length; i++){
        if (articles[i].includes(".art")){
            art.push(articles[i]);
        }
    };

    var concatContent = '';
   
    for (var i = 0; i < art.length; i++){
         var json = JSON.parse(fs.readFileSync(art[i]));
        concatContent = concatContent.concat('<a href="?msg='+ art[i] + '">' + json.Title +'</a><br>');
        
    }
    
    return concatContent;
}

function loadArt(artFile)
{   
    var JSONarray = JSON.parse(fs.readFileSync(artFile));
    var concatContent='';
    concatContent = concatContent.concat(fs.readFileSync("blogs/header.html").toString());
       
    for(var i = 0; i < JSONarray.Fragments.length; i++){
        var fragment=fs.readFileSync("blogs/" + JSONarray.Fragments[i]).toString();
        concatContent=concatContent.concat(fragment);
    }
    concatContent = concatContent.concat(fs.readFileSync("blogs/footer.html").toString());
    return concatContent;
        
}

