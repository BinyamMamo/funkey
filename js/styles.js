$(document).ready(function () {
  $(".play-icon").hover(
    function () {
      $(this).removeClass("bi-play-circle");
      $(this).addClass("bi-play-circle-fill");
    },
    function () {
      $(this).addClass("bi-play-circle");
      $(this).removeClass("bi-play-circle-fill");
    }
  );
});
