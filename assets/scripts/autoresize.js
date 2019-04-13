//This script requires jQuery.
//Credit to Yair Even Or for it.

function resizeAutoResize(element) {
    var minRows = element.getAttribute('data-min-rows')|0;
    element.rows = minRows;
    var rows = Math.ceil((element.scrollHeight - element.baseScrollHeight) / 16);
    element.rows = minRows + rows;
}

$(document)
    .one('focus.AutoResize', 'textarea.AutoResize', function() {
        var temp = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = temp;
    })
    .on('input.AutoResize', 'textarea.AutoResize', function() {
        resizeAutoResize(this);
    });
