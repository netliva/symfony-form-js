
import '@claviska/jquery-minicolors'
import '@claviska/jquery-minicolors/jquery.minicolors.css'


(function( $ ) {

	function init()
	{
		$("[netliva_color_picker]").each(function () {
			if ($(this).attr("netliva_color_picker") !== "OK")
			{
				$(this).attr("netliva_color_picker", "OK");
				var $that = $(this);
				$(this).find("input").minicolors({
					control: 'wheel',
					show: function(){
						$that.closest('form').height($that.closest('form').height()+150)
					},
					hide: function(){
						$that.closest('form').height("auto");
					}
				});
			}
		});
	}

	$(document).ajaxComplete(init);
	init();

})( jQuery );
