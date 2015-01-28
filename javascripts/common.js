/// <reference path="jquery-1.7.2.min.js" />



$(document).ready(function () {
    $(".copyCode").click(function () {
        var id = $(this).prev().attr("id");
        SelectText(id);
    });
   

    $(".tabsMenu").each(function () {
        var obj = $(this);
        
        $("UL LI A", obj).click(function () {
            $("UL LI", obj).removeClass("selected");
            $(this).parent("LI").addClass("selected");
            var curIndex = $("UL LI A", obj).index($(this));
            //            $(".tabItem", obj.closest(".tabsContainer")).css("display", "none");
            //            $(".tabItem:eq(" + curIndex + ")", obj.closest(".tabsContainer")).css("display", "block");
            $(".tabItem", obj.closest(".tabsContainer")).slideUp(500);
            $(".tabItem:eq(" + curIndex + ")", obj.closest(".tabsContainer")).slideDown(500);
        })
        $(".tabItem", obj.closest(".tabsContainer")).css("display", "none");
        $(".tabItem:first", obj.closest(".tabsContainer")).css("display", "block");
        $("UL LI:first", obj).addClass("selected");
    });

});








function SelectText(element) {
    var doc = document;
    var text = doc.getElementById(element);
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}