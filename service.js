//Wingman-Pi.
var io=require('socket.io')(8088);
exec=require('child_process').exec;
io.on('connection',function(socket){
  socket.on('shell',function(data){
    console.log(data);
    child=exec(data.shell,(error,stdout,stderr)=>{
      console.log('stdout: ${stdout}');
      socket.emit('shell',{out:stdout});
      console.log('stderr: ${stderr}');
      if(error!==null){console.log(`exec error: ${error}`);}
    });
  });
  socket.emit('news',{hello:'world'});
  socket.on('event',function(data){
    console.log(data);
  });
});
