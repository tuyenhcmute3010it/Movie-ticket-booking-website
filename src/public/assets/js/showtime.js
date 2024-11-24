// document.addEventListener("DOMContentLoaded", function () {
//   const tabsContainer = document.querySelector(".showtime__tabs");
//   const movieListContainer = document.getElementById("movie-list");
//   const noSessionsMessageContainer = document.getElementById(
//     "no-sessions-message"
//   );
//   const today = new Date();
//   let currentDayOffset = 0;

//   // Function to format the date
//   function formatDate(date) {
//     const options = { weekday: "short", day: "2-digit", month: "short" };
//     return date.toLocaleDateString("en-US", options);
//   }

//   // Function to create tabs for dates
//   function createTabs() {
//     tabsContainer
//       .querySelectorAll(".showtime__tab-button:not(.nav-button)")
//       .forEach((button) => button.remove());
//     const selectedDateString = localStorage.getItem("selectedDate");
//     const selectedDate = selectedDateString
//       ? new Date(selectedDateString)
//       : null;

//     for (let i = 0; i < 7; i++) {
//       const futureDate = new Date();
//       futureDate.setDate(today.getDate() + currentDayOffset + i);

//       const tabButton = document.createElement("button");
//       tabButton.classList.add("showtime__tab-button");
//       tabButton.textContent = formatDate(futureDate);
//       tabButton.dataset.day = i;

//       if (
//         selectedDate &&
//         futureDate.toDateString() === selectedDate.toDateString()
//       ) {
//         tabButton.classList.add("active");
//         tabButton.style.backgroundColor = "yellow"; // Màu cho tab được chọn
//       }

//       tabsContainer.appendChild(tabButton);
//     }
//   }

//   // Function to set the active tab
//   function setActiveTab(dayIndex) {
//     const tabButtons = tabsContainer.querySelectorAll(".showtime__tab-button");
//     tabButtons.forEach((button, index) => {
//       button.classList.remove("active");
//       button.style.backgroundColor = ""; // Reset màu
//       if (index === dayIndex) {
//         button.classList.add("active");
//         button.style.backgroundColor = "yellow"; // Màu cho tab hiện tại
//         button.focus();
//       }
//     });
//   }

//   const timeMovies = [
//     {
//       title: "A WILD ROBOT",
//       subtitle: "(Sub: English Vietnamese)",
//       description: "Science Fiction",
//       showtimes: ["07:00", "09:00", "10:00", "16:00", "18:45", "21:25"],
//     },
//   ];

//   // Function to update the movie list
//   function updateMovieList(dayOffset) {
//     movieListContainer.innerHTML = "";
//     noSessionsMessageContainer.innerHTML = "";

//     const selectedDate = new Date();
//     selectedDate.setDate(today.getDate() + currentDayOffset + dayOffset);
//     const selectedTime = localStorage.getItem("selectedTime");

//     const twoWeeksFromNow = new Date();
//     twoWeeksFromNow.setDate(today.getDate() + 6);

//     // Get the current time for comparison
//     const now = new Date();
//     const currentHour = now.getHours();
//     const currentMinute = now.getMinutes();
//     const currentTimeInMinutes = currentHour * 60 + currentMinute;

//     if (selectedDate > twoWeeksFromNow) {
//       displayNoSessionsMessage(selectedDate);
//       return;
//     }

//     timeMovies.forEach((movie) => {
//       const movieBlock = document.createElement("div");
//       movieBlock.classList.add("showtime__movie-block");

//       const titleElem = document.createElement("h3");
//       titleElem.classList.add("movie-title");
//       titleElem.textContent = movie.title;
//       movieBlock.appendChild(titleElem);

//       const subtitleElem = document.createElement("div");
//       subtitleElem.classList.add("movie-subtitle");
//       subtitleElem.textContent = movie.subtitle;
//       movieBlock.appendChild(subtitleElem);

//       const descriptionElem = document.createElement("div");
//       descriptionElem.classList.add("movie-description");
//       descriptionElem.textContent = movie.description;
//       movieBlock.appendChild(descriptionElem);

//       const showtimesElem = document.createElement("div");
//       showtimesElem.classList.add("showtime__showtimes");

//       movie.showtimes.forEach((time) => {
//         const [hour, minute] = time.split(":").map(Number);
//         const timeInMinutes = hour * 60 + minute;

//         const timeButton = document.createElement("button");
//         timeButton.classList.add("showtime-button");
//         timeButton.textContent = time;

//         // Check if the showtime is in the past
//         if (
//           selectedDate.toDateString() === now.toDateString() &&
//           timeInMinutes < currentTimeInMinutes
//         ) {
//           timeButton.disabled = true; // Disable the button
//           timeButton.style.backgroundColor = "rgba(0, 0, 0, 0.1)"; // Style for disabled button
//           timeButton.style.cursor = "not-allowed";
//         } else {
//           // Set event listener for showtime button
//           timeButton.addEventListener("click", () => {
//             const formattedDate = formatDate(selectedDate);
//             localStorage.setItem("selectedDate", selectedDate.toISOString());
//             localStorage.setItem("selectedTime", time);

//             // Reset previous selected showtime button style and class
//             const previouslySelectedButton = movieListContainer.querySelector(
//               ".showtime-button.active"
//             );
//             if (previouslySelectedButton) {
//               previouslySelectedButton.style.backgroundColor = ""; // Reset style
//               previouslySelectedButton.classList.remove("active"); // Remove active class
//             }

//             // Set the current button as selected
//             timeButton.style.backgroundColor = "pink";
//             timeButton.classList.add("active");

//             // Redirect to buy tickets page
//             const url = `buy-tickets.html?movie=${encodeURIComponent(
//               movie.title
//             )}&date=${encodeURIComponent(
//               formattedDate
//             )}&time=${encodeURIComponent(time)}`;
//             window.location.href = url;
//           });
//         }

//         // Check if this time was selected previously
//         if (
//           selectedTime === time &&
//           selectedDate.toDateString() ===
//             new Date(localStorage.getItem("selectedDate")).toDateString()
//         ) {
//           timeButton.style.backgroundColor = "pink"; // Highlight selected time
//           timeButton.classList.add("active"); // Add active class
//         }

//         showtimesElem.appendChild(timeButton);
//       });

//       movieBlock.appendChild(showtimesElem);
//       movieListContainer.appendChild(movieBlock);
//     });

//     if (
//       movieListContainer.childElementCount === 0 &&
//       selectedDate > twoWeeksFromNow
//     ) {
//       displayNoSessionsMessage(selectedDate);
//     }
//   }

//   function displayNoSessionsMessage(date) {
//     const formattedDate = formatDate(date);
//     noSessionsMessageContainer.innerHTML = `
//       <p>Session times are still to be confirmed for ${formattedDate} at Movin. Every Day we refresh and load new programming for the following week so we recommend checking back on a morning Day for the best results of the upcoming weekend. Thank you.</p>
//     `;
//   }

//   // Event listener for tab clicks
//   tabsContainer.addEventListener("click", function (event) {
//     if (event.target.classList.contains("showtime__tab-button")) {
//       const dayOffset = parseInt(event.target.dataset.day, 10);
//       setActiveTab(dayOffset);
//       updateMovieList(dayOffset);
//     }
//   });

//   document.getElementById("prevButton").addEventListener("click", function () {
//     currentDayOffset = Math.max(currentDayOffset - 7, 0);
//     createTabs();
//   });

//   document.getElementById("nextButton").addEventListener("click", function () {
//     if (currentDayOffset < 30) {
//       currentDayOffset += 7;
//       createTabs();
//     }
//   });

//   // Initialize
//   createTabs();
//   updateMovieList(0);

//   // Automatically select the date when the page reloads
//   const savedDate = localStorage.getItem("selectedDate");
//   if (savedDate) {
//     const savedDateObject = new Date(savedDate);
//     // Tính toán ngày chênh lệch mà không sử dụng currentDayOffset
//     const dayDiff = Math.floor(
//       (savedDateObject - today) / (1000 * 60 * 60 * 24)
//     );
//     const dayOffset = dayDiff + 1; // Không cộng currentDayOffset
//     setActiveTab(dayOffset);
//     updateMovieList(dayOffset);
//   }
// });
///////////////////////////////

let showtimeSelected = false;

window.addEventListener("template-loaded", () => {
  const tabsSelector = "buy-tickets-tab__item";
  const contentsSelector = "buy-tickets-tab__content";

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

        showtimeSelected = true; // Set to true when a showtime is selected
        toggleSeatAndFoodSelection();
      };
    });
  });
});

function toggleSeatAndFoodSelection() {
  const seats = document.querySelectorAll(".seat");
  const foodCheckboxes = document.querySelectorAll(".food-checkbox");

  seats.forEach((seat) => {
    seat.classList.toggle("disabled", !showtimeSelected);
    seat.onclick = showtimeSelected ? () => selectSeat(seat) : null;
  });

  foodCheckboxes.forEach((checkbox) => {
    checkbox.disabled = !showtimeSelected;
  });
}
///////////////////////////////

//ngon
// Get movie data from the DOM (returns an object with title, subtitle, description, and empty showtimes)
function getMovieDataFromDOM(dayIndex) {
  const movieItem = document.querySelector(".movie-item");
  const title = movieItem.querySelector(".movie-title").textContent.trim();
  const subtitle = movieItem
    .querySelector(".movie-subtitle")
    .textContent.trim();
  const description = movieItem
    .querySelector(".movie-description")
    .textContent.trim();

  return {
    title,
    subtitle,
    description,
    showtimes: [], // Empty showtimes to be added later
  };
}

// Convert to GMT+7 timezone (UTC + 7 hours)
function convertToGMT7(date) {
  const offset = 7; // GMT+7
  const utcDate = new Date(date); // Ensure the date is in UTC
  utcDate.setHours(utcDate.getHours() + offset); // Add 7 hours to UTC to get GMT+7
  return utcDate;
}

// Initialize movie data for 14 days
const timeMovies = Array.from({ length: 14 }, (_, dayIndex) => {
  const movie = getMovieDataFromDOM(dayIndex); // Get movie data for each day
  return [movie]; // Wrap movie in an array
});

// Global variable to track the active tab (current day)
let activeTabIndex = 0;

// Format date as "Day, Month Date"
function formatDate(date) {
  const options = { weekday: "short", month: "short", day: "numeric" };
  const localDate = convertToGMT7(date); // Convert to GMT+7 for correct display
  return localDate.toLocaleDateString("en-US", options);
}

// Create tabs for the next 14 days
function createTabs() {
  const tabsContainer = document.querySelector(".showtime__tabs");

  for (let i = 0; i < 14; i++) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + i);

    const tabButton = document.createElement("button");
    tabButton.classList.add("showtime__tab-button");
    tabButton.textContent = formatDate(futureDate);
    tabButton.dataset.day = futureDate.toISOString().split("T")[0]; // Store day in ISO format

    if (i === 0) {
      tabButton.classList.add("active");
    }

    tabButton.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default action
      setActiveTab(i); // Set the active tab to the clicked day
    });

    tabsContainer.appendChild(tabButton);
  }
}

// Set the active tab (highlight the selected tab and show movies for that day)
function setActiveTab(dayIndex) {
  activeTabIndex = dayIndex;
  const tabButtons = document.querySelectorAll(".showtime__tab-button");
  tabButtons.forEach((button, index) => {
    button.classList.toggle("active", index === dayIndex);
  });
  showMoviesForDay(dayIndex); // Display movies for the selected day
}

// Display movies for the selected day
function showMoviesForDay(dayIndex) {
  const movieListContainer = document.getElementById("movie-list");
  const noSessionsMessage = document.getElementById("no-sessions-message");

  const moviesForDay = timeMovies[dayIndex];
  movieListContainer.innerHTML = "";
  noSessionsMessage.textContent = "";

  if (moviesForDay.length === 0 || !moviesForDay[0].showtimes.length) {
    noSessionsMessage.textContent = "No sessions available for this day.";
  } else {
    moviesForDay.forEach((movie) => {
      const movieElement = document.createElement("div");
      movieElement.classList.add("movie-item");
      movieElement.innerHTML = `
        <h3>${movie.title}</h3>
        <p>${movie.subtitle}</p>
        <p>${movie.description}</p>
        <ul>
          ${movie.showtimes
            .map(
              (showtime) => `
                <li>
                  <button class="time-button">${showtime.time}</button>
                  <ul>
                    ${showtime.screens
                      .map((screen) => `<li>Screen: ${screen}</li>`)
                      .join("")}
                  </ul>
                </li>`
            )
            .join("")}
        </ul>
      `;
      movieListContainer.appendChild(movieElement);
    });
  }
}

// Check for conflicts in showtimes (same screen and within 2 hours)
function checkForConflicts(newTime, newScreen, dayIndex) {
  const newShowtimeDateTime = convertToGMT7(new Date(newTime));

  const existingShowtimes = timeMovies[dayIndex][0].showtimes;

  for (const existingShowtime of existingShowtimes) {
    const existingShowtimeDateTime = convertToGMT7(
      new Date(existingShowtime.time)
    );

    if (
      existingShowtime.screens.includes(newScreen) &&
      Math.abs(newShowtimeDateTime - existingShowtimeDateTime) <
        2 * 60 * 60 * 1000
    ) {
      return false; // Conflict found
    }
  }

  return true; // No conflict
}

// Handle adding a new showtime to a movie
document
  .getElementById("addShowtimeButton")
  .addEventListener("click", function () {
    const newShowtimeTime = document
      .getElementById("new-showtime")
      .value.trim();
    const selectedScreen = document.getElementById("screenDropdown").value;
    const selectedDay = document.querySelector(".showtime__tab-button.active")
      ?.dataset.day;

    // Validate inputs
    if (!/^\d{2}:\d{2}$/.test(newShowtimeTime)) {
      alert("Please enter the time in HH:mm format.");
      return;
    }

    if (!selectedDay) {
      alert("Please select a valid day.");
      return;
    }

    // Create a new Date object for the selected day
    const futureDate = new Date(selectedDay);
    const [hours, minutes] = newShowtimeTime.split(":").map(Number);
    futureDate.setHours(hours, minutes, 0, 0);

    // Convert to GMT+7 by adjusting the date to UTC+7
    const newShowtime = convertToGMT7(futureDate).toISOString();

    const existingShowtimes = timeMovies[activeTabIndex][0].showtimes;

    // Check for conflicts
    if (checkForConflicts(newShowtime, selectedScreen, activeTabIndex)) {
      const existingShowtime = existingShowtimes.find(
        (showtime) => showtime.time === newShowtime
      );

      if (existingShowtime) {
        // Add the screen to the existing showtime
        if (!existingShowtime.screens.includes(selectedScreen)) {
          existingShowtime.screens.push(selectedScreen);
        }
      } else {
        // Add a new showtime
        existingShowtimes.push({
          time: newShowtime,
          screens: [selectedScreen],
        });
      }

      // Update data and UI
      updateShowtimesData();
      showMoviesForDay(activeTabIndex);
    } else {
      alert(
        "Cannot add showtime! The showtime conflicts with another showtime on the same screen within the duration."
      );
    }
  });

// Update hidden input field with the current showtimes data
function updateShowtimesData() {
  const showtimesData = timeMovies.map((day) =>
    day.map((movie) => ({
      title: movie.title,
      subtitle: movie.subtitle,
      description: movie.description,
      showtimes: movie.showtimes,
    }))
  );

  document.getElementById("showtimesData").value = JSON.stringify(
    showtimesData,
    null,
    2
  ); // Pretty print for debugging
}

// Initialize the interface (create tabs and show movies for the first day)
createTabs();
showMoviesForDay(0);
