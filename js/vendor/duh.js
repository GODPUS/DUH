;(function($){

	window.DUH = { 
		breakpoint: {},
		breakpoints: [],

		events: {
			breakpoint: 'DUH.events.breakpoint',
			activate: 'DUH.events.activate',
			deactivate: 'DUH.events.deactivate',
			scroll: 'DUH.events.scroll'
		},

		activate: function($el){
			var selector = $el.selector;
			$('[data-group="'+$el.data('group')+'"]').not($el).removeClass('active').each(function(){ $(this).trigger(DUH.events.deactivate); });
			$el.addClass('active').trigger(DUH.events.activate);

			var $links = $('[data-activate="'+selector+'"], [data-toggle="'+selector+'"], [data-scroll="'+selector+'"]').not($el);
			$links.each(function(){
				var $link = $(this);
				$('[data-group="'+$link.data('group')+'"]').not($link).removeClass('active').each(function(){ $(this).trigger(DUH.events.deactivate); });
				if($link.is('option')){ $link.prop('selected', 'selected'); }
				$link.addClass('active').trigger(DUH.events.activate);
			});

			return $el;
		},

		deactivate: function($el){
			var selector = $el.selector;
			$el.removeClass('active').trigger(DUH.events.deactivate);

			var $links = $('[data-deactivate="'+selector+'"], [data-toggle="'+selector+'"], [data-activate="'+selector+'"]').not($el);
			$links.each(function(){
				$(this).removeClass('active').trigger(DUH.events.deactivate);
			});

			return $el;
		},

		toggle: function($el){
			var selector = $el.selector;
			if($el.hasClass('active')){ DUH.deactivate($el); }else{ DUH.activate($el); }

			return $el;
		},

		scroll: function($el, options){
			var selector = $el.selector;
			DUH.activate($el);
			$el.trigger(DUH.events.scroll);

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

			return $el;
		},

		onBreakpoint: function(breakpoints, callback){
			if (arguments.length === 1) {
				callback = arguments[0];
				breakpoints = null;
			}

			$(DUH).on(DUH.events.breakpoint, function(){
				if(breakpoints){
					if(breakpoints.indexOf(DUH.breakpoint.name) > -1){
						callback.apply(this);
					}
				}else{
					callback.apply(this);
				}
			});
		}
	};

	$.fn.onlyOn = function(event, selector, callback) {
		$.fn.on.apply(this, [event, selector, function(e){
			if(e.target === this){
				e.stopPropagation();
				callback.apply(this, [e]);
			}
		}]);

		return this;
	};

	function scrollToFromLink($this){
		var direction = $this.data('scrollable') ? $($this.data('scrollable')).data('scrollspy') : null;
		DUH.scroll($($this.data('scroll')), {
			$scrollable: $($this.data('scrollable')), 
			direction: direction,
			offsetX: $this.data('scroll-offset-x'),
			offsetY: $this.data('scroll-offset-y'),
			speed: $this.data('scroll-speed')
		});
	}

	$(document).ready(function(){

		$('body').on('click', '[data-activate]',   function(){ DUH.activate($($(this).data('activate'))); });
		$('body').on('click', '[data-deactivate]',   function(){ DUH.deactivate($($(this).data('deactivate'))); });
		$('body').on('click', '[data-toggle]', function(){ DUH.toggle($($(this).data('toggle'))); });
		$('body').on('mouseenter', '[data-hover]', function(){ DUH.activate($($(this).data('hover'))); });
		$('body').on('mouseleave', '[data-hover]', function(){ DUH.deactivate($($(this).data('hover'))); });

		$('body').on('change', 'select', function(){
			var $selectedOption = $(this).find('option:selected');
			if($selectedOption.data('activate')){ DUH.activate($($selectedOption.data('activate'))); }
			if($selectedOption.data('deactivate')){ DUH.deactivate($($selectedOption.data('deactivate'))); }
			if($selectedOption.data('toggle')){ DUH.toggle($($selectedOption.data('toggle'))); }
			if($selectedOption.data('scroll')){
				scrollToFromLink($selectedOption);
			}
		});

		$('body').on('click', '[data-scroll]', function(){ 
			scrollToFromLink($(this));
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
				var $spyable = $($button.data('scroll'));
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
					$closest = $($button.data('scroll'));
				}
				
			});

			DUH.activate($closest);		
		});


		//breakpoints
		$(window).on('load resize', function(){
			var checkBreakpoint = getCurrentBreakpoint();
			if(DUH.breakpoint.name != checkBreakpoint.name){
				DUH.breakpoint = checkBreakpoint;
				$(DUH).trigger(DUH.events.breakpoint);
			}
		});

		function getBreakpointString(){
			var breakpoint = null;
			if (document.documentElement.currentStyle) { breakpoint = document.documentElement.currentStyle["fontFamily"]; }
			if (window.getComputedStyle) { breakpoint = window.getComputedStyle(document.documentElement,null).getPropertyValue('font-family'); }
			if (breakpoint != null){ return breakpoint; }else{ return false; }
		}

		function getCurrentBreakpoint(){
			var breakpoint = getBreakpointString();
			var breakpointObj = {};
			breakpoint = breakpoint.replace(/['",]/g, '');
			breakpointObj.name = breakpoint.split(':')[0];
			breakpointObj.width = parseInt(breakpoint.split(':')[1]);
			return breakpointObj;
		}

		function getAllBreakpoints(){
			var breakpoint = getBreakpointString();
			var breakpoints = [];
			breakpoints = breakpoint.split(',');
			breakpoints.shift();

			for(var i = 0; i < breakpoints.length; i++){
				var string = breakpoints[i].replace(/['",]/g, '');
				var name = string.split(':')[0];
				var width = parseInt(string.split(':')[1]);
				DUH.breakpoints.push({ name: name, width: width });
			}
		}

		getAllBreakpoints();
	});

})(jQuery);