setTimeout(() => {
  document.querySelector(".stars").style.display = "none";
}, 5000);
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
/////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  const addSeatButton = document.getElementById("addSeatButton");
  const seatContainer = document.getElementById("seatContainer");
  const seatTable = document.createElement("div");
  seatTable.className = "seat-table row";
  seatTable.style.display = "grid";
  seatTable.style.gridTemplateColumns = "repeat(12, 1fr)";
  seatTable.style.gridTemplateRows = "repeat(7, 1fr)";
  seatContainer.appendChild(seatTable);

  let seatIndex = 1;

  function generateSeatID(row, seatNumber) {
    let rowLetter = "";
    while (row > 0) {
      let mod = (row - 1) % 26;
      rowLetter = String.fromCharCode(65 + mod) + rowLetter;
      row = Math.floor((row - 1) / 26);
    }
    return `${rowLetter}${seatNumber}`;
  }

  function createSeatElement(row, seatNumber) {
    const seatDiv = document.createElement("div");
    seatDiv.className = "seat col-1";
    seatDiv.innerHTML = `
      <img
        src="/assets/icon/seat.png"
        class="seat__chair"
        alt="Seat"
      />
      ${generateSeatID(row, seatNumber)}
    `;
    seatDiv.style.gridColumn = seatNumber;
    seatDiv.style.gridRow = row;
    seatDiv.setAttribute("data-seat-id", generateSeatID(row, seatNumber));
    seatDiv.onclick = function () {
      alert(`Seat ${generateSeatID(row, seatNumber)} selected!`);
    };
    return seatDiv;
  }

  function createSeatInput(seatIndex) {
    const newSeatInput = document.createElement("div");
    newSeatInput.classList.add("seat-input-group");
    newSeatInput.innerHTML = `
      <label for="row_${seatIndex}">Row:</label>
      <input type="number" id="row_${seatIndex}" placeholder="Enter row (1-7)" min="1" max="7">
      <label for="seat_number_${seatIndex}">Seat Number:</label>
      <input type="number" id="seat_number_${seatIndex}" placeholder="Enter seat number (1-12)" min="1" max="12">
      <label for="seat_price_${seatIndex}">Seat Price:</label>
      <input type="number" id="seat_price_${seatIndex}" placeholder="Enter seat price">
      <button type="button" class="btn-save-seat">Save</button>
      <button type="button" class="btn-remove-seat">Remove</button>
    `;
    return newSeatInput;
  }

  addSeatButton.addEventListener("click", function () {
    const newSeat = createSeatInput(seatIndex);
    seatContainer.appendChild(newSeat);
    const seatNumberInput = newSeat.querySelector(`#seat_number_${seatIndex}`);
    const rowInput = newSeat.querySelector(`#row_${seatIndex}`);
    const seatPriceInput = newSeat.querySelector(`#seat_price_${seatIndex}`);

    seatIndex++;

    const removeButton = newSeat.querySelector(".btn-remove-seat");
    removeButton.addEventListener("click", function () {
      const row = rowInput.value.trim();
      const seatNumber = seatNumberInput.value.trim();
      const seatPrice = seatPriceInput.value.trim();
      const seatID = generateSeatID(row, seatNumber);

      const seatElement = seatTable.querySelector(`[data-seat-id="${seatID}"]`);
      if (seatElement) seatElement.remove();
      newSeat.remove();
    });

    const saveButton = newSeat.querySelector(".btn-save-seat");
    saveButton.addEventListener("click", function () {
      const row = rowInput.value.trim();
      const seatNumber = seatNumberInput.value.trim();
      const seatPrice = seatPriceInput.value.trim();

      if (
        row < 1 ||
        row > 7 ||
        seatNumber < 1 ||
        seatNumber > 12 ||
        !seatPrice
      ) {
        alert("Please fill in all the fields correctly.");
        return;
      }

      const seatID = generateSeatID(row, seatNumber);
      const existingSeat = seatTable.querySelector(
        `[data-seat-id="${seatID}"]`
      );
      if (existingSeat) {
        alert("This seat already exists.");
      } else {
        const seatElement = createSeatElement(row, seatNumber);
        seatTable.appendChild(seatElement);
        rowInput.disabled = true;
        seatNumberInput.disabled = true;
        seatPriceInput.disabled = true;
        saveButton.disabled = true;

        // Add the seat data to the form
        addSeatDataToForm(row, seatNumber, seatPrice);
      }
    });
  });

  // Function to add seat data to the form
  function addSeatDataToForm(row, seatNumber, seatPrice) {
    const form = document.getElementById("FormAction");

    // Create hidden inputs for seat data
    const seatData = document.createElement("input");
    seatData.type = "hidden";
    seatData.name = "seats[]";
    seatData.value = JSON.stringify({
      row,
      seat_number: seatNumber,
      seat_price: seatPrice,
    });

    form.appendChild(seatData);
  }
});
