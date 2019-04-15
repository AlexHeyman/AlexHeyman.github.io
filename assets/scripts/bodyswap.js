//This script requires autoresize.js.

//Returns whether the specified string consists entirely of whitespace.
function isWhitespace(str) {
    return str.match(/^ *$/) !== null;
}

//Randomly shuffles the specified array in place using the Fisher-Yates
//shuffle algorithm. Returns the array.
function shuffle(array) {
    var currentIndex = array.length;
    //While there remain elements to shuffle,
    while (currentIndex !== 0) {
        //pick a remaining element
        var randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        //and swap it with the current element.
        var temp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temp;
    }
    return array;
}

//Takes an array of names and a swap type ("derangement", "permutation", or
//"two_way"), simulates a random swap of the specified type, and returns the
//results as a dictionary from names of minds to names of their new bodies.
function simulateSwap(names, swapType) {
    var results = {};
    if (swapType === "derangement") {
        //Bodies are a random derangement (permutation with no fixed points) of minds
        if (names.length === 1) {
            //If there's only one person, no derangement is possible, so they
            //just stay in their own body
            results[names[0]] = names[0];
        } else {
            var shuffledNames = shuffle(names.slice());
            //Keep shuffling the shuffled array of names until none of its names
            //are in the same positions as in the original array
            var i = 0;
            while (i < shuffledNames.length) {
                if (names[i] === shuffledNames[i]) {
                    shuffle(shuffledNames);
                    i = 0;
                } else {
                    i++;
                }
            }
            for (i = 0; i < names.length; i++) {
                results[names[i]] = shuffledNames[i];
            }
        }
    } else if (swapType === "permutation") {
        //Bodies are a random permutation of minds
        var shuffledNames = shuffle(names.slice());
        for (var i = 0; i < names.length; i++) {
            results[names[i]] = shuffledNames[i];
        }
    } else if (swapType === "two_way") {
        //Make as many random two-way swaps as possible given the number of names
        var shuffledNames = shuffle(names.slice());
        var i = shuffledNames.length % 2;
        //If there are an odd number of names, one person stays in their own body
        if (i === 1) {
            results[shuffledNames[0]] = shuffledNames[0];
        }
        //Swap consecutive elements of the rest of the shuffled names array
        for (; i + 1 < names.length; i += 2) {
            var mind1 = shuffledNames[i];
            var mind2 = shuffledNames[i + 1];
            results[mind1] = mind2;
            results[mind2] = mind1;
        }
    }
    return results;
}

function swap() {
    //Get array of names
    var names = [];
    var namesElement = document.getElementById("names");
    var rawNamesData = namesElement.value.split("\n");
    for (var i = 0; i < rawNamesData.length; i++) {
        var line = rawNamesData[i];
        if (!isWhitespace(line)
                && names.indexOf(line) === -1) { //Exclude duplicate names
            names.push(line);
        }
    }
    //Use names array to replace names element's content with a sanitized version
    namesElement.value = names.join("\n");
    resizeAutoResize(namesElement);
    //Get swap type
    var swapTypeElement = document.getElementById("swap_type");
    var swapType = swapTypeElement.options[swapTypeElement.selectedIndex].value;
    //Do the actual swap and get the results as a dictionary from names of
    //minds to names of their new bodies
    var mindsToBodies = simulateSwap(names, swapType);
    //Convert the dictionary into an array of "loops", each of which is an
    //array of names in which each element has the next's body, and the last
    //element has the first's body
    var loops = [];
    shuffle(names);
    while (names.length > 0) {
        var loop = [];
        //Get an arbitrary mind that hasn't yet been put into a loop
        var firstMind = names[names.length - 1];
        //Follow the loop, deleting minds from the names array as you encounter them
        var mind = firstMind;
        do {
            names.splice(names.indexOf(mind), 1);
            loop.push(mind);
            mind = mindsToBodies[mind];
        } while (mind !== firstMind);
        //Loop completed; add it to the array of loops
        loops.push(loop);
    }
    //Sort array of loops in increasing order of length
    loops.sort(function(a, b) {return a.length - b.length});
    //Generate HTML content of results element
    var content = [];
    for (var i = 0; i < loops.length; i++) {
        var loop = loops[i];
        if (loop.length === 1) {
            content.push(loop[0], " is in their own body.<br>");
        } else if (loop.length === 2) {
            content.push(loop[0], " and ", loop[1], " are in each other's bodies.<br>");
        } else {
            for (var j = 0; j < loop.length - 1; j++) {
                content.push(loop[j], " is in ", loop[j + 1], "'s body.<br>");
            }
            content.push(loop[loop.length - 1], " is in ", loop[0], "'s body.<br>");
        }
        content.push("<br>");
    }
    document.getElementById("results").innerHTML = content.join("");
}
