$(document).ready(function () {
  console.log("dd");
  $(".shopping-cart").fadeOut();
  $("#cart").on("click", function () {
    if ($(".collapse").hasClass("show")) {
      $(".shopping-cart").css("top", "33%");
    }
    $(".shopping-cart").fadeToggle("fast");
  });
});
