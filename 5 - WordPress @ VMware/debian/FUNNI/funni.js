let patternGame = new Array();
function createPatternGame(cols, rows, difficulty) {
	patternGame = [];
    // create cols x rows matrix of random-ish bools
    for (let col = 0; col < cols; col++) {
        patternGame[col] = [];
        for (let row = 0; row < rows; row++) {
            patternGame[col][row] = Math.random() > difficulty;
        }
    }
}

let patternUser = new Array();
function createPatternUser(cols, rows) {
	patternUser = [];
    // create cols x rows matrix of zeroes
     for (let col = 0; col < cols; col++) {
        patternUser[col] = [];
        for (let row = 0; row < rows; row++) {
            patternUser[col][row] = false;
        }
    }
}

function calculateHint(type, index) {
    let hint = '';
    let hintNoCounter = 0;

    if (type === 'col') {
        for (let col = 0; col < patternGame.length; col++) {
            if (patternGame[col][index]) {
                hintNoCounter++;
            }
            else {
                if (hintNoCounter > 0) {
                    hint += (hintNoCounter + ' ');
                    hintNoCounter = 0;
                }
            }
        }
        if (hintNoCounter > 0) {
            hint += hintNoCounter;
        }
    }

    if (type === 'row') {
        for (let row = 0; row < patternGame[0].length; row++) {
            if (patternGame[index][row]) {
                hintNoCounter++;
            }
            else {
                if (hintNoCounter > 0) {
                    hint += (hintNoCounter + ' ');
                    hintNoCounter = 0;
                }
            }
        }
        if (hintNoCounter > 0) {
            hint += hintNoCounter;
        }
    }

    return hint;
}

function generateField(cols, rows) {
    let game = document.querySelector('#nonogram');
    game.innerHTML = '';

    for (let col = 0; col < cols+1; col++) {
        let rowElement = document.createElement('div');
        rowElement.className = 'nonogram-row';

        for (let row = 0; row < rows+1; row++) {
            let itemElement = document.createElement('div');
            itemElement.classList.add('nonogram-item');

            if (col === 0) { // vertical hints
                itemElement.classList.add('nonogram-hint');
                if (row === 0) { // empty corner
                    itemElement.innerHTML = '';
                }
                else {
                    itemElement.innerHTML = calculateHint('col', row-1);
                }
            }
            else if (row === 0) { // horizontal hints
                itemElement.classList.add('nonogram-hint');
                itemElement.innerHTML = calculateHint('row', col-1);
            }
            else { // cells
                itemElement.classList.add('nonogram-cell');
                itemElement.onclick = () => {
                    itemElement.classList.toggle('nonogram-cell__selected');
                    togglePatternUser(col-1, row-1);
                    if (
                        (checkForLineCompletion('col', row-1) ? 1 : 0) +
                        (checkForLineCompletion('row', col-1) ? 1 : 0)
                    === 2) {
                        checkForVictory();
                    }
                }
            }

            rowElement.appendChild(itemElement);
        }

        game.appendChild(rowElement);
    }
}



function togglePatternUser(col, row) {
    patternUser[col][row] = !patternUser[col][row];
}

function checkForLineCompletion(type, index) {
    // check whether patternUser sum == patternGame sum
    let sum = 0;

    if (type === 'col') {
        for (let col = 0; col < patternGame.length; col++) {
            sum += patternGame[col][index];
            sum -= patternUser[col][index];
        }
        if (sum !== 0) {
            document.querySelectorAll('.nonogram-row')[0]
                .querySelectorAll('.nonogram-item')[index+1]
                .classList.remove('nonogram-hint__completed');
            return false;
        }
        document.querySelectorAll('.nonogram-row')[0]
            .querySelectorAll('.nonogram-item')[index+1]
            .classList.add('nonogram-hint__completed');
        return true;
    }

    if (type === 'row') {
        for (let row = 0; row < patternGame[0].length; row++) {
            sum += patternGame[index][row];
            sum -= patternUser[index][row];
        }
        if (sum !== 0) {
            document.querySelectorAll('.nonogram-row')[index+1]
                .querySelectorAll('.nonogram-item')[0]
                .classList.remove('nonogram-hint__completed');
            return false;
        }
        document.querySelectorAll('.nonogram-row')[index+1]
            .querySelectorAll('.nonogram-item')[0]
            .classList.add('nonogram-hint__completed');
        return true;
    }
}

function checkForVictory() {
    for (let col = 0; col < patternGame.length; col++) {
        for (let row = 0; row < patternGame[0].length; row++) {
            if (patternGame[col][row] !== patternUser[col][row]) {
            	return;
            }
        }
    }

    const winPlayAgain = confirm('YOU ARE THE WINNER!!!11\nWahoooo!\n\nWanna play again?');
    if (winPlayAgain) {
        init();
    }
}



function init() {
    const cols = 3 + Math.floor(Math.random()*5);
    const rows = 3 + Math.floor(Math.random()*5);
    const difficulty = 0.1 + Math.random() * 0.5;

    createPatternGame(cols, rows, difficulty);
    createPatternUser(cols, rows);
    generateField(cols, rows);
}

init(); // start on first page load
