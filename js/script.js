var morse = new morseSynth();

function morsePlay(message,speed) {
	$('[data-morse-playbutton]').attr('disabled','disabled');
	$('[data-morse-stop]').removeAttr('disabled');
	// Minimum speed without Farnsworth
	var minCharSpeed = 25; // WPS
	// Default speed
	var defaultSpeed = 15; // WPS
	if (!speed) speed = defaultSpeed;
	if (speed<minCharSpeed) {
		morse.speed(minCharSpeed);
		morse.farnsworth = 8.33*(minCharSpeed-speed)/speed;
	} else {
		morse.speed(speed);
		morse.farnsworth = 0;
	}
	morse.play(message);
};

$(function() {
	$('[data-morse-play]').click(function() {
		character = " "+$(this).attr('data-morse-play');
		morsePlay(character+character+character,$(this).attr('data-morse-speed'));
	}).removeAttr('disabled');

	$('[data-morse-random]').click(function() {
		var self = this;
		$(self).parent().next().html('');
		morse.characterCallbacks.push(function(character){
			$(self).parent().next().append(character);
		});

		var characters = $(this).attr('data-morse-random');
		var message = '> >\n';
		for (var i=0;i<7;i++) { // seven lines
			var wordLength = Math.floor(Math.random()*3)+3;
			for (j=0;j<wordLength;j++) { // 3-5 letters per line
				charNo = Math.floor(Math.random() * characters.length);
				message += characters[charNo];
			}
			message += '\n';
		}
		morsePlay(message,$(this).attr('data-morse-speed'));
	}).removeAttr('disabled');


	$('[data-morse-touch]').click(function() {
		var self = this;
		// wipe PRE elements
		$(self).parent().next().find('pre').html(' ');

		// Deselect button.
		$(this).blur();

		var doNewLine = false;
		// after each word add a new line to PRE element
		morse.characterCallbacks.push(function(character){
			if (doNewLine) {
				// add new line and scroll down a bit
				var pre = $(self).parent().next().find('pre').first();
				var oldHeight = pre.height();
				pre.append("\n ");
				$(window).scrollTop($(window).scrollTop()+pre.height()-oldHeight);
				doNewLine = false;
			}
			if (character == "\n") doNewLine = true;
		});

		var characters = $(this).attr('data-morse-touch');
		// pause at beginning
		var message = '        ';
		for (var i=0;i<7;i++) { // seven lines
			for (j=0;j<5;j++) { // five letters per line
				charNo = Math.floor(Math.random() * characters.length);
				message += characters[charNo];
			}
			// pause after each group
			message += '    \n';
		}
		// get rid of last \n
		message = message.slice(0,-1);

		// Buttons with keys
		$(self).parent().parent().find('[data-morse-touch-key]').click(function(){
			// Add character to PRE element
			$(this).parent().prev().prev().find('pre').first().append(
				$(this).attr('data-morse-touch-key')
			);
		}).removeAttr('disabled');

		// Keyboard input
		$(document).bind('input keyup',function(e) {
			var inputElement = $(self).parent().parent().find('input');
			var char = (typeof e.which == "number") ? e.which : e.keyCode;
			// convert key code (ASCII) to character
			// only when user does not use INPUT element
			if (char && (!inputElement.is(":focus"))) char = String.fromCharCode(char);
			// if not possible, try INPUT element
			// as soft keyboards on phones do not send correct character
			else if (inputElement.is(":focus")) char = inputElement.val().slice(-1);

			char = char.toUpperCase();
			var possibleCharacters = $(self).attr('data-morse-touch');
			if(possibleCharacters.indexOf(char) > -1) {
				$(self).parent().next().find('pre').first().append(char);
			}

			// fill with something strange
			inputElement.val('☺');
		});

		// Do this after playback stopped
		morse.messageCallbacks.push(function(){
			// deactivate events for keypress or buttons
			$(document).off('input');
			$(document).off('keyup');
			$(self).parent().parent().find('[data-morse-touch-key]')
				.off('click')
				.attr('disabled','disabled');

			// show correct message and reformat entered message
			var enteredMessageElement = $(self).parent().next().find('pre').first();
			var correctMessageElement = $(self).parent().next().find('pre').last();

			var enteredMessage = enteredMessageElement.html()
				.replace(/ /g,'').replace(/\n/g,'</span>\n<span>');
			var correctMessage = message.replace(/ /g,'')
				.replace(/\n/g,'</span>\n<span>');
			var enteredMessage = '<span>'+enteredMessage+'</span>';
			var correctMessage = '<span>'+correctMessage+'</span>';

			enteredMessageElement.html(enteredMessage);
			correctMessageElement.html(correctMessage);

			// compare entered and correct
			enteredMessageElement.children().each(function(i,elem){
				var enteredLine = enteredMessageElement.find(':nth-child('+(i+1)+')').html();
				var correctLine = correctMessageElement.find(':nth-child('+(i+1)+')').html();
				if (enteredLine == correctLine)
					enteredMessageElement.find(':nth-child('+(i+1)+')').addClass('bg-success');
				else
					enteredMessageElement.find(':nth-child('+(i+1)+')').addClass('bg-danger');
			});

			// remove this function
			morse.messageCallbacks.pop();
		});

		morsePlay(message,$(this).attr('data-morse-speed'));
	}).removeAttr('disabled');
	$('[data-morse-touch-key]').attr('disabled','disabled');
	$('[data-morse-touch]').parent().next().find('pre').first().click(function() {
		$(this).parent().parent().next().val("").focus();
	});



	$('[data-morse-stop]').click(function() {
		morse.stop();
	}).attr('disabled','disabled');

	$('[data-morse-visibleMessage]').click(function() {
		var self = this;
		$(self).parent().next().html('');
		morse.characterCallbacks.push(function(character){
			$(self).parent().next().append(character);
		});

		// take selected message
		var message = '> >\n'+$(this).prev().val();
		morsePlay(message,$(this).attr('data-morse-speed'));
	})
	// enable this button
	.removeAttr('disabled')
	// select first message
	.prev().children().first().prop('selected', true);

	$('[data-morse-invisibleMessage]').click(function() {
		// take selected message
		var message = '> >\n'+$(this).prev().val();
		morsePlay(message,$(this).attr('data-morse-speed'));
	})
	// enable this button
	.removeAttr('disabled')
	// select first message
	.prev().children().first().prop('selected', true);


	morse.messageCallbacks.push(function(){
		$('[data-morse-playbutton]').removeAttr('disabled');
		$('[data-morse-stop]').attr('disabled','disabled');

		// remove all callbacks
		morse.characterCallbacks = [];
	});

});

