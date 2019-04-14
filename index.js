/**
* This program is a boilerplate code for the standard tic tac toe game
* Here the “box” represents one placeholder for either a “X” or a “0”
* We have a 2D array to represent the arrangement of X or O is a grid
* 0 -> empty box
* 1 -> box with X
* 2 -> box with O
*
* Below are the tasks which needs to be completed:
* Imagine you are playing with the computer so every alternate move should be done by the computer
* X -> player
* O -> Computer
*
* Winner needs to be decided and has to be flashed
*
* Extra points will be given for approaching the problem more creatively
* 
*/

let grid = [];
const GRID_LENGTH = 3;
let turn = 'X';
let playerName = 'Tic Tac Toe Master'
const GAME_OVER = 'over';
const GAME_TIE = 'tie';
const GAME_CONTINUE = 'continue';
const COMPUTER_WON_TEXT = 'Computer Won!';
const GAME_TIED_TEXT = 'Game Tied';
const PLAYER_KEY = 1;
const COMPUTER_KEY = 2;

function initializeGrid() {
    grid = []
    for (let colIdx = 0;colIdx < GRID_LENGTH; colIdx++) {
        const tempArray = [];
        for (let rowidx = 0; rowidx < GRID_LENGTH;rowidx++) {
            tempArray.push(0);
        }
        grid.push(tempArray);
    }
}

function getRowBoxes(colIdx) {
    let rowDivs = '';
    
    for(let rowIdx=0; rowIdx < GRID_LENGTH ; rowIdx++ ) {
        let additionalClass = 'darkBackground';
        let content = '';
        const sum = colIdx + rowIdx;
        if (sum%2 === 0) {
            additionalClass = 'lightBackground'
        }
        const gridValue = grid[colIdx][rowIdx];
        if(gridValue === 1) {
            content = '<span class="cross">X</span>';
        }
        else if (gridValue === 2) {
            content = '<span class="cross">O</span>';
        }
        rowDivs = rowDivs + '<div colIdx="'+ colIdx +'" rowIdx="' + rowIdx + '" class="box ' +
            additionalClass + '">' + content + '</div>';
    }
    return rowDivs;
}

function getColumns() {
    let columnDivs = '';
    for(let colIdx=0; colIdx < GRID_LENGTH; colIdx++) {
        let coldiv = getRowBoxes(colIdx);
        coldiv = '<div class="rowStyle">' + coldiv + '</div>';
        columnDivs = columnDivs + coldiv;
    }
    return columnDivs;
}

function renderMainGrid() {
    const parent = document.getElementById("grid");
    const columnDivs = getColumns();
    parent.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';
}

function colorWinningBoxes(data) {
    if (data.type === 'row') {
        for (let i = 0; i < GRID_LENGTH; i++) {
            let box = document.querySelectorAll("[colidx='" + data.index + "'][rowidx='" + i + "']")[0]
            box.style.backgroundColor = 'green';
        }
    } else if (data.type === 'col') {
        for (let i = 0; i < GRID_LENGTH; i++) {
            let box = document.querySelectorAll("[colidx='" + i + "'][rowidx='" + data.index + "']")[0]
            box.style.backgroundColor = 'green';
        }

    } else if (data.type === 'diag') {
        for (let i = 0; i < GRID_LENGTH; i++) {
            let box = document.querySelectorAll("[colidx='" + i + "'][rowidx='" + i + "']")[0]
            box.style.backgroundColor = 'green';
        }
    } else if (data.type === 'oppDiag') {
        let j = GRID_LENGTH - 1;
        for (let i = 0; i < GRID_LENGTH; i++) {
            let box = document.querySelectorAll("[colidx='" + i + "'][rowidx='" + j-- + "']")[0]
            box.style.backgroundColor = 'green';
        }
    }
}

function onBoxClick() {
    var rowIdx = this.getAttribute("rowIdx");
    var colIdx = this.getAttribute("colIdx");
    if (grid[colIdx][rowIdx] === 0) {
        grid[colIdx][rowIdx] = PLAYER_KEY;
        let gameStatus = checkGameState()
        if (gameStatus.status === GAME_OVER || gameStatus.status === GAME_TIE) {
            renderMainGrid();
            editClickHandlers('remove');
            if (gameStatus.status === GAME_OVER) {
                colorWinningBoxes(gameStatus);
            }
            return;
        }
        let computerMove = computerTurn();
        if (computerMove) {
            grid[computerMove.rowIdx][computerMove.colIdx] = COMPUTER_KEY;
        }
        gameStatus = checkGameState();
        if (gameStatus.status === GAME_OVER || gameStatus.status === GAME_TIE) {
            renderMainGrid();
            editClickHandlers('remove');

            if (gameStatus.status === GAME_OVER) {
                colorWinningBoxes(gameStatus);
            }
            return;
        }
        renderMainGrid();
        editClickHandlers();
    } else {
        alert('click on empty cell');
    }
}

function computerTurn() {
    let possibleMoves = [];
    for (let i = 0; i < GRID_LENGTH; i++) {
        for (let j = 0; j < GRID_LENGTH; j++) {
            if (grid[i][j] === 0) {
                possibleMoves.push({
                    rowIdx: i,
                    colIdx: j
                });
            }
        }
    }
    return possibleMoves[Math.floor((Math.random() * possibleMoves.length))];
}

function checkGameState() {
    let count;
    let status;
    let countColumns;
    let countDiagonal = 0;
    let countOppositeDiagonal = 0;
    let totalCount = 0;

    for (let i = 0; i < GRID_LENGTH; i++) {
        count = 0;
        countColumns = 0;

        for (let j = 0; j < GRID_LENGTH; j++) {

            // Check rows.
            if (grid[i][0] !== 0) {
                if (grid[i][0] === grid[i][j]) {
                    count++;
                }
            }

            // Check columns.
            if (grid[0][i] !== 0) {
                if (grid[0][i] === grid[j][i]) {
                    countColumns++;
                }
            }

            // Check diagonal.
            if (grid[0][0] !== 0 && i == j && grid[0][0] === grid[i][j]) {
                countDiagonal++;
            }

            // Check oppositte diagonal.
            if (grid[0][GRID_LENGTH - 1] !== 0 && i + j === GRID_LENGTH - 1 && grid[0][GRID_LENGTH - 1] === grid[i][j]) {
                countOppositeDiagonal++;
            }
            //increase total count to check for tie
            if (grid[i][j]) {
                totalCount++;
            }

        }

        if (count === GRID_LENGTH) {
            status = {
                status: GAME_OVER,
                type: 'row',
                index: i,
                gridValue: grid[i][0]
            }
            showGameOverMessage(status)
            return status;
        }

        if (countColumns === GRID_LENGTH) {
            status = {
                status: GAME_OVER,
                type: 'col',
                index: i,
                gridValue: grid[0][i]

            }
            showGameOverMessage(status)
            return status;
        }

        if (countDiagonal === GRID_LENGTH) {
            status = {
                status: GAME_OVER,
                type: 'diag',
                index: 0,
                gridValue: grid[0][0]

            }
            showGameOverMessage(status)
            return status;
        }

        if (countOppositeDiagonal === GRID_LENGTH) {
            status = {
                status: GAME_OVER,
                type: 'oppDiag',
                index: GRID_LENGTH - 1,
                gridValue: grid[0][GRID_LENGTH - 1]
            }
            showGameOverMessage(status)
            return status;
        }
    }


    if (totalCount == GRID_LENGTH * GRID_LENGTH) {
        status = {
            status: GAME_TIE
        };
        showGameOverMessage(status)
        return status;
    }

    return {
        status: GAME_CONTINUE
    }
}

function showGameOverMessage(gameStatus) {
    let message = document.getElementById('message');
    message.style.display = 'block';
    message.textContent = COMPUTER_WON_TEXT;

    if (gameStatus.status === GAME_TIE) {
        message.textContent = GAME_TIED_TEXT;
    } else if (gameStatus.status === GAME_OVER && gameStatus.gridValue === PLAYER_KEY) {
        message.textContent = playerName + ' won!';
    }
}

function getPlayerName() {
    let name = prompt('Enter player name', playerName)
    if (name !== null) {
        playerName = name
    }
}

function editClickHandlers(listener = 'add') {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        if (listener === 'add')
            boxes[idx].addEventListener('click', onBoxClick, false);
        else 
            boxes[idx].removeEventListener('click', onBoxClick, false); 
    }
}

function reset() {
    initializeGrid();
    renderMainGrid();
    editClickHandlers();

    let message = document.getElementById('message');
    message.style.display = 'none';
};

function startGame() {
    getPlayerName();
    initializeGrid();
    renderMainGrid();
    editClickHandlers();
}

startGame()

