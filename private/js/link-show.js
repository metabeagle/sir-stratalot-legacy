$(document).ready(function(){

  // Like button

  $('.flexTool').on('click', '.likeButton', function(){
    let $thisButton = $(this);
    let linkId = $(this).prevAll('.linkId').html();
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
  $('.flexTool').on('click', '.unlikeButton', function(){
    let $thisButton = $(this);
    let linkId = $(this).prevAll('.linkId').html();
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

  // Flag button
  $('.flexTool').on('click', '.flagButton', function(){
    let $thisButton = $(this);
    let linkId = $(this).parent().prevAll('.linkId').html();
    let $flagIcon = $(this).prevAll('.fa-skull-crossbones');
    let $flagCount = $(this).prevAll('.flagCount');
    let flagData = {
      id: linkId
    };
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url: '../../api/links/flag',
      data: JSON.stringify(flagData),
      success: function(newCount){
        $flagCount.text(newCount);
        $flagCount.addClass('deadItem');
        $flagIcon.addClass('deadItem');
        $thisButton.attr({
          disabled: 'true'
        });
        $thisButton.text("Reported");
      },
      error: function(err){
        console.log(err);
      }
    }); 
  });
});