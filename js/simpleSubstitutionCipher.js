var decodedAlphabet = [];
var encodedAlphabet = [];
var re = new RegExp("^([A-Z])$");
var encode = true;
var key = "FINDAWGBCEHJKLMOPQRSTUVXYZ";

function setDecodedAlphabet(){
    decodedAlphabet = [];
    for (let i = 0; i < 26; i++) {
        decodedAlphabet.push(String.fromCharCode(65 + i));
    }
}

function setEncodedAlphabet(){
    encodedAlphabet = key.toUpperCase().split("");
}

function displayAlphabetChart(){
    updateKey();
    setDecodedAlphabet();
    setEncodedAlphabet();
    var topRow = "";
    var bottomRow = "";
    for (index in decodedAlphabet) {
        topRow += "<td>" + decodedAlphabet[index] + "</td>";
        bottomRow += "<td>" + encodedAlphabet[index] + "</td>";
    }
    document.getElementById("alphabetChartTable").innerHTML = "<tr>" + topRow + "</tr>" + "<tr>" + bottomRow + "</tr>";
    encodeDecode();
}

function encodeText() {
    document.getElementById("plaintext").value = document.getElementById("plaintext").value.toUpperCase();
    let text = document.getElementById("plaintext").value;
    document.getElementById("ciphertext").value = "";
    for (letter in text) {
        document.getElementById("ciphertext").value += encodeLetter(text.charAt(letter));
    }
}

function encodeLetter(character) {
    var letterCode = character.charCodeAt(0);
    if (re.test(character)) {
        return encodedAlphabet[decodedAlphabet.indexOf(character)];
    } else {
        return character;
    }
}

function decodeText() {
    document.getElementById("ciphertext").value = document.getElementById("ciphertext").value.toUpperCase();
    let text = document.getElementById("ciphertext").value;
    document.getElementById("plaintext").value = "";
    for (letter in text) {
        document.getElementById("plaintext").value += decodeLetter(text.charAt(letter));
    }
}

function decodeLetter(character) {
    var letterCode = character.charCodeAt(0);
    if (re.test(character)) {
        return decodedAlphabet[encodedAlphabet.indexOf(character)];;
    } else {
        return character;
    }
}

function updateKey() {
    key = document.getElementById("keyInput").value;
    document.getElementById("keyInput").value = key.toUpperCase();
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

function simpleSubstitutionLoad() {
    document.getElementById("keyInput").value = key.toUpperCase();
    displayAlphabetChart();
}

window.addEventListener("load", simpleSubstitutionLoad());

