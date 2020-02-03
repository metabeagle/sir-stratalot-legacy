$(document).ready(function(){
  // set up bloodhound
  const tags = new Bloodhound({
    initialize: false,
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('tag'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '../data/tags.json'
    },
    cache: false
  });
  const links = new Bloodhound({
    initialize: false,
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '../data/links.json'
    },
    cache: false
  });
  const makers = new Bloodhound({
    initialize: false,
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('sortname'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '../data/makers.json'
    },
    cache: false
  });

  $('#searchInput').focus(function(){
    tags.initialize();
    links.initialize();
    makers.initialize();
  });

  // set up typeahead input
  $('#bloodhound .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 2,
    limit: 10
  },
  {
    name: 'tags',
    source: tags.ttAdapter(),
    displayKey: 'tag',
    templates: {
      notFound: '<div class="ttNoResults">0 search results</div>',
      header: '<div class="tt-suggestion ttHeader">Tags</div>',
      suggestion: function(data){
        return `<div><div>${data.tag}</div><div class="ttMeta ttCount">${data.count}</div></div>`;
      }
    }
  },
  {
    name: 'links',
    source: links.ttAdapter(),
    displayKey: 'title',
    templates: {
      notFound: '<div class="ttNoResults">0 search results</div>',
      header: '<div class="tt-suggestion ttHeader">Links</div>',
      suggestion: function(data){
        return `<div><div>${data.title}</div><div class="ttMeta">${data.subkind}</div></div>`;
      }
    }
  },
  {
    name: 'makers',
    source: makers.ttAdapter(),
    displayKey: 'sortname',
    templates: {
      notFound: '<div class="ttNoResults">0 search results</div>',
      header: '<div class="tt-suggestion ttHeader">Makers</div>',
      suggestion: function(data){
        // if(data.links === 1){
          return `<div><div>${data.sortname}</div><div class="ttMeta ttCount">${data.links}</div></div>`;
        // } else {
          // return `<div><div>${data.sortname}</div><div class="ttMeta">${data.links} links</div></div>`;
        // }
      }
    }
  });
  // Only display one '0 results' message
  $('#bloodhound .typeahead').on('typeahead:render', function(e, objs, async, name) {
      var nones = $('.tt-menu').find('.ttNoResults');
      var suggestions = $('.tt-menu').find('.tt-suggestion.tt-selectable');
      nones.hide(); // Hide all notFound messages
      if(suggestions.length === 0) {  // Only show the first message if there are zero results available
          nones.first().show();
      }
  });
  // Navigate to selection
  $('#bloodhound .typeahead').on('typeahead:select', function(event, selection, source){
    window.location.href = `${source}/${selection.slug}`;
  });
});