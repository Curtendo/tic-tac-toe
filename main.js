function Gameboard () {
    const rows = 3;
    const columns = 3;

    function createGameboard() {
        const board = [];
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(null);
            }
        }
        return board;
    }

    const board = createGameboard();

    const getBoard = () => board;

    const updateCell = (row, column, symbol) => {
        board[row][column] = symbol;
    }

    return { getBoard, updateCell, };
}

// Player object
function Players(playerOneName = "Player 1", playerTwoName = "Player 2") {
    const players = [
        {
            name: playerOneName,
            symbol: "X",
            wins: 0
        },
        {
            name: playerTwoName,
            symbol: "O",
            wins: 0
        }
    ]

    const getPlayers = () => players;

    return { getPlayers };
}

// All game handling logic
function GameController() {
    const playersFactory = Players();
    const players = playersFactory.getPlayers();
    let board = Gameboard();

    const getBoard = () => board.getBoard();

    const updatePlayerNames = (playerOneName = "Player One", playerTwoName = "Player Two") => {
        console.log({playerOneName, playerTwoName})
        players[0].name = playerOneName;
        players[1].name = playerTwoName;
    }

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const resetGame = () => {
        board = Gameboard();
    };

    function CheckWinner() {
        const currentBoard = board.getBoard();
        const XO = activePlayer.symbol;

        // Check for horizontal winner
        const horizontal = () => {
            return currentBoard.some(row => row.every(cell => cell === XO));
        }

        // Check for vertical winner
        const vertical = () => {
            return currentBoard.some((whatever, columnIndex) => 
            currentBoard.every(row => row[columnIndex] === XO))
        }

        // Check for diagonal winner
        const diagonal = () => {
            if ((currentBoard[0][0] === XO && currentBoard[1][1] === XO && currentBoard[2][2] === XO) || 
                (currentBoard[0][2] === XO && currentBoard[1][1] === XO && currentBoard[2][0] === XO)) {
                return true;
            }
            return false;
        }
        
        return { horizontal, vertical, diagonal };
    }

    let winnerResult;
    const getWinnerResult = () => winnerResult;

    let isValidMove;
    const getIsValidMove = () => isValidMove;

    let isTie;
    const getIsTie = () => isTie;

    const playRound = function(row, column) {
        const currentBoard = board.getBoard();
        const cell = currentBoard[row][column];
        const checkWinner = CheckWinner();

        isValidMove = null;
        winnerResult = null;
        isTie = null;

        if (cell !== null) {
            isValidMove = false;
            return;
        } else {
            board.updateCell(row, column, activePlayer.symbol);
            isValidMove = true;

            // Winner
            if (checkWinner.horizontal() || checkWinner.vertical() || checkWinner.diagonal()) {
                winnerResult = activePlayer.name
                activePlayer.wins += 1;
            // Tie
            } else if (!currentBoard.some(row => row.includes(null))) {
                isTie = true;
            }
            switchPlayerTurn();
        }
    }

    return { updatePlayerNames,
        getActivePlayer, 
        playRound, 
        getBoard,
        getPlayers: playersFactory.getPlayers,
        getWinnerResult,
        getIsValidMove,
        getIsTie,
        resetGame
    };
}

// All UI interactments
function DisplayController() {
    let game = GameController();
    let players = game.getPlayers();

    const gameboardDiv = document.querySelector(".gameboard");
    const playerOneDiv = document.querySelector(".player-one");
    const playerTwoDiv = document.querySelector(".player-two");
    const inGameMessageDiv = document.querySelector(".in-game-message");
    const gameResultModal = document.querySelector("#game-result");
    const modalHeader = document.querySelector("#modal-header");
    const playerOneScoreSpan = document.querySelector(".player-one-score");
    const playerTwoScoreSpan = document.querySelector(".player-two-score");
    const playAgainButton = document.querySelector("#play-again");
    const startGameModal = document.querySelector("#game-start");
    const startGameForm = document.querySelector("#name-form");

    const moveMessages = [
        "Nice move!",
        "Oh, you went there?",
        "What's gonna happen next?!",
        "I didn't think of that!",
        "This is so intense!",
        "Did you even think?",
        "Wow!",
        "Maybe you should ask you're mommy for help?",
        "You can do it!",
        "What was that for???",
        "Unbelieveable!!!",
        "How is your brain so awesome?",
        "Well, OK then...",
    ]

    const updateGameboard = () => {
        // Get rid of all child elements
        gameboardDiv.textContent = "";

        // Highlight active player
        const activePlayer = game.getActivePlayer();
        if (activePlayer === players[0]) {
            playerOneDiv.classList.add("active-player");
            playerTwoDiv.classList.remove("active-player");
        } else {
            playerOneDiv.classList.remove("active-player");
            playerTwoDiv.classList.add("active-player");
        }

        const currentBoard = game.getBoard();

        currentBoard.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("square");
                
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell;
                gameboardDiv.appendChild(cellButton);
            })
        })
    }

    const showModalStart = () => {
        startGameModal.showModal();
    }

    const showModalWinner = () => {
        modalHeader.textContent = `${game.getActivePlayer().name} has won!`;
        playerOneScoreSpan.textContent = players[0].wins;
        playerTwoScoreSpan.textContent = players[1].wins;
        gameResultModal.showModal();
    }

    const showModalTie = () => {
        modalHeader.textContent = `Tie game!`;
        gameResultModal.showModal();
    }

    const updateMoveMessage = (validity) => {
        if (validity) {
            // Pulls random message from message array
            const index = Math.floor(Math.random() * moveMessages.length);
            inGameMessageDiv.textContent = moveMessages[index];
        } else {
            inGameMessageDiv.textContent = "You can't go there. Try again."
        }
    }

    function clickHandlerBoard(e) {
        if (e.target.classList.contains("square")) {
            const selectedRow = e.target.dataset.row;
            const selectedColumn = e.target.dataset.column;

            game.playRound(selectedRow, selectedColumn);
            updateGameboard();

            if (game.getWinnerResult()) {
                showModalWinner();
            } else if (game.getIsTie()) {
                showModalTie();
            } else {
                updateMoveMessage(game.getIsValidMove());
            }
            
        }
    }

    function clickHandlerPlayAgain() {
        game.resetGame();
        updateGameboard();
        gameResultModal.close();
    }

    function clickHandlerStartGame(e) {
        e.preventDefault();
        let playerOneName = document.querySelector("#player-one-input").value;
        let playerTwoName = document.querySelector("#player-two-input").value;

        playerOneName = playerOneName === "" ? undefined : playerOneName;
        playerTwoName = playerTwoName === "" ? undefined : playerTwoName;

        game.updatePlayerNames(playerOneName, playerTwoName);

        // Updates onscreen names
        const playerOneDiv = document.querySelector(".player-one");
        const playerTwoDiv = document.querySelector(".player-two");

        playerOneDiv.textContent = game.getPlayers()[0].name;
        playerTwoDiv.textContent = game.getPlayers()[1].name;

        // Updates names on end game modal
        const playerOneNameSpan = document.querySelector(".player-one-name");
        const playerTwoNameSpan = document.querySelector(".player-two-name");

        playerOneNameSpan.textContent = game.getPlayers()[0].name;
        playerTwoNameSpan.textContent = game.getPlayers()[1].name;

        startGameModal.close();
    }

    gameboardDiv.addEventListener("click", clickHandlerBoard);
    playAgainButton.addEventListener("click", clickHandlerPlayAgain);
    startGameForm.addEventListener("submit", clickHandlerStartGame);


    updateGameboard();
    showModalStart();
}

DisplayController();