const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const modeSelect = document.getElementById("mode-select");
const durationSelect = document.getElementById("duration-select");
const customInputs = document.getElementById("custom-time-inputs");
const customMinutes = document.getElementById("custom-minutes");
const customSeconds = document.getElementById("custom-seconds");
const setCustomTimeBtn = document.getElementById("set-custom-time");

let timerMode = "pomodoro";
let duration = 25 * 60;
let breakDuration = 5 * 60;
let isRunning = false;
let interval;
let endTime;
let remainingTime = duration;
let stopwatchStart = null;

const bell = new Audio("assets/bell.mp3");

function formatTime(unit) {
  return unit.toString().padStart(2, "0");
}

function updateDisplay(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  timerDisplay.innerHTML = `
    <div class="flip-unit">${formatTime(hours)}</div>
    <div class="flip-unit">${formatTime(minutes)}</div>
    <div class="flip-unit">${formatTime(seconds)}</div>
  `;
}

function tick() {
  const now = Date.now();

  if (timerMode === "stopwatch") {
    const elapsed = Math.floor((now - stopwatchStart) / 1000);
    updateDisplay(elapsed);
    saveState(elapsed);
    return;
  }

  remainingTime = Math.max(0, Math.floor((endTime - now) / 1000));
  updateDisplay(remainingTime);

  if (remainingTime <= 0) {
    clearInterval(interval);
    bell.play();
    isRunning = false;
    localStorage.removeItem("pomodoroState");

    if (timerMode === "pomodoro") {
      duration = breakDuration;
      remainingTime = duration;
      updateDisplay(remainingTime);
    }
  } else {
    saveState();
  }
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  if (timerMode === "stopwatch") {
    stopwatchStart = Date.now() - (remainingTime * 1000 || 0);
    interval = setInterval(tick, 1000);
    return;
  }

  const now = Date.now();
  endTime = now + remainingTime * 1000;
  interval = setInterval(tick, 1000);
  tick();
}

function pauseTimer() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(interval);

  if (timerMode === "stopwatch") {
    remainingTime = Math.floor((Date.now() - stopwatchStart) / 1000);
  } else {
    remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  }

  saveState();
}

function resetTimer() {
  isRunning = false;
  clearInterval(interval);

  if (timerMode === "pomodoro") {
    remainingTime = duration;
  } else if (timerMode === "timer") {
    remainingTime = duration;
  } else {
    remainingTime = 0;
  }

  updateDisplay(remainingTime);
  localStorage.removeItem("pomodoroState");
}

function saveState(elapsed = null) {
  const state = {
    remainingTime: timerMode === "stopwatch" ? elapsed : remainingTime,
    isRunning,
    endTime,
    mode: timerMode,
    duration,
    breakDuration,
    stopwatchStart: stopwatchStart || null,
  };
  localStorage.setItem("pomodoroState", JSON.stringify(state));
}

function loadState() {
  const state = JSON.parse(localStorage.getItem("pomodoroState"));
  if (state) {
    timerMode = state.mode;
    duration = state.duration;
    breakDuration = state.breakDuration;
    remainingTime = state.remainingTime;
    isRunning = state.isRunning;
    endTime = state.endTime;
    stopwatchStart = state.stopwatchStart;

    if (timerMode === "pomodoro") {
      durationSelect.style.display = "inline";
      customInputs.style.display = "none";
    } else if (timerMode === "timer") {
      durationSelect.style.display = "none";
      customInputs.style.display = "flex";
    } else {
      durationSelect.style.display = "none";
      customInputs.style.display = "none";
    }

    modeSelect.value = timerMode;

    if (isRunning) {
      startTimer();
    } else {
      updateDisplay(remainingTime);
    }
  } else {
    updateDisplay(duration);
  }
}

modeSelect.addEventListener("change", () => {
  timerMode = modeSelect.value;
  resetTimer();

  if (timerMode === "pomodoro") {
    duration = 25 * 60;
    breakDuration = 5 * 60;
    durationSelect.style.display = "inline";
    customInputs.style.display = "none";
  } else if (timerMode === "timer") {
    duration = 30 * 60; // default timer fallback
    customInputs.style.display = "flex";
    durationSelect.style.display = "none";
  } else {
    duration = 0;
    durationSelect.style.display = "none";
    customInputs.style.display = "none";
  }

  remainingTime = duration;
  updateDisplay(remainingTime);
  saveState();
});

durationSelect.addEventListener("change", () => {
  const val = durationSelect.value;

  if (val === "25-5") {
    duration = 25 * 60;
    breakDuration = 5 * 60;
  } else if (val === "40-10") {
    duration = 40 * 60;
    breakDuration = 10 * 60;
  } else if (val === "50-15") {
    duration = 50 * 60;
    breakDuration = 15 * 60;
  }

  resetTimer();
});

setCustomTimeBtn.addEventListener("click", () => {
  const min = parseInt(customMinutes.value) || 0;
  const sec = parseInt(customSeconds.value) || 0;
  duration = (min * 60) + sec;
  remainingTime = duration;
  updateDisplay(remainingTime);
  saveState();
});

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Load on page ready
loadState();