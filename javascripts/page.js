
$(document).ready(function () {

    $(".exampleContainer").fancyfields({
        exclude: "#SelectCSB"
    });
    $("#SelectCSB").fancyfields({
    customScrollBar: true
    });

    // textbox //
    $("#disableTextbox").click(function () {
    $("#Text1").fancyfields("disable");
    });
    $("#EnableTextbox").click(function () {
    $("#Text1").fancyfields("enable");
    });
    $("#ToggleEnableTextbox").click(function () {
    $("#Text1").fancyfields("toggleEnable");
    });

    $("#CleanTextbox").click(function () {
    $("#Text1").fancyfields("clean");
    });
    $("#ResetTextbox").click(function () {
    $("#Text1").fancyfields("reset");
    });
    $("#unbindCleanTextbox").click(function () {
    $("#Text1").fancyfields("option", "cleanOnFocus", false);
    });

    // checkbox //
    $("#bindOnCheckboxChange").click(function () {
    if ($(this).hasClass("off")) {
    $('.exampleContainer INPUT:checkbox').fancyfields('bind', 'onCheckboxChange', function (input, isChecked) {
    alert("ID : " + input.attr("id") + " Is checked : " + isChecked);
    });
    $("span", $(this).prev("A")).text("Unbind onCheckboxChange event to checkboxs")
    //$("#cbjs1").text("$(elements).fancyfields('unbind', 'onCheckboxChange');");
    }
    else {
    $('.exampleContainer INPUT:checkbox').fancyfields('unbind', 'onCheckboxChange');
    $("span", $(this).prev("A")).text("Bind onCheckboxChange event from checkboxs")
    //$("#cbjs1").html("$(elements).fancyfields(\"bind\",\"onCheckboxChange\", function (input, isChecked){<br/>&nbsp;&nbsp;&nbsp;&nbsp;alert(\"ID : \" + input.attr(\"id\") + \" Is checked : \" + isChecked);<br/>});");
    }
    $(this).toggleClass("off");
    });

    $("#DiableCheckbox").click(function () {
    $("#Checkbox2").fancyfields("disable");
    });
    $("#EnableCheckbox").click(function () {
    $("#Checkbox2").fancyfields("enable");
    });
    $("#ToggleEnableCheckbox").click(function () {
    $("#Checkbox2").fancyfields("toggleEnable");
    });

    $("#CleanCheckbox").click(function () {
    $("input:checkbox").fancyfields("clean");
    });
    $("#ResetCheckbox").click(function () {
    $("input:checkbox").fancyfields("reset");
    });
    $("#TriggerClickCheckbox").click(function () {
    $("#Checkbox1").trigger("click");
    });
    $("#CheckedCheckbox").click(function () {
    $("#Checkbox1").fancyfields("checked");
    });
    $("#UncheckedCheckbox").click(function () {
    $("#Checkbox1").fancyfields("unchecked");
    });


    // radio //

    $("#bindOnRadioChange").click(function () {
    if ($(this).hasClass("off")) {
    $('.exampleContainer INPUT:radio').fancyfields('bind', 'onRadioChange', function (input) {
    alert("ID : " + input.attr("id") + " Val : " + input.val());
    });
    $("span", $(this).prev("A")).text("Unbind onRadioChange event")
    }
    else {
    $('.exampleContainer INPUT:radio').fancyfields('unbind', 'onRadioChange');
    $("span", $(this).prev("A")).text("Bind onRadioChange event")
    }
    $(this).toggleClass("off");
    });

    $("#DiableRadio").click(function () {
    $("#Radio3").fancyfields("disable");
    });
    $("#EnableRadio").click(function () {
    $("#Radio3").fancyfields("enable");
    });
    $("#ToggleEnableRadio").click(function () {
    $("#Radio3").fancyfields("toggleEnable");
    });
    $("#CleanRadio").click(function () {
    $("input:radio").fancyfields("clean");
    });
    $("#ResetRadio").click(function () {
    $("input:radio").fancyfields("reset");
    });
    $("#TriggerRadio").click(function () {
    $("#Radio3").trigger("click");
    });
    $("#AlertRadioVal").click(function () {
    alert($.fancyfields.GroupVal("group1"));
    });


    // select

    $("#bindOnSelectChange").click(function () {

    if ($(this).hasClass("off")) {
    $('.exampleContainer SELECT').fancyfields('bind', 'onSelectChange', function (input, text, val) {
    alert("Current input - ID : " + input.attr("id") + " , selected text : " + text + " , value : " + val);
    });
    $("span", $(this).prev("A")).text("Unbind onSelectChange event")
    }
    else {
    $('.exampleContainer SELECT').fancyfields('unbind', 'onSelectChange');
    $("span", $(this).prev("A")).text("Bind onSelectChange event")
    }
    $(this).toggleClass("off");
    });

    $("#DiableSelect").click(function () {
    $("#Select1").fancyfields("disable");
    });
    $("#EnableSelect").click(function () {
    $("#Select1").fancyfields("enable");
    });
    $("#ToggleEnableSelect").click(function () {
    $("#Select1").fancyfields("toggleEnable");
    });

    $("#CleanSelect").click(function () {
    $("#Select1").fancyfields("clean");
    });
    $("#ResetSelect").click(function () {
    $("#Select1").fancyfields("reset");
    });
    $("#selectSetVal").click(function () {
    $("#Select1").setVal("5");
    });

    $("#selectSetOpt").click(function () {
    var listOptions = [["select", "0"], ["option1", "valeu1"], ["option2", "valeu2"], ["optionval3"]];
    $("#Select2").setOptions(listOptions);
    });

    });

function tabClick(cls) {
    $("html,body").animate({ "scroll-top": $("." + cls).offset().top - 120 }, 500);
    $("." + cls).click();
 }
