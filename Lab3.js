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
    var cookies;
    /*
    //check if specific url input
    if (urlObj.pathname != '/'){
        resMsg = fs.readFileSync(urlObj.pathname).toString();
        res.writeHead(200,{
            'Content-Type': "text/html",
            'Set-Cookie': ['username=','role=']
        });
        res.end(resMsg);
    }*/
    //when user submits login infomation console prints what was typed in
    if (req.method == "POST"){
        var reqData = '';
        req.on('data', function(chunk){
            reqData += chunk;
        });
        req.on('end', function(){
            var reqObj = q.parse(reqData);

            resBody = resBody + '<html><head><title>Index</title></head>\n';
            resMsg = '<center><h2>Health Nut Food Blog</h2>';
            
            //check if user logged in as reviewer 
            if(reqObj.username == reqObj.password){
                resMsg += '<h3>Welcome ' + reqObj.username + '!</h3>';
                resMsg += '<a href="?msg=logout">Logout</a><br><br>';
                resMsg += loadTitles("reviewer");
                res.writeHead(200,{
                   'Content-Type': "text/html",
                   'Set-Cookie': ['username=' + reqObj.username,'role=reviewer']
               });
            }else{//false info will login as visitor
               resMsg += '<h3>Welcome Visitor!</h3><br>';
               resMsg += '<a href="?msg=login">Login</a><br><br>';
               resMsg += loadTitles("visitor");
               res.writeHead(200,{
                   'Content-Type': "text/html",
                   'Set-Cookie': ['username=','role=visitor']
               });
            }
            resBody += '<body>' + resMsg;
            resMsg = resBody + '\n</body></html>';
            res.end(resMsg);
        });
    //landing page    
    }else if (!qstr.msg) {
        console.log("landing page - " +urlObj.pathname);
        cookies = q.parse(req.headers.cookie,'; ','=');
        resBody = resBody + '<html><head><title>Index</title></head>\n';
        resMsg = '<center><h2>Health Nut Food Blog</h2>\n';
        if (cookies.role != 'reviewer'){
            resMsg += '<h3>Welcome Visitor!</h3>';
            resMsg += '<a href="?msg=login">Login</a><br><br>';
        }else{
            resMsg += '<h3>Welcome ' + cookies.username + '!</h3>';
            resMsg += '<a href="?msg=logout">Logout</a><br><br>';
        }
        
        resMsg += loadTitles(cookies.role);

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
    }else if(qstr.msg=='logout'){   //logout page
        resBody = resBody + '<html><head><title>Index</title></head>\n';
        resMsg += '<center><h2>Health Nut Food Blog</h2>';
        resMsg += '<h4>Successfully Logged out</h4>';
        resMsg += '<a href="?msg=login">Login</a><br><br>';
        resMsg += loadTitles('visitor');
        resBody += '<body>' + resMsg;
        resMsg = resBody + '\n</body></html>';
        
        res.writeHead(200,{
            'Content-Type': "text/html",
            'Set-Cookie': ['username=','role=']
        });
        res.end(resMsg);
    }else { //load art files
        console.log("load art file - " +urlObj.pathname);
        cookies = q.parse(req.headers.cookie,'; ','=');
        resMsg = loadArt(qstr.msg, cookies.username, cookies.role);
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(resMsg);
    }
   
}).listen(3000, function(){
    console.log("Server is ready");
});

function loadTitles(role){
    var articles = fs.readdirSync("../arsteinm_psharif_421Lab3");
    var art = [];
    for (var i = 0; i < articles.length; i++){
        if (articles[i].includes(".art")){
            art.push(articles[i]);
        }
    };

    var concatContent = '';
   
    for (var i = 0; i < art.length; i++){
         var json = JSON.parse(fs.readFileSync(art[i]));
         if (json.Public == "yes" ){
            concatContent = concatContent.concat('<a href="?msg='+ art[i] + '">' + json.Title +'</a><br>');
         }else if (json.Public == "no" && (role== "reviewer")){
             concatContent = concatContent.concat('<a href="?msg='+ art[i] + '">' + json.Title +'</a><br>');
         } else {
             concatContent = concatContent.concat(json.Title + '<br>');
         }
        
        
    }
    
    return concatContent;
}

function loadArt(artFile, username, role)
{   
    var JSONarray = JSON.parse(fs.readFileSync(artFile));
    var concatContent='';
    concatContent = concatContent.concat(fs.readFileSync("blogs/header.html").toString());
    if (role != 'reviewer'){
        concatContent += '<a href="?msg=login">Login</a>';
        concatContent += '<h4>Welcome Visitor!</h4>';
    }else{
            concatContent += '<a href="?msg=logout">Logout</a>';
            concatContent += '<h4>Welcome ' + username + '!</h4>'
        }
       
    for(var i = 0; i < JSONarray.Fragments.length; i++){
        var fragment=fs.readFileSync("blogs/" + JSONarray.Fragments[i]).toString();
        concatContent=concatContent.concat(fragment);
    }
    concatContent = concatContent.concat(fs.readFileSync("blogs/footer.html").toString());
    return concatContent;
        
}

