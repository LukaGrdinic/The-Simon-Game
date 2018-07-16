var powerButton = document.getElementById('powerButton');
var counter = document.getElementById('counter');

/* If powerButton.checked , then the game is on */

powerButton.addEventListener('input', function() {
    if (powerButton.checked) {
        counter.textContent = '-';
    } else {
        counter.textContent= '';
    }
});