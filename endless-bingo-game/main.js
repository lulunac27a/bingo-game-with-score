const game = () => {
    let score;
    let isGameStarted = false;
    let isGameEnded = false;
    let lastCalled;
    let bingoMultiplier;
    let timeMultiplier;
    let timeCalled;
    let cellsMarked;
    let streak;
    let bingoBoard;
    let time;
    let timeLimit = 60;
    let startButton = document.getElementById("start-button");
    let bingoTable = document.getElementById("bingo-table");
    let timeText = document.getElementById("time");
    let scoreText = document.getElementById("score");
    let numberCalled = document.getElementById("number-called");
    let time60SecondsButton = document.getElementById("60-seconds");
    let time120SecondsButton = document.getElementById("120-seconds");
    let time180SecondsButton = document.getElementById("180-seconds");
    let time300SecondsButton = document.getElementById("300-seconds");
    let skipNumberButton = document.getElementById("skip-number");
    time60SecondsButton.addEventListener("click", setTime.bind(null, 60));
    time120SecondsButton.addEventListener("click", setTime.bind(null, 120));
    time180SecondsButton.addEventListener("click", setTime.bind(null, 180));
    time300SecondsButton.addEventListener("click", setTime.bind(null, 300));
    startButton.addEventListener("click", startGame);
    skipNumberButton.addEventListener("click", skipNumbers);
    for (let row = 0; row < 5; row++) {
        for (let column = 0; column < 5; column++) {
            bingoTable.rows[row + 1].cells[column].addEventListener("click", markCell.bind(null, row + 1, column + 1));
        }
    }
    function setTime(seconds) {
        timeLimit = seconds;
        timeText.innerText = seconds;
    }
    function startGame() {
        score = 0;
        scoreText.innerText = 0;
        timeCalled = performance.now();
        timeMultiplier = 1;
        bingoMultiplier = 1;
        time = timeLimit;
        streak = 0;
        bingoBoard = [];
        cellsMarked = [];
        startButton.disabled = true;
        time60SecondsButton.disabled = true;
        time120SecondsButton.disabled = true;
        time180SecondsButton.disabled = true;
        time300SecondsButton.disabled = true;
        skipNumberButton.disabled = false;
        isGameStarted = true;
        for (let i = 0; i < 5; i++) {
            let columnNumbers = [];
            let j = 0;
            while (j < 5) {
                let cellNumber = Math.floor(Math.random() * 5) + i * 5 + 1;
                if (!columnNumbers.includes(cellNumber)) {
                    columnNumbers.push(cellNumber);
                    bingoTable.querySelector(`#row-${j + 1}`).querySelector(`#cell-${j + 1}-${i + 1}`).innerText = cellNumber;
                    j++;
                }
            }
            cellsMarked.push(Array(5).fill(undefined));
            bingoBoard.push(columnNumbers);
        }
        callNumbers();
        setInterval(updateTime, 1000);
    }
    function skipNumbers() {
        let cellInBoard = false;
        for (let i = 0; i < 5; i++) {
            if (bingoBoard[i].includes(lastCalled)) {
                cellInBoard = true;
            }
        }
        if (cellInBoard) {
            streak = 0;
        }
        else {
            increaseScore(100);
            streak++;
            callNumbers();
        }
    }
    function updateTime() {
        if (time > 0) {
            time--;
            timeText.innerText = time;
        }
        else {
            isGameStarted = false;
            isGameEnded = true;
            startButton.disabled = false;
            time60SecondsButton.disabled = false;
            time120SecondsButton.disabled = false;
            time180SecondsButton.disabled = false;
            time300SecondsButton.disabled = false;
            skipNumberButton.disabled = true;
        }
    }
    function markCell(y, x) {
        if (isGameStarted && !isGameEnded) {
            if (lastCalled === bingoBoard[x - 1][y - 1]) {
                increaseScore(100);
                bingoTable.querySelector(`#row-${y}`).querySelector(`#cell-${y}-${x}`).innerText = "";
                streak++;
                timeCalled = performance.now();
                cellsMarked[x - 1][y - 1] = true;
                bingoBoard[x - 1][y - 1] = undefined;
                checkBingos();
                callNumbers();
            }
            else {
                streak = 0;
            }
        }
    }
    function callNumbers() {
        let newLastCalled;
        let sameNumber = false;
        while (!sameNumber) {
            newLastCalled = Math.floor(Math.random() * 25) + 1;
            if (newLastCalled !== lastCalled) {
                sameNumber = true;
            }
        }
        lastCalled = newLastCalled;
        numberCalled.innerText = lastCalled;
    }
    function generateBingoNumber(x, y) {
        let numberCell;
        let cellNumber = Math.floor(Math.random() * 5) + x * 5 + 1;
        numberCell = cellNumber;
        let i = 0;
        while (i < 5) {
            if (bingoBoard[x][i] === cellNumber) {
                i = 0;
                cellNumber = Math.floor(Math.random() * 5) + x * 5 + 1;
                numberCell = cellNumber;
            }
            else {
                i++;
            }
        }

        bingoBoard[x][y] = numberCell;
        cellsMarked[x][y] = undefined;
        bingoTable.querySelector(`#row-${y + 1}`).querySelector(`#cell-${y + 1}-${x + 1}`).innerText = numberCell;
    }
    function checkBingos() {
        for (i = 0; i < 5; i++) {
            if (((cellsMarked[i][0] === true && cellsMarked[i][1] === true) && (cellsMarked[i][2] === true && cellsMarked[i][3] === true)) && cellsMarked[i][4] === true) {
                bingoMultiplier++;
                generateBingoNumber(i, 0);
                generateBingoNumber(i, 1);
                generateBingoNumber(i, 2);
                generateBingoNumber(i, 3);
                generateBingoNumber(i, 4);
            }
            if (((cellsMarked[0][i] === true && cellsMarked[1][i] === true) && (cellsMarked[2][i] === true && cellsMarked[3][i] === true)) && cellsMarked[4][i] === true) {
                bingoMultiplier++;
                generateBingoNumber(0, i);
                generateBingoNumber(1, i);
                generateBingoNumber(2, i);
                generateBingoNumber(3, i);
                generateBingoNumber(4, i);
            }
            if (((cellsMarked[0][0] === true && cellsMarked[1][1] === true) && (cellsMarked[2][2] === true && cellsMarked[3][3] === true)) && cellsMarked[4][4] === true) {
                bingoMultiplier++;
                generateBingoNumber(0, 0);
                generateBingoNumber(1, 1);
                generateBingoNumber(2, 2);
                generateBingoNumber(3, 3);
                generateBingoNumber(4, 4);
            }
            if (((cellsMarked[0][4] === true && cellsMarked[1][3] === true) && (cellsMarked[2][2] === true && cellsMarked[3][1] === true)) && cellsMarked[4][0] === true) {
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
        score += Math.round(amount * bingoMultiplier * (1 + streak / 20) * timeMultiplier);
        scoreText.innerText = score.toLocaleString("en-US");
    }
}
game();