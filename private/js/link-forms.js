$(document).ready(function(){

// Links/new form - kind switcher

  $("#linkBook").on("change", function(){
    if($(this).is(":checked") === true){
      $(".bookField").show();
      $(".singleField").hide();
      $(".feedField").hide();
      $(".resourceField").hide();
      $(".toolField").hide();
      $(".extraField").hide();
    }
  });

  $("#linkSingle").on("change", function(){
    if($(this).is(":checked") === true){
      $(".singleField").show();
      $(".bookField").hide();
      $(".feedField").hide();
      $(".resourceField").hide();
      $(".toolField").hide();
      $(".extraField").hide();
    }
  });

  $("#linkFeed").on("change", function(){
    if($(this).is(":checked") === true){
      $(".feedField").show();
      $(".bookField").hide();
      $(".singleField").hide();
      $(".resourceField").hide();
      $(".toolField").hide();
      $(".extraField").hide();
    }
  });

  $("#linkResource").on("change", function(){
    if($(this).is(":checked") === true){
      $(".resourceField").show();
      $(".bookField").hide();
      $(".singleField").hide();
      $(".feedField").hide();
      $(".toolField").hide();
      $(".extraField").hide();
    }
  });

  $("#linkTool").on("change", function(){
    if($(this).is(":checked") === true){
      $(".toolField").show();
      $(".bookField").hide();
      $(".singleField").hide();
      $(".feedField").hide();
      $(".resourceField").hide();
      $(".extraField").hide();
    }
  });

  $("#linkExtra").on("change", function(){
    if($(this).is(":checked") === true){
      $(".extraField").show();
      $(".bookField").hide();
      $(".singleField").hide();
      $(".feedField").hide();
      $(".resourceField").hide();
      $(".toolField").hide();
    }
  });

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

// AJAX query for sources select2 field

  $('#sourceSelect').select2({
    ajax: {
      delay: 200,
      url: '../../api/sources',
      dataType: 'json',
      processResults: function(data){
        return {
          results: data
        }
      }
    },
    theme: 'bootstrap4',
    // tags: true,
    placeholder: 'Source(s)',
    language: {
      inputTooShort: function(params){
        return "Type to search..."
      }
    },
    minimumInputLength: 1
  });

// AJAX query for tags select2 field

  $('#tagSelect').select2({
    ajax: {
      delay: 200,
      url: '../../api/tags',
      dataType: 'json',
      processResults: function(data){
        return {
          results: data
        }
      }
    },
    theme: 'bootstrap4',
    tags: true,
    placeholder: 'Tags',
    language: {
      inputTooShort: function(params){
        return "Type to search..."
      }
    },
    minimumInputLength: 1
  });

});