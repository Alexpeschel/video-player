document.addEventListener("DOMContentLoaded", function() { initialiseMediaPlayer(); }, false);

var mediaPlayer;
var progressBar = document.getElementById("progressBar");
var prevTime = 0;
var textTracks;
var textTrack;
var prevId;

function initialiseMediaPlayer() {
  mediaPlayer = document.getElementById('video');
  mediaPlayer.controls = false;
  mediaPlayer.addEventListener('timeupdate', updateProgressBar, false);
  mediaPlayer.addEventListener('timeupdate', updateCaptionText, false);
  textTracks = mediaPlayer.textTracks;
  textTrack = textTracks[0];
  toggleCC();
}

function formatSecondsAsTime(secs) {
    var hr  = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600))/60);
    var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

    if (hr < 10)   { hr    = "0" + hr; }
    if (min < 10) { min = "0" + min; }
    if (sec < 10)  { sec  = "0" + sec; }
    if (hr)            { hr   = "00"; }

    return min + ':' + sec;
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
  if(prevTime !== formatSecondsAsTime(currentTime.toFixed(2))) {
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

    console.log(formatSecondsAsTime(currentTime.toFixed(2)));

    prevTime = formatSecondsAsTime(currentTime.toFixed(2));
  }

}

// Event listener for the seek bar
progressBar.addEventListener("change", function() {
  // Calculate the new time
  var time = mediaPlayer.duration * (progressBar.value / 100);

  // Update the video time
  mediaPlayer.currentTime = time;
});

function updateCaptionText() {
    // "this" is a textTrack
  var cue = textTrack.activeCues[0]; // assuming there is only one active cue
  var obj = cue.id;
  if(prevId !== obj){
    // do something
    var captionPart = document.getElementsByClassName("captionPart");
    var currentPart = captionPart[obj - 1];

    for(var i = 0; i < textTrack.cues.length; i++) {
      captionPart[i].className = "captionPart";
    }

    currentPart.className = "captionPart highlight";
    prevId = obj;
  }
}

function toggleMute() {
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

function toggleCC() {
  var subtitles = document.getElementById('subtitles');
  var captionMenuButtons = [];
  var subtitleMenuButtons = [];
  var createMenuItem = function(id, lang, label) {
     var listItem = document.createElement('li');
     var button = listItem.appendChild(document.createElement('button'));
     button.setAttribute('id', id);
     button.className = 'subtitles-button';
     if (lang.length > 0) button.setAttribute('lang', lang);
     button.value = label;
     button.setAttribute('data-state', 'inactive');
     button.appendChild(document.createTextNode(label));
     button.addEventListener('click', function(e) {
        // Set all buttons to inactive
         subtitleMenuButtons.map(function(v, i, a) {
           subtitleMenuButtons[i].setAttribute('data-state', 'inactive');
        });
        // Find the language to activate
        var lang = this.getAttribute('lang');
        for (var i = 0; i < mediaPlayer.textTracks.length; i++) {
           // For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
           if (mediaPlayer.textTracks[i].language == lang) {
              mediaPlayer.textTracks[i].mode = 'showing';
              this.setAttribute('data-state', 'active');
              subtitles.className = "cc-button show";
           }
           else {
              mediaPlayer.textTracks[i].mode = 'hidden';
              subtitles.className = "cc-button";
           }
        }
        subtitlesMenu.style.display = 'none';
     });
     subtitleMenuButtons.push(button);
     return listItem;
  }

  var subtitlesMenu;
  var videoContainer = document.getElementById("button-right");
  if (mediaPlayer.textTracks) {
     var df = document.createDocumentFragment();
     var subtitlesMenu = df.appendChild(document.createElement('ul'));
     subtitlesMenu.className = 'subtitles-menu';
     subtitlesMenu.appendChild(createMenuItem('subtitles-off', '', 'Off'));
     for (var i = 0; i < mediaPlayer.textTracks.length; i++) {
        subtitlesMenu.appendChild(createMenuItem('subtitles-' + mediaPlayer.textTracks[i].language, mediaPlayer.textTracks[i].language, mediaPlayer.textTracks[i].label));
     }
     videoContainer.appendChild(subtitlesMenu);
  }

  subtitles.addEventListener('click', function(e) {
     if (subtitlesMenu) {
        subtitlesMenu.style.display = (subtitlesMenu.style.display == 'block' ? 'none' : 'block');
     }
  });
}