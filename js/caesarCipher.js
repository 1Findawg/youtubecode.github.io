// https://en.wikipedia.org/wiki/Caesar_cipher
var decodedAlphabet = [];
var encodedAlphabet = [];
var shift = 0;
var encodeAlphabet = true;
var re = new RegExp("^([A-Z])$");
var encode = true;

function setDecodedAlphabet(){
    decodedAlphabet = [];
    for (let i = 0; i < 26; i++) {
        decodedAlphabet.push(String.fromCharCode(65 + i));
    }
}

function setEncodedAlphabet(){
    encodedAlphabet = [];
    for (let i = 0; i < 26; i++) {
        encodedAlphabet.push(encodeLetter(String.fromCharCode(65+i)));
    }
}

function displayAlphabetChart(){
    updateShift();
    setDecodedAlphabet();
    setEncodedAlphabet();
    var topRow = "";
    var bottomRow = "";
    for (index in decodedAlphabet) {
        if (encodeAlphabet) {
            topRow += "<td>" + decodedAlphabet[index] + "</td>";
            bottomRow += "<td>" + encodedAlphabet[index] + "</td>";
        }
        else {
            topRow += "<td>" + encodedAlphabet[index] + "</td>";
            bottomRow += "<td>" + decodedAlphabet[index] + "</td>";
        }
    }
    document.getElementById("alphabetChartTable").innerHTML = "<tr>" + topRow + "</tr>" + "<tr>" + bottomRow + "</tr>";
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
        return String.fromCharCode(((letterCode-65+26+shift)%26)+65);
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
        return String.fromCharCode(((letterCode-65+26-shift)%26)+65);
    } else {
        return character;
    }
}

function updateShift() {
    shift = parseInt(document.getElementById("shiftInput").value) * -1;
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

function caesarLoad() {
    displayAlphabetChart();
}

window.addEventListener("load", caesarLoad());
