import 'moment'
import 'moment/locale/tr'
import 'tempusdominus-bootstrap-4';
import 'tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';


(function( $ ) {

	$.fn.netlivaDatetimePicker = function(settings)
	{
		let $input = this;

		var val = $($input.data("element")).val();

		if (val)
		{
			if($input.data('viewFormat') === "HH:mm") val = moment("2000-01-01 "+val);
			else val = moment(val);
		}
		else if ($input.prop("required"))
		{
			val = moment();
		}

		$input.datetimepicker({
			locale: 'tr',
			format: $input.data('viewFormat'),
			defaultDate : val,
			icons: {
				time: 'far fa-clock',
				date: 'far fa-calendar',
				up: 'fa fa-chevron-up',
				down: 'fa fa-chevron-down',
				previous: 'fa fa-chevron-left',
				next: 'fa fa-chevron-right',
				today: 'fa fa-screenshot',
				clear: 'fa fa-trash',
				close: 'fa fa-remove'
			}
		});
		$input.on("change.datetimepicker",function (e) {
			if (e.date) $($input.data("element")).val(moment(e.date).format($input.data('dbFormat')));
			else $($input.data("element")).val("");
		});
		$input.focus(function () {
			$input.datetimepicker("show");
			$(this).parents(".modal-body").height($(this).parents(".modal-body").height()+200);
		});
		$input.blur(function () {
			$input.datetimepicker("hide");
			$(this).parents(".modal-body").height("auto");
		});




	};

	function init()
	{

		$("[netliva_datetimepicker_widget]").each(function () {
			if ($(this).attr("netliva_datetimepicker_widget") !== "OK")
			{
				$(this).attr("netliva_datetimepicker_widget", "OK");
				$(this).netlivaDatetimePicker();
			}
		});
	}

	$(document).ajaxComplete(init);
	$(document).on("netliva:collectionNewItem",init);
	init();

})( jQuery );

