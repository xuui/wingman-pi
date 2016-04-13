//Wingman-Pi.
var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io')(server);
//var port=process.env.PORT || 8483;
var port=process.env.PORT || 80;

//var io=require('socket.io')(8088);
var exec=require('child_process').exec;

server.listen(port,function(){
  console.log('Wingman-Pi listening at port %d',port);
});
app.use(express.static(__dirname+'/publics'));

io.on('connection',function(socket){
  socket.on('image',function(data){
    socket.broadcast.emit('image',{file:data.file,image:data.image});
  });
  socket.on('Terminal',function(data){
    console.log(data);
    child=exec(data.shell,{encoding:'utf8'},(error,stdout,stderr)=>{
      console.log('stdout: ${stdout}');
      socket.emit('Terminal',{out:stdout});
      console.log('stderr: ${stderr}');
      if(error!==null){console.log(`exec error: ${error}`);}
    });
  });
  socket.emit('news',{hello:'world'});
  socket.on('event',function(data){
    console.log(data);
  });
});
