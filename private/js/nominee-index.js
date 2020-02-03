$(document).ready(function(){

  // List.js stuff
  const options = {
    valueNames: [ 
      'nomTitle',
      'nomKind',
      'nomMakers',
      'nomCreated',
      'nomLikes'
    ],
    listClass: 'listjs',
    sortClass: 'listjsSort'
  };

  const listObj = new List('listjsContainer', options);

  $('#listjsSearch').on('keyup', function(){
    let searchString = $(this).val();
    listObj.search(searchString);
  });

  $('.filter').on('click', function(){
    let $q = $(this).attr('data-filter');
    if ($(this).hasClass('active')) {
      listObj.filter();
      $('.filter').removeClass('active');
    } else if($q === 'None'){
      listObj.filter();
      $('.filter').removeClass('active');
      $(this).addClass('active');
    } else {
      listObj.filter(function(nom){
        return (nom.values().nomKind == $q);
      });
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
  });
  listObj.on('filterComplete', function(){
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

  // Like button

  $('.listjs').on('click', '.likeButton', function(){
    let $thisButton = $(this);
    let nomId = $(this).parent().prev('.nomId').html();
    let $likeCount = $(this).find('.likeCount');
    let likeData = {
      id: nomId
    };
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url: '../../api/nominees/like',
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
    let nomId = $(this).parent().prev('.nomId').html();
    let $likeCount = $(this).find('.likeCount');
    let likeData = {
      id: nomId
    };
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url: '../../api/nominees/unlike',
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