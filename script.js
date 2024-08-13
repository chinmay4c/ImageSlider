const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dotsContainer = document.querySelector('.dots-container');
const playPauseBtn = document.getElementById('play-pause-btn');
const transitionSpeed = document.getElementById('transition-speed');
const caption = document.querySelector('.caption');

let currentIndex = 0;
let intervalId;
let isPlaying = true;

const captions = [
    "Beautiful landscape",
    "City skyline",
    "Beach sunset",
    "Mountain view",
    "Forest trail",
    "Lake reflection"
];

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

function updateCaption() {
    caption.textContent = captions[currentIndex];
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
    updateCaption();
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

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);
playPauseBtn.addEventListener('click', togglePlayPause);
transitionSpeed.addEventListener('change', startAutoPlay);

createDots();
updateDots();
updateCaption();
startAutoPlay();

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
});