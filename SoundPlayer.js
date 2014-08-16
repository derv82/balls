// Taken from http://www.storiesinflight.com/html5/audio.html
function SoundPlayer() {

	var thisSP = this;

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	this.context = new AudioContext();
	this.context.listener.setPosition(0, 0, 1);

	/** The highest "volume" provided so far. */
	this.HIGHEST_VOLUME = 30;
	this.soundBuffer = null;


	var request = new XMLHttpRequest();
	request.open('GET', 'sounds/billiard2.wav', true);
	request.responseType = 'arraybuffer';
	request.onload = function() {
		thisSP.context.decodeAudioData(
			request.response,
			function(buffer) {
				thisSP.soundBuffer = buffer;
			},
			function(e) {
				throw new Error(e);
			});
	}
	request.send();
}

SoundPlayer.prototype = {
	/**
	 * Plays sound.
	 *
	 * @param audioID
	 * 				The id of the <audio> element to play
	 *
	 * @param volume (optional)
	 * 				Actual volume is this volume's percentage of
	 * 				the highest volume recorded so far.
	 */
	play: function(audioID, volume, x) {
		if (this.soundBuffer == null) {
			throw new Error("SoundBuffer is null; no sound was loaded");
		}
		// Create buffer source arund audio buffer
		var source = this.context.createBufferSource();
		source.buffer = this.soundBuffer;

		/////////////////////////////
		// Volume
		volume = volume || new Audio().volume;
		this.HIGHEST_VOLUME = Math.max(this.HIGHEST_VOLUME, volume);

		// Set volume to a relative percentage based on historical data.
		volume = Math.min(1.0, volume / this.HIGHEST_VOLUME);

		// Adjust volume
		var gainNode = this.context.createGain ? this.context.createGain()
		                                       : this.context.createGainNode();
		gainNode.gain.value = volume;

		var panner = this.context.createPanner();
		panner.setPosition(x, 0, 0);

		source.connect(gainNode);
		gainNode.connect(panner);
		panner.connect(this.context.destination);

		// Start sound
		source.start(0);
	}
}
