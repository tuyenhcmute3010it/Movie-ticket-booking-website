//===================================================================================
window.addEventListener("template-loaded", () => {
  initializeTabs();
  initializeSeatSelection();
  initializeFoodSelection();
  updateBookingInfo(); // To display initial booking info if available
});

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
    const quantity = parseInt(item.querySelector(".food-quantity").textContent);
    const price = parseFloat(item.dataset.price) || 0;
    foodCost += quantity * price;
  });

  const totalCost = seatCost + foodCost;
  document.querySelector(
    "#totalAmount"
  ).textContent = `Total: ${totalCost.toLocaleString()} VND`;

  // Chỉ hiển thị thông tin thanh toán nếu có ghế được chọn
  if (selectedSeats > 0) {
    displayBookingDetails();
    startCountdown();
  } else {
    hideBookingDetails();
    resetCountdown();
  }
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
      Movie: ${movieTitle}<br>
      Date: ${formattedDate}<br>
      Time: ${selectedTime || "Not selected"}<br>
      Seats: ${selectedSeats}<br>
      Food: ${foodItems}<br>
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
    .filter(Boolean);

  alert(`Seats: ${selectedSeats.join(", ")}\nFood: ${foodItems.join(", ")}`);
}
