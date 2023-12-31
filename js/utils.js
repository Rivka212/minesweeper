'use strict'



function renderBoard(board) {

    var strHTML = ''
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            var cellClass = `cell cell-${i}-${j}`

            // if (!cell.isShown) cellClass += 'cover'
            if (cell.isMine) cellClass += 'mine'
            if (cell.minesAroundCount) cellClass += 'negCount'
            // // if isMine&&isSowe

            strHTML += `<td class="${cellClass}"
                onclick="onCellClicked(this,${i},${j})" >`
            'contextmenu'
            if (cell.isMine && cell.isShown) strHTML += MINE
            // if(!cell.isShown) strHTML += COVER

            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elBoard = document.querySelector('.board-container')
    elBoard.innerHTML = strHTML

}


// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}


// function renderCell(location, value) {
// 	const cellSelector = '.' + getClassName(location)
// 	const elCell = document.querySelector(cellSelector)
// 	elCell.innerHTML = value
// }




function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}



function getTime() {
    return new Date().toString().split(' ')[4];
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}