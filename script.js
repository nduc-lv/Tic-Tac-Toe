// Make the core of the game

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
let game = GameController();