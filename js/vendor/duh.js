
var DUH = {

	breakpoint: {},

	show: function($el, type) {
		var href = $el.data(type+'-href');
		var $sameHrefTabs = $('[data-'+type+'-href="'+href+'"]');

		$sameHrefTabs.each(function(){
			var $tab = $(this);
			var $tabGroup = $('[data-tab-group="'+$tab.data('tab-group')+'"]').not($tab);
			$tabGroup.removeClass('active').trigger('hide');
			$tab.addClass('active').trigger('show');
			if($tab.is('option')){ $tab.attr('selected', 'selected'); }
		});

		var $tabPane = $(href);
		var $tabPaneGroup = $('[data-tab-group="'+$tabPane.data('tab-group')+'"]').not($tabPane);
		$tabPaneGroup.removeClass('active').trigger('hide');
		$tabPane.addClass('active').trigger('show');
	},

	hide: function($el, type) {
		var href = $el.data(type+'-href');
		$el.removeClass('active').trigger('hide');
		$(href).removeClass('active').trigger('hide');
		if(type === 'hide'){ $('[data-show-href="'+href+'"]').removeClass('active').trigger('hide'); }
	},

	toggle: function($el, type){
		if($el.hasClass('active')){ this.hide($el, type); }else{ this.show($el, type); }
	},

	scrollTo: function($el){
		var $scrollTo = $($el.data('scroll-href'));
		var $scrollable = $($el.data('scrollable'));
		if($scrollable.data('scrollspy') === 'vertical'){
			$scrollable.stop().animate({ scrollTop: $scrollTo.offset().top - $scrollable.offset().top + $scrollable.scrollTop() }, 200);
		}
		if($scrollable.data('scrollspy') === 'horizontal'){
			$scrollable.stop().animate({ scrollLeft: $scrollTo.offset().left - $scrollable.offset().left + $scrollable.scrollLeft() }, 200);
		}
	}
}

//show, hide, toggle, scroll
$('body').on('click', '[data-show-href]', function(){ DUH.show($(this), 'show'); });
$('body').on('click', '[data-hide-href]', function(){ DUH.hide($(this), 'hide'); });
$('body').on('click', '[data-toggle-href]', function(){ DUH.toggle($(this), 'toggle'); });
$('body').on('change', 'select', function(){
	var $selectedOption = $(this).find('option:selected');
	if($selectedOption.attr('data-show-href')){ DUH.show($selectedOption, 'show'); }
	if($selectedOption.attr('data-hide-href')){ DUH.hide($selectedOption, 'hide'); }
	if($selectedOption.attr('data-toggle-href')){ DUH.toggle($selectedOption, 'toggle'); }
	if($selectedOption.attr('data-scroll-href')){
		DUH.show($selectedOption, 'scroll'); 
		DUH.scrollTo($selectedOption);
	}
});

$('body').on('click', '[data-scroll-href]', function(){ 
	var $this = $(this);
	DUH.show($this, 'scroll'); 
	DUH.scrollTo($this);
});

//scrollspy
$('[data-scrollspy]').on('mousewheel', function(){
	var $scrollable = $(this);
	var closestNum = null;
	var $closest = null;
	var direction = $scrollable.data('scrollspy');

	$('[data-scrollable="#'+$scrollable.attr('id')+'"]').each(function(){
		var $button = $(this);
		var $spyable = $($button.data('scroll-href'));
		var difference;

		if(direction === 'vertical'){
			var spyabletop = $spyable.offset().top - $scrollable.offset().top + $scrollable.scrollTop();
			difference = Math.abs($scrollable.scrollTop() - spyabletop);
		}
		if(direction === 'horizontal'){
			var spyableleft = $spyable.offset().left - $scrollable.offset().left + $scrollable.scrollLeft();
			difference = Math.abs($scrollable.scrollLeft() - spyableleft);
		}
		
		if(closestNum == null || difference < closestNum){
			closestNum = difference;
			$closest = $button;
		}
	});

	DUH.show($closest, 'scroll');
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
		breakpointObj.width = breakpoint.split(':')[1];
	};
	return breakpointObj;
}

