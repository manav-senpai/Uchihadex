// === calendar.js ===

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  
  const monthSelect = document.getElementById("month-select");
  const yearSelect = document.getElementById("year-select");
  const calendarGrid = document.getElementById("calendar-grid");
  
  // Load notes from localStorage
  const notes = JSON.parse(localStorage.getItem("calendarNotes") || '{}');
  const moods = JSON.parse(localStorage.getItem("calendarMoods") || '{}');
  
  function populateDropdowns() {
    monthNames.forEach((month, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = month;
      if (index === currentMonth) option.selected = true;
      monthSelect.appendChild(option);
    });
  
    for (let y = currentYear - 10; y <= currentYear + 10; y++) {
      const option = document.createElement("option");
      option.value = y;
      option.textContent = y;
      if (y === currentYear) option.selected = true;
      yearSelect.appendChild(option);
    }
  }
  
  function saveNotes() {
    localStorage.setItem("calendarNotes", JSON.stringify(notes));
  }
  
  function saveMoods() {
    localStorage.setItem("calendarMoods", JSON.stringify(moods));
  }
  
  function renderCalendar(month, year) {
    calendarGrid.innerHTML = "";
  
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    weekdays.forEach((day, i) => {
      const dayLabel = document.createElement("div");
      dayLabel.classList.add("day-label");
      if (i === 0) dayLabel.classList.add("sunday");
      if (i === 6) dayLabel.classList.add("saturday");
      dayLabel.textContent = day;
      calendarGrid.appendChild(dayLabel);
    });
  
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      empty.classList.add("day-card");
      empty.style.visibility = "hidden";
      calendarGrid.appendChild(empty);
    }
  
    for (let day = 1; day <= daysInMonth; day++) {
      const dateCard = document.createElement("div");
      dateCard.classList.add("day-card");
  
      const dateObj = new Date(year, month, day);
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const dayOfWeek = dateObj.getDay();
      const noteKey = `${year}-${month}-${day}`;
  
      if (isToday) {
        dateCard.classList.add("today");
      }
      if (dayOfWeek === 0) {
        dateCard.classList.add("sunday-number");
      }
      if (dayOfWeek === 6) {
        dateCard.classList.add("saturday-number");
      }
  
      const dateNum = document.createElement("div");
      dateNum.classList.add("date-number");
      dateNum.textContent = day;
  
      const noteInput = document.createElement("textarea");
      noteInput.placeholder = "Your notes...";
      noteInput.value = notes[noteKey] || "";
  
      noteInput.addEventListener("click", (e) => e.stopPropagation());
      noteInput.addEventListener("input", () => {
        notes[noteKey] = noteInput.value;
        saveNotes();
      });
  
      const emojiContainer = document.createElement("div");
      emojiContainer.classList.add("emoji-container");
      emojiContainer.style.display = "flex";
      emojiContainer.style.justifyContent = "space-evenly";
      emojiContainer.style.marginTop = "5px";
  
      ["😀", "😐", "😴"].forEach(emoji => {
        const emojiBtn = document.createElement("button");
        emojiBtn.textContent = emoji;
        emojiBtn.classList.add("emoji-btn");
        emojiBtn.style.fontSize = "1.4rem";
        emojiBtn.style.flex = "1";
        emojiBtn.style.margin = "0 2px";
        emojiBtn.style.opacity = "0.5";
  
        if (moods[noteKey] === emoji) {
          emojiBtn.style.opacity = "1";
          emojiBtn.style.transform = "scale(1.2)";
        }
  
        emojiBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          moods[noteKey] = emoji;
          saveMoods();
          renderCalendar(currentMonth, currentYear); // Rerender to reflect selection
        });
  
        emojiContainer.appendChild(emojiBtn);
      });
  
      dateCard.appendChild(dateNum);
      dateCard.appendChild(noteInput);
      dateCard.appendChild(emojiContainer);
  
      dateCard.addEventListener("click", () => {
        dateCard.classList.toggle("active");
      });
  
      calendarGrid.appendChild(dateCard);
    }
  }
  
  monthSelect.addEventListener("change", () => {
    currentMonth = parseInt(monthSelect.value);
    renderCalendar(currentMonth, currentYear);
  });
  
  yearSelect.addEventListener("change", () => {
    currentYear = parseInt(yearSelect.value);
    renderCalendar(currentMonth, currentYear);
  });
  
  populateDropdowns();
  renderCalendar(currentMonth, currentYear);