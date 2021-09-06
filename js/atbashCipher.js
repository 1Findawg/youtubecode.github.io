// https://en.wikipedia.org/wiki/Atbash
var decodedAlphabet = [];
var encodedAlphabet = [];
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
    setDecodedAlphabet();
    setEncodedAlphabet();
    var topRow = "";
    var bottomRow = "";
    for (index in decodedAlphabet) {
        topRow += "<td>" + decodedAlphabet[index] + "</td>";
        bottomRow += "<td>" + encodedAlphabet[index] + "</td>";
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
        return String.fromCharCode((25-(letterCode-65))+65);
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
        return String.fromCharCode((25-(letterCode-65))+65);
    } else {
        return character;
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

function atbashLoad() {
    displayAlphabetChart();
}

window.addEventListener("load", atbashLoad());

