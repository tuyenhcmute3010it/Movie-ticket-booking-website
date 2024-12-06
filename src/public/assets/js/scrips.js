// auto flow in top page
window.onload = function () {
  window.scrollTo(0, 0);
};
////
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Hàm tải template
 *
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */
function load(selector, path) {
  const cached = localStorage.getItem(path);
  if (cached) {
    $(selector).innerHTML = cached;
  }

  fetch(path)
    .then((res) => res.text())
    .then((html) => {
      if (html !== cached) {
        $(selector).innerHTML = html;
        localStorage.setItem(path, html);
      }
    })
    .finally(() => {
      window.dispatchEvent(new Event("template-loaded"));
    });
}

window.addEventListener("template-loaded", initJsToggle);

function initJsToggle() {
  $$(".js-toggle").forEach((button) => {
    const target = button.getAttribute("toggle-target");
    if (!target) {
      document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
    }
    button.onclick = (e) => {
      e.preventDefault;
      if (!$(target)) {
        return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
      }
      const isHidden = $(target).classList.contains("hide");

      requestAnimationFrame(() => {
        $(target).classList.toggle("hide", !isHidden);
        $(target).classList.toggle("show", isHidden);
      });
    };
    document.onclick = function (e) {
      if (!e.target.closest(target)) {
        const isHidden = $(target).classList.contains("hide");
        if (!isHidden) {
          button.click();
        }
      }
    };
  });
}

window.addEventListener("template-loaded", () => {
  const links = $$(".js-dropdown-list > li > a");

  links.forEach((link) => {
    link.onclick = () => {
      if (window.innerWidth > 991) return;
      const item = link.closest("li");
      item.classList.toggle("navbar__item--active");
    };
  });
});

window.addEventListener("template-loaded", handleActiveMenu);

function handleActiveMenu() {
  const dropdowns = $$(".js-dropdown");
  const menus = $$(".js-menu-list");
  const activeClass = "menu-column__item--active";

  const removeActive = (menu) => {
    menu.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
  };

  const init = () => {
    menus.forEach((menu) => {
      const items = menu.children;
      if (!items.length) return;

      removeActive(menu);
      if (window.innerWidth > 991) items[0].classList.add(activeClass);

      Array.from(items).forEach((item) => {
        item.onmouseenter = () => {
          if (window.innerWidth <= 991) return;
          removeActive(menu);
          item.classList.add(activeClass);
        };
        item.onclick = () => {
          if (window.innerWidth > 991) return;
          removeActive(menu);
          item.classList.add(activeClass);
          item.scrollIntoView();
        };
      });
    });
  };

  init();

  dropdowns.forEach((dropdown) => {
    dropdown.onmouseleave = () => init();
  });
}

window.addEventListener("template-loaded", () => {
  const switchBtn = document.querySelector("#switch-theme-btn");
  if (switchBtn) {
    switchBtn.onclick = function () {
      const isDark = localStorage.dark === "true";
      document.querySelector("html").classList.toggle("dark", !isDark);
      localStorage.setItem("dark", !isDark);
      switchBtn.querySelector("span").textContent = isDark
        ? "Light mode"
        : "Dark mode";
      switchBtn.querySelector("data-unchecked").textContent = isDark
        ? "Light mode"
        : "Dark mode";
    };
    const isDark = localStorage.dark === "true";
    switchBtn.querySelector("span").textContent = isDark
      ? "Dark mode"
      : "Light mode";
    switchBtn.querySelector("data-unchecked").textContent = isDark
      ? "Dark mode"
      : "Light mode";
  }
});

const isDark = localStorage.dark === "true";
document.querySelector("html").classList.toggle("dark", isDark);
//////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  // Get all the thumbnail images in the DOM
  const images = Array.from(
    document.querySelectorAll(".prod-preview__thumb-img")
  ).map((img) => img.src);

  let currentIndex = 0;

  function showImage(index) {
    currentIndex = index;
    const overlay = document.getElementById("imageOverlay");
    const overlayImg = document.getElementById("overlay-thumb-img");

    overlayImg.src = images[currentIndex];
    overlay.style.display = "flex";
  }

  function hideImage() {
    const overlay = document.getElementById("imageOverlay");
    overlay.style.display = "none";
  }

  function changeImage(direction) {
    currentIndex += direction;
    if (currentIndex < 0) {
      currentIndex = images.length - 1;
    } else if (currentIndex >= images.length) {
      currentIndex = 0;
    }

    const overlayImg = document.getElementById("overlay-thumb-img");
    overlayImg.src = images[currentIndex];
  }

  // Add event listeners for the prev, next, and close buttons
  document
    .querySelector(".overlay-thumb__prev")
    .addEventListener("click", function (event) {
      event.stopPropagation();
      changeImage(-1);
    });

  document
    .querySelector(".overlay-thumb__next")
    .addEventListener("click", function (event) {
      event.stopPropagation();
      changeImage(1);
    });

  document
    .querySelector(".overlay-thumb__close")
    .addEventListener("click", function (event) {
      event.stopPropagation();
      hideImage();
    });

  // Add event listeners to the thumbnail images to show the enlarged image
  document
    .querySelectorAll(".prod-preview__thumb-img")
    .forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", function () {
        showImage(index);
      });
    });
});

///////////////////////////////////////////////
// js tab

window.addEventListener("template-loaded", () => {
  const tabsSelector = "prod-tab__item";
  const contentsSelector = "prod-tab__content";

  const tabActive = `${tabsSelector}--active`;
  const contentActive = `${contentsSelector}--active`;

  const tabContainers = $$(".js-tabs");
  tabContainers.forEach((tabContainer) => {
    const tabs = tabContainer.querySelectorAll(`.${tabsSelector}`);
    const contents = tabContainer.querySelectorAll(`.${contentsSelector}`);
    tabs.forEach((tab, index) => {
      tab.onclick = () => {
        tabContainer
          .querySelector(`.${tabActive}`)
          ?.classList.remove(tabActive);
        tabContainer
          .querySelector(`.${contentActive}`)
          ?.classList.remove(contentActive);
        tab.classList.add(tabActive);
        contents[index].classList.add(contentActive);
      };
    });
  });
});
////////////////////search

document
  .querySelector(".search-bar__submit")
  .addEventListener("click", function (e) {
    e.preventDefault(); // Ngăn form reload trang
    const query = document
      .querySelector(".search-bar__input")
      .value.toLowerCase(); // Lấy từ khóa tìm kiếm
    const filmCards = document.querySelectorAll(".film-card"); // Tất cả thẻ chứa phim

    let found = false; // Biến kiểm tra có tìm thấy phim hay không

    // Ẩn tất cả thẻ phim
    filmCards.forEach((card) => (card.style.display = "none"));

    // Lọc và hiển thị phim có tên khớp với từ khóa
    filmCards.forEach((card) => {
      const filmTitle = card
        .querySelector(".film-card__title")
        .textContent.toLowerCase();
      if (filmTitle.includes(query)) {
        card.style.display = ""; // Hiển thị phim phù hợp
        if (!found) {
          // Cuộn đến vị trí phim đầu tiên tìm được
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          found = true; // Đánh dấu đã tìm thấy
        }
      }
    });

    // Hiển thị thông báo nếu không tìm thấy kết quả, sau đó reset danh sách
    if (!found) {
      alert("No films found!");
      // Reset danh sách phim
      filmCards.forEach((card) => (card.style.display = ""));
    }
  });
////////////////////
document.addEventListener("DOMContentLoaded", function () {
  let selectedFilmId; // ID của phim
  let isDeleted; // Trạng thái xóa/hiển thị

  // Mở modal khi nhấn nút "Hide/Show"
  jQuery("#delete-film-modal").on("show.bs.modal", function (event) {
    const button = jQuery(event.relatedTarget); // Lấy nút được nhấn
    selectedFilmId = button.data("id"); // ID phim
    isDeleted =
      button.data("deleted") === true || button.data("deleted") === "true"; // Đổi thành boolean

    // Cập nhật nội dung modal
    const modalMessage = document.querySelector("#modal-message");
    const modalTitle = document.querySelector("#modal-title");
    const confirmButton = document.querySelector("#btn-hide-film");

    if (isDeleted) {
      modalMessage.textContent = "Are you sure to show this film?";
      modalTitle.textContent = "Show Film";
      confirmButton.textContent = "Show";
    } else {
      modalMessage.textContent = "Are you sure to hide this film?";
      modalTitle.textContent = "Hide Film";
      confirmButton.textContent = "Hide";
    }
  });

  // Xử lý sự kiện xác nhận
  const btnHideFilm = document.querySelector("#btn-hide-film");
  btnHideFilm.addEventListener("click", async function () {
    try {
      const response = await fetch(`/admin/${selectedFilmId}/toggle-delete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_deleted: !isDeleted }), // Đảo trạng thái
      });

      if (response.ok) {
        window.location.reload(); // Reload lại trang sau khi cập nhật
      } else {
        alert("Failed to update the film status.");
      }
    } catch (error) {
      console.error("Error updating the film status:", error);
      alert("An error occurred while updating the film status.");
    }
  });
});
