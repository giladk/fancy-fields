/*
*
* Fancy fields 1.2
* URI: http://www.jqfancyfields.com
*
* Date: May 29 2013
*
* Copyrights 2012 Gilad Korati & Matan Gottlieb
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*
*/

// fix for mousemove on select in chrome
var _mouseX = 0;
var _mouseY = 0;
var _ffIsMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));
(function ($) {

    var $activeSelect = null;

    var isSelectBtnClick = false;

    var isTrigger = false;

    var firstInit = true;
    var isCleanClick = false;

    var isKeydown = false;

    var isContinueTyping = false;
    var continueTypingTimeout;
    var currentTyping = "";

    var genneralSettings;
	
    var methods = {
        init: function (options) {
            
            if (firstInit) {

                $(document).keydown(function (event) {
                    if ($activeSelect != null) {
                        isKeydown = false;
                        var keyCode = event.keyCode || event.which;
                        if (keyCode == "38" || keyCode == "104") {
                            isKeydown = true;
                            selectGoPrev();
                            event.preventDefault();
                        }
                        else if (keyCode == "40" || keyCode == "98") {
                            isKeydown = true;
                            selectGoNext();
                            event.preventDefault();
                        }
                        else if (keyCode == "13") {
                            isKeydown = true;
                            $(".on", $activeSelect).click();
                            event.preventDefault();
                        }
                        else if (keyCode == "27") {
                            isKeydown = true;
                            $activeSelect.closest(".ffSelectMenuWrapper").prev(".ffSelectButton").click();
                            event.preventDefault();
                        }
                    }
                });
                $(document).on("keypress",function (event) {
                    if ($activeSelect != null) {
                        //fix firefox preventDefault
                        if (isKeydown) {
                            isKeydown = false;
                            return false;
                        }

                        var keyCode = event.keyCode || event.which;

                        var curChar = String.fromCharCode(event.keyCode | event.charCode);
						var continueTypingSpees = $activeSelect.data("cts");
                        clearTimeout(continueTypingTimeout);
                        if (isContinueTyping && (currentTyping != curChar)) {
                            currentTyping = currentTyping + curChar;
                        }
                        else {
                            currentTyping = curChar;
                        }
                        isContinueTyping = true;
                        continueTypingTimeout = setTimeout(function () {
                            isContinueTyping = false;
                        }, continueTypingSpees);

                        var curTypingLowerCase = currentTyping.toLowerCase();
                        var curTypingLength = currentTyping.length;

                        if ($(".on SPAN", $activeSelect).text().substring(0, curTypingLength).toLowerCase() == curTypingLowerCase) {
                            if (curTypingLength < 2) {
                                if ($(".on", $activeSelect).next("LI").children("SPAN").text().substring(0, curTypingLength).toLowerCase() == curTypingLowerCase) {
                                    $(".on", $activeSelect).removeClass("on").next("LI").addClass("on");
                                    checkSelectPosition($activeSelect);
                                }
                                else {
                                    var curSelectedIndex = $("LI", $activeSelect).index($(".on", $activeSelect));
                                    var checkFromStart = true;
                                    $("LI SPAN", $activeSelect).slice(curSelectedIndex + 1).each(function () {
                                        if ($(this).text().substring(0, curTypingLength).toLowerCase() == curTypingLowerCase) {
                                            $(".on", $activeSelect).removeClass("on");
                                            $(this).parent("LI").addClass("on");
                                            checkSelectPosition($activeSelect);
                                            checkFromStart = false;
                                            return false;
                                        }
                                    });

                                    if (checkFromStart) {
                                        $("LI SPAN", $activeSelect).each(function () {
                                            if ($(this).text().substring(0, curTypingLength).toLowerCase() == curTypingLowerCase) {
                                                $(".on", $activeSelect).removeClass("on");
                                                $(this).parent("LI").addClass("on");
                                                checkSelectPosition($activeSelect);
                                                return false;
                                            }
                                        });
                                    }
                                }
                            }
                        }
                        else {
                            $("LI SPAN", $activeSelect).each(function () {
                                if ($(this).text().substring(0, curTypingLength).toLowerCase() == curTypingLowerCase) {
                                    $(".on", $activeSelect).removeClass("on");
                                    $(this).parent("LI").addClass("on");
                                    checkSelectPosition($activeSelect);
                                    return false;
                                }
                            });
                        }
                        
                        event.preventDefault();
                    }
                }); 

                $(document).click(function (event) {
					if ($activeSelect != null) {
						if (!isSelectBtnClick && !$activeSelect.data("ds")) {
                                $activeSelect.closest(".ffSelectMenuWrapper").prev(".ffSelectButton").click();
						}
						else{
							$activeSelect.data("ds",false)
						}
						isSelectBtnClick = false;
					}
                });

                firstInit = false;
            }

            var itemsSum = $(this).length;
            var itemInd = 1;
            var wrapperObjects = $("");
            /* first init end */
            return this.each(function () {
                var $curObj = $(this);
				
				
                // check if is inpur or wrap element
                 if ((!$curObj.is("input")) && (!$curObj.is("textarea")) && (!$curObj.is("select"))) {
                    if ($curObj.is("FORM")) {
                        $curObj.prop("autocomplete", "off");
                    }
                    else {
                        $("FORM", $curObj).prop("autocomplete", "off");
                    }

                    wrapperObjects =wrapperObjects.add($("INPUT,SELECT,TEXTAREA", $curObj)); // $("INPUT,SELECT,TEXTAREA", $curObj);
                    if (itemInd == itemsSum){
                        // check for excludes
                        if((typeof options!='undefined')&&(typeof options.exclude!='undefined')){
						    var excludes = options.exclude.split(",");
						    $.each(excludes,function (ind,obj) {
						    	wrapperObjects = wrapperObjects.not((""+obj));
						    });
					    }
                        wrapperObjects.filter("INPUT,TEXTAREA").fancyfields(options);
                        wrapperObjects.filter("SELECT").fancyfields(options);
                    }
                    else{
                        itemInd++;
                    }
                }
                else {
					//defaults
                    var settings = $.extend({
						enableOnClean: false,
                        cleanDisableOnClean: false,
                        cleanOnFocus: true,
						appendInputClassToWrapper: false,
						customScrollBar: false,
						continueTypingSpees: 1000
                    }, options);

                    $curObj.data('settings', settings);

                    if ($curObj.data('defaultSettings') == null) {
                        $curObj.data('defaultSettings', settings);
                    }

                    // wrapper element - after difine type save in data
                    var $wrapElement = null;

                    // default element - clone of current object
                    $curObj.data('default', $curObj.clone());

                    // get class of input to set on wrapper element
                    var objClass = (($curObj.prop("class") != null)&&(settings.appendInputClassToWrapper)) ? " " + $curObj.prop("class") : "";

                    //////////////////
                    //   textbox    //
                    //////////////////

                    if ($curObj.is(":text")) {
                        var $firstVal = $curObj.val();
                        $wrapElement = $('<div class="ffTextBoxWrapper' + objClass + '"></div>');
                        $wrapElement.insertAfter($curObj).append($('<div class="ffTextBoxRight"></div>').append($('<div class="ffTextBoxLeft"></div>').append($curObj)));

                        // check for disabled 
                        checkDisabled($curObj, $wrapElement);

                        $curObj.focusin(function () {
                            if (settings.cleanOnFocus) {
                                if ($firstVal == $curObj.val()) {
                                    $curObj.val("");
                                }
                            }
                            $wrapElement.addClass("focus");
                        });
                        $curObj.focusout(function () {
                            if (settings.cleanOnFocus) {
                                if ($curObj.val() == "") {
                                    $curObj.val($firstVal);
                                }
                            }
                            $wrapElement.removeClass("focus");
                        });

                    }

                    /* textbox end */

                    ///////////////////
                    //   password    //
                    ///////////////////

                    if ($curObj.is(":password")) {
                        $wrapElement = $('<div class="ffPasswordWrapper' + objClass + '"></div>');
                        $wrapElement.insertAfter($curObj).append($('<div class="ffPasswordRight"></div>').append($('<div class="ffPasswordLeft"></div>').append($curObj)));
                        
                        // check for disabled 
                        checkDisabled($curObj, $wrapElement);


                        $curObj.focusin(function () {
                            $wrapElement.addClass("focus");
                        });
                        $curObj.focusout(function () {
                            $wrapElement.removeClass("focus");
                        });
                    }

                    /* password end */


                    //////////////////
                    //   textarea    //
                    //////////////////

                    if ($curObj.is("textarea")) {
                        var $firstVal = $curObj.val();
                        $wrapElement = $('<div class="ffTextAreaWrapper' + objClass + '"></div>');
						
						
						$wrapElement.append('<div class="ffTextAreaTop"><span></span></div>').insertAfter($curObj).append($('<div class="ffTextAreaMid"></div>').append($('<div class="ffTextAreaLeft"></div>').append($curObj))).append('<div class="ffTextAreaBottom"><span></span></div>');
						 //fix ie7 width
                        if (navigator.appVersion.indexOf("MSIE 7.") != -1){
                            var objWidth = $wrapElement.width();
							$(".ffTextAreaTop",$wrapElement).css("width" , objWidth );
                            $(".ffTextAreaBottom",$wrapElement).css("width" , objWidth );
                        }
                        // check for disabled 
                        checkDisabled($curObj, $wrapElement);

                        $curObj.focusin(function () {
                            if (settings.cleanOnFocus) {
                                if ($firstVal == $curObj.val()) {
                                    $curObj.val("");
                                }
                            }
                            $wrapElement.addClass("focus");
                        });
                        $curObj.focusout(function () {
                            if (settings.cleanOnFocus) {
                                if ($curObj.val() == "") {
                                    $curObj.val($firstVal);
                                }
                            }
                            $wrapElement.removeClass("focus");
                        });


                    }

                    /* textarea end */

                    //////////////////
                    //   checkbox   //
                    //////////////////
                    if ($curObj.is(":checkbox")) {
                        // setting wrapper + dummy elements.
                        $wrapElement = $('<div class="ffCheckboxWrapper' + objClass + '" ></div>');
                        var $dummyObject = $('<div class="ffCheckbox"></div>');
                        // check if checkbox is checked
                        if ($curObj.is(":checked")) {
                            $wrapElement.addClass("on");
                        }

                        // check for disabled 
                        checkDisabled($curObj, $wrapElement);

                        // check for label
                        var $labelElement = null;
                        var labelObj = $curObj.next();
                        if (labelObj.is("LABEL")) {
                            $labelElement = $('<a href="javascript:void(0)">' + labelObj.text() + '</a>');
                        }

                        // insert element
                        $wrapElement.append($dummyObject).insertAfter($curObj).append($curObj.css("display", "none"));

                        // insert label , set data and events
                        if ($labelElement != null) {
                            setRadioCBLabel($curObj, $dummyObject, $labelElement, labelObj, $wrapElement);
                        }

                        // dummy object click
                        $dummyObject.click(function () {
                            if (!$wrapElement.hasClass("disabled")) {
                                $curField = $(this);
                                $curInput = $curField.siblings("input");
                                $wrapElement.toggleClass("on");
                                var $isCheckd = false;
                                if (!isTrigger) {
                                    if ($curInput.is(":checked")) {
                                        $curInput.prop("checked", false);
                                    }
                                    else {
                                        $curInput.prop("checked", true);
                                        $isCheckd = true;
                                    }
                                }
                                else {
                                    if (!$curInput.is(":checked")) {
                                        $isCheckd = true;
                                    }
                                }
                                if (!isTrigger) {
                                    var fn = settings["onCheckboxChange"];
                                    if (typeof fn === 'function') {
                                        fn($curInput, $isCheckd);
                                    }
                                }
                            }
                            else if (isTrigger) {
                                $curField = $(this);
                                $curInput = $curField.siblings("input");
                                if ($curInput.is(":checked")) {
                                    $curInput.prop("checked", false);
                                }
                                else {
                                    $curInput.prop("checked", true);
                                }
                            }
                            isTrigger = false;
                        });

                        $curObj.click(function () {
                            isTrigger = true;
                            $dummyObject.click();
                        });

                    }

                    /* checkbox end */

                    //////////////////
                    //    radio     //
                    //////////////////
                    if ($curObj.is(":radio")) {
                        // setting wrapper + dummy elements.
                        $wrapElement = $('<div class="ffRadioWrapper' + objClass + '" ></div>');
                        var $dummyObject = $('<div class="ffRadio"></div>');

                        // check if radio is checked
                        if ($curObj.is(":checked")) {
                            $wrapElement.addClass("on");
                        }
                        // check for disabled 
                        checkDisabled($curObj, $wrapElement);

                        // check for label
                        var $labelElement = null;
                        var labelObj = $curObj.next();
                        if (labelObj.is("LABEL")) {
                            $labelElement = $('<a href="javascript:void(0)">' + labelObj.text() + '</a>');
                        }
                        else{
                            
                        }

                        // insert element
                        $wrapElement.append($dummyObject).insertAfter($curObj).append($curObj.css("display", "none"));


                        // insert label , set data and events
                        if ($labelElement != null) {
                            setRadioCBLabel($curObj, $dummyObject, $labelElement, labelObj, $wrapElement);
                        }

                        // dummy object click
                        $dummyObject.click(function () {
                            var curName = $curObj.prop("name");
                            if (!$wrapElement.hasClass("disabled")) {
                                if ($curObj.is(":checked")) {

                                }
                                else {
                                    $curObj.prop("checked", true);
                                    $wrapElement.addClass("on");
                                    if (curName != "") {
                                        $("input:radio").not($curObj).each(function () {
                                            if ($(this).prop("name") == curName) {
                                                $(this).closest(".ffRadioWrapper").removeClass("on");
                                            }
                                        });
                                    }
                                    var fn = settings["onRadioChange"];
                                    if (typeof fn === 'function') {
                                        fn($curObj);
                                    }
                                }
                            }
                            else if (isTrigger) {
                                $curChecked = $("input[name=" + $curObj.prop("name") + "]:checked");
                                timer = setTimeout(function () {
                                    $curObj.prop("checked", false);
                                    $curChecked.prop("checked", true);
                                }, 1);

                            }
                            isTrigger = false;
                        });
                    }

                    /* radio end */

                    ///////////////////
                    //    select     //
                    ///////////////////

                    if ($curObj.is("select")) {
                        // setting wrapper + dummy elements.
                        $wrapElement = $('<div class="ffSelectWrapper' + objClass + '" ></div>');
                        var $dummyObject = $('<div class="ffSelect"></div>').css({ "z-index": 10,"position" : "relative"});
                        var $dummyButton = $('<A href="javascript:void(0)" class="ffSelectButton"><span></span></A>');

                        if ($curObj.prop("tabindex")) {
                            $dummyButton.prop("tabindex", $curObj.prop("tabindex"));
                            $curObj.data("ti",$curObj.prop("tabindex"));
                        }


                        // check for disabled 
                        checkDisabled($curObj, $wrapElement);

                        // set dropdown for mobile - use only the dummy button
                        if (_ffIsMobile){
                            $wrapElement.append($dummyObject.append($dummyButton)).insertAfter($curObj.addClass("mobileSelect"));
                            $dummyObject.append($curObj.css({"width" : $wrapElement.width() ,"height": $wrapElement.innerHeight() }));
                             $dummyButton.click(function () {
                                $curObj.trigger("click");
                             });
                              $("span", $dummyButton).text($("option:selected", $curObj).text());
                              $curObj.change(function(){
                                var $selectedOption = $("option:selected", $curObj);
                                $("span", $dummyButton).text($selectedOption.text());
                                var fn = settings["onSelectChange"];
						        if (typeof fn === 'function') {
						        	fn($curObj, $selectedOption.text(), $selectedOption.val());
						        }

                             });
                        }
                        
                        else{
                            // setting elements for menu
                            var $menuElementWrapper = $('<div class="ffSelectMenuWrapper"><div class="ffSelectMenuTop"><span></span></div></div>').css("position", "absolute") , 

                            $menuElement = $('<ul data-cts="'+settings.continueTypingSpees+'" data-ds="'+false+'">');
                            // for each option in select
                            var curOpt,optionsHtml = "" ,selectedFlag = false,liClass="",optionClass = "";
                            $objOptions = $(">option,optgroup", $curObj);
                            $objOptions.each(function () {
                                curOpt = $(this);
                                if (curOpt.prop("tagName") == "OPTION"){
                                    liClass = curOpt.prop("class") ? ' class="'+curOpt.prop("class")+'"' : '';
                                    if (curOpt.prop("selected")){
                                        selectedFlag = true;
                                        //selected = ' class="on selected"';
                                        var curSpan = $("span", $dummyButton);
                                        curSpan.text(curOpt.text());
                                        if (liClass != ""){
                                            curSpan.prepend($("<i>").addClass(curOpt.prop("class")).css("float",curSpan.css("direction") == "rtl" ? "right" : "left"));
                                        }
                                        liClass = liClass == "" ? ' class="on selected"' : liClass.substring(0,liClass.length-1) + ' on selected"';
                                    }

                                    if (curOpt.prop("disabled")){
                                        liClass = liClass == "" ? ' class="disabled"' : liClass.substring(0,liClass.length-1) + ' disabled"';
                                    }

                                    optionsHtml += '<li'+liClass+'><span data-val="'+curOpt.val()+'"'+(curOpt.prop("disabled") == "disabled" ? "data-dis='disabled'" : "")+'>'+curOpt.text()+'</span></li>';
                                }else{
                                    optionClass = curOpt.prop("class") ? ' '+curOpt.prop("class") : curOpt.prop("label") != "" ? ' ' +(curOpt.prop("label").replace(/\s+/g, ' ')) : '';
                                    optionsHtml += '<li class="ffGroup disabled'+optionClass+'"><span>'+curOpt.prop("label")+'</span></li>';
                                    var $inObjOptions = $(">option", curOpt);
                                    $inObjOptions.each(function () {
                                        curOpt = $(this);
                                        liClass = curOpt.prop("class") ? ' class="'+curOpt.prop("class")+'"' : '';
                                        if (curOpt.prop("selected")){
                                            selectedFlag = true;
                                            //selected = ' class="on selected"';
                                            var curSpan = $("span", $dummyButton);
                                            curSpan.text(curOpt.text());
                                            if (liClass != ""){
                                                curSpan.prepend($("<i>").addClass(curOpt.prop("class")).css("float",curSpan.css("direction") == "rtl" ? "right" : "left"));
                                            }
                                            liClass = liClass == "" ? ' class="on selected"' : liClass.substring(0,liClass.length-1) + ' on selected"';
                                        }

                                        if (curOpt.prop("disabled")){
                                            liClass = liClass == "" ? ' class="disabled"' : liClass.substring(0,liClass.length-1) + ' disabled"';
                                        }

                                        optionsHtml += '<li'+liClass+'><span data-val="'+curOpt.val()+'"'+(curOpt.prop("disabled") == "disabled" ? "data-dis='disabled'" : "")+'>'+curOpt.text()+'</span></li>';
                                    });
                                }
                            });

                            $menuElement.html(optionsHtml);

                            var $menuListWrapper = $('<div class="ffSelectMenuMid"></div>').css("overflow", "auto");
                            $menuElementWrapper.append($('<div class="ffSelectMenuMidBG"></div>').append($menuListWrapper.append($menuElement))).append('<div class="ffSelectMenuBottom"><span></span></div>');
                           
                            $menuElementWrapper.css("display", "none");

                            $wrapElement.append($dummyObject.append($dummyButton).append($menuElementWrapper)).insertAfter($curObj.css("display", "none")).append($curObj);

                            var menuHeight = $menuElementWrapper.height();
                            
                            var setOnTop = false;

                            var CheckHeight = $(document).height() > $("html").height() ? $(document).height() : $("html").height();
                          
                            if ( CheckHeight < (parseInt($wrapElement.offset().top) + parseInt($wrapElement.height()) + menuHeight + 15)){
                                setOnTop = true;
                                $menuElementWrapper.height(0);
                            }
                            else{
                                $menuElementWrapper.css("top", $wrapElement.height());
                            }

                            $dummyButton.css("height", $wrapElement.innerHeight());

                            // select button click
                            $dummyButton.click(function () {
                                if (($activeSelect != null) && ($activeSelect != $menuElement)) {
                                    $activeSelect.closest(".ffSelectMenuWrapper").prev(".ffSelectButton").click();
                                }
                                isSelectBtnClick = true;
                                if ($menuElementWrapper.is(":hidden")) {
                                    if (!$wrapElement.hasClass("disabled")) {
                                        $activeSelect = $menuElement;
						    			$dummyObject.css("z-index",20);
                                        $wrapElement.addClass("active");
                                        // check position
                                        if (!setOnTop){
                                            $menuElementWrapper.slideDown(300, function () {
                                                checkSelectPosition($menuElement);
                                                $menuListWrapper.focus();
                                            });
                                        }else{
                                            $menuElementWrapper.show(0);
                                            $menuElementWrapper.animate({height:menuHeight,top:"-"+menuHeight+"px"},300, function () {
                                                checkSelectPosition($menuElement);
                                                $menuListWrapper.focus();
                                            });
                                        }
                                    }
                                }
                                else {
                                    $activeSelect = null;
                                    $wrapElement.removeClass("active");
                                    $("LI.on", $menuElementWrapper).removeClass("on");
                                    $("LI.selected", $menuElementWrapper).addClass("on");
                                    if (!setOnTop){
						    		    $menuElementWrapper.slideUp(300,function(){
						    		    	$dummyObject.css("z-index",10);
						    		    });
                                    }
                                    else{
                                        $menuElementWrapper.animate({height:0,top:0},300,function(){
                                            $menuElementWrapper.hide(0);
						    		    	$dummyObject.css("z-index",10);
						    		    });
                                    }
                                }
                            });

                            addFocusEvents($dummyButton, $wrapElement);
						    
						    var last_moved=0; // fix for chrome
                            
                            // select menu option click
                            $menuElement.on("click","LI",function(){
                                var curOpt = $(this);
                                if (!curOpt.hasClass("selected") && !curOpt.hasClass("disabled")) {
                                    var $curVal = $("span", curOpt).data("val");
                                    var $curText = $("span", curOpt).text();

                                    var validateSelection = settings["validateSelectChange"];
                                    if ((typeof validateSelection !== 'function')||(validateSelection($curObj, $curText, $curVal)!==false)){
                                        var curInd = $("LI", $menuElement).not(".ffGroup").index(curOpt);
                                        $curObj.val($curVal);
                                        var $curSpan = $("span", $dummyButton).prop("class","").text($curText);
                                        if (curOpt.prop("class")){
                                            $curSpan.prepend($("<i>").addClass(curOpt.prop("class")).removeClass("on").css("float",$curSpan.css("direction") == "rtl" ? "right" : "left"));
                                        }
                                        curOpt.siblings($("li")).removeClass("on");
                                        curOpt.addClass("on");
                                        curOpt.siblings($("li.selected")).removeClass("selected");
                                        curOpt.addClass("selected");
                                        $wrapElement.removeClass("active");
                                        $("option:selected", $curObj).prop("selected",false);
                                        $("option:eq(" + curInd + ")", $curObj).prop("selected", true);

                                        $activeSelect = null;
						    		    
						    		    
						    		    if ($menuElementWrapper.is(":visible")){
                                            if (!setOnTop){
						    		            $menuElementWrapper.slideUp(300,function(){
						    		            	$dummyObject.css("z-index",10);
						    		            });
                                            }
                                            else{
                                                $menuElementWrapper.animate({height:0,top:0},300,function(){
                                                    $menuElementWrapper.hide(0);
						    		            	$dummyObject.css("z-index",10);
						    		            });
                                            }
						    		    }
                                        
						    		    if (!isCleanClick) {
						    		    	var fn = settings["onSelectChange"];
						    		    	if (typeof fn === 'function') {
						    		    		fn($curObj, $curText, $curVal);
						    		    	}
						    		    }
                                    }else{
                                        $dummyButton.click();  
                                    }
                                }else if(curOpt.hasClass("selected")){
                                    $dummyButton.click();                                        
                                }
						    	isCleanClick = false;
                                return false;
                            }).on("mousemove","LI",function(e){ //.mousemove(function (e) {
                                //fix chrome mouse move when scrolling by arrows
						    	if ((_mouseX!=e.pageX) || (_mouseY!=e.pageY)) {                            
						    		$(".on", $menuElement).removeClass("on")
						    		$(this).addClass("on");
						    		_mouseX = e.pageX;
						    		_mouseY = e.pageY;
						    	}
                            });
						    
						    if ($.fn.ffCustomScroll && settings.customScrollBar){
						    	$wrapElement.ffCustomScroll();
						    }

                        }
                    }

                    /* select end */

                    ///////////////////
                    //   submit    //
                    ///////////////////

                    if ($curObj.is(":submit")) {
                        $wrapElement = $('<div class="ffButtonWrapper ffSubmitWrapper' + objClass + '"></div>');
                        var $dummyButton = $('<A href="javascript:void(0)"><span>' + $curObj.val() + '</span></A>');
                        $wrapElement.insertAfter($curObj).append($dummyButton.append($curObj.css("display", "none")));

                        checkDisabled($curObj, $wrapElement);
                        addFocusEvents($dummyButton, $wrapElement);

                        $dummyButton.click(function () {
                            $curObj.closest("FORM").submit();
                        });
                    }

                    /* submit end */

                    ///////////////////
                    //   button    //
                    ///////////////////

                    if ($curObj.is(":button")) {
                        $wrapElement = $('<div class="ffButtonWrapper' + objClass + '"></div>');
                        var $dummyButton = $('<A href="javascript:void(0)"><span>' + $curObj.val() + '</span></A>');
                        $wrapElement.insertAfter($curObj).append($dummyButton).append($curObj.css("display", "none"));

                        checkDisabled($curObj, $wrapElement);
                        addFocusEvents($dummyButton, $wrapElement);
						
                        $dummyButton.click(function () {
                            if (!$wrapElement.hasClass("disabled")){
                                $curObj.click();
                            }
                        });
                    }

                    /* submit end */

                    ///////////////////
                    //   reset    //
                    ///////////////////

                    if ($curObj.is(":reset")) {
                        $wrapElement = $('<div class="ffButtonWrapper ffResetWrapper' + objClass + '"></div>');
                        var $dummyButton = $('<A href="javascript:void(0)"><span>' + $curObj.val() + '</span></A>');
                        $wrapElement.insertAfter($curObj).append($dummyButton).append($curObj.css("display", "none"));

                        checkDisabled($curObj, $wrapElement);
                        addFocusEvents($dummyButton, $wrapElement);

                        $dummyButton.click(function () {
							if ($(this).closest("form").length>0)
							{
								$curObj.closest("FORM").fancyfields("reset");
							}
							else{
								$curObj.click();
							}
                        });
                    }
                    /* reset end */
                    $curObj.data('wrapper', $wrapElement);
                }
            });
            

        },
        option: function (optName, val) {
            return this.each(function () {
                var $this = $(this);
                settings = $this.data('settings');
                if (settings != null) {
                    settings[optName] = val;
                }
            });
        },
        bind: function (optName, val) {
            return this.each(function () {
                var $this = $(this);
                settings = $this.data('settings');
                if (settings != null) {
                    settings[optName] = val;
                }
            });
        },
        unbind: function (optName) {
            return this.each(function () {
                var $this = $(this);
                settings = $this.data('settings');
                if (settings != null) {
                    settings[optName] = null;
                }
            });
        },
        disable: function () {
            return this.each(function () {
                var $this = $(this);
                settings = $this.data('settings');
                wrapper = $this.data('wrapper');
                if (wrapper != null) {
                    wrapper.addClass("disabled");
                }
                if ($this.is(":text") || $this.is("textarea") || $this.is(":password") || $this.is(":checkbox") || $this.is(":radio") || $this.is("select")) {
                    $this.prop("disabled", "disabled");
                }
            });
        },
        enable: function () {
            return this.each(function () {
                var $this = $(this);
                settings = $this.data('settings');
                wrapper = $this.data('wrapper');
                if (wrapper != null) {
                    wrapper.removeClass("disabled");
                }
                if ($this.is(":text") || $this.is("textarea") || $this.is(":password") || $this.is(":checkbox") || $this.is(":radio") || $this.is("select")) {
                    $this.removeAttr("disabled");
                }
            });
        },
        toggleEnable: function () {
            return this.each(function () {
                var $this = $(this);
                wrapper = $this.data('wrapper');
                if (wrapper != null) {
                    wrapper.toggleClass("disabled");
                }
                if ($this.is(":text") || $this.is("textarea") || $this.is(":password") || $this.is(":checkbox") || $this.is(":radio") || $this.is("select")) {
                    if (($this.prop("disabled") == "disabled")||($this.prop("disabled") == true)) {
                        $this.removeAttr("disabled");
                    }
                    else {
                        $this.prop("disabled", "disabled");
                    }
                }
            });
        },
        clean: function () {
            return this.each(function () {
                var $this = $(this);

                if ((!$this.is(":reset")) && (!$this.is(":button")) && (!$this.is(":submit")) && (!$this.is("input[type=hidden]"))) {

                    if ((!$this.is("input")) && (!$this.is("textarea")) && (!$this.is("select"))) {
                        $("INPUT,SELECT,TEXTAREA", $this).fancyfields("clean");
                    }
                    else {
                        settings = $this.data('settings');
                        wrapper = $this.data('wrapper');
                        // if remove disable on clear
                        if (settings.enableOnClean) {
                            wrapper.removeClass("disabled");
                            if ($this.is(":text") || $this.is("textarea") || $this.is(":password") || $this.is(":checkbox") || $this.is(":radio") || $this.is("select")) {
                                $this.removeAttr("disabled");
                            }
                        }
						
						// if clean disable on clear
						if (($this.prop("disabled") != "disabled") || (settings.cleanDisableOnClean)) {
							// clean value
							if ($this.is(":checkbox") || $this.is(":radio")) {
                                if (!$this.is(":checked")){
                                    invokeChange = false; 
                                }
								$this.removeAttr("checked");
								wrapper.removeClass("on");
							}
							else if ($this.is("select")) {
                                wrapper = $this.data('wrapper');
                                if (_ffIsMobile){
                                    $("option:first",$this).prop("selected","selected");
                                    $("span", wrapper).text($("option:first",$this).text());
                                }
                                else{
								    isCleanClick = true;
								    $("LI:first", wrapper).click();  //.css("border","1px solid red");
                                }
							}
							else if ($this.is(":text") || $this.is("textarea") || $this.is(":password")) {
								$this.val("");
								wrapper.removeClass("on");
							}
							else if ($this.is(":file")) {
								$this.fancyfields("reset");
							}
						}

                        
                    }
                }
            });
        },
        reset: function () {
            return this.each(function () {
                var $this = $(this);
                if ((!$this.is(":reset")) && (!$this.is(":button")) && (!$this.is(":submit")) && (!$this.is("input[type=hidden]"))) {
                    if ((!$this.is("input")) && (!$this.is("textarea")) && (!$this.is("select"))) {
						
                        $("INPUT,SELECT,TEXTAREA", $this).fancyfields("reset");
                    }
                    else {
                        defaultObj = $this.data('default');
                        wrapper = $this.data('wrapper');
                        var curSetting = $this.data('settings');
                        if ($this.is(":checkbox") || $this.is(":radio")) {
                            $this.data('defaultLabel').insertAfter(defaultObj.insertAfter(wrapper));
                        }
                        else {
                            defaultObj.insertAfter(wrapper);
                        }
                        wrapper.remove();
                        defaultObj.fancyfields(curSetting);
                    }
                }
            });
        },
		checked:function(){
			return this.each(function () {
                var $this = $(this);
                if (($this.is(":checkbox"))&&(!$this.is(":checked"))){
					$this.click();
				}
			});
		},
		unchecked:function(){
			return this.each(function () {
                var $this = $(this);
                if (($this.is(":checkbox"))&&($this.is(":checked"))){
					$this.click();
				}
			});
		}
    };

    function checkSelectPosition(element) {
		if ($.fn.ffCustomScroll && element.closest(".ffSelect").next("select").data("settings").customScrollBar){
			element.ffCustomScroll("ffCustomScrollCheckPosition");
		}
		else{
			var $curWrapper = element.parent(".ffSelectMenuMid");
			var $curScrollTop = $curWrapper.scrollTop();
			var $curSelectHeight = $curWrapper.height();
			var $curSelected = $("LI.on", element);
			if (($curSelectHeight + $curScrollTop) < ($curSelected.offset().top - element.offset().top + $curSelected.outerHeight())) {
				$curWrapper.scrollTop($curSelected.offset().top - element.offset().top);
			}
			else if ($curScrollTop > ($curSelected.offset().top - element.offset().top)) {
				$curWrapper.scrollTop($curSelected.offset().top - element.offset().top - $curSelectHeight + $curSelected.outerHeight());
			}
		}
    };

    function setRadioCBLabel(element, dummyElement, labelElement, labelObj, wrapElement) {
        labelElement.insertAfter(dummyElement);
        labelElement.click(function () {
            dummyElement.click();
        });
        element.data('defaultLabel', labelObj.clone());
        element.data('labelElement', labelElement);
        labelObj.remove();
        if (element.prop("tabindex")) {
            labelElement.prop("tabindex", element.prop("tabindex"));
            element.data("ti",element.prop("tabindex"));
            element.removeAttr("tabindex");
        }
        addFocusEvents(labelElement, wrapElement);
    }

    function addFocusEvents(element, wrapperElement) {
        element.focusin(function () {
            wrapperElement.addClass("focus");
        });
        element.focusout(function () {
            wrapperElement.removeClass("focus");
        });
        element.mouseout(function () {
            wrapperElement.removeClass("focus");
        });
    }

    function selectGoNext() {
        if ($(".on", $activeSelect).next("LI").length > 0) {
            $(".on", $activeSelect).toggleClass("on").next("LI").toggleClass("on");
            checkSelectPosition($activeSelect);
        }
    }

    function selectGoPrev() {
        if ($(".on", $activeSelect).prev("LI").length > 0) {
            $(".on", $activeSelect).toggleClass("on").prev("LI").toggleClass("on");
            checkSelectPosition($activeSelect);
        }
    }

    function checkDisabled(element, wrapperElement) {
        if (element.is(":disabled")) {
            wrapperElement.addClass("disabled");
        }
    }

    $.fn.fancyfields = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }
    };

    $.fn.submitIncluseDisebeld = function () {
        var $this = $(this);
        $("input:disabled , textarea:disabled , select:disabled ", $this).removeAttr("disabled");
        $this.submit();
    };

    // $.fn.submitAsyn = function (url, callBack, includeDesabled) {
        // var $this = $(this);
        // if ($this.is("FORM")) {
            // var data = {};
            // if (includeDesabled != true) {
                // data = $this.serialize()
            // }
            // else {
                // $("INPUT,SELECT,TEXTAREA", $this).each(function () {
                    // if (($(this).attr("name") != null) && ($(this).attr("name") != "")) {
                        // if (((!$(this).is(":checkbox")) && (!$(this).is(":radio")) && (!$(this).is(":file"))) || ($(this).is(":checked"))) {
                            // data[$(this).attr("name")] = $(this).val();
                        // }
                    // }
                // });
            // }

            // $.post(url, data, function (data) {
                // if (typeof callBack === 'function') {
                    // callBack(data);
                // }
            // });
        // }
    // }

    $.fn.setVal = function (val) {
        return this.each(function () {
            var $this = $(this);
            if ($this.is("select")) {
                $this.val(val);
                wrapper = $this.data('wrapper');
                if (_ffIsMobile){
                    $("span", wrapper).text($("option:selected",$this).text());
                }else{
                    var curInd = $("option",$this).index($("option:selected",$this));
                    $("LI:eq(" + curInd + ")", wrapper).click();
                }
            }
        });
    };

    $.fn.setOptions = function (optAry) {
        return this.each(function () {
            var $this = $(this);
            if ($this.is("select")) {
                var val;
                var curSetting = $this.data('settings');
                wrapper = $this.data('wrapper');
                $this.html("").insertAfter(wrapper);
                $.each(optAry, function (ind, obj) {
                    val = obj[1] == null ? obj[0] : obj[1];
                    $this.append('<option value="' + val + '" >' + obj[0] + '</option>');
                });
                wrapper.remove();
                $this.fancyfields(curSetting);
            }
        });
    };



    $.fancyfields = {
        GroupVal: function (groupName) {
            return $("input[name=" + groupName + "]:checked").val()
        }
    };

})(jQuery);

jQuery.single=function(a){return function(b){a[0]=b;return a}}(jQuery([1]));