(function($){
	$(function(){

		//use custom jquery onlyOn method to prevent parent elements with same 
		//selector from running callback function while still maintaining 'live' functionality.
		$body.onlyOn(DUH.events.activate, '.dropdown', function(event){

			//use convienent animateAutoHeight method that takes the parameters (animationOptions, callback)
			$(this).animateAutoHeight({ speed: 150 }, function(){ console.log('auto height animation complete!') });

		}).onlyOn(DUH.events.deactivate, '.dropdown', function(event){

			//use convienent animateZeroHeight method that takes the parameters (animationOptions, callback)
			$(this).animateZeroHeight({ speed: 150 }, function(){ console.log('zero height animation complete!') });

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
}(jQuery));