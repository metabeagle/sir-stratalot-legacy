$(document).ready(function(){

  const options = {
    valueNames: [ 
      'linkTitle',
      'linkKind',
      'linkSubkind',
      'linkMakers',
      'linkTags',
      'linkCreated',
      'linkLikes',
      'linkCost'
    ],
    listClass: 'listjs',
    sortClass: 'listjsSort'
    // page: perPage,
    // paginationClass: 'pagination',
    // // https://github.com/javve/list.js/issues/567
    // pagination: {
    //  innerWindow: 2,
    //  outerWindow: 1
    // }
  };

  const listObj = new List('listjsContainer', options);

  $('.linkCount').each(function(){
    const thisKind = $(this).closest('.filter').attr('data-filter');
    let kindCount;
    if(thisKind === 'None'){
      kindCount = listObj.matchingItems.length;
    } else {
      kindCount = listObj.matchingItems.filter(kind => kind.values().linkSubkind === thisKind).length;
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
      $('.filter').removeClass('active');
      $('.showAll').addClass('active');
    } else if($q === 'None'){
      listObj.filter();
      $('.filter').removeClass('active');
      $(this).addClass('active');
    } else {
      listObj.filter(link => link.values().linkSubkind === $q);
      $('.filter').removeClass('active');
      $(this).addClass('active');
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
        kindCount = listObj.searchmatchingItems.filter(kind => kind.values().linkSubkind === thisKind).length;
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
  // listObj.on('updated', function(list){
  //  if(list.matchingItems.length <= perPage){
  //    $('.pagination-wrap').hide();
  //  } else {
  //    $('.pagination-wrap').show();
  //  }
  // });

  // Scroll to top on list update (proxy for pagination click)
  // listObj.on('updated', function(){
  //  $('html, body').animate({ scrollTop: 0 }, 'fast');
  // });

  // Sort links
  $('.listjsSort').on('click', function(){
    $('.listjsSort').removeClass('active');
    $(this).addClass('active');
    $('#sortMenuLink').text(($(this).text()));
  });

  // Like button
  $('.listjs').on('click', '.likeButton', function(){
    let $thisButton = $(this);
    let linkId = $(this).parent().prev('.linkId').html();
    let $likeCount = $(this).find('.likeCount');
    // let $likeIcon = $(this).find('i');
    let likeData = {
      id: linkId
    };
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url: '../../api/links/like',
      data: JSON.stringify(likeData),
      success: function(newCount){
        $likeCount.text(newCount);
        $thisButton.toggleClass('likeButton unlikeButton');
        $thisButton.find('.likeLabel').text("-1");
      },
      error: function(err){
        console.log(err);
      }
    });
    $thisButton.on('mouseleave', function(){
      $thisButton.blur();
    });
  });

  // Unlike button
  $('.listjs').on('click', '.unlikeButton', function(){
    let $thisButton = $(this);
    let linkId = $(this).parent().prev('.linkId').html();
    let $likeCount = $(this).find('.likeCount');
    // let $likeIcon = $(this).find('i');
    let likeData = {
      id: linkId
    };
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url: '../../api/links/unlike',
      data: JSON.stringify(likeData),
      success: function(newCount){
        $likeCount.text(newCount);
        $thisButton.toggleClass('likeButton unlikeButton');
        $thisButton.find('.likeLabel').text("+1");
      },
      error: function(err){
        console.log(err);
      }
    });
    $thisButton.on('mouseleave', function(){
      $thisButton.blur();
    });
  });

});