var fs = require('fs');

function loadArt(file)
{   
    var JSONarray = JSON.parse(file);
    var concatContent='';
    concatContent = concatContent.concat(fs.readFileSync("blogs/header.html").toString());
       
    for(var i = 0; i < JSONarray.Fragments.length; i++){
        var fragment=fs.readFileSync("blogs/" + JSONarray.Fragments[i]).toString();
        concatContent=concatContent.concat(fragment);
    }
    concatContent = concatContent.concat(fs.readFileSync("blogs/footer.html").toString());
    console.log(concatContent);
        
}

//var filesToPrint=["header.html","nutrition1.html","nutrition2.html","footer.html"];

loadArt(fs.readFileSync("nutrition.art"));
