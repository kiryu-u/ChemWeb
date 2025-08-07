/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-50px";
  }
  prevScrollpos = currentScrollPos;
}
window.addEventListener('scroll', function() {
  document.querySelectorAll('.parallax').forEach(function(parallax) {
    let scrolled = window.pageYOffset;
    parallax.style.backgroundPositionY = (scrolled * 0.5) + 'px';
  });
});
// Highlight the active link in the navbar based on the current page
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.navbar a').forEach(link => link.classList.remove('active'));
  if (window.location.hash === "#About") {
    const aboutLink = document.querySelector('.navbar a[href$="#About"]');
    if (aboutLink) aboutLink.classList.add("active");
  } else if (window.location.hash === "#PeriodicTable") {
    const ptLink = document.querySelector('.navbar a[href$="#PeriodicTable"]');
    if (ptLink) ptLink.classList.add("active");
    } else if (window.location.hash === "#Contact") {
    const contactLink = document.querySelector('.navbar a[href$="#Contact"]');
    if (contactLink) contactLink.classList.add("active");
  } else if (window.location.pathname.endsWith("quiz.html")) {
    const quizLink = document.querySelector('.navbar a[href$="quiz.html"]');
    if (quizLink) quizLink.classList.add("active");
  }
    if (window.location.pathname.endsWith("index.html")) {
    document.querySelectorAll('a:not(.navbar a)').forEach(link => {
      const href = link.getAttribute('href');
      // Only add target if it's not a hash link or javascript link
      if (
        href &&
        !href.startsWith('#') &&
        !href.startsWith('javascript:')
      ) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }
});
// Navbar line hover effect
document.addEventListener("DOMContentLoaded", function() {
  const navbar = document.querySelector('.navbar');
  const line = navbar.querySelector('.line');
  const links = navbar.querySelectorAll('a');

  links.forEach(link => {
    link.addEventListener('mouseenter', function() {
      const rect = link.getBoundingClientRect();
      const navbarRect = navbar.getBoundingClientRect();
      line.style.width = rect.width + 'px';
      line.style.left = (rect.left - navbarRect.left) + 'px';
      line.style.opacity = 1;
    });
    link.addEventListener('mouseleave', function() {
      line.style.opacity = 0;
    });
  });
});
//Mute/unmute
document.addEventListener('DOMContentLoaded', function() {
  const music = document.getElementById('background-music');
  const muteButton = document.getElementById('mute-button');
  const muteIcon = document.getElementById('mute-icon');

  // Use a flag to ensure the listener is only added once per session
  if (!window._musicListenerAdded) {
    function enableMusicOnce() {
      if (music.paused) {
        music.play().catch(() => {});
      }
      document.removeEventListener('click', enableMusicOnce);
      window._musicListenerAdded = false;
    }
    document.addEventListener('click', enableMusicOnce, { once: true });
    window._musicListenerAdded = true;
  }

  muteButton.addEventListener('click', function(e) {
    e.stopPropagation();
    music.muted = !music.muted;
    muteIcon.textContent = music.muted ? '🔇' : '🔊';
  });
});


// Timer functionality
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const timerPath = document.querySelector('.base-timer__path-remaining');
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 20;
const ALERT_THRESHOLD = 10;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 30; // 60 seconds
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;
// Set the initial color of the remaining path
document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

function onTimesUp() {
  clearInterval(timerInterval);
  timerInterval = null;
}

/* Start, Stop, and Reset Timer Functions */
// Start the timer
function startTimer() {
  if (timerInterval) return; // Prevent multiple intervals
  timerInterval = setInterval(() => {
    timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;/* Calculate the time left */
    if (timeLeft < 0) {
      timeLeft = 0; // Prevent negative time
    }
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);
    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}
// Stop the timer
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}
// Reset the timer
function resetTimer() {
  stopTimer();
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
  setCircleDasharray();
}
//Time in m:s format
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

// Set the color of the remaining path based on time left
function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  const path = document.getElementById("base-timer-path-remaining");
  if (!path) return;

  // Always remove all color classes first
  path.classList.remove(info.color, warning.color, alert.color);

  if (timeLeft <= alert.threshold) {
    path.classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    path.classList.add(warning.color);
  } else {
    path.classList.add(info.color); // green when full or above warning
  }
}

// Calculate the time fraction for the circular progress bar
function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}
// Set the stroke-dasharray for the circular progress bar
function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// Quiz functionality start 
const questions = [
  {
    question: "Which element is the most electronegative?",
    options: ["Oxygen", "Nitrogen", "Neon", "Fluorine"],
    answer: "D"
  },
  {
    question: "What is the atomic number for Xenon?",
    options: ["36", "10", "54", "56"],
    answer: "C"
  },
  {
    question: "What is the symbol for iron?",
    options: ["Au", "Fe", "Ag", "I"],
    answer: "B"
  },
  {
    question: "How many protons does Carbon have?",
    options: ["6", "7", "14", "8"],
    answer: "A"
  }
];

// Score and question tracking //
let currentQuestionIndex = 0;
let score = 0;

// Load the first question
function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  document.getElementById("question").innerText = currentQuestion.question;
  document.getElementById("optionA").innerText = currentQuestion.options[0];
  document.getElementById("optionB").innerText = currentQuestion.options[1];
  document.getElementById("optionC").innerText = currentQuestion.options[2];
  document.getElementById("optionD").innerText = currentQuestion.options[3];
}

// Check answer and update score
function checkAnswer() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (selectedOption) {
    const answer = selectedOption.value;
    if (answer === questions[currentQuestionIndex].answer) {
      score++;
    }
    currentQuestionIndex++;
    selectedOption.checked = false;
    if (currentQuestionIndex < questions.length) {
      loadQuestion();
    } else {
      showResults();
    }
  } else {
    alert("Please select an answer.");
  }
}

// Display the final score
function showResults() {
  document.getElementById("question-container").style.display = "none";
  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("result-container").innerText = `Your score: ${score} out of ${questions.length}`;
}

// Event listener for submit button
document.getElementById("submit-btn").addEventListener("click", checkAnswer);

// Load the first question on page load
loadQuestion();

