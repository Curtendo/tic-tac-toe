function Gameboard () {
    // Gameboard
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

    // Print board to console
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell));
        console.log(boardWithCellValues);
    };

    const updateCell = (row, column, symbol) => {
        board[row][column] = symbol;
    }

    return { getBoard, printBoard, updateCell };
}

function Players(playerOneName = "Player 1", playerTwoName = "Player 2") {
    const players = [
        {
            name: playerOneName,
            symbol: "X"
        },
        {
            name: playerTwoName,
            symbol: "O"
        }
    ]

    const getPlayers = () => players;

    return { getPlayers };
}

function GameController() {
    const playersFactory = Players();
    const players = playersFactory.getPlayers();
    const board = Gameboard();
    const currentBoard = board.getBoard();

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const printNewRound = () => {
        board.printBoard();
        console.log(`It is now ${activePlayer.name}'s turn.`);
    }

    function CheckWinner() {
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

    const playRound = function(row, column) {
        const cell = currentBoard[row][column];
        const checkWinner = CheckWinner();

        if (cell !== null) {
            console.log("This square has already been marked. Try again.");
            return;
        } else {
            board.updateCell(row, column, activePlayer.symbol);
            console.log(`${activePlayer.symbol} has been marked on row ${row}, column ${column}.`)

            if (checkWinner.horizontal() || checkWinner.vertical() || checkWinner.diagonal()) {
                board.printBoard();
                console.log(`${activePlayer.name} is the winner!`);
            } else if (!currentBoard.some(row => row.includes(null))) {
                board.printBoard();
                console.log("The game has ended in a tie!");
            } else {
                switchPlayerTurn();
                printNewRound();
            }
        }
    }

    printNewRound();

    return { getActivePlayer, playRound };
}

const game = GameController();