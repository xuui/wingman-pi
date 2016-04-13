//var socket=io.connect('http://10.0.117.33:8088');
var socket=io();

socket.on('connect',function(){
  socket.on('shell',function(data){
    console.log(data.out);
    imgPreview.innerHTML='<pre>'+data.out+'</pre>';
  });
  socket.on('news',function(data){
    console.log(data);
    socket.emit('event',{my:'data'});
    socket.emit('shell',{shell:'dir /w'});
  });
});
