var NetlivaSimpleModal = {
	open: function (options){
		options = $.extend({content: '', title: '', class: 'info', buttons: null, width: 500, ajax:null, init:()=>{}}, options);

		if (!$("#netliva_icon_modal").length) NetlivaSimpleModal.create();

		if (options.width)
			$("#netliva_icon_modal").find('.modal-dialog').css({width: options.width, maxWidth: options.width});

		$("#netliva_icon_modal .modal-title").text(options.title);
		if (options.ajax)
		{
			$("#netliva_icon_modal .modal-body").html('<div class="text-center">'+commenter.loaders.blocks+'<div><strong>Yükleniyor...</strong></div></div>');
			$.ajax({
			   url:options.ajax.url,
			   data: typeof options.ajax.data !== 'undefined' ? options.ajax.data : {},
			   dataType: "html", type: "post",
			   success: function (response) {
				   $("#netliva_icon_modal .modal-body").html(response);
				   options.init();
			   }
		   });
		}
		else
		{
			$("#netliva_icon_modal .modal-body").html(options.content);
			options.init();
		}

		var zi = 0;
		$('.modal.fade').each(function() {
			if (zi < $(this).css('z-index'))
				zi = $(this).css('z-index');
		});
		$("#netliva_icon_modal").css('z-index', zi+10);

		$("#netliva_icon_modal .modal-header").removeClass().addClass("modal-header bg-"+options.class);
		$("#netliva_icon_modal").modal("show");
		if (options.buttons) NetlivaSimpleModal.create_buttons(options.buttons);

		$("#netliva_icon_modal").next().css('z-index', zi+9);
	},
	close: function () {
		$("#netliva_icon_modal").modal("hide");
	},
	create: function () {
		$("body").append(`
				<div class="modal fade" id="netliva_icon_modal" tabindex="-1" role="dialog" aria-labelledby="netliva_icon_modal" aria-hidden="true">
				  <div class="modal-dialog" role="document">
					<div class="modal-content">
					  <div class="modal-header">
						<h5 class="modal-title">Modal title</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						  <span aria-hidden="true">&times;</span>
						</button>
					  </div>
					  <div class="modal-body"> ... </div>
					  <div class="modal-footer bg-light" style="display: none;"></div>
					</div>
				  </div>
				</div>
			`);
	},
	create_buttons($btns)
	{
		if ($btns !== null)
		{
			$("#netliva_icon_modal").find('.modal-footer').show();
			$("#netliva_icon_modal").find('.modal-footer').html('');
			$.each($btns, function (index, button)
			{
				let btnClass = "success";
				if (typeof (button.class) !== "undefined")
					btnClass = button.class;
				else if (button.action === 'close')
					btnClass = "danger";

				let $btnTxt = '<button id="netliva_icon_modal_btn_' + index + '"';
				if (button.action === 'close')
					$btnTxt += 'data-dismiss="modal"';
				$btnTxt += 'class="btn btn-' + btnClass + '" type="button">' + button.label + '</button>';

				$("#netliva_icon_modal").find('.modal-footer').append($btnTxt);

				if (typeof (button.action) === "function")
				{
					$("#netliva_icon_modal_btn_" + index).click(button.action);
				}
			});
		}

	}
}

export default NetlivaSimpleModal;
