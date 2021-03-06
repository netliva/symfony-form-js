(function ($, window) {

	window.addFormForCollection = function ($collectionHolder, $newBtn, settings) {
		let prototype = $collectionHolder.data('prototype');
		let index = $collectionHolder.data('index')+1;

		let rep = new RegExp(settings.prototypeName,"g");
		let newForm = prototype.replace(rep, index);

		$collectionHolder.data('index', index);
		let $newFormLi = $('<li></li>').append(newForm);
		$newFormLi.data('index',index);
		if ($collectionHolder.hasClass('list-group')) $newFormLi.addClass('list-group-item');
		addDeleteLinkCollection($newFormLi, settings);
		$newBtn.before($newFormLi);
		return $newFormLi;
	};

	window.addDeleteLinkCollection = function($tagFormLi, setting) {
		let $removeFormA = $('<a class="'+setting.delBtnClass+' ntlcol-delete-button" href="#">'+setting.delBtnText+'</a>');
		$tagFormLi.append($removeFormA);

		$removeFormA.on('click', function(e) {
			e.preventDefault();
			if (typeof myDialogBox !== 'undefined')
			{
				myDialogBox({
					id:'ForDelete',
					title: setting.deleteConfirmTitle,
					content: setting.deleteConfirmText,
					buttons : [
						{label: confirmButtonText, class:'danger', action:function(e) { $('#generalDialogBoxForDelete').modal('hide'); $tagFormLi.remove(); }},
						{label: cancelButtonText, action:'close', class:'info'}
					],
				});
			}
			else
			{
				if(confirm(setting.deleteConfirmText))
				{
					$tagFormLi.remove();
				}
			}
		});
	};


	var func_stack = {};

	$.fn.collection = function(settings, func)
	{
		if (typeof settings == 'string' && settings === "add_function")
		{
			func_stack[$(this).data("formId")] = func;
			return;
		}

		settings = $.extend({
			prototypeName:'__name__',
			addBtnText:'Ekle',
			addBtnClass:'btn btn-success',
			delBtnText:'Sil',
			delBtnClass:'btn btn-danger',
			deleteConfirmTitle:'Silme Onayı',
			deleteConfirmText:'İlgili kaydı silmek istediğinizden emin misiniz?',
			afterAction:function(){}
		}, settings);

		let $collectionHolder = this;
		let $addTagLink = $('<a class="'+settings.addBtnClass+' ntlcol-add-button" href="#" class="addCollectionLink">'+settings.addBtnText+'</a>');
		let $newBtn = $('<li class="addCollBtn text-center"></li>').append($addTagLink);

		$collectionHolder.find('>li').each(function() { addDeleteLinkCollection($(this), settings); });

		if ($collectionHolder.hasClass('list-group')) $newBtn.addClass('list-group-item');

		let maxIndex = 0;
		this.find('li').each(function () {
			if ($(this).data("index")>maxIndex) maxIndex = $(this).data("index");
		});
		$collectionHolder.data('index',maxIndex);

		$collectionHolder.append($newBtn);

		$addTagLink.on('click', function(e)
		{
			// prevent the link from creating a "#" on the URL
			e.preventDefault();

			// add a new tag form (see next code block)
			let $newForm = addFormForCollection($collectionHolder, $newBtn, settings);

			settings.afterAction($newForm);
		});
	};

	window.createNetlivaCollection = function()
	{
		window.netliva_collection_contact_init();

		$(".be_netliva_collection_type").each(function()
	    {
	    	let $e = $(this);
	    	let formId = $e.data("formId");
			function afterAddItem($addedElement, source)
			{
				if (typeof window[formId+'_collect_function'] === 'function')
					window[formId+'_collect_function']($addedElement, source);
				if (typeof func_stack[formId] === 'function')
					func_stack[formId]($addedElement, source);

				if (source !== "still")
				{
					createNetlivaCollection();
					$(document).trigger("netliva:collectionNewItem", [$e, $addedElement, source]);
					$e.trigger("netliva:collectionNewItem", [$addedElement, source]);
				}

				$(document).trigger("netliva:collectionAdded", [$e, $addedElement, source]);
				$e.trigger("netliva:collectionAdded", [$addedElement, source]);
			}

			settings = $.extend({
				addBtnText:'Ekle',
				prototypeName:$(this).data("prototypeName"),
				delBtnText:'<i class="fa fa-trash-alt"></i>',
				afterAction: afterAddItem
			}, $(this).data("jsSettings"));

			$(this).collection(settings);
			$(this).find("li:not(.addCollBtn)").each(function () { afterAddItem($(this),"still"); });
			$(this).removeClass("be_netliva_collection_type");
		});
	};

})(jQuery, window);

$(document).ajaxComplete(createNetlivaCollection);
jQuery(createNetlivaCollection);
