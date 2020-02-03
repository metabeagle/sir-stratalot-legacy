$(document).ready(function(){

  const options = {
    valueNames: [ 
      'sourceTitle',
      'sourceMakers',
      'sourceCreated'
    ],
    listClass: 'listjs',
    sortClass: 'listjsSort'
  };

  const listObj = new List('listjsContainer', options);

  $('#listjsSearch').on('keyup', function(){
    let searchString = $(this).val();
    listObj.search(searchString);
  });

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
  });

  // Sort links
  $('.listjsSort').on('click', function(){
    $('.listjsSort').removeClass('active');
    $(this).addClass('active');
    $('#sortMenuLink').text(($(this).text()));
  });

});