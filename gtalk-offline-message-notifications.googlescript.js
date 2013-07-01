function markNewMessagesAsUnread () {
  var stored_login_time = UserProperties.getProperty("stored_login_time");
  var stored_logout_time = UserProperties.getProperty("stored_logout_time");
  
  if ((stored_login_time == null) || (stored_logout_time == null)) return new Date();
  
  // The browser makes two kinds of pings.
  //
  // Login ping  : Everytime a gmail tab is opened in the browser.
  //               At the end of each login ping, the "stored_login_time"
  //               is updated to the time when the ping was received.
  //
  //               In addition to the above, we need to figure out
  //               whether this login is the first one after last logout
  //               in case it is, we need to mark all the chats sent during
  //               the logout time and current instant as unread.
  //
  //               So, an update needs to be done only when the last login
  //               was done before last logout.
  //
  // Logout ping : Everytime the logout button is clicked.
  //               At the end of each logout ping, the "stored_logout_time"
  //               is updated to the time when the ping was received.
  
  var current_time = new Date();
  stored_login_time = new Date (stored_login_time);
  stored_logout_time = new Date (stored_logout_time);
  
  if (stored_logout_time.getTime() > stored_login_time.getTime()) {
      // Now, retrieve chat thereads,
      // for each thread, check whether the latest
      // message in that thread was send after last
      // logout, and accordingly mark it unread.
      
      var label = GmailApp.getUserLabelByName("Offline Chats");
      if (label == null) {
        label = GmailApp.createLabel("Offline Chats");
      }
      
      var chat_threads = GmailApp.getChatThreads();
      
      for (var i = 0; i < chat_threads.length; i++) {
        if (chat_threads[i].getLastMessageDate().getTime() > stored_logout_time.getTime()) {
          chat_threads[i].markUnread().addLabel(label);
        }
        else {
          // As threads are ordered chronologically
          // with respect to the last messages in them,
          // once a thread's latest message time goes before
          // logout time, all subsquent threads will follow.
          break;
        }
      }        
    }
  
  return current_time;
}

function doGet (request) {
  
  // The request coming from browser, will be either
  // a "login ping" or a "logout ping"
  // it can not be both, neither it can be none.
  
  if (Object.keys (request.parameters).length == 1) {
    if (request.parameters['login'] != undefined) {
      var time = markNewMessagesAsUnread();
      UserProperties.setProperty ('stored_login_time', time);
    }
    if (request.parameters['logout'] != undefined) {
      UserProperties.setProperty ('stored_logout_time', new Date());
    }
  }
}
