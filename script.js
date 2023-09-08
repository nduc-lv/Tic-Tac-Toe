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
    const setName = function(name){
        playerName = name;
    }
    return {
        getName,
        getToken,
        setName,
    }
}
// GameController controls the flow of the game
function GameController (){
    let board = Gameboard();
    let player1 = Player("Player 1", "X");
    let player2 = Player("Player 2", "O");
    //only one player can play per during his round;
    let activePlayer = player1;
    const setPlayerName = function (player, name){
        if (player == "player1"){
            player1.setName(name);
        }
        else{
            player2.setName(name);
        }
    }
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
    
    //decide who win
    const getWinner = function (){
        let gameBoard = board.getBoard();
        let currentPlayer = getActivePlayer();
        let currentToken = currentPlayer.getToken();
        let count = 0; //count how many consecutive tokens
        //check for every row
        for (let row = 0; row < 3; row++){
            count = 0;
            for (let col = 0; col < 3; col++){
                let cellValue = gameBoard[row][col].getCell();
                if (cellValue == currentToken){
                    count++;
                }
                else{
                    //move to new row
                    break;
                }
            }
            if (count == 3){
                return currentPlayer //winner
            }
        }
        //check for every column
        for (let col = 0; col < 3; col++){
            count = 0;
            for (let row = 0; row < 3; row++){
                let cellValue = gameBoard[row][col].getCell();
                if (cellValue == currentToken){
                    count++;
                }
                else{
                    //move to new col
                    break;
                }
            }
            if (count == 3){
                return currentPlayer //winner
            }
        }
        //check for the first diagonal
        count = 0;
        let row = 0;
        let col = 0;
        for (let offset = 0; offset < 3; offset++){
            let cellValue = gameBoard[row + offset][col + offset].getCell();
            if (cellValue == currentToken){
                count++;
            }
            else{
                break;
            }
        }
        if (count == 3){
            return currentPlayer;
        }

        //check for the second diagonal
        count = 0;
        row = 0;
        col = 2;
        for (let offset = 0; offset < 3; offset++){
            let cellValue = gameBoard[row + offset][col - offset].getCell();
            if (cellValue == currentToken){
                count++;
            }
            else{
                break;
            }
        }
        if (count == 3){
            return currentPlayer;
        }

        //check for a tie
        for (let row = 0; row < 3; row++){
            for (let col = 0; col < 3; col++){
                let cellValue = gameBoard[row][col].getCell();
                if (cellValue == "0"){
                    return;
                }
            }
        }
        return Player("Tie", "0");
    }

    //play one round of the game
    const playRound = function (cellRow, cellCol){
        let currentPlayer = getActivePlayer();
        board.setBoard(cellRow, cellCol, currentPlayer.getToken());
        //print the board;
        printGame();
        let winner = getWinner();
        if (winner){
            console.log(`Winner is ${winner.getName()}`);
            return winner;
        }
        switchPlayer();
        return;
    }
    //print game for the first time
    printGame();

    return {
        playRound,
        //gameBoard for accessing board state.
        gameBoard: board.getBoard(),
        getActivePlayer,
        setPlayerName,
    }
}

//MAKE THE EXTERIOR OF THE GAME
//dipslay controller
(function () {
    let game = GameController();
    let board = game.gameBoard;
    let body = document.querySelector("body");
    let boardDiv = document.createElement("div");
    let playerTurn = document.createElement("div");
    let form = document.querySelector("form");
    let start = document.querySelector('[value="start"]');
    let restartButton = document.createElement("button");
    let dialog = document.querySelector("dialog");

    restartButton.value = "restart";
    restartButton.textContent = "Restart";
    restartButton.classList.add("restart-board");
    playerTurn.classList.add("player-turn");
    boardDiv.classList.add("board");
    
    //render the board on the page
    const renderBoard = function () {
        playerTurn.textContent = `${game.getActivePlayer().getName()}'s turn`;
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
    //display winner
    const displayWinner = function (winner){
        //reset the game
        dialog.showModal();
        //announce the winner
        let gameOver = document.querySelector(".game-over");
        if (winner.getName() != "Tie"){
          gameOver.textContent = `${winner.getName()} wins!!!`;  
        }
        else{
            gameOver.textContent = `${winner.getName()}!!!`;
        }
    }
    //play one round
    const playRound = function (event){
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
        let winner = game.playRound(row, col);
        dialog.addEventListener("click", restart);

        //check if there's a winner
        if (winner){
            displayWinner(winner);
        }
        //clear the board every turn
        boardDiv.textContent = "";
        renderBoard();
    }
    
    const restart = function (event){
        let button = event.target;
        console.log(button);
        if (button.value == "restart"){
            //reset the game
            game = GameController();
            board = game.gameBoard;
            //render new game
            boardDiv.textContent = "";
            renderBoard();
        }
    }

    //Add event listener

    //make dialog close when click restart
    dialog.addEventListener("click", (event) => {
        restart(event);
        //close modal
        dialog.close();
    });
    //start the game if the user click start
    start.addEventListener("click", (e) => {
        e.preventDefault();
        form.style.display = "none";
        body.appendChild(restartButton);
        body.appendChild(playerTurn);
        body.appendChild(boardDiv);
        renderBoard();
    });
    //change player name
    form.addEventListener("change", function(){
        let name1 = document.querySelector("#player-1").value;
        let name2 = document.querySelector("#player-2").value;
        if (name1 == ""){
            name1= "Player 1";
        }
        if (name2 == ""){
            name2 = "Player 2";
        }
        game.setPlayerName("player1", name1);
        game.setPlayerName("player2", name2);
    })
    //play the game
    boardDiv.addEventListener("click", playRound);
    //restart the game during a round
    restartButton.addEventListener("click", restart);
})()