document.addEventListener("DOMContentLoaded", function () {
  const modalSaveButton = document.getElementById("modalSaveButton");
  const profileForm = document.getElementById("FormAction");
  if (modalSaveButton && profileForm) {
    modalSaveButton.addEventListener("click", function (event) {
      const requiredFields = profileForm.querySelectorAll("input[required]");
      let allFieldsFilled = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          allFieldsFilled = false;
        }
      });

      if (!allFieldsFilled) {
        alert("Please fill in all required fields before saving.");
        event.preventDefault();
      } else {
        profileForm.submit();
      }
    });
  }

  const gradients = [
    "linear-gradient(to top right, #f28f9f, #ed9cb8)",
    "linear-gradient(to top right, #a18cd1, #fbc2eb)",
    "linear-gradient(to top right, #ff9a9e, #fad0c4)",
    "linear-gradient(to top right, #ffecd2, #fcb69f)",
    "linear-gradient(to top right, #ff9966, #ff5e62)",
    "linear-gradient(to top right, #c2e9fb, #a1c4fd)",
    "linear-gradient(to top right, #fddb92, #d1fdff)",
    "linear-gradient(to top right, #a1ffce, #faffd1)",
    "linear-gradient(to top right, #89f7fe, #66a6ff)",
    "linear-gradient(to top right, #d4fc79, #96e6a1)",
    "linear-gradient(to top right, #ffb3c2, #ffd6e2)",
    "linear-gradient(to top right, #d6a8ec, #f2d7ff)",
    "linear-gradient(to top left, #ffc2c8, #ffd4db)",
    "linear-gradient(to top left, #ffe8d9, #ffdfc2)",
    "linear-gradient(to top left, #ffb8b1, #ffddd5)",
    "linear-gradient(to top left, #d9f4ff, #b3dbff)",
    "linear-gradient(to top left, #fff7da, #ffedc5)",
    "linear-gradient(to top left, #d7ffd9, #c7ffd0)",
    "linear-gradient(to top left, #c9f5ff, #b0e6ff)",
    "linear-gradient(to top left, #e2ffc6, #cbffb3)",
  ];

  const borderImages = [
    "/assets/img/dropdown/border-img-1.jpeg",
    "/assets/img/dropdown/border-img-2.jpg",
    "/assets/img/dropdown/border-img-3.jpg",
    "/assets/img/dropdown/border-img-4.jpg",
    "/assets/img/dropdown/border-img-5.jpg",
    "/assets/img/dropdown/border-img-6.jpg",
    "/assets/img/dropdown/border-img-7.jpg",
    "/assets/img/dropdown/bg-themes-light.jpg",
  ];

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const rows = document.querySelectorAll(".admin__row");

  rows.forEach((row) => {
    const randomGradient = getRandomItem(gradients);
    row.style.background = randomGradient;
    const randomBorderImage = getRandomItem(borderImages);
    row.style.borderImage = `url(${randomBorderImage}) 30 round`;
    const posterBottom = row.querySelector(".admin__poster-bottom");
    const posterBlur = row.querySelector(".admin__poster-blur");

    if (posterBottom) posterBottom.style.background = randomGradient;
    if (posterBlur) posterBlur.style.background = randomGradient;
  });
});
