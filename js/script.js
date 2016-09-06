document.addEventListener("DOMContentLoaded", function() { initialiseMediaPlayer(); }, false);
var mediaPlayer;
var progressBar = document.getElementById("progressBar");

function initialiseMediaPlayer() {
mediaPlayer = document.getElementById('video');
mediaPlayer.controls = false;
mediaPlayer.addEventListener('timeupdate', updateProgressBar, false);
}

function formatSecondsAsTime(secs, format) {
    var hr  = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600))/60);
    var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

    if (hr < 10)   { hr    = "0" + hr; }
    if (min < 10) { min = "0" + min; }
    if (sec < 10)  { sec  = "0" + sec; }
    if (hr)            { hr   = "00"; }

    if (format != null) {
      var formatted_time = format.replace('hh', hr);
      formatted_time = formatted_time.replace('h', hr*1+""); // check for single hour formatting
      formatted_time = formatted_time.replace('mm', min);
      formatted_time = formatted_time.replace('m', min*1+""); // check for single minute formatting
      formatted_time = formatted_time.replace('ss', sec);
      formatted_time = formatted_time.replace('s', sec*1+""); // check for single second formatting
      return formatted_time;
    } else {
      return min + ':' + sec;
    }
}

function vidplay() {
   var button = document.getElementById("playImage");
   if (mediaPlayer.paused || mediaPlayer.ended) {
      button.src = "icons/pause-icon.png";
      button.title = "pause";
      mediaPlayer.play();
   } else {
      button.src = "icons/play-icon.png";
      button.title = "play";
      mediaPlayer.pause();
   }
}

function restart() {
    mediaPlayer.currentTime = 0;
}

function skip(value) {
    mediaPlayer.currentTime += value;
}

function updateProgressBar() {
  var timeCurrent = document.getElementById("timeCurrent");
  var timeDuration = document.getElementById("timeDuration");
  var playProgress = document.getElementById("playProgress");
  var currentTime = mediaPlayer.currentTime;
  var totalLength = mediaPlayer.duration;
  var percentage = Math.floor((100 / totalLength) * currentTime);
  progressBar.value = percentage;
  // progressBar.innerHTML = percentage + '% played';
  timeCurrent.innerHTML = formatSecondsAsTime(currentTime.toFixed(2));
  timeDuration.innerHTML = formatSecondsAsTime(totalLength.toFixed(2));
  playProgress.style.webkitTransform = "scaleX(" + percentage / 100 + ")";
  playProgress.style.MozTransform = "scaleX(" + percentage / 100 + ")";
  playProgress.style.msTransform = "scaleX(" + percentage / 100 + ")";
  playProgress.style.OTransform = "scaleX(" + percentage / 100 + ")";
  playProgress.style.transform = "scaleX(" + percentage / 100 + ")";
}

// Event listener for the seek bar
progressBar.addEventListener("change", function() {
  // Calculate the new time
  var time = mediaPlayer.duration * (progressBar.value / 100);

  // Update the video time
  mediaPlayer.currentTime = time;
});

function toggleMute() {
  var btn = document.getElementById('mute-button');
  var btnImage = document.getElementById('muteImage');
  if (mediaPlayer.muted) {
    btnImage.src = "icons/volume-on-icon.png";
    btnImage.title = "volume on";
    mediaPlayer.muted = false;
  }
  else {
    btnImage.src = "icons/volume-off-icon.png";
    btnImage.title = "volume off";
    mediaPlayer.muted = true;
  }
}

function toggleFullScreen() {
  if (mediaPlayer.requestFullscreen) {
    mediaPlayer.requestFullscreen();
  } else if (mediaPlayer.mozRequestFullScreen) {
    mediaPlayer.mozRequestFullScreen(); // Firefox
  } else if (mediaPlayer.webkitRequestFullscreen) {
    mediaPlayer.webkitRequestFullscreen(); // Chrome and Safari
  }
}