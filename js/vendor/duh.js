;(function($){

	window.DUH = { 
		breakpoint: {},
		breakpoints: [],

		events: {
			breakpoint: 'DUH.events.breakpoint',
			show: 'DUH.events.show',
			hide: 'DUH.events.hide',
			scroll: 'DUH.events.scroll'
		},

		show: function($el){
			var selector = $el.selector;
			$el.addClass('active').trigger(DUH.events.show);
			$('[data-group="'+$el.data('group')+'"]').not($el).removeClass('active').each(function(){ $(this).trigger(DUH.events.hide); });

			var $links = $('[data-show-target="'+selector+'"], [data-toggle-target="'+selector+'"], [data-scroll-target="'+selector+'"]');
			$links.each(function(){
				var $link = $(this);
				$link.addClass('active').trigger(DUH.events.show);
				if($link.is('option')){ $link.prop('selected', 'selected'); }
				$('[data-group="'+$link.data('group')+'"]').not($link).removeClass('active').each(function(){ $(this).trigger(DUH.events.hide); });
			});

			return $el;
		},

		hide: function($el){
			var selector = $el.selector;
			$el.removeClass('active').trigger(DUH.events.hide);

			var $links = $('[data-hide-target="'+selector+'"], [data-toggle-target="'+selector+'"], [data-show-target="'+selector+'"]');
			$links.each(function(){
				$(this).removeClass('active').trigger(DUH.events.hide);
			});

			return $el;
		},

		toggle: function($el){
			var selector = $el.selector;
			if($el.hasClass('active')){ DUH.hide($el); }else{ DUH.show($el); }

			return $el;
		},

		scroll: function($el, options){
			var selector = $el.selector;
			DUH.show($el);
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
		DUH.scroll($($this.data('scroll-target')), {
			$scrollable: $($this.data('scrollable')), 
			direction: direction,
			offsetX: $this.data('scroll-offset-x'),
			offsetY: $this.data('scroll-offset-y'),
			speed: $this.data('scroll-speed')
		});
	}

	$(document).ready(function(){

		$('body').on('click', '[data-show-target]',   function(){ DUH.show($($(this).data('show-target'))); });
		$('body').on('click', '[data-hide-target]',   function(){ DUH.hide($($(this).data('hide-target'))); });
		$('body').on('click', '[data-toggle-target]', function(){ DUH.toggle($($(this).data('toggle-target'))); });
		$('body').on('mouseenter', '[data-hover-toggle-target]', function(){ DUH.show($($(this).data('hover-toggle-target'))); });
		$('body').on('mouseleave', '[data-hover-toggle-target]', function(){ DUH.hide($($(this).data('hover-toggle-target'))); });

		$('body').on('change', 'select', function(){
			var $selectedOption = $(this).find('option:selected');
			if($selectedOption.data('show-target')){ DUH.show($($selectedOption.data('show-target'))); }
			if($selectedOption.data('hide-target')){ DUH.hide($($selectedOption.data('hide-target'))); }
			if($selectedOption.data('toggle-target')){ DUH.toggle($($selectedOption.data('toggle-target'))); }
			if($selectedOption.data('scroll-target')){
				scrollToFromLink($selectedOption);
			}
		});

		$('body').on('click', '[data-scroll-target]', function(){ 
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

			DUH.show($closest);		
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