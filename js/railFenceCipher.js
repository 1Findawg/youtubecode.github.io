// https://en.wikipedia.org/wiki/Rail_fence_cipher
var railFenceArray = [[]];
var rails = 1;
var encode = true;

function displayRailFenceTable(){
    document.getElementById("railFenceTable").innerHTML = "";
    for (rowIndex in railFenceArray) {
        let tempRow = "<tr>";
        for (columnIndex in railFenceArray[rowIndex]) {
            if (columnIndex < 28) {
                tempRow += ("<td>" + railFenceArray[rowIndex][columnIndex] + "</td>");
            }
        }
        tempRow += "</tr>";
        document.getElementById("railFenceTable").innerHTML += tempRow;
    }
}

function encodeText() {
    let rowIndex = 0;
    let isIncreasing = true;
    document.getElementById("plaintext").value = document.getElementById("plaintext").value.toUpperCase();
    let text = document.getElementById("plaintext").value;
    for (let i = 0; i < (text.length % (2*(rails-1))); i++) {
        text += " ";
    }
    for (letter in text) {
        encodeLetter(text.charAt(letter),rowIndex);
        if (rails > 1) {
            if (isIncreasing) {
                rowIndex++;
            }
            else {
                rowIndex--;
            }
            if (rowIndex === rails){
                isIncreasing = false;
                rowIndex -= 2;
            }
            if (rowIndex === -1){
                isIncreasing = true;
                rowIndex += 2;
            }
        }
    }
    displayRailFenceTable();
    document.getElementById("ciphertext").value = "";
    let cipherTextResult = "";
    for (cipherRow in railFenceArray) {
        cipherTextResult += railFenceArray[cipherRow].join("");
    }
    document.getElementById("ciphertext").value = cipherTextResult.trim();
}

function encodeLetter(character,specificRowIndex) {
    for (railFenceArrayIndex in railFenceArray) {
        if (parseInt(railFenceArrayIndex) === specificRowIndex) {
            railFenceArray[specificRowIndex].push(character);
        }
        else {
            railFenceArray[railFenceArrayIndex].push("");
        }
    }
}

function decodeText() {
    document.getElementById("ciphertext").value = document.getElementById("ciphertext").value.toUpperCase();
    let text = document.getElementById("ciphertext").value;
    document.getElementById("plaintext").value = "";
    if (rails === 1) {
        railFenceArray[0] = text.split("");
        displayRailFenceTable();
        document.getElementById("plaintext").value = text.trim();
    }
    else {
        for (let i = 0; i < (text.length % (2*(rails-1))); i++) {
            text += " ";
        }
        let k = text.length / (2*(rails-1));
        let columnIndex = 0;
        for (railIndex in railFenceArray) {
            if (railIndex == 0) {
                railFenceArray[railIndex] = text.substr(columnIndex,k).split("");
                columnIndex += k;
            }
            else if (railIndex == railFenceArray.length-1) {
                railFenceArray[railIndex] = text.substr(columnIndex,k).split("");
            }
            else {
                railFenceArray[railIndex] = text.substr(columnIndex,(2*k)).split("");
                columnIndex += (2*k);
            }
        }
        normalizeDecodeRows();
        displayRailFenceTable();
        concatePlainText();
    }
}

function concatePlainText() {
    let result = "";
    let maxRowLength = 0;
    for (railRow in railFenceArray) {
        if (railFenceArray[railRow].length > maxRowLength) {
            maxRowLength = railFenceArray[railRow];
        }
    }
    for (railRow in railFenceArray) {
        for (let i = 0; i < railFenceArray[railRow].length % maxRowLength; i++) {
            railFenceArray[railRow].push("");
        }
    }
    for (rowColumn in railFenceArray[0]) {
        for (railRow in railFenceArray) {
            result += railFenceArray[railRow][rowColumn];
        }
    }
    document.getElementById("plaintext").value = result.trim();
}

function normalizeDecodeRows() {
    for (rail in railFenceArray) {
        let tempRow = railFenceArray[rail];
        railFenceArray[rail] = [];
        for (let i = 0; i < parseInt(rail); i++) {
            railFenceArray[rail].push("");
        }
        if (rail == 0 || rail == railFenceArray.length-1){
            for (column in tempRow){
                railFenceArray[rail].push(tempRow[column]);
                let blankColumns = ((railFenceArray.length-2)*2)+1;
                for (let i = 0; i < blankColumns; i++) {
                    railFenceArray[rail].push("");
                }
            }
        }
        else {
            for (column in tempRow){
                railFenceArray[rail].push(tempRow[column]);
                let blankColumns = 0;
                if (parseInt(column)%2 == 0){ // Look down
                    blankColumns = ((railFenceArray.length-parseInt(rail)-2)*2)+1;
                }
                else { // Look up
                    blankColumns = ((parseInt(rail)-1)*2)+1;
                }
                for (let i = 0; i < blankColumns; i++) {
                    railFenceArray[rail].push("");
                }
            }
        }
    }
}

function updateRails() {
    rails = parseInt(document.getElementById("railInput").value);
    railFenceArray = [];
    for (let i = 0; i < rails; i++) {
        railFenceArray.push([]);
    }
    displayRailFenceTable();
    encodeDecode();
}

function encodeDecode() {
    if (encode) {
        encodeText();
    } else {
        decodeText();
    }
}

function setEncode(value) {
    encode = value;
    encodeDecode();
}

function railFenceLoad() {
    displayRailFenceTable();
}

window.addEventListener("load", railFenceLoad());
