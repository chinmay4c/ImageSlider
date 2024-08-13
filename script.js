const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dotsContainer = document.querySelector('.dots-container');
const playPauseBtn = document.getElementById('play-pause-btn');
const transitionSpeed = document.getElementById('transition-speed');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const progressBar = document.querySelector('.progress-bar');

let currentIndex = 0;
let intervalId;
let isPlaying = true;

function createDots() {
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener('click', () => showSlide(index));
        dotsContainer.appendChild(dot);
    });
}

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function showSlide(index) {
    if (index < 0) {
        currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
        currentIndex = 0;
    } else {
        currentIndex = index;
    }
    const translateX = -currentIndex * 100;
    slider.style.transform = `translateX(${translateX}%)`;
    updateDots();
    resetProgressBar();
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

function togglePlayPause() {
    if (isPlaying) {
        clearInterval(intervalId);
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        startAutoPlay();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

function startAutoPlay() {
    clearInterval(intervalId);
    intervalId = setInterval(nextSlide, parseInt(transitionSpeed.value));
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }
}

function resetProgressBar() {
    progressBar.style.width = '0%';
    if (isPlaying) {
        animateProgressBar();
    }
}

function animateProgressBar() {
    let width = 0;
    const duration = parseInt(transitionSpeed.value);
    const interval = 10;
    const step = (interval / duration) * 100;

    const progressInterval = setInterval(() => {
        width += step;
        progressBar.style.width = `${width}%`;

        if (width >= 100) {
            clearInterval(progressInterval);
        }
    }, interval);
}

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);
playPauseBtn.addEventListener('click', togglePlayPause);
transitionSpeed.addEventListener('change', startAutoPlay);
fullscreenBtn.addEventListener('click', toggleFullscreen);

createDots();
updateDots();
startAutoPlay();
resetProgressBar();

// Pause auto-transition when hovering over the slider
slider.addEventListener('mouseenter', () => {
    if (isPlaying) clearInterval(intervalId);
});
slider.addEventListener('mouseleave', () => {
    if (isPlaying) startAutoPlay();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === ' ') togglePlayPause();
});

// Swipe functionality for touch devices
let touchStartX = 0;
let touchEndX = 0;

slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX) nextSlide();
    if (touchEndX > touchStartX) prevSlide();
}