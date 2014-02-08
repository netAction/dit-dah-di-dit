src directory
=============

This directory contains the sources that build the HTML files.

Just delete the directories *de*, *en* and start

    nodejs make.js

The lessons should contain a lot of background information and some links to good information pages.


Exercise types
--------------


Let the user listen to new characters.

    {newCharacters:[{characters:[{character:'C'},{character:'Q'}]}]}

Play words of 3-5 random characters and write them to a box. The user will be asked to write it down to paper. To put more intense on new characters, write them multiple times into the list of characters. TODO: Change frequency after each row.

    {randomGroups:[{characters:"KRMSUAPTLOWI.NJEFY0,VG5/Q9ZH38B?427C1D1D1D"}]}

Add some text to the lesson. This could be an explanation or a link to more information, a video with a morse QSO or anything else.

    {plainHtml:'<h2>Stuff</h2><p>Simply some HTML</p>'}

Output some text messages, e.g. QSOs, rhymes or text with many numbers. You should offer 2-5 messages. It would be nice to explain the QSOs in a *plainHtml* element below. TODO: The OMs in the QSOs could have different frequencies.

    {visibleMessages:[{messages:[
      {description:'message 1', message:'CQ CQ CQ DE DD1TS'},
      {description:'message 2', message:'HAM RADIO 4EVER'},
    ]}]}

The same without printing on the screen to keep the message interesting, e.g. for jokes. You could divide a longer story in 2-5 chapters and put it into an *invisibleMessages* exercise, too.

    {invisibleMessages:[{messages:[
      {description:'message 1', message:'CQ CQ CQ DE DD1TS'},
      {description:'message 2', message:'HAM RADIO 4EVER'},
    ]}]}


All exercises accept a speed parameter for a speed in WPS.

    {randomGroups:[{characters:"KRMS",speed:25}]}

### TODO ###

* Word lists: Call signs, clear text words
* Let the browser read the words after morse playback. You can learn with eyes shut.
* PileUp simulation



Sources for plain text messages
-------------------------------

* Word lists from http://www.wortschatz.uni-leipzig.de/html/wliste.html or /usr/share/dict
* Jokes in CW
* LCWO plain text messages


Cache
-----

TODO: Make whole page available in offline cache.

