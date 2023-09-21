/**
 * Array of month names in German.
 * @type {string[]}
 */
const monthNames = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

/**
 * Initializes the application.
 * Calls various rendering functions and sets the date.
 */
async function init() {
  await load();
  renderUserProfile();
  renderSummaryCards();
  countTaskStatuses();
  renderGreetingMessage();
  changeGreetingName();
  setDate();
  renderUserProfileHead();
}

/**
 * Counts the number of tasks for each status and priority.
 * Updates the summary cards with the counts.
 */
function countTaskStatuses() {
  let totalCount = allTasks.length;
  let todoCount = 0;
  let progressCount = 0;
  let feedbackCount = 0;
  let doneCount = 0;
  let urgentCount = 0;

  for (let i = 0; i < allTasks.length; i++) {
    const task = allTasks[i];

    switch (task.status) {
      case "todo":
        todoCount++;
        break;
      case "progress":
        progressCount++;
        break;
      case "feedback":
        feedbackCount++;
        break;
      case "done":
        doneCount++;
        break;
    }

    if (task.priority === "urgent") {
      urgentCount++;
    }
  }

  renderSummaryCards(
    totalCount,
    todoCount,
    progressCount,
    feedbackCount,
    doneCount,
    urgentCount
  );
  load();
}

/**
 * Renders the summary cards with the provided task counts.
 * @param {number} totalCount - Total number of tasks.
 * @param {number} todoCount - Number of tasks with status "todo".
 * @param {number} progressCount - Number of tasks with status "progress".
 * @param {number} feedbackCount - Number of tasks with status "feedback".
 * @param {number} doneCount - Number of tasks with status "done".
 * @param {number} urgentCount - Number of tasks with priority "urgent".
 */
function renderSummaryCards(
  totalCount,
  todoCount,
  progressCount,
  feedbackCount,
  doneCount,
  urgentCount
) {
  let contentSummary = document.getElementById("content-summary");
  contentSummary.innerHTML = renderSummaryCardsHTML(
    totalCount,
    todoCount,
    progressCount,
    feedbackCount,
    doneCount,
    urgentCount
  );
}

/**
 * Renders the greeting message based on the current time.
 */
function renderGreetingMessage() {
  let message = getGreeting();
  if (message) {
    document.getElementById("greeting-message").innerHTML = message;
    document.getElementById("greeting-user").innerHTML = "";
  } else {
    document.getElementById("greeting-message").innerHTML = message + ",";
    document.getElementById("greeting-user").innerHTML = user;
  }
  mobileGreet();
}

/**
 * Returns a greeting message based on the current time.
 * @returns {string} The greeting message.
 */
function getGreeting() {
  let time = new Date();
  time = time.getHours();

  if (time >= 6 && time < 12) {
    return "Good morning,";
  }
  if (time >= 12 && time < 18) {
    return "Good afternoon,";
  }
  if ((time >= 18 && time < 24) || (time >= 0 && time < 6)) {
    return "Good evening,";
  }
}

/**
 * Sets the date based on the nearest urgent task date.
 */
async function setDate() {
  await load();
  let urgentTasks = allTasks.filter((t) => t.priority === "urgent" && t.date);
  let sortedUrgentTasks = urgentTasks
    .map((t) => new Date(t.date))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (sortedUrgentTasks.length === 0) {
    return;
  }

  let closestDate = sortedUrgentTasks.reduce((a, b) =>
    Math.abs(b - new Date()) < Math.abs(a - new Date()) ? b : a
  );
  let closestDateString = closestDate.toLocaleString("default", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  document.getElementById("date").innerHTML = `${closestDateString}`;
}

/**
 * Changes the greeting name based on the user cookie.
 */
function changeGreetingName() {
  let cookieValue = document.cookie;
  let nameFromCookie = cookieValue
    .split(";")
    .find((cookie) => cookie.includes("users="));

  showsGreetingName(nameFromCookie);
}

/**
 * Shows the greeting name on the page based on the user cookie.
 * @param {string} nameFromCookie - The user name from the cookie.
 */
function showsGreetingName(nameFromCookie) {
  if (nameFromCookie === undefined) {
    document.getElementById("greeting-user").innerHTML = "Guest";
    //      document.getElementById('overlay').innerHTML = 'Guest';
  } else {
    let nameCookieFormatted = nameFromCookie.split("=")[1];
    const selectedUser = users.find(
      (user) => user.name.toLowerCase().replace(" ", "") === nameCookieFormatted
    );

    document.getElementById("greeting-user").innerHTML = selectedUser.name;
    //    document.getElementById('overlay').innerHTML = selectedUser.name;
  }
}

/**
 * Redirects to the board page.
 */
function linkToBoard() {
  window.location.href = "board.html";
}

/**
 * Displays a mobile greeting overlay if coming from the index page.
 */
function mobileGreet() {
  if (window.innerWidth < 768) {
    let overlayContainer = document.getElementById("overlayContainer");
    let mainContainer = document.getElementsByClassName("main")[0];
    if (document.referrer.includes("index.html")) {
      overlayContainer.classList.remove("d-none");
      overlayContainer.classList.add("overlayContainer");
      mainContainer.classList.add("d-none");
      greetText();
      setTimeout(function () {
        overlayContainer.classList.add("d-none");
        mainContainer.classList.remove("d-none");
      }, 2500);
    }
  }
}

/**
 * Displays a greeting message in the mobile overlay.
 */
function greetText() {
  let user = renderOverlayProfile();
  let message = getGreeting();
  if (message) {
    document.getElementById("overlay").innerHTML = message;
    document.getElementById("overlayUser").innerHTML = "";
  } else {
    document.getElementById("overlay").innerHTML = message + ",";
    document.getElementById("overlayUser").innerHTML = user;
  }
}
