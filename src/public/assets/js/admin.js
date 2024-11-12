setTimeout(() => {
  document.querySelector(".stars").style.display = "none";
}, 8000);
/////////
document.addEventListener("DOMContentLoaded", () => {
  // Xử lý poster
  const posterInput = document.getElementById("poster_url");
  const posterPreview = document.querySelector(".admin__poster-update");

  posterInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      posterPreview.src = URL.createObjectURL(file);
    }
  });

  // Xử lý thumbnail previews
  const thumbInputs = document.querySelectorAll(".admin__thumb-preview-upload");
  const thumbPreviews = document.querySelectorAll(".admin__thumb-preview-img");

  thumbInputs.forEach((input, index) => {
    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        thumbPreviews[index].src = URL.createObjectURL(file);
      }
    });
  });
});
