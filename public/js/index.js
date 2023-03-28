$(document).ready(function () {
  $(".shopping-cart").fadeOut();
  $("#cart").on("click", function () {
    if ($(".collapse").hasClass("show")) {
      $(".shopping-cart").css("top", "33%");
    }
    $(".shopping-cart").fadeToggle("fast");
  });
  let count = 0;
  $("#menu img").click((mafiaSiam) => {
    console.log(count, mafiaSiam.target);
    count++;
  });
});
