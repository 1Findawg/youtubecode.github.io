var gameBoard = [];
var playerOneArray = [];
var playerTwoArray = [];
var playerOneTurn = true;
var playerOneColorCode = -1;
var playerTwoColorCode = -1;

function setup(width, height) {
    for (let k = 0; k < height; k++) {
        let row = [];
        for (let i = 0; i < width; i++) {
            let randomNumber = Math.floor(Math.random() * 100) % 6;
            if (k === 0) {
                while (randomNumber === row[i-1]) {
                    randomNumber = Math.floor(Math.random() * 100) % 6;
                }
            }
            else {
                while (randomNumber === gameBoard[k-1][i] || randomNumber === row[i-1]) {
                    randomNumber = Math.floor(Math.random() * 100) % 6;
                }
            }
            row.push(randomNumber);
        }
        gameBoard.push(row);
    }
    addSquareToPlayer(playerOneArray,0,width-1);
    addSquareToPlayer(playerTwoArray,height-1,0);
    displayGameboard();
    displayPlayersScores();
    displayOptions(6);
    displayPlayerId();
}

function displayGameboard() {
    let gameboardHtml = "";
    for (let k = 0; k < gameBoard.length; k++) {
        gameboardHtml += "<tr>";
        for (let i = 0; i < gameBoard[k].length; i++) {
            gameboardHtml += "<td class='" + convertNumToString(gameBoard[k][i]) + "'></td>";
        }
        gameboardHtml += "</tr>";
    }
    document.getElementById('gameBoard').innerHTML = gameboardHtml;
}

function displayPlayersScores() {
    let playerOneScore = "<div class='playerScore'>Player 1 Score: " + playerOneArray.length + "</div>";
    let playerTwoScore = "<div class='playerScore'>Player 2 Score: " + playerTwoArray.length + "</div>";
    let bothPlayersScores = "<div id=scoreWrapper>" + playerOneScore + playerTwoScore + "</div>";
    let winnerMessage = "";
    if ((playerOneArray.length + playerTwoArray.length) === 64) {
        if (playerOneArray.length !== playerTwoArray.length) {
            winnerMessage = "<div id='endGameMsg'>Player " + ((playerOneArray.length > playerTwoArray.length) ? "1" : "2") + " Won!</div>";
        }
        else {
            winnerMessage = "<div id='endGameMsg'>Player 1 and Player 2 Tied</div>";
        }
    }

    document.getElementById('playersScores').innerHTML = bothPlayersScores + winnerMessage;
}

function displayPlayerId() {
    document.getElementById('playerId').innerHTML = "Player " + (playerOneTurn ? "1" : "2");
}

function displayOptions(numOfColors) {
    document.getElementById('options').innerHTML = "";
    for (let i = 0; i < numOfColors; i++) {
        document.getElementById('options').innerHTML += "<div id='" + convertNumToString(i) + "' class='optionsSquare " + convertNumToString(i) + "' onClick=changePlayersColor(" + i + ")></div>";
    }
    
}

function convertNumToString(num) {
    switch(num) {
        case 0: return 'zero';
        case 1: return 'one';
        case 2: return 'two';
        case 3: return 'three';
        case 4: return 'four';
        case 5: return 'five';
    }
}

function addSquareToPlayer(playerArray, indexRow, indexColumn) {
    playerArray.push([indexRow,indexColumn]);
}

function changePlayersColor(colorNumber) {
    if (!document.getElementById(convertNumToString(colorNumber)).classList.contains('optionsSquareDisabled')) {
        if (playerOneTurn) {
            disablePlayerOption(playerOneColorCode, colorNumber);
            playerOneArray.forEach(element => gameBoard[element[0]][element[1]] = colorNumber);
            playerOneColorCode = colorNumber;
        } else {
            disablePlayerOption(playerTwoColorCode, colorNumber);
            playerTwoArray.forEach(element => gameBoard[element[0]][element[1]] = colorNumber);
            playerTwoColorCode = colorNumber;
        }
        addNewColorsToPlayer();
        displayGameboard();
        displayPlayersScores();
        playerOneTurn = !playerOneTurn;
        displayPlayerId();
    }
}

function disablePlayerOption(currentColorCode, nextColorCode) {
    if (currentColorCode !== -1) {
        document.getElementById(convertNumToString(currentColorCode)).classList.remove('optionsSquareDisabled');
    }
    document.getElementById(convertNumToString(nextColorCode)).classList.add('optionsSquareDisabled');
}

function addNewColorsToPlayer() {
    let tempNewColorsArray = [];
    if (playerOneTurn) {
        playerOneArray.forEach(element => {
            tempNewColorsArray = addArrayToArray(tempNewColorsArray,getSurroundingNewColors(element,playerOneColorCode));

        });
        playerOneArray = addArrayToArray(playerOneArray,tempNewColorsArray);
    } else {
        playerTwoArray.forEach(element => {
            tempNewColorsArray = addArrayToArray(tempNewColorsArray,getSurroundingNewColors(element,playerTwoColorCode));

        });
        playerTwoArray =addArrayToArray(playerTwoArray,tempNewColorsArray);
    }
}

function getSurroundingNewColors(currentColorIndex, playerColorCode) {
    let resultArray = [];
    // all but bottom row
    if (currentColorIndex[0] !== gameBoard.length-1) {
        gameBoard[currentColorIndex[0]+1][currentColorIndex[1]] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0]+1, currentColorIndex[1]]) : '';
    }
    
    // all but top row
    if (currentColorIndex[0] !== 0) {
        gameBoard[currentColorIndex[0]-1][currentColorIndex[1]] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0]-1, currentColorIndex[1]]) : '';
    }
    
    // all but right row
    if (currentColorIndex[1] !== gameBoard[0].length-1) {
        gameBoard[currentColorIndex[0]][currentColorIndex[1]+1] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0], currentColorIndex[1]+1]) : '';
    }
    
    // all but left row
    if (currentColorIndex[1] !== 0) {
        gameBoard[currentColorIndex[0]][currentColorIndex[1]-1] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0], currentColorIndex[1]-1]) : '';
    }
    
//    // top left corner
//    if (currentColorIndex[0] === 0 && currentColorIndex[1] === 0) {
//        gameBoard[currentColorIndex[0]+1][currentColorIndex[1]] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0]+1, currentColorIndex[1]]) : '';
//        gameBoard[currentColorIndex[0]][currentColorIndex[1]+1] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0],currentColorIndex[1]+1]) : '';
//    }
//
//    // top right corner
//    else if (currentColorIndex[0] === 0 && currentColorIndex[1] === gameBoard[0].length-1) {
//        gameBoard[currentColorIndex[0]+1][currentColorIndex[1]] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0]+1, currentColorIndex[1]]) : '';
//        gameBoard[currentColorIndex[0]][currentColorIndex[1]-1] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0],currentColorIndex[1]-1]) : '';
//    }
//
//    // bottom left corner
//    else if (currentColorIndex[0] === gameBoard.length-1 && currentColorIndex[1] === 0) {
//        gameBoard[currentColorIndex[0]-1][currentColorIndex[1]] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0]-1,currentColorIndex[1]]) : '';
//        gameBoard[currentColorIndex[0]][currentColorIndex[1]+1] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0],currentColorIndex[1]+1]) : '';
//    }
//
//    // bottom right corner
//    else if (currentColorIndex[0] === gameBoard.length-1 && currentColorIndex[1] === gameBoard[0].length-1) {
//        gameBoard[currentColorIndex[0]-1][currentColorIndex[1]] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0]-1,currentColorIndex[1]]) : '';
//        gameBoard[currentColorIndex[0]][currentColorIndex[1]-1] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0],currentColorIndex[1]-1]) : '';
//    }
//
//    // top row
//    else if (currentColorIndex[0] === 0) {
//        gameBoard[0][currentColorIndex[1]-1] === playerColorCode ? resultArray = addElementToArray(resultArray,[0,currentColorIndex[1]-1]) : '';
//        gameBoard[1][currentColorIndex[1]] === playerColorCode ? resultArray = addElementToArray(resultArray,[1,currentColorIndex[1]]) : '';
//        gameBoard[0][currentColorIndex[1]+1] === playerColorCode ? resultArray = addElementToArray(resultArray,[0,currentColorIndex[1]+1]) : '';
//    }
//
//    // bottom row
//    else if (currentColorIndex[0] === gameBoard.length-1) {
//        gameBoard[gameBoard.length-1][currentColorIndex[1]-1] === playerColorCode ? resultArray = addElementToArray(resultArray,[gameBoard.length-1,currentColorIndex[1]-1]) : '';
//        gameBoard[gameBoard.length-2][currentColorIndex[1]] === playerColorCode ? resultArray = addElementToArray(resultArray,[gameBoard.length-2,currentColorIndex[1]]) : '';
//        gameBoard[gameBoard.length-1][currentColorIndex[1]+1] === playerColorCode ? resultArray = addElementToArray(resultArray,[gameBoard.length-1,currentColorIndex[1]+1]) : '';
//    }
//
//    // left column
//    else if (currentColorIndex[1] === 0) {
//        gameBoard[currentColorIndex[0]-1][0] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0]-1,0]) : '';
//        gameBoard[currentColorIndex[0]][1] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0],1]) : '';
//        gameBoard[currentColorIndex[0]+1][0] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0]+1,0]) : '';
//    }
//
//    // right column
//    else if (currentColorIndex[1] === gameBoard[0].length-1) {
//        gameBoard[currentColorIndex[0]-1][gameBoard[1].length-1] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0]-1,gameBoard[1].length-1]) : '';
//        gameBoard[currentColorIndex[0]][gameBoard[1].length-2] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0],gameBoard[1].length-2]) : '';
//        gameBoard[currentColorIndex[0]+1][gameBoard[1].length-1] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0]+1,gameBoard[1].length-1]) : '';
//    }
//
//    // remaining centers
//    else {
//        gameBoard[currentColorIndex[0]-1][currentColorIndex[1]] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0]-1,currentColorIndex[1]]) : '';
//        gameBoard[currentColorIndex[0]+1][currentColorIndex[1]] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0]+1,currentColorIndex[1]]) : '';
//        gameBoard[currentColorIndex[0]][currentColorIndex[1]-1] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0],currentColorIndex[1]-1]) : '';
//        gameBoard[currentColorIndex[0]][currentColorIndex[1]+1] === playerColorCode ? resultArray = addElementToArray(resultArray,[currentColorIndex[0],currentColorIndex[1]+1]) : '';
//    }
    return resultArray;
}

function addArrayToArray(array1, array2) {
    let tempArray =array1;
    for (let i = 0; i < array2.length; i++) {
        tempArray = addElementToArray(array1,array2[i]);
    }
    return tempArray;
}

function addElementToArray(array, element) {
    if (array.length > 0) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][0] === element[0] && array[i][1] === element[1]) {
                return array;
            }
        }
    }
    let tempArray = array;
    tempArray.push(element);
    return tempArray;
}

function reset() {
    gameBoard = [];
    playerOneArray = [];
    playerTwoArray = [];
    playerOneTurn = true;
    playerOneColorCode = -1;
    playerTwoColorCode = -1;
}

function fillerLoad() {
    reset();
    setup(8,8);
}

window.addEventListener("load", fillerLoad());
