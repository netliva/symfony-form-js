
import Sortable from 'sortablejs';
import 'bootstrap-switch';
import "bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css";


(function( $, Sortable) {

	function init()
	{
		$("[netliva-true-false]").each(function () {
			if ($(this).attr("netliva-true-false") !== "OK")
			{
				$(this).attr("netliva-true-false", "OK");

				var tf = {
					vals: JSON.parse($(this).val()),
					switchOptions: $(this).data("switchOptions"),
					list_options: $(this).data("list"),
					is_sortable: $(this).data("sortable"),
					e: {
						input: $(this),
						list: $('<ol class="list-unstyled"></ol>'),
					},
					init: () => {
						var say = 0;
						$.each(tf.vals, function(key, value){
						if (typeof value == "number"){
								value = {is_active: value, order:say};
							tf.vals[key]= value;
								say++;
							}
							if (tf.list_options[key] !== undefined)
							{
								tf.e.list.append('<li data-key="'+key+'" data-order="'+value.order+'" ><span class="sortableHandle"></span><label>'+tf.list_options[key]+'</label> <input type="checkbox" class="tfListInputSwitch" '+(value.is_active?"checked='1'":"")+'></li>');
								delete(tf.list_options[key]);
							}
						});
						$.each(tf.list_options, function(key, value){
							tf.e.list.append('<li data-key="'+key+'" data-order="'+say+'"><span class="sortableHandle"></span><label>'+value+'</label> <input type="checkbox" class="tfListInputSwitch"></li>');
							tf.vals[key] = {is_active: 0, order:say};
							say++;
						});

						tf.sort(tf.e.list, {dataName:"order"});
						tf.e.input.val(JSON.stringify(tf.vals));

						tf.e.input.after(tf.e.list);

						tf.switchOptions.onSwitchChange = function(event, state) {
							tf.vals[$(this).parents("li").data("key")].is_active=state?1:0;
							tf.e.input.val(JSON.stringify(tf.vals));
						}
						console.log(tf.switchOptions);
						tf.e.list.find('.tfListInputSwitch').each(function () {
							$(this).bootstrapSwitch(tf.switchOptions).bootstrapSwitch("size", tf.switchOptions.size);
							if ($(this).prop("checked"))
								$(this).bootstrapSwitch("state", 1);
						});

						if (tf.is_sortable)
						{
							let srt = new Sortable.create(tf.e.list[0], {
								handle: ".sortableHandle",
								animation: 200,
								onUpdate: () => {
									tf.e.list.find('li').each(function(index) {
										tf.vals[$(this).data("key")]["order"] = index;
									});
									tf.e.input.val(JSON.stringify(tf.vals));
								}
							});
						}

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
					}
				}
				tf.init();



			}
		});
	}

	$(document).ajaxComplete(init);
	init();

})( jQuery, Sortable);
