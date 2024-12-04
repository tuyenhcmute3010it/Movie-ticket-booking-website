// Lấy tất cả các nút trailer
const trailerButtons = document.querySelectorAll(".film-card__trailer");
const overlay = document.getElementById("overlay");
const videoIframe = document.getElementById("trailerVideo");

// Gắn sự kiện click cho mỗi nút trailer
trailerButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // Lấy URL video từ data-video-url của nút được nhấn
    const videoUrl = button.getAttribute("data-video-url");

    // Thiết lập URL video vào iframe và hiển thị overlay
    videoIframe.src = videoUrl + "&mute=1&autoplay=1";
    overlay.style.display = "flex";
  });
});

// Đóng overlay khi nhấn vào overlay và dừng video
overlay.addEventListener("click", function () {
  // Ẩn overlay
  overlay.style.display = "none";

  // Xóa src để dừng video
  videoIframe.src = "";
});

// Ngăn việc đóng overlay khi nhấn vào chính iframe
videoIframe.addEventListener("click", function (event) {
  event.stopPropagation();
});

/////////////////////////////////////////////////
