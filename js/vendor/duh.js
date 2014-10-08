
$(function(){
	DUH = {

		breakpoint: {},

		show: function($el){
			$el.addClass('active').triggerHandler('DUH:show');
			$('[data-group="'+$el.data('group')+'"]').not($el).removeClass('active').each(function(){ $(this).triggerHandler('DUH:hide'); });

			var id = $el.prop('id');
			var $links = $('[data-show-href="#'+id+'"], [data-toggle-href="#'+id+'"], [data-scroll-href="#'+id+'"]');
			$links.each(function(){
				var $link = $(this);
				$link.addClass('active').triggerHandler('DUH:show');
				if($link.is('option')){ $link.prop('selected', 'selected'); }
				$('[data-group="'+$link.data('group')+'"]').not($link).removeClass('active').each(function(){ $(this).triggerHandler('DUH:hide'); });
			});
		},

		hide: function($el){
			$el.removeClass('active').triggerHandler('DUH:hide');

			var id = $el.prop('id');
			var $links = $('[data-show-href="#'+id+'"], [data-toggle-href="#'+id+'"], [data-scroll-href="#'+id+'"], [data-hide-href="#'+id+'"]');
			$links.each(function(){
				$(this).removeClass('active').triggerHandler('DUH:hide');
			});
		},

		toggle: function($el){
			if($el.hasClass('active')){ this.hide($el); }else{ this.show($el); }
		},

		scrollTo: function($el, options){
			this.show($el);

			options = $.extend({
				$scrollable: $('body'),
				direction: 'vertical',
				speed: 200,
				offsetX: 0,
				offsetY: 0
			}, options);

			if(options.$scrollable.is('body')){ options.$scrollable = $("html, body"); }

			if(options.direction === 'horizontal'){
				options.$scrollable.stop(true, true).animate({
			        scrollLeft:  options.$scrollable.scrollLeft() - options.$scrollable.offset().left + $el.offset().left - options.offsetX
			    }, options.speed); 
			}else{
				options.$scrollable.stop(true, true).animate({
			        scrollTop:  options.$scrollable.scrollTop() - options.$scrollable.offset().top + $el.offset().top - options.offsetY
			    }, options.speed); 
			}
		}
	}

	function _scrollToFromLink($this){
		var direction = $this.data('scrollable') ? $($this.data('scrollable')).data('scrollspy') : null;
		DUH.scrollTo($($this.data('scroll-href')),{
			$scrollable: $($this.data('scrollable')), 
			direction: direction,
			offsetX: $this.data('scroll-offset-x'),
			offsetY: $this.data('scroll-offset-y'),
			speed: $this.data('scroll-speed')
		});
	}

	$('body').on('click', '[data-show-href]',   function(){ DUH.show($($(this).data('show-href'))); });
	$('body').on('click', '[data-hide-href]',   function(){ DUH.hide($($(this).data('hide-href'))); });
	$('body').on('click', '[data-toggle-href]', function(){ DUH.toggle($($(this).data('toggle-href'))); });
	$('body').on('change', 'select', function(){
		var $selectedOption = $(this).find('option:selected');
		if($selectedOption.data('show-href')){ DUH.show($($selectedOption.data('show-href'))); }
		if($selectedOption.data('hide-href')){ DUH.hide($($selectedOption.data('hide-href'))); }
		if($selectedOption.data('toggle-href')){ DUH.toggle($($selectedOption.data('toggle-href'))); }
		if($selectedOption.data('scroll-href')){
			_scrollToFromLink($selectedOption);
		}
	});

	$('body').on('click', '[data-scroll-href]', function(){ 
		_scrollToFromLink($(this));
	});

	var isFireFox = (/Firefox/i.test(navigator.userAgent));
	var mousewheelevt = isFireFox ? "DOMMouseScroll" : "mousewheel";

	//scrollspy
	$('[data-scrollspy]').on(mousewheelevt, function(){
		var $scrollable = $(this);
		var direction = $scrollable.data('scrollspy');
		var scrollTop = $scrollable.scrollTop();
		var scrollLeft = $scrollable.scrollLeft();
		var closestNum = Infinity;
		var $closest = null;
		if($scrollable.is('body')){ scrollTop = $('body').scrollTop() || $('html').scrollTop(); }

		$('[data-scrollable="#'+$scrollable.prop('id')+'"]').each(function(){
			var $button = $(this);
			var $spyable = $($button.data('scroll-href'));
			var spyableScrollTop = $scrollable.scrollTop() - $scrollable.offset().top + $spyable.offset().top;
			var spyableScrollLeft = $scrollable.scrollLeft() - $scrollable.offset().left + $spyable.offset().left;
			var difference;

			if(direction === 'horizontal'){
				difference = Math.abs(scrollLeft - spyableScrollLeft);
			}else{
				difference = Math.abs(scrollTop - spyableScrollTop);
			}

			if(difference < closestNum){
				closestNum = difference;
				$closest = $spyable;
			}
			
		});

		DUH.show($closest);
		
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
