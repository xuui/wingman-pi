$(function(){
'use strict';
var username;
var connected=false;
var $inputName=$('#inputName');
var $inputMessage=$('#inputMsg');
var $messages=$('.messages');
var $Previewer=$('#imgPreview');
var FADE_TIME=150;
var COLORS=['#e53935','#d81b60','#8e24aa','#5e35b1','#3f51b5',
  '#1976d2','#0288d1','#00838f','#388e3c','#558b2f',
  '#ff6f00','#e65100','#f4511e','#546e7a'];

/* Socket.io */
//var socket=io();
var socket=io.connect('http://dot.xuui.net');
// Chat.io
socket.on('login',function(data){
  console.log(data);
  connected=true;
  var message="Welcome to Auntie.Dot! You are the first two [" + data.numUsers+"]";
  $('#chatlog div').html(message);
  log(message,{prepend:true});
  addParticipantsMessage(data);
});
socket.on('Message',function(data){
  console.log(data);
  addChatMessage(data);
});
socket.on('user joined',function(data){
  log(data.username+' joined');
  addParticipantsMessage(data);
});
socket.on('user left',function(data){
  log(data.username+' left');
  addParticipantsMessage(data);
});
// Chat.io End

// Previewer.io
socket.on('previewer',function(data){
  console.log('receive: '+data.file);
  $Previewer.html('<img class="xu-img" src="'+data.image+'" alt="'+data.file+'"/>');
});
// Previewer.io End

// Terminal.io
socket.emit('terminal',{shell:'uptime'});
socket.on('terminal',function(data){
  console.log(data.out);
  $Previewer.html('<pre>'+data.out+'</pre>');
  var notinfo=data.out.split(', ')
  send_notify('当前时间'+notinfo[0].replace(/days/g,"天。").replace(/up/g,"，已运行"));
});
// Terminal.io End
/* Socket.io End */

/* Function */
// Chat.function
$inputName.keydown(function(e){ //input Name
  if(e.which===13){setUsername();}
});
$inputMessage.keydown(function(e){// input Message
  if(e.which===13){sendMessage();}
});
function setUsername(){
  username=cleanInput($inputName.val().trim());
  if(username){socket.emit('add user',username);}
  console.log('$inputName='+username);
}
function sendMessage(){
  var message=cleanInput($inputMessage.val().trim());
  if (message && connected){
    $inputMessage.val('');
    addChatMessage({username:username,message:message});
    socket.emit('Message',message);
  }
}
function cleanInput(input){return $('<div/>').text(input).text();}
function addParticipantsMessage(data){
  var message='';
  if (data.numUsers===1){message+="there's 1 participant";}else{
    message+="there are "+data.numUsers+" participants";
  }
  log(message);
}
function log(message,options){
  var $el=$('<li>').addClass('log').text(message);
  addMessageElement($el,options);
}
function addMessageElement(el,options){
  var $el=$(el);
  if(!options){options={};}
    if(typeof options.fade==='undefined'){options.fade=true;}
    if(typeof options.prepend==='undefined'){options.prepend=false;
  }
  if(options.fade){$el.hide().fadeIn(FADE_TIME);}
  if(options.prepend){$messages.prepend($el);
  }else{$messages.append($el);}
  $messages[0].scrollTop=$messages[0].scrollHeight;
}
function addChatMessage(data,options){
  options=options||{};
  var $usernameDiv=$('<span class="username"/>').text('['+data.username+']: ').css('color',getUsernameColor(data.username));
  var $messageUrl=data.message.search("((http|ftp|https)://)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(/[a-zA-Z0-9\&%_\./-~-]*)?");
  if($messageUrl==0){
    var $messageBodyDiv=$('<span class="messageBody">').html('<a href="'+data.message+'" target="_blank">'+data.message+'</a>');
    //var $messageBodyDiv=$('<span class="messageBody">').html('<img src="'+data.message+'">');
    //((http|ftp|https))(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*([a-zA-Z0-9\&%_\./-~-]*)?
    
  }else{
    var $messageBodyDiv=$('<span class="messageBody">').text(data.message);
  }
  var $messageDiv=$('<li class="message"/>').data('username',data.username).append($usernameDiv,$messageBodyDiv);
  addMessageElement($messageDiv,options);
}
function getUsernameColor(username){
  var hash=7;
  for(var i=0;i<username.length;i++){
    hash=username.charCodeAt(i)+(hash << 5)-hash;
  }
  var index=Math.abs(hash % COLORS.length);
  return COLORS[index];
}
// Chat.function End

// Previewer.function
if(typeof(FileReader)==='undefined'){
  result.html('抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！');
  $('#upFiles').hide();
}else{
$('#upFiles').on('change',function(){
  var files=this.files;
  $Previewer.html('');
  for(var i=0,l=files.length;i<l;i++){
    console.log(files[i].name+': '+files[i].type+' '+files[i].size/1000+'KB');
    if(files[i].size/1024 >5120){
      $Previewer.html('文件不能大于 5M');
      return false;
    }
    if(!/image\/\w+/.test(files[i].type)){
      $Previewer.html('只提供图片文件的预览');
      return false;
    }
    var filename=files[i].name,reader=new FileReader();
    reader.addEventListener("load",function(){
      $Previewer.html('<img class="xu-img" src="'+reader.result+'" alt=""/>');
      socket.emit('previewer',{file:filename,image:this.result});
      console.log('sent: '+filename);
    },false);
    if(files[i]){reader.readAsDataURL(files[i]);}
  }
});
}
// Previewer.function End

function send_notify(body){
  new notify('Wingman Pi',body);
}
/* Function End*/
});
