var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io')(server);
var port=process.env.PORT || 8483;
server.listen(port,function(){
  console.log('Wingman-Pi Preview listening at port %d',port);
});
// Routing
app.use(express.static(__dirname+'/publics'));
/*io.on('connection',function(socket){
  socket.on('new message',function(data){});
  socket.emit('news',{hello:'world'});
  socket.on('my event',function(data){
    console.log(data);
  });
});*/
io.on('connection',function(socket){
  socket.on('preview',function(data){
    socket.broadcast.emit(preview',{file:data.file,image:data.image});
    //console.log(data);
  });
});