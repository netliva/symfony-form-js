import Inputmask from "inputmask";
import intlTelInput from 'intl-tel-input';

(function ($, window, Inputmask, intlTelInput) {

	function contactCollect ($addedElement)
	{
		$addedElement.find(".selectContactTypeBtn").click(function () {
			$addedElement.find(".netliva_contact_type_area").addClass("open");
			return false;
		});
		$addedElement.find(".closeContactTypeBtn").click(function () {
			$(this).parent().removeClass("open");
			return false;
		});
		$addedElement.find(".openContactExtraBtn").click(function () {
			$(this).closest('.netliva_contact_fields_row').addClass("open-extra-area");
			return false;
		});
		$addedElement.find(".netliva_contact_fields .notiLabel input").change(function () {
				$(this).next().html($(this).prop('checked')?"İletişim İzni Var":"İletişim İzni Yok");
		}).change();
		$addedElement.find(".closeContactExtraBtn").click(function () {
			$(this).closest('.netliva_contact_fields_row').removeClass("open-extra-area");
			return false;
		});
		$addedElement.find(".contactType").change(function () {
			$(this).parent().removeClass("open");
			var icon = '';
			$addedElement.find(".contactInternal").hide();
			$addedElement.find(".notiLabel").hide();

			if ($addedElement.data('iti'))
			{
				$addedElement.data('iti').destroy();
				$addedElement.data('iti', null);
			}

			Inputmask.remove($addedElement.find(".contactContent")[0]);

			if ($(this).val() === 'gsm') {
				icon = 'mobile-alt';
				$addedElement.find(".notiLabel").show();
				Inputmask({"mask": "+\\9\\0(599)999-9999"}).mask($addedElement.find(".contactContent")[0]);
			}
			else if ($(this).val() === 'phone') {
				icon = 'phone-alt';
				$addedElement.find(".contactInternal").show();
				Inputmask({"mask": "+\\9\\0(999)999-9999"}).mask($addedElement.find(".contactContent")[0]);
			}
			else if ($(this).val() === 'fax') {
				icon = 'fax';
				Inputmask({"mask": "+\\9\\0(999)999-9999"}).mask($addedElement.find(".contactContent")[0]);
			}
			else if ($(this).val() === 'email')
			{
				icon = 'envelope';
				$addedElement.find(".notiLabel").show();
				Inputmask({alias: "email"}).mask($addedElement.find(".contactContent")[0]);
			}
			else if ($(this).val() === 'glob_phone')
			{
				icon = 'phone-alt';
				$addedElement.find(".notiLabel").show();
				Inputmask({"regex": "\\+\\d*"}).mask($addedElement.find(".contactContent")[0]);
				$addedElement.data('iti', intlTelInput($addedElement.find(".contactContent")[0], {}))
			}
			else if ($(this).val() === 'glob_gsm')
			{
				icon = 'mobile-alt';
				$addedElement.find(".notiLabel").show();
				Inputmask({"regex": "\\+\\d*"}).mask($addedElement.find(".contactContent")[0]);
				$addedElement.data('iti', intlTelInput($addedElement.find(".contactContent")[0], {}));
			}
			$addedElement.find(".contactContent").attr('placeholder','');
			$addedElement.find(".selectContactTypeBtn").find("i").removeClass().addClass("fa fa-"+icon).end().show();
		}).change();

		$addedElement.find(".contactContent").keyup(function () {
			if($addedElement.find(".contactType").val() === "phone" || $addedElement.find(".contactType").val() === "fax")
			{
				if ($(this).val().substr(4,1) === "5")
				{
					alert("Bu Alana GSM Numarası Girmek Uygun Değildir!");
					$(this).val("");
				}
			}
		});

		// $addedElement.find('input[type="checkbox"]').uniform().after('<i class="fa fa-check"></i>');
	}


	window.netliva_collection_contact_init = () =>
	{
		$(".netliva_collection_contact_area > ul:not(.cc_binded)").each(function () {
			$(this).addClass("cc_binded");
			$(this).collection("add_function", contactCollect);
		});
	}


})(jQuery, window, Inputmask, intlTelInput);
