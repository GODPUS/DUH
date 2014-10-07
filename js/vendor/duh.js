
$(function(){
	DUH = {

		breakpoint: {},

		show: function($el, type) {
			$el.addClass('active').triggerHandler('DUH.show');
			if($el.is('option')){ $el.prop('selected', 'selected'); }

			if(type){
				var href = $el.data(type+'-href');
				var $sameHrefElements = $('[data-'+type+'-href="'+href+'"]').not($el);

				$sameHrefElements.each(function(){
					var $el = $(this);
					$('[data-group="'+$el.data('group')+'"]').not($el).removeClass('active').triggerHandler('hide');
					$el.addClass('active').triggerHandler('show');
					if($el.is('option')){ $el.prop('selected', 'selected'); }
				});

				var $target = $(href);
				var $targetGroup = $('[data-group="'+$target.data('group')+'"]').not($target);
				$targetGroup.removeClass('active').each(function(){ $(this).triggerHandler('hide'); });
				$target.addClass('active').each(function(){ $(this).triggerHandler('show'); });
			}
		},

		hide: function($el, type) {
			$el.removeClass('active').triggerHandler('hide');

			if(type) {
				var href = $el.data(type+'-href');
				$(href).removeClass('active').each(function(){ $(this).triggerHandler('hide'); });
				if(type === 'hide'){ $('[data-show-href="'+href+'"]').removeClass('active').each(function(){ $(this).triggerHandler('hide'); }); }
			}
		},

		toggle: function($el, type){
			if(!type){ var type = null; }
			if($el.hasClass('active')){ this.hide($el, type); }else{ this.show($el, type); }
		},

		scrollTo: function($el, offsetX, offsetY){
			var $scrollTo = $($el.data('scroll-href'));
			var $scrollable = $($el.data('scrollable'));
			var _offsetX = offsetX || $el.data('offset-x') || 0;
			var _offsetY = offsetY || $el.data('offset-y') || 0;
			var direction = $scrollable.data('scrollspy');
			if($scrollable.is('body')){ $scrollable = $("html, body"); }

			if(direction === 'vertical'){
				$scrollable.stop(true, true).animate({ scrollTop: $scrollTo.offset().top - _offsetY }, 200);
			}
			if(direction === 'horizontal'){
				$scrollable.stop(true, true).animate({ scrollLeft: $scrollTo.offset().left - _offsetX }, 200);
			}
		}
	}


	//show, hide, toggle, scroll
	$('body').on('click', '[data-show-href]',   function(){ DUH.show($(this), 'show'); });
	$('body').on('click', '[data-hide-href]',   function(){ DUH.hide($(this), 'hide'); });
	$('body').on('click', '[data-toggle-href]', function(){ DUH.toggle($(this), 'toggle'); });
	$('body').on('change', 'select', function(){
		var $selectedOption = $(this).find('option:selected');
		if($selectedOption.prop('data-show-href')){ DUH.show($selectedOption, 'show'); }
		if($selectedOption.prop('data-hide-href')){ DUH.hide($selectedOption, 'hide'); }
		if($selectedOption.prop('data-toggle-href')){ DUH.toggle($selectedOption, 'toggle'); }
		if($selectedOption.prop('data-scroll-href')){
			DUH.show($selectedOption, 'scroll'); 
			DUH.scrollTo($selectedOption);
		}
	});

	$('body').on('click', '[data-scroll-href]', function(){ 
		var $this = $(this);
		DUH.show($this, 'scroll');
		DUH.scrollTo($this);
	});

	var isFireFox = (/Firefox/i.test(navigator.userAgent));
	var mousewheelevt = isFireFox ? "DOMMouseScroll" : "mousewheel";

	//scrollspy
	$('[data-scrollspy]').on(mousewheelevt, function(){
		var $scrollable = $(this);
		var closestNum = null;
		var $closest = null;
		var mostBottomNum = 0;
		var $mostBottom = null;
		var direction = $scrollable.data('scrollspy');
		var scrollTop = $scrollable.scrollTop();
		if($scrollable.is('body')){ scrollTop = $('body').scrollTop() || $('html').scrollTop(); }

		$('[data-scrollable="#'+$scrollable.prop('id')+'"]').each(function(){
			var $button = $(this);
			var $spyable = $($button.data('scroll-href'));
			var difference;

			if(direction === 'vertical'){
				difference = Math.abs(scrollTop - $spyable.offset().top);
			}
			if(direction === 'horizontal'){
				difference = Math.abs(scrollTop - $spyable.offset().left);
			}

			if(closestNum == null || difference < closestNum){
				closestNum = difference;
				$closest = $button;
			}

			if($spyable.offset().top > mostBottomNum){
				mostBottomNum = $spyable.offset().top;
				$mostBottom = $button;
			}
		});

		var scrollableHeight = $scrollable[0].scrollHeight === $scrollable.height() ? $(window).height() : $scrollable.height();

		if(scrollTop >= $scrollable[0].scrollHeight - scrollableHeight)
		{
			DUH.show($mostBottom, 'scroll');
		}else{
			DUH.show($closest, 'scroll');
		}
		
	});


	//breakpoints
	$(window).on('load resize', function(){
		var checkBreakpoint = getCurrentBreakpoint();
		if(DUH.breakpoint.name != checkBreakpoint.name){
			DUH.breakpoint = checkBreakpoint;
			$(DUH).trigger('breakpoint');
			console.log('breakpoint', DUH.breakpoint);
		}
	});

	function getCurrentBreakpoint(){
		var breakpoint = null;
		var breakpointObj = {};
		if (document.documentElement.currentStyle) { breakpoint = document.documentElement.currentStyle["fontFamily"]; }
		if (window.getComputedStyle) { breakpoint = window.getComputedStyle(document.documentElement,null).getPropertyValue('font-family'); }
		if (breakpoint != null){ 
			breakpoint = breakpoint.replace(/['",]/g, ''); 
			breakpointObj.name = breakpoint.split(':')[0];
			breakpointObj.minWidth = breakpoint.split(':')[1];
		};
		return breakpointObj;
	}
});
