$(function(){
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