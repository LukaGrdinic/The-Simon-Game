/* VARIABLES */

var powerButton = document.getElementById('powerButton');
var startButton = document.getElementById('startButton');
var counter = document.getElementById('counter');

var game = {
    'level': 0,
    'simonArray': []
}


/* ADD EVENT HANDLERS */

/* If powerButton.checked , then the game is on */

powerButton.addEventListener('input', function () {
    if (powerButton.checked) {
        counter.textContent = '-';
    } else {
        counter.textContent = '';
    }
});

startButton.addEventListener('click', function () {
    if (powerButton.checked) {
        console.log('Start or Reset the Game');
        counter.textContent = '0';
    }
});