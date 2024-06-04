let score; //game score
let calledBonus; //bonus for marking while calling number
let lastCalled; //last called number
let comboMultiplier; //combo multiplier
let combo; //combo
let timeCombo; //combo for marking a cell with last number called
let bingoMultiplier; //bingo score multiplier
let timeMultiplier; //score multiplier for marking quickly
let timeCalled; //time variable since last number called
let bingoBoard; //bingo board
let bingos; //number of bingos
let bingoCount; //count number of bingos made
let numbersCalled; //list of numbers called
let numbersRemaining; //list of numbers remaining to call
let streak; //current marked cell streak
let numbersLeft; //amount of numbers left to call
let cellsMarked; //list of marked cells on bingo board
let isGameStarted; //check if is game started
let isGameEnded; //check if is game ended
let startButton = document.getElementById("start-button"); //start button
let bingoTable = document.getElementById("bingo-table"); //bingo table
let scoreText = document.getElementById("score"); //score text
let numberCalled = document.getElementById("number-called"); //number called text
function startGame() {
    //when start button is clicked
    score = 0; //set score to 0
    comboMultiplier = 1; //set combo multiplier to 1
    bingoMultiplier = 1; //set bingo multiplier to 1
    timeMultiplier = 1; //set time multiplier to 1
    combo = 0; //set combo to 0
    timeCombo = 0; //set time combo to 0
    bingos = 0; //set bingos to 0
    bingoCount = 0; //set bingo count to 0
    bingoBoard = []; //set bingo board to empty array
    numbersCalled = []; //set numbers called to empty array
    numbersRemaining = []; //set numbers remaining to empty array
    streak = 0; //set streak to 0
    numbersLeft = 75; //set numbers left to 75
    cellsMarked = []; //set cells marked to empty array
    isGameStarted = true; //set is game started to true
    isGameEnded = false; //set is game ended to false
    scoreText.innerText = 0; //set score text to 0
    startButton.disabled = true; //disable start button
    for (let i = 0; i < 5; i++) {
        //repeat for each row in bingo board
        let columnNumbers = [];
        let j = 0;
        while (j < 5) {
            //repeat for each column in each row
            let cellNumber = Math.floor(Math.random() * 15) + i * 15 + 1;
            if (!columnNumbers.includes(cellNumber)) {
                //check if other numbers is not in bingo board
                columnNumbers.push(cellNumber); //add numbers to bingo board
                bingoTable
                    .querySelector(`#row-${j + 1}`)
                    .querySelector(`#cell-${j + 1}-${i + 1}`).innerText = cellNumber;
                j++;
            }
        }
        cellsMarked.push(Array(5).fill(undefined)); //set cells marked to blank (undefined / not marked)
        bingoBoard.push(columnNumbers); //add column numbers to bingo board
    }
    for (let i = 0; i < 75; i++) {
        numbersRemaining.push(i + 1); //add numbers to numbers remaining
    }
    for (let i = 0; i < numbersRemaining.length; i++) {
        //repeat for each numbers for numbers remaining array
        let randomIndex = Math.floor(Math.random() * numbersRemaining.length);
        [numbersRemaining[i], numbersRemaining[randomIndex]] = [
            numbersRemaining[randomIndex],
            numbersRemaining[i],
        ]; //shuffle the numbers remaining array
    }
    callNumbers(); //call numbers
    setInterval(callNumbers, 3000); //repeat every 3 seconds
}
function callNumbers() {
    if (isGameStarted && !isGameEnded) {
        if (numbersLeft > 0) {
            //if there are numbers left to call
            numbersCalled.unshift(numbersRemaining[0]);
            numbersRemaining.shift();
            numbersLeft--;
            numberCalled.innerText = numbersCalled[0];
            timeCalled = performance.now(); //set time called to current performance time
        }
    }
}
function increaseScore(amount) {
    //increase score based on various multipliers
    score += Math.round(
        amount *
        comboMultiplier *
        bingoMultiplier *
        timeMultiplier *
        (1 + streak / 10) *
        calledBonus *
        (1 + timeCombo / 10)
    ); //round the score to nearest integer
}
function markCell(y, x) {
    //mark cell on specified cell position
    if (
        numbersCalled.includes(bingoBoard[x - 1][y - 1]) &&
        cellsMarked[x - 1][y - 1] === undefined
    ) {
        //check if numbers called is part of bingo board and cell is not marked
        if (numbersCalled[0] === bingoBoard[x - 1][y - 1]) {
            //check if current number called is in the bingo board
            calledBonus = 2; //double the called bonus
            if (
                lastCalled === numbersCalled[1] ||
                (lastCalled === undefined && numbersCalled.length === 1)
            ) {
                //check if last marked number is marked or if cell marked on first number called
                combo++; //increase combo
            } else {
                combo = 1; //reset combo to 1
            }
        } else {
            calledBonus = 1; //reset called bonus to 1
            combo = 1; //reset combo to 1
        }
        if (calledBonus === 2 && performance.now() - timeCalled < 1000) {
            //check if time since last number called is less than a second
            timeMultiplier = 2; //double the time multiplier
        } else {
            timeMultiplier = 1; //reset time multiplier to 1
        }
        if (calledBonus === 2) {
            timeCombo++; //increase time combo
        } else {
            timeCombo = 0; //reset time combo
        }
        comboMultiplier = combo;
        cellsMarked[x - 1][y - 1] = true;
        lastCalled = bingoBoard[x - 1][y - 1];
        for (let row = 0; row < 5; row++) {
            //repeat for each row
            for (let column = 0; column < 4; column++) {
                //check for 2 in a row
                if (
                    cellsMarked[row][column] === true &&
                    cellsMarked[row][column + 1] === true
                ) {
                    //check for each column
                    if (
                        lastCalled === bingoBoard[row][column] ||
                        lastCalled === bingoBoard[row][column + 1]
                    ) {
                        //check if last called number is one of cells marked
                        increaseScore(125); //increase a lot of points
                    } else {
                        increaseScore(5); //increase a little bit of points
                    }
                }
                if (
                    cellsMarked[column][row] === true &&
                    cellsMarked[column + 1][row] === true
                ) {
                    //check for each row
                    if (
                        lastCalled === bingoBoard[column][row] ||
                        lastCalled === bingoBoard[column + 1][row]
                    ) {
                        increaseScore(125);
                    } else {
                        increaseScore(5);
                    }
                }
                if (
                    cellsMarked[column][column] === true &&
                    cellsMarked[column + 1][column + 1] === true
                ) {
                    //check for top-left to bottom-right diagonal
                    if (
                        lastCalled === bingoBoard[column][column] ||
                        lastCalled === bingoBoard[column + 1][column + 1]
                    ) {
                        increaseScore(250); //increase double points for diagonals
                    } else {
                        increaseScore(10);
                    }
                }
                if (
                    cellsMarked[column][4 - column] === true &&
                    cellsMarked[column + 1][3 - column] === true
                ) {
                    //check for top-right to bottom-left diagonal
                    if (
                        lastCalled === bingoBoard[column][4 - column] ||
                        lastCalled === bingoBoard[column + 1][3 - column]
                    ) {
                        increaseScore(250);
                    } else {
                        increaseScore(10);
                    }
                }
            }
            for (let column = 0; column < 3; column++) {
                //check for 3 in a row
                if (
                    cellsMarked[row][column] === true &&
                    cellsMarked[row][column + 1] === true &&
                    cellsMarked[row][column + 2] === true
                ) {
                    if (
                        lastCalled === bingoBoard[row][column] ||
                        lastCalled === bingoBoard[row][column + 1] ||
                        lastCalled === bingoBoard[row][column + 2]
                    ) {
                        increaseScore(250);
                    } else {
                        increaseScore(10);
                    }
                }
                if (
                    cellsMarked[column][row] === true &&
                    cellsMarked[column + 1][row] === true &&
                    cellsMarked[column + 2][row] === true
                ) {
                    if (
                        lastCalled === bingoBoard[column][row] ||
                        lastCalled === bingoBoard[column + 1][row] ||
                        lastCalled === bingoBoard[column + 2][row]
                    ) {
                        increaseScore(250);
                    } else {
                        increaseScore(10);
                    }
                }
                if (
                    cellsMarked[column][column] === true &&
                    cellsMarked[column + 1][column + 1] === true &&
                    cellsMarked[column + 2][column + 2] === true
                ) {
                    if (
                        lastCalled === bingoBoard[column][column] ||
                        lastCalled === bingoBoard[column + 1][column + 1] ||
                        lastCalled === bingoBoard[column + 2][column + 2]
                    ) {
                        increaseScore(500);
                    } else {
                        increaseScore(20);
                    }
                }
                if (
                    cellsMarked[column][4 - column] === true &&
                    cellsMarked[column + 1][3 - column] === true &&
                    cellsMarked[column + 2][2 - column] === true
                ) {
                    if (
                        lastCalled === bingoBoard[column][4 - column] ||
                        lastCalled === bingoBoard[column + 1][3 - column] ||
                        lastCalled === bingoBoard[column + 2][2 - column]
                    ) {
                        increaseScore(500);
                    } else {
                        increaseScore(20);
                    }
                }
            }
            for (let column = 0; column < 2; column++) {
                //check for 4 in a row
                if (
                    cellsMarked[row][column] === true &&
                    cellsMarked[row][column + 1] === true &&
                    cellsMarked[row][column + 2] === true &&
                    cellsMarked[row][column + 3] === true
                ) {
                    if (
                        lastCalled === bingoBoard[row][column] ||
                        lastCalled === bingoBoard[row][column + 1] ||
                        lastCalled === bingoBoard[row][column + 2] ||
                        lastCalled === bingoBoard[row][column + 3]
                    ) {
                        increaseScore(500);
                    } else {
                        increaseScore(15);
                    }
                }
                if (
                    cellsMarked[column][row] === true &&
                    cellsMarked[column + 1][row] === true &&
                    cellsMarked[column + 2][row] === true &&
                    cellsMarked[column + 3][row] === true
                ) {
                    if (
                        lastCalled === bingoBoard[column][row] ||
                        lastCalled === bingoBoard[column + 1][row] ||
                        lastCalled === bingoBoard[column + 2][row] ||
                        lastCalled === bingoBoard[column + 3][row]
                    ) {
                        increaseScore(500);
                    } else {
                        increaseScore(15);
                    }
                }
                if (
                    cellsMarked[column][column] === true &&
                    cellsMarked[column + 1][column + 1] === true &&
                    cellsMarked[column + 2][column + 2] === true &&
                    cellsMarked[column + 3][column + 3] === true
                ) {
                    if (
                        lastCalled === bingoBoard[column][column] ||
                        lastCalled === bingoBoard[column + 1][column + 1] ||
                        lastCalled === bingoBoard[column + 2][column + 2] ||
                        lastCalled === bingoBoard[column + 3][column + 3]
                    ) {
                        increaseScore(1000);
                    } else {
                        increaseScore(30);
                    }
                }
                if (
                    cellsMarked[column][4 - column] === true &&
                    cellsMarked[column + 1][3 - column] === true &&
                    cellsMarked[column + 2][2 - column] === true &&
                    cellsMarked[column + 3][1 - column] === true
                ) {
                    if (
                        lastCalled === bingoBoard[column][4 - column] ||
                        lastCalled === bingoBoard[column + 1][3 - column] ||
                        lastCalled === bingoBoard[column + 2][2 - column] ||
                        lastCalled === bingoBoard[column + 3][1 - column]
                    ) {
                        increaseScore(1000);
                    } else {
                        increaseScore(30);
                    }
                }
            }
            //check for 5 in a row
            if (
                cellsMarked[row][0] === true &&
                cellsMarked[row][1] === true &&
                cellsMarked[row][2] === true &&
                cellsMarked[row][3] === true &&
                cellsMarked[row][4] === true
            ) {
                if (
                    lastCalled === bingoBoard[row][0] ||
                    lastCalled === bingoBoard[row][1] ||
                    lastCalled === bingoBoard[row][2] ||
                    lastCalled === bingoBoard[row][3] ||
                    lastCalled === bingoBoard[row][4]
                ) {
                    increaseScore(1000);
                } else {
                    increaseScore(20);
                }
            }
            if (
                cellsMarked[0][row] === true &&
                cellsMarked[1][row] === true &&
                cellsMarked[2][row] === true &&
                cellsMarked[3][row] === true &&
                cellsMarked[4][row] === true
            ) {
                if (
                    lastCalled === bingoBoard[0][row] ||
                    lastCalled === bingoBoard[1][row] ||
                    lastCalled === bingoBoard[2][row] ||
                    lastCalled === bingoBoard[3][row] ||
                    lastCalled === bingoBoard[4][row]
                ) {
                    increaseScore(1000);
                } else {
                    increaseScore(20);
                }
            }
            if (
                cellsMarked[0][0] === true &&
                cellsMarked[1][1] === true &&
                cellsMarked[2][2] === true &&
                cellsMarked[3][3] === true &&
                cellsMarked[4][4] === true
            ) {
                if (
                    lastCalled === bingoBoard[0][0] ||
                    lastCalled === bingoBoard[1][1] ||
                    lastCalled === bingoBoard[2][2] ||
                    lastCalled === bingoBoard[3][3] ||
                    lastCalled === bingoBoard[4][4]
                ) {
                    increaseScore(2000);
                } else {
                    increaseScore(40);
                }
            }
            if (
                cellsMarked[0][4] === true &&
                cellsMarked[1][3] === true &&
                cellsMarked[2][2] === true &&
                cellsMarked[3][1] === true &&
                cellsMarked[4][0] === true
            ) {
                if (
                    lastCalled === bingoBoard[0][4] ||
                    lastCalled === bingoBoard[1][3] ||
                    lastCalled === bingoBoard[2][2] ||
                    lastCalled === bingoBoard[3][1] ||
                    lastCalled === bingoBoard[4][0]
                ) {
                    increaseScore(2000);
                } else {
                    increaseScore(40);
                }
            }
        }
        increaseScore(100); //increase score when cell is marked correctly
        bingoTable
            .querySelector(`#row-${y}`)
            .querySelector(`#cell-${y}-${x}`).innerText = ""; //mark the cell on the bingo board
        checkBingos(); //check for bingos
        streak++; //increase streak
        scoreText.innerText = score.toLocaleString("en-US"); //update score
        if (cellsMarked.every((row) => row.every((cell) => cell !== undefined))) {
            //if all cells are marked end the game
            isGameStarted = false; //set is game started to false
            isGameEnded = true; //set is game ended to true
            startButton.disabled = false; //enable the start button
        }
    } else if (cellsMarked[x - 1][y - 1] === undefined) {
        //reset streak and combo if cell is clicked when number is not called yet
        streak = 0;
        combo = 0;
    }
}
function checkBingos() {
    let rowBingos = Array(5).fill(false); //bingo rows
    let columnBingos = Array(5).fill(false); //bingo columns
    let diagonalBingos = Array(2).fill(false); //bingo diagonals
    for (let row = 0; row < 5; row++) {
        //repeat for each row
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
        //repeat for each column
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
    //check for diagonal bingos
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
    while (bingoCount < bingos) {
        //loop for bingo count to make sure to increase score once for each bingo
        bingoCount++;
        switch (bingoCount) {
            case 1:
                increaseScore(1000); //increase score for each bingo
                break;
            case 2:
                increaseScore(1250);
                break;
            case 3:
                increaseScore(1500);
                break;
            case 4:
                increaseScore(2000);
                break;
            case 5:
                increaseScore(2500);
                break;
            case 6:
                increaseScore(3000);
                break;
            case 7:
                increaseScore(4000);
                break;
            case 8:
                increaseScore(5000);
                break;
            case 9:
                increaseScore(6000);
                break;
            case 10:
                increaseScore(8000);
                break;
            case 12:
                increaseScore(10000);
                break;
        }
    }
}
