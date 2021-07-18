var caseValues = [0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000];
var selectedCaseValues = [];
var unselectedCaseValues = [0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000];
var playersCase = null;
var casesToSelect = 6;
var listOfOffers = [];
var madeDeal = false;

function randomizeValues() {
    for (value in caseValues) {
        var randIndex = Math.floor(Math.random()*100)%26;
        var tempValue = caseValues[value];
        caseValues[value] = caseValues[randIndex];
        caseValues[randIndex] = tempValue;
    }
}

function selectCase(caseIndex) {
    var caseNumber = caseIndex+1;
    var caseValue = caseValues[caseIndex];
    document.getElementById("case"+caseIndex).classList.add('hiddenCase');
    if (playersCase !== null) {
        document.getElementById("selectedCaseValue").innerHTML = "Case " + caseNumber + ": $" + caseValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        document.getElementById("selectedCaseModal").style.display = "block";
        setTimeout(function(){ document.getElementById("selectedCaseModal").style.display = "none"; }, 2000);
        document.getElementById(caseValues[caseIndex].toString()).classList.remove('valueNotFound');
        document.getElementById(caseValues[caseIndex].toString()).classList.add('valueFound');
        selectedCaseValues.push(caseValues[caseIndex]);
        var index = unselectedCaseValues.indexOf(caseValues[caseIndex]);
        if (index !== -1) {
            unselectedCaseValues.splice(index, 1);
        }
        casesToSelect -= 1;
        if (!madeDeal) {
            document.getElementById("userInstruction").innerHTML = "Select " + casesToSelect + " cases";
        }
        
    }
    else {
        playersCase = caseIndex+1;
        document.getElementById("selectedCase").innerHTML = playersCase;
        if (!madeDeal) {
            document.getElementById("userInstruction").innerHTML = "Select " + casesToSelect + " cases";
        }
    }
    
    switch(selectedCaseValues.length) {
        case 6: casesToSelect = 5;
            offer(); // first round 6 cases
            break;
        case 11: casesToSelect = 4;
            offer(); // second round 5 cases
            break;
        case 15: casesToSelect = 3;
            offer(); // third round 4 cases
            break;
        case 18: casesToSelect = 2;
            offer(); // fourth round 3 cases
            break;
        case 20: casesToSelect = 1;
            offer(); // fifth round 2 cases
            break;
        case 21: casesToSelect = 1;
            offer(); // sixth round 1 case
            break;
        case 22: casesToSelect = 1;
            offer(); // seventh round 1 case
            break;
        case 23: casesToSelect = 1;
            offer(); // eighth round 1 case
            break;
        case 24: casesToSelect = 1;
            offer(); // ninth round 1 case
            break;
    }
}

function offer() {
//    https://www.reddit.com/r/askmath/comments/696pxs/deal_or_no_deal_figuring_out_the_deal_formula/
    if (!madeDeal) {
        setTimeout(function(){
            var casesRemaining = unselectedCaseValues.length;
            var remainingCaseAverage = 0;
            for (values in unselectedCaseValues) {
                remainingCaseAverage += unselectedCaseValues[values];
            }
            remainingCaseAverage = parseFloat((remainingCaseAverage/casesRemaining).toFixed(2));
            var highestRemainingValue = unselectedCaseValues[unselectedCaseValues.length-1];
            var secondElement = (0.748*remainingCaseAverage);
            var thirdElement = (2714.74*casesRemaining);
            var fourthElement = (0.40*highestRemainingValue);
            var fifthElement = (0.0000006986*(Math.pow(remainingCaseAverage,2)));
            var sixthElement = (32.623*(Math.pow(casesRemaining,2)));
            var result = parseFloat(Math.abs(12275.30 + secondElement - thirdElement - fourthElement + fifthElement + sixthElement))
            if ((result < unselectedCaseValues[0]) || (result > unselectedCaseValues[unselectedCaseValues.length-1])) {
                   console.log("Getting Average");
                   result = (unselectedCaseValues[unselectedCaseValues.length-1] - unselectedCaseValues[0])/2;
            }
            result = result.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            listOfOffers.push(result);
            updatePreviousOffersString();
            document.getElementById("offerValue").innerHTML = "Banker Offer: $" + result;
            document.getElementById("dealOrNoDealModal").style.display = "block";
        }, 2000);
    }
}

function updatePreviousOffersString() {
    if (listOfOffers.length > 1){
        document.getElementById("previousOffers").classList.add('previousOffersWidth');
        document.getElementById("previousOffers").innerHTML = "<div>Previous Offers:</div>";
        for (var i = 0; i < listOfOffers.length-1; i++) {
            document.getElementById("previousOffers").innerHTML += ("<div>$" + listOfOffers[i] + "</div>");
        }
    }
}

function deal() {
    madeDeal = true;
    document.getElementById("userInstruction").innerHTML = "You won $" + (listOfOffers[listOfOffers.length-1]);
    document.getElementById("dealOrNoDealModal").style.display = "none";
}

function noDeal() {
    document.getElementById("dealOrNoDealModal").style.display = "none";
    document.getElementById("userInstruction").innerHTML = "Select " + casesToSelect + " cases";
}

window.addEventListener("load", randomizeValues());
