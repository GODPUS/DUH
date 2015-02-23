$(function(){

	//use custom jquery onlyOn method to prevent parent elements with same selector from running callback function while still maintaining 'live' functionality.
	$('body').onlyOn(DUH.events.activate, '.demo-tab-pane', function(event){
		var $this = $(this);
		var curHeight = $this.height();
		$this.css('height', 'auto');
		var autoHeight = $this.height();
		$this.height(curHeight).stop().animate({ height: autoHeight }, 150, function(){ $this.css('height', 'auto'); });
	}).onlyOn(DUH.events.deactivate, '.demo-tab-pane', function(event){
		$(this).stop().animate({ height: 0 }, 150);
	});

	$('<div id="tab-pane-4" data-group="tab-panes-group-1" class="demo-tab-pane">TAB PANE 4 !</div>').insertAfter('[data-toggle="#tab-pane-4"]');

	DUH.activate($('#tab-pane-2'));
	DUH.deactivate($('#tab-pane-2'));
	DUH.toggle($('#tab-pane-2'));
	DUH.scroll($('#tab-pane-2'), {
		offsetY: 300,
		speed: 200
	});

	DUH.onBreakpoint(function(){
		console.log('ALL!');
	});

	DUH.onBreakpoint(['sm'], function(){
		console.log('SM ONLY!');
	});

	DUH.onBreakpoint(['lg', 'md'], function(){
		console.log('LG OR MD!');
	});
});