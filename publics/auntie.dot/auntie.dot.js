$(function(){
  var FADE_TIME=150; // 毫秒
  var TYPING_TIMER_LENGTH=400; // 毫秒
  var COLORS=['#e21400','#91580f','#f8a700','#f78b00','#58dc00','#287b00','#a8f07a','#4ae8c4','#3b88eb','#3824aa','#a700ff','#d300e7'];

  // 初始化变量
  var $window=$(window);
  var $usernameInput=$('.usernameInput'); // 输入的用户名
  var $messages=$('.messages'); // 消息区域
  var $inputMessage=$('.inputMessage'); // 输入消息的输入框
  var $loginPage=$('.login.page'); // 登录页面
  var $chatPage=$('.chat.page'); // 聊天室页面

  // 提示设置用户名
  var username;
  var connected=false;
  var typing=false;
  var lastTypingTime;
  var $currentInput=$usernameInput.focus();
  var socket=io.connect('http://127.0.0.1:8483'); //请改为自己的 IP 和端口

  function addParticipantsMessage(data){
    var message='';
    if(data.numUsers===1){
      message+="当前只有 1 个人在线";
    }else{
      message+="当前有 "+data.numUsers+" 在线";
    }
    log(message);
  }

  // 设置客户端的用户名
  function setUsername(){
    username=cleanInput($usernameInput.val().trim());

    // 如果用户名是有效的
    if(username){
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput=$inputMessage.focus();

      // 告诉服务器用户名
      socket.emit('add user',username);
    }
  }

  // 发送聊天消息
  function sendMessage(){
    var message=$inputMessage.val();
    message=cleanInput(message);
    if(message && connected){
      $inputMessage.val('');
      addChatMessage({
        username:username,
        message:message
      });
      socket.emit('new message',message);
    }
  }

  // 记录一条消息
  function log(message,options){
    var $el=$('<li>').addClass('log').text(message);
    addMessageElement($el,options);
  }

  // 添加带视觉效果的聊天消息到消息列表
  function addChatMessage(data,options){
    options=options ||{};
    var $usernameDiv=$('<span class="username"/>').text(data.username).css('color',getUsernameColor(data.username));
    var $messageBodyDiv=$('<span class="messageBody">').text(data.message);
    var typingClass=data.typing ? 'typing':'';
    var $messageDiv=$('<li class="message"/>').data('username',data.username).addClass(typingClass).append($usernameDiv,$messageBodyDiv);
    addMessageElement($messageDiv,options);
	if(username!=data.username){
	  new notify(data.username,data.message);
	}
  }

  // 添加消息元素的信息和自动滚动到底部
  function addMessageElement(el,options){
    var $el=$(el);
    if(!options){
      options={};
    }
    if(typeof options.fade==='undefined'){
      options.fade=true;
    }
    if(typeof options.prepend==='undefined'){
      options.prepend=false;
    }
    if(options.fade){
      $el.hide().fadeIn(FADE_TIME);
    }
    if(options.prepend){
      $messages.prepend($el);
    }else{
      $messages.append($el);
    }
    $messages[0].scrollTop=$messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput(input){
    return $('<div/>').text(input).text();
  }

  // 获取用户名的颜色
  function getUsernameColor(username){
    // Compute hash code
    var hash=7;
    for(var i=0; i < username.length; i++){
       hash=username.charCodeAt(i)+(hash << 5) - hash;
    }
    // Calculate color
    var index=Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // 键盘事件
  $window.keydown(function(event){
    // 自动跟踪输入框按键的焦点
    if(!(event.ctrlKey || event.metaKey || event.altKey)){
      $currentInput.focus();
    }
    // 监控回车键
    if(event.which===13){
      if(username){
        sendMessage();
        socket.emit('stop typing');
        typing=false;
      }else{
        setUsername();
      }
    }
  });

  // 点击事件
  // 登陆页面焦点监控
  $loginPage.click(function(){
    $currentInput.focus();
  });

  // 消息输入边框的点击
  $inputMessage.click(function(){
    $inputMessage.focus();
  });

  // Socket 事件
  // 每当服务器发出“登录”，登录的登录信息
  socket.on('login',function(data){
    connected=true;
    var message="欢迎访问 Auntie Dot.";
    log(message,{prepend:true});
    addParticipantsMessage(data);
	new notify('Auntie Dot','欢迎!');
  });

  // 每当服务器发出“新信息”
  socket.on('new message',function(data){
    addChatMessage(data);
  });

  // 每当服务器发出“用户加入”
  socket.on('user joined',function(data){
    log(data.username+' 进入');
    addParticipantsMessage(data);
	new notify('Auntie Dot',data.username+' 进入');
  });

  // 每当服务器发出“用户离开”
  socket.on('user left',function(data){
    log(data.username+' 离开');
    addParticipantsMessage(data);
	new notify('Auntie Dot',data.username+' 离开');
  });
});

var notify=function(title,body,error){
  if(window.Notification){
    if(Notification.permission==='default'){
      Notification.requestPermission(function(){notify(title,body);});
    }else if(Notification.permission==='granted'){
      var n=new Notification(title,{'body':body,icon:'resources/icons/notify.png'});
      n.onclick=function(){this.close();}
    }
  }else if(error){
    error();
  }
}
/*2015.04.01.14.14*/