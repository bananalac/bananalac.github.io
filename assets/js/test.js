// script.js
const blinkingText = document.querySelector('.blinking-text');

blinkingText.addEventListener('click', () => {
    if (blinkingText.style.animationPlayState === 'paused') {
        blinkingText.style.animationPlayState = 'running';
    } else {
        blinkingText.style.animationPlayState = 'paused';
    }
});
