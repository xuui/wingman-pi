//var socket=io();//socket.init
var socket=io.connect('http://127.0.0.1:8483');
//var socket=io.connect('http://10.0.117.33');

window.onload=function(){
  var selFile=document.querySelector('#selFile');
  var upFiles=document.querySelector('#upFiles');
  var imgPreview=document.querySelector('#imgPreview');
  var fullScreen=document.querySelector('#fullScreen');
  
  selFile.addEventListener('click',function(){
    return upFiles.click();
  },false);
  fullScreen.addEventListener('click',function(){
    //this.className='i';
    if(this.className=='o'){
      this.className='i';
      requestFullScreen();
    }else{
      this.className='o';
      exitFullscreen()
    }
  },false);
  
  if(typeof(FileReader)==='undefined'){
    result.innerHTML='抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！';
    upFiles.setAttribute('disabled','disabled');
  }else{
    upFiles.addEventListener('change',readFile,false);
  }
}
//进入全屏
function requestFullScreen(){
  var de=document.documentElement;
  if(de.requestFullscreen){
    de.requestFullscreen();
  }else if(de.mozRequestFullScreen){
    de.mozRequestFullScreen();
  }else if(de.webkitRequestFullScreen){
    de.webkitRequestFullScreen();
  }
}
//退出全屏
function exitFullscreen(){
  var de=document;
  if (de.exitFullscreen){
    de.exitFullscreen();
  }else if(de.mozCancelFullScreen){
    de.mozCancelFullScreen();
  }else if(de.webkitCancelFullScreen){
    de.webkitCancelFullScreen();
  }
}

function readFile(){
  //var file=this.files[0];
  var files=this.files;
  imgPreview.innerHTML='';
  for(var i=0,l=files.length;i<l;i++){
    //console.log(files[i]);
    /*if(!/image\/\w+/.test(files[i].type)){
      imgPreview.innerHTML='只提供图片文件的预览';
      return false;
    }*/
    var filename=this.files[i].name;
    console.log(filename);
    var reader=new FileReader();
    reader.readAsDataURL(files[i]);
    if(/audio\/\w+/.test(files[i].type)){
      reader.onload=function(e){
        imgPreview.innerHTML+='<audio controls autoplay src="'+this.result+'" />';
        socket.emit('previewer',{file:filename,type:'audio',image:this.result});
        console.log('sent: '+filename);
      }
    }else if(/video\/\w+/.test(files[i].type)){
      reader.onload=function(e){
        imgPreview.innerHTML+='<video controls autoplay><source type="video/mp4" src="'+this.result+'"></video>';
        socket.emit('previewer',{file:filename,type:'video',image:this.result});
        console.log('sent: '+filename);
      }
    }else{
      reader.onload=function(e){
        imgPreview.innerHTML+='<img class="xu-img" src="'+this.result+'" alt=""/>';
        socket.emit('previewer',{file:filename,type:'image',image:this.result});
        console.log('sent: '+filename);
      }
    }

  }
}
socket.on('previewer',function(data){
  console.log('receive: '+data.file);
  imgPreview.innerHTML='<img class="xu-img" src="'+data.image+'" alt="'+data.file+'"/>';
});