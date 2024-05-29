let score;
let calledBonus;
let lastCalled;
let comboMultiplier;
let combo;
let bingoMultiplier;
let bingoBoard;
let bingos;
let numbersCalled;
let numbersRemaining;
let streak;
let numbersLeft;
let cellsMarked;
let isGameStarted;
let isGameEnded;
let startButton = document.getElementById("start-button");
let bingoTable = document.getElementById("bingo-table");
let scoreText = document.getElementById("score");
let numberCalled = document.getElementById("number-called");
function startGame() {
    score = 0;
    comboMultiplier = 1;
    bingoMultiplier = 1;
    combo = 0;
    bingos = 0;
    bingoBoard = [];
    numbersCalled = [];
    numbersRemaining = [];
    streak = 0;
    numbersLeft = 75;
    cellsMarked = [];
    isGameStarted = true;
    isGameEnded = false;
    startButton.disabled = true;
    for (let i = 0; i < 5; i++) {
        let columnNumbers = [];
        let j = 0;
        while (j < 5) {
            let cellNumber = Math.floor(Math.random() * 15) + i * 15 + 1;
            if (!columnNumbers.includes(cellNumber)) {
                columnNumbers.push(cellNumber);
                bingoTable
                    .querySelector(`#row-${j + 1}`)
                    .querySelector(`#cell-${j + 1}-${i + 1}`).innerText = cellNumber;
                j++;
            }
        }
        cellsMarked.push(Array(5).fill(undefined));
        bingoBoard.push(columnNumbers);
    }
    for (let i = 0; i < 75; i++) {
        numbersRemaining.push(i + 1);
    }
    for (let i = 0; i < numbersRemaining.length; i++) {
        let randomIndex = Math.floor(Math.random() * numbersRemaining.length);
        [numbersRemaining[i], numbersRemaining[randomIndex]] = [
            numbersRemaining[randomIndex],
            numbersRemaining[i],
        ];
    }
    callNumbers();
    setInterval(callNumbers, 3000);
}
function callNumbers() {
    if (isGameStarted && !isGameEnded) {
        if (numbersLeft > 0) {
            numbersCalled.unshift(numbersRemaining[0]);
            numbersRemaining.shift();
            numbersLeft--;
            numberCalled.innerText = numbersCalled[0];
        }
    }
}
function increaseScore(amount) {
    score += Math.round(
        amount * comboMultiplier * bingoMultiplier * (1 + streak / 10) * calledBonus
    );
}
function markCell(y, x) {
    if (
        numbersCalled.includes(bingoBoard[x - 1][y - 1]) &&
        cellsMarked[x - 1][y - 1] === undefined
    ) {
        if (numbersCalled[0] === bingoBoard[x - 1][y - 1]) {
            calledBonus = 2;
            if (
                lastCalled === numbersCalled[1] ||
                (lastCalled === undefined && numbersCalled.length === 1)
            ) {
                combo++;
            } else {
                combo = 1;
            }
        } else {
            calledBonus = 1;
            combo = 1;
        }
        comboMultiplier = combo;
        increaseScore(100);
        lastCalled = bingoBoard[x - 1][y - 1];
        streak++;
        bingoTable
            .querySelector(`#row-${y}`)
            .querySelector(`#cell-${y}-${x}`).innerText = "";
        scoreText.innerText = score;
        cellsMarked[x - 1][y - 1] = true;
        checkBingos();
    } else if (cellsMarked[x - 1][y - 1] === undefined) {
        streak = 0;
        combo = 0;
    }
}
function checkBingos() {
    let rowBingos = Array(5).fill(false);
    let columnBingos = Array(5).fill(false);
    let diagonalBingos = Array(2).fill(false);
    for (let row = 0; row < 5; row++) {
        if (
            cellsMarked[row][0] === true &&
            cellsMarked[row][1] === true &&
            cellsMarked[row][2] === true &&
            cellsMarked[row][3] === true &&
            cellsMarked[row][4] === true
        ) {
            rowBingos[row] = true;
        }
    }
    for (let column = 0; column < 5; column++) {
        if (
            cellsMarked[0][column] === true &&
            cellsMarked[1][column] === true &&
            cellsMarked[2][column] === true &&
            cellsMarked[3][column] === true &&
            cellsMarked[4][column] === true
        ) {
            columnBingos[column] = true;
        }
    }
    if (
        cellsMarked[0][0] === true &&
        cellsMarked[1][1] === true &&
        cellsMarked[2][2] === true &&
        cellsMarked[3][3] === true &&
        cellsMarked[4][4] === true
    ) {
        diagonalBingos[0] = true;
    }
    if (
        cellsMarked[0][4] === true &&
        cellsMarked[1][3] === true &&
        cellsMarked[2][2] === true &&
        cellsMarked[3][1] === true &&
        cellsMarked[4][0] === true
    ) {
        diagonalBingos[1] = true;
    }
    bingoMultiplier =
        1 +
        rowBingos.filter(Boolean).length +
        columnBingos.filter(Boolean).length +
        diagonalBingos.filter(Boolean).length;
    bingos =
        rowBingos.filter(Boolean).length +
        columnBingos.filter(Boolean).length +
        diagonalBingos.filter(Boolean).length;
}
