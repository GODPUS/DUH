;(function($){

	window.DUH = { breakpoint: {} };

	$.fn.DUHShow = function(){
		var $el = this;
		var selector = $el.selector;
		console.log(selector);
		$el.addClass('active').trigger('DUH:show');
		$('[data-group="'+$el.data('group')+'"]').not($el).removeClass('active').each(function(){ $(this).trigger('DUH:hide'); });

		var $links = $('[data-show-target="'+selector+'"], [data-toggle-target="'+selector+'"], [data-scroll-target="'+selector+'"]');
		$links.each(function(){
			var $link = $(this);
			$link.addClass('active').trigger('DUH:show');
			if($link.is('option')){ $link.prop('selected', 'selected'); }
			$('[data-group="'+$link.data('group')+'"]').not($link).removeClass('active').each(function(){ $(this).trigger('DUH:hide'); });
		});

		return this;
	}

	$.fn.DUHHide = function(){
		var $el = this;
		var selector = $el.selector;
		$el.removeClass('active').trigger('DUH:hide');

		var $links = $('[data-hide-target="'+selector+'"], [data-toggle-target="'+selector+'"], [data-show-target="'+selector+'"]');
		$links.each(function(){
			$(this).removeClass('active').trigger('DUH:hide');
		});

		return this;
	}

	$.fn.DUHToggle = function(){
		var $el = this;
		var selector = $el.selector;
		if($el.hasClass('active')){ $el.DUHHide(); }else{ $el.DUHShow(); }

		return this;
	}

	$.fn.DUHScrollTo = function(options){
		var $el = this;
		var selector = $el.selector;
		$el.DUHShow();

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

		return this;
	}

	$.fn.onlyOn = function(event, selector, callback) {
		$.fn.on.apply(this, [event, selector, function(e){
			if(e.target === this){
				e.stopPropagation();
				callback.apply(this, [e]);
			}
		}]);

		return this;
	};

	function _scrollToFromLink($this){
		var direction = $this.data('scrollable') ? $($this.data('scrollable')).data('scrollspy') : null;
		$($this.data('scroll-target')).DUHScrollTo({
			$scrollable: $($this.data('scrollable')), 
			direction: direction,
			offsetX: $this.data('scroll-offset-x'),
			offsetY: $this.data('scroll-offset-y'),
			speed: $this.data('scroll-speed')
		});
	}

	$(document).ready(function(){

		$('body').on('click', '[data-show-target]',   function(){ $($(this).data('show-target')).DUHShow(); });
		$('body').on('click', '[data-hide-target]',   function(){ $($(this).data('hide-target')).DUHHide(); });
		$('body').on('click', '[data-toggle-target]', function(){ $($(this).data('toggle-target')).DUHToggle(); });
		$('body').on('mouseenter', '[data-hover-toggle-target]', function(){ $($(this).data('hover-toggle-target')).DUHShow(); });
		$('body').on('mouseleave', '[data-hover-toggle-target]', function(){ $($(this).data('hover-toggle-target')).DUHHide(); });

		$('body').on('change', 'select', function(){
			var $selectedOption = $(this).find('option:selected');
			if($selectedOption.data('show-target')){ $($selectedOption.data('show-target')).DUHShow(); }
			if($selectedOption.data('hide-target')){ $($selectedOption.data('hide-target')).DUHHide(); }
			if($selectedOption.data('toggle-target')){ $($selectedOption.data('toggle-target')).DUHToggle(); }
			if($selectedOption.data('scroll-target')){
				_scrollToFromLink($selectedOption);
			}
		});

		$('body').on('click', '[data-scroll-target]', function(){ 
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
					$closest = $($button.data('scroll-target'));
				}
				
			});

			$closest.DUHShow();		
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

})(jQuery);