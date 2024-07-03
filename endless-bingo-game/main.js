const game = () => {
    let score; //game score
    let isGameStarted = false; //check if game is starred
    let isGameEnded = false; //check if game is ended
    let lastCalled; //last called number
    let bingoMultiplier; //bingo score multiplier
    let timeMultiplier; //time multiplier
    let timeCalled; //time variable since last number called
    let cellsMarked; //list of marked cells on bingo board
    let streak; //current marked cell streak
    let bingoBoard; //bingo board
    let time; //time left in seconds
    let timeLimit = 60; //time limit in seconds
    let startButton = document.getElementById("start-button"); //start button
    let bingoTable = document.getElementById("bingo-table"); //bingo table
    let timeText = document.getElementById("time"); //time remaining text in seconds
    let scoreText = document.getElementById("score"); //score text
    let numberCalled = document.getElementById("number-called"); //number called text
    let time60SecondsButton = document.getElementById("60-seconds"); //60 seconds time button
    let time120SecondsButton = document.getElementById("120-seconds"); //120 seconds time button
    let time180SecondsButton = document.getElementById("180-seconds"); //180 seconds time button
    let time300SecondsButton = document.getElementById("300-seconds"); //300 seconds time button
    let skipNumberButton = document.getElementById("skip-number"); //skip number button
    time60SecondsButton.addEventListener("click", setTime.bind(null, 60));
    time120SecondsButton.addEventListener("click", setTime.bind(null, 120));
    time180SecondsButton.addEventListener("click", setTime.bind(null, 180));
    time300SecondsButton.addEventListener("click", setTime.bind(null, 300));
    startButton.addEventListener("click", startGame);
    skipNumberButton.addEventListener("click", skipNumbers);
    for (let row = 0; row < 5; row++) {
        //repeat for each row
        for (let column = 0; column < 5; column++) {
            //repeat for each column
            bingoTable.rows[row + 1].cells[column].addEventListener(
                "click",
                markCell.bind(null, row + 1, column + 1),
            );
        }
    }
    function setTime(seconds) {
        //set time in seconds
        timeLimit = seconds; //set time limit in seconds
        timeText.innerText = seconds; //update time text
    }
    function startGame() {
        //when the start button is clicked
        score = 0; //set score to 0
        scoreText.innerText = 0; //update score text
        timeCalled = performance.now(); //set time called to current performance time
        timeMultiplier = 1; //set time score multipler to 1
        bingoMultiplier = 1; //set bingo score multiplier to 1
        time = timeLimit; //set time remaining to time limit
        streak = 0; //set streak to 0
        bingoBoard = []; //set bingo board to empty array
        cellsMarked = []; //set cells marked to empty array
        startButton.disabled = true; //disable start button
        time60SecondsButton.disabled = true; //disable 60 seconds time button
        time120SecondsButton.disabled = true; //disable 120 seconds time button
        time180SecondsButton.disabled = true; //disable 180 seconds time button
        time300SecondsButton.disabled = true; //disable 300 seconds time button
        skipNumberButton.disabled = false; //enable skip number button
        isGameStarted = true; //set is game started to true
        isGameEnded = false; //set is game ended to false
        for (let i = 0; i < 5; i++) {
            //repeat for each row in bingo board
            let columnNumbers = []; //initialize column numbers
            let j = 0;
            while (j < 5) {
                //repeat for each column in each row
                let cellNumber = Math.floor(Math.random() * 15) + i * 15 + 1; //each column has 15 numbers
                if (!columnNumbers.includes(cellNumber)) {
                    //check if other numbers are not in bingo board
                    columnNumbers.push(cellNumber); //add numbers to bingo board
                    bingoTable
                        .querySelector(`#row-${j + 1}`)
                        .querySelector(`#cell-${j + 1}-${i + 1}`).innerText = cellNumber;
                    j++;
                }
            }
            cellsMarked.push(Array(5).fill(undefined)); //set cells marked to blank (undefinede / not marked)
            bingoBoard.push(columnNumbers); //add column numebrs to bingo board
        }
        callNumbers(); //call numbers
        setInterval(updateTime, 1000); //update time every second
    }
    function skipNumbers() {
        //do action when skip number button is pressed
        let cellInBoard = false; //check if last number called is in the bingo board
        for (let i = 0; i < 5; i++) {
            //repeat for each column
            if (bingoBoard[i].includes(lastCalled)) {
                //if last number called is in the bingo board
                cellInBoard = true; //set cell in board to true
            }
        }
        if (cellInBoard) {
            //if last number called is in bingo board
            streak = 0; //reset streak to 0
        } else {
            //if last number called is not in bingo board
            increaseScore(100); //increase score
            streak++; //increase streak by 1
            callNumbers(); //call numbers
        }
    }
    function updateTime() {
        //update time every second
        if (time > 0) {
            //if we still have time remaining
            time--; //decrease time remaining
            timeText.innerText = time; //update time remaining text
        } else {
            //if time remaining is 0
            isGameStarted = false; //set is game started to false
            isGameEnded = true; //set is game ended to true
            startButton.disabled = true; //disable start button
            time60SecondsButton.disabled = false; //enable 60 seconds time button
            time120SecondsButton.disabled = false; //enable 120 seconds time button
            time180SecondsButton.disabled = false; //enable 180 seconds time button
            time300SecondsButton.disabled = false; //enable 300 seconds time button
            skipNumberButton.disabled = true; //disable skip number button
            clearInterval(updateTime); //clear update time interval
        }
    }
    function markCell(y, x) {
        //mark cell on specified cell position
        if (isGameStarted && !isGameEnded) {
            //check if the game is started and not ended
            if (
                lastCalled === bingoBoard[x - 1][y - 1] &&
                cellsMarked[x - 1][y - 1] === undefined
            ) {
                //check if number are part of bingo board and cell is not marked
                increaseScore(100); //increase score when cell is marked correctly
                bingoTable
                    .querySelector(`#row-${y}`)
                    .querySelector(`#cell-${y}-${x}`).innerText = ""; //mark the cell on bingo board
                streak++; //increase streak by 1
                timeCalled = performance.now(); //set time called to current performance time
                cellsMarked[x - 1][y - 1] = true; //mark the cell
                bingoBoard[x - 1][y - 1] = undefined; //remove number from bingo board
                checkBingos(); //check for bingos
                callNumbers(); //call next number
            } else {
                streak = 0;
            }
        }
    }
    function callNumbers() {
        //call next number
        let newLastCalled; //new last called number
        let sameNumber = false; //set same numbers to false
        while (!sameNumber) {
            //check if next number called is not the same as last called number
            newLastCalled = Math.floor(Math.random() * 75) + 1; //generate random bingo number
            if (newLastCalled !== lastCalled) {
                //if new last called number is not equal to last called number
                sameNumber = true; //set same numbers to true
            }
        }
        lastCalled = newLastCalled; //set last called number to new last called number
        numberCalled.innerText = lastCalled; //update number called text
    }
    function generateBingoNumber(x, y) {
        //generate bingo number based on cell position
        let numberCell;
        let cellNumber = Math.floor(Math.random() * 15) + x * 15 + 1; //set new bingo number based on cell position
        numberCell = cellNumber;
        let i = 0; //set iterations to 0
        while (i < 5) {
            //check to make sure all numbers in a column are different
            if (bingoBoard[x][i] === cellNumber) {
                //if new bingo number is same as bingo number of bingo board
                i = 0; //reset iteration to 0
                cellNumber = Math.floor(Math.random() * 15) + x * 15 + 1; //set new bingo number based on cell position
                numberCell = cellNumber; //set number cell to cell number
            } else {
                i++; //increase iteration by 1
            }
        }

        bingoBoard[x][y] = numberCell; //set bingo board position to new bingo number
        cellsMarked[x][y] = undefined; //unmark the marked cell in bingo board
        bingoTable
            .querySelector(`#row-${y + 1}`)
            .querySelector(`#cell-${y + 1}-${x + 1}`).innerText = numberCell; //update bingo cell text
    }
    function checkBingos() {
        //check for bingos
        for (let i = 0; i < 5; i++) {
            //repeat for each column / row / diagonals (top-left to bottom-right and top-right to bottom-left)
            //check for row bingos
            if (
                cellsMarked[i][0] === true &&
                cellsMarked[i][1] === true &&
                cellsMarked[i][2] === true &&
                cellsMarked[i][3] === true &&
                cellsMarked[i][4] === true
            ) {
                increaseScore(1000); //increase score
                bingoMultiplier++; //increase bingo multiplier
                generateBingoNumber(i, 0);
                generateBingoNumber(i, 1);
                generateBingoNumber(i, 2);
                generateBingoNumber(i, 3);
                generateBingoNumber(i, 4);
            }
            //check for column bingos
            if (
                cellsMarked[0][i] === true &&
                cellsMarked[1][i] === true &&
                cellsMarked[2][i] === true &&
                cellsMarked[3][i] === true &&
                cellsMarked[4][i] === true
            ) {
                increaseScore(1000);
                bingoMultiplier++;
                generateBingoNumber(0, i);
                generateBingoNumber(1, i);
                generateBingoNumber(2, i);
                generateBingoNumber(3, i);
                generateBingoNumber(4, i);
            }
            //check for diagonal bingos (top-left to bottom-right)
            if (
                cellsMarked[0][0] === true &&
                cellsMarked[1][1] === true &&
                cellsMarked[2][2] === true &&
                cellsMarked[3][3] === true &&
                cellsMarked[4][4] === true
            ) {
                increaseScore(1000);
                bingoMultiplier++;
                generateBingoNumber(0, 0);
                generateBingoNumber(1, 1);
                generateBingoNumber(2, 2);
                generateBingoNumber(3, 3);
                generateBingoNumber(4, 4);
            }
            //check for diagonal bingos (top-right to bottom-left)
            if (
                cellsMarked[0][4] === true &&
                cellsMarked[1][3] === true &&
                cellsMarked[2][2] === true &&
                cellsMarked[3][1] === true &&
                cellsMarked[4][0] === true
            ) {
                increaseScore(1000);
                bingoMultiplier++;
                generateBingoNumber(0, 4);
                generateBingoNumber(1, 3);
                generateBingoNumber(2, 2);
                generateBingoNumber(3, 1);
                generateBingoNumber(4, 0);
            }
        }
    }
    function increaseScore(amount) {
        //increase score by specified amount with various multipliers
        score += Math.round(
            amount * bingoMultiplier * (1 + streak / 20) * timeMultiplier,
        );
        scoreText.innerText = score.toLocaleString("en-US"); //update score text with commas as a thousand seperator
    }
};
game();
