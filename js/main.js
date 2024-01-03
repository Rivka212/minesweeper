'use strict'

const MINE = '💣'
const FLAG = '🚩'

const NORMAL = '😄'
const LOSE = '🫥'
const WIN = '🤩'

 
var gBoard
var gSize = 4
var gIntervalId
var gTimer = false
var gGame


gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = [
    { SIZE: 4, MINES: 2 },
    { SIZE: 8, MINES: 14 },
    { SIZE: 12, MINES: 32 },
]


function onInit() {


    gBoard = buildBoard(gSize)
    renderBoard(gBoard)
    gGame.isOn = true
    //  getRandomMinesLocation()
    setMinesNegsCount(gBoard)
    endTimer()
}


function onSetLevel(dir) {
    gSize = gLevel[dir - 1].SIZE
    onInit()
}


function buildBoard(size) {
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            // var cellPos = {i,j}
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
            board[i][j] = cell
        }
    }
    board[0][0].isMine = true
    board[1][2].isMine = true
    return board
}




function setMinesNegsCount(board) {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            var cellPos = { i, j }
            cell.minesAroundCount = countMinesAround(cellPos)
            // renderCell(cellPos, value)
        }
    }
}



function countMinesAround(pos) {
    var count = 0

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === pos.i && j === pos.j) continue
            if (gBoard[i][j].isMine) count++
        }
    }
    return count
}


function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (!gTimer) {
        startTimer()
        gTimer = true
    }
    const cell = gBoard[i][j]
    var position = { i, j }

    var elCell = document.querySelector(`.cell-${i}-${j}`)
    onCellMarked(cell)
    //   expandShown(gBoard, cell, position)

    if (cell.isMarked || cell.isShown) return

    if (!cell.isMarked && !cell.isMine) {
        elCell.innerText = cell.minesAroundCount
        cell.isShown = true
        elCell.classList.add('isShown')
        gGame.shownCount++
        return
    }
    //   onCellMarked(cell)

    if (cell.isMine) {
        cell.isShown = true

        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                var currCell = gBoard[i][j]
                var cellPos = { i, j }
                if (currCell.isMine) {
                    currCell.isShown = true
                    // var cellIsMinePos = cellPos
                    const elCellIsMine = document.querySelector(`.cell-${i}-${j}`)
                    elCellIsMine.innerText = MINE
                    elCellIsMine.classList.add('isShown')
                    //   renderCell(cellIsMinePos, MINE)
                }
            }
        }
        gameOver()
    }
}



var res = onCellMarked()
console.log(res)

function onCellMarked(elCell) {
    gGame.isOn = true
    if (!gGame.isOn) return
    //   var cell = gBoard[i][j]
    // elCell = document.querySelector(`.cell`)
    // elCell = document.querySelector(`.cell-${i}-${j}`)

    elCell = document.addEventListener("contextmenu", (click) => {
        console.log('right click!')
        click.preventDefault()

        // cell.isMarked ? cell.isMarked : !cell.isMarked
        // if (cell.isMarked) {
        // cell.isMarked = true
        //  elCell.innerText = FLAG
        //   elCell.classList.add('isShown')
        gGame.markedCount++
        renderCell(elCell, FLAG)
        // }else{
        //     cell.isMarked = false
        //     renderCell(elCell, '')
        //     gGame.markedCount--
        // }
    })
}



// var res = checkGameOver()
// console.log(res);
function checkGameOver() {
    var cellCanShown = gLevel.SIZE ** 2 - gLevel.MINES
    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === cellCanShown)
        gameOver()

}


function getRandomMinesLocation(dir = 2) {

    for (var i = 0; i < gLevel[dir - 1].MINES; i++) {
        var rowIdx = getRandomInt(0, gLevel[dir - 1].SIZE)
        var colIdx = getRandomInt(0, gLevel[dir - 1].SIZE)

        var cellPos = { rowIdx, colIdx }
        cellPos.isMine = true
        //return renderBoard()
    }
}

// var cell = { i: 1, j: 1 }
// var res = expandShown(gBoard, cell, 1, 1)
// console.log(res);

function expandShown(board, elCell, i, j) {
    console.log('hi');
    var pos = { i, j }
    var cell = board[i][j]

    // var cell = board[pos.i][pos.j]
    // console.log(pos);
    //  console.log(cell);
    elCell = document.querySelector(`.cell-${i}-${j}`)

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === pos.i && j === pos.j) continue
            if (!board[i][j].isMine) {
                var cell = board[i][j]
                cell.isShown = true
                // elCell.innerText = cell.minesAroundCount
                gGame.shownCount++
                console.log(cell)
            }
        }
    }
    //    console.log(cell);
    // return count
}




function gameOver() {
    endTimer()
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
}





function startTimer() {
    var elMinutes = document.querySelector('.minutes')
    var elSeconds = document.querySelector('.seconds')

    var startTime = Date.now()
    gIntervalId = setInterval(() => {
        var elapsed = Math.floor((Date.now() - startTime) / 1000)
        var minutes = Math.floor(elapsed / 60)
        var seconds = elapsed % 60
        elMinutes.innerText = pad(minutes)
        elSeconds.innerText = pad(seconds)
    }, 1000)
}


function endTimer() {
    gTimer = false
    clearInterval(gIntervalId)
}

