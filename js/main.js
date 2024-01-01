'use strict'

const MINE = 'MINE'
const MARKED = 'MARKED'


const MINE_IMG = '💣'
const MARKED_IMG = '🚩'


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
   
    renderBoard(gBoard)
    gGame.isOn = true
    //   getRandomMinesLocation()
    setMinesNegsCount(gBoard)
    changeLevel(1)
    
}

function changeLevel(dir) {
    gLevel.SIZE *= dir
    // gLevel.MINES *= dir
    console.log(gLevel.MINES);
    // onInit()
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
    var elCell = document.querySelector(`.cell-${i}-${j}`)
   
    if (cell.isMarked || cell.isShown) return

    if (!cell.isMarked && !cell.isMine) {
        elCell.innerText = cell.minesAroundCount
        cell.isShown = true
        gGame.shownCount++
        return
    }


    if (cell.isMine) {

        cell.isShown = true
        // var mines = []
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                var currCell = gBoard[i][j]
                var cellPos = { i, j }
                if (currCell.isMine) {
                    currCell.isShown = true

                    // gBoard[cellPos.i][cellPos.j] = MINE
                    // var cellIsMine = gBoard[cellPos.i][cellPos.j]
                //  var elCellIsMine = document.querySelector(`.cell-${i}-${j}`)
                //    elCellIsMine.innerText = MINE
                   renderCell(cellPos, MINE_IMG)
                } 
            }
        }
        // gameOver()
    }
}



var res = onCellMarked()
console.log(res);

function onCellMarked(elCell, i, j) {
    //  const cell = gBoard[i][j]

    elCell = document.querySelector(`.cell-${i}-${j}`)
    // elCell.innerText = MARKED


    document.addEventListener('contextmenu', (elCell) => {
        console.log('right click!')
        // cell.isMarked = true
        elCell.innerText = MARKED
        console.log(elCell);

        elCell.preventDefault()
    })
    gGame.markedCount++
    console.log(gGame.markedCount);

}





// var rightClick = document.getElementById('right-click')

// rightClick.addEventListener('contextmenu', (e) => {
//     e.preventDefault()
//     console.log('right click!')
// })
// const cell = gBoard[i][j]

// elCell.addEventListener("contextmenu", e => e.preventDefault())
// console.log('hi');
// elCell.innerText = MARKED
// cell.isMarked = true
// }


// var res = checkGameOver()
// console.log(res);
function checkGameOver() {
    var cellCanShown = gLevel.SIZE ** 2 - gLevel.MINES
    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === cellCanShown)
        gameOver()
}



function getRandomMinesLocation() {

    for (var i = 0; i < gLevel.MINES; i++) {
        var rowIdx = getRandomInt(0, gLevel.SIZE)
        var colIdx = getRandomInt(0, gLevel.SIZE)

        var cellPos = { rowIdx, colIdx }
        cellPos.isMine = true
        // renderCell
    }
}


function expandShown(board, elCell, i, j) {


}


function gameOver(params) {
    gGame.isOn = false
}