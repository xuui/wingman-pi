$(function(){
'use strict';
var FADE_TIME=150,
    COLORS=['#e53935','#d81b60','#8e24aa','#5e35b1','#3f51b5','#1976d2','#0288d1','#00838f','#388e3c','#558b2f','#ff6f00','#e65100','#f4511e','#546e7a','#e21400','#91580f','#f8a700','#f78b00','#58dc00','#287b00','#a8f07a','#4ae8c4','#3b88eb','#3824aa','#a700ff','#d300e7'];
var username;
var connected=false;
var $inputName=$('#inputName'),
    $inputMessage=$('#inputMsg'),
    $submitMsg=$('#submitMsg'),
    $messages=$('#messages'),
    $uNum=$('#uNum'),
    $Previewer=$('#previewer');

/* Socket.io */
var socket=io();
//var socket=io.connect('http://dot.xuui.net');
// Chat.io
socket.on('login',function(data){
  console.log(data);
  connected=true;
  //var message="Welcome to Auntie.Dot! No.[" + data.numUsers+"]";
  var message="欢迎访问 Auntie Dot.";
  //$uNum.text('No.'+data.numUsers);
  //$('#chatlog div').html(message);
  log(message,{prepend:true});
  addParticipantsMessage(data);
	send_notify(data.username+', 欢迎您!');
});
socket.on('Message',function(data){
  console.log(data);
  addChatMessage(data);
});
socket.on('user joined',function(data){
  log(data.username+' 进入');
  addParticipantsMessage(data);
	send_notify(data.username+' 进入');
});
socket.on('user left',function(data){
  log(data.username+' 离开');
  addParticipantsMessage(data);
	send_notify(data.username+' 离开');
});
// Chat.io End

// Previewer.io
socket.on('previewer',function(data){
  console.log('receive: '+data.file+data.type);
  if(data.type=='audio'){
    $Previewer.html('<audio controls autoplay src="'+data.image+'" />');
  }else if(data.type=='video'){
    $Previewer.html('<video controls autoplay><source type="video/mp4" src="'+data.image+'"></video>');
  }else{
    $Previewer.html('<img class="xu-img" src="'+data.image+'" alt="'+data.file+'"/>');
  }
});
// Previewer.io End

// Terminal.io
socket.emit('terminal',{shell:'uptime'});
socket.on('terminal',function(data){
  console.log(data.out);
  $Previewer.html('<p>'+data.out+'</p>');
  var notinfo=data.out.split(', ')
  send_notify('当前时间'+notinfo[0].replace(/days/g,"天。").replace(/up/g,"，已运行"));
});
// Terminal.io End
/* Socket.io End */

/* Function */
// Chat.function
$inputName.keydown(function(e){ //input Name
  if(e.which===13){setUsername();
  $inputName.hide();}
});
$inputMessage.keydown(function(e){// input Message
  if(e.which===13){sendMessage();}
});
$submitMsg.click(function(){sendMessage();});
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
  if (data.numUsers===1){
    $uNum.text('No.1');
  }else{
    $uNum.text('No.'+data.numUsers);
  }
  log(message);
}
function log(message,options){
  var $el=$('<li class="log">').text(message);
  addMessageElement($el,options);
}
function addChatMessage(data,options){
  options=options||{};
  var myDate = new Date();
  var nowTime=myDate.getHours()+':'+myDate.getMinutes()+':'+myDate.getSeconds();
  if(data.username=='Auntie Dot'){
    //var $usernameDiv=$('<b>').text(data.username).css('color','#000');
    var $usernameDiv='<cite class="username"><b>'+data.username+'</b></cite><time>'+nowTime+'</time>';
  }else{
    //var $usernameDiv=$('<span class="username"/>').text('['+data.username+']: ').css('color',getUsernameColor(data.username));
    //var $usernameDiv='<cite class="username"><b style="color:'+getUsernameColor(data.username)+';">'+data.username+'</b></cite>';
    var $usernameDiv='<cite class="username"><b>'+data.username+'</b></cite><time>'+nowTime+'</time>';
  }
  var $messageUrl=data.message.search("((http|ftp|https)://)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(/[a-zA-Z0-9\&%_\./-~-]*)?");
  if($messageUrl==0){
    var $messageBodyDiv=$('<p class="msgbody">').html('<a href="'+data.message+'" target="_blank">'+data.message+'</a>');
    //var $messageBodyDiv=$('<span class="messageBody">').html('<img src="'+data.message+'">');
    //((http|ftp|https))(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*([a-zA-Z0-9\&%_\./-~-]*)?
    
  }else{
    var $messageBodyDiv=$('<p class="msgbody">').text(data.message);
  }
  var $messageDiv=$('<li class="message"/>').data('username',data.username).append($usernameDiv,$messageBodyDiv);
  addMessageElement($messageDiv,options);
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
  $('#msgArea').animate({scrollTop:$($messages).height()},300);
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
    if(!/image|audio|video\/\w+/.test(files[i].type)){
      $Previewer.html('不支持的文件类型!');
      return false;
    }
    var filename=files[i].name,reader=new FileReader();
    if(/audio\/\w+/.test(files[i].type)){
      reader.addEventListener("load",function(e){
        $Previewer.html('<audio controls autoplay src="'+this.result+'" />');
        socket.emit('previewer',{file:filename,type:'audio',image:this.result});
        console.log('sent: '+filename);
      },false);
    }else if(/video\/\w+/.test(files[i].type)){
      reader.addEventListener("load",function(e){
        $Previewer.html('<video controls autoplay><source type="video/mp4" src="'+this.result+'"></video>');
        socket.emit('previewer',{file:filename,type:'video',image:this.result});
        console.log('sent: '+filename);
      },false);
    }else{
      reader.addEventListener("load",function(e){
        $Previewer.html('<img class="xu-img" src="'+this.result+'" alt=""/>');
        socket.emit('previewer',{file:filename,type:'image',image:this.result});
        console.log('sent: '+filename);
      },false);
    }
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
