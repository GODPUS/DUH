$(function(){
	$('.demo-tab-pane').on('DUH:show', function(){
		var $this = $(this);
		var curHeight = $this.height();
		$this.css('height', 'auto');
		var autoHeight = $this.height();
		$this.height(curHeight).stop().animate({ height: autoHeight }, 150);
	}).on('DUH:hide', function(){
		$(this).stop().animate({ height: 0 }, 150);
	});

	$(DUH).on('DUH:breakpoint', function(){
		console.log(DUH.breakpoint);
	});
});