//https://en.wikipedia.org/wiki/Wheel_of_Fortune_(American_game_show)#Main_game
var puzzle = "";
var round = 1;
var currentSpinValue = 0;
var currentPlayerIndex = 0;
var solvedPuzzle = [];
var guessedLetters = [];
var hasSpun = false;
var optionsArray = [];
var bonusRoundCategory = "";
var wheel1 = ["Bankrupt","Bankrupt","Bankrupt",
             "2500","2500","2500",
             "Wild - $500","Wild - $500","Wild - $500",
             "600","600","600",
             "700","700","700",
             "600","600","600",
             "650","650","650",
             "500","500","500",
             "700","700","700",
             "Bankrupt","1000000","Bankrupt",
             "600","600","600",
             "550","550","550",
             "500","500","500",
             "600","600","600",
             "Bankrupt","Bankrupt","Bankrupt",
             "650","650","650",
             "Free Play","Free Play","Free Play",
             "700","700","700",
             "Lose A Turn","Lose A Turn","Lose A Turn",
             "800","800","800",
             "500","500","500",
             "650","650","650",
             "500","500","500",
             "900","900","900"];

var wheel23 = ["Bankrupt","Bankrupt","Bankrupt",
             "3500","3500","3500",
             "Wild - $500","Wild - $500","Wild - $500",
             "600","600","600",
             "700","700","700",
             "600","600","600",
             "650","650","650",
             "500","500","500",
             "700","700","700",
             "Bankrupt","1000000","Bankrupt",
             "600","600","600",
             "550","550","550",
             "500","500","500",
             "600","600","600",
             "Bankrupt","Bankrupt","Bankrupt",
             "650","650","650",
             "Free Play","Free Play","Free Play",
             "700","700","700",
             "Lose A Turn","Lose A Turn","Lose A Turn",
             "800","800","800",
             "500","500","500",
             "650","650","650",
             "500","500","500",
             "900","900","900"];

var wheelBonus = ["5000","10000","15000","20000","30000","40000","50000","60000","70000","80000","90000","100000",
                  "25000","35000","45000","55000","65000","75000","85000","95000","15000","45000","95000","70000"];

var players = [{"name":"","roundPurse":0,"totalPurse":0,"hasWild":false,"freePlay":false},
               {"name":"","roundPurse":0,"totalPurse":0,"hasWild":false,"freePlay":false},
               {"name":"","roundPurse":0,"totalPurse":0,"hasWild":false,"freePlay":false}];
// Add players - Done
// Randomize position - Done
// Puzzle is chosen and empty slots are shown - Done
// First player spins - Done
// Call out a consonant if correct then the player get the value spun multiplied by the number of times it is in the puzzle - Done
// If correct letter was called then spin again, buy a vowel for 250 (can keep buying vowels until out of money or all vowels are bought) or solve the puzzle - Done
// Passes to next player if: lose a turn, bankrupt, calls letter not in puzzle, calls letter already been called, or attempts the puzzle incorrectly - Done
// Free Play wedge: consonant and recieve 500 per occurance, call a free vowel, attempt to solve the puzzle with no penalty - Done
// Wild Card: taken to the bonus round for an extra consonant. have 1000 value but on top of a 500 value - Done
// Wilds are over 500's - Done

function addPlayer() {
    if (players[0].name === "") {
        players[0].name = document.getElementById("playerNameInput").value;
    }
    else if (players[1].name === "") {
        players[1].name = document.getElementById("playerNameInput").value;
    }
    else if (players[2].name === "") {
        players[2].name = document.getElementById("playerNameInput").value;
        document.getElementById("playerNameWrapper").style.display = "none";
        var tempPlayers = [];
        while (players.length > 0) {
            tempPlayers.push(players.splice(((Math.random()*10)%players.length),1)[0]);
        }
        players = tempPlayers;
        updatePlayerInfoOutput();
        handleNewPuzzle();
    }
    document.getElementById("playerNameInput").value = "";
}

function updatePlayerInfoOutput() {
    document.getElementById("playerInfoOutput").innerHTML = "";
    for (player in players) {
        var colorClass = (player == 0 ? "playerOne" : player == 1 ? "playerTwo" : player == 2 ? "playerThree" : ""); // red yellow blue
        
        var playerName = ("<div>" + players[parseInt(player)].name + "</div>");
        var playerRoundPurse = ("<div>Round: $" + players[parseInt(player)].roundPurse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "</div>");
        var playerTotalPurse = ("<div>Total: $" + players[parseInt(player)].totalPurse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "</div>");
        var playerPrizes = "<div>" + (players[player].hasWild ? "W" : "") + "</div>";
        document.getElementById("playerInfoOutput").innerHTML += ("<div class='" + colorClass + " playerMaster" + (player == currentPlayerIndex ? " selectedPlayer" : "") + "'>" + playerName + playerRoundPurse + playerTotalPurse + playerPrizes + "</div>");
    }
}

function clearBoard() {
    document.getElementById("boardTop").innerHTML = "";
    document.getElementById("boardMiddleTop").innerHTML = "";
    document.getElementById("boardMiddleBottom").innerHTML = "";
    document.getElementById("boardBottom").innerHTML = "";
    for (var i = 0; i < 12; i++){
        document.getElementById("boardTop").innerHTML += "<div id='0"+i+"' class='boardLetter nonLetterSpace'></div>";
        document.getElementById("boardBottom").innerHTML +=  "<div id='3"+i+"' class='boardLetter nonLetterSpace'></div>";
    }
    for (var i = 0; i < 14; i++){
        document.getElementById("boardMiddleTop").innerHTML += "<div id='1"+i+"' class='boardLetter nonLetterSpace'></div>";
        document.getElementById("boardMiddleBottom").innerHTML +=  "<div id='2"+i+"' class='boardLetter nonLetterSpace'></div>";
    }
    solvedPuzzle = [];
}

function handleNewPuzzle(){
    clearBoard();
    getNewPuzzle();
    setNewPuzzle(false);
}

function setNewPuzzle(bypass) {
    if (puzzle.length <= 14) {
        centerBlankSpacesOnRow(1,puzzle);
    }
    
    var puzzleArray = puzzle.split(" ");
    var topRow = "";
    var middleTopRow = (puzzleArray[0] + " ");
    var middleBottomRow = "";
    var bottomRow = "";

    if (puzzle.length <= 40 && !bypass) {
        middleTopRow = (puzzleArray[0] + " ");
        middleBottomRow = "";
        bottomRow = "";
        for (var i = 1; i < puzzleArray.length; i++) {
            if (14 - middleTopRow.length >= puzzleArray[i].length && middleBottomRow.length === 0) {
                middleTopRow += (puzzleArray[i] + " ");
            }
            else if (14 - middleBottomRow.length >= puzzleArray[i].length && bottomRow.length === 0) {
                middleBottomRow += (puzzleArray[i] + " ");
            }
            else {
                bottomRow += (puzzleArray[i] + " ");
            }
        }
    }
    else {
        topRow = (puzzleArray[0] + " ");
        middleTopRow = "";
        middleBottomRow = "";
        bottomRow = "";
        for (var i = 1; i < puzzleArray.length; i++) {
            if (12 - topRow.length >= puzzleArray[i].length && middleTopRow.length === 0) {
                topRow += (puzzleArray[i] + " ");
            }
            else if (14 - middleTopRow.length >= puzzleArray[i].length && middleBottomRow.length === 0) {
                middleTopRow += (puzzleArray[i] + " ");
            }
            else if (14 - middleBottomRow.length >= puzzleArray[i].length && bottomRow.length === 0) {
                middleBottomRow += (puzzleArray[i] + " ");
            }
            else {
                bottomRow += (puzzleArray[i] + " ");
            }
        }
    }
    if (bottomRow.length > 12) {
        setNewPuzzle(true);
    }
    else {
        centerBlankSpacesOnRow(0,topRow.trim());
        centerBlankSpacesOnRow(1,middleTopRow.trim());
        centerBlankSpacesOnRow(2,middleBottomRow.trim());
        centerBlankSpacesOnRow(3,bottomRow.trim());
    }
}

function getNewPuzzle() {
    switch (Math.floor(Math.random()*100)%29) {
        case 0: document.getElementById("puzzleHint").innerHTML = "Phrase";
            puzzle = puzzles.Phrase[Math.floor(Math.random()*1000)%puzzles.Phrase.length];
            break;
        case 1: document.getElementById("puzzleHint").innerHTML = "Rhyme Time";
            puzzle = puzzles.RhymeTime[Math.floor(Math.random()*1000)%puzzles.RhymeTime.length];
            break;
        case 2: document.getElementById("puzzleHint").innerHTML = "What Are You Doing?";
            puzzle = puzzles.WhatAreYouDoing[Math.floor(Math.random()*1000)%puzzles.WhatAreYouDoing.length];
            break;
        case 3: document.getElementById("puzzleHint").innerHTML = "Title";
            puzzle = puzzles.Title[Math.floor(Math.random()*1000)%puzzles.Title.length];
            break;
        case 4: document.getElementById("puzzleHint").innerHTML = "Thing";
            puzzle = puzzles.Thing[Math.floor(Math.random()*1000)%puzzles.Thing.length];
            break;
        case 5: document.getElementById("puzzleHint").innerHTML = "Place";
            puzzle = puzzles.Place[Math.floor(Math.random()*1000)%puzzles.Place.length];
            break;
        case 6: document.getElementById("puzzleHint").innerHTML = "Before & After";
            puzzle = puzzles.BeforeAndAfter[Math.floor(Math.random()*1000)%puzzles.BeforeAndAfter.length];
            break;
        case 7: document.getElementById("puzzleHint").innerHTML = "Fun & Games";
            puzzle = puzzles.FunAndGames[Math.floor(Math.random()*1000)%puzzles.FunAndGames.length];
            break;
        case 8: document.getElementById("puzzleHint").innerHTML = "Person";
            puzzle = puzzles.Person[Math.floor(Math.random()*1000)%puzzles.Person.length];
            break;
        case 9: document.getElementById("puzzleHint").innerHTML = "Event";
            puzzle = puzzles.Event[Math.floor(Math.random()*1000)%puzzles.Event.length];
            break;
        case 10: document.getElementById("puzzleHint").innerHTML = "Things";
            puzzle = puzzles.Things[Math.floor(Math.random()*1000)%puzzles.Things.length];
            break;
        case 11: document.getElementById("puzzleHint").innerHTML = "Food & Drink";
            puzzle = puzzles.FoodAndDrink[Math.floor(Math.random()*1000)%puzzles.FoodAndDrink.length];
            break;
        case 12: document.getElementById("puzzleHint").innerHTML = "Song Lyrics";
            puzzle = puzzles.SongLyrics[Math.floor(Math.random()*1000)%puzzles.SongLyrics.length];
            break;
        case 13: document.getElementById("puzzleHint").innerHTML = "Same Letter";
            puzzle = puzzles.SameLetter[Math.floor(Math.random()*1000)%puzzles.SameLetter.length];
            break;
        case 14: document.getElementById("puzzleHint").innerHTML = "Show Biz";
            puzzle = puzzles.ShowBiz[Math.floor(Math.random()*1000)%puzzles.ShowBiz.length];
            break;
        case 15: document.getElementById("puzzleHint").innerHTML = "On The Map";
            puzzle = puzzles.OnTheMap[Math.floor(Math.random()*1000)%puzzles.OnTheMap.length];
            break;
        case 16: document.getElementById("puzzleHint").innerHTML = "People";
            puzzle = puzzles.People[Math.floor(Math.random()*1000)%puzzles.People.length];
            break;
        case 17: document.getElementById("puzzleHint").innerHTML = "Around The House";
            puzzle = puzzles.AroundTheHouse[Math.floor(Math.random()*1000)%puzzles.AroundTheHouse.length];
            break;
        case 18: document.getElementById("puzzleHint").innerHTML = "Living Things";
            puzzle = puzzles.LivingThings[Math.floor(Math.random()*1000)%puzzles.LivingThings.length];
            break;
        case 19: document.getElementById("puzzleHint").innerHTML = "Same Name";
            puzzle = puzzles.SameName[Math.floor(Math.random()*1000)%puzzles.SameName.length];
            break;
        case 20: document.getElementById("puzzleHint").innerHTML = "The 80's";
            puzzle = puzzles.TheEighties[Math.floor(Math.random()*1000)%puzzles.TheEighties.length];
            break;
        case 21: document.getElementById("puzzleHint").innerHTML = "The 90's";
            puzzle = puzzles.TheNinties[Math.floor(Math.random()*1000)%puzzles.TheNinties.length];
            break;
        case 22: document.getElementById("puzzleHint").innerHTML = "Quotation";
            puzzle = puzzles.Quotation[Math.floor(Math.random()*1000)%puzzles.Quotation.length];
            break;
        case 23: document.getElementById("puzzleHint").innerHTML = "Proper Name";
            puzzle = puzzles.ProperName[Math.floor(Math.random()*1000)%puzzles.ProperName.length];
            break;
        case 24: document.getElementById("puzzleHint").innerHTML = "Occupation";
            puzzle = puzzles.Occupation[Math.floor(Math.random()*1000)%puzzles.Occupation.length];
            break;
        case 25: document.getElementById("puzzleHint").innerHTML = "Fictional Character";
            puzzle = puzzles.FictionalCharacter[Math.floor(Math.random()*1000)%puzzles.FictionalCharacter.length];
            break;
        case 26: document.getElementById("puzzleHint").innerHTML = "College Life";
            puzzle = puzzles.CollegeLife[Math.floor(Math.random()*1000)%puzzles.CollegeLife.length];
            break;
        case 27: document.getElementById("puzzleHint").innerHTML = "In The Kitchen";
            puzzle = puzzles.InTheKitchen[Math.floor(Math.random()*1000)%puzzles.InTheKitchen.length];
            break;
        case 28: document.getElementById("puzzleHint").innerHTML = "Living Thing";
            puzzle = puzzles.LivingThing[Math.floor(Math.random()*1000)%puzzles.LivingThing.length];
            break;
    }
}

function centerBlankSpacesOnRow(rowIndex, lineString) {
    var lineStartIndex = 0;
    if ((rowIndex === 1 || rowIndex === 2) && lineString.length <= 14) {
        if (lineString.length < 14) {
            lineStartIndex = Math.floor((14 - lineString.length)/2)+1;
        }
        for (var i = lineStartIndex; i < (lineStartIndex + lineString.length); i++){
            if (lineString.charAt(i-lineStartIndex) !== " ") {
                document.getElementById(""+rowIndex+i).classList.remove('nonLetterSpace');
                solvedPuzzle.push([(""+rowIndex+i),lineString.charAt(i-lineStartIndex)]);
            }
            if (isSpecialSymbol(lineString.charAt(i-lineStartIndex))){
                document.getElementById(""+rowIndex+i).innerHTML = lineString.charAt(i-lineStartIndex);
                solvedPuzzle.push([(""+rowIndex+i),lineString.charAt(i-lineStartIndex)]);
            }
        }
    }
    else if ((rowIndex === 0 || rowIndex === 3) && lineString.length <= 12) {
        if (lineString.length < 12) {
            lineStartIndex = Math.floor((12 - lineString.length)/2)+1;
        }
        for (var i = lineStartIndex; i < (lineStartIndex + lineString.length); i++){
            if (lineString.charAt(i-lineStartIndex) !== " ") {
                document.getElementById(""+rowIndex+i).classList.remove('nonLetterSpace');
                solvedPuzzle.push([(""+rowIndex+i),lineString.charAt(i-lineStartIndex)]);
            }
            if (isSpecialSymbol(lineString.charAt(i-lineStartIndex))){
                document.getElementById(""+rowIndex+i).innerHTML = lineString.charAt(i-lineStartIndex);
                solvedPuzzle.push([(""+rowIndex+i),lineString.charAt(i-lineStartIndex)]);
            }
        }
    }
    else {
        alert("Puzzle will not fit on board row index: " + rowIndex + ". " + lineString);
    }
}

function isSpecialSymbol(character) {
    switch (character) {
        case "!": return true;
        case "@": return true;
        case "#": return true;
        case "$": return true;
        case "%": return true;
        case "^": return true;
        case "&": return true;
        case "*": return true;
        case "(": return true;
        case ")": return true;
        case "-": return true;
        case "_": return true;
        case "=": return true;
        case "+": return true;
        case ",": return true;
        case "<": return true;
        case ".": return true;
        case ">": return true;
        case "/": return true;
        case "?": return true;
        case ";": return true;
        case ":": return true;
        case "'": return true;
        case '\\': return true;
        case "|": return true;
        case "`": return true;
        case "~": return true;
        case "[": return true;
        case "{": return true;
        case "]": return true;
        case "}": return true;
        case '\"': return true;
        default: return false;
    }
}

function spin() {
    if (!hasSpun) {
        hasSpun = true;
        if(round === 1) {
            currentSpinValue = wheel1[Math.floor(Math.random()*100)%wheel1.length];
        }
        else if(round < 4){
            currentSpinValue = wheel23[Math.floor(Math.random()*100)%wheel23.length];
        }
        else {
            currentSpinValue = wheelBonus[Math.floor(Math.random()*100)%wheelBonus.length];
            document.getElementById("playerSpinOutput").innerHTML = "Your winnings have been selected. Good Luck!";
            handleBonusRound();
        }
        if(round < 4){
            const regex = /[A-Z]/g;
            if (regex.test(currentSpinValue.substring(0, 1))) {
                document.getElementById("playerSpinOutput").innerHTML = "You spun: " + currentSpinValue;
                handleSpinResult();
            }
            else {
                document.getElementById("playerSpinOutput").innerHTML = "You spun: $" + currentSpinValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        }
    }
    else {
        alert ("You have already spun. Please make a guess.");
    }
}

function handleSpinResult() {
    switch (currentSpinValue) {
        case "Bankrupt": players[currentPlayerIndex].roundPurse = 0;
            players[currentPlayerIndex].hasWild = false;
            currentSpinValue = 0;
            alert ("You are Bankrupt!");
            incrementPlayer();
            break;
        case "Wild - $500": players[currentPlayerIndex].hasWild = true;
            if (round === 1) {
                wheel1[6] = "500";
                wheel1[7] = "500";
                wheel1[8] = "500";
            }
            else {
                wheel23[6] = "500";
                wheel23[7] = "500";
                wheel23[8] = "500";
            }
            break;
        case "Free Play":
            players[currentPlayerIndex].freePlay = true;
            break;
        case "Lose A Turn":
            currentSpinValue = 0;
            alert ("You Lost your Turn!");
            incrementPlayer();
            break;
        case "Trip - $500":
            if (round === 1) {
                wheel1[60] = "500";
                wheel1[61] = "500";
                wheel1[62] = "500";
            }
            else {
                wheel23[60] = "500";
                wheel23[61] = "500";
                wheel23[62] = "500";
            }
            break;
    }
}

function allVowelsBought() {
    return (guessedLetters.indexOf("A") > -1 && guessedLetters.indexOf("E") > -1 && guessedLetters.indexOf("I") > -1 && guessedLetters.indexOf("O") > -1 && guessedLetters.indexOf("U") > -1)
}

function guessALetter() {
    var guess = document.getElementById("playerGuessInput").value.substring(0,1).toUpperCase();
    var isConsonant = guess === "A" ? false : guess === "E" ? false : guess === "I" ? false : guess === "O" ? false : guess === "U" ? false : true;

    if (hasSpun || !isConsonant) {
        if (!isConsonant) {
            if (!players[currentPlayerIndex].freePlay){
                if (players[currentPlayerIndex].roundPurse >= 250){
                    players[currentPlayerIndex].roundPurse -= 250;
                    updatePlayerInfoOutput();
                }
                else {
                    document.getElementById("playerGuessInput").value = "";
                    alert("You do not have enough to buy a vowel. Pleas guess a consonant.");
                    return;
                }
            }
        }
        if (guessedLetters.includes(guess)){
             if (players[currentPlayerIndex].freePlay){
                 players[currentPlayerIndex].freePlay = false;
                 alert ("The letter (" + guess + ") has already been guessed. You have a Free Play so you can spin again.");
             }
             else {
                alert ("The letter (" + guess + ") has already been guessed.");
                incrementPlayer();
             }
        }
        else if (puzzle.indexOf(guess) === -1) {
            if (players[currentPlayerIndex].freePlay){
                players[currentPlayerIndex].freePlay = false;
                alert("The letter (" + guess + ") is not in the puzzle. You have a Free Play so you can spin again.");
            }
            else {
                alert("The letter (" + guess + ") is not in the puzzle.");
                incrementPlayer();
            }
        }
        else {
            var consonantCount = 0;
            for (solvedPuzzleLetter in solvedPuzzle) {
                if (guess === solvedPuzzle[solvedPuzzleLetter][1]) {
                    document.getElementById(solvedPuzzle[solvedPuzzleLetter][0]).innerHTML = solvedPuzzle[solvedPuzzleLetter][1];
                    if (isConsonant) {
                        consonantCount++;
                    }
                }
            }
            if (currentSpinValue.substring(0,1) === "W" && consonantCount > 0){
                players[currentPlayerIndex].hasWild = true;
            }
            if (currentSpinValue.substring(0,1) === "F" || currentSpinValue.substring(0,1) === "W") {
                currentSpinValue = "500";
            }
            if (isConsonant && consonantCount > 0) {
                players[currentPlayerIndex].roundPurse += (parseInt(currentSpinValue) * consonantCount);
            }
        }
        if (!guessedLetters.includes(guess)){
            guessedLetters.push(guess);
        }
        if (allVowelsBought()) {
            console.log("Bought all vowels")
            document.getElementById("allVowelsBought").classList.remove("hide");
        }
        document.getElementById("playerGuessInput").value = "";
        updatePlayerInfoOutput();
        hasSpun = false;
        document.getElementById("guessedLetters").innerHTML = guessedLetters.toString().replaceAll(","," ");
        document.getElementById("playerSpinOutput").innerHTML = "";
    }
    else {
        alert ("You have not spun. Please spin first!");
    }
    players[currentPlayerIndex].freePlay = false;
}

function solvePuzzle() {
    var guess = document.getElementById("playerGuessInput").value.toUpperCase();
    if (puzzle === guess) {
        for (solvedPuzzleLetter in solvedPuzzle) {
            document.getElementById(solvedPuzzle[solvedPuzzleLetter][0]).innerHTML = solvedPuzzle[solvedPuzzleLetter][1];
        }
        setTimeout(function(){
            if (round < 4){
                   alert("You solved the puzzle!");
            }
        }, 1000);
        players[currentPlayerIndex].totalPurse += players[currentPlayerIndex].roundPurse < 1000 ? 1000 : players[currentPlayerIndex].roundPurse;
        for (player in players) {
            players[player].roundPurse = 0;
        }
        updatePlayerInfoOutput();
        nextRound();
    }
    else {
        if (!players[currentPlayerIndex].freePlay){
            incrementPlayer();
            alert("You got the puzzle wrong");
        }
        else {
            players[currentPlayerIndex].freePlay = false;
            alert("You got the puzzle wrong. You can guess again because you have a Free Play.");
        }
    }
    document.getElementById("playerGuessInput").value = "";
}

function solveBonusPuzzle() {
    var guess = document.getElementById("playerGuessInput").value.toUpperCase();
    if (puzzle === guess) {
        for (solvedPuzzleLetter in solvedPuzzle) {
            document.getElementById(solvedPuzzle[solvedPuzzleLetter][0]).innerHTML = solvedPuzzle[solvedPuzzleLetter][1];
        }
        setTimeout(function(){
            players[currentPlayerIndex].totalPurse = (parseInt(players[currentPlayerIndex].totalPurse) + parseInt(currentSpinValue)).toString();
            alert(players[currentPlayerIndex].name + " won $" + currentSpinValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +" which makes a total of $" + players[currentPlayerIndex].totalPurse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        }, 1000);
        players[currentPlayerIndex].totalPurse += players[currentPlayerIndex].roundPurse < 1000 ? 1000 : players[currentPlayerIndex].roundPurse;
        for (player in players) {
            players[player].roundPurse = 0;
        }
        updatePlayerInfoOutput();
        setTimeout(function(){
           location.reload();
        }, 60000);
    }
    else {
        if (!players[currentPlayerIndex].freePlay){
            incrementPlayer();
            alert("You got the puzzle wrong");
        }
        else {
            players[currentPlayerIndex].freePlay = false;
            alert("You got the puzzle wrong. You can guess again because you have a Free Play.");
        }
    }
    document.getElementById("playerGuessInput").value = "";
}

function incrementPlayer() {
    players[currentPlayerIndex].freePlay = false;
    hasSpun = false;
    document.getElementById("playerSpinOutput").innerHTML = "";
    currentPlayerIndex++;
    if (currentPlayerIndex === 3) {
        currentPlayerIndex = 0;
    }
    updatePlayerInfoOutput();
}

function nextRound() {
    puzzle = "";
    round++;
    
    currentSpinValue = 0;
    currentPlayerIndex = 0;
    for (player in players) {
        if (players[player].totalPurse < players[currentPlayerIndex].totalPurse) {
            currentPlayerIndex = player;
        }
    }
    solvedPuzzle = [];
    guessedLetters = [];
    hasSpun = false;
    updatePlayerInfoOutput();
    document.getElementById("playerSpinOutput").innerHTML = "";
    document.getElementById("allVowelsBought").classList.add("hide");
    if (round === 4) {
        setTimeout(function(){
                   setUpForBonusRound();
        }, 1000);
    }
    else {
        document.getElementById("currentRound").innerHTML = "Round: " + round;
        setTimeout(function(){
            handleNewPuzzle();
            document.getElementById("guessedLetters").innerHTML = guessedLetters.toString().replaceAll(","," ");
        }, 1000);
    }
    
}

function setBonusRoundPlayer(){
    var winningPlayerIndex = -1;
    var winningPlayerTotalPurse = 0;
    for (player in players){
        if (players[player].totalPurse > winningPlayerTotalPurse) {
            winningPlayerTotalPurse = players[player].totalPurse;
            winningPlayerIndex = player;
        }
    }
    currentPlayerIndex = winningPlayerIndex;
    updatePlayerInfoOutput();
}

function getBonusRoundCategoryOptions() {
    var options = [];
    var allCategories = ["Phrase","Rhyme Time","What Are You Doing?","Title","Thing","Place","Before & After","Fun & Games",
                         "Person","Event","Things","Food & Drink","Song Lyrics","Same Letter","Show Biz","On The Map",
                         "People","Around The House","Living Things","Same Name","The 80's","The 90's","Quotation",
                         "Proper Name","Occupation","Fictional Character","College Life","In The Kitchen","Living Thing"];
    var randIndex = Math.floor(Math.random()*1000)%allCategories.length;
    options.push(allCategories[randIndex]);
    allCategories.splice(randIndex,1);
    randIndex = Math.floor(Math.random()*1000)%allCategories.length;
    options.push(allCategories[randIndex]);
    allCategories.splice(randIndex,1);
    randIndex = Math.floor(Math.random()*1000)%allCategories.length;
    options.push(allCategories[randIndex]);
    allCategories.splice(randIndex,1);
    return options;
}

function setBonusCategory(optionsArrayIndex) {
    document.getElementById("puzzleHint").innerHTML = optionsArray[optionsArrayIndex];
    switch (optionsArray[optionsArrayIndex]) {
        case "Phrase": puzzle = puzzles.Phrase[Math.floor(Math.random()*1000)%puzzles.Phrase.length];
            break;
        case "Rhyme Time": puzzle = puzzles.RhymeTime[Math.floor(Math.random()*1000)%puzzles.RhymeTime.length];
            break;
        case "What Are You Doing?": puzzle = puzzles.WhatAreYouDoing[Math.floor(Math.random()*1000)%puzzles.WhatAreYouDoing.length];
            break;
        case "Title": puzzle = puzzles.Title[Math.floor(Math.random()*1000)%puzzles.Title.length];
            break;
        case "Thing": puzzle = puzzles.Thing[Math.floor(Math.random()*1000)%puzzles.Thing.length];
            break;
        case "Place": puzzle = puzzles.Place[Math.floor(Math.random()*1000)%puzzles.Place.length];
            break;
        case "Before & After": puzzle = puzzles.BeforeAndAfter[Math.floor(Math.random()*1000)%puzzles.BeforeAndAfter.length];
            break;
        case "Fun & Games": puzzle = puzzles.FunAndGames[Math.floor(Math.random()*1000)%puzzles.FunAndGames.length];
            break;
        case "Person": puzzle = puzzles.Person[Math.floor(Math.random()*1000)%puzzles.Person.length];
            break;
        case "Event": puzzle = puzzles.Event[Math.floor(Math.random()*1000)%puzzles.Event.length];
            break;
        case "Things": puzzle = puzzles.Things[Math.floor(Math.random()*1000)%puzzles.Things.length];
            break;
        case "Food & Drink": puzzle = puzzles.FoodAndDrink[Math.floor(Math.random()*1000)%puzzles.FoodAndDrink.length];
            break;
        case "Song Lyrics": puzzle = puzzles.SongLyrics[Math.floor(Math.random()*1000)%puzzles.SongLyrics.length];
            break;
        case "Same Letter": puzzle = puzzles.SameLetter[Math.floor(Math.random()*1000)%puzzles.SameLetter.length];
            break;
        case "Show Biz": puzzle = puzzles.ShowBiz[Math.floor(Math.random()*1000)%puzzles.ShowBiz.length];
            break;
        case "On The Map": puzzle = puzzles.OnTheMap[Math.floor(Math.random()*1000)%puzzles.OnTheMap.length];
            break;
        case "People": puzzle = puzzles.People[Math.floor(Math.random()*1000)%puzzles.People.length];
            break;
        case "Around The House": puzzle = puzzles.AroundTheHouse[Math.floor(Math.random()*1000)%puzzles.AroundTheHouse.length];
            break;
        case "Living Things": puzzle = puzzles.LivingThings[Math.floor(Math.random()*1000)%puzzles.LivingThings.length];
            break;
        case "Same Name": puzzle = puzzles.SameName[Math.floor(Math.random()*1000)%puzzles.SameName.length];
            break;
        case "The 80's": puzzle = puzzles.TheEighties[Math.floor(Math.random()*1000)%puzzles.TheEighties.length];
            break;
        case "The 90's": puzzle = puzzles.TheNinties[Math.floor(Math.random()*1000)%puzzles.TheNinties.length];
            break;
        case "Quotation": puzzle = puzzles.Quotation[Math.floor(Math.random()*1000)%puzzles.Quotation.length];
            break;
        case "Proper Name": puzzle = puzzles.ProperName[Math.floor(Math.random()*1000)%puzzles.ProperName.length];
            break;
        case "Occupation": puzzle = puzzles.Occupation[Math.floor(Math.random()*1000)%puzzles.Occupation.length];
            break;
        case "Fictional Character": puzzle = puzzles.FictionalCharacter[Math.floor(Math.random()*1000)%puzzles.FictionalCharacter.length];
            break;
        case "College Life": puzzle = puzzles.CollegeLife[Math.floor(Math.random()*1000)%puzzles.CollegeLife.length];
            break;
        case "In The Kitchen": puzzle = puzzles.InTheKitchen[Math.floor(Math.random()*1000)%puzzles.InTheKitchen.length];
            break;
        case "Living Thing": puzzle = puzzles.LivingThing[Math.floor(Math.random()*1000)%puzzles.LivingThing.length];
            break;
    }
    document.getElementById("bonusRoundModal").style.display = "none";
    alert("Spin for your bonus!");
}

function guessBonusRound() {
    for (letter in guessedLetters) {
        var guess = guessedLetters[letter];
        for (solvedPuzzleLetter in solvedPuzzle) {
            if (guess === solvedPuzzle[solvedPuzzleLetter][1]) {
                document.getElementById(solvedPuzzle[solvedPuzzleLetter][0]).innerHTML = solvedPuzzle[solvedPuzzleLetter][1];
            }
        }
    }
}

function submitBonusLetters(){
    guessedLetters.push(document.getElementById("c1").value.substring(0,1).toUpperCase());
    guessedLetters.push(document.getElementById("c2").value.substring(0,1).toUpperCase());
    guessedLetters.push(document.getElementById("c3").value.substring(0,1).toUpperCase());
    if (players[currentPlayerIndex].hasWild) {
        guessedLetters.push(document.getElementById("c4").value.substring(0,1).toUpperCase());
    }
    guessedLetters.push(document.getElementById("v1").value.substring(0,1).toUpperCase());
    document.getElementById("bonusRoundModal").style.display = "none";
    document.getElementById("guessedLetters").innerHTML = guessedLetters.toString().replaceAll(","," ");
    guessBonusRound();
}

function setUpForBonusRound() {
    document.getElementById("currentRound").innerHTML = "Round: Bonus";
    clearBoard();
    document.getElementById("guessedLetters").innerHTML = guessedLetters.toString().replaceAll(","," ");
    setBonusRoundPlayer();
    document.getElementById("puzzleSolveBtn").style.display = "none";
    document.getElementById("bonusPuzzleSolveBtn").style.display = "block";
    // randomly select three categories - Done
    optionsArray = getBonusRoundCategoryOptions();
    // let user select one of the categories - Done
    document.getElementById("bonusModalContent").innerHTML = "<div><div>" + players[currentPlayerIndex].name + ", please select a category!</div><div class='bonusOption' onclick='setBonusCategory(0)'>" + optionsArray[0] + "</div>" + "<div class='bonusOption' onclick='setBonusCategory(1)'>" + optionsArray[1] + "</div>" + "<div class='bonusOption'  onclick='setBonusCategory(2)'>" + optionsArray[2] + "</div></div>";
    document.getElementById("bonusRoundModal").style.display = "block";
}

function handleBonusRound(){
    // Spin - Done
    // randomly select a puzzle from that category - Done
    setNewPuzzle(false);
    // auto guess RSTLNE - Done
    guessedLetters = ["R","S","T","L","N","E"];
    document.getElementById("guessedLetters").innerHTML = guessedLetters.toString().replaceAll(","," ");
    guessBonusRound();
    setTimeout(function(){
        // let player pick 3 consonants and 1 vowel (4 consonants if player has wild) - Done
        document.getElementById("bonusModalContent").innerHTML = "<div><input id='c1' placeholder='Consonant'></input><input id='c2' placeholder='Consonant'></input><input id='c3' placeholder='Consonant'>" + (players[currentPlayerIndex].hasWild ? "<input id='c4' placeholder='Consonant'></input>" : "") + "</input><input id='v1' placeholder='Vowel'></input><button onclick='submitBonusLetters()'>Submit Letters</button></div>";
        document.getElementById("bonusRoundModal").style.display = "block";
    }, 10000);
}

window.addEventListener("load", clearBoard());
