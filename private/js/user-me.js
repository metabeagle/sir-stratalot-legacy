$(document).ready(function(){

  // Likes
  // Like button
  $('.userLike').on('click', '.likeButton', function(){
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
  $('.userLike').on('click', '.unlikeButton', function(){
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

  // NomLikes
  // Like button
  $('.userNomLike').on('click', '.likeButton', function(){
    let $thisButton = $(this);
    let nomId = $(this).parent().prev('.nomId').html();
    let $likeCount = $(this).find('.likeCount');
    let $likeIcon = $(this).find('i');
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
  $('.userNomLike').on('click', '.unlikeButton', function(){
    let $thisButton = $(this);
    let nomId = $(this).parent().prev('.nomId').html();
    let $likeCount = $(this).find('.likeCount');
    let $likeIcon = $(this).find('i');
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