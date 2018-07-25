/* IMPORTED TONE.JS LIBRARY */

/* VARIABLES */

var powerButton = document.getElementById('powerButton');
var startButton = document.getElementById('startButton');
var strictButton = document.getElementById('strictButton');
var strictFlag = document.getElementById('strictFlag');

/* SOUNDS */

//create a synth and connect it to the master output (your speakers)
var synthByUser = new Tone.Synth().toMaster();
var synthBySimon = new Tone.Synth().toMaster();
var synthMistake = new Tone.Synth().toMaster();
/* Color Shapes Buttons */

var colorShapes = document.querySelectorAll('.colorShape');

var counter = document.getElementById('counter');

var game = {
    'powerOn': false,
    'level': 0,
    'userReady': false,
    'strictMode': false,
    'simonArray': [],
    'nextLevelArray': [],
    'adequateSounds': {
        'greenButton': 'C4',
        'redButton': 'D4',
        'blueButton': 'E4',
        'yellowButton': 'F4'
    },
    'indicationDuration': 800
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
        strictFlag.style.visibility = game.strictMode ? 'visible' : 'hidden';
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
                        let victoryIndicated = indicateVictory();
                        victoryIndicated.then(function () {
                            resetGame();
                        });
                    } else {
                        console.log('Level completed');
                        game.level++;
                        updateIndicationDuration();
                        counter.textContent = game.level;
                        pickRandomColor();
                        console.log(game.simonArray);
                    }
                }
            } else { // On wrong button pressed
                /* debugger; */
                console.log('You pressed the wrong button');
                let mistakeIndicated = indicateUserMistake();
                mistakeIndicated.then(function handleUserMistake() {
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
                });
            }
        }
    });
    /* Adding sound effects based on how long the mouse is pressed down */
    colorShape.addEventListener('mousedown', function () {
        if (game.userReady) {
            synthByUser.triggerAttack(game.adequateSounds[this.id]);
        }
    });
    colorShape.addEventListener('mouseup', function () {
        synthByUser.triggerRelease();
    });
    colorShape.addEventListener('mouseleave', function () {
        synthByUser.triggerRelease();
    });
});

/* GAME FUNCTIONS */

function resetGame() {
    game.level = 0;
    game.simonArray = [];
    game.nextLevelArray = [];
    counter.textContent = game.level;
    game.indicationDuration = 800;
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

    /* debugger; */

    game.userReady = false;

    /* Make another indication that the user can not make a move */

    togglePointerEvents();

    function highlightColorShape() {
        return new Promise(function (resolve) {
            setTimeout(function () {
                /* debugger; */
                let indicatedColorShape = document.querySelector('#' + game.simonArray[indexInSimonArray]);
                indicatedColorShape.classList.add('highlighted');
                console.log('After one second the colorShape IS highlighted');
                synthBySimon.triggerAttack(game.adequateSounds[indicatedColorShape.id]);
                console.log('The sound plays for ' + indicatedColorShape.id);
                resolve(indicatedColorShape);
            }, game.indicationDuration);
        });
    }

    let colorShapeBeingIndicated = highlightColorShape();
    colorShapeBeingIndicated.then(function removeHighlightFromColorShape(highlightedColorShape) {
        setTimeout(function () {
            highlightedColorShape.classList.remove('highlighted');
            console.log('After one more second the colorShape is NOT highlighted');
            synthBySimon.triggerRelease();
            console.log('The sound stops playing');
            indexInSimonArray++;
            if (indexInSimonArray < game.simonArray.length) {
                indicateColorShapes(indexInSimonArray);
            } else {
                game.userReady = true;
                togglePointerEvents();
            }
        }, game.indicationDuration);
    });

}

function indicateUserMistake() {

    /* debugger; */

    synthMistake.triggerAttackRelease('C3', `${game.indicationDuration / 1000}s`); /* Play the loose sound */

    return new Promise(function (resolve) {
        game.userReady = false;
        togglePointerEvents();
        counter.textContent = 'ERR';
        setTimeout(function () {
            counter.textContent = game.level;
            game.userReady = true;
            togglePointerEvents();
            resolve();
        }, 2000);
    });
}

function indicateVictory() {

    game.userReady = false;
    togglePointerEvents();

    /* Making the whole function return a Promise - not sure if it could be better,cleaner */

    return new Promise(function (resolve) {

        function highlightCarousel(colorIndex = 0, indicationLoop = 1) {

            function highlightColorShapes() {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        let colorShape = colorShapes[colorIndex];
                        colorShape.classList.add('highlighted');
                        resolve(colorShape);
                    }, 100);
                });
            }

            let indicatedShape = highlightColorShapes();
            indicatedShape.then(function (colorShape) {
                setTimeout(function () {
                    colorShape.classList.remove('highlighted');
                    if (colorIndex < colorShapes.length - 1) {
                        colorIndex++;
                        highlightCarousel(colorIndex, indicationLoop);
                    } else {
                        if (indicationLoop < 5) {
                            colorIndex = 0;
                            indicationLoop++;
                            highlightCarousel(colorIndex, indicationLoop);
                        } else {
                            game.userReady = true;
                            togglePointerEvents();
                            resolve();
                        }
                    }
                }, 100);
            });
        }

        highlightCarousel();
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

function updateIndicationDuration() {
    console.log('Increase the speed');
    game.indicationDuration = 800 - game.level * 35;
}