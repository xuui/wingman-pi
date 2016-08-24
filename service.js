//Wingman-Pi.
var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io')(server);
var exec=require('child_process').exec;
var port=process.env.PORT || 80;
//var port=process.env.PORT || 8483;
//var io=require('socket.io')(8483);

/* Express */
server.listen(port,function(){console.log('Wingman-Pi listening at port %d',port);});
app.use(express.static(__dirname+'/publics'));
/* Express End */

/* Socket.io */
io.on('connection',function(socket){
  /*
  socket.emit('news',{hello:'world'});
  socket.on('event',function(data){
    console.log(data);
  });
  */

// Chat.io
  var usernames={};
  var numUsers=0;
  var addedUser=false;
  socket.on('Message',function(data){
    socket.broadcast.emit('Message',{username:socket.username,message:data});
  });
  socket.on('add user',function(username){
    console.log('login user: '+ username);
    socket.username=username;
    usernames[username]=username;
    ++numUsers;
    addedUser=true;
    socket.emit('login',{numUsers:numUsers});
    console.log('login user: '+ username);
    socket.broadcast.emit('user joined',{
      username:socket.username,
      numUsers:numUsers
    });
  });
  socket.on('disconnect',function(){
    if(addedUser){
      delete usernames[socket.username];
      --numUsers;
      socket.broadcast.emit('user left',{
        username:socket.username,
        numUsers:numUsers
      });
    }
  });
// Chat.io End

// Previewer.io
  socket.on('previewer',function(data){
    socket.broadcast.emit('previewer',{file:data.file,type:data.type,image:data.image});
    console.log('broadcast: '+data.file);
  });
// Previewer.io End

// Terminal.io
  socket.on('terminal',function(data){
    console.log(data);
    child=exec(data.shell,{encoding:'utf8'},function(error,stdout,stderr){
      console.log('stdout: ${stdout}');
      socket.emit('terminal',{out:stdout});
      console.log('stderr: ${stderr}');
      if(error!==null){console.log('exec error: ${error}');}
    });
  });
// Terminal.io End
});
/* Socket.io End */
