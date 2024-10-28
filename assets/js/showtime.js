document.addEventListener("DOMContentLoaded", function () {
  const tabsContainer = document.querySelector(".showtime__tabs");
  const movieListContainer = document.getElementById("movie-list");
  const noSessionsMessageContainer = document.getElementById(
    "no-sessions-message"
  );
  const today = new Date();
  let currentDayOffset = 0;

  function formatDate(date) {
    const options = { weekday: "short", day: "2-digit", month: "short" };
    return date.toLocaleDateString("en-US", options);
  }

  function createTabs() {
    tabsContainer
      .querySelectorAll(".showtime__tab-button:not(.nav-button)")
      .forEach((button) => button.remove());

    for (let i = 0; i < 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + currentDayOffset + i);

      const tabButton = document.createElement("button");
      tabButton.classList.add("showtime__tab-button");
      tabButton.textContent = formatDate(futureDate);
      tabButton.dataset.day = i;
      tabsContainer.appendChild(tabButton);
    }

    setActiveTab(0);
  }

  function setActiveTab(dayIndex) {
    const tabButtons = tabsContainer.querySelectorAll(".showtime__tab-button");
    tabButtons.forEach((button, index) => {
      button.classList.remove("active");
      button.style.backgroundColor = "";
      if (index === dayIndex) {
        button.classList.add("active");
        button.style.backgroundColor = "yellow";
        button.focus();
      }
    });
  }

  const exampleMovies = [
    {
      title: "A WILD ROBOT",
      subtitle: "(Sub: English Vietnamese)",
      description: "Science Fiction",
      showtimes: ["07:00", "09:00", "10:00", "16:00", "18:45", "21:25"],
    },
  ];

  function updateMovieList(dayOffset) {
    movieListContainer.innerHTML = "";
    noSessionsMessageContainer.innerHTML = "";

    const selectedDate = new Date();
    selectedDate.setDate(today.getDate() + currentDayOffset + dayOffset);

    // Tính toán ngày hiện tại cộng thêm 14 ngày
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);

    // Nếu không có phim và ngày chọn sau 2 tuần tính từ ngày hiện tại, hiển thị thông báo
    if (selectedDate > twoWeeksFromNow) {
      displayNoSessionsMessage(selectedDate);
      return;
    }

    exampleMovies.forEach((movie) => {
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

      const currentDateTime = new Date();
      const currentHours = currentDateTime.getHours();
      const currentMinutes = currentDateTime.getMinutes();
      const currentTime = currentHours * 60 + currentMinutes;

      movie.showtimes.forEach((time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const showtimeInMinutes = hours * 60 + minutes;

        const timeButton = document.createElement("button");
        timeButton.classList.add("showtime-button");

        if (
          selectedDate.getDate() === today.getDate() &&
          showtimeInMinutes <= currentTime
        ) {
          timeButton.classList.add("past");
          timeButton.textContent = `${time} (Past)`;
          timeButton.disabled = true;
        } else {
          timeButton.textContent = time;
          timeButton.addEventListener("click", () => {
            alert(`Booking ticket for ${movie.title} at ${time}`);
          });
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
      <p>Session times are still to be confirmed for ${formattedDate} at Movin. Every Monday we refresh and load new programming for the following week so we recommend checking back on a Monday morning for the best results of the upcoming weekend. Thank you.</p>
    `;
  }

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
    setActiveTab(0);
    updateMovieList(0);
  });

  document.getElementById("nextButton").addEventListener("click", function () {
    if (currentDayOffset < 30) {
      currentDayOffset += 7;
      createTabs();
      setActiveTab(1);
      updateMovieList(0);
    }
  });

  createTabs();
  updateMovieList(0);
});
