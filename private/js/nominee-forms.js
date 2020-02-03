$(document).ready(function(){

// maker select2

	var $makerSelect = $('#makerSelect').select2({
		theme: 'bootstrap4',
		tags: true,
		placeholder: 'Who created it?',
		language: {
			inputTooShort: function(params){
				return "Type a name, hit return after each..."
			}
		},
		minimumInputLength: 1
	});

// validator

	jQuery.validator.setDefaults({
		ignore: 'input[type=hidden], .select2-input, .select2-focusser',
	    errorElement: 'div',
	    errorPlacement: function (error, element) {
	    	var $elem = $(element);
	        if ($elem.hasClass("select2-hidden-accessible")) {
				// element = $elem.next('span.select2');
				element = $elem.nextAll('.errorPlacement');
				error.insertAfter(element);
				error.addClass('invalid-feedback');
			} else {
			}
	    },
	    highlight: function (element, errorClass, validClass) {
	    	var $elem = $(element);
	    	if ($elem.hasClass("select2-hidden-accessible")) {
	    		// $elem.next('span.select2').addClass(errorClass);
	    		$elem.next().find('.select2-selection').addClass('is-invalid');
			} else {
			   	$elem.addClass('is-invalid');
			}
	    },
	    unhighlight: function (element, errorClass, validClass) {
	    	var $elem = $(element);
	        if ($elem.hasClass("select2-hidden-accessible")) {
	        	// $elem.next('span.select2').removeClass(errorClass);
	        	$elem.next().find('.select2-selection').removeClass('is-invalid');
			} else {
				$elem.removeClass('is-invalid');
			}
	    }
	});

	$('#newNominee').validate({
		rules: {
			"nominee[subkind]": "required",
			"nominee[title]": "required",
			"nominee[makers]": "required",
			"nominee[description]": "required",
			"nominee[url]": {
				required: true,
				url: true
			}
		},
		messages: {
			"nominee[makers]": "Add at least one maker.",
		},
		submitHandler: function(form) {
   			form.submit();
  		}
	});

// re-validate select2 on close

	$("select").on("select2:close", function (e) {  
        $(this).valid(); 
    });

});