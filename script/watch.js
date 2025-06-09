const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get('v');
const movieTitle = urlParams.get('title');

// Get DOM elements
const playPauseBtn = document.querySelector('.playPause');
const playIcon = playPauseBtn.querySelector('i');
const progressBar = document.querySelector('.progressbar');
const progressIndicator = document.querySelector('.progressIndicator');
const timeLeft = document.querySelector('.timeLeft');
const timeElapsed = document.querySelector('.timeElapsed');
const volumeBtn = document.querySelector('.volumeExpand .fa-volume-low');
const expandBtn = document.querySelector('.volumeExpand .fa-expand');

let player;

// Load YouTube API
function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Initialize YouTube player when API is ready
function onYouTubeIframeAPIReady() {
    const watchTitle = document.querySelector('.watchTitle h3');
    if (watchTitle && movieTitle) {
        watchTitle.textContent = decodeURIComponent(movieTitle);
    }

    player = new YT.Player('videoPlayer', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'rel': 0,
            'fs': 1,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    setupControls();
    updateDuration();
    // Hide loading overlay
    document.querySelector('.loading-overlay').style.display = 'none';
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function updateProgress() {
    if (player && player.getCurrentTime && player.getDuration) {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        const progress = (currentTime / duration) * 100;
        
        progressIndicator.style.width = `${progress}%`;
        timeElapsed.textContent = formatTime(currentTime);
        timeLeft.textContent = `-${formatTime(duration - currentTime)}`;
    }
}

function updateDuration() {
    if (player && player.getDuration) {
        const duration = player.getDuration();
        timeLeft.textContent = `-${formatTime(duration)}`;
        setInterval(updateProgress, 1000);
    }
}

function setupControls() {
    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            player.pauseVideo();
            playIcon.classList.replace('fa-pause', 'fa-play');
        } else {
            player.playVideo();
            playIcon.classList.replace('fa-play', 'fa-pause');
        }
    });

    // Progress bar click
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / progressBar.offsetWidth;
        player.seekTo(pos * player.getDuration());
    });

    // Volume control
    volumeBtn.addEventListener('click', () => {
        if (player.isMuted()) {
            player.unMute();
            volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-low');
        } else {
            player.mute();
            volumeBtn.classList.replace('fa-volume-low', 'fa-volume-xmark');
        }
    });

    // Fullscreen control
    expandBtn.addEventListener('click', () => {
        const iframe = document.getElementById('videoPlayer');
        if (!document.fullscreenElement) {
            iframe.requestFullscreen();
            expandBtn.classList.replace('fa-expand', 'fa-compress');
        } else {
            document.exitFullscreen();
            expandBtn.classList.replace('fa-compress', 'fa-expand');
        }
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch(e.key.toLowerCase()) {
            case ' ':
            case 'k':
                playPauseBtn.click();
                break;
            case 'f':
                expandBtn.click();
                break;
            case 'm':
                volumeBtn.click();
                break;
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        playIcon.classList.replace('fa-play', 'fa-pause');
    } else if (event.data === YT.PlayerState.PAUSED) {
        playIcon.classList.replace('fa-pause', 'fa-play');
    } else if (event.data === YT.PlayerState.ENDED) {
        playIcon.classList.replace('fa-pause', 'fa-play');
        progressIndicator.style.width = '0%';
    }
}

// Initialize
loadYouTubeAPI();
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;