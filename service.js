//Wingman-Pi.
var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io')(server);
var exec=require('child_process').exec;
//var port=process.env.PORT || 80;
var port=process.env.PORT || 8483;
//var io=require('socket.io')(8483);

/* Express */
server.listen(port,function(){console.log('Wingman-Pi listening at port %d',port);});
app.use(express.static(__dirname+'/publics'));
/* Express End */

/* Socket.io */
var usernames={};
var numUsers=0;
io.on('connection',function(socket){
  /*
  socket.emit('news',{hello:'world'});
  socket.on('event',function(data){
    console.log(data);
  });
  */

// Chat.io
  var addedUser=false;
  socket.on('Message',function(data){
    socket.broadcast.emit('Message',{username:socket.username,message:data});
    //...
    //console.log(data);
    //var cmdText,cmdLog="";
    //cmdText=data.split("wger:"); //拆分命令行
    //console.log(cmdText);
    //var exec=require('child_process').exec,child; //执行命令
    //child=exec('wget '+cmdText,function(error,stdout,stderr){
    //  console.log(stdout);
    //  if(error!==null){console.log(error);}//console.log(stderr);
    //});
    /*var scmdLine=data.split("cmd:");
    if(scmdLine[1]){
      //console.log('Line:'+scmdLine[1]);
      var childOut='';
      child=exec(scmdLine,function(error,stdout,stderr){
        console.log(stdout);
        socket.broadcast.emit('typing',{
          username:'Dot',
          message:stdout
        });
        if(error!==null){console.log(error);}
      });
      
    }else{
      socket.broadcast.emit('new message',{
        username:socket.username,
        message:data
      });
    }*/
    //...
  });
  socket.on('add user',function(username){
    socket.username=username;
    console.log('login user: '+ username);
    usernames[username]=username;
    ++numUsers;
    addedUser=true;
    socket.emit('login',{numUsers:numUsers});
    console.log('login user: '+ username);
    socket.broadcast.emit('user joined',{
      username:socket.username,
      numUsers:numUsers
    });
    socket.broadcast.emit('Message',{
      username:'Auntie Dot',
      message:socket.username+' 已连线.'
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
      socket.broadcast.emit('Message',{
        username:'Auntie Dot',
        message:socket.username+' 已离连线.'
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

/* GPIO.io *//*
var gpio=require('pi-gpio');
gpio.open(16,'output',function(err){     // Open pin 16 for output
  gpio.write(16,1,function(){          // Set pin 16 high (1)
    gpio.close(16);                     // Close pin 16
  });
});
/* GPIO.io End */

