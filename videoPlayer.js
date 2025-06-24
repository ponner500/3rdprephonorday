document.addEventListener('DOMContentLoaded', function() {
    // Get all elements
    const video = document.getElementById('mainVideo');
    const videoPlayer = document.getElementById('videoPlayer');
    const playOverlay = document.getElementById('playOverlay');
    const playBtnLarge = document.getElementById('playBtnLarge');
    const videoControls = document.getElementById('videoControls');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressArea = document.getElementById('progressArea');
    const progressBar = document.getElementById('progressBar');
    const progressFilled = document.getElementById('progressFilled');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const speedBtn = document.getElementById('speedBtn');
    const speedMenu = document.getElementById('speedMenu');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    // Get icons
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    const volumeHigh = volumeBtn.querySelector('.volume-high');
    const volumeMuted = volumeBtn.querySelector('.volume-muted');
    const fullscreenEnter = fullscreenBtn.querySelector('.fullscreen-enter');
    const fullscreenExit = fullscreenBtn.querySelector('.fullscreen-exit');
    
    let isPlaying = false;
    let controlsTimeout;
    
    // Format time function
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Update play button icons
    function updatePlayButton() {
        if (isPlaying) {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            playOverlay.classList.add('playing');
        } else {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            playOverlay.classList.remove('playing');
        }
    }
    
    // Update volume button icons
    function updateVolumeButton() {
        if (video.muted || video.volume === 0) {
            volumeHigh.classList.add('hidden');
            volumeMuted.classList.remove('hidden');
        } else {
            volumeHigh.classList.remove('hidden');
            volumeMuted.classList.add('hidden');
        }
    }
    
    // Update fullscreen button icons
    function updateFullscreenButton() {
        if (document.fullscreenElement) {
            fullscreenEnter.classList.add('hidden');
            fullscreenExit.classList.remove('hidden');
        } else {
            fullscreenEnter.classList.remove('hidden');
            fullscreenExit.classList.add('hidden');
        }
    }
    
    // Play/Pause functionality
    function togglePlay() {
        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
    }
    
    // Update progress bar
    function updateProgress() {
        if (video.duration) {
            const progress = (video.currentTime / video.duration) * 100;
            progressFilled.style.width = `${progress}%`;
            currentTimeEl.textContent = formatTime(video.currentTime);
        }
    }
    
    // Set progress
    function setProgress(e) {
        const rect = progressArea.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const duration = video.duration;
        video.currentTime = (clickX / width) * duration;
    }
    
    // Toggle mute
    function toggleMute() {
        video.muted = !video.muted;
        volumeSlider.value = video.muted ? 0 : video.volume * 100;
        updateVolumeButton();
    }
    
    // Set volume
    function setVolume() {
        const volume = volumeSlider.value / 100;
        video.volume = volume;
        video.muted = volume === 0;
        updateVolumeButton();
    }
    
    // Set playback speed
    function setSpeed(speed) {
        video.playbackRate = speed;
        speedBtn.textContent = `${speed}x`;
        
        // Update active state
        speedMenu.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
        });
        speedMenu.querySelector(`[data-speed="${speed}"]`).classList.add('active');
    }
    
    // Toggle fullscreen
    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoPlayer.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        }
    }
    
    // Show/hide controls
    function showControls() {
        videoPlayer.classList.add('show-controls');
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            if (isPlaying) {
                videoPlayer.classList.remove('show-controls');
            }
        }, 3000);
    }
    
    // Event Listeners
    
    // Play/Pause events
    playBtnLarge.addEventListener('click', togglePlay);
    playPauseBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
    
    // Video events
    video.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(video.duration);
    });
    
    video.addEventListener('timeupdate', updateProgress);
    
    video.addEventListener('play', () => {
        isPlaying = true;
        updatePlayButton();
    });
    
    video.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayButton();
    });
    
    video.addEventListener('volumechange', updateVolumeButton);
    
    // Progress bar
    progressArea.addEventListener('click', setProgress);
    
    // Volume controls
    volumeBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', setVolume);
    
    // Speed controls
    speedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speedMenu.style.display = speedMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    speedMenu.addEventListener('click', (e) => {
        if (e.target.dataset.speed) {
            setSpeed(parseFloat(e.target.dataset.speed));
            speedMenu.style.display = 'none';
        }
    });
    
    // Fullscreen
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', updateFullscreenButton);
    
    // Mouse movement for controls
    videoPlayer.addEventListener('mousemove', showControls);
    videoPlayer.addEventListener('mouseenter', showControls);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName.toLowerCase() === 'input') return;
        
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                togglePlay();
                break;
            case 'KeyM':
                e.preventDefault();
                toggleMute();
                break;
            case 'KeyF':
                e.preventDefault();
                toggleFullscreen();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                video.currentTime = Math.max(0, video.currentTime - 10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
                break;
            case 'ArrowUp':
                e.preventDefault();
                video.volume = Math.min(1, video.volume + 0.1);
                volumeSlider.value = video.volume * 100;
                updateVolumeButton();
                break;
            case 'ArrowDown':
                e.preventDefault();
                video.volume = Math.max(0, video.volume - 0.1);
                volumeSlider.value = video.volume * 100;
                updateVolumeButton();
                break;
        }
    });
    
    // Initialize
    updatePlayButton();
    updateVolumeButton();
    updateFullscreenButton();
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';
    
    // Hide speed menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!speedBtn.contains(e.target) && !speedMenu.contains(e.target)) {
            speedMenu.style.display = 'none';
        }
    });
    
    console.log('Video player initialized successfully');
});