import 'jquery-form';

(function ($, window) {

	window.ajaxFormCreate = function()
	{
		$(".be_ajax_form").each(function() {
			$(this).ajaxForm({
				dataType: 'json',
				beforeSubmit: () => { $(this).find('button').prop("disabled", 1); },
				success:function (response, statusText, xhr, $form) {
					$(".form-control").removeClass("is-invalid is-valid");
					$form.find(".invalid-feedback").remove();
					$form.find('button').prop("disabled", 0);
					$form.trigger("netliva:ajaxSubmit:success", [response, statusText, xhr, $form]);

					if (response.situ === 'success')
					{

						$form.before(
							'<div class="alert alert-success" role="alert">'+
							'<h4 class="alert-heading">'+(response.message !== undefined && response.message.title !== undefined?response.message.title:'İşlem Tamam')+'</h4>'+
							'<p>'+(response.message !== undefined && response.message.content !== undefined ? response.message.content:'İşleminiz başarıyla gerçekleştirildi')+'</p>'+
							'</div>'
						);
						if(response.removeForm === false)
						{
							$(".alert").slideUp(1000);
						}
						else
						{
							$form.remove();
						}

						if(response.hideModal)
						{
							if (typeof response.hideModal === 'boolean')
								$(".modal").modal("hide");
							else if (typeof response.hideModal === 'string')
								$(response.hideModal).modal("hide");
						}

						if (response.alert !== undefined && typeof window.success == "function" )
						{
							window.success(response.alert);
						}
					}
					else
					{
						if (response.alert !== undefined && typeof window.error == "function" )
						{
							window.error(response.alert);
						}

						$form.find(".form-control").each(function () {
							$(this).addClass("is-valid");
						});
						$.each(response.errors, function(name, err) {
							let errorsText = '<ul class="invalid-feedback list-unstyled">';
							$.each(err, function(n, errorText) {
								errorsText += "<li>"+errorText+"</li>";
							});
							errorsText += "</ul>";
							$("#"+name)
								.removeClass("is-valid")
								.addClass("is-invalid")
								.after(errorsText);
						});

					}
					if (response.refresh) window.location.reload();
					else if (response.url) { window.location.href = response.url; }
					else if (response.script) { eval(response.script); }


				},
				error: function (xhr, status, statusText, $form) {
					$form.find('button').prop("disabled", 0);
					$form.trigger("netliva:ajaxSubmit:error", [status, xhr.status, statusText, xhr.responseText, $form, xhr]); // event, statusType, statusCode,  statusText, response, $formElement, xhr

				},
				type: $(this).attr("method")
			}).removeClass("be_ajax_form").addClass("ajax_form");
		});
	};


})(jQuery, window);


$(document).ajaxComplete(ajaxFormCreate);
jQuery(ajaxFormCreate);
