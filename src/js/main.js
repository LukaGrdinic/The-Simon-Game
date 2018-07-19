/* VARIABLES */

var powerButton = document.getElementById('powerButton');
var startButton = document.getElementById('startButton');
var strictButton = document.getElementById('strictButton');
var strictFlag = document.getElementById('strictFlag');

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
        resetGame();
        game.powerOn = false;
        game.userReady = false;
        game.strictMode = false;
        counter.textContent = '';
    }
});

startButton.addEventListener('click', function () {
    if (game.powerOn) {
        console.log('Start or Reset the Game');
        resetGame();
        pickRandomColor();
        game.userReady = true;
        console.log(game.simonArray);
    }
});

strictButton.addEventListener('click', function () {
    if (game.powerOn && game.userReady) {
        game.strictMode = !game.strictMode;
        strictFlag.style.visibility = game.strictMode ? 'visible' : 'hidden';
        console.log('Strict mode: ' + game.strictMode);
    }
});

colorShapes.forEach(function (colorShape) {
    colorShape.addEventListener('click', function () {
        if (game.userReady) {
            /* debugger; */
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
                    console.log('You loose!');
                    resetGame();
                    pickRandomColor();
                } else {
                    game.nextLevelArray.reverse().forEach(function (shiftedColorShape) {
                        game.simonArray.unshift(shiftedColorShape);
                    });
                    game.nextLevelArray = [];
                    indicateColorShapes();
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

    indicateColorShapes();

}

function indicateColorShapes(indexInSimonArray = 0) {

    debugger;

    game.userReady = false;

    /* Make another indication that the user can not make a move */

    colorShapes.forEach(function (colorShape) { // wrap this in a function disablePointerEvents()
        colorShape.classList.add('disabled');
    });

    function highlightColorShape() {
        return new Promise(function (resolve) {
            setTimeout(function () {
                let indicatedColorShape = document.querySelector('#' + game.simonArray[indexInSimonArray]);
                indicatedColorShape.classList.add('highlighted');
                console.log('After one second the colorShape IS highlighted');
                resolve(indicatedColorShape);
            }, 1000);
        });
    }

    let colorShapeBeingIndicated = highlightColorShape();
    colorShapeBeingIndicated.then(function removeHighlightFromColorShape(highlightedColorShape) {
        setTimeout(function () {
            highlightedColorShape.classList.remove('highlighted');
            console.log('After one more second the colorShape is NOT highlighted');
            indexInSimonArray++;
            if (indexInSimonArray < game.simonArray.length) {
                indicateColorShapes(indexInSimonArray);
            } else {
                game.userReady = true;
                colorShapes.forEach(function (colorShape) { // wrap this in a function enablePointerEvents() or combine with disablePointerEvents
                    colorShape.classList.remove('disabled');
                });
            }
        }, 1000);
    });

}

function togglePointerEvents() { // enable and disable pointer events
    if (!game.userReady) {
        colorShapes.forEach(function (colorShape) {
            colorShape.classList.add('disabled');
        });
    } else {
        colorShapes.forEach(function (colorShape) {
            colorShape.classList.remove('disabled');
        });
    }
}