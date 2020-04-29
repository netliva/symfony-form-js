(function ($, window) {

	window.netlivaDependentCreate = function()
	{
		$(".be_netliva_dependent").each(function() {
			$(this).removeClass("be_netliva_dependent").addClass("netliva_dependent");
			netlivaDependentPrepeare(
				$(this).attr("id"),
				$(this).data("dependTo"),
				{
					value: $(this).data("value"),
					default: $(this).data("default"),
					option_path: $(this).data("path"),
				}
			);
		});
	};

	var netlivaDependentPrepeare = function (formId, dependId, settings)
	{
		settings = $.extend({
			value: null,
			option_path: null,
		}, settings);

		var $element = $("#"+formId);
		var $dependent = $("#"+dependId);
		var ajx;
		$dependent.change(function(){
			var val = $(this).val();
			$element.prop("disabled",true).html("<option>Yükleniyor...</option>");
			if (ajx != undefined)
			{
				ajx.abort();
				setTimeout(function () { $("#loading").hide();},1000);
			}
			if (val)
			{
				ajx = $.ajax({
					url:settings.option_path,
					data : { val:val }, dataType:"json",
					type:"post",
					success:function(response){
						if (response.options)
						{
							$element.prop("disabled",false).html(response.options);
							setTimeout(function () {
								if($element.find("option[value='"+settings.value+"']").length)
									$element.val(settings.value);
								$element.change();
							},100);
						}
						else
						{
							$element.html("<option>"+ settings.default +"</option>");
							setTimeout(function () { $element.val(settings.default).change().prop("disabled",true);},100);
						}
					}
				});
			}
			else
			{
				$element.html("<option>"+ settings.default +"</option>");
				setTimeout(function () { $element.val(settings.default).change().prop("disabled",true);},100);
			}
		});
		if (settings.value || $dependent.val())
			$dependent.change();

	};

})(jQuery, window);

$(document).ajaxComplete(netlivaDependentCreate);
jQuery(netlivaDependentCreate);

