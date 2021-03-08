function toolTipDialog(text) {
    var html = ` <div class="showMsg">
                    <div class="text">`+ text + `</div>
                </div>`
    $('.msgdialog').html(html)
    setTimeout(function () { $('.msgdialog').html('') }, 2000);
    clearTimeout();
}