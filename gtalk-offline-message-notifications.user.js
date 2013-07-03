// ==UserScript==
// @name         Login-logout pinger for Gtalk Offline Message Notifications.
// @author       Sujeet Gholap
// @description  Pings the google app script taking care of Gtalk Offline
//               Message Notifications on every login and logout.
// @match http://mail.google.com/mail/u/0/*
// @match https://mail.google.com/mail/u/0/*
// ==/UserScript==


function main () {
    (function() {

         // Here goes the URL of the Google script app.
         window.ping_url = "https://script.google.com/macros/s/AKfycbxCbn_MquAU22Hn6EGKOctJzB3rZn-AvIAVgqkqrlB5Uu4w6pgh/exec";

         function pingUrl (url) {
             var iframe = document.createElement ('iframe');
             var old_iframe = document.getElementById ('gtalk_status_ping_iframe');
             iframe.setAttribute ('src', url);
             iframe.setAttribute ('id', 'gtalk_status_ping_iframe');
             if (old_iframe != null) {
                 document.body.replaceChild (iframe, old_iframe);
             }
             else {
                 document.body.appendChild (iframe);
             }
         }

         function ping () {
             pingUrl (window.ping_url + "?iamonline");
         }

         // works on fact that an alert is shown
         // saying "you are invisible. go visible."
         // when one is invisible.
         function isInvisible () {
             var alert_divs = jQ ('div[role="alert"]');
             for (var i = 0; i < alert_divs.length; i++) {
                 if (alert_divs[i].innerText.search("You are invisible") + 1) {
                     return true;
                 }
             }
             return false;
         }

         // Keeps periodically changing the status
         // (offline/busy/available) and sends a "iamonline"
         // ping every time it detects busy, available or invisible.
         function check_status () {
             var button = window.chat_status_change_button;
             var classes = button.firstChild.getAttribute('class');
             var class_to_status_map = {
                 "Tr dk dh" : "online", // green
                 "Tr dk dj" : "online", // red
                 "Tr df"    : "offline" // invi, offline
             };
             var state = class_to_status_map [classes];
             if ((state == "online") ||
                 ((state == "offline") && isInvisible ())){
                 ping ();
             }
             window.setTimeout (arguments.callee, 
                                window.gtalk_status_ping_duration_seconds * 1000);
         }
         
         // Locate the html element on page which indicates the
         // status (idle/busy/available/offline) and store it in
         // a variable.
         // WHY: The extension loads as soon as the page loads
         //      and by that time, (as gmail loads stuff dynamically)
         //      the html element might not even exists. In that case,
         //      we just call this function again, until it finds the element.
         // Also, once found, stat monitoring it for change.        
         function find_save_and_monitor_status_indicator () {
             var buttons = jQ('div[title="Options"]');
             if (buttons.length == 1) {
                 window.chat_status_change_button = buttons[0];
             }
             if (window.chat_status_change_button === undefined) {
                 window.setTimeout (arguments.callee, 10000);
             }
             else {
                 check_status (window.chat_status_change_button.firstChild.getAttribute("class"));
             }
         }
         
         find_save_and_monitor_status_indicator ();
     })();
}



function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js");
    script.addEventListener('load', function() {
                                var script = document.createElement("script");
                                script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
                                document.body.appendChild(script);
                            }, false);
    document.body.appendChild(script);
}

// We want this script to only run on urls
// of the type
// http(s)://mail.google.com/mail/u/0/?<params-n-values>#<whatever>
// But, we can not provide this kind of patter in
// the @match directive of the userscript :(
if (window.document.URL.search ("#") + 1) {
    window.gtalk_status_ping_duration_seconds = 60;
    addJQuery(main);
}
