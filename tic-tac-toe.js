// import _ from "lodash" // Import the entire lodash library

let ticTacToe;
const playerOne = '\u25EF' // O
const playerTwo = '\u2716' // X
let playerAi = playerTwo

if (typeof window != "undefined") {
    window.onload = function () {
        const gridContainer = document.getElementById("tic-tac-toe-grid-container");
        // Initialize Empty grid
        ticTacToe = new TicTacToe(gridContainer);
        document.getElementById('human-ai').checked = true
    };
}

function TicTacToe(grid) {
    this.container = grid
    this.isFinised = false
    this.lastMove = playerTwo
    this.isShowHint = false

    this.removeWin = function (row, column) {
        const element = document.getElementById(row + '_' + column)
        element.setAttribute('class', element.className.replace(' win', ''))
    }

    this.clear = function () {
        document.getElementById("result").innerText = ''
        for (let r = 1; r <= 3; r++) {
            for (let c = 1; c <= 3; c++) {
                this.set(r, c, '')
                this.removeWin(r, c)
            }
        }
        this.isFinised = false
        this.lastMove = playerTwo
        if (document.getElementById("human-ai").checked) {
            playerAi = playerTwo
        } else if (document.getElementById("ai-human").checked) {
            playerAi = playerOne
            this.set(2, 2, playerAi)
            this.lastMove = playerAi
        } else if (document.getElementById("human-human").checked) {
            playerAi = null
            this.aiMove()
        }
    }

    this.clickHint = function () {
        this.isShowHint = document.getElementById("hint").checked
    }

    this.win = function (player) {
        document.getElementById("result").innerText = player + ' win'
    }

    this.setCellWin = function (row, column) {
        const element = document.getElementById(row + '_' + column)
        element.setAttribute('class', element.className + ' win')
    }

    this.setHorizontalRowWin = function (row) {
        this.setCellWin(row,1)
        this.setCellWin(row,2)
        this.setCellWin(row,3)

        this.isFinised = true
    }

    this.setVerticalColumnWin = function (column) {
        this.setCellWin(1, column)
        this.setCellWin(2, column)
        this.setCellWin(3, column)

        this.isFinised = true
    }

    this.get = function (row, column) {
        console.log('Get cell (' + row + '_' + column + ')')
        return document.getElementById(row + '_' + column).textContent
    }

    this.set = function (row, column, player) {
        console.log('Set cell (' + row + '_' + column + ') with ' + player)
        document.getElementById(row + '_' + column).innerText = player
    }

    this.checkIfAnyWin = function () {
        for (let row = 1; row <= 3 && !this.isFinised; row++) {
            this.checkHorizontalRow(row, playerOne)
        }
        for (let row = 1; row <= 3 && !this.isFinised; row++) {
            this.checkHorizontalRow(row, playerTwo)
        }
        for (let column = 1; column <= 3 && !this.isFinised; column++) {
            this.checkVerticalColumn(column, playerOne)
        }
        for (let column = 1; column <= 3 && !this.isFinised; column++) {
            this.checkVerticalColumn(column, playerTwo)
        }
        if (!this.isFinised) {
            this.checkRightDiagonal(playerOne)
        }
        if (!this.isFinised) {
            this.checkRightDiagonal(playerTwo)
        }
        if (!this.isFinised) {
            this.checkLeftDiagonal(playerOne)
        }
        if (!this.isFinised) {
            this.checkLeftDiagonal(playerTwo)
        }
    }

    this.checkRightDiagonal = function (player) {
        if(this.get(1, 3) === player &&
            this.get(2, 2) === player &&
            this.get(3, 1) === player) {

            this.setCellWin(1,3)
            this.setCellWin(2,2)
            this.setCellWin(3,1)
            this.win(player)

            this.isFinised = true
        }
    }

    this.checkLeftDiagonal = function (player) {
        if(this.get(1, 1) === player &&
            this.get(2, 2) === player &&
            this.get(3, 3) === player) {

            this.setCellWin(1,1)
            this.setCellWin(2,2)
            this.setCellWin(3,3)
            this.win(player)

            this.isFinised = true
        }
    }

    this.checkHorizontalRow = function (row, player) {
        if (this.get(row, 1) === player &&
            this.get(row, 2) === player &&
            this.get(row, 3) === player) {
            this.setHorizontalRowWin(row)
            this.win(player)

            this.isFinised = true
        }
    }

    this.checkVerticalColumn = function (column, player) {
        if (this.get(1, column) === player &&
            this.get(2, column) === player &&
            this.get( 3, column) === player) {
            this.setVerticalColumnWin(column)
            this.win(player)
            this.isFinised = true
        }
    }

    this.choose = function (event, element) {

        if (!this.isFinised && (!element.innerText || element.innerText.startsWith('"'))) {
            const position = element.id.split('_')
            console.log("Row: " + position[0] + " Column: " + position[1])
            if (this.lastMove === playerTwo ) {
                element.innerText = playerOne
                this.lastMove = playerOne
            } else {
                element.innerText = playerTwo
                this.lastMove = playerTwo
            }
            this.checkIfAnyWin()
            if (!this.isFinised) {
                this.aiMove()
            }
        }
    }

    this.getBoard = function () {
        let board = Array.from(Array(3), () => new Array(3))
        for (let r = 1; r <= 3; r++) {
            for (let c = 1; c <= 3; c++) {
                const cell = this.get(r, c)
                board[r - 1][c - 1] = cell.startsWith('"') ? '' : cell
            }
        }
        return board
    }

    this.aiMove = function () {
        let result
        let bestMove = {}
        let board = this.getBoard()
        let isAiMakeMove = false
        const player = this.lastMove === playerOne ? playerTwo : playerOne
        const nextPlayer = playerOne === player ? playerTwo : playerOne
        for (let r = 1; r <= 3; r++) {
            for (let c = 1; c <= 3; c++) {
                if (!board[r - 1][c - 1]) {
                    let nextBoard = _.cloneDeep(board)
                    nextBoard[r - 1][c - 1] = player
                    let nextResult = this.getScore(nextBoard)
                    if (nextResult === 1 && playerAi && this.lastMove !== playerAi && !isAiMakeMove) {
                        this.set(r, c, playerAi)
                        this.lastMove = playerAi
                        this.checkIfAnyWin()
                        isAiMakeMove = true
                        if (!this.isShowHint) {
                            return
                        }
                    }
                    if (typeof nextResult === 'undefined') {
                        nextResult = this.minMaxScore(nextBoard, nextPlayer)
                    }
                    if (this.isShowHint) {
                        this.set(r, c, '"' + nextResult + '"')
                    }
                    if (typeof result === 'undefined' || nextResult > result) {
                        result = nextResult
                        bestMove = { row: r, column: c }
                    }
                }
            }
        }
        if (typeof result !== 'undefined' && playerAi) {
            this.set(bestMove.row, bestMove.column, playerAi)
            this.lastMove = playerAi
            this.checkIfAnyWin()
        }
    }

    this.minMaxScore = function (board, player) {
        let result
        let undefinedCells = []
        const playerMaxScore = playerAi ? playerAi : playerOne
        const playerMinScore = playerMaxScore === playerOne ? playerTwo : playerOne

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (board[r][c] === '' || board[r][c].startsWith('"')) {
                    let nextBoard = _.cloneDeep(board)
                    nextBoard[r][c] = player
                    let nextResult = this.getScore(nextBoard)
                    if (typeof nextResult === 'undefined') {
                        undefinedCells.push({ row: r, column: c })
                        continue
                    }
                    if (player === playerMinScore) {
                        result = typeof result !== 'undefined' ? Math.min(result, nextResult) : nextResult
                        if (result === -1) {
                            return -1
                        }
                    } else {
                        result = typeof result !== 'undefined' ? Math.max(result, nextResult) : nextResult
                        if (result === 1) {
                            return 1
                        }
                    }
                }
            }
        }
        if (undefinedCells.length === 0) {
            return result
        }
        // define score for undefined at this board position
        const nextPlayer = playerOne === player ? playerTwo : playerOne
        for (let i = 0; i < undefinedCells.length; i++) {
            const nextMove = undefinedCells[i]
            let nextBoard = _.cloneDeep(board)
            nextBoard[nextMove.row][nextMove.column] = player
            let nextResult = this.minMaxScore(nextBoard, nextPlayer)
            if (typeof nextResult !== 'undefined') {
                if (player === playerMinScore) {
                    result = typeof result !== 'undefined' ? Math.min(result, nextResult) : nextResult
                    if (result === -1) {
                        return -1
                    }
                } else {
                    result = typeof result !== 'undefined' ? Math.max(result, nextResult) : nextResult
                    if (result === 1) {
                        return 1
                    }
                }
            }
        }
        return result
    }

    this.isWin = function (board, player) {
        if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
            return true
        }
        if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
            return true
        }
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
                return true
            }
        }
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
                return true
            }
        }
        return false;
    }

    this.getScore = function (board) {
        const playerMaxScore = playerAi ? playerAi : playerOne
        const playerMinScore = playerMaxScore === playerOne ? playerTwo : playerOne
        if (this.isWin(board, playerMaxScore)) {
            return 1
        }
        if (this.isWin(board, playerMinScore)) {
            return -1
        }
        for (let r = 1; r <= 3; r++) {
            for (let c = 1; c <= 3; c++) {
                if (board[r - 1][c - 1] === '') {
                    return undefined
                }
            }
        }
        return 0;
    }
}