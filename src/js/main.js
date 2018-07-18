/* VARIABLES */

var powerButton = document.getElementById('powerButton');
var startButton = document.getElementById('startButton');
var strictButton = document.getElementById('strictButton');

/* Color Shapes Buttons */

var colorShapes = document.querySelectorAll('.colorShape');

var counter = document.getElementById('counter');

var game = {
    'powerOn': false,
    'level': 0,
    'userReady': false,
    'strictMode': false,
    'simonArray': [],
    'nextLevelArray': []
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
        resetGame();
        pickRandomColor();
        game.userReady = true;
        counter.textContent = game.level;
        console.log(game.simonArray);
    }
});

strictButton.addEventListener('click', function () {
    if (game.powerOn) {
        game.strictMode = !game.strictMode;
        console.log('Strict mode: ' + game.strictMode);
    }
});

colorShapes.forEach(function (colorShape) {
    colorShape.addEventListener('click', function () {
        if (game.userReady) {
            debugger;
            if (this.id === game.simonArray[0]) { // On right button pressed
                game.nextLevelArray.push(this.id);
                game.simonArray.shift();
                if (game.simonArray.length === 0) {
                    if (game.level === 20) {
                        window.alert('Congratulations, You win!');
                        resetGame();
                    } else {
                        console.log('Level completed');
                        game.level++;
                        counter.textContent = game.level;
                        pickRandomColor();
                        console.log(game.simonArray);
                    }
                }
            } else { // On wrong button pressed
                console.log('You missed a button!');
                if (game.strictMode) {
                    resetGame();
                } else {
                    game.nextLevelArray.reverse().forEach(function (shiftedColorShape) {
                        game.simonArray.unshift(shiftedColorShape);
                    });
                    game.nextLevelArray = [];
                }
                console.log(game.simonArray);
            }
        }
    });
});

/* GAME FUNCTIONS */

function resetGame() {
    game.level = 0;
    game.simonArray = [];
    game.nextLevelArray = [];
    counter.textContent = game.level;
}

function pickRandomColor() {

    let randomNumber = Math.random();

    if (randomNumber <= 0.25) {
        game.nextLevelArray.push('greenButton');
    } else if (0.25 < randomNumber && randomNumber <= 0.5) {
        game.nextLevelArray.push('redButton');
    } else if (0.5 < randomNumber && randomNumber <= 0.75) {
        game.nextLevelArray.push('blueButton');
    } else if (0.75 < randomNumber && randomNumber <= 1) {
        game.nextLevelArray.push('yellowButton');
    }

    game.nextLevelArray.forEach(function (nextLevelColorShape) {
        game.simonArray.push(nextLevelColorShape);
    });

    game.nextLevelArray = [];

}