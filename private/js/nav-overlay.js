$(document).ready(function(){
    $('[data-toggle="offcanvas"]').on('click', function () {
      $(this).toggleClass("is-active");
      $(document.body).toggleClass('noScroll');
      $('.offcanvas-collapse').toggleClass('open');
    });
});