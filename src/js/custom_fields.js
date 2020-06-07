
import Sortable from 'sortablejs';
import NetlivaSimpleModal from './modal';
import Inputmask from "inputmask";

(function( $, modal, Inputmask ) {

	function init()
	{
		$("[netliva_custom_fields]").each(function () {
			if ($(this).attr("netliva_custom_fields") !== "OK")
			{
				$(this).attr("netliva_custom_fields", "OK");

				var ncf = {
					data: {
						vals: $(this).data('vals'),
						id: $(this).data('id'),
						show_keys: !!$(this).data('showFieldKeys'),
						types: {text:"Kısa Metin", textarea:"Metin Alanı", choice:"Seçim", date:"Tarih", datetime:"Tarih Saat"},
						editKey: null,
					},
					el: {
						area: $(this),
						new_btn: $(this).find('.ncf-add-new'),
						type_btns: $(this).find('.ncf-types-btns'),
						field_options: $(this).find('.ncf-field-options'),
						list_area: $(this).find('.ncf-field-list'),
					},
					init: () => {
						if (typeof ncf.data.vals.fields !== "object") ncf.data.vals = {count:0, fields:{}};
						ncf.el.new_btn.click(ncf.actions.add_new);
						ncf.el.type_btns.hide().find("button").click(ncf.actions.field_btn_click);
						ncf.el.area.find(".ncf-field-options-choice textarea").keyup(ncf.actions.choice_text_counter);
						ncf.el.area.find(".ncf-field-options button.btn-primary").click(ncf.actions.field_add);
						ncf.refresh_list();
					},
					reset_fields: () => {
						ncf.el.field_options.find("button.btn-primary").html("EKLE");
						ncf.el.field_options.find("h3 span").html("Ekle");
						ncf.el.field_options.find("input[type=text]").val("");
						ncf.el.field_options.find("textarea").val("");
						ncf.el.field_options.find("input[type=radio]:checked").prop("checked",false);
						ncf.el.field_options.hide();

						ncf.refresh_list();
					},
					sort: (element, settings) => {
						settings = $.extend({ dataName:'sort'}, settings);

						var kids = element.children();
						kids.sort(function (a, b)
						{
							var an = settings.dataName === 'intext' ? $(a).text() : $(a).data(settings.dataName),
								bn = settings.dataName === 'intext' ? $(b).text() : $(b).data(settings.dataName);

							if (an > bn) { return 1; }
							if (an < bn) { return -1; }
							return 0;
						});
						kids.detach().appendTo(element);
					},
					refresh_list: () => {
						ncf.el.list_area.html("");
						$.each(ncf.data.vals["fields"], function(key, value){
							ncf.el.list_area.append(`
							<li data-key="${key}" data-order="${(typeof value.order !== "undefined" ? value.order : 0)}">
								<span class="sortableHandle"></span>
								<button class="btn btn-xs btn-danger"><i class="fa fa-trash-alt"></i></button>
								<button class="btn btn-xs btn-success"><i class="fa fa-pencil-alt"></i></button>
								${value.label}
								<em><small>(${ncf.data.types[value.type]}${value.required?' - Zorunlu':''})</small></em>
								${ncf.data.show_keys?'<code>'+key+'</code>':''}
							</li>`);
						});
						$("#"+ncf.data.id).val(JSON.stringify(ncf.data.vals));
						ncf.sort(ncf.el.list_area, {dataName:"order"});

						ncf.el.list_area.find("li .btn-danger").click(ncf.actions.field_remove);
						ncf.el.list_area.find("li .btn-success").click(ncf.actions.field_edit);

						let srt = new Sortable.create(ncf.el.list_area[0], {
							handle: ".sortableHandle",
							animation: 200,
							onUpdate: () => {
								ncf.el.list_area.find('li').each(function(index) {
									ncf.data.vals["fields"][$(this).data("key")]["order"] = index;
								});
								$("#"+ncf.data.id).val(JSON.stringify(ncf.data.vals));
							}
						});

					},
					actions: {
						add_new: (e) => {
							e.preventDefault();
							ncf.el.type_btns.show();
							ncf.el.field_options.hide();
							ncf.el.new_btn.hide();
							return false;
						},
						field_btn_click: (e) => {
							e.preventDefault();
							ncf.el.field_options.hide();
							ncf.el.type_btns.hide();
							ncf.el.new_btn.show();
							ncf.el.area.find(".ncf-field-options-"+$(e.target).data("type")).show();
							return false;
						},
						choice_text_counter: (e) => {
							let optTemp = $(e.target).val().split("\n");
							let say = 0;
							$.each(optTemp, function (keyy, valuee) { if (valuee) say++; });
							$(e.target).parent().find(".ncf-choice-field-counter").html(say);
						},
						field_add: (e) => {
							e.preventDefault();
							let type = $(e.target).data("type");
							var key;
							if (ncf.data.editKey) key = ncf.data.editKey;
							else {
								ncf.data.vals["count"]++;
								key = "field"+ncf.data.vals["count"];
							}

							ncf.add_field[type](key, ncf.el.area.find('.ncf-field-options-'+type));

							if (!ncf.data.editKey) ncf.data.vals["fields"][key]["order"] = key;
							ncf.data.editKey = null;

							ncf.reset_fields();
							return false;
						},
						field_remove: (e) => {
							e.preventDefault();
							let key = $(e.target).parents("li").data("key");
							modal.open({
								title:"ONAY", content:"`"+ncf.data.vals["fields"][key]["label"]+"` adlı kaydı silmek istediğinizden emin misiniz?",
								buttons:[
									{label: 'SİL', class:'danger', action:function(e) { delete(ncf.data.vals["fields"][key]); ncf.refresh_list(); modal.close(); }},
									{label: 'Vazgeç', action:'close', class:'warning'}
								]
							});
							return false;
						},
						field_edit: (e) => {
							e.preventDefault();
							ncf.data.editKey = $(e.target).parents("li").data("key");

							ncf.edit_field[ncf.data.vals["fields"][ncf.data.editKey]["type"]](ncf.data.editKey);

							ncf.el.field_options.find("button.btn-primary").html("GÜNCELLE");
							ncf.el.field_options.find("h3 span").html("Güncelle");
							ncf.el.field_options.hide();
							ncf.el.area.find(".ncf-field-options-"+ncf.data.vals["fields"][ncf.data.editKey]["type"]).show();
							return false;
						},
					},
					add_field: {
						text: (key, field_area) => {
							ncf.data.vals["fields"][key] = {
								type      : "text",
								label     : field_area.find(".ncf-field-label").val(),
								required  : field_area.find(".ncf-required:checked").val() == "1",
								inputType : field_area.find(".ncf-field-text-type").val(),
								suffix    : field_area.find(".ncf-field-text-suffix").val()
							};
						},
						textarea: (key, field_area) => {
							ncf.data.vals["fields"][key] = {
								type      : "textarea",
								label     : field_area.find(".ncf-field-label").val(),
								required  : field_area.find(".ncf-required:checked").val() == "1",
							};
						},
						date: (key, field_area) => {
							ncf.data.vals["fields"][key] = {
								type      : "date",
								label     : field_area.find(".ncf-field-label").val(),
								required  : field_area.find(".ncf-required:checked").val() == "1",
							};
						},
						datetime: (key, field_area) => {
							ncf.data.vals["fields"][key] = {
								type      : "datetime",
								label     : field_area.find(".ncf-field-label").val(),
								required  : field_area.find(".ncf-required:checked").val() == "1",
							};
						},
						choice: (key, field_area) => {
							let optTemp = field_area.find("textarea").val().split("\n");
							var opts = [];
							$.each(optTemp, function (keyy, valuee) { if (valuee) opts.push(valuee); });

							ncf.data.vals["fields"][key] = {
								type      : "choice",
								label     : field_area.find(".ncf-field-label").val(),
								required  : field_area.find(".ncf-required:checked").val() == "1",
								multiple  : field_area.find(".ncf-multiple:checked").val() == "1",
								expanded  : field_area.find(".ncf-expanded:checked").val() == "1",
								options   : opts
							};
						},
					},
					edit_field: {
						text: (key) => {
							let field_area = ncf.el.area.find('.ncf-field-options-'+ncf.data.vals["fields"][ncf.data.editKey]["type"]);
							let data = ncf.data.vals["fields"][key];
							field_area.find(".ncf-required[value="+(data.required?1:0)+"]").prop("checked",true);
							field_area.find(".ncf-field-label").val(data.label);
							field_area.find(".ncf-field-text-type").val(data.inputType);
							field_area.find(".ncf-field-text-suffix").val(data.suffix);
						},
						textarea: (key) => {
							let field_area = ncf.el.area.find('.ncf-field-options-'+ncf.data.vals["fields"][ncf.data.editKey]["type"]);
							let data = ncf.data.vals["fields"][key];
							field_area.find(".ncf-required[value="+(data.required?1:0)+"]").prop("checked",true);
							field_area.find(".ncf-field-label").val(data.label);
						},
						date: (key) => {
							let field_area = ncf.el.area.find('.ncf-field-options-'+ncf.data.vals["fields"][ncf.data.editKey]["type"]);
							let data = ncf.data.vals["fields"][key];
							field_area.find(".ncf-required[value="+(data.required?1:0)+"]").prop("checked",true);
							field_area.find(".ncf-field-label").val(data.label);
						},
						datetime: (key) => {
							let field_area = ncf.el.area.find('.ncf-field-options-'+ncf.data.vals["fields"][ncf.data.editKey]["type"]);
							let data = ncf.data.vals["fields"][key];
							field_area.find(".ncf-required[value="+(data.required?1:0)+"]").prop("checked",true);
							field_area.find(".ncf-field-label").val(data.label);
						},
						choice: (key) => {
							let field_area = ncf.el.area.find('.ncf-field-options-'+ncf.data.vals["fields"][ncf.data.editKey]["type"]);
							let data = ncf.data.vals["fields"][key];
							field_area.find(".ncf-field-label").val(data.label);
							field_area.find(".ncf-required[value="+(data.required?1:0)+"]").prop("checked",true);
							field_area.find(".ncf-multiple[value="+(data.multiple?1:0)+"]").prop("checked",true);
							field_area.find(".ncf-expanded[value="+(data.expanded?1:0)+"]").prop("checked",true);
							field_area.find("textarea").val(data.options.join("\n"));
						},

					}

				}

				ncf.init();

			}
		});


		$("[ncf-touch-spin]").each(function () {
			if ($(this).attr("ncf-touch-spin") !== "OK")
			{
				$(this).attr("ncf-touch-spin", "OK");
				$(this).TouchSpin({ min: 0, max: 9999999999999, step: 1, decimals: 0, boostat: 5, maxboostedstep: 10, initval: 0, postfix:$(this).attr("ncf-suffix")});
			}
		});
		$("[ncf-mask-email]").each(function () {
			if ($(this).attr("ncf-mask-email") !== "OK")
			{
				$(this).attr("ncf-mask-email", "OK");
				Inputmask({ alias: "email"}).mask(this);
			}
		});
		$("[ncf-mask-alpha]").each(function () {
			if ($(this).attr("ncf-mask-alpha") !== "OK")
			{
				$(this).attr("ncf-mask-alpha", "OK");
				Inputmask({regex: "[a-zA-Z]*"}).mask(this);
			}
		});
		$("[ncf-mask-alphanumeric]").each(function () {
			if ($(this).attr("ncf-mask-alphanumeric") !== "OK")
			{
				$(this).attr("ncf-mask-alphanumeric", "OK");
				Inputmask({regex: "[a-zA-Z0-9]*"}).mask(this);
			}
		});
		$("[ncf-mask-aphaplus]").each(function () {
			if ($(this).attr("ncf-mask-aphaplus") !== "OK")
			{
				$(this).attr("ncf-mask-aphaplus", "OK");
				Inputmask({regex: "[a-zA-Z0-9_-\.,]*"}).mask(this);
			}
		});
		$("[ncf-mask-numeric]").each(function () {
			if ($(this).attr("ncf-mask-numeric") !== "OK")
			{
				$(this).attr("ncf-mask-numeric", "OK");
				Inputmask("numeric").mask(this);
			}
		});
		$("[ncf-mask-url]").each(function () {
			if ($(this).attr("ncf-mask-url") !== "OK")
			{
				$(this).attr("ncf-mask-url", "OK");
				Inputmask({ alias: "url"}).mask(this);
			}
		});
		$("[ncf-mask-phone]").each(function () {
			if ($(this).attr("ncf-mask-phone") !== "OK")
			{
				$(this).attr("ncf-mask-phone", "OK");
				Inputmask({ mask: "0 (999) 999 99 99"}).mask(this);
			}
		});
		$("[ncf-mask-iban]").each(function () {
			if ($(this).attr("ncf-mask-iban") !== "OK")
			{
				$(this).attr("ncf-mask-iban", "OK");
				Inputmask({ mask: "TR99 9999 9999 9999 9999 9999 99"}).mask(this);
			}
		});
		$("[ncf-suffix]").each(function () {
			if ($(this).attr("ncf-suffix") !== "OK")
			{
				let suffix = $(this).attr("ncf-suffix");
				$(this).attr("ncf-suffix", "OK");
				if ($(this).attr('ncf-touch-spin') !== "OK")
					$(this).addClass('ncf-suffixed').after(`<span class="p-2 ncf-suffix-container">${suffix}</span>`).parent().css('display', 'flex');
			}
		});
	}

	$(document).ajaxComplete(init);
	$(document).on("netliva:collectionNewItem",init);
	init();

})( jQuery, NetlivaSimpleModal, Inputmask);

