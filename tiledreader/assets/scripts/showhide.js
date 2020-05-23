function toggle(data) {
    if (data.shown) {
        data.shown = false;
        for (var i = 0; i < data.elements.length; i++) {
            data.elements[i].style.display = "none";
        }
    } else {
        data.shown = true;
        for (var i = 0; i < data.elements.length; i++) {
            var element = data.elements[i];
            element.style.display = element.getAttribute("originalDisplay");
        }
    }
}

function initialize() {
    var buttons = document.getElementsByClassName("ShowHideButton");
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        var elements = button.parentNode.getElementsByClassName("ShowHide");
        for (var j = 0; j < elements.length; j++) {
            var element = elements[j];
            element.setAttribute("originalDisplay", element.style.display);
            element.style.display = "none";
        }
        var data = {elements: elements, shown: false};
        button.onclick = (function() {
            var currentData = data;
            return function() {
                toggle(currentData);
            }
        })();
        button.style.cursor = "pointer";
    }
}

window.onload = initialize;
