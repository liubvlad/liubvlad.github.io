(function($)
{
	var initLayout = function() 
	{
		$('#colorpickerHolder').ColorPicker(
		{
			flat: true, 
			onSubmit: function(hsb, hex, rgb) 
			{
				colorClicked(hex, rgb);
			}
		});
	};
	
	var showTab = function(e) 
	{
		var tabIndex = $('ul.navigationTabs a')
				.removeClass('active').index(this);
		$(this)
			.addClass('active').blur();
		$('div.tab')
			.hide().eq(tabIndex).show();
	};
	
	EYE.register(initLayout, 'init');
})(jQuery)