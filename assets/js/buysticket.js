window.addEventListener("template-loaded", () => {
  initializeTabs();
  initializeSeatSelection();
  initializeFoodSelection();
  updateBookingInfo(); // To display initial booking info if available
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

        // Add active class to clicked tab and corresponding content
        tab.classList.add(tabActive);
        contents[index].classList.add(contentActive);
      };
    });
  });
}

//=================

function initializeSeatSelection() {
  const seats = document.querySelectorAll(".seat");
  seats.forEach((seat) => {
    seat.onclick = () => selectSeat(seat);
  });
}

function initializeFoodSelection() {
  const foodItems = document.querySelectorAll(".food-item");
  foodItems.forEach((item) => {
    const quantityElement = item.querySelector(".food-quantity");
    quantityElement.onchange = calculateTotal;
  });
}

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

function selectSeat(seat) {
  seat.classList.toggle("selected");
  calculateTotal();
}

function calculateTotal() {
  const seatPrice = 45000;
  const selectedSeats = document.querySelectorAll(".seat.selected").length;
  const seatCost = selectedSeats * seatPrice;

  let foodCost = 0;
  document.querySelectorAll(".food-item").forEach((item) => {
    const quantity =
      parseInt(item.querySelector(".food-quantity").textContent) || 0;
    const price = parseFloat(item.dataset.price) || 0;
    foodCost += quantity * price;
  });

  const totalCost = seatCost + foodCost;
  document.querySelector(
    "#totalAmount"
  ).textContent = `Total: ${totalCost.toLocaleString()} VND`;

  // Store the total amount in localStorage
  localStorage.setItem("totalAmount", totalCost); // Save totalCost to localStorage

  // Display booking details only if there are selected seats
  if (selectedSeats > 0) {
    displayBookingDetails();
    startCountdown();
  } else {
    hideBookingDetails();
    resetCountdown();
  }
}

function updatePaymentTab(bookingData) {
  // Retrieve total amount from localStorage
  const totalAmount = localStorage.getItem("totalAmount") || 0; // Ensure it's a string; will be parsed later

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
    <p class="payment__detail">- [Giá Vé]:45.000</p>
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
}

function displayBookingDetails() {
  const bookingDetails = document.querySelector("#bookingDetails");
  bookingDetails.style.display = "flex";
  updateBookingInfo();
}

function hideBookingDetails() {
  const bookingDetails = document.querySelector("#bookingDetails");
  bookingDetails.style.display = "none";
}

function updateBookingInfo() {
  const selectedDate = localStorage.getItem("selectedDate");
  const selectedTime = localStorage.getItem("selectedTime");

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

  const movieTitle =
    new URLSearchParams(window.location.search).get("movie") || "Movie Title";
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString()
    : "Not selected";

  const info = `
      - [Movie]: ${movieTitle}<br>
      - [Date]: ${formattedDate}<br>
      - [Time]: ${selectedTime || "Not selected"}<br>
      - [Seats]: ${selectedSeats}<br>
      - [Food]: ${foodItems}<br>
  `;

  document.querySelector("#bookingInfo").innerHTML = info;
}

function selectShowtime(date, time) {
  localStorage.setItem("selectedDate", date);
  localStorage.setItem("selectedTime", time);
}

document.querySelectorAll(".showtime-button").forEach((button) => {
  button.onclick = () => {
    const date = button.dataset.date;
    const time = button.dataset.time;
    selectShowtime(date, time);
    updateBookingInfo();
  };
});

let timer;
const countdownDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
let countdownStarted = false;

function startCountdown() {
  if (countdownStarted) return;

  let timeLeft = countdownDuration;
  const countdownDisplay = document.querySelector("#countdown");
  countdownDisplay.textContent = formatTime(timeLeft);

  timer = setInterval(() => {
    timeLeft -= 1000;
    countdownDisplay.textContent = formatTime(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! Reloading...");
      location.reload();
    }
  }, 1000);

  countdownStarted = true;
}

function resetCountdown() {
  clearInterval(timer);
  countdownStarted = false;
}

function formatTime(ms) {
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${minutes}m ${seconds}s`;
}

// function confirmBooking() {
//   // Existing confirmation logic
//   const selectedSeats = Array.from(
//     document.querySelectorAll(".seat.selected")
//   ).map((seat) => seat.innerText);
//   const foodItems = Array.from(document.querySelectorAll(".food-item"))
//     .map((item) => {
//       const quantity = item.querySelector(".food-quantity").textContent;
//       const name = item.querySelector("label").innerText;
//       return quantity > 0 ? `${name} (x${quantity})` : null;
//     })
//     .filter(Boolean)
//     .join(", ");

//   const movieTitle =
//     new URLSearchParams(window.location.search).get("movie") || "Movie Title";
//   const selectedDate = localStorage.getItem("selectedDate");
//   const selectedTime = localStorage.getItem("selectedTime");
//   const formattedDate = selectedDate
//     ? new Date(selectedDate).toLocaleDateString()
//     : "Not selected";

//   // Store booking data
//   const bookingData = {
//     movieTitle,
//     selectedDate: formattedDate,
//     selectedTime,
//     selectedSeats,
//     foodItems,
//   };
//   localStorage.setItem("bookingData", JSON.stringify(bookingData));

//   // Update the payment tab with formatted booking details
//   updatePaymentTab(bookingData);

//   // Set booking confirmation status to true
//   isBookingConfirmed = true;

//   // Switch to the Payment tab
//   const tabs = document.querySelectorAll(".buy-tickets-tab__item");
//   const contents = document.querySelectorAll(".buy-tickets-tab__content");

//   tabs.forEach((tab) => tab.classList.remove("buy-tickets-tab__item--active"));
//   contents.forEach((content) =>
//     content.classList.remove("buy-tickets-tab__content--active")
//   );

//   tabs[1].classList.add("buy-tickets-tab__item--active"); // Assuming Payment tab is the second tab
//   contents[1].classList.add("buy-tickets-tab__content--active");
// }
// // Event listener for the confirm button
// document.querySelector("#confirmButton").onclick = confirmBooking;
// Existing confirmBooking function
function confirmBooking() {
  // Existing confirmation logic
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

  const movieTitle =
    new URLSearchParams(window.location.search).get("movie") || "Movie Title";
  const selectedDate = localStorage.getItem("selectedDate");
  const selectedTime = localStorage.getItem("selectedTime");
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString()
    : "Not selected";

  // Store booking data
  const bookingData = {
    movieTitle,
    selectedDate: formattedDate,
    selectedTime,
    selectedSeats,
    foodItems,
  };
  localStorage.setItem("bookingData", JSON.stringify(bookingData));

  // Update the payment tab with formatted booking details
  updatePaymentTab(bookingData);

  // Set booking confirmation status to true
  isBookingConfirmed = true;

  // Switch to the Payment tab
  const tabs = document.querySelectorAll(".buy-tickets-tab__item");
  const contents = document.querySelectorAll(".buy-tickets-tab__content");

  tabs.forEach((tab) => tab.classList.remove("buy-tickets-tab__item--active"));
  contents.forEach((content) =>
    content.classList.remove("buy-tickets-tab__content--active")
  );

  tabs[1].classList.add("buy-tickets-tab__item--active"); // Assuming Payment tab is the second tab
  contents[1].classList.add("buy-tickets-tab__content--active");

  // Start the countdown in the payment tab
  startCountdown(); // Call the startCountdown function to initiate the timer
}

function startCountdown() {
  if (countdownStarted) return;

  let timeLeft = countdownDuration;
  const countdownDisplay = document.querySelector("#countdown"); // Use the countdown element in the payment tab
  countdownDisplay.textContent = formatTime(timeLeft);

  timer = setInterval(() => {
    timeLeft -= 1000;
    countdownDisplay.textContent = formatTime(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! Reloading...");
      location.reload();
    }
  }, 1000);

  countdownStarted = true;
}

function resetCountdown() {
  clearInterval(timer);
  countdownStarted = false;
}
