const user_id = require("../../app");

$(document).ready(function () {
  $(".shopping-cart").fadeOut();
  $("#cart").on("click", function () {
    if ($(".collapse").hasClass("show")) {
      $(".shopping-cart").css("top", "33%");
    }
    $(".shopping-cart").fadeToggle("fast");
  });
  console.log(user_id);
  let count = 0;
  $("#menu img").click((mafiaSiam) => {
    console.log(count, mafiaSiam.target);
    count++;
  });
});
