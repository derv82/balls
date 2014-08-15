// Taken from http://www.storiesinflight.com/html5/audio.html
function SoundPlayer() {
	this.AUDIO_MAX_CHANNELS = 10;
	this.audioChannels = new Array();

	for (var i = 0; i < this.AUDIO_MAX_CHANNELS; i++) {
		this.audioChannels[i] = new Array();
		this.audioChannels[i]['channel'] = new Audio();
		this.audioChannels[i]['finished'] = -1;
	}
}

SoundPlayer.prototype = {
	/** audioID is the id of the <audio> element to play */
	play: function(audioID) {
		var now;

		for (var i = 0; i < this.audioChannels.length; i++) {
			now = new Date().getTime();
			if (this.audioChannels[i]['finished'] < now) {
				this.audioChannels[i]['finished'] = now + document.getElementById(audioID).duration * 1000;
				this.audioChannels[i]['channel'].src = document.getElementById(audioID).src;
				this.audioChannels[i]['channel'].load();
				this.audioChannels[i]['channel'].play();
				break;
			}
		}
	}
}
