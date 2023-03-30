$(document).ready(function () {
  // $(".shopping-cart").fadeOut();
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

  document.querySelectorAll(".clickable-image").forEach(function (image) {
    image.addEventListener("click", function () {
      const imageId = this.dataset.id;
      console.log("image ID", imageId);
      console.log("this", this);
      console.log("this .dataset" + this.dataset);

      // Send the image ID to the server using a POST request
      fetch("/image-clicked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: imageId }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Image ID sent successfully:", data);
        })
        .catch((error) => {
          console.error("Error sending image ID:", error);
        });
    });
  });
});
