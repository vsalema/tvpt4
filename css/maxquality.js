(function(window, videojs) {
     var player = window.player = videojs('js-video-horsa');
	  player.ready(function() {
	  const muteButton = document.querySelector("");
		  muteButton.click();
			
		  var promise = player.play();
		  if (promise !== undefined) {
			  promise.then(function() {
				  const muteButton = document.querySelector("");
				}).catch(function(error) {
				});
			} else {
			}
		  });
player.maxQualitySelector({
		  displayCurrentQuality: false,
	  });
	}(window, window.videojs));