// https://en.wikipedia.org/wiki/Bacon%27s_cipher
var encodedAlphabet = new Map();
encodedAlphabet.set("A","aaaaa");
encodedAlphabet.set("B","aaaab");
encodedAlphabet.set("C","aaaba");
encodedAlphabet.set("D","aaabb");
encodedAlphabet.set("E","aabaa");
encodedAlphabet.set("F","aabab");
encodedAlphabet.set("G","aabba");
encodedAlphabet.set("H","aabbb");
encodedAlphabet.set("I","abaaa");
encodedAlphabet.set("J","abaaa");
encodedAlphabet.set("K","abaab");
encodedAlphabet.set("L","ababa");
encodedAlphabet.set("M","ababb");
encodedAlphabet.set("N","abbaa");
encodedAlphabet.set("O","abbab");
encodedAlphabet.set("P","abbba");
encodedAlphabet.set("Q","abbbb");
encodedAlphabet.set("R","baaaa");
encodedAlphabet.set("S","baaab");
encodedAlphabet.set("T","baaba");
encodedAlphabet.set("U","baabb");
encodedAlphabet.set("V","baabb");
encodedAlphabet.set("W","babaa");
encodedAlphabet.set("X","babab");
encodedAlphabet.set("Y","babba");
encodedAlphabet.set("Z","babbb");
var re = new RegExp("^([A-Z])$");
var alphaChar = new RegExp("^([A-Za-z])$");
var encode = true;

function displayAlphabetChart(){
    let rowOne = "<td>A - " + encodedAlphabet.get("A") + "</td>" + "<td>B - " + encodedAlphabet.get("B") + "</td>" + "<td>C - " + encodedAlphabet.get("C") + "</td>";
    let rowTwo = "<td>D - " + encodedAlphabet.get("D") + "</td>" + "<td>E - " + encodedAlphabet.get("E") + "</td>" + "<td>F - " + encodedAlphabet.get("F") + "</td>";
    let rowThree = "<td>G - " + encodedAlphabet.get("G") + "</td>" + "<td>H - " + encodedAlphabet.get("H") + "</td>" + "<td>I/J - " + encodedAlphabet.get("I") + "</td>";
    let rowFour = "<td>K - " + encodedAlphabet.get("K") + "</td>" + "<td>L - " + encodedAlphabet.get("L") + "</td>" + "<td>M - " + encodedAlphabet.get("M") + "</td>";
    let rowFive = "<td>N - " + encodedAlphabet.get("N") + "</td>" + "<td>O - " + encodedAlphabet.get("O") + "</td>" + "<td>P - " + encodedAlphabet.get("P") + "</td>";
    let rowSix = "<td>Q - " + encodedAlphabet.get("Q") + "</td>" + "<td>R - " + encodedAlphabet.get("R") + "</td>" + "<td>S - " + encodedAlphabet.get("S") + "</td>";
    let rowSeven = "<td>T - " + encodedAlphabet.get("T") + "</td>" + "<td>U/V - " + encodedAlphabet.get("U") + "</td>" + "<td>W - " + encodedAlphabet.get("W") + "</td>";
    let rowEight = "<td>X - " + encodedAlphabet.get("X") + "</td>" + "<td>Y - " + encodedAlphabet.get("Y") + "</td>" + "<td>Z - " + encodedAlphabet.get("Z") + "</td>";
    document.getElementById("alphabetChartTable").innerHTML = "<tr>" + rowOne + "</tr>" + "<tr>" + rowTwo + "</tr>" + "<tr>" + rowThree + "</tr>" + "<tr>" + rowFour + "</tr>" + "<tr>" + rowFive + "</tr>" + "<tr>" + rowSix + "</tr>" + "<tr>" + rowSeven + "</tr>" + "<tr>" + rowEight + "</tr>";
}

function encodeText() {
    document.getElementById("plaintext").value = document.getElementById("plaintext").value.toUpperCase();
    let text = document.getElementById("plaintext").value;
    document.getElementById("stepOneOutput").innerHTML = "";
    for (letter in text) {
        document.getElementById("stepOneOutput").innerHTML += encodeLetter(text.charAt(letter));
    }
    let secondarySentence = document.getElementById("secondarySentenceInput").value;
    if (secondarySentence.length > 0) {
        document.getElementById("ciphertext").value = "";
        let stepOneIndex = 0;
        for (letter in secondarySentence) { //a -> lowercase, b -> uppercase
            if (alphaChar.test(secondarySentence.charAt(letter))) {
                document.getElementById("ciphertext").value += (document.getElementById("stepOneOutput").innerHTML.substr(stepOneIndex, 1) === "b" ? secondarySentence.charAt(letter).toUpperCase() : secondarySentence.charAt(letter).toLowerCase());
                stepOneIndex++;
            }
            else {
                document.getElementById("ciphertext").value += secondarySentence.charAt(letter);
            }
        }
    }
}

function encodeLetter(character) {
    if (re.test(character)) {
        return encodedAlphabet.get(character).replace(/\s/g, '');
    } else {
        return character.replace(/\s/g, '');
    }
}

function decodeText() {
    let text = document.getElementById("ciphertext").value;
    document.getElementById("stepOneOutput").innerHTML = "";
    for (letter in text) {
        document.getElementById("stepOneOutput").innerHTML += decodeLetter(text.charAt(letter));
    }
    for (let i = 0; i < document.getElementById("stepOneOutput").innerHTML.length%5; i++){
        document.getElementById("stepOneOutput").innerHTML += "a";
    }
    document.getElementById("secondarySentenceInput").value = text.toUpperCase();
    let stepOneOutput = document.getElementById("stepOneOutput").innerHTML;
    if (stepOneOutput.length > 0) {
        document.getElementById("plaintext").value = "";
        for (let i = 0; i < stepOneOutput.length; i += 5) {
            document.getElementById("plaintext").value += getByValue(encodedAlphabet,stepOneOutput.substr(i,5));
        }
    }
}

function decodeLetter(character) {
    if (alphaChar.test(character)) {
        if (re.test(character)) {
            return "b";
        }
        else {
            return "a";
        }
    } else {
        return "";
    }
}

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
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

function baconianLoad() {
    displayAlphabetChart();
}

window.addEventListener("load", baconianLoad());
