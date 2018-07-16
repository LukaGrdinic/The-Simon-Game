/* VARIABLES */

var powerButton = document.getElementById('powerButton');
var startButton = document.getElementById('startButton');

/* Color Shapes Buttons */

var colorShapes = document.querySelectorAll('.colorShape');

var counter = document.getElementById('counter');

var game = {
    'powerOn': false,
    'level': 0,
    'userReady': false,
    'simonArray': [],
    'userArray': []
}


/* ADD EVENT HANDLERS */

/* If powerButton.checked , then the game is on */

powerButton.addEventListener('input', function () {
    if (powerButton.checked) {
        game.powerOn = true;
        counter.textContent = '-';
    } else {
        game.powerOn = false;
        counter.textContent = '';
    }
});

startButton.addEventListener('click', function () {
    if (game.powerOn) {
        console.log('Start or Reset the Game');
        pickRandomColor();
        game.userReady = true;
        counter.textContent = '0';
    }
});

colorShapes.forEach(function(colorShape) {
    colorShape.addEventListener('click', function() {
        if (game.userReady) {
            game.userArray.push(this.id);
        }
    });
});

/* GAME FUNCTIONS */

function pickRandomColor() {
    var randomNumber = Math.random();

    if (randomNumber <= 0.25) {
        game.simonArray.push('greenButton');
    } else if (0.25 < randomNumber && randomNumber <= 0.5) {
        game.simonArray.push('redButton');
    } else if (0.5 < randomNumber && randomNumber <= 0.75) {
        game.simonArray.push('blueButton');
    } else if (0.75 < randomNumber && randomNumber <= 1) {
        game.simonArray.push('yellowButton');
    }

}