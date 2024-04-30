let patternGame = new Array();
function createPatternGame(cols, rows, difficulty) {
    // create cols x rows matrix of random-ish bools
    for (let i = 0; i < rows; i++) {
        patternGame[i] = [];
        for (let j = 0; j < cols; j++) {
            patternGame[i][j] = Math.random() > difficulty;
        }
    }
}

let patternUser = new Array();
function createPatternUser(cols, rows) {
    // create cols x rows matrix of zeroes
    for (let i = 0; i < rows; i++) {
        patternUser[i] = [];
        for (let j = 0; j < cols; j++) {
            patternUser[i][j] = false;
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
            hint += (hintNoCounter + ' ');
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
            hint += (hintNoCounter + ' ');
        }
    }

    return hint;
}

function generateField(cols, rows) {
    let game = document.querySelector('#nonogram');
    game.innerHTML = '';

    for (let row = 0; row < rows+1; row++) {
        let rowElement = document.createElement('div');
        rowElement.className = 'nonogram-row';

        for (let col = 0; col < cols+1; col++) {
            let itemElement = document.createElement('div');
            itemElement.classList.add('nonogram-item');

            if (row == 0) { // vertical hints
                itemElement.classList.add('nonogram-hint');
                if (col == 0) { // empty corner
                    itemElement.innerHTML = '';
                }
                else {
                    itemElement.innerHTML = calculateHint('col', col-1);
                }
            }
            else if (col == 0) { // horizontal hints
                itemElement.classList.add('nonogram-hint');
                itemElement.innerHTML = calculateHint('row', row-1);
            }
            else { // cells
                itemElement.classList.add('nonogram-cell');
                itemElement.onclick = () => {
                    itemElement.classList.toggle('nonogram-cell__selected');
                    togglePatternUser(col-1, row-1);
                    if (
                        (checkForLineCompletion('col', col-1) ? 1 : 0) +
                        (checkForLineCompletion('row', row-1) ? 1 : 0)
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
    patternUser[row][col] = !patternUser[row][col];
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
    for (let row = 0; row < patternGame[0].length; row++) {
        if (!checkForLineCompletion('col', row)) {
            return;
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

