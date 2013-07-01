Getting back offline Gtalk message notifications
================================================

Quick install
-------------
Just follow the instructions on my [blog][1]

Manual install
--------------

Download both the user.js and googlescript.js files from this repository.

#### Setting up the pinging server

1. Go to [google scripts site][2].
1. Click on "Blank Project".
1. Copy and paste the code from the googlescript.js file into the browser.
1. Go to "File" -> "Manage versions..."
1. Enter a project name. (say, "Gtalk offline message notifications")
1. In the "Describe what has changed..." text box, enter the description. (say, "alpha version, directly copied from Sujeet's repository")
1. Click "Save New Version". Then click "OK" at the bottom.
1. Go to "Publish" -> "Deploy as web app...".
1. Project version : 1
1. Execute the app as: "User accessing the web app"
1. Who has access to the app "Only myself" or "Anyone" anything should work as you are only one who is going to use it anyway.
1. Click "Deploy", then copy and store the "Current web app URL" somewhere. We will need it in the next part.

#### Customizing and installing the userscript.

In the user.js file, look at around line number 15, where it says "window.ping_url". Replace than URL with the one we got from setting up the ping server above.

##### Firefox users
Install [greasemonkey][3], then drag and drop the user.js file into firefox. A greasemonkey installation window will pop up, click "install", you are done!

##### Chrome users
Open the [extensions page][4], then drag and drop the user.js file. Approve the installation and you are done!

[1]:http://blog.sujeet.me/2013/07/get-back-gtalk-offline-message-notifications.html
[2]:https://script.google.com
[3]:https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/
[4]:chrome://extensions/
