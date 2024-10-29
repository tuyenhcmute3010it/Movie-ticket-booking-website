document.addEventListener("DOMContentLoaded", function () {
  const tabsContainer = document.querySelector(".showtime__tabs");
  const movieListContainer = document.getElementById("movie-list");
  const noSessionsMessageContainer = document.getElementById(
    "no-sessions-message"
  );
  const today = new Date();
  let currentDayOffset = 0;

  // Function to format the date
  function formatDate(date) {
    const options = { weekday: "short", day: "2-digit", month: "short" };
    return date.toLocaleDateString("en-US", options);
  }

  // Function to create tabs for dates
  function createTabs() {
    tabsContainer
      .querySelectorAll(".showtime__tab-button:not(.nav-button)")
      .forEach((button) => button.remove());
    const selectedDateString = localStorage.getItem("selectedDate");
    const selectedDate = selectedDateString
      ? new Date(selectedDateString)
      : null;

    for (let i = 0; i < 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + currentDayOffset + i);

      const tabButton = document.createElement("button");
      tabButton.classList.add("showtime__tab-button");
      tabButton.textContent = formatDate(futureDate);
      tabButton.dataset.day = i;

      if (
        selectedDate &&
        futureDate.toDateString() === selectedDate.toDateString()
      ) {
        tabButton.classList.add("active");
        tabButton.style.backgroundColor = "yellow"; // Màu cho tab được chọn
      }

      tabsContainer.appendChild(tabButton);
    }
  }

  // Function to set the active tab
  function setActiveTab(dayIndex) {
    const tabButtons = tabsContainer.querySelectorAll(".showtime__tab-button");
    tabButtons.forEach((button, index) => {
      button.classList.remove("active");
      button.style.backgroundColor = ""; // Reset màu
      if (index === dayIndex) {
        button.classList.add("active");
        button.style.backgroundColor = "yellow"; // Màu cho tab hiện tại
        button.focus();
      }
    });
  }

  const timeMovies = [
    {
      title: "A WILD ROBOT",
      subtitle: "(Sub: English Vietnamese)",
      description: "Science Fiction",
      showtimes: ["07:00", "09:00", "10:00", "16:00", "18:45", "21:25"],
    },
  ];

  // Function to update the movie list
  function updateMovieList(dayOffset) {
    movieListContainer.innerHTML = "";
    noSessionsMessageContainer.innerHTML = "";

    const selectedDate = new Date();
    selectedDate.setDate(today.getDate() + currentDayOffset + dayOffset);
    const selectedTime = localStorage.getItem("selectedTime");

    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 6);

    // Get the current time for comparison
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    if (selectedDate > twoWeeksFromNow) {
      displayNoSessionsMessage(selectedDate);
      return;
    }

    timeMovies.forEach((movie) => {
      const movieBlock = document.createElement("div");
      movieBlock.classList.add("showtime__movie-block");

      const titleElem = document.createElement("h3");
      titleElem.classList.add("movie-title");
      titleElem.textContent = movie.title;
      movieBlock.appendChild(titleElem);

      const subtitleElem = document.createElement("div");
      subtitleElem.classList.add("movie-subtitle");
      subtitleElem.textContent = movie.subtitle;
      movieBlock.appendChild(subtitleElem);

      const descriptionElem = document.createElement("div");
      descriptionElem.classList.add("movie-description");
      descriptionElem.textContent = movie.description;
      movieBlock.appendChild(descriptionElem);

      const showtimesElem = document.createElement("div");
      showtimesElem.classList.add("showtime__showtimes");

      movie.showtimes.forEach((time) => {
        const [hour, minute] = time.split(":").map(Number);
        const timeInMinutes = hour * 60 + minute;

        const timeButton = document.createElement("button");
        timeButton.classList.add("showtime-button");
        timeButton.textContent = time;

        // Check if the showtime is in the past
        if (
          selectedDate.toDateString() === now.toDateString() &&
          timeInMinutes < currentTimeInMinutes
        ) {
          timeButton.disabled = true; // Disable the button
          timeButton.style.backgroundColor = "rgba(0, 0, 0, 0.1)"; // Style for disabled button
          timeButton.style.cursor = "not-allowed";
        } else {
          // Set event listener for showtime button
          timeButton.addEventListener("click", () => {
            const formattedDate = formatDate(selectedDate);
            localStorage.setItem("selectedDate", selectedDate.toISOString());
            localStorage.setItem("selectedTime", time);

            // Reset previous selected showtime button style and class
            const previouslySelectedButton = movieListContainer.querySelector(
              ".showtime-button.active"
            );
            if (previouslySelectedButton) {
              previouslySelectedButton.style.backgroundColor = ""; // Reset style
              previouslySelectedButton.classList.remove("active"); // Remove active class
            }

            // Set the current button as selected
            timeButton.style.backgroundColor = "pink";
            timeButton.classList.add("active");

            // Redirect to buy tickets page
            const url = `buy-tickets.html?movie=${encodeURIComponent(
              movie.title
            )}&date=${encodeURIComponent(
              formattedDate
            )}&time=${encodeURIComponent(time)}`;
            window.location.href = url;
          });
        }

        // Check if this time was selected previously
        if (
          selectedTime === time &&
          selectedDate.toDateString() ===
            new Date(localStorage.getItem("selectedDate")).toDateString()
        ) {
          timeButton.style.backgroundColor = "pink"; // Highlight selected time
          timeButton.classList.add("active"); // Add active class
        }

        showtimesElem.appendChild(timeButton);
      });

      movieBlock.appendChild(showtimesElem);
      movieListContainer.appendChild(movieBlock);
    });

    if (
      movieListContainer.childElementCount === 0 &&
      selectedDate > twoWeeksFromNow
    ) {
      displayNoSessionsMessage(selectedDate);
    }
  }

  function displayNoSessionsMessage(date) {
    const formattedDate = formatDate(date);
    noSessionsMessageContainer.innerHTML = `
      <p>Session times are still to be confirmed for ${formattedDate} at Movin. Every Day we refresh and load new programming for the following week so we recommend checking back on a morning Day for the best results of the upcoming weekend. Thank you.</p>
    `;
  }

  // Event listener for tab clicks
  tabsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("showtime__tab-button")) {
      const dayOffset = parseInt(event.target.dataset.day, 10);
      setActiveTab(dayOffset);
      updateMovieList(dayOffset);
    }
  });

  document.getElementById("prevButton").addEventListener("click", function () {
    currentDayOffset = Math.max(currentDayOffset - 7, 0);
    createTabs();
  });

  document.getElementById("nextButton").addEventListener("click", function () {
    if (currentDayOffset < 30) {
      currentDayOffset += 7;
      createTabs();
    }
  });

  // Initialize
  createTabs();
  updateMovieList(0);

  // Automatically select the date when the page reloads
  const savedDate = localStorage.getItem("selectedDate");
  if (savedDate) {
    const savedDateObject = new Date(savedDate);
    // Tính toán ngày chênh lệch mà không sử dụng currentDayOffset
    const dayDiff = Math.floor(
      (savedDateObject - today) / (1000 * 60 * 60 * 24)
    );
    const dayOffset = dayDiff + 1; // Không cộng currentDayOffset
    setActiveTab(dayOffset);
    updateMovieList(dayOffset);
  }
});
