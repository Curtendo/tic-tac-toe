function Gameboard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    // Makes 2D array to store game cells
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    // Gets board for UI to generate
    const getBoard = () => board;

    const markIt = (row, column, player) => {
        

        board[row][column].addMark(player);
    }

    // Print board to console
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return { getBoard, markIt, printBoard };
}

function Cell() {
    let value = null;

    const addMark = (player) => {
        value = player;
    }

    const getValue = () => value;

    return { addMark, getValue };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();
    const currentBoard = board.getBoard();

    const players = [
        {
        name: playerOneName,
        mark: "X"
        },
        {
        name: playerTwoName,
        mark: "O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const checkWinner = () => {
        const currentMark = getActivePlayer().mark;
        const allEqual = arr => arr.every(val => {
            console.log({val});
            return val === currentMark;
        });
        const result = allEqual(currentBoard);
        console.log(result);
    }

    const playRound = (row, column) => {
        // Mark a cell for the current player
        if (currentBoard[row][column].getValue()) {
            console.log("Square already marked!");
            return;
        } else {
            console.log(
                `Marking ${getActivePlayer().name}'s ${getActivePlayer().mark} on row ${row}, column ${column}...`
                );
                board.markIt(row, column, getActivePlayer().mark);
        
                /*  This is where we would check for a winner and handle that logic,
                    such as a win message. */
                checkWinner();
                // Switch player turn
                switchPlayerTurn();
                printNewRound();
        }
    };

    // Initial play game message
    printNewRound();

    // For the console version, we will only use playRound, but we will need
    // getActivePlayer for the UI version, so I'm revealing it now
    return { playRound, getActivePlayer };
}

const game = GameController();