'use strict'

const MINE = '💣'
const FLAG = '🚩'
const LIVE = '❤️'

var gBoard
var gSize = 4
var gDir = 1
var gIntervalId
var gTimer = false
var gGame
var gLives
var gFirstClick
var gCountLives = false
var gStage = 1


gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

var gLevel = [
    { SIZE: 4, MINES: 2 },
    { SIZE: 8, MINES: 14 },
    { SIZE: 12, MINES: 32 },
]


function onInit() {
    gBoard = buildBoard(gSize)

    getMinesOnBoard(gBoard)
    renderBoard(gBoard)
    getRandomMinesLocation(gStage = 1)
    setMinesNegsCount(gBoard)
    gGame.isOn = true
    gFirstClick = false
    gCountLives = false
    getLivesShown()
    endTimer()
    onImgNormal()
}


function onSetLevel(gDir = 1) {
    gStage = gDir
    gSize = gLevel[gDir - 1].SIZE
    getRandomMinesLocation(gStage)
    getMinesOnBoard(gBoard)
    gCountLives = false
    onInit()
}


function buildBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            var cellPos = { i, j }
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
            board[i][j] = cell
        }
    }
    // board[0][0].isMine = true
    // board[1][2].isMine = true
    return board
}


function getMinesOnBoard(board) {
    var mines = []
    mines = getRandomMinesLocation(gDir = 1)
    for (var i = 0; i < mines.length; i++) {
        var currMine = mines[i]
        board[currMine.rowIdx][currMine.colIdx].isMine = true
    }
    return board
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var cellPos = { i, j }
            cell.minesAroundCount = countMinesAround(cellPos)
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

    if (!gFirstClick) {
        gFirstClick = true
        setMinesNegsCount(gBoard)
        getRandomMinesLocation(gDir = 1)
    }
    const cell = gBoard[i][j]
    var position = { i, j }
    elCell = document.querySelector(`.cell-${i}-${j}`)

    if (cell.isMarked || cell.isShown) return
    if (!cell.isMarked && !cell.isMine) {

        if (cell.minesAroundCount === 0) elCell.innerText = ''
        elCell.innerText = cell.minesAroundCount
        cell.isShown = true
        elCell.classList.add('isShown')
        cell.isShown = expandShown(gBoard, cell, i, j)
        gGame.shownCount++
        return
    }

    if (cell.isMine && cell.isMarked) return
    if (cell.isMine) {
        cell.isShown = true
        if (gLives !== 0) {
            const elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.innerText = MINE
            elCell.classList.add('isShown')
            var elLive = document.querySelector('.lives span')
            elLive.innerText =
                console.log(elLive.innerText);
            gLives--
            return

        } else if (gLives === 0) {
            for (var i = 0; i < gBoard.length; i++) {
                for (var j = 0; j < gBoard[0].length; j++) {
                    var currCell = gBoard[i][j]
                    var cellPos = { i, j }
                    if (currCell.isMine) {
                        currCell.isShown = true
                        const elCellIsMine = document.querySelector(`.cell-${i}-${j}`)
                        elCellIsMine.innerText = MINE
                        elCellIsMine.classList.add('isShown')
                    }
                }
            }
            gameOver()
        }
    }
    checkGameOver()
}



onCellRightClicked()
function onCellRightClicked(elCell, i, j) {

    elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell = onCellMarked()

    checkGameOver(gDir = 1)
}



function onCellMarked(elCell) {
    gGame.isOn = true
    if (!gGame.isOn) return
    elCell = document.querySelector(`.cell`)

    document.addEventListener("contextmenu", (elCell) => {
        elCell.preventDefault()
        gGame.isOn = true
        if (!gGame.isOn) return
        if (!gTimer) {
            startTimer()
            gTimer = true
        }

        var cell = elCell.target
        if (cell.isMarked) {
            cell.isMarked = false
            elCell.target.innerText = ''
            gGame.markedCount--
        } else {
            elCell.target.innerText = FLAG
            cell.isMarked = true
            gGame.markedCount++
        }
    })
    checkGameOver(gDir = 1)
}



function checkGameOver(gDir = 1) {
    var cellIsShown = gLevel[gDir - 1].SIZE ** 2 - gLevel[gDir - 1].MINES

    if (gGame.markedCount === gLevel[gDir - 1].MINES &&
        gGame.shownCount === cellIsShown) {

        const elNormal = document.querySelector('.normal')
        elNormal.classList.add('hidden')
        const elVictory = document.querySelector('.victory')
        elVictory.classList.remove('hidden')
        gameOver()
    }
}



function getRandomMinesLocation(gStage = 1) {
    //   gStage = onSetLevel(gDir = 1)

    var mines = []
    for (var i = 0; i < gLevel[gStage - 1].MINES; i++) {
        var rowIdx = getRandomInt(0, gLevel[gStage - 1].SIZE)
        var colIdx = getRandomInt(0, gLevel[gStage - 1].SIZE)

        var cellPos = { rowIdx, colIdx }
        mines.push(cellPos)
    }
    return mines
}




function expandShown(board, elCell, i, j) {
    var pos = { i: i, j: j }
    var cell = board[pos.i][pos.j]
    elCell = document.querySelector(`.cell-${i}-${j}`)

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === pos.i && j === pos.j) continue
            if (!board[i][j].isMine) {
                var currCell = board[i][j]
                if (cell.isMarked) continue
                var currCellPos = { i, j }
                currCell.isShown = true
                const elcurrCell = document.querySelector(`.cell-${i}-${j}`)
                elcurrCell.classList.add('isShown')
                gGame.shownCount++
            }
        }
    }
    return currCell
}


function onImgNormal() {
    const elNormal = document.querySelector('.normal')
    elNormal.classList.remove('hidden')
    const elVictory = document.querySelector('.victory')
    elVictory.classList.add('hidden')
    const elLose = document.querySelector('.lose')
    elLose.classList.add('hidden')
}


function gameOver() {
    const elNormal = document.querySelector('.normal')
    elNormal.classList.add('hidden')
    const elLose = document.querySelector('.lose')
    elLose.classList.remove('hidden')
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




function onToggleDarkMode() {
    var element = document.body
    element.classList.toggle('dark-mode')
}


function getLivesShown() {
    var elLive = document.querySelector('.lives span')
    elLive.innerText = ''
    if (gCountLives) return
    gCountLives = true
    for (var i = 0; i < 3; i++) {
        elLive.innerText += LIVE
    }
    gLives = 3
}
