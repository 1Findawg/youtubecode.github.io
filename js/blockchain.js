//Project inspired by: Anders Brownworth
//His Videos: https://youtu.be/_160oMzblY8 https://youtu.be/xIDL_akeras
//His Website: http://anders.com/blockchain/
//His code: https://github.com/anders94/blockchain-demo
//MIT License
//
//Copyright (c) 2016 Anders Brownworth
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//Hashing Algorithm Code: https://geraintluff.github.io/sha256/


var hexString = "ffff";
var mostSignificantCount = hexString.length;

// id, nonce, data, previousHash, hash
var blockchain = [[0,322373,"","0","fffffe96de257d33b3ad11f4aa73158fb9790d7e8174f8e062113fd97c657267"]];

function addBlock() {
    var newIndex = blockchain.length;
    var prevIndex = newIndex - 1;
    blockchain.push([newIndex,0,"",blockchain[prevIndex][4],null]);
    var totalData = getDataJson(blockchain[newIndex][0], blockchain[newIndex][1], blockchain[newIndex][2], blockchain[newIndex][3]);
    blockchain[newIndex][4] = sha256(totalData);
    reprintAllBlocks();
}

function reprintAllBlocks() {
    updateAllPreviousHash();
    document.getElementById("cardWrapper").innerHTML = "";
    for (block in blockchain) {
        var blockId = "Block Id: <input id='blockchainIdInput"+blockchain[block][0]+"' value='"+blockchain[block][0]+"' onchange='updateBlockId("+blockchain[block][0]+")'></input>";
        var nonce = "Nonce: <input id='blockchainNonceInput"+blockchain[block][0]+"' onchange='updateBlockNonce("+blockchain[block][0]+")' value='"+ blockchain[block][1] +"'></input>";
        var data = "Data: <input id='blockchainDataInput"+blockchain[block][0]+"' onchange='updateBlockData("+blockchain[block][0]+")' value='"+ blockchain[block][2] +"'></input>";
        var prevHash = "<div>Previous Hash: <input id='blockchainPrevHashInput"+blockchain[block][0]+"' class='previousHashInput' value='"+blockchain[block][3]+"' onchange='updateBlockPrevHash("+blockchain[block][0]+")'></input></div>";
        var inputs = "<div>" + blockId + nonce + data + prevHash + "</div>";
        var hash = "<div>Hash: <div id='blockchainHashOutput"+blockchain[block][0]+"'>" + blockchain[block][4] + "</div></div>";
        var searchButton = "<button onclick='searchForNonce("+blockchain[block][0]+")' class='searchBtn'>Search For Nonce</button>";
        
        document.getElementById("cardWrapper").innerHTML += "<div id='card"+blockchain[block][0]+"' class='"+(blockchain[block][4].substring(0, mostSignificantCount) === hexString ? "card verified" : "card notVerified")+"'>" + inputs + hash + searchButton + "</div>";
    }
}

function updateAllPreviousHash() {
    for (block in blockchain) {
        if (block > 0) {
            blockchain[block][3] = blockchain[block-1][4];
            blockchain[block][4] = sha256(getDataJson(blockchain[block][0],blockchain[block][1],blockchain[block][2],blockchain[block][3]));
        }
    }
}

function updateHexStringInput() {
    hexString = document.getElementById("hexStringInput").value;
    mostSignificantCount = hexString.length;
    reprintAllBlocks();
}

function updateBlockId(blockchainIndex) {
    blockchain[blockchainIndex][0] = parseInt(document.getElementById("blockchainIdInput"+blockchainIndex).value);
    inputChanged(blockchainIndex);
}

function updateBlockNonce(blockchainIndex) {
    blockchain[blockchainIndex][1] = parseInt(document.getElementById("blockchainNonceInput"+blockchainIndex).value);
    inputChanged(blockchainIndex);
}

function updateBlockData(blockchainIndex) {
    blockchain[blockchainIndex][2] = document.getElementById("blockchainDataInput"+blockchainIndex).value;
    inputChanged(blockchainIndex);
}

function updateBlockPrevHash(blockchainIndex) {
    blockchain[blockchainIndex][3] = document.getElementById("blockchainPrevHashInput"+blockchainIndex).value;
    inputChanged(blockchainIndex);
}

function searchForNonce(blockchainIndex) {
    var blockId = blockchain[blockchainIndex][0];
    var nonce = blockchain[blockchainIndex][1];
    var data = blockchain[blockchainIndex][2];
    var previousHash = blockchain[blockchainIndex][3];
    var hash = blockchain[blockchainIndex][4];
    var startNonce = 0;
    var verification = verifyCurrentInput(blockchainIndex);
    if (verification[0] === true) {
        document.getElementById("blockchainHashOutput"+blockchainIndex).innerHTML = verification[1];
        document.getElementById("card"+blockchainIndex).classList.remove('notVerified');
        document.getElementById("card"+blockchainIndex).classList.add('verified');
    }
    else {
        hash = null;
        while (hash === null && startNonce < 5000000) {
            hash = cycleToGetHash(startNonce,startNonce + 1000000,blockId, data, previousHash);
            startNonce = startNonce + 1000000;
        }
        blockchain[blockchainIndex][1] = hash[0];
        blockchain[blockchainIndex][4] = hash[1];
        document.getElementById("blockchainNonceInput"+blockchainIndex).value = blockchain[blockchainIndex][1];
        document.getElementById("blockchainHashOutput"+blockchainIndex).innerHTML = blockchain[blockchainIndex][4];
        document.getElementById("card"+blockchainIndex).classList.remove('notVerified');
        document.getElementById("card"+blockchainIndex).classList.add('verified');
    }
    reprintAllBlocks();
}

function verifyCurrentInput(blockchainIndex) {
    var tempHash = sha256(getDataJson(blockchain[blockchainIndex][0],blockchain[blockchainIndex][1],blockchain[blockchainIndex][2],blockchain[blockchainIndex][3]));
    if (tempHash.substring(0, mostSignificantCount) === hexString) {
        document.getElementById("blockchainHashOutput"+blockchainIndex).innerHTML = tempHash;
        document.getElementById("card"+blockchainIndex).classList.remove('notVerified');
        document.getElementById("card"+blockchainIndex).classList.add('verified');
        return [true,tempHash];
    }
    return [false,null];
}

function cycleToGetHash(nonceStart, nonceEnd, blockId, data, previousHash) {
    for (var i = nonceStart; i < nonceEnd; i++) {
        var tempHash = sha256(getDataJson(blockId,i,data,previousHash));
        if (tempHash.substring(0, mostSignificantCount) === hexString) {
            return [i,tempHash];
        }
    }
    return null;
}

function inputChanged(blockchainIndex) {
    var totalData = getDataJson(blockchain[blockchainIndex][0], blockchain[blockchainIndex][1], blockchain[blockchainIndex][2], blockchain[blockchainIndex][3]);
    blockchain[blockchainIndex][4] = sha256(totalData);
    document.getElementById("blockchainHashOutput"+blockchainIndex).innerHTML = blockchain[blockchainIndex][4];
    if (blockchain[blockchainIndex][4].substring(0, mostSignificantCount) === hexString) {
        document.getElementById("card"+blockchainIndex).classList.remove('notVerified');
        document.getElementById("card"+blockchainIndex).classList.add('verified');
    }
    else {
        document.getElementById("card"+blockchainIndex).classList.remove('verified');
        document.getElementById("card"+blockchainIndex).classList.add('notVerified');
    }
    reprintAllBlocks();
}

function getDataJson(blockId,nonce,data,previousHash) {
    return JSON.stringify({"blockid":blockId, "nonce":nonce, "data":data, "previousHash":previousHash});
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

