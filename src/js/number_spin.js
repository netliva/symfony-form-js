import 'bootstrap-touchspin'

(function( $ ) {

	function init()
	{
		$("[netliva_spin]").each(function () {
			if ($(this).attr("netliva_spin") !== "OK")
			{
				$(this).attr("netliva_spin", "OK");
				$(this).find("input").TouchSpin($(this).data("spinOptions"));
			}
		});
	}

	$(document).ajaxComplete(init);
	init();

})( jQuery );
