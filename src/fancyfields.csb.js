
var currentElem = null;
var currentScroll = null;


(function ($) {

    var methods = {
        init: function (options) {
			

            return this.each(function () {
			
                var $element = $(this);

				var menuElement = $(".ffSelectMenuMid",$element);
				var optionList = $("UL",$element);
				$(".ffSelectMenuWrapper",$element).css("display","block");
				
				var menuHeight = menuElement.height();
				var menuWidth = menuElement.width();
				var scrollingPanelHeight = optionList.height();
				var widthDiff = menuWidth - optionList.width();
				var scrollingRatio = scrollingPanelHeight / menuHeight;
				
				$(".ffSelectMenuWrapper",$element).css("display","none")
				if (scrollingRatio > 1 ){
					
					
					menuElement.css({"overflow":"hidden","position":"relative"});
				
					var scrollingBar = $('<div class="scrollingBarWrapper">').css({"position":"absolute","top":"0"});
					
					if (menuElement.css("direction")=="ltr"){
						scrollingBar.css("right","0");
					}
					else{
						scrollingBar.css("left","0");
					}
				
					var scrollingHandleHeight = menuHeight/scrollingRatio;
					
					var scrollingHandle = $('<div class="scrollingHandle">').css({"position":"absolute","top":"0"});
					var scrollingContent = $('<div class="scrollingContent">').css({"position":"absolute","width":menuWidth,"top":"0"});
					
					menuElement.height(menuHeight).append(scrollingContent.append($("UL",menuElement))).append(scrollingBar.append(scrollingHandle));
					
					var handlePaddingTop = parseInt(scrollingHandle.css("paddingTop"));
					
					if( (scrollingHandleHeight - handlePaddingTop) < 0 ){
						scrollingHandleHeight = handlePaddingTop;
						scrollingRatio = (scrollingPanelHeight - menuHeight)/(menuHeight - scrollingHandleHeight*2);
						$("UL LI",scrollingContent).css("paddingRight",parseInt($("UL LI:first",scrollingContent).css("paddingRight"))+widthDiff);
					}
					else{
						scrollingHandleHeight = parseInt(scrollingHandleHeight - parseInt(scrollingHandle.css("paddingTop")));
					}
					
					
					
					scrollingHandle.height(scrollingHandleHeight)
					
					scrollingHandle.append($('<div class="scrollingHandleBottom">').height(scrollingHandleHeight));
					
					var defaultScrollMove = 10;
					var restHeight = menuHeight - ( scrollingHandleHeight + handlePaddingTop);
					var scrollsSum = (scrollingPanelHeight-menuHeight) / defaultScrollMove;
					
					
					if ((restHeight / scrollsSum)>1){
					scrollingHandle.data("pm", defaultScrollMove);
					scrollingHandle.data("sm", (restHeight / scrollsSum))
					
					}
					else{
						var prop = 1 / (restHeight / scrollsSum);
						scrollingHandle.data("sm", 1);
						scrollingHandle.data("pm", defaultScrollMove*prop);
						
					}
					
					scrollingHandle.data("sr",scrollingRatio);
					
					scrollingHandle.draggable({
						containment:"parent",
						drag:function(event,ui){
							scrollingContent.css("top",(-1*ui.position.top)*scrollingRatio);	
						},
						stop: function(event, ui) { 
							optionList.data("ds",true);
                            setTimeout(function(){
                                optionList.data("ds",false);
                            },50);
						}
					});
					
					menuElement.hover(function(){
						currentElem = scrollingContent;
						currentScroll = scrollingHandle;
						
					},function(){
						currentElem = null;
						currentScroll = null;
					});
					
					scrollingBar.click(function(e){
						var yClick =  e.pageY - $(this).offset().top;
						scrollingHandle.css("top",yClick - (scrollingHandle.outerHeight()/2));
						if (parseInt(scrollingHandle.css("top"))<0){
							scrollingHandle.css("top","0")
						}
						else if ( (parseInt(scrollingHandle.css("top")) + scrollingHandle.outerHeight())> scrollingBar.outerHeight() ){
							scrollingHandle.css("top", scrollingBar.outerHeight() - scrollingHandle.outerHeight() );
						}
						scrollingContent.css("top",(-1*parseInt(scrollingHandle.css("top")))*scrollingRatio);
						e.stopPropagation()
					});
					
					var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
					var scrollObj = menuElement[0];
					
					if (scrollObj.attachEvent){ //if IE (and Opera depending on user setting)
						scrollObj.attachEvent("on"+mousewheelevt, scrollOptions)
					}
					else if (scrollObj.addEventListener){ //WC3 browsers
						scrollObj.addEventListener(mousewheelevt, scrollOptions, false)
					}
					
				}
            });

        },
		ffCustomScrollCheckPosition: function(){
			return this.each(function () {
				var element = $(this);
				var $curScrollingWrapper = element.parent(".scrollingContent");
				var $curScrollTop = parseInt($curScrollingWrapper.css("top"));
				var $curScroolingHandle = $curScrollingWrapper.next(".scrollingBarWrapper").children(".scrollingHandle");
				
				var $curWrapper = element.closest(".ffSelectMenuMid");
				var $curSelectHeight = parseInt($curWrapper.height());
				var $curSelected = $("LI.on", element);
			
				
				if (($curSelectHeight - $curScrollTop) < ($curSelected.offset().top - element.offset().top + $curSelected.outerHeight())) {
					if (($("LI:last", element).offset().top - $curSelected.offset().top) < $curSelectHeight)
					{
						$curScrollingWrapper.css("top",$curSelectHeight - parseInt($curScrollingWrapper.height()));
					}
					else{
						$curScrollingWrapper.css("top", -($curSelected.offset().top - element.offset().top));
					}
					$curScroolingHandle.css("top",parseInt($curScrollingWrapper.css("top"))/(-1*parseFloat($curScroolingHandle.data("sr"))));
					
				}
				else if (-($curScrollTop) > ($curSelected.offset().top - element.offset().top)) {
					if (($curSelected.offset().top - $("LI:first", element).offset().top) < $curSelectHeight)
					{
						$curScrollingWrapper.css("top","0");
					}
					else{
						$curScrollingWrapper.css("top", -($curSelected.offset().top - element.offset().top) + ($curSelectHeight - $curSelected.outerHeight()));
					}
					$curScroolingHandle.css("top",parseInt($curScrollingWrapper.css("top"))/(-1*parseFloat($curScroolingHandle.data("sr"))));
				}	
			});
		}
    };

    
	function scrollOptions(e){
		var evnt=window.event || e ;
		var delta=evnt.detail? evnt.detail*(-120) : evnt.wheelDelta;
		var sm = currentScroll.data("sm");
		var pm = currentScroll.data("pm");
		if (delta<=-120){
            // scroll down //
			if (currentElem!=null){
				var farFromBottom = parseInt(currentScroll.closest(".scrollingBarWrapper").outerHeight()) - ( parseInt(currentScroll.outerHeight()) + parseInt(currentScroll.css("top")));
				if ( farFromBottom > sm )
				{
					currentElem.css("top",parseInt(currentElem.css("top"))-pm);
					currentScroll.css("top",parseInt(currentScroll.css("top"))+sm);
				}
				else if(farFromBottom > 0){
					currentElem.css("top",parseInt(currentElem.closest(".ffSelectMenuMid").height()) - parseInt(currentElem.height()));
					currentScroll.css("top",parseInt(currentScroll.css("top"))+farFromBottom);
				}
			}
			
		}else{
			// scroll up //
			if (currentElem!=null){
				if(parseInt(currentElem.css("top"))< -pm)
				{
					currentElem.css("top",parseInt(currentElem.css("top"))+pm);
					currentScroll.css("top",parseInt(currentScroll.css("top"))-sm);
				}
				else if(parseInt(currentElem.css("top"))<0){
					currentElem.css("top",0);
					currentScroll.css("top",0);
				}
				
			}
			
		}
		
		if (evnt.preventDefault) 
			evnt.preventDefault()
		else
			return false
	}
	
    $.fn.ffCustomScroll = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }
    };


})(jQuery);







