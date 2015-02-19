$(function(){
	DUH = {

		breakpoint: {},

		show: function(selector){
			var $el = $(selector);
			$el.addClass('active').triggerHandler('DUH:show');
			$('[data-group="'+$el.data('group')+'"]').not($el).removeClass('active').each(function(){ $(this).triggerHandler('DUH:hide'); });

			var $links = $('[data-show-target="'+selector+'"], [data-toggle-target="'+selector+'"], [data-scroll-target="'+selector+'"]');
			$links.each(function(){
				var $link = $(this);
				$link.addClass('active').triggerHandler('DUH:show');
				if($link.is('option')){ $link.prop('selected', 'selected'); }
				$('[data-group="'+$link.data('group')+'"]').not($link).removeClass('active').each(function(){ $(this).triggerHandler('DUH:hide'); });
			});
		},

		hide: function(selector){
			var $el = $(selector);
			$el.removeClass('active').triggerHandler('DUH:hide');

			var $links = $('[data-hide-target="'+selector+'"], [data-toggle-target="'+selector+'"], [data-show-target="'+selector+'"]');
			$links.each(function(){
				$(this).removeClass('active').triggerHandler('DUH:hide');
			});
		},

		toggle: function(selector){
			var $el = $(selector);
			if($el.hasClass('active')){ this.hide(selector); }else{ this.show(selector); }
		},

		scrollTo: function(selector, options){
			var $el = $(selector);
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
		DUH.scrollTo($this.data('scroll-target'),{
			$scrollable: $($this.data('scrollable')), 
			direction: direction,
			offsetX: $this.data('scroll-offset-x'),
			offsetY: $this.data('scroll-offset-y'),
			speed: $this.data('scroll-speed')
		});
	}

	$('body').on('click', '[data-show-target]',   function(){ DUH.show($(this).data('show-target')); });
	$('body').on('click', '[data-hide-target]',   function(){ DUH.hide($(this).data('hide-target')); });
	$('body').on('click', '[data-toggle-target]', function(){ DUH.toggle($(this).data('toggle-target')); });
	$('body').on('mouseenter', '[data-hover-toggle-target]', function(){ DUH.show($(this).data('hover-toggle-target')); });
	$('body').on('mouseleave', '[data-hover-toggle-target]', function(){ DUH.hide($(this).data('hover-toggle-target')); });

	$('body').on('change', 'select', function(){
		var $selectedOption = $(this).find('option:selected');
		if($selectedOption.data('show-target')){ DUH.show($selectedOption.data('show-target')); }
		if($selectedOption.data('hide-target')){ DUH.hide($selectedOption.data('hide-target')); }
		if($selectedOption.data('toggle-target')){ DUH.toggle($selectedOption.data('toggle-target')); }
		if($selectedOption.data('scroll-target')){
			_scrollToFromLink($selectedOption);
		}
	});

	$('body').on('click', '[data-scroll-target]', function(){ 
		_scrollToFromLink($(this));
		DUH.show($(this).data('scroll-target'));
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
		var closest = null;
		if($scrollable.is('body') || $scrollable.is('html')){ scrollTop = $('body').scrollTop() || $('html').scrollTop(); }

		$('[data-scrollable="#'+$scrollable.prop('id')+'"]').each(function(){
			var $button = $(this);
			var $spyable = $($button.data('scroll-target'));
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
				closest = $button.data('scroll-target');
			}
			
		});

		DUH.show(closest);		
	});


	//breakpoints
	$(window).on('load resize', function(){
		var checkBreakpoint = getCurrentBreakpoint();
		if(DUH.breakpoint.name != checkBreakpoint.name){
			DUH.breakpoint = checkBreakpoint;
			$(DUH).trigger('DUH:breakpoint');
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
			breakpointObj.width = parseInt(breakpoint.split(':')[1]);
		};
		return breakpointObj;
	}
});
