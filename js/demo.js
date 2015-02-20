$(function(){
	
	//use custom jquery onlyOn method to prevent elements with same selector from running callback function while still maintaining 'live' functionality.
	$('body').onlyOn('DUH:show', '.demo-tab-pane', function(event){
		var $this = $(this);
		var curHeight = $this.height();
		$this.css('height', 'auto');
		var autoHeight = $this.height();
		$this.height(curHeight).stop().animate({ height: autoHeight }, 150, function(){ $this.css('height', 'auto'); });
	}).onlyOn('DUH:hide', '.demo-tab-pane', function(event){
		$(this).stop().animate({ height: 0 }, 150);
	});

	$(DUH).on('DUH:breakpoint', function(){
		console.log(DUH.breakpoint);
	});

	$('<div id="tab-pane-4" data-group="tab-panes-group-1" class="demo-tab-pane">TAB PANE 4 !</div>').insertAfter('[data-toggle-target="#tab-pane-4"]');
});