/**
 * The current element being interacted with during dragging operations.
 * @type {HTMLElement}
 */
let currentElement = null;
/**
 * The ID of the clicked element during priority selection.
 * @type {string}
 */
let clickedId = null;
/**
 * An array of all tasks.
 * @type {Array<Object>}
 */
let allTasks = [];
/**
 * An array of all categories.
 * @type {Array<Object>}
 */
let allCategory = [];
/**
 * An array of all subtasks.
 * @type {Array<Object>}
 */
let allSubtask = [];
/**
 * An array of all available colors for categories.
 * @type {Array<string>}
 */
let allColors = ["#E200BE", "#1FD7C1", "#0038FF", "#FF8A00", "#2AD300", "#FF0000", "#8AA4FF",];
/**
 * An array of selected contacts for a task.
 * @type {Array<Object>}
 */
let selectedContacts = [];
/**
 * An object containing initials colors for users.
 * @type {Object}
 */
let initialsColors = {};
/**
 * The current dragged element during dragging operations.
 * @type {HTMLElement}
 */
let currentDraggedElement;
/**
 * The current task ID being operated on.
 * @type {number}
 */
let currentTaskId;
/**
 * Loads the necessary data and initiates the board rendering.
 */
load();
/**
 * Loads the user profiles in the HTML.
 */
loadUsers();

/**
 * Includes the HTML templates and renders the user profile header.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  renderUserProfileHead();
}

/**
 * Renders the board cards by status on the board page.
 */
async function renderBoardCards() {
  await load();
  renderTasksByStatus("todo", "todo");
  renderTasksByStatus("progress", "progress");
  renderTasksByStatus("feedback", "feedback");
  renderTasksByStatus("done", "done");
}

/**
 * Renders the tasks in the specified status container on the board page.
 * @param {string} status - The status of the tasks to be rendered.
 * @param {string} containerId - The ID of the container to render tasks.
 */
function renderTasksByStatus(status, containerId) {
  const tasks = allTasks.filter((task) => task.status === status);
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  tasks.forEach((task, index) => {
    container.innerHTML += generateCardHTML(task, index);
  });
}

/**
 * Searches for cards based on the search input value and filters the display accordingly.
 */
function searchCards() {
  const searchInput = document.querySelector(".searchBarContainer input");
  const searchValue = searchInput.value.trim().toLowerCase();
  const cards = document.querySelectorAll(".card");
  const matchedCards = [];
  cards.forEach((card) => {
    const cardTitle = card.querySelector(".cardTitle").textContent.toLowerCase();
    const cardDescription = card.querySelector(".cardDescription").textContent.toLowerCase();
    if (cardTitle.includes(searchValue) || cardDescription.includes(searchValue)) {
      matchedCards.push(card);
    }
  });
  cards.forEach((card) => { card.style.display = "none"; });
  matchedCards.forEach((card) => {
    card.style.display = "block";
  });
}

/**
 * Generates the progress information for a task.
 * @param {Object} task - The task object.
 * @returns {Object} An object containing the progress information.
 */
function generateProgress(task) {
  let completedSubtasks = task.subtaskChecked ? task.subtaskChecked.filter((checked) => checked).length : 0;
  let totalSubtasks = task.subtask ? task.subtask.length : 0;
  let progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  return { completedSubtasks, totalSubtasks, progress };
}

/**
 * Generates the HTML for the progress bar container in a card.
 * @param {Object} task - The task object.
 * @returns {string} The HTML code for the progress bar container.
 */
function generateProgressBarContainerHTML(task) {
  let { completedSubtasks, totalSubtasks, progress } = generateProgress(task);
  let progressBarContainerHTML = "";
  if (task.subtask && task.subtask.length > 0) {
    progressBarContainerHTML = generateProgressHTML(progress, completedSubtasks, totalSubtasks)
  }
  return progressBarContainerHTML;
}

/**
 * Generates the HTML for the progress bar in a card.
 * @param {number} progress - The progress value (0-100).
 * @param {number} completedSubtasks - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 * @returns {string} The HTML code for the progress bar.
 */
function generateProgressHTML(progress, completedSubtasks, totalSubtasks) {
  return `
  <div class="progressBarContainer" id="progressBarContainer">
    <div class="cardProgress"><progress value="${progress}" max="100"></progress></div>
    <div class="checkboxCount">${completedSubtasks}/${totalSubtasks} Done</div>
  </div>
`;
}

/**
 * Checks the priority of a task and returns relevant information for the popup card.
 * @param {Object} task - The task object.
 * @returns {Object} An object containing the priority information.
 */
function checkPrioPopupCard(task) {
  let priorityImage, priorityText, backgroundColor;
  if (task.priority === "urgent") {
    priorityImage = "img/Prio-urgent-white.png";
    priorityText = "Urgent";
    backgroundColor = "rgb(255, 61, 0)";
  } else if (task.priority === "medium") {
    priorityImage = "img/Prio-medium-white.png";
    priorityText = "Medium";
    backgroundColor = "rgb(255, 168, 0)";
  } else {
    priorityImage = "img/Prio-low-white.png";
    priorityText = "Low";
    backgroundColor = "rgb(122, 226, 41)";
  }
  return { priorityImage, priorityText, backgroundColor };
}

/**
 * Creates a new task based on user input and saves it to the allTasks array.
 * @param {string} status - The status of the task to be created.
 */
function createTask(status) {
  const title = document.getElementById("title"); const description = document.getElementById("description"); const date = document.getElementById("date"); const categoryText = document.getElementById("categoryText"); const categoryColor = document.getElementById("selectColorBox");
  let selectedContacts = getSelectedContacts();
  let priority = clickedId;
  if (checkPrioritySelected()) {
    return;
  }
  let allTask = { id: allTasks.length, title: title.value, description: description.value, categoryText: categoryText.innerHTML, categoryColor: categoryColor.style.backgroundColor, date: date.value, priority: priority, status: status, subtask: allSubtask, contacts: selectedContacts, };
  showPopup();
  allTasks.push(allTask);
  save();
  allSubtask = [];
  clearTask();
}

/**
 * Gets the selected contacts for a task based on checkboxes and returns them as an array.
 * @returns {Array<Object>} An array of selected contact objects.
 */
function getSelectedContacts() {
  let selectedContacts = [];
  let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  if (checkboxes.length === 0) {
    let errorMessage = document.getElementById("assigned-error");
    errorMessage.textContent = "Please select at least one contact.";
    errorMessage.style.color = "red";
    return selectedContacts;
  }
  checkboxes.forEach((checkbox) => {
    let contactId = checkbox.id.replace("contact", "");
    selectedContacts.push(allContacts[contactId]);
  });
  return selectedContacts;
}

/**
 * Checks if a priority has been selected for a task and displays an error message if not.
 * @returns {boolean} True if no priority is selected, false otherwise.
 */
function checkPrioritySelected() {
  if (!clickedId) {
    document.getElementById(
      "prioBoxAlarm"
    ).innerHTML = `<div class="alarmBoxPrio">Select a priority!</div>`;
    return true;
  }
  return false;
}

/**
 * Clears the input fields after creating a new task.
 */
function clearTask() {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const alarmbox = document.getElementById("prioBoxAlarm");
  const subtask = document.getElementById("subtask");
  const subtaskDescription = document.getElementById("subTaskDescription");
  alarmbox.innerHTML = ``;
  title.value = ``;
  description.value = ``;
  subtask.value = ``;
  subtaskDescription.innerHTML = ``;
  startNewFunctionsclear(currentElement);
}

/**
 * Calls other functions to clear category, dropdowns, and reset elements when creating a new task.
 * @param {HTMLElement} currentElement - The current element to be reset.
 */
function startNewFunctionsclear(currentElement) {
  setCurrentDate();
  clearCategory();
  clearDropBoxAssigned();
  resetElement(currentElement);
}

/**
 * Resets the specified element's background color and clickedId.
 * @param {HTMLElement} currentElement - The current element to be reset.
 */
function resetElement(currentElement) {
  if (currentElement !== null) {
    currentElement.style.backgroundColor = "";
    resetImage(currentElement);
    currentElement = null;
    clickedId = null;
  }
}

/**
 * Clears the category selection in the new task form.
 */
function clearCategory() {
  let category = document.getElementById("category");
  category.innerHTML = `<div id="categoryTextBox" class="categoryTextBox"><p>Select task category</p></div><div><img src="img/arrowTask.svg"></div>`;
}

/**
 * Opens the add task container and renders the form for creating a new task.
 * @param {string} status - The status of the task to be created.
 */
function openAddTaskContainer(status) {
  let popupAddTaskContainer = document.getElementById("popupAddTaskContainer");
  popupAddTaskContainer.innerHTML = ``;
  popupAddTaskContainer.innerHTML += popupAddTaskContainerTemplate(status);
  renderCategory();
  renderColorCategory();
  slideAnimation();
}

/**
 * Performs slide animation to show the add task container.
 */
function slideAnimation() {
  let mainAddTaskContainer = document.querySelector(".mainAddTaskContainer");
  let overlayDiv = document.createElement("div");
  mainAddTaskContainer.style.transform = "translateX(150%)";
  overlayDiv.classList.add("overlay");
  document.body.appendChild(overlayDiv);
  setCurrentDate();
  setTimeout(function () {
    mainAddTaskContainer.style.transform = "translate(0%)";
  }, 100);
}

/**
 * Gets a random color based on a user's name or a default color if not found.
 * @param {string} name - The user's name.
 * @returns {string} The user's color or a default color.
 */
function getRandomColor(name) {
  let User = users.find(u => u.name == name);
  if (User) {
    let color = User['color'];
    return color;
  }
  return 'rgb(211,211,211)'
}

/**
 * Shows the full card popup for a task on larger screens (width >= 769px).
 * @param {number} taskId - The ID of the task to be shown in the popup.
 */
async function showCard(taskId) {
  document.getElementById('body').style.overflow = 'hidden';
  let screenWidth = window.innerWidth;
  if (screenWidth >= 769) {
    await showCardPopup(taskId);
  } else {
    showCardMainBoard(taskId);
  }
}

/**
 * Shows the full card on the main board for a task on smaller screens (width < 769px).
 * @param {number} taskId - The ID of the task to be shown on the main board.
 */
async function showCardPopup(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let overlayDiv = document.createElement("div");
  let popupCard = document.getElementById("popupContainer");
  let { priorityImage, priorityText, backgroundColor } =
    await checkPrioPopupCard(task);
  let subtask = generateSubtaskHtml(task, taskId);
  let assignedContactsHtml = task.contacts
    .map((contact) => generateInitialsAndFullName(contact))
    .join("");
  overlayDiv.classList.add("overlay");
  document.body.appendChild(overlayDiv);
  popupCard.innerHTML = generatePopupCardHtml(task, taskId, subtask, backgroundColor, priorityText, priorityImage, assignedContactsHtml);
}

  /**
   * Generates the full name of a contact.
   * @param {string} name - The contact's name.
   * @returns {string} The HTML code for the contact's full name.
   */
  function generateFullName(name) {
    return `<div>${name}</div>`;
  }
  
  /**
   * Generates the initials of a contact.
   * @param {string} name - The contact's name.
   * @returns {string} The HTML code for the contact's initials.
   */
  function generateInitials(name) {
    const names = name.substring(0, name.indexOf(" ")).charAt(0);
    const lastnames = name.substring(name.indexOf(" ") + 1).charAt(0);
    const initialsBackgroundColor = initialsColors[name] || getRandomColor(name);
    initialsColors[name] = initialsBackgroundColor;
    return `<div class="initialsSecond" id="initials" style="background-color:${initialsBackgroundColor}">${names}${lastnames}</div>`;
  }
  
  /**
   * Generates the initials and full name of a contact.
   * @param {string} name - The contact's name.
   * @returns {string} The HTML code for the contact's initials and full name.
   */
  function generateInitialsAndFullName(name) {
    const names = name.substring(0, name.indexOf(" ")).charAt(0);
    const lastnames = name.substring(name.indexOf(" ") + 1).charAt(0);
    const initialsBackgroundColor = initialsColors[name] || getRandomColor();
    initialsColors[name] = initialsBackgroundColor;
    return `<div class="initialsNameBox"><div class="initials" id="initials" style="background-color:${initialsBackgroundColor}">${names}${lastnames}</div><div id="initialsName">${name}</div></div>`;
  }
  
  /**
   * Closes the popup task card and removes the overlay.
   */
  function closePopupTaskCard() {
    let mainAddTaskContainer = document.querySelector(".mainAddTaskContainer");
    let overlayDiv = document.querySelector(".overlay");
    document.body.removeChild(overlayDiv);
    mainAddTaskContainer.classList.remove("open");
    mainAddTaskContainer.classList.add("d-none");
  }