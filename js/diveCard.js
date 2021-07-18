var allDiveCards = [];
var diveCount = 6; // 6 or 11
var judgeCount = 3; // 3, 5, 7
var boardHeight = 10; // 1, 3, 10

function addDiver() {
    var diveListArray = []
    
    for (var i = 0; i < diveCount; i++){
        diveListArray.push({
                            "number":"",
                            "name":"",
                            "DD":null,
                            "judge1":null,
                            "judge2":null,
                            "judge3":null,
                            "judge4":null,
                            "judge5":null,
                            "judge6":null,
                            "judge7":null,
                            "score":null,
                            });
    }
    allDiveCards.push([allDiveCards.length+1, "", "", diveListArray, 0, 0, null]);
    reprintDivers();
}

function reprintDivers() {
    if (diveCount === 6) {
        document.getElementById("diverTable").innerHTML = "<tr><th>Rank</th><th>Name</th><th>Team</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>Score</th><th>To Win</th><th>AVG to Win</th></tr>";
    }
    else if (diveCount === 11) {
        document.getElementById("diverTable").innerHTML = "<tr><th>Rank</th><th>Name</th><th>Team</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>Score</th><th>To Win</th><th>AVG to Win</th></tr>";
    }
    for (diveCard in allDiveCards) {
        var rank = "<td>" + allDiveCards[diveCard][0] + "</td>"; // Need to reorder list to make this accurate
        var name = "<td><input id='diverName"+diveCard+"1' value='" + allDiveCards[diveCard][1] + "' onchange='updateName("+diveCard+",1)'></input></td>";
        var team = "<td><input id='diverTeam"+diveCard+"2' value='" + allDiveCards[diveCard][2] + "' onchange='updateTeam("+diveCard+",2)'></input></td>";
        var diveOne = getDiverDiveBlock(diveCard,3,0);
        var diveTwo = getDiverDiveBlock(diveCard,3,1);
        var diveThree = getDiverDiveBlock(diveCard,3,2);
        var diveFour = getDiverDiveBlock(diveCard,3,3);
        var diveFive = getDiverDiveBlock(diveCard,3,4);
        var diveSix = getDiverDiveBlock(diveCard,3,5);
        var diveSeven = "";
        var diveEight = "";
        var diveNine = "";
        var diveTen = "";
        var diveEleven = "";
        var score = "<td>" + allDiveCards[diveCard][4] + "</td>";
        var toWin = "<td>" + allDiveCards[diveCard][5] + "</td>";
        var avgToWin = "<td>" + (allDiveCards[diveCard][6] === null ? "-" : allDiveCards[diveCard][6]) + "</td>";
        if (diveCount === 6) {
            document.getElementById("diverTable").innerHTML += "<tr class='"+(diveCard%2===1 ? "evenRowBackground" : "")+"'>" + rank + name + team + diveOne + diveTwo + diveThree + diveFour + diveFive + diveSix + score + toWin + avgToWin + "</tr>";
        }
        else if (diveCount === 11) {
            diveSeven = getDiverDiveBlock(diveCard,3,6);
            diveEight = getDiverDiveBlock(diveCard,3,7);
            diveNine = getDiverDiveBlock(diveCard,3,8);
            diveTen = getDiverDiveBlock(diveCard,3,9);
            diveEleven = getDiverDiveBlock(diveCard,3,10);
            document.getElementById("diverTable").innerHTML += "<tr class='"+(diveCard%2===1 ? "evenRowBackground" : "")+"'>" + rank + name + team + diveOne + diveTwo + diveThree + diveFour + diveFive + diveSix + diveSeven + diveEight + diveNine + diveTen + diveEleven + score + toWin + avgToWin + "</tr>";
        }
    }
    
}

function getDiverDiveBlock(diveCard,diverIndex,diveIndex) {
    var diveNumberInput = "<input id='number"+diveCard.toString()+(diveIndex+1).toString()+"' value='"+allDiveCards[diveCard][diverIndex][diveIndex].number+"' onchange='updateDiveNumber("+diveCard+","+(diveIndex+1)+")'></input>";
    var diveName = "<div>"+ (allDiveCards[diveCard][diverIndex][diveIndex].name === "" ? "-" : allDiveCards[diveCard][diverIndex][diveIndex].name) +"</div>";
    var diveDD = "<div>"+(allDiveCards[diveCard][diverIndex][diveIndex].DD === null ? "-" : allDiveCards[diveCard][diverIndex][diveIndex].DD)+"</div>";
//    var diveScore = "<div>"+(allDiveCards[diveCard][diverIndex][diveIndex].score === null ? "-" : allDiveCards[diveCard][diverIndex][diveIndex].score)+"</div>";
    var diveScore = "<button onclick='showJudgeScoreModal("+diveCard+","+diveIndex+")'>"+(allDiveCards[diveCard][3][diveIndex].score === null ? "Score" : allDiveCards[diveCard][3][diveIndex].score)+"</button>";
    return "<td>"+diveNumberInput+diveName+diveDD+diveScore+"</td>"
}

function updateName(diveCard,nameIndex) {
    allDiveCards[diveCard][nameIndex] = document.getElementById("diverName"+diveCard+nameIndex).value;
}

function updateTeam(diveCard,teamIndex) {
    allDiveCards[diveCard][teamIndex] = document.getElementById("diverTeam"+diveCard+teamIndex).value;
}

function updateDiveNumber(diveCard,diveNumber) {
    var cardDiveNumber = document.getElementById("number"+diveCard.toString() + diveNumber.toString()).value;
    if (boardHeight == 1) {
        if (platFormDives.one[cardDiveNumber] !== undefined) {
            allDiveCards[diveCard][3][diveNumber-1].number = cardDiveNumber;
            allDiveCards[diveCard][3][diveNumber-1].name = platFormDives.one[cardDiveNumber].name;
            allDiveCards[diveCard][3][diveNumber-1].DD = platFormDives.one[cardDiveNumber].DD;
            reprintDivers();
        }
        else {
            alert("You have entered a dive that does not exist!");
        }
    }
    else if (boardHeight == 3) {
        if (platFormDives.three[cardDiveNumber] !== undefined) {
            allDiveCards[diveCard][3][diveNumber-1].number = cardDiveNumber;
            allDiveCards[diveCard][3][diveNumber-1].name = platFormDives.three[cardDiveNumber].name;
            allDiveCards[diveCard][3][diveNumber-1].DD = platFormDives.three[cardDiveNumber].DD;
            reprintDivers();
        }
        else {
            alert("You have entered a dive that does not exist!");
        }
    }
    else if (boardHeight == 10) {
        if (platFormDives.ten[cardDiveNumber] !== undefined) {
            allDiveCards[diveCard][3][diveNumber-1].number = cardDiveNumber;
            allDiveCards[diveCard][3][diveNumber-1].name = platFormDives.ten[cardDiveNumber].name;
            allDiveCards[diveCard][3][diveNumber-1].DD = platFormDives.ten[cardDiveNumber].DD;
            reprintDivers();
        }
        else {
            alert("You have entered a dive that does not exist!");
        }
    }
}

function updateJudgesScoreModal(diveCard,diveIndex) {
    document.getElementById("judgeScoreInput").innerHTML = "";
    document.getElementById("judgeModalHeader").innerHTML = "<div class='modalHeaderElements'>Diver Name: " + allDiveCards[diveCard][1] + "</div>";
    document.getElementById("judgeModalHeader").innerHTML += "<div class='modalHeaderElements'>Dive Number: " + allDiveCards[diveCard][3][diveIndex].number + "</div>";
    document.getElementById("judgeModalHeader").innerHTML += "<div class='modalHeaderElements'>Dive Name: " + allDiveCards[diveCard][3][diveIndex].name + "</div>";
    document.getElementById("judgeModalHeader").innerHTML += "<div class='modalHeaderElements'>Dive Degree of Difficulty: " + allDiveCards[diveCard][3][diveIndex].DD + "</div>";
    
    for (var i = 1; i <= judgeCount; i++){
        var judgeScore = "";
        switch (i) {
            case 1: judgeScore = allDiveCards[diveCard][3][diveIndex].judge1;
                break;
            case 2: judgeScore = allDiveCards[diveCard][3][diveIndex].judge2;
                break;
            case 3: judgeScore = allDiveCards[diveCard][3][diveIndex].judge3;
                break;
            case 4: judgeScore = allDiveCards[diveCard][3][diveIndex].judge4;
                break;
            case 5: judgeScore = allDiveCards[diveCard][3][diveIndex].judge5;
                break;
            case 6: judgeScore = allDiveCards[diveCard][3][diveIndex].judge6;
                break;
            case 7: judgeScore = allDiveCards[diveCard][3][diveIndex].judge7;
                break;
        }
        document.getElementById("judgeScoreInput").innerHTML += "<div class='individualJudge"+judgeCount+"'><div>Judge "+i+"</div><input id='judge"+i+"' type='number' min='0' max='10' value='"+judgeScore+"'></input></div>";
    }
    document.getElementById("judgeScoreInput").innerHTML += "<button onclick='calculateSingleDiveScore("+diveCard+","+diveIndex+")'>Calculate Score</button>";
}

// When the user clicks on the button, open the modal
function showJudgeScoreModal(diveCard,diveIndex) {
    updateJudgesScoreModal(diveCard,diveIndex);
    document.getElementById("judgesModal").style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function hideJudgeScoreModal() {
    document.getElementById("judgesModal").style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == document.getElementById("judgesModal")) {
        document.getElementById("judgesModal").style.display = "none";
    }
}

function calculateSingleDiveScore(diveCard,diveIndex) {
    var score = 0;
    var scoreArray = [];
    var hasError = false;
    for (var i = 1; i <= judgeCount; i++) {
        if (parseFloat(document.getElementById("judge" + i).value)%.5 === 0) {
            scoreArray.push(parseFloat(document.getElementById("judge" + i).value));
        }
        else {
            hasError = true;
            alert("Judge " + i + " has an invalid score");
        }
    }
    if (allDiveCards[diveCard][3][diveIndex].DD === null) {
        hasError = true;
        alert("You have not entered a Degree of Difficulty (DD) for this dive!");
    }
    if (!hasError) {
        if (judgeCount === 3) {
            allDiveCards[diveCard][3][diveIndex].judge1 = scoreArray[0];
            allDiveCards[diveCard][3][diveIndex].judge2 = scoreArray[1];
            allDiveCards[diveCard][3][diveIndex].judge3 = scoreArray[2];
            score = scoreArray[0] + scoreArray[1] + scoreArray[2];
        }
        else if (judgeCount === 5) {
            allDiveCards[diveCard][3][diveIndex].judge1 = scoreArray[0];
            allDiveCards[diveCard][3][diveIndex].judge2 = scoreArray[1];
            allDiveCards[diveCard][3][diveIndex].judge3 = scoreArray[2];
            allDiveCards[diveCard][3][diveIndex].judge4 = scoreArray[3];
            allDiveCards[diveCard][3][diveIndex].judge5 = scoreArray[4];
            scoreArray.sort();
            score = scoreArray[1] + scoreArray[2] + scoreArray[3];
        }
        else if (judgeCount === 7) {
            allDiveCards[diveCard][3][diveIndex].judge1 = scoreArray[0];
            allDiveCards[diveCard][3][diveIndex].judge2 = scoreArray[1];
            allDiveCards[diveCard][3][diveIndex].judge3 = scoreArray[2];
            allDiveCards[diveCard][3][diveIndex].judge4 = scoreArray[3];
            allDiveCards[diveCard][3][diveIndex].judge5 = scoreArray[4];
            allDiveCards[diveCard][3][diveIndex].judge6 = scoreArray[5];
            allDiveCards[diveCard][3][diveIndex].judge7 = scoreArray[6];
            scoreArray.sort();
            score = scoreArray[2] + scoreArray[3] + scoreArray[4];
        }
    }
    allDiveCards[diveCard][3][diveIndex].score = parseFloat((score * allDiveCards[diveCard][3][diveIndex].DD).toFixed(2));
    calculateDiverTotalScore(diveCard);
    hideJudgeScoreModal();
    reprintDivers();
}

function setDiveCount(count) {
    allDiveCards = [];
    diveCount = count;
    addDiver();
    reprintDivers();
}

function setJudgeCount(count) {
    judgeCount = count;
    reprintDivers();
}

function setMeter(height) {
    allDiveCards = [];
    boardHeight = height;
    addDiver();
    reprintDivers();
}

function calculateDiverTotalScore(diveCard){
    allDiveCards[diveCard][4] = 0;
    for (var i = 0; i < diveCount; i++) {
        if (allDiveCards[diveCard][3][i].score !== null) {
            allDiveCards[diveCard][4] += allDiveCards[diveCard][3][i].score
        }
    }
    allDiveCards[diveCard][4] = parseFloat(allDiveCards[diveCard][4].toFixed(2));
    sortDiversBasedOnTotalScore();
}

function sortDiversBasedOnTotalScore() {
    allDiveCards = allDiveCards.sort(function(a,b) {
                   return b[4] - a[4];
                   });
    for (diveCard in allDiveCards) {
        allDiveCards[diveCard][0] = parseInt(diveCard)+1;
        allDiveCards[diveCard][5] = parseFloat((allDiveCards[0][4] - allDiveCards[diveCard][4]).toFixed(2));
        var remainingDives = 0;
        for (var i = 0; i < allDiveCards[diveCard][3].length; i++) {
            if (allDiveCards[diveCard][3][i].score === null) {
                remainingDives++;
            }
        }
        if (remainingDives !== 0) {
            allDiveCards[diveCard][6] = parseFloat((allDiveCards[diveCard][5] / remainingDives).toFixed(2));
        }
    }
}

window.addEventListener("load", addDiver());
