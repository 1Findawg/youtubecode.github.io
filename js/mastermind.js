var slots = 4; //user can select 1-15
var colors = 6; // user can select 2-6
var solutionArray = [];

function getRandomColor() {
    return getColorFromCode(Math.floor(Math.random() * 100) % colors);
}

function getColorFromCode(code) {
    switch (code) {
        case 0: return "red";
        case 1: return "blue";
        case 2: return "black";
        case 3: return "white";
        case 4: return "green";
        case 5: return "purple";
    }
}

function getCodeFromColor(color) {
    switch (color) {
        case "red": return 0;
        case "blue": return 1;
        case "black": return 2;
        case "white": return 3;
        case "green": return 4;
        case "purple": return 5;
    }
}

function setSolution() {
    solutionArray = [];
    document.getElementById("solutionRow").innerHTML = "";
    for (let i = 0; i < slots; i++) {
        let tempColor = getRandomColor();
        document.getElementById("solutionRow").innerHTML += "<div id='s"+i+"' class='slot " + tempColor + "' style='display: none;'></div>";
        solutionArray.push(tempColor);
    }
}

function gameSetup() {
    document.getElementById("gameBoard").innerHTML = "";
    for (let j = 9; j >= 0; j--) {
        let tempRow = "<div id='boardRow" + j + "' class='card center flex'><div id='row0' class='codeWrapper'>";
        for (let i = 0; i < slots; i++) {
            tempRow += "<div id='r"+j+"c"+i+"' class='noColor' onclick='changeColor(r"+j+"c"+i+")'>*</div>";
        }
        
        tempRow += "</div><div id='r"+j+"Output' class='rowOutput'></div><button id='r"+j+"Btn' onclick='checkRow("+j+")'>Submit</button></div>";
        document.getElementById("gameBoard").innerHTML += tempRow;
    }
}

function checkRow(row) {
    let guessedArray = [];
    let correctCount = [];
    for (let i = 0; i < slots; i++) {
        guessedArray.push(document.getElementById("r"+row+"c"+i).classList[1]);
    }
    
    const hasUndefined = (element) => element === undefined;
    if (guessedArray.some(hasUndefined)) {
        alert("Please ensure " + slots + " pegs are selected");
    } else {
        document.getElementById("r"+row+"Btn").disabled = true;
        correctCount = getCorrectPositionCorrectColor(solutionArray,guessedArray);
        showRowResults(correctCount,row);
    }
    if (correctCount[0] === 4) {
        for (let k = 9; k > row; k--) {
            document.getElementById("r" + k + "Btn").disabled = true;
        }
        showSolution();
        alert("The Codebreaker Won!");
    }
    if (row === 9) {
        showSolution();
        alert("The Codemaker Won!");
    }
}

function showSolution() {
    for (let l = 0; l < slots; l++) {
        document.getElementById("s"+l).style.display = "block";
    }
}

function getCorrectPositionCorrectColor(array1, array2) {
    let counts = [0,0];
    let copyArray1 = [...array1];
    let copyArray2 = [...array2];
    for (let i = slots-1; i >= 0; i--) {
        if (copyArray1[i] === copyArray2[i]) {
            copyArray1.splice(i, 1);
            copyArray2.splice(i, 1);
            counts[0]++;
        }
    }
    if (copyArray1.length === copyArray2.length) {
        let tempArray1 = [0,0,0,0,0,0];
        let tempArray2 = [0,0,0,0,0,0];
        for (index in copyArray1) {
            tempArray1[getCodeFromColor(copyArray1[index])]++;
            tempArray2[getCodeFromColor(copyArray2[index])]++;
        }
        for (index in tempArray1) {
            if (tempArray1[index] > 0 && tempArray2[index] > 0) {
                if (tempArray1[index] > tempArray2[index]) {
                    counts[1] += tempArray2[index];
                }
                else {
                    counts[1] += tempArray1[index];
                }
            }
        }
    }
    return counts;
}

function showRowResults(counts,row) {
    document.getElementById("r"+row+"Output").innerHTML = "";
    let topResultRow = "<div class='topResult flex'>";
    let bottomResultRow = "<div class='bottomResult flex'>";
    let count = 0;
    for (let i = 0; i < counts[0]; i++) { // Correct position
        if (count < Math.ceil((counts[0] + counts[1])/2)) {
            topResultRow += "<div class='redResult'></div>";
        } else {
            bottomResultRow += "<div class='redResult'></div>";
        }
        count++;
    }
    for (let j = 0; j < counts[1]; j++) { // Correct color
        if (count < Math.ceil((counts[0] + counts[1])/2)) {
            topResultRow += "<div class='whiteResult'></div>";
        } else {
            bottomResultRow += "<div class='whiteResult'></div>";
        }
        count++;
    }
    topResultRow += "</div>";
    bottomResultRow += "</div>";
    
    document.getElementById("r"+row+"Output").innerHTML += topResultRow;
    document.getElementById("r"+row+"Output").innerHTML += bottomResultRow;
}

function changeColor(element) {
    if (element.classList[0] === "slot"){
        let currentColor = element.classList[1];
        element.classList.remove(currentColor);
        element.classList.add(getColorFromCode((getCodeFromColor(currentColor)+1)%colors));
    } else {
        element.innerHTML = "";
        element.classList.remove("noColor");
        element.classList.add("slot");
        element.classList.add(getColorFromCode(0));
    }
}

function mastermindLoad() {
    setSolution();
    gameSetup();
}

window.addEventListener("load", mastermindLoad());
