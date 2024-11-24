document.addEventListener("DOMContentLoaded", function () {
  const slideshowItems = document.querySelectorAll(".slideshow__item");
  const leftButton = document.querySelector(".slideshow__button--left");
  const rightButton = document.querySelector(".slideshow__button--right");
  const sliders = document.querySelectorAll(".slideshow__slider");

  let currentSlide = 0;

  function showSlide(index) {
    slideshowItems.forEach((item, i) => {
      item.classList.remove("active", "next", "prev");

      if (i === index) {
        item.classList.add("active");
      } else if (i === (index + 1) % slideshowItems.length) {
        item.classList.add("next");
      } else if (
        i ===
        (index - 1 + slideshowItems.length) % slideshowItems.length
      ) {
        item.classList.add("prev");
      }
      sliders[i].style.opacity = i === index ? "1" : "0.5";
    });
  }
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slideshowItems.length;
    showSlide(currentSlide);
  }

  function previousSlide() {
    currentSlide =
      (currentSlide - 1 + slideshowItems.length) % slideshowItems.length;
    showSlide(currentSlide);
  }
  rightButton.addEventListener("click", nextSlide);
  leftButton.addEventListener("click", previousSlide);

  function autoSlide() {
    setInterval(nextSlide, 10000);
  }

  // Initial display
  showSlide(currentSlide);
  autoSlide();
});
