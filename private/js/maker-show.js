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
  };

  const listObj = new List('listjsContainer', options);

  $('#listjsSearch').on('keyup', function(){
    let searchString = $(this).val();
    listObj.search(searchString);
  });

  // $('.filter').on('click', function(){
  //   let $q = $(this).attr('data-filter');
  //   if($(this).hasClass('active')){
  //     listObj.filter();
  //     $('.filter').removeClass('active');
  //   } else {
  //     listObj.filter(function(link){
  //       return (link.values().linkKind == $q);
  //     });
  //     $('.filter').removeClass('active');
  //     $(this).addClass('active');
  //   }
  // });

  // Sort links
  // $('.listjsSort').on('click', function(){
  //   $('.listjsSort').removeClass('active');
  //   $(this).addClass('active');
  //   $('#sortMenuLink').text(($(this).text()));
  // });

  // Like button
  $('.listjs').on('click', '.likeButton', function(){
    let $thisButton = $(this);
    let linkId = $(this).parent().prev('.linkId').html();
    let $likeCount = $(this).find('.likeCount');
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