let score;
let comboMultiplier;
let bingoMultiplier;
let bingoBoard;
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
                bingoTable.querySelector(`#row-${j + 1}`).querySelector(`#cell-${j + 1}-${i + 1}`).innerText = cellNumber;
                j++;
            }
        }
        bingoBoard.push(columnNumbers);
    }
    for (let i = 0; i < 75; i++) {
        numbersRemaining.push(i + 1);
    }
    for (let i = 0; i < numbersRemaining.length; i++) {
        let randomIndex = Math.floor(Math.random() * numbersRemaining.length);
        [numbersRemaining[i], numbersRemaining[randomIndex]] = [numbersRemaining[randomIndex], numbersRemaining[i]];
    }
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
    score += Math.round(amount * comboMultiplier * bingoMultiplier * (1 + streak / 10));
}
function markCell(y, x) {
    if (numbersCalled.includes(bingoBoard[x - 1][y - 1])) {
        increaseScore(100);
        streak++;
        bingoTable.querySelector(`#row-${y}`).querySelector(`#cell-${y}-${x}`).innerText = "";
        scoreText.innerText = score;
    }
    else {
        streak = 0;
    }
}