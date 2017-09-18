//Wingman-Pi.
var port=process.env.PORT || 9801;
var io=require('socket.io')(port);
var exec=require('child_process').exec;

/* Express */
console.log('Wingman-Pi listening at port: %d',port);
/* Express End */

/* Socket.io */
var usernames={};
var numUsers=0;
var commandLine='';
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
    //...
    //console.log(data.match('\:'));
    var cmdLine=data.match('^:');//拆分命令行 :cmd
    if(cmdLine==null){
      socket.broadcast.emit('Message',{username:socket.username,message:data});
    }else{
      commandLine=data.slice(1);
      console.log('CommandLine:['+commandLine+']');
      socket.emit('terminal',{out:askData(commandLine)});
      /*
      child=exec(commandLine,function(error,stdout,stderr){
        console.log(stdout);
        socket.emit('terminal',{out:stdout});
        if(error!==null){console.log(error);}
      });
      */
    }
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
      //message:socket.username+' 已连线.'
      message:askData('welcome')
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

var fs=require('fs');
var ask=JSON.parse(fs.readFileSync('ask.json','utf8'));
//console.log('ask num:'+ ask.dot.length);
//console.log('ask data:');
//console.log(ask.dot);

function askData(Q){
  var askReply;
  for(var i=0;i<ask.dot.length;i++){
    //console.log('for-'+i);
    if(ask.dot[i].ask==Q){
      askReply=ask.dot[i].reply;
      break;
    }
  }
  if(typeof(askReply)=='object'){
    var ni=Math.round(Math.random()*(askReply.length-1));
    console.log('ni:'+ni);
    console.log(askReply[ni]);
    return askReply[ni];
  }else{
    return askReply;
  }
}
