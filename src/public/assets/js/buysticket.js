window.addEventListener("template-loaded", () => {
  initializeTabs();
  initializeSeatSelection();
  initializeFoodSelection();
  updateBookingInfo();
});

let isBookingConfirmed = false; // Track booking confirmation

function initializeTabs() {
  const tabsSelector = "buy-tickets-tab__item";
  const contentsSelector = "buy-tickets-tab__content";

  const tabActive = `${tabsSelector}--active`;
  const contentActive = `${contentsSelector}--active`;

  const tabContainers = document.querySelectorAll(".js-tabs");
  tabContainers.forEach((tabContainer) => {
    const tabs = tabContainer.querySelectorAll(`.${tabsSelector}`);
    const contents = tabContainer.querySelectorAll(`.${contentsSelector}`);
    tabs.forEach((tab, index) => {
      tab.onclick = () => {
        // Logic to switch tabs
        if (index === 1 && !isBookingConfirmed) {
          // Payment tab
          alert("Please confirm your booking before proceeding to Payment.");
          return;
        }

        // Logic to switch back to Seat Selection tab
        if (index === 0) {
          // Seat Selection tab
          isBookingConfirmed = false; // Reset confirmation status
        }

        // Remove active class from currently active tab and content
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
}

//=================
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // Function to initialize seat selection
function initializeSeatSelection() {
  const seats = document.querySelectorAll(".seat");
  seats.forEach((seat) => {
    seat.onclick = () => selectSeat(seat);
  });
}

// Function to initialize food selection
function initializeFoodSelection() {
  const foodItems = document.querySelectorAll(".food-item");
  foodItems.forEach((item) => {
    const quantityElement = item.querySelector(".food-quantity");
    quantityElement.onchange = calculateTotal;
  });
}

// Function to handle changing quantity of food items
function changeQuantity(event, change) {
  const foodItem = event.target.closest(".food-item");
  const quantityElement = foodItem.querySelector(".food-quantity");
  let currentQuantity = parseInt(quantityElement.textContent);
  currentQuantity += change;

  // Ensure quantity doesn't go below 0
  if (currentQuantity < 0) {
    currentQuantity = 0;
  }

  quantityElement.textContent = currentQuantity;
  calculateTotal(); // Update total whenever the quantity changes
}

// Function to select a seat
function selectSeat(seat) {
  seat.classList.toggle("selected");
  calculateTotal();
}

// Function to calculate the total cost of the booking (seats and food)
function calculateTotal() {
  // Lấy giá vé mỗi ghế
  const selectedSeats = document.querySelectorAll(".seat.selected");
  let seatCost = 0;

  selectedSeats.forEach((seat) => {
    const seatPrice = parseFloat(seat.getAttribute("price-seat")) || 0; // Lấy giá vé từ thuộc tính price-seat
    seatCost += seatPrice; // Cộng dồn giá vé của các ghế đã chọn
  });

  // Tính toán chi phí cho các món ăn
  let foodCost = 0;
  document.querySelectorAll(".food-item").forEach((item) => {
    const quantity =
      parseInt(item.querySelector(".food-quantity").textContent.trim(), 10) ||
      0;
    const price = parseFloat(item.dataset.price) || 0;
    foodCost += quantity * price;
  });

  const totalCost = seatCost + foodCost;
  document.querySelector(
    "#totalAmount"
  ).textContent = `Total: ${totalCost.toLocaleString()} VND`;

  // Lưu tổng tiền vào localStorage
  localStorage.setItem("totalAmount", totalCost);

  // Hiển thị chi tiết đặt vé nếu có ghế đã chọn
  if (selectedSeats.length > 0) {
    displayBookingDetails();
    startCountdown();
  } else {
    hideBookingDetails();
    resetCountdown();
  }
}

// Function to update the payment tab with booking data
function updatePaymentTab(bookingData) {
  // Retrieve total amount from localStorage
  const totalAmount = localStorage.getItem("totalAmount") || 0; // Ensure it's a string; will be parsed later
  /////////

  const selectedSeats = document.querySelectorAll(".seat.selected");
  let seatCost = 0;
  let seatPricesList = []; // Mảng để lưu giá vé của các ghế đã chọn

  selectedSeats.forEach((seat) => {
    const seatPrice = parseFloat(seat.getAttribute("price-seat")) || 0; // Lấy giá vé từ thuộc tính price-seat
    seatCost += seatPrice; // Cộng dồn giá vé của các ghế đã chọn
    seatPricesList.push(seatPrice.toLocaleString()); // Thêm giá vé vào danh sách
  });

  // Chuyển đổi danh sách giá vé thành chuỗi để hiển thị
  const seatPrices = seatPricesList.join(" / "); // Ngăn cách các giá vé bằng dấu "/"
  ////////////
  const info = `
  <h3 class="booking__title">${bookingData.movieTitle} (${
    bookingData.selectedTime
  })</h3>
<p class="booking__cinema">Cinema: Movin</p>
<a
target="_blank"
href="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+S%C6%B0+ph%E1%BA%A1m+K%E1%BB%B9+thu%E1%BA%ADt+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh/@10.8506324,106.7719131,15z/data=!4m2!3m1!1s0x0:0x282f711441b6916f?sa=X&ved=1t:2428&ictx=111"
class="footer__address payment__address"
>Address : 01 Vo Van Ngan Street, Linh Chieu, Thu Duc, Ho Chi Minh City
</a>
<div class="payment__info">
  <h4 class="payment__header">Thông tin đặt vé</h4>
  <p class="payment__detail">- [Phim]: ${bookingData.movieTitle}</p>
  <p class="payment__detail">- [Ngày]: ${bookingData.selectedDate}</p>
  <p class="payment__detail">- [Giờ]: ${
    bookingData.selectedTime || "Not selected"
  }</p>
    <p class="payment__detail">- [Giá Vé]:${seatPrices}</p>
  <p class="payment__detail">- [Ghế]: ${bookingData.selectedSeats.join(
    ", "
  )}</p>
  <p class="payment__detail">- [Đồ ăn]: ${bookingData.foodItems}</p>
  <div class="separate"></div>
  <p class="payment__total">- [Tổng tiền]: ${parseInt(
    totalAmount
  ).toLocaleString()} VND</p>
</div>
  `;
  document.querySelector("#paymentInfo").innerHTML = info;
  ////////////////
  const amountFields = document.getElementById("amountForm");
  amountFields.value = totalAmount;
}

// Function to display the booking details section
function displayBookingDetails() {
  const bookingDetails = document.querySelector("#bookingDetails");
  bookingDetails.style.display = "flex";
  updateBookingInfo();
}

// Function to hide the booking details section
function hideBookingDetails() {
  const bookingDetails = document.querySelector("#bookingDetails");
  bookingDetails.style.display = "none";
}

// Function to update the booking info display
function updateBookingInfo() {
  const selectedDate = localStorage.getItem("selectedDate");
  const selectedTime = localStorage.getItem("selectedTime");
  const selectedScreen = localStorage.getItem("selectedScreen");
  const selectedShowtimeId = localStorage.getItem("selectedShowtimeId");
  document.querySelector(".screenId").innerText = selectedScreen;

  let data = selectedScreen;
  let selectedScreen_1 = data.split(":")[1].trim();
  document.querySelector(".screenId-2").innerText = selectedScreen_1;

  const selectedSeats = Array.from(document.querySelectorAll(".seat.selected"))
    .map((seat) => seat.innerText)
    .join(", ");

  const foodItems = Array.from(document.querySelectorAll(".food-item"))
    .map((item) => {
      const quantity = item.querySelector(".food-quantity").textContent;
      const name = item.querySelector("label").innerText;
      return quantity > 0 ? `${name} (x${quantity})` : null;
    })
    .filter(Boolean)
    .join(", ");

  const movieTitle = document.querySelector("#nameFilm").innerText;
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString()
    : "Not selected";

  const info = `
      - [Movie]: ${movieTitle}<br>
      - [Date]: ${formattedDate}<br>
      - [Time]: ${selectedTime || "Not selected"}<br>
      - [Screen]: ${selectedScreen_1 || "Not selected"}<br>
      - [Seats]: ${selectedSeats}<br>
      - [Food]: ${foodItems}<br>
  `;
  const dateFields = document.getElementById("date_film");
  const timeFields = document.getElementById("time_film");
  const seatFields = document.getElementById("seat_film");
  const screenFields = document.getElementById("screen_film");
  const foodFields = document.getElementById("food_film");
  const showtimeIdFields = document.getElementById("showtime_Id");

  // Cập nhật giá trị cho từng input field
  dateFields.value = formattedDate;
  timeFields.value = selectedTime;
  seatFields.value = selectedSeats;
  screenFields.value = selectedScreen_1;
  foodFields.value = foodItems;
  showtimeIdFields.value = selectedShowtimeId;
  document.querySelector("#bookingInfo").innerHTML = info;
}

// Function to select a showtime (newly integrated)
function selectShowtime(event) {
  const showtimeElement = event.target.closest(".showtime__book");
  if (!showtimeElement) return; // Ensure a valid element is clicked

  const date = showtimeElement.dataset.date;
  const startTime = showtimeElement.querySelector(
    ".showtime__start-time"
  ).textContent;
  const showtimeId = showtimeElement.querySelector(
    ".showtime__showtime-id"
  ).textContent;
  const screen = showtimeElement.querySelector(".showtime__screen").textContent;

  // Save the selected showtime details in localStorage
  localStorage.setItem("selectedDate", date);
  localStorage.setItem("selectedTime", startTime);
  localStorage.setItem("selectedScreen", screen);
  localStorage.setItem("selectedShowtimeId", showtimeId);

  // Update the booking info
  updateBookingInfo();
}

// Add event listeners to all showtime__book elements
document.querySelectorAll(".showtime__book").forEach((showtimeElement) => {
  showtimeElement.onclick = selectShowtime;
});

// Function to confirm the booking
function confirmBooking() {
  const selectedSeats = Array.from(
    document.querySelectorAll(".seat.selected")
  ).map((seat) => seat.innerText);
  const foodItems = Array.from(document.querySelectorAll(".food-item"))
    .map((item) => {
      const quantity = item.querySelector(".food-quantity").textContent;
      const name = item.querySelector("label").innerText;
      return quantity > 0 ? `${name} (x${quantity})` : null;
    })
    .filter(Boolean)
    .join(", ");

  const movieTitle = document.querySelector("#nameFilm").innerText;
  const selectedDate = localStorage.getItem("selectedDate");
  const selectedTime = localStorage.getItem("selectedTime");
  const selectedScreen = localStorage.getItem("selectedScreen");
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString()
    : "Not selected";

  // Store booking data
  const bookingData = {
    movieTitle,
    selectedDate: formattedDate,
    selectedTime,
    selectedScreen,
    selectedSeats,
    foodItems,
  };
  localStorage.setItem("bookingData", JSON.stringify(bookingData));

  updatePaymentTab(bookingData);

  isBookingConfirmed = true;

  const tabs = document.querySelectorAll(".buy-tickets-tab__item");
  const contents = document.querySelectorAll(".buy-tickets-tab__content");

  tabs.forEach((tab) => tab.classList.remove("buy-tickets-tab__item--active"));
  contents.forEach((content) =>
    content.classList.remove("buy-tickets-tab__content--active")
  );

  tabs[1].classList.add("buy-tickets-tab__item--active");
  contents[1].classList.add("buy-tickets-tab__content--active");
}

// Function to start the countdown timer
function startCountdown() {
  const countdownElement = document.querySelector("#countdown");
  let countdownTime = 5 * 60; // 5 minutes in seconds

  const interval = setInterval(() => {
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    countdownElement.textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

    countdownTime--;

    if (countdownTime < 0) {
      clearInterval(interval);
      resetCountdown();
    }
  }, 1000);
}

// Function to reset the countdown timer
function resetCountdown() {
  const countdownElement = document.querySelector("#countdown");
  countdownElement.textContent = "5:00";
}

// Initialize seat and food selections when the page loads
initializeSeatSelection();
initializeFoodSelection();

/////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".buy-tickets-tab__item");
  const background = document.createElement("div");
  background.classList.add("buy-tickets-tab__background");
  document.querySelector(".buy-tickets-tab__list").appendChild(background);

  function updateBackgroundWidth() {
    const activeTabIndex = Array.from(tabs).findIndex((tab) =>
      tab.classList.contains("buy-tickets-tab__item--active")
    );
    background.style.width = `${(activeTabIndex + 1) * 33}%`;
  }

  updateBackgroundWidth();

  const observer = new MutationObserver(updateBackgroundWidth);

  tabs.forEach((tab) => {
    observer.observe(tab, {
      attributes: true,
      attributeFilter: ["class"],
    });
  });
});
////////////////////////////////// code moi
scrollToTopBtn.addEventListener("click", function () {
  // Cuộn lên đầu trang
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth", // Thêm hiệu ứng mượt mà khi cuộn
  });
});
/////////////////////////////////////////////////////////////////
