import 'jquery-typeahead';
import 'jquery-typeahead/src/jquery.typeahead.scss';

(function( $ ) {

	$.fn.netlivaAutocomplete = function(settings)
	{
		let $input = this;

		var source = {};
		let conf = typeof $input.data("config") === "object" ? $input.data("config") : JSON.parse($input.data("config"));
		let activeFilter = typeof $input.data("activeFilter") === "object" ? $input.data("activeFilter") : JSON.parse($input.data("activeFilter"));
		$.each(conf, function (key, value) {
			let display = ["value"];
			$.each(value.other_values, function (k, val) {
				display.push(val);
			});
			if (value.data)
			{
				source[value.conf_key] = {
					display: display,
					template: typeof value.template != "undefined" ? value.template : null,
					data: value.data
				}
			}
			else
			{
				source[value.conf_key] = {
					display: display,
					template: typeof value.template != "undefined" ? value.template : null,
					ajax: {
						type: "POST",
						url: $input.data("autocomplateUrl"),
						path: "data",
						data: {
							letters: "{{query}}",
							key: value.conf_key,
							extras: { activeFilter : activeFilter },
						}
					}
				};
			}
		});

		var multiselect = null;
		if ($input.data("multiselect"))
		{
			multiselect = {
				matchOn: ["key"],
				cancelOnBackspace: true,
			};
			if ($input.data("multiselectLimit"))
			{
				multiselect.limit = $input.data("multiselectLimit");
				multiselect.limitTemplate = $input.data("multiselectLimit") + ' adetten fazla ekleyemezsiniz.';
			}

			if ($($input.data("element")).val())
			{
				multiselect.data = JSON.parse($($input.data("element")).val());
			}

		}

		let th = $input.typeahead({
			input: '#'+$input.attr('id'),
			hint: true,
			highlight: true,
			minLength: 1,
			order: null,
			dynamic: true,
			delay: 500,
			backdrop: {"background-color": "#fff"},
			template: '{{value}}',
			emptyTemplate: "{{query}} ile ilgili sonuç bulunamadı!",
			source: source,
			multiselect: multiselect,
			callback: {
				onClickAfter: function (node, a, item, event) {
					if ($input.data("multiselect"))
					{
						$($input.data("element")).val(JSON.stringify(th.items));
						$($input.data("element")).data("datas",th.items);
					}
					else
					{
						$($input.data("element")).val(item.key);
						$($input.data("element")).data("datas",item);
					}
					$($input.data("element")).change();
				},
				onCancel: function () {
					if ($input.data("multiselect"))
					{
						$($input.data("element")).val(JSON.stringify(th.items));
						$($input.data("element")).data("datas",th.items);
					}
					else
					{
						$($input.data("element")).val("");
						$($input.data("element")).data("datas",null);
					}
					$($input.data("element")).change();
				}
			}
		});

		if (!$input.data("multiselect") && $($input.data("element")).val() && $input.data("autocomplateBackUrl"))
		{
			$input.attr("netliva_autocomplete_callback", "loading");
			$.ajax({
				url: $input.data("autocomplateBackUrl"),
				method: "POST",
				dataType:'json',
				success:function(response){
					$input.val(response.value);
					$($input.data("element")).data("datas",response);
					$($input.data("element")).trigger("netliva:autocomplate:flashback", [$input, response]);
					$input.attr("netliva_autocomplete_callback", "loaded");
				}
			});
		}


	};

	function init()
	{

		$("[netliva_autocomplete_widget]").each(function () {
			if ($(this).attr("netliva_autocomplete_widget") !== "OK")
			{
				$(this).attr("netliva_autocomplete_widget", "OK");
				$(this).netlivaAutocomplete();
			}
		});
	}

	$(document).ajaxComplete(init);
	$(document).on("netliva:collectionNewItem",init);
	init();

})( jQuery );

