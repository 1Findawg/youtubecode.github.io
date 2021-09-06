// https://en.wikipedia.org/wiki/Affine_cipher
var decodedAlphabet = [];
var encodedAlphabet = [];
var a = 1;
var b = 0;
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
    updateAB();
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
    updateAB();
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
        return String.fromCharCode(((a*(letterCode-65)+b)%26)+65);
    } else {
        return character;
    }
}

function decodeText() {
    updateAB();
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
        return String.fromCharCode(mod((findXForDecoding()*(letterCode-65-b)),26)+65);
    } else {
        return character;
    }
}

function findXForDecoding() {
    for (let i = 0; i < 25; i++) {
        if (((a*i)%26) === 1) {
            return i;
        }
    }
}

function updateAB() {
    a = parseInt(document.getElementById("aInput").value);
    b = parseInt(document.getElementById("bInput").value);
}

function mod(n, m) {
    return ((n % m) + m) % m;
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

function affineLoad() {
    displayAlphabetChart();
}

window.addEventListener("load", affineLoad());

