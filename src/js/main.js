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

colorShapes.forEach(function (colorShape) {
    colorShape.addEventListener('click', function () {
        if (game.userReady) {
            debugger;
            if (this.id === game.simonArray[0]) {
                game.nextLevelArray.push(this.id);
                game.simonArray.shift();
                if (game.simonArray.length === 0) {
                    console.log('Level completed');
                    game.level++;
                    counter.textContent = game.level;
                    pickRandomColor();
                    console.log(game.simonArray);
                }
            } else {
                console.log('You missed a button!');
                game.nextLevelArray.reverse().forEach(function (shiftedColorShape) {
                    game.simonArray.unshift(shiftedColorShape);
                });
                game.nextLevelArray = [];
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