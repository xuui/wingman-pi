var notify=function(title,body,error){
  if(window.webkitNotifications && navigator.userAgent.indexOf("Chrome")>-1){
    if(webkitNotifications.checkPermission()==0){
      var notification_test=webkitNotifications.createNotification(null,title,body);
      notification_test.onclick=function(){this.cancel();}
      notification_test.replaceId='id'+Math.random();
      notification_test.show();
    }else{
      webkitNotifications.requestPermission(function(){
        notify(title,{body:body,icon:'resources/icons/notify.png'});
      });
    }
  }else if(window.Notification){
    if(Notification.permission==='default'){
      Notification.requestPermission(function(){
        notify(title,{body:body,icon:'resources/icons/notify.png'});
      })
    }else if(Notification.permission==='granted'){
      var n=new Notification(title,{'body':body,'tag':'id'+Math.random(),icon:'resources/icons/notify.png'});
      n.onclick=function(){
        this.close();
      }
    }
  }else if(error){
    error();
  }
}
/*
if(window.Notification){
  // 支持
  if(Notification.permission==="granted"){
    var notification=new Notification('收到新邮件',{
      body:'您总共有3封未读邮件。',
  	  icon:'icons/finder.png'
    });
  }else if(Notification.permission !== 'denied'){
    Notification.requestPermission(function(permission){
      if(!('permission' in Notification)){Notification.permission=permission;}
      if(permission==="granted"){
        var notification=new Notification("Hi there!");
      }
    });
  }
}else{
  // 不支持
  //$.notification();
}
*/