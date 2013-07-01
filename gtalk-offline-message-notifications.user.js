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
             iframe.setAttribute ('src', url);
             document.body.appendChild (iframe);
         }

         function logoutPing () {
             pingUrl (window.ping_url + "?logout");
         }

         function loginPing () {
             pingUrl (window.ping_url + "?login");
         }
         
         function prependOnclickCode (element, code_string) {
             if (element === undefined) {
                 return;
             }
             if (element.attributes["onclick"] === undefined) {
                 element.setAttribute ("onclick", code_string);
             }
             else {
                 element.setAttribute ("onclick", code_string + element.attributes["onclick"].value);
             }
         }

         function checkChange (classes) {
             var button = window.chat_status_change_button;
             var new_classes = button.firstChild.getAttribute('class');
             var class_to_status_map = {
                 "Tr dk dh" : "online", // green
                 "Tr dk dj" : "online", // red
                 "Tr df"    : "offline" // invi, offline
             };
             var old_state = class_to_status_map [classes];
             var new_state = class_to_status_map [new_classes];
             if (old_state != new_state) {
                 if (new_state == "online") {
                     // Login code here.
                     loginPing();
                 }
                 else {
                     // Logout code here.
                     logoutPing();
                 }
             }
             window.setTimeout (checkChange, 1000, new_classes);
         }

         function getGmailSignOut () {
             var link_buttons = jQ("a[role='button']");
             for (var i = 0; i < link_buttons.length; i++) {
                 if (link_buttons[i].innerHTML.trim() == "Sign out") {
                     window.gmail_sign_out_button = link_buttons[i];
                     break;
                 }
             }
             if (window.gmail_sign_out_button === undefined) {
                 window.setTimeout (getGmailSignOut, 10000);
             }
             else {
                 prependOnclickCode (window.gmail_sign_out_button, "logoutPing();");
             }
         }
         
         function getChatStatuses () {
             var buttons = jQ('div[title="Options"]');
             if (buttons.length == 1) {
                 window.chat_status_change_button = buttons[0];
             }
             if (window.chat_status_change_button === undefined) {
                 window.setTimeout (getChatStatuses, 10000);
             }
             else {
                 checkChange (window.chat_status_change_button.firstChild.getAttribute("class"));
             }
         }
         
         getGmailSignOut ();
         getChatStatuses ();
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
    addJQuery(main);
}
