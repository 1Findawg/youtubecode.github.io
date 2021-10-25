//Hashing Algorithm Code: https://geraintluff.github.io/sha256/

var password = "";
var salt = "";
var columnHeaders = ["","Numbers Only","One Case","Uppercase and Lowercase", "Letters and Numbers", "Letters, Numbers and Special Characters","Brute Force"];
var columnData = [["Password",0,0,0,0,0,0],["w/ Salt",0,0,0,0,0,0]];
var oneThousand = 0;

function updatePassword() {
    password = document.getElementById("passwordInput").value;
    salt = document.getElementById("saltInput").value;
    getTotalNumberOfPermutations();
    printStatsTable();
    addPasswordRow();
}

async function getTimeToSearch() {
    await search(1000);
}

function search(iterations) {
    for (let i = 0; i < iterations; i++) {
        sha256(i.toString()) === "";
    }
}

function getTotalNumberOfPermutations() {
    // 10 numbers only, 26 one case, 52 only letters,  62 all letters and all numbers, 95 all
    if (password.length > 0) {
        columnData[0][1] = Math.pow(10,password.length);
        columnData[0][2] = Math.pow(26,password.length);
        columnData[0][3] = Math.pow(52,password.length);
        columnData[0][4] = Math.pow(62,password.length);
        columnData[0][5] = Math.pow(95,password.length);
        columnData[0][6] = getBruteForceTime((columnData[0][5]/1000) * oneThousand);
        
        columnData[1][1] = Math.pow(10,password.length + salt.length);
        columnData[1][2] = Math.pow(26,password.length + salt.length);
        columnData[1][3] = Math.pow(52,password.length + salt.length);
        columnData[1][4] = Math.pow(62,password.length + salt.length);
        columnData[1][5] = Math.pow(95,password.length + salt.length);
        columnData[1][6] = getBruteForceTime((columnData[1][5]/1000) * oneThousand);
    } else {
        columnData[0][1] = 0;
        columnData[0][2] = 0;
        columnData[0][3] = 0;
        columnData[0][4] = 0;
        columnData[0][5] = 0;
        
        columnData[1][1] = 0;
        columnData[1][2] = 0;
        columnData[1][3] = 0;
        columnData[1][4] = 0;
        columnData[1][5] = 0;
    }
}

function getBruteForceTime(days) {
    if (days < 1){
        return "< day";
    } else if (days < 365){
        return days.toFixed(1) + " days";
    } else if (days < 3650){
        return (days / 365).toFixed(2) + " years";
    } else if (days < 36525){
        return (days / 3650).toFixed(2) + " decades";
    } else if (days < 365250){
        return (days / 36525).toFixed(2) + " centuries";
    } else {
        return (days / 365250).toFixed(2) + " millenniums";
    }
}

function printStatsTable() {
    var columnHeaderHtml = "";
    var columnDataHtml0 = "";
    var columnDataHtml1 = "";
    
    for (let columnHeader in columnHeaders) {
        
        if (columnHeader == 0) {
            columnHeaderHtml += "<th>" + columnHeaders[columnHeader] + "</th>";
            columnDataHtml0 += "<th>" + columnData[0][columnHeader] + "</th>";
            columnDataHtml1 += "<th>" + columnData[1][columnHeader] + "</th>";
        }
        else {
            columnHeaderHtml += "<th>" + columnHeaders[columnHeader] + "</th>";
            columnDataHtml0 += "<td>" + columnData[0][columnHeader] + "</td>";
            columnDataHtml1 += "<td>" + columnData[1][columnHeader] + "</td>";
        }
    }

    document.getElementById("searchStatsTable").innerHTML = "<tr>" + columnHeaderHtml + "</tr>" + "<tr>" + columnDataHtml0 + "</tr>" +  "<tr>" + columnDataHtml1 + "</tr>";
}

function addPasswordRow() {
    let tempRowArray = "<td class='hashText'>" + password + "</td>" + "<td class='hashText'>" + sha256(password) + "</td>" + "<td class='hashText'>" + password + "<strong>" + salt + "</strong>" + "</td>" + "<td class='hashText'>" + sha256(password + salt) + "</td>";
    document.getElementById("permutationsTable").innerHTML += "<tr>" + tempRowArray + "</tr>";
}

function setPasswordTableHeaders() {
    let tempHeaderRowArray = "<th>Password</th>" + "<th>Hash</th>" + "<th>w/ Salt</th>" + "<th>Hash w/ Salt</th>";
    document.getElementById("permutationsTable").innerHTML += "<tr>" + tempHeaderRowArray + "</tr>";
}

// Below code was copied and pasted from https://geraintluff.github.io/sha256/
function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };
    
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''
    
    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
    
    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    /*/
     var hash = [], k = [];
     var primeCounter = 0;
     //*/
    
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }
    
    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
        for (i = 0; i < ascii[lengthProperty]; i++) {
            j = ascii.charCodeAt(i);
            if (j>>8) return; // ASCII check: only accept characters in range 0-255
            words[i>>2] |= j << ((3 - i)%4)*8;
        }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)
    
    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);
        
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if
            var w15 = w[i - 15], w2 = w[i - 2];
            
            // Iterate
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
            + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
            + ((e&hash[5])^((~e)&hash[6])) // ch
            + k[i]
            // Expand the message schedule if needed
            + (w[i] = (i < 16) ? w[i] : (
                                         w[i - 16]
                                         + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                                         + w[i - 7]
                                         + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                                         )|0
               );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
            + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
            
            hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1)|0;
        }
        
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0;
        }
    }
    
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i]>>(j*8))&255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};

function passwordSecurityLoad() {
    printStatsTable();
    setPasswordTableHeaders();
    let start = new Date();
    getTimeToSearch();
    let done = new Date();
    oneThousand = ((done - start) / (1000 * 60 * 60 * 24));
}

window.addEventListener("load", passwordSecurityLoad());
