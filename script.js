// MAKE THE CORE OF THE GAME

// Board object to store the state of the game
function Gameboard(){
    // create a 2D-array representing the game board
    let board = [];
    for (let rowIndex = 0; rowIndex < 3; rowIndex++){
        let row = []
        for (let columnIndex = 0; columnIndex < 3; columnIndex++){
            row.push(Cell()) //board consists of multiple celss
        }
        board.push(row);
    }

    // return the board for displaying
    const getBoard = function () {
        return board;
    }

    // update the state of the board when there's a move
    const setBoard = function (cellRow, cellCol, token) {
        let cell = board[cellRow][cellCol];
        cell.setCell(token);
    }
    return {
        getBoard,
        setBoard,
    }
}
// Cell object to store the state of a specific cell 
function Cell (){
    let value = "0";
    const setCell = function (token){
        value = token;
    }
    const getCell = function (){
        return value;
    }
    return {
        setCell,
        getCell,
    }
}
// Player with player's name and player's token (X / O) 
function Player(name, token){
    let playerName = name;
    let playerToken = token;
    const getName = function(){
        return playerName;
    }
    const getToken = function(){
        return playerToken;
    }
    return {
        getName,
        getToken,
    }
}
// GameController controls the flow of the game
function GameController (){
    let board = Gameboard();
    let player1 = Player("Player 1", "X");
    let player2 = Player("Player 2", "O");
    //only one player can play per during his round;
    let activePlayer = player1;

    //need to know who's turn to play
    const getActivePlayer = function (){
        return activePlayer;
    }
    //switch turn between each round
    const switchPlayer = function (){
        activePlayer = activePlayer == player1 ? player2 : player1;
    }

    //print the board after each turn
    const printGame = function (){
        console.log(board.getBoard());
    }

    //play one round of the game
    const playRound = function (cellRow, cellCol){
        let currentPlayer = getActivePlayer();
        board.setBoard(cellRow, cellCol, currentPlayer.getToken());
        
        switchPlayer();
        //print the board;
        printGame();
    }
    //print game for the first time
    printGame();

    return {
        playRound,
        //gameBoard for accessing board state.
        gameBoard: board.getBoard(),
    }
}

//dipslay controller
(function () {
    let game = GameController();
    let board = game.gameBoard;
    let body = document.querySelector("body");
    let boardDiv = document.createElement("div");
    boardDiv.classList.add("board");
    body.appendChild(boardDiv);
    //render the board on the page
    const renderBoard = function () {
        //loop through every cell and display the content
        for (let row = 0; row < 3; row++){
            for (let col = 0; col < 3; col++){
                let cell = board[row][col];
                let cellDiv = document.createElement("div");
                cellDiv.classList.add("cell");
                cellDiv.dataset.row = row;
                cellDiv.dataset.col = col;
                cellDiv.textContent = cell.getCell() != "0" ? cell.getCell() : "";
                boardDiv.appendChild(cellDiv);
            }
        }
    }
    renderBoard();
    //get the user's action
    const getUserAction = function (event){
        let cell = event.target;
        //check if the cell valid
        if (!cell.dataset){
            return;
        }
        //get the position of the cell
        let row = cell.dataset.row;
        let col = cell.dataset.col;
        //check if the cell is free
        if (board[row][col].getCell() != "0"){
            return;
        }
        console.log(board[row][col].getCell());
        //play one round
        game.playRound(row, col);
        //clear the board every turn
        boardDiv.textContent = "";
        renderBoard();
    }
    //make the board listen for user's action
    boardDiv.addEventListener("click", getUserAction);
})()