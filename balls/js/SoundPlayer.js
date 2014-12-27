/**
 * Initialize sound player with list of sounds
 * @param sounds
 *        Dictionary of sounds containing "url" and "name" attributes.
 */
function SoundPlayer(sounds) {

	// Load sounds
	this.sounds = sounds;
	this.soundBuffers = {};
	for (var sound in sounds) {
		this.load(sounds[sound]);
	}

	// The highest "volume" provided so far.
	this.HIGHEST_VOLUME = 30;

	// Setup context and audio position
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	this.context = new AudioContext();
	this.context.listener.setPosition(0, 0, 1);
}

SoundPlayer.prototype = {
	/**
	 * Load sound.
	 * @param sound
	 *        Object with "url" and "name" attributes.
	 */
	load: function(sound) {
		var thisSP = this;

		var request = new XMLHttpRequest();
		request.open('GET', sound.url, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			thisSP.context.decodeAudioData(
				request.response,
				function(buffer) {
					thisSP.soundBuffers[sound.name] = buffer;
				},
				function(e) {
					throw new Error(e);
				});
		}
		request.send();
	},

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
	play: function(soundName, volume, x) {
		if (!this.soundBuffers[soundName]) {
			throw new Error("No buffer for sound '" + soundName + "'");
		}
		// Create buffer source around audio buffer
		var source = this.context.createBufferSource();
		source.buffer = this.soundBuffers[soundName];

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

		// Adjust position if given
		var panner = this.context.createPanner();
		if (x) {
			panner.setPosition(x, 0, 0);
		}

		// Conect the audio nodes together
		source.connect(gainNode);
		gainNode.connect(panner);
		panner.connect(this.context.destination);

		// Play sound from beginning
		source.start(0);
	}
}
