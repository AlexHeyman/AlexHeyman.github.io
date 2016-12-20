/*
Controls ../index.html's class icons display feature. Works for all years between 2000 and 2099.
*/
var cookies = updateCookies();
var classes = [];
var minYear = -1;
var maxYear = -1;
var currentYear = -1;
var numberNames = [["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"], ["twen", "thir", "four", "fif", "six", "seven", "eigh", "nine"]];
var marginSize = 16;
var iconsBox, facesBox, groupBox = null;
var facesDependents = [];
var groupDependents = [];
var yearDisplays = [];

/**
Updates the internal record of cookie data to reflect the current list of cookies. Intended for internal use only.
*/
function updateCookies() {
    var retVal = [];
    var pairs = document.cookie.split(";");
    for (var i = 0; i < pairs.length; i++) {
        retVal.push(pairs[i].split("="));
    }
    return retVal;
}

/**
Adds a cookie that lasts for 24 hours.
*/
function addCookie(key, value) {
    document.cookie = key + "=" + value + ";max-age=86400";
    cookies = updateCookies();
}

/**
Returns the cookie with a specified key, or null if there is none.
*/
function getCookie(key) {
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[i][0].valueOf() == key) {
            return cookies[i][1];
        }
    }
    return null;
}

/**
Converts the name of a number between 0 and 99 (e.g. "fortysix") into the number itself (e.g. 46).
*/
function yearNameToNumber(name) {
    name = new String(name);
    var onesDigit, tensDigit = 0;
    if (name.valueOf() == "ten") {
        return 10;
    }
    if (name.valueOf() == "eleven") {
        return 11;
    }
    if (name.valueOf() == "twelve") {
        return 12;
    }
    if (name.endsWith("teen")) {
        name = name.substring(0, name.length - 4);
        for(var i = 1; i < 8; i++) {
            if (name.valueOf() == numberNames[1][i]) {
                return 10 + i + 2;
            }
        }
    }
    for(var i = 0; i < 9; i++) { //Ones digit for numbers >= 20
        if (name.endsWith(numberNames[0][i])) {
            onesDigit = i + 1;
            name = name.substring(0, name.length - numberNames[0][i].length);
            break;
        }
    }
    for(var i = 0; i < 8; i++) { //Tens digit for numbers >= 20
        if ((i == 2 && name.valueOf() == "forty") || name.valueOf() == numberNames[1][i] + "ty") { //I hate you, forty
            tensDigit = i + 2;
            break;
        }
    }
    return tensDigit*10 + onesDigit;
}

/**
Converts a number between 0 and 99 (e.g. 46) into the name of that number (e.g. "fortysix").
*/
function yearNumberToName(number) {
    if (number < 1 || number > 99) {
        return "zero";
    }
    if (number == 10) {
        return "ten";
    }
    if (number == 11) {
        return "eleven";
    }
    if (number == 12) {
        return "twelve";
    }
    if (number >= 13 && number <= 19) {
        return numberNames[1][number - 12] + "teen";
    }
    var name = "";
    if (number >= 20) {
        var tensDigit = number % 10;
        if (tensDigit == 4) {
            name += "forty";
        } else {
            name += numberNames[1][tensDigit - 2] + "ty";
        }
        number -= tensDigit*10;
    }
    name += numberNames[0][(number % 10) - 1];
    
    return name;
}

/**
Returns the aesthetically best number of columns in which to display a specified number of icons.
*/
function getNumColumns(numIcons) {
    if (numIcons <= 1) {
        return 1;
    }
    if (numIcons <= 8) {
        return numIcons;
    }
    if (numIcons <= 32) {
        for (var columns = 8; columns >= 4; columns--) {
            if (numIcons % columns == 0) {
                return columns;
            }
        }
    }
    return 7;
}

/**
Returns the index in the list of class data of the specified year, of -1 if there is no data on that year.
*/
function indexOfYear(year) {
    for (var i = 0; i < classes.length; i++) {
        if (classes[i][0] == year) {
            return i;
        }
    }
    return -1;
}

/**
Displays the data of the chronologically first year on record.
*/
function displayFirst() {
    displayYear(minYear);
}

/**
Displays the data of the last year prior to the currently displayed year, or the last year if the first year is currently displayed.
*/
function displayPrevious() {
    if (currentYear == minYear) {
        displayLast();
    } else {
        var i = currentYear - 1;
        while (i <= maxYear && !displayYear(i)) {
            i--;
        }
    }
}

/**
Displays the data of the first year after the currently displayed year, or the first year if the last year is currently displayed.
*/
function displayNext() {
    if (currentYear == maxYear) {
        displayFirst();
    } else {
        var i = currentYear + 1;
        while (i >= minYear && !displayYear(i)) {
            i++;
        }
    }
}

/**
Displays the data of the chronologically last year on record.
*/
function displayLast() {
    displayYear(maxYear);
}

/**
Displays the class data of a specified year in the appropriate locations on the webpage.
*/
function displayYear(year) {
    var index = indexOfYear(year);
    if (index < 0) {
        return false;
    }
    currentYear = year;
    if (iconsBox != null) {
        iconsBox.style.display = "block";
    }
    if (facesBox != null) {
        if (year == 13) {
            //2012-2013's student data is hardcoded, since it's so different in appearance from every other year
            facesBox.style.display = "block";
            facesBox.style.width = 572;
            facesBox.innerHTML = "<a class=\"IconThirteen\" id=\"andrew\" href=\"dc_student_sites/thirteen/axu_website/index.html\"><section class=\"IconText\">Andrew</section></a><a class=\"IconThirteen\" id=\"jessica\" href=\"dc_student_sites/thirteen/jessicaswebsite/index.html\"><section class=\"IconText\">Jessica</section></a><a class=\"IconThirteen HorizontalLast\" id=\"elizabeth\" href=\"dc_student_sites/thirteen/mcnally_website/index.html\"><section class=\"IconText\">Elizabeth</section></a>";
        } else {
            displayIcons(index, false);
        }
    }
    if (groupBox != null) {
        displayIcons(index, true);
    }
    var text;
    if (year == 0) {
        text = "1999-2000";
    } else {
        text = "20" + (year - 1) + "-20" + year;
    }
    for (var i = 0; i < yearDisplays.length; i++) {
        yearDisplays[i].innerHTML = text;
    }
    addCookie("currentYear", year);
    return true;
}

/**
Displays the student data (groupprojects == false) or group project data (groupprojects == true) of the year at the specified index in the list of class data. Intended for internal use only.
*/
function displayIcons(index, groupprojects) {
    var container, dependents = null;
    if (groupprojects) {
        container = groupBox;
        dependents = groupDependents;
    } else {
        container = facesBox;
        dependents = facesDependents;
    }
    container.innerHTML = "";
    var yearData = classes[index];
    var type, width, height, columns, extraFolder = 0;
    var nameData = null;
    if (groupprojects) {
        type = yearData[7];
        width = yearData[8];
        height = yearData[9];
        nameData = yearData[10];
        columns = yearData[11];
        extraFolder = "group/";
    } else {
        type = yearData[2];
        width = yearData[3];
        height = yearData[4];
        nameData = yearData[5];
        columns = yearData[6];
        extraFolder = "";
    }
    if (nameData.length == 0) {
        container.style.display = "none";
        for (var i = 0; i < dependents.length; i++) {
            dependents[i].style.display = "none";
        }
        return;
    }
    var yearName = yearData[1];
    container.style.display = "block";
    for (var i = 0; i < dependents.length; i++) {
        dependents[i].style.display = "block";
    }
    container.style.width = width*columns + marginSize*(columns-1);
    var column = 0;
    for (var i = 0; i < nameData.length; i++) {
        var entry = nameData[i];
        var fileName = entry[1];
        var outerIcon;
        if (entry[2]) {
            outerIcon = document.createElement("SECTION");
        } else {
            outerIcon = document.createElement("A");
            var ownSite = entry[3];
            if (ownSite == null) {
                outerIcon.href = "dc_student_sites/" + yearName + "/" + extraFolder + fileName + "/index.html";
            } else {
                outerIcon.href = ownSite;
            }
        }
        outerIcon.classList.add("Icon");
        outerIcon.style.backgroundImage = "url(dc_student_sites/" + yearName + "/" + extraFolder + "icons/" + fileName + "." + type + ")";
        outerIcon.style.width = width;
        outerIcon.style.height = height;
        outerIcon.style.marginBottom = marginSize;
        if (column == columns - 1) {
            outerIcon.style.marginRight = 0;
            column = 0;
        } else {
            outerIcon.style.marginRight = marginSize;
            column++;
        }
        container.appendChild(outerIcon);
        var innerIcon = document.createElement("SECTION");
        innerIcon.classList.add("IconText");
        innerIcon.innerHTML = entry[0];
        outerIcon.appendChild(innerIcon);
    }
}

/**
Scans the display location of the student data (groupprojects == false) or group project data (groupprojects == true) for properly formatted HTML representing that data, removes any of that HTML that it finds, and adds its contents to the list of class data. Intended for internal use only. See ../index.html for examples of proper formatting.
*/
function scanToClasses(container, groupprojects) {
    if (container == null) {
        return;
    }
    var lists = container.getElementsByTagName("OL");
    for (var i = 0; i < lists.length; i++) {
        var list = lists[i];
        var sites = list.getElementsByTagName("LI");
        var id = list.getAttribute('id').split(" ");
        if (id.length != 4) {
            continue;
        }
        var year = parseInt(id[0]);
        if (year == NaN) {
            continue;
        }
        var index = indexOfYear(year);
        if (index < 0) {
            classes.push([year, yearNumberToName(year), null, 0, 0, [], 1, null, 0, 0, [], 1]);
            if (minYear == -1 && maxYear == -1) {
                minYear = year;
                maxYear = year;
            } else {
                if (year < minYear) {
                    minYear = year;
                } else if (year > maxYear) {
                    maxYear = year;
                }
            }
            index = classes.length - 1;
        }
        var yearData = classes[index];
        var type, width, height, columns = 0;
        var nameData = null;
        if (groupprojects) {
            type = 7;
            width = 8;
            height = 9;
            nameData = yearData[10];
            columns = 11;
        } else {
            type = 2;
            width = 3;
            height = 4;
            nameData = yearData[5];
            columns = 6;
        }
        yearData[type] = id[1];
        yearData[width] = parseInt(id[2]);
        yearData[height] = parseInt(id[3]);
        if (width == NaN || height == NaN) {
            continue;
        }
        var numIcons = 0;
        for (var j = 0; j < sites.length; j++) {
            var words = sites[j].innerHTML.split(" ");
            if (words.length == 0) {
                continue;
            }
            var name;
            if (groupprojects) {
                name = words[0].replace(/_/g, " ");
            } else {
                name = words[0].split("_")[0];
            }
            var noLink = false;
            var ownSite = null;
            for (var k = 1; k < words.length; k++) {
                var word = words[k];
                if (word.valueOf() == "NoSite") {
                    noLink = true;
                } else {
                    ownSite = word;
                    break;
                }
            }
            nameData.push([name, words[0].toLowerCase(), noLink, ownSite]);
            numIcons++;
        }
        yearData[columns] = getNumColumns(numIcons);
        container.removeChild(list);
        i--;
    }
}

/**
Initializes the script, displays the data of the chronologically last year, and allows all other functions to be properly called. This should be called upon page load in webpages wishing to use the script (e.g. <script>initialize();</script>).
*/
function initialize() {
    iconsBox = document.getElementById("Icons");
    facesBox = document.getElementById("Faces");
    facesDependents = document.getElementsByClassName("FacesDependent");
    groupBox = document.getElementById("GroupProjects");
    groupDependents = document.getElementsByClassName("GroupProjectsDependent");
    yearDisplays = document.getElementsByClassName("YearDisplay");
    scanToClasses(facesBox, false);
    scanToClasses(groupBox, true);
    var yearToDisplay = getCookie("currentYear");
    if (yearToDisplay == null) {
        yearToDisplay = maxYear;
    } else {
        yearToDisplay = parseInt(yearToDisplay);
        if (yearToDisplay == NaN) {
            yearToDisplay = maxYear;
        }
    }
    displayYear(yearToDisplay);
}
