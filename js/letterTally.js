var letterFrequencyArray;
var re = new RegExp("^([A-Z])$");
var totalLetterCount;

function displayAlphabetChart() {
    document.getElementById("frequencyOutput").innerHTML = "";
    let tempFrequencyRow = "";
    let tempAlphabet = "";
    let tempPercents = "";
    for (letterFrequency in letterFrequencyArray) {
        tempFrequencyRow += "<td>" + letterFrequencyArray[letterFrequency] + "</td>";
        tempAlphabet += "<td>" + String.fromCharCode(parseInt(letterFrequency)+65) + "</td>";
        tempPercents += "<td>" + (totalLetterCount === 0 ? "0" : Math.floor((letterFrequencyArray[letterFrequency]/totalLetterCount)*100)) + "%</td>";
    }
    document.getElementById("frequencyOutput").innerHTML += "<tr>" + tempFrequencyRow + "</tr>";
    document.getElementById("frequencyOutput").innerHTML += "<tr>" + tempAlphabet + "</tr>";
    document.getElementById("frequencyOutput").innerHTML += "<tr>" + tempPercents + "</tr>";
}

function updateLetterFrequency() {
    reset();
    document.getElementById("originalText").value = document.getElementById("originalText").value.toUpperCase();
    let text = document.getElementById("originalText").value;
    for (letter in text) {
        if (re.test(text.charAt(letter))){
            letterFrequencyArray[text.charAt(letter).charCodeAt(0)-65]++;
            totalLetterCount++;
        }
    }
    displayAlphabetChart();
}

function reset() {
    letterFrequencyArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    totalLetterCount = 0;
}

function letterTallyLoad() {
    reset();
    displayAlphabetChart();
}

window.addEventListener("load", letterTallyLoad());
