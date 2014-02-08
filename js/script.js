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
		morsePlay(" "+$(this).attr('data-morse-play'),$(this).attr('data-morse-speed'));
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
			for (j=0;j<wordLength;j++) { // five letters per line
				charNo = Math.floor(Math.random() * characters.length);
				message += characters[charNo];
			}
			message += '\n';
		}
		morsePlay(message,$(this).attr('data-morse-speed'));
	}).removeAttr('disabled');

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
