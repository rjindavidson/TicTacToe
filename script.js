const Game = () => {
    let turnCount = 0;

    const updateTurnCount = () => {
        ++turnCount;
    }

    const getTurnCount = () => {
        return turnCount;
    }

    const resetTurnCount = () => {
        turnCount = 0;
    }

    return { getTurnCount, updateTurnCount, resetTurnCount }
}

const Gameboard = (() => {
    const gameboard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    let gameOver = false;

    const { getTurnCount, updateTurnCount, resetTurnCount } = Game();

    const checkBadTile = (x, y) => {
        const gameboardBoundary = gameboard.length;
        if (x < 0 || x >= gameboardBoundary || y < 0 || y >= gameboardBoundary) {
            return true;
        } else if (gameboard[x][y] !== '') {
            return true;
        }
        return false;
    }

    const clearBoard = () => {
        for (let i = 0; i < gameboard.length; i++) {
            for (let j = 0; j < gameboard[i].length; j++) {
                gameboard[i][j] = '';
            }
        }
    }

    const resetGame = () => {
        clearBoard();
        gameOver = false;
        resetTurnCount();
    }

    const getGameboard = () => {
        return gameboard;
    };

    const updateGameboard = (x, y, playerTile) => {
        if (checkBadTile(x, y)) {
            return false
        } else {
            gameboard[x][y] = playerTile;
            updateTurnCount();
            const gameStaus = checkGameStatus(playerTile);
            if (gameStaus === 'win') {
                gameOver = true;
                console.log(`${playerTile} Wins!`)
            } else if (gameStaus === 'tie') {
                gameOver = true;
                console.log('Draw.')
            }
        }
        return true;
    }

    const checkGameStatus = (playerTile) => {
        if (gameboard[0][0] === playerTile && gameboard[0][1] === playerTile && gameboard[0][2] === playerTile) {
            return 'win';
        } else if (gameboard[0][0] === playerTile && gameboard[1][0] === playerTile && gameboard[2][0] === playerTile) {
            return 'win';
        } else if (gameboard[0][0] === playerTile && gameboard[1][1] === playerTile && gameboard[2][2] === playerTile) {
            return 'win';
        } else if (gameboard[0][1] === playerTile && gameboard[1][1] === playerTile && gameboard[2][1] === playerTile) {
            return 'win';
        } else if (gameboard[0][2] === playerTile && gameboard[1][2] === playerTile && gameboard[2][2] === playerTile) {
            return 'win';
        } else if (gameboard[1][0] === playerTile && gameboard[1][1] === playerTile && gameboard[1][2] === playerTile) {
            return 'win';
        } else if (gameboard[2][0] === playerTile && gameboard[2][1] === playerTile && gameboard[2][2] === playerTile) {
            return 'win';
        } else if (gameboard[2][0] === playerTile && gameboard[1][1] === playerTile && gameboard[0][2] === playerTile) {
            return 'win';
        } else if (getTurnCount() === 9) {
            return 'tie'
        }
        return '';
    };

    const isGameFinished = () => {
        return gameOver;
    }

    return { getGameboard, updateGameboard, clearBoard, isGameFinished, resetGame };
})();

const BoardRenderer = (() => {
    const gameGrid = document.getElementById("gameGrid");

    const createTile = (tileType) => {
        const playerTile = document.createElement("div");
        playerTile.classList.add('grid-tile');
        playerTile.textContent = tileType;
        gameGrid.appendChild(playerTile);
    }

    const resetBoard = () => {
        gameGrid.innerHTML = '';
    }

    const drawBoard = () => {
        resetBoard();
        for (let i of Gameboard.getGameboard()) {
            for (let j of i) {
                createTile(j);
            }
        }
    }

    return { drawBoard }
})();

const Player = (tileType, isPlayerTurn) => {
    const tile = tileType;
    let isTurn = isPlayerTurn;

    const getTile = () => {
        return tile;
    }

    const placeTile = () => {

    }

    const updatePlayerTurn = () => {
        isTurn = !isTurn;
    }

    const getPlayerTurn = () => {
        return isTurn;
    }

    return { getTile, getPlayerTurn, updatePlayerTurn }
};

const Player1 = Player('x', true);
const Player2 = Player('y', false);

while (!Gameboard.isGameFinished()) {
    if (Player1.getPlayerTurn()) {
        let x = prompt('Player 1 input x');
        let y = prompt('Player 1 input y');
        while (!Gameboard.updateGameboard(x, y, Player1.getTile())) {
            x = prompt('Player 1 input x');
            y = prompt('Player 1 input y');
        }
    } else {
        let x = prompt('Player 2 input x');
        let y = prompt('Player 2 input y');
        while (!Gameboard.updateGameboard(x, y, Player2.getTile())) {
            x = prompt('Player 2 input x');
            y = prompt('Player 2 input y');
        }
    }
    BoardRenderer.drawBoard();
    Player1.updatePlayerTurn();
    Player2.updatePlayerTurn();
    if (Gameboard.isGameFinished()) { Gameboard.resetGame(); }
}
