import 'bootstrap-tagsinput'
import 'bootstrap-tagsinput/src/bootstrap-tagsinput.css'

(function( $ ) {

	$.fn.netlivaTagsInput = function(settings)
	{
		settings = $.extend({}, settings);

		let $form_row = this;
		$form_row.tagsinput({
								trimValue: true,
								tagClass: 'badge badge-info',
							});
		$form_row.prev().addClass('form-control');
	};

	function init()
	{
		$("[netliva_tagsinput_widget]").each(function () {
			if ($(this).attr("netliva_tagsinput_widget") !== "OK")
			{
				$(this).attr("netliva_tagsinput_widget", "OK");
				$(this).netlivaTagsInput();
			}
		});
	}

	$(document).ajaxComplete(init);
	$(document).on("netliva:collectionNewItem",init);
	init();

})( jQuery );

