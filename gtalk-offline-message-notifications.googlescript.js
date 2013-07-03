function markNewMessagesAsUnread () {
    var allowed_gap_in_minutes = 5;

    var stored_last_ping_time = UserProperties.getProperty("stored_last_ping_time");
    
    if (stored_last_ping_time == null) return new Date();

    // The browser keeps on sending "i am online" pings to this script.
    // Absense of or a long duration between these pings is taken as
    // the indication of the user being offline.
    
    var current_time = new Date();
    stored_last_ping_time = new Date (stored_last_ping_time);
    
    var gap_in_minutes = (current_time.getTime () - stored_last_ping_time.getTime ()) / 60000;
    if (gap_in_minutes > allowed_gap_in_minutes) {
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
            if (chat_threads[i].getLastMessageDate().getTime() > stored_last_ping_time.getTime()) {
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
    
    // The request coming from browser, will be 
    // a "i am online" ping.
    if (Object.keys (request.parameters).length == 1) {
        if (request.parameters['iamonline'] != undefined) {
            var time = markNewMessagesAsUnread();
            UserProperties.setProperty ('stored_last_ping_time', time);
        }
    }
}
