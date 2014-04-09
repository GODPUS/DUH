$(function(){

	var strapOn = {
		breakpoint: {},

		show: function($el, type) {
			var href = $el.data(type+'-href');
			var $sameHrefTabs = $('[data-'+type+'-href="'+href+'"]');

			$sameHrefTabs.each(function(){
				var $tab = $(this);
				var $tabGroup = $('[data-group="'+$tab.data('group')+'"]');
				$tabGroup.removeClass('active').trigger('hide');
				$tab.addClass('active').trigger('show');
				if($tab.is('option')){ $tab.attr('selected', 'selected'); }
			});

			var $tabPane = $(href);
			var $tabPaneGroup = $('[data-group="'+$tabPane.data('group')+'"]');
			$tabPaneGroup.removeClass('active').trigger('hide');
			$tabPane.addClass('active').trigger('show');
		},

		hide: function($el, type) {
			var href = $el.data(type+'-href');
			$el.removeClass('active').trigger('hide');
			$(href).removeClass('active').trigger('hide');
		},

		toggle: function($el){
			if($el.hasClass('active')){ this.hide($el, 'toggle'); }else{ this.show($el, 'toggle'); }
		}
	}

	//show, hide, toggle
	$('body').on('click', '[data-show-href]', function(){ strapOn.show($(this), 'show'); });
	$('body').on('click', '[data-hide-href]', function(){ strapOn.hide($(this), 'hide'); });
	$('body').on('click', '[data-toggle-href]', function(){ strapOn.toggle($(this)); });
	$('body').on('change', 'select', function(){
		var $selectedOption = $(this).find('option:selected');
		if($selectedOption.attr('data-show-href')){ strapOn.show($selectedOption, 'show'); }
		if($selectedOption.attr('data-hide-href')){ strapOn.hide($selectedOption, 'hide'); }
		if($selectedOption.attr('data-toggle-href')){ strapOn.toggle($selectedOption); }
	});

	//scroll
	$('body').on('click', '[data-scroll-href]', function(){
		var $this= $(this);
		var href = $this.data('scroll-href');
		var scrollable = $this.data('scrollable');
		var $scrollTo = $(href);
		var $scrollable = $(scrollable);
		$scrollable.stop().animate({ scrollTop: $scrollTo.offset().top - $scrollable.offset().top + $scrollable.scrollTop() }, 200);
		$('[data-scrollable="'+scrollable+'"]').removeClass('active').trigger('hide');
		$('[data-scroll-href="'+href+'"]').addClass('active').trigger('show');
	});

	$('.scrollspy').on('scroll', function(){
		var $scrollable = $(this);
		var closestNum = 100000000000000000000;
		var $closest = null;

		$('[data-scrollable="#'+$scrollable.attr('id')+'"]').each(function(){
			var $button = $(this);
			$button.removeClass('active');
			var $spyable = $($button.data('scroll-href'));
			var spyabletop = $spyable.offset().top - $scrollable.offset().top + $scrollable.scrollTop();
			var difference = Math.abs($scrollable.scrollTop() - spyabletop);
			if(difference < closestNum){
				closestNum = difference;
				$closest = $button;
			}
		});

		$closest.addClass('active');
	});

	//breakpoints
	$(window).on('load resize', function(){
		var checkBreakpoint = getCurrentBreakpoint();
		if(strapOn.breakpoint.name != checkBreakpoint.name){
			strapOn.breakpoint = checkBreakpoint;
			$(strapOn).trigger('breakpoint');
			console.log('breakpoint', strapOn.breakpoint);
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

	//--------------------ADD TO CUSTOM JS FILE----------------

	$('.dropdown').on('show', function(){
		var $this = $(this);
		var curHeight = $this.height();
		$this.css('height', 'auto');
		var autoHeight = $this.height();
		$this.height(curHeight).stop().animate({ height: autoHeight }, 150);
	}).on('hide', function(){
		$(this).stop().animate({ height: 0 }, 150);
	});
});
