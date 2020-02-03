$(document).ready(function(){

	const perPage = 20;
	const options = {
		valueNames: [ 
			'makerKind',
			'makerName',
			'makerLinks'
		],
		listClass: 'listjs',
		sortClass: 'listjsSort',
		page: perPage,
		paginationClass: 'pagination',
		// https://github.com/javve/list.js/issues/567
		pagination: {
			innerWindow: 2,
			outerWindow: 1
		}
	};

	const listObj = new List('listjsContainer', options);

	$('.linkCount').each(function(){
		const thisKind = $(this).closest('.filter').attr('data-filter');
		let kindCount;
		if(thisKind === 'None'){
			kindCount = listObj.matchingItems.length;
		} else {
			// NOTE THIS IS KIND NOT SUBKIND
			kindCount = listObj.matchingItems.filter(kind => kind.values().makerKind === thisKind).length;
		}
		$(this).append(kindCount);
		if(kindCount === 0){
			$(this).closest('.filter').addClass('noResults');
		}
	});

	$('#listjsSearch').on('keyup', function(){
		let searchString = $(this).val();
		listObj.search(searchString);
	});

	$('.filter').on('click', function(){
		let $q = $(this).attr('data-filter');
		if ($(this).hasClass('active')) {
			listObj.filter();
			$(this).find('i').toggleClass('fa-check-circle fa-circle');
			$('.filter').removeClass('active');
			$('.showAll').addClass('active').find('i').addClass('fa-check-circle').removeClass('fa-circle');
		} else if($q === 'None'){
			listObj.filter();
			$('.filter').removeClass('active').find('i').addClass('fa-circle').removeClass('fa-check-circle');
			$(this).addClass('active').find('i').addClass('fa-check-circle').removeClass('fa-circle');
		} else {
			listObj.filter(link => link.values().makerKind === $q);
			$('.filter').removeClass('active').find('i').addClass('fa-circle').removeClass('fa-check-circle');
			$(this).addClass('active').find('i').toggleClass('fa-check-circle fa-circle');
		}
	});

	// Update count

	const $listCounter = $('#listCount');
	const $noResults = $('#noResults');
	$listCounter.append(listObj.size());
	listObj.on('searchComplete', function(){
		$listCounter.text(listObj.update().matchingItems.length);
		if(listObj.matchingItems.length === 0){
			$noResults.show();
		} else {
			$noResults.hide();
		}
		$('.linkCount').each(function(){
			let thisKind = $(this).closest('.filter').attr('data-filter');
			let kindCount;
			if(thisKind === 'None'){
				kindCount = listObj.searchmatchingItems.length;
			} else {
				kindCount = listObj.searchmatchingItems.filter(kind => kind.values().makerKind === thisKind).length;
			}
			$(this).text(kindCount);
			if(kindCount === 0){
				$(this).closest('.filter').addClass('noResults');
			} else {
				$(this).closest('.filter').removeClass('noResults');
			}
		});
	});
	listObj.on('filterComplete', function(){
		$listCounter.text(listObj.update().matchingItems.length);
		if(listObj.matchingItems.length === 0){
			$noResults.show();
		} else {
			$noResults.hide();
		}
	});


	// Hide pagination if one or fewer pages

	listObj.on('updated', function(list){
		if(list.matchingItems.length <= perPage){
			$('.pagination-wrap').hide();
		} else {
			$('.pagination-wrap').show();
		}
	});

	// Scroll to top on list update (proxy for pagination click)

	listObj.on('updated', function(){
		$('html, body').animate({ scrollTop: 0 }, 'fast');
	});

	// Sort links

	$('.listjsSort').on('click', function(){
		$('.listjsSort').removeClass('active');
		$(this).addClass('active');
		$('#sortMenuLink').text(($(this).text()));
	});

});