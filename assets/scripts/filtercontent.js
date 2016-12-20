var cookies = updateCookies();
var tags = [];

/**
Updates the internal record of cookie data to reflect the current list of cookies. Intended for internal use only.
*/
function updateCookies() {
    var retVal = [];
    if (document.cookie.valueOf() !== "".valueOf()) {
        var pairs = document.cookie.split(";");
        for (var i = 0; i < pairs.length; i++) {
            retVal.push(pairs[i].split("="));
        }
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
        if (cookies[i][0].valueOf() === key.valueOf()) {
            return cookies[i][1];
        }
    }
    return null;
}

function addListener(element, eventName, handler) {
    if (element.addEventListener) {
        element.addEventListener(eventName, handler, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + eventName, handler);
    }
    else {
        element["on" + eventName] = handler;
    }
}

function removeListener(element, eventName, handler) {
    if (element.addEventListener) {
        element.removeEventListener(eventName, handler, false);
    }
    else if (element.detachEvent) {
        element.detachEvent("on" + eventName, handler);
    }
    else {
        element["on" + eventName] = null;
    }
}

function updateInactiveTagsCookie() {
    var inactiveTagsCookie = "";
    for (var i = 0; i < tags.length; i++) {
        var tagData = tags[i];
        if (!tagData.active) {
            inactiveTagsCookie += tagData.tagName + " ";
        }
    }
    addCookie("inactivetags", inactiveTagsCookie);
}

function makeTagData(tagName, firstElement) {
    return [tagName, [firstElement], [], true];
}

function getTagName(tagData) {
    return tagData[0];
}

function getTagElements(tagData) {
    return tagData[1];
}

function getTagTogglers(tagData) {
    return tagData[2];
}

function getTagActive(tagData) {
    return tagData[3];
}

function setTagActive(tagData, active) {
    tagData[3] = active;
}

function getTagData(name) {
    for (var i = 0; i < tags.length; i++) {
        if (getTagName(tags[i]).valueOf() === name.valueOf()) {
            return tags[i];
        }
    }
    return null;
}

function activateTag(tagData) {
    setTagActive(tagData, true);
    var elements = getTagElements(tagData);
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.numTagsActive == 0) {
            element.style.display = element.originalDisplay;
        }
        element.numTagsActive++;
    }
    var togglers = getTagTogglers(tagData);
    for (var i = 0; i < togglers.length; i++) {
        var element = togglers[i];
        if (element.activeClass !== null) {
            element.classList.add(element.activeClass);
        }
    }
}

function deactivateTag(tagData) {
    console.log(tagData);
    setTagActive(tagData, false);
    var elements = getTagElements(tagData);
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        element.numTagsActive--;
        if (element.numTagsActive == 0) {
            element.style.display = "none";
        }
    }
    var togglers = getTagTogglers(tagData);
    for (var i = 0; i < togglers.length; i++) {
        var element = togglers[i];
        if (element.activeClass !== null) {
            element.classList.remove(element.activeClass);
        }
    }
}

function toggleContent() {
    var tagData = this.tagData;
    if (getTagActive(tagData)) {
        deactivateTag(tagData);
    } else {
        activateTag(tagData);
    }
    updateInactiveTagsCookie();
}

function initializeFilterContent() {
    var elements = document.getElementsByTagName("*");
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.hasAttribute("data-contenttags")) {
            element.contentTags = element.getAttribute("data-contenttags").split(" ");
            element.numTagsActive = element.contentTags.length;
            element.originalDisplay = element.style.display;
            for (var j = 0; j < element.contentTags.length; j++) {
                var tag = element.contentTags[j];
                var tagData = getTagData(tag);
                if (tagData === null) {
                    tags.push(makeTagData(tag, element));
                } else {
                    getTagElements(tagData).push(element);
                }
            }
        }
    }
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.hasAttribute("data-contenttoggle")) {
            var tagData = getTagData(element.getAttribute("data-contenttoggle"));
            if (tagData !== null) {
                getTagTogglers(tagData).push(element);
                element.tagData = tagData;
                if (element.hasAttribute("data-activeclass")) {
                    element.activeClass = element.getAttribute("data-activeclass");
                } else {
                    element.activeClass = null;
                }
                addListener(element, "click", toggleContent);
            }
        }
    }
    var inactiveTagsCookie = getCookie("inactivetags");
    if (inactiveTagsCookie !== null) {
        var inactiveTags = inactiveTagsCookie.split(" ");
        for (var i = 0; i < inactiveTags.length; i++) {
            var tagData = getTagData(inactiveTags[i]);
            if (tagData != null) {
                deactivateTag(tagData);
            }
        }
    }
    updateInactiveTagsCookie();
}
