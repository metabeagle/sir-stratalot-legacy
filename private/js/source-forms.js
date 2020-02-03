$(document).ready(function(){

// AJAX query for makers select2 field

	$('#makerSelect').select2({
		ajax: {
			delay: 200,
			url: '../../api/makers',
			dataType: 'json',
			processResults: function(data){
				return {
					results: data
				}
			}
		},
		theme: 'bootstrap4',
		// tags: true,
		placeholder: 'Maker(s)',
		language: {
			inputTooShort: function(params){
				return "Type to search..."
			}
		},
		minimumInputLength: 1
	});

});