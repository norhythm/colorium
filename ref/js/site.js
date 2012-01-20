/*

Audio Api使ってスペクトラムアナライザ作ったのにブラウザの仕様とバグで使えないとか
辛い

*/
/* ごめんねIE・・・僕は君のこと、好きだよ・・・ */
$(function() {
	if(navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
	} else {
		$('.sample').append("<iframe width='100%' height='166' scrolling='no' frameborder='no' src='http://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F31571516&amp;auto_play=false&amp;show_artwork=false&amp;color=8f939a'></iframe>");
		
		var $window = $(window),
		$preloader = $('#preloader');

		var manager = $('body').nametake({enablePreloader: true});
		
		manager.on('preinitialize', function(preloader) {
			preloader.on('progress', function() {
				$preloader.find('.number span').text(Math.floor(preloader.getProportion() * 100));
				$preloader.find('.number li').css({
					//width: Math.floor(preloader.getProportion() * 8),
					//height: Math.floor(preloader.getProportion() * 8)
				});
			});
			
			preloader.on('complete', function(next) {
				$preloader.fadeOut('slow', function() {
					$preloader.remove();
					$window.unbind('resize.preloader');
					$('html').css('overflow', 'auto');
					$window.trigger('resize');
				});
			});
		});
		
		$window.bind('resize.preloader', function(e) {
			$preloader.height($window.height());
		});
	}
});