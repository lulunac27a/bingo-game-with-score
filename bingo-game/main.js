const game = () => {
    let score; //game score
    let bestScore; //best game score
    let calledBonus; //bonus for marking while calling number
    let callTime = 3000; //time to call numbers
    let timeBonus = 1000; //bonus for marking quickly before time bonus
    let lastCalled; //last called number
    let difficultyMultiplier = 1; //score multiplier
    let difficultyMode = "easy"; //game difficulty mode
    let comboMultiplier; //combo multiplier
    let combo; //combo
    let timeCombo; //combo for marking a cell with last number called
    let bingoMultiplier; //bingo score multiplier
    let timeMultiplier; //score multiplier for marking quickly
    let timeCalled; //time variable since last number called
    let bingoBoard; //bingo board
    let bingos; //number of bingos
    let bingoCount; //count the number of bingos made
    let bingo1Count; //number of bingo numbers called for first bingo
    let bingo2Count; //number of bingo numbers called for second bingo
    let bingo3Count; //number of bingo numbers called for third bingo
    let bingo4Count; //number of bingo numbers called for fourth bingo
    let bingo5Count; //number of bingo numbers called for fifth bingo
    let bingo6Count; //number of bingo numbers called for sixth bingo
    let bingo7Count; //number of bingo numbers called for seventh bingo
    let bingo8Count; //number of bingo numbers called for eighth bingo
    let bingo9Count; //number of bingo numbers called for ninth bingo
    let bingo10Count; //number of bingo numbers called for tenth bingo
    let blackoutBingoCount; //number of bingo numbers called for all cells marked (blackout bingo)
    let lastBingoCount; //last count number of bingo made before marking a cell
    let bingosMadeMultiplier; //number of bingos made score multiplier
    let numbersCalled; //list of numbers called
    let numbersRemaining; //list of numbers remaining to call
    let streak; //current marked cell streak
    let numbersLeft; //number of numbers left to call
    let cellsMarked; //list of marked cells on bingo board
    let isGameStarted; //check if the game started
    let isGameEnded; //check if the game ended
    let startButton = document.getElementById("start-button"); //start button
    let bingoTable = document.getElementById("bingo-table"); //bingo table
    let scoreText = document.getElementById("score"); //score text
    let bestScoreText = document.getElementById("best-score"); //best score text
    let numberCalled = document.getElementById("number-called"); //number called text
    let easyButton = document.getElementById("easy"); //easy difficulty button
    let mediumButton = document.getElementById("medium"); //medium difficulty button
    let hardButton = document.getElementById("hard"); //hard difficulty button
    let speedButton = document.getElementById("speed-mode"); //speed mode difficulty button
    let skipNumberButton = document.getElementById("skip-number"); //skip number button
    let freeSpaceButton = document.getElementById("free-space-button"); //free space button
    let freeSpaceMultiplier = freeSpaceButton.checked ? 1.25 : 1; //bonus score multiplier for using free space
    startButton.addEventListener("click", startGame);
    easyButton.addEventListener("click", setDifficulty.bind(null, "easy"));
    mediumButton.addEventListener("click", setDifficulty.bind(null, "medium"));
    hardButton.addEventListener("click", setDifficulty.bind(null, "hard"));
    speedButton.addEventListener(
        "click",
        setDifficulty.bind(null, "speed-mode"),
    );
    skipNumberButton.addEventListener("click", skipNumbers);
    for (let row = 0; row < 5; row++) {
        for (let column = 0; column < 5; column++) {
            bingoTable.rows[row + 1].cells[column].addEventListener(
                "click",
                markCell.bind(null, row + 1, column + 1),
            );
        }
    }
    const setDifficulty = (difficulty) => {
        //set game difficulty
        switch (difficulty) {
            case "easy": //easy difficulty
                callTime = 3000; //call numbers every 3 seconds
                difficultyMultiplier = 1; //no score increase
                timeBonus = 1000; //bonus score for marking within a second
                difficultyMode = "easy"; //set difficulty mode to easy
                break;
            case "medium": //medium difficulty
                callTime = 2000; //call numbers every 2 seconds
                difficultyMultiplier = 1.5; //increase the score by 50 percent
                timeBonus = 750; //bonus score for marking within 750 milliseconds
                difficultyMode = "medium"; //set difficulty mode to medium
                break;
            case "hard": //hard difficulty
                callTime = 1000; //call numbers every second
                difficultyMultiplier = 2; //double the score
                timeBonus = 500; //bonus score for marking within 500 milliseconds
                difficultyMode = "hard"; //set difficulty mode to hard
                break;
            case "speed-mode": //speed mode difficulty
                callTime = 0; //don't call numbers automatically
                difficultyMultiplier = 1; //no score increase
                timeBonus = -1; //no time bonus
                difficultyMode = "speed-mode"; //set difficulty mode to speed mode
                break;
        }
    };
    const startGame = () => {
        //when the start button is clicked
        score = 0; //set score to 0
        comboMultiplier = 1; //set combo multiplier to 1
        bingoMultiplier = 1; //set bingo multiplier to 1
        timeMultiplier = 1; //set time multiplier to 1
        timeCalled = performance.now(); //set time called to current performance time
        calledBonus = 1; //set called bonus multiplier to 1
        combo = 0; //set combo to 0
        timeCombo = 0; //set time combo to 0
        bingos = 0; //set bingos to 0
        bingoCount = 0; //set bingo count to 0
        bingo1Count = 75; //set all numbered bingo counts to 75 (all numbers called)
        bingo2Count = 75;
        bingo3Count = 75;
        bingo4Count = 75;
        bingo5Count = 75;
        bingo6Count = 75;
        bingo7Count = 75;
        bingo8Count = 75;
        bingo9Count = 75;
        bingo10Count = 75;
        blackoutBingoCount = 75;
        lastBingoCount = 0; //set the last bingo count to 0
        bingosMadeMultiplier = 1; //set bingo made multiplier to 1
        bingoBoard = []; //set bingo board to an empty array
        numbersCalled = []; //set numbers called to an empty array
        numbersRemaining = []; //set numbers remaining to an empty array
        streak = 0; //set streak to 0
        numbersLeft = 75; //set numbers left to 75
        cellsMarked = []; //set cells marked to an empty array
        isGameStarted = true; //set is game started to true
        isGameEnded = false; //set is game ended to false
        freeSpaceMultiplier = freeSpaceButton.checked ? 1.25 : 1; //update bonus free space score multiplier by checking if the free space button is checked
        scoreText.textContent = "0"; //set score text to 0
        startButton.disabled = true; //disable start button
        easyButton.disabled = true; //disable easy difficulty button
        mediumButton.disabled = true; //disable medium difficulty button
        hardButton.disabled = true; //disable hard difficulty button
        speedButton.disabled = true; //disable speed mode difficulty button
        if (difficultyMode === "speed-mode") {
            //if difficulty mode is speed mode
            skipNumberButton.disabled = false; //enable skip number button
        }
        freeSpaceButton.disabled = true; //disable free space button
        for (let i = 0; i < 5; i++) {
            //repeat for each row in bingo board
            let columnNumbers = [];
            let j = 0;
            while (j < 5) {
                //repeat for each column in each row
                let cellNumber = Math.floor(Math.random() * 15) + i * 15 + 1; //each column has 15 numbers
                if (!columnNumbers.includes(cellNumber)) {
                    //check if other numbers are not in bingo board
                    columnNumbers.push(cellNumber); //add numbers to bingo board
                    bingoTable
                        .querySelector(`#row-${j + 1}`)
                        .querySelector(`#cell-${j + 1}-${i + 1}`).textContent =
                        cellNumber.toString();
                    j++;
                }
            }
            cellsMarked.push(Array(5).fill(undefined)); //set cells marked to blank (undefined / not marked)
            bingoBoard.push(columnNumbers); //add column numbers to bingo board
        }
        if (freeSpaceButton.checked) {
            //check if the free space button is checked
            cellsMarked[2][2] = true; //mark the center cell on the free space on the bingo board
            bingoTable
                .querySelector("#row-3")
                .querySelector("#cell-3-3").textContent = ""; //update the text
        }
        for (let i = 0; i < 75; i++) {
            numbersRemaining.push(i + 1); //add numbers to numbers remaining
        }
        for (let i = 0; i < numbersRemaining.length; i++) {
            //repeat for each number for numbers remaining array
            let randomIndex = Math.floor(
                Math.random() * numbersRemaining.length,
            );
            [numbersRemaining[i], numbersRemaining[randomIndex]] = [
                numbersRemaining[randomIndex],
                numbersRemaining[i],
            ]; //shuffle the numbers remaining array
        }
        if (difficultyMode !== "speed-mode") {
            //if difficulty mode is not speed mode
            callNumbers(); //call numbers
            setInterval(callNumbers, callTime); //repeat every few seconds based on difficulty
        }
        if (difficultyMode === "speed-mode") {
            startButton.addEventListener("click", callNumbers());
        }
    };
    const callNumbers = () => {
        if (isGameStarted && !isGameEnded) {
            if (numbersLeft > 0) {
                //if there are numbers left to call
                numbersCalled.unshift(numbersRemaining[0]);
                numbersRemaining.shift();
                numbersLeft--; //decrease numbers left to call
                numberCalled.textContent = numbersCalled[0].toString(); //update number called text to last number called
                timeCalled = performance.now(); //set time called to current performance time
            } else {
                isGameStarted = false; //set is game started to false
                isGameEnded = true; //set is game ended to true
                startButton.disabled = false; //enable the start button
                easyButton.disabled = false; //enable easy difficulty button
                mediumButton.disabled = false; //enable medium difficulty button
                hardButton.disabled = false; //enable hard difficulty button
                speedButton.disabled = false; //enable speed mode difficulty button
                skipNumberButton.disabled = true; //disable skip number button
                freeSpaceButton.disabled = false; //enable free space button
                increaseScoreBingo(bingo1Count); //get bonus points based on the number of bingo numbers called for a bingo
                increaseScoreBingo(bingo2Count);
                increaseScoreBingo(bingo3Count);
                increaseScoreBingo(bingo4Count);
                increaseScoreBingo(bingo5Count);
                increaseScoreBingo(bingo6Count);
                increaseScoreBingo(bingo7Count);
                increaseScoreBingo(bingo8Count);
                increaseScoreBingo(bingo9Count);
                increaseScoreBingo(bingo10Count);
                increaseScoreBingo(blackoutBingoCount);
            }
        }
    };
    const skipNumbers = () => {
        //do action when skip number button is pressed
        if (isGameStarted && !isGameEnded) {
            //check if game is started and game is not ended
            if (difficultyMode === "speed-mode") {
                //if game difficulty mode is speed mode
                if (!bingoBoard.includes(numbersCalled[0])) {
                    //if the last number called is not in bingo board
                    increaseScore(100); //increase score
                    streak++; //increase streak by 1
                    scoreText.textContent = score.toLocaleString("en-US"); //update score text with commas as a thousand separator
                    callNumbers(); //call the next number
                } else {
                    //if the last number called is in bingo board
                    streak = 0; //reset streak to 0
                }
            }
        }
    };
    const increaseScore = (amount) => {
        //increase score based on various multipliers
        score += Math.round(
            amount *
                comboMultiplier *
                bingoMultiplier *
                timeMultiplier *
                (1 + streak / 10) *
                calledBonus *
                (1 + timeCombo / 10) *
                difficultyMultiplier *
                bingosMadeMultiplier *
                freeSpaceMultiplier,
        ); //round the score to nearest integer
        if (score > bestScore) {
            //if the current score is greater than the best score
            bestScore = score; //set best score to current score
            localStorage.setItem("bestScore", bestScore.toString());
            bestScoreText.textContent = bestScore.toLocaleString("en-US"); //update best score text with commas as a thousand separator
        }
    };
    const increaseScoreBingo = (bingoNumbersCalled) => {
        //increase score based on the number of bingo numbers called
        score = Math.round((score * 75) / bingoNumbersCalled); //round the score to nearest integer
        scoreText.textContent = score.toLocaleString("en-US"); //update score text with commas as a thousand separator
    };
    const markCell = (y, x) => {
        //mark cell on specified cell position
        if (isGameStarted && !isGameEnded) {
            //check if the game is started and not ended
            if (
                numbersCalled.includes(bingoBoard[x - 1][y - 1]) &&
                cellsMarked[x - 1][y - 1] === undefined
            ) {
                //check if numbers called are part of bingo board and cell is not marked
                if (numbersCalled[0] === bingoBoard[x - 1][y - 1]) {
                    //check if the current number called is in the bingo board
                    if (difficultyMode !== "speed-mode") {
                        //if difficulty mode is not speed mode
                        calledBonus = 2; //double the called bonus
                    } else {
                        calledBonus = 1; //don't get double called bonus score if difficulty mode is speed mode
                    }
                    if (
                        (lastCalled === numbersCalled[1] ||
                            (lastCalled === undefined &&
                                numbersCalled.length === 1)) &&
                        difficultyMode !== "speed-mode"
                    ) {
                        //check if the last marked number is marked or if cell marked on the first number called and game difficulty is not speed mode
                        combo++; //increase combo
                    } else {
                        combo = 1; //reset combo to 1
                    }
                } else {
                    calledBonus = 1; //reset called bonus to 1
                    combo = 1; //reset combo to 1
                }
                //calculate time multiplier based on how fast the cell is marked
                if (difficultyMode === "speed-mode") {
                    //check if difficulty mode is speed mode
                    timeMultiplier =
                        1 + 1000 / (performance.now() - timeCalled + 1000); //double the time multiplier
                } else {
                    timeMultiplier =
                        1 +
                        timeBonus /
                            (performance.now() - timeCalled + timeBonus); //set time bonus multiplier based on how fast the user marks the cell
                }
                if (calledBonus === 2) {
                    timeCombo++; //increase time combo
                } else {
                    timeCombo = 0; //reset time combo
                }
                comboMultiplier = combo; //set combo multiplier to combo
                cellsMarked[x - 1][y - 1] = true; //mark the cell
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
                                //check if the last called number is one of the cells marked
                                increaseScore(125); //increase a lot of points
                            } else {
                                increaseScore(5); //else increase a little bit of points
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
                                lastCalled ===
                                    bingoBoard[column + 1][column + 1]
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
                                lastCalled ===
                                    bingoBoard[column + 1][3 - column]
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
                                lastCalled ===
                                    bingoBoard[column + 1][column + 1] ||
                                lastCalled ===
                                    bingoBoard[column + 2][column + 2]
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
                                lastCalled ===
                                    bingoBoard[column + 1][3 - column] ||
                                lastCalled ===
                                    bingoBoard[column + 2][2 - column]
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
                                lastCalled ===
                                    bingoBoard[column + 1][column + 1] ||
                                lastCalled ===
                                    bingoBoard[column + 2][column + 2] ||
                                lastCalled ===
                                    bingoBoard[column + 3][column + 3]
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
                                lastCalled ===
                                    bingoBoard[column + 1][3 - column] ||
                                lastCalled ===
                                    bingoBoard[column + 2][2 - column] ||
                                lastCalled ===
                                    bingoBoard[column + 3][1 - column]
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
                    .querySelector(`#cell-${y}-${x}`).textContent = ""; //mark the cell on the bingo board
                checkBingos(); //check for bingos
                streak++; //increase streak
                scoreText.textContent = score.toLocaleString("en-US"); //update score text with commas as a thousand separator
                if (difficultyMode === "speed-mode") {
                    callNumbers(); //call numbers
                }
                if (
                    cellsMarked.every((row) =>
                        row.every((cell) => cell !== undefined),
                    ) &&
                    isGameStarted &&
                    !isGameEnded
                ) {
                    //if all cells are marked and game is started and game is not ended, end the game
                    isGameStarted = false; //set is game started to false
                    isGameEnded = true; //set is game ended to true
                    startButton.disabled = false; //enable the start button
                    easyButton.disabled = false; //enable easy difficulty button
                    mediumButton.disabled = false; //enable medium difficulty button
                    hardButton.disabled = false; //enable hard difficulty button
                    speedButton.disabled = false; //enable speed mode difficulty button
                    skipNumberButton.disabled = true; //disable skip number button
                    freeSpaceButton.disabled = false; //enable free space button
                    increaseScoreBingo(bingo1Count); //get bonus points based on the number of bingo numbers called for a bingo
                    increaseScoreBingo(bingo2Count);
                    increaseScoreBingo(bingo3Count);
                    increaseScoreBingo(bingo4Count);
                    increaseScoreBingo(bingo5Count);
                    increaseScoreBingo(bingo6Count);
                    increaseScoreBingo(bingo7Count);
                    increaseScoreBingo(bingo8Count);
                    increaseScoreBingo(bingo9Count);
                    increaseScoreBingo(bingo10Count);
                    increaseScoreBingo(blackoutBingoCount);
                }
            } else if (cellsMarked[x - 1][y - 1] === undefined) {
                //reset streak and combo if cell is clicked when number is not called yet
                streak = 0;
                combo = 0;
            }
        }
    };
    const checkBingos = () => {
        lastBingoCount = bingos;
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
        bingosMadeMultiplier = Math.max(1, bingos - lastBingoCount); //calculate the number of bingos made when a cell is marked
        while (bingoCount < bingos) {
            //loop for bingo counts to make sure to increase score once for each bingo
            bingoCount++;
            switch (bingoCount) {
                case 1:
                    increaseScore(1000); //increase score for each bingo
                    bingo1Count = 75 - numbersLeft; //calculate how many bingo numbers called for first bingo
                    break;
                case 2:
                    increaseScore(1250); //increase even more points for more bingos
                    bingo2Count = 75 - numbersLeft;
                    break;
                case 3:
                    increaseScore(1500);
                    bingo3Count = 75 - numbersLeft;
                    break;
                case 4:
                    increaseScore(2000);
                    bingo4Count = 75 - numbersLeft;
                    break;
                case 5:
                    increaseScore(2500);
                    bingo5Count = 75 - numbersLeft;
                    break;
                case 6:
                    increaseScore(3000);
                    bingo6Count = 75 - numbersLeft;
                    break;
                case 7:
                    increaseScore(4000);
                    bingo7Count = 75 - numbersLeft;
                    break;
                case 8:
                    increaseScore(5000);
                    bingo8Count = 75 - numbersLeft;
                    break;
                case 9:
                    increaseScore(6000);
                    bingo9Count = 75 - numbersLeft;
                    break;
                case 10:
                    increaseScore(8000);
                    bingo10Count = 75 - numbersLeft;
                    break;
                case 12:
                    increaseScore(10000);
                    blackoutBingoCount = 75 - numbersLeft;
                    break;
            }
        }
    };
};
game();
