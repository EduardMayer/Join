/**
 * Searches for cards based on the search input value and filters the display accordingly.
 */
function searchCards() {
  const searchInput = document.querySelector(".searchBarContainer input");
  const searchValue = searchInput.value.trim().toLowerCase();
  const cards = document.querySelectorAll(".card");
  const matchedCards = [];
  cards.forEach((card) => {
    const cardTitle = card
      .querySelector(".cardTitle")
      .textContent.toLowerCase();
    const cardDescription = card
      .querySelector(".cardDescription")
      .textContent.toLowerCase();
    if (cardTitle.includes(searchValue) ||cardDescription.includes(searchValue)) {
      matchedCards.push(card);
    }
  });
  cards.forEach((card) => {card.style.display = "none";
  });
  matchedCards.forEach((card) => {card.style.display = "block";
  });
}

/**
 * Shows the full card popup for a task on larger screens (width >= 769px).
 * @param {number} taskId - The ID of the task to be shown in the popup.
 */
async function showCard(taskId) {
  document.getElementById("body").style.overflow = "hidden";
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
  popupCard.innerHTML = generatePopupCardHtml(task,taskId,subtask,backgroundColor,priorityText,priorityImage,assignedContactsHtml);
}

/**
 * Generates the HTML for the subtasks in a task card.
 * @param {Object} task - The task object.
 * @param {number} taskId - The ID of the task.
 * @returns {string} The HTML code for the subtasks.
 */
function showCardMainBoard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let showMainBoardContainer = document.getElementById("showMainBoardContainer");
  let mainBoardContainer = document.getElementById("mainBoardContainer");
  let { priorityImage, priorityText, backgroundColor } =
    checkPrioPopupCard(task);
  let subtask = generateSubtaskHtml(task, taskId);
  let assignedContactsHtml = task.contacts
    .map((contact) => generateInitialsAndFullName(contact))
    .join("");
  mainBoardContainer.style.display = "none";
  showMainBoardContainer.innerHTML = generateShowCardHtml(task,taskId,subtask,backgroundColor,priorityText,priorityImage,assignedContactsHtml);
}

/**
 * Edits the task in the popup card and renders the form for editing.
 * @param {number} taskId - The ID of the task to be edited.
 */
async function editPopupCard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let today = new Date();
  let popupCard = document.getElementById("popupContainer");
  await checkPrioPopupCard(task);
  popupCard.innerHTML = generateEditPopupCardHtml(task, taskId, today);
  renderAllContacts(taskId);
}

/**
 * Edits the task on the main board and renders the form for editing.
 * @param {number} taskId - The ID of the task to be edited.
 */
async function editShowCard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let today = new Date();
  let showCard = document.getElementById("showCard");
  await checkPrioPopupCard(task);
  showCard.innerHTML = generateEditShowCardHtml(task, taskId, today, showCard);
  renderAllContacts(taskId);
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

/**
 * Closes the popup card and renders the board cards.
 */
function closePopupCard() {
  document.getElementById("body").style.overflow = "auto";
  let popupCard = document.getElementById("popupContainer");
  let overlayDiv = document.querySelector(".overlay");
  if (overlayDiv) {
    document.body.removeChild(overlayDiv);
  }
  popupCard.innerHTML = "";
  renderBoardCards();
}

/**
 * Closes the show card popup and displays the main board container.
 */
function closeShowCard() {
  let showMainBoardContainer = document.getElementById("showMainBoardContainer");
  let mainBoardContainer = document.getElementById("mainBoardContainer");
  document.getElementById("body").style.overflow = "scroll";
  mainBoardContainer.style.display = "block";
  showMainBoardContainer.innerHTML = "";
  renderBoardCards();
}

/**
 * Deletes the popup card with the specified taskId.
 * @param {number} taskId - The ID of the task to be deleted.
 */
function deletePopupCard(taskId) {
  const taskIndex = allTasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    allTasks.splice(taskIndex, 1);
    for (let i = 0; i < allTasks.length; i++) {
      allTasks[i].id = i;
    }
    save();
    renderBoardCards();
    closePopupCard();
    closeShowCard();
    load();
  }
}


/**
 * Pushes the subtask information into the allSubtask array.
 */
function pushSubtask() {
  let subtaskElements = document.querySelectorAll(".subBox");
  let subtaskInfo = [];
  for (let i = 0; i < subtaskElements.length; i++) {
    subtaskInfo.push(subtaskElements[i].innerHTML);
  }
  allSubtask = subtaskInfo;
}

/**
 * Closes the subtask image and clears the subtask input field.
 */
function closeSubImg() {
  document.getElementById("subImgContainer").innerHTML = `<img src="img/icon_cancel.svg">`;
  document.getElementById("subtask").value = ``;
}

/**
 * Adds a subtask to the subtask description section.
 */
function addSubtask() {
  let subtask = document.getElementById("subtask").value;
  if (subtask.trim() !== "") {
    document.getElementById("subTaskDescription").innerHTML += `<div class="checkContainer"><input type="checkbox"><div class="subBox">${subtask}</div></div>`;
    document.getElementById("subtask").value = ``;
    pushSubtask();
  }
}

/**
 * Shows a popup with a delay and then hides it.
 */
function showPopup() {
  const popup = document.querySelector(".popupAddTaskBoard");
  popup.style.transform = "translate(-50%, -50%)";
  setTimeout(hidePopup, 1000);
}

/**
 * Hides the popup and redirects to the board.html page.
 */
function hidePopup() {
  const popup = document.querySelector(".popupAddTaskBoard");
  popup.style.transform = "translate(-50%, 500%)";
  window.location.href = "board.html";
}

/**
 * Opens the dropdown user box to assign contacts to a task.
 * @param {number} taskId - The ID of the task to be assigned.
 */
function openDropBoxAssigned(taskId) {
  let dropDownUser = document.getElementById("dropDownUser");
  let childUserContainer = document.getElementById("assigned");
  renderAllContacts(taskId);
  if (dropDownUser.classList.contains("d-none")) {
    dropUser(dropDownUser, childUserContainer);
  } else {
    dropUserElse(dropDownUser, childUserContainer);
  }
}

/**
 * Opens the dropdown category box to create a new category for tasks.
 */
function openDropBoxCategory() {
  let dropDownBox = document.getElementById("newCategoryBox");
  let childTaskContainer = document.getElementById("category");
  let categoryBox = document.getElementById("categoryBox");
  
  if (dropDownBox.classList.contains("d-none")) {
    dropDownBoxShow(dropDownBox, childTaskContainer, categoryBox);
  } else {
    dropDownBoxClose(dropDownBox, childTaskContainer, categoryBox);
  }
}

/**
 * Hides the dropdown box and displays the child task container and category box.
 * @param {HTMLElement} dropDownBox - The dropdown box element.
 * @param {HTMLElement} childTaskContainer - The child task container element.
 * @param {HTMLElement} categoryBox - The category box element.
 */
function dropDownBoxClose(dropDownBox, childTaskContainer, categoryBox) {
  dropDownBox.classList.add("d-none");
  dropDownBox.classList.remove("newCategoryBox");
  childTaskContainer.classList.remove("b-none");
  categoryBox.classList.add("d-none");
  categoryBox.classList.remove("categoryBox");
}

/**
 * Displays the dropdown box and hides the child task container and category box.
 * @param {HTMLElement} dropDownBox - The dropdown box element.
 * @param {HTMLElement} childTaskContainer - The child task container element.
 * @param {HTMLElement} categoryBox - The category box element.
 */
function dropDownBoxShow(dropDownBox, childTaskContainer, categoryBox) {
  dropDownBox.classList.remove("d-none");
  dropDownBox.classList.add("newCategoryBox");
  childTaskContainer.classList.add("b-none");
  categoryBox.classList.remove("d-none");
  categoryBox.classList.add("categoryBox");
}


/**
 * Clears the assigned contacts from the dropdown user box and hides the box.
 */
function clearDropBoxAssigned() {
  let dropDownUser = document.getElementById("dropDownUser");
  let childUserContainer = document.getElementById("assigned");
  selectedContacts = [];
  dropDownUser.classList.add("d-none");
  dropDownUser.classList.remove("dropDownBox");
  childUserContainer.classList.remove("b-none");
}

/**
 * Resets the background color and image of the specified element.
 * @param {HTMLElement} box - The element to be reset.
 */
function resetImage(box) {
  const img = box.querySelector("img");
  const defaultImg = img.dataset.defaultImg;
  img.src = defaultImg;
}

/**
 * Resets the background color and image of the specified element, and sets `currentElement` and `clickedId` to null.
 * @param {HTMLElement} element - The element to be reset.
 */
function ifcurrentElement(element) {
  element.style.backgroundColor = "";
  resetImage(element);
  currentElement = null;
  clickedId = null;
}

/**
 * Resets the background color and image of `currentElement`.
 */
function ifcurrentElementNull() {
  currentElement.style.backgroundColor = "";
  resetImage(currentElement);
}

/**
 * Updates the task properties in the popup card and saves the changes.
 * @param {number} taskId - The ID of the task to be updated.
 */
function savePopupCard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let title = document.getElementById("popupCardTitle").value;
  let description = document.getElementById("popupcardDescription").value;
  let date = document.getElementById("popupCardDate").value;
  let categoryText = getCategoryText(task, "categoryPopupText");
  let categoryColor = getCategoryColor(task, "selectColorBox");
  let selectedContacts = getSelectedContacts();
  let priority = clickedId;
  if (!clickedId) {document.getElementById("prioBoxAlarm").innerHTML = `<div class="alarmBoxPrio">Select a priority!</div>`;
    return;
  }
  upadateValuePopUp(task,title,description,date,categoryText,categoryColor,selectedContacts,priority);
  startOtherFunctions(allTasks, taskId, task, currentElement);
}

function upadateValuePopUp(task,title, description,date,categoryText,categoryColor,selectedContacts,priority
) {
  task.title = title;
  task.description = description;
  task.date = date;
  task.categoryText = categoryText;
  task.categoryColor = categoryColor;
  task.priority = priority;
  task.contacts = selectedContacts;
}

/**
 * Updates the task properties in the allTasks array.
 * @param {Array} allTasks - An array of all tasks.
 * @param {number} taskId - The ID of the task to be updated.
 * @param {Object} task - The task object containing updated properties.
 * @param {HTMLElement} currentElement - The current element to be reset.
 */
function startOtherFunctions(allTasks, taskId, task, currentElement) {
  updateTaskInArray(allTasks, taskId, task);
  resetElement(currentElement);
  closePopupCard();
  closeShowCard();
}

/**
 * Moves a task to the specified status in the allTasks array.
 * @param {number} taskId - The ID of the task to be moved.
 * @param {string} status - The status to which the task should be moved.
 */
function moveToStatus(taskId, status) {
  allTasks[taskId].status = status;
  save();
  renderBoardCards();
  closeShowCard();
}

/**
 * Moves a task to the specified status in the allTasks array.
 * @param {number} taskId - The ID of the task to be moved.
 * @param {string} status - The status to which the task should be moved.
 */
function moveTo(status) {
  allTasks[currentDraggedElement]["status"] = status;
  save();
  renderBoardCards();
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
 * Updates a task in the allTasks array with the provided taskId and updatedTask.
 * @param {Array<Object>} allTasks - The array of all tasks.
 * @param {number} taskId - The ID of the task to be updated.
 * @param {Object} updatedTask - The updated task object.
 */
function updateTaskInArray(allTasks, taskId, updatedTask) {
  let taskIndex = allTasks.findIndex((task) => task.id === taskId);
  allTasks.splice(taskIndex, 1, updatedTask);
  setItem("allTasks", JSON.stringify(allTasks));
}