'use strict'

const MINE = '💣'
const MARKED = '🚩'
// const COVER = 'COVER'


const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


var gBoard
var gLevel = { SIZE: 4, MINES: 2 }



function onInit() {
    gBoard = buildBoard(4)
    console.log(gBoard);
    renderBoard(gBoard)
    gGame.isOn = true
    setMinesNegsCount(gBoard)


}


// function changeLevel() {
//     for (var i = 0; i < 3; i++) {
//         const element = array[i];

//     }
// }



function buildBoard() {
    const size = 4
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

            //  if(!cell.isShown) board[cellPos.i][cellPos.j] = COVER

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
    const cell = gBoard[i][j]

    if (cell.isMarked || cell.isShown) return

    var elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerText = cell.minesAroundCount

    cell.isShown = true
    gGame.shownCount++
    // elCell.classList.add('showned')
    if (cell.isMine) {
        for (var i = 0; i < gBoard.length; i++) {
            cell.isMine = cell.isShown
        }
        // checkGameOver()
    }
}





function onCellMarked(elCell) {

    elCell = document.querySelector('.cell')

    var rightClick = document.getElementById('right-click')

    rightClick.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        console.log('right click!')
    })
    // const cell = gBoard[i][j]

    // elCell.addEventListener("contextmenu", e => e.preventDefault())
    // console.log('hi');
    elCell.innerText = MARKED
    cell.isMarked = true
    gGame.markedCount++

}


function checkGameOver() {
    var currCellCanShown = gLevel.SIZE ** gLevel.SIZE - gLevel.MINES
    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === currCellCanShown)
        gameOver()
}


function expandShown(board, elCell, i, j) {


}


function gameOver(params) {

}