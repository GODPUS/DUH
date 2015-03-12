;(function($){

	/*** DUH ***/

	window.DUH = {
		activeClass: 'active',

		breakpoint: {},
		breakpoints: [],

		events: {
			breakpoint: 'DUH.events.breakpoint',
			activate: 'DUH.events.activate',
			deactivate: 'DUH.events.deactivate'
		},

		activate: function($el){
			$('[data-group="'+$el.data('group')+'"]').not($el).removeClass(DUH.activeClass).each(function(){ $(this).trigger(DUH.events.deactivate); });
			$el.addClass(DUH.activeClass).trigger(DUH.events.activate);

			$('[data-activate], [data-toggle]').each(function(){
				var $link = $(this);

				if($el.is($link.data('activate')) || $el.is($link.data('toggle'))){

					$('[data-group="'+$link.data('group')+'"]').not($link).removeClass(DUH.activeClass).each(function(){ $(this).trigger(DUH.events.deactivate); });
					if($link.is('option')){ $link.prop('selected', 'selected'); }
					$link.addClass(DUH.activeClass).trigger(DUH.events.activate);
				}
			});

			return $el;
		},

		deactivate: function($el){
			$el.removeClass(DUH.activeClass).trigger(DUH.events.deactivate);

			var $links = $('[data-activate], [data-deactivate], [data-toggle]').each(function(){
				var $link = $(this);

				if($el.is($link.data('activate')) || $el.is($link.data('deactivate')) || $el.is($link.data('toggle'))){
					$link.removeClass(DUH.activeClass).trigger(DUH.events.deactivate);
				}
			});

			return $el;
		},

		toggle: function($el){
			if($el.hasClass(DUH.activeClass)){ DUH.deactivate($el); }else{ DUH.activate($el); }

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

	/*** ATTACH TO DOM ***/

	window.$document = $(document);
	window.$window = $(window);

	$document.ready(function(){
		window.$html = $('html');
		window.$body = $('body');
		var $duhBreakpointInfo = $('#duh-breakpoint-info');

		//event listeners
		$body.on('click', '[data-activate]',   function(){ DUH.activate($($(this).data('activate'))); });
		$body.on('click', '[data-deactivate]',   function(){ DUH.deactivate($($(this).data('deactivate'))); });
		$body.on('click', '[data-toggle]', function(){ DUH.toggle($($(this).data('toggle'))); });
		$body.on('mouseenter', '[data-hover]', function(){ DUH.activate($($(this).data('hover'))); });
		$body.on('mouseleave', '[data-hover]', function(){ DUH.deactivate($($(this).data('hover'))); });

		$body.on('change', 'select', function(){
			var $selectedOption = $(this).find('option:selected');
			if($selectedOption.data('activate')){ DUH.activate($($selectedOption.data('activate'))); }
			if($selectedOption.data('deactivate')){ DUH.deactivate($($selectedOption.data('deactivate'))); }
			if($selectedOption.data('toggle')){ DUH.toggle($($selectedOption.data('toggle'))); }
		});

		//breakpoints
		$window.on('load resize', function(){
			var checkBreakpoint = getCurrentBreakpoint();
			if(DUH.breakpoint.name != checkBreakpoint.name){
				DUH.breakpoint = checkBreakpoint;
				$(DUH).trigger(DUH.events.breakpoint);
			}
		});

		function getCurrentBreakpoint(){
			var breakpoint = $duhBreakpointInfo.css('font-family');
			var breakpointObj = {};
			breakpoint = breakpoint.replace(/['",]/g, '');
			breakpointObj.name = breakpoint.split(':')[0];
			breakpointObj.width = parseInt(breakpoint.split(':')[1]);
			return breakpointObj;
		}

		function getAllBreakpoints(){
			var breakpoint = $duhBreakpointInfo.css('font-family');
			var breakpoints = [];
			breakpoints = breakpoint.split(',');
			breakpoints.shift();

			$.each(breakpoints, function(index, value){
				var string = value.replace(/['",]/g, '');
				var name = string.split(':')[0];
				var width = parseInt(string.split(':')[1]);
				DUH.breakpoints.push({ name: name, width: width });
			});
		}

		getAllBreakpoints();
	});

	
	/*** JQUERY HELPER METHODS ***/

	$.fn.onlyOn = function(event, selector, callback) {
		$.fn.on.apply(this, [event, selector, function(e){
			if(e.target === this){
				e.stopPropagation();
				callback.apply(this, [e]);
			}
		}]);

		return this;
	};

	$.fn.exists = function(){
		if(this.length){ return true }else{ return false }
	}

	$.fn.animateAutoHeight = function(animationOptions, callback) {
		var self = this;
		animationOptions = $.extend({
			duration: 200,
			complete: function(){
				self.css('height', 'auto');
				if(callback){ callback.apply(self); }
			}
		}, animationOptions);

		var curHeight = this.outerHeight(true);
		self.css('height', 'auto');
		var autoHeight = this.outerHeight(true);

		self.height(curHeight).stop(true).animate({ height: autoHeight }, animationOptions);
	};

	$.fn.animateZeroHeight = function(animationOptions, callback) {
		var self = this;
		animationOptions = $.extend({
			duration: 200,
			complete: function(){
				if(callback){ callback.apply(self); }
			}
		}, animationOptions);

		self.stop(true).animate({ height: 0 }, animationOptions);
	};

})(jQuery);