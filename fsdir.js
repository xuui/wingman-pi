var fs=require('fs'),  
    fileList=[];

function getdirectory(path){  
  var dirList=fs.readdirSync(path);
  dirList.forEach(function(item){
    if(fs.statSync(path+'/'+item).isFile()){
      fileList.push(path+'/'+item);
    }
  });
  dirList.forEach(function(item){
    if(fs.statSync(path+'/'+item).isDirectory()){
      getdirectory(path+'/'+item);
    }
  });
}

getdirectory('publics');
console.log(fileList);

<!-- google: -->  
<input maxlength="2048" name="q" autocomplete="off" title="Search" type="text" value="" aria-label="Search" aria-haspopup="false" role="combobox" aria-autocomplete="both" dir="ltr" spellcheck="false">

<!-- bing: -->  
<input name="q" title="Enter your search term" type="search" value="" maxlength="100" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" role="combobox" aria-autocomplete="both" aria-expanded="false" aria-owns="sa_ul">
