/* Socket.io */
//var socket=io.connect('http://10.0.117.33:8088');
var socket=io();
socket.on('connect',function(){
  socket.on('image',function(data){
    imgPreview.innerHTML='<img src="'+data.image+'" alt="'+data.file+'"/>';
  });
  socket.on('Terminal',function(data){
    console.log(data.out);
    imgPreview.innerHTML='<pre>'+data.out+'</pre>';
  });
  socket.on('news',function(data){
    console.log(data);
    socket.emit('event',{my:'data'});
    socket.emit('Terminal',{shell:'uptime'});
  });
});
/* Socket.io End */

window.onload=function(){
  var upFiles=document.querySelector('#upFiles');
  var imgPreview=document.querySelector('#imgPreview');
  if(typeof(FileReader)==='undefined'){
    result.innerHTML='抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！';
    upFiles.setAttribute('disabled','disabled');
  }else{
    upFiles.addEventListener('change',readFile,false);
  }
}
function readFile(){
  //var file=this.files[0];
  var files=this.files;
  imgPreview.innerHTML='';
  for(var i=0,l=files.length;i<l;i++){
    //console.log(files[i]);
    if(!/image\/\w+/.test(files[i].type)){
      imgPreview.innerHTML='只提供图片文件的预览';
      return false;
    }
    var filename=this.files[i].name;
    console.log(filename);
    var reader=new FileReader();
    reader.readAsDataURL(files[i]);
    reader.onload=function(e){
      imgPreview.innerHTML+='<img src="'+this.result+'" alt=""/>';
      //socket.emit('new image',this.result); //发送给socket;
      socket.emit('image',{file:filename,image:this.result});
    }
  }
}