var morse = new morseSynth();

function morsePlay(message) {
	$('[data-morse-play],[data-morse-random]').attr('disabled','disabled');
	$('[data-morse-stop]').removeAttr('disabled');
	morse.play(message);
};

$(function() {
	$('[data-morse-play]').click(function() {
		morsePlay(" "+$(this).attr('data-morse-play'));
	});

	$('[data-morse-random]').click(function() {
		var self = this;
		$(self).parent().next().html('');
		morse.characterCallbacks.push(function(character){
			$(self).parent().next().append(character);
		});

		var characters = $(this).attr('data-morse-random');
		var message = '> > >\n';
		for (var i=0;i<7;i++) { // seven lines
			for (j=0;j<5;j++) { // five letters per line
				charNo = Math.floor(Math.random() * characters.length);
				message += characters[charNo];
			}
			message += '\n';
		}
		morsePlay(message);
	});

	$('[data-morse-stop]').click(function() {
		morse.stop();
	});

	morse.messageCallbacks.push(function(){
		$('[data-morse-play],[data-morse-random]').removeAttr('disabled');
		$('[data-morse-stop]').attr('disabled','disabled');

		// remove all callbacks
		morse.characterCallbacks = [];
	});

});
