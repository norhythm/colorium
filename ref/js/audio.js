
		
window.onload = init;

var _context = new (window.AudioContext || window.webkitAudioContext)(),
	_source = null,
	_analyser = null,
	_reqId = null,
	startedLoading = false,
	_audioList = [
		'../ref/audio/colorium_crossfade.mp3'
	],
	_colorList = [
		'rgba(255, 180, 49 ,0.5)',
		'rgba(24, 235, 204 ,0.5)',
		'rgba(213, 159, 246 ,0.5)',
		'rgba(86, 186, 255 ,0.5)',
		'rgba(172, 241, 132 ,0.5)',
		'rgba(255, 229, 93 ,0.5)',
		'rgba(255, 82, 93 ,0.5)',
		'rgba(255, 255, 255 ,1)'
	],
	i = 0,
	num = 0,
	flag = false;
	
var _canvas = document.getElementById('fft'),
	_spctrum = _canvas.getContext('2d');
	
function getPreset(num) {
	if (num < _audioList.length) {
		return _audioList[num];
	} else {
		console.log(num);
		return false;
		flag = true;
		console.log("end",flag);
	}
}

function audio() {
	
	var _self = this;
		
	this.playing = false;
	
	var _processAudio = function(time) {
		var _freqByteData = new Uint8Array(_analyser.frequencyBinCount);
		
		_analyser.getByteFrequencyData(_freqByteData);
		
		_self.renderFFT(_freqByteData);
	};
	
	this.renderFFT = function(_freqByteData) {
		var _spacer = 2,
			_bar = 0.5,
			_numBars = Math.round(_canvas.width / _spacer);
		
		_spctrum.clearRect(0, 0, _canvas.width, _canvas.height);
		
		var y = (_canvas.height / 1);
		
		for (var i = 0; i < _numBars; ++i) {
			var magnitude = _freqByteData[i],
				height = magnitude / (_canvas.height / 100);
			_spctrum.fillRect(i * _spacer, y, _bar, -height);
		}
	};
	
	this.initAudio = function(arrayBuffer) {
		_source = _context.createBufferSource();
		_source.looping = false;
		
		_analyser = _context.createAnalyser();
		
		_source.connect(_analyser);
		_analyser.connect(_context.destination);
				
		if (_context.decodeAudioData) {
			_context.decodeAudioData(arrayBuffer, function(buffer) {	
			_source.buffer = buffer;
			}, function(e) {
				console.log(e);
			});
	    } else {
	    	_source.buffer = _context.createBuffer(arrayBuffer);
	    }
	    
	    _source.noteOn(0)
	};
	
	this.load = function(url) {
	
		var _request = new XMLHttpRequest();
		_request.open('GET', url, true);
		_request.responseType = 'arraybuffer';
		_request.onload = function(e) {
			_self.initAudio(_request.response);
		}
		_request.send();
	};	
	
	this.play = function() {		
		
		_source.noteOn(0);
		this.playing = true;
		
		(function callback(time) {
			_processAudio(time);
			_reqId = window.webkitRequestAnimationFrame(callback);
		})();
	};
	
	this.stop = function() {
		_source.noteOff(0);
		_source.disconnect(0);
	    _analyser.disconnect(0);
	    this.playing = false;
	    window.webkitCancelRequestAnimationFrame(_reqId);
	    _spctrum.clearRect(0, 0, _canvas.width, _canvas.height);
	};
}


function fillColor(i) {
	_spctrum.fillStyle = _colorList[i];
}

var _audio = new audio();

function init() {
	fillColor(1);
	_audio.load(_audioList[0]);
};


var _stop = document.getElementById('stop'),
	_play = document.getElementById('play')

_play.addEventListener('click', function(e) {
	_audio.play();
}, false);

_stop.addEventListener('click', function(e) {
	_audio.stop();
}, false);
