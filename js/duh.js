;(function($){

	/*** DUH ***/

	window.DUH = {
		activeClass: 'duh-active',
		deactiveClass: 'duh-deactive',
		hasInitialBreakpoint: false,

		breakpoint: {},
		breakpoints: [],

		events: {
			breakpoint: 'DUH.events.breakpoint',
			initialBreakpoint: 'DUH.events.initialBreakpoint',
			activate: 'DUH.events.activate',
			deactivate: 'DUH.events.deactivate'
		},

		activate: function($el, bubble){
			var bubble = typeof bubble !== 'undefined' ?  bubble : true;
			var triggerMethod = bubble ? 'trigger' : 'triggerHandler';

			$('[data-group="'+$el.data('group')+'"]').not($el).removeClass(DUH.activeClass).addClass(DUH.deactiveClass)[triggerMethod](DUH.events.deactivate);
			if($el.is('option')){ $el.prop('selected', 'selected'); }
			$el.removeClass(DUH.deactiveClass).addClass(DUH.activeClass)[triggerMethod](DUH.events.activate);

			return $el;
		},

		deactivate: function($el, bubble){
			var bubble = typeof bubble !== 'undefined' ?  bubble : true;
			var triggerMethod = bubble ? 'trigger' : 'triggerHandler';

			$el.removeClass(DUH.activeClass)[triggerMethod](DUH.events.deactivate);

			return $el;
		},

		toggle: function($el, bubble){
			var bubble = typeof bubble !== 'undefined' ?  bubble : true;

			if($el.hasClass(DUH.activeClass)){ DUH.deactivate($el, bubble); }else{ DUH.activate($el, bubble); }

			return $el;
		},

		isBreakpoint: function(breakpoint){
			if(breakpoint instanceof Array){
				if(breakpoint.indexOf(DUH.breakpoint.name) > -1){
					return true;
				}else{
					return false;
				}
			}else if(typeof breakpoint === 'string'){
				if(DUH.breakpoint.name === breakpoint){
					return true;
				}else{
					return false;
				}
			}
		},

		onInitialBreakpoint: function(callback){
			if(DUH.hasInitialBreakpoint){
				callback.apply(this);
			}else{
				$(DUH).on(DUH.events.initialBreakpoint, function(){ 
					callback.apply(this);
				});
			}
		},

		onBreakpoint: function(breakpoint, callback){
			if (arguments.length === 1) {
				callback = arguments[0];
				breakpoint = null;
			}

			$(DUH).on(DUH.events.breakpoint, function(){
				if(breakpoint){
					if(DUH.isBreakpoint(breakpoint)){
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

		$('[data-activate], [data-toggle], [data-deactivate], [data-hover]').each(function(){
			var $this = $(this);
			var dataAttr;

			if($this.attr('data-activate')){   dataAttr = 'activate'; }
			if($this.attr('data-toggle')){     dataAttr = 'toggle'; }
			if($this.attr('data-deactivate')){ dataAttr = 'deactivate'; }
			if($this.attr('data-hover')){      dataAttr = 'hover'; }

			var $selected = $($this.data(dataAttr));

			if(dataAttr === 'activate' || dataAttr === 'toggle' || dataAttr === 'hover'){
				$selected.on(DUH.events.activate, function(){
					DUH.activate($this, false);
				});
			}

			$selected.on(DUH.events.deactivate, function(){
				DUH.deactivate($this, false);
			});

			if($this.is('option')){
				var $select = $this.parent('select');
				$select.change(function(){
					if($select.find('option:selected').is($this)){
						DUH[dataAttr]($selected);
					}
				});
			}else{
				if(dataAttr === 'hover'){
					$this.mouseenter(function(){ DUH.activate($selected); });
					$this.mouseleave(function(){ DUH.deactivate($selected); });
				}else{
					$this.click(function(){
						DUH[dataAttr]($selected);
					});
				}
			}
		});

		//breakpoints
		$window.on('load resize', function(){
			var checkBreakpoint = getCurrentBreakpoint();
			if(DUH.breakpoint.name != checkBreakpoint.name){
				DUH.breakpoint = checkBreakpoint;
				$(DUH).trigger(DUH.events.breakpoint);

				if(!DUH.hasInitialBreakpoint){
					DUH.hasInitialBreakpoint = true;
					$(DUH).trigger(DUH.events.initialBreakpoint);
				}
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

	$.fn.animateAutoWidth = function(animationOptions, callback) {
		var self = this;
		animationOptions = $.extend({
			duration: 200,
			complete: function(){
				self.css('width', 'auto');
				if(callback){ callback.apply(self); }
			}
		}, animationOptions);

		var curWidth = this.outerWidth(true);
		self.css('width', 'auto');
		var autoWidth = this.outerWidth(true);
		self.width(curWidth).stop(true).animate({ width: autoWidth }, animationOptions);
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

	$.fn.animateZeroWidth = function(animationOptions, callback) {
		var self = this;
		animationOptions = $.extend({
			duration: 200,
			complete: function(){
				if(callback){ callback.apply(self); }
			}
		}, animationOptions);

		self.stop(true).animate({ width: 0 }, animationOptions);
	};

})(jQuery);