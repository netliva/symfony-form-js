import 'bootstrap-tagsinput'
import 'bootstrap-tagsinput/src/bootstrap-tagsinput.css'

(function( $ ) {

	$.fn.netlivaTreeSelect = function(settings)
	{
		settings = $.extend({}, settings);


		let $form_row = this;

		var ms = {
			data: {
				first_deep  : $form_row.data("firstDeep"),
				multiselect : $form_row.data("multiselect"),
				breakable   : $form_row.data("breakable"),
				where       : $form_row.data("where"),
				value       : $form_row.data("value"),
				url         : $form_row.data("url"),
				deep        : 0,
				collected   : [],
			},
			e: {
				back_btn: $form_row.find(".netliva_treeselect_back_btn"),
				helper : $form_row.find(".netliva_treeselect_helper"),
				select: $form_row.find("select"),
				input: $form_row.find(".netliva_treeselect_input"),
				selected_text: $form_row.find(".netliva_treeselect_selected_text"),
			},
			init: function (){
				ms.get_options();
				ms.e.back_btn.click(ms.action.back);
				ms.e.select.change(ms.action.select_change);
				if (ms.data.multiselect)
				{
					ms.e.helper.tagsinput({ itemValue: 'key', itemText: 'value', tagClass: 'badge badge-info p-1' });
					ms.e.helper.change(function () {
						ms.e.input.val(JSON.stringify($(this).tagsinput('items')));
					});
				}

				var value;
				try { value  = JSON.parse(ms.data.value); }
				catch(err){ value = []; }
				$.each(value, function (val, data) {
					data.key = data.key+"";
					data.value = data.value+"";
					if (ms.data.multiselect)
					{
						ms.e.helper.tagsinput('add', data);
					}
				});
			},
			get_options: function (id) {
				if (typeof id == 'undefined')
				{
					id = ms.data.first_deep;
					ms.data.collected = [];
					ms.data.deep = 0;
					ms.e.back_btn.hide();
					ms.e.select.removeClass("with_backbtn");
				}
				else
				{
					ms.e.back_btn.show();
					ms.e.select.addClass("with_backbtn");
					ms.data.collected[ms.data.deep-1] = ms.e.select.find("option[value="+id+"]").text();
				}

				ms.e.selected_text.text(ms.data.collected.length ?"SEÇİLEN: "+(ms.data.collected.join(" » ")):"");

				if (ms.data.breakable && ms.data.collected.length)
				{
					ms.e.selected_text.append(' <button class="btn btn-xs btn-success"><i class="fa fa-plus"></i></button>');
					ms.e.selected_text.find("button").click(function () {
						ms.e.helper.tagsinput('add', {"key":id, "value":ms.data.collected.join(" » ")});
						ms.get_options();
					});

				}
				ms.get_options_ajax(id);
			},
			get_options_ajax: function (id)
			{
				$.ajax({
					url  : ms.data.url.replace("__ID__",id),
					data : { where: ms.data.where },
					dataType:"json", type:"post",
					success:function(response)
					{
						if (response.options && (!response.selectedId || response.selectedId == "null"))
						{
							response.options = '<option value="0" selected="selected">--- '+(id?"ALT KADEME SEÇİN":"YENİ SEÇİM YAPINIZ")+' ---</option>' + response.options;
							ms.e.select.prop("disabled",false).html(response.options);
							ms.data.deep++;
						}
						else if (response.selectedId && response.selectedId != "null")
						{
							if (ms.data.multiselect)
							{
								ms.e.helper.tagsinput('add', {"key":response.selectedId, "value":ms.data.collected.join(" » ")});
								ms.get_options();
							}
							else
							{
								ms.e.input.val(response.selectedId);
							}
						}
						else if (!response.options)
						{
							response.options = '<option value="0" selected="selected">--- VERİ BULUNAMADI ---</option>';
							ms.e.select.prop("disabled",true).html(response.options);
						}
					}
				});
			},
			action:{
				back: function () {
					ms.get_options();
					return false;
				},
				select_change: function () {
					ms.get_options($(this).val());
				}
			}
		}

		ms.init();
	};

	function init()
	{
		$("[netliva_treeselect]").each(function () {
			if ($(this).attr("netliva_treeselect") !== "OK")
			{
				$(this).attr("netliva_treeselect", "OK");
				$(this).netlivaTreeSelect();
			}
		});
	}

	$(document).ajaxComplete(init);
	$(document).on("netliva:collectionNewItem",init);
	init();

})( jQuery );

