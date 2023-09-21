/**
 * Hides the new category section and displays the main category container.
 * @param {HTMLElement} categoryContainer - The main category container element.
 * @param {HTMLElement} newCategoryContainer - The new category container element.
 * @param {HTMLElement} childTaskContainer - The child task container element.
 * @param {HTMLElement} dropDownBox - The dropdown box element.
 * @param {HTMLElement} categoryColors - The category colors element.
 * @param {HTMLElement} categoryBox - The category box element.
 */
function closeNewCategoryfunction(categoryContainer, newCategoryContainer, childTaskContainer, dropDownBox, categoryColors, categoryBox) {
  categoryBox.classList.add("d-none");
  categoryBox.classList.remove("categoryBox");
  categoryColors.classList.add("d-none");
  categoryColors.classList.remove("colorsContainer");
  categoryContainer.classList.remove("d-none");
  newCategoryContainer.classList.add("d-none");
  childTaskContainer.classList.remove("b-none");
  dropDownBox.classList.add("d-none");
  dropDownBox.classList.remove("dropDownBox");
}

/**
 * Closes the new category form and clears the input fields.
 */
function closeNewCategory() {
  let categoryContainer = document.getElementById("categoryContainer");
  let newCategoryContainer = document.getElementById("newCategoryContainer");
  let dropDownBox = document.getElementById("newCategoryBox");
  let childTaskContainer = document.getElementById("category");
  let categoryColors = document.getElementById("categoryColors");
  let categoryBox = document.getElementById("categoryBox");
  closeNewCategoryfunction(categoryContainer, newCategoryContainer, childTaskContainer, dropDownBox, categoryColors, categoryBox);
  clearCategory();
}

/**
 * Hides the dropdown box and displays the child task container and category box.
 * @param {HTMLElement} dropDownBox - The dropdown box element.
 * @param {HTMLElement} childTaskContainer - The child task container element.
 * @param {HTMLElement} categoryBox - The category box element.
 */
function dropDownBoxElse(dropDownBox, childTaskContainer, categoryBox) {
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
function dropDownBoxDnone(dropDownBox, childTaskContainer, categoryBox) {
  dropDownBox.classList.remove("d-none");
  dropDownBox.classList.add("newCategoryBox");
  childTaskContainer.classList.add("b-none");
  categoryBox.classList.remove("d-none");
  categoryBox.classList.add("categoryBox");
}

/**
 * Changes the subtask images in the HTML.
 */
function changeSubImg() {
  document.getElementById("subImgContainer").innerHTML = `<div class="subImgContainer">
    <img onclick="closeSubImg()" src="img/iconoir_cancel_black.svg">
    <div class="searchBarLine"></div>
    <img onclick="addSubtask()" id="subImg" src="img/akar-icons_check_black.svg">
  </div>`;
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
 * Sets the current date in the date input element.
 */
function setCurrentDate() {
  const dateInput = document.getElementById("date");
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  currentDate(year, month, day, dateInput);
}

/**
 * Sets the minimum and current date in the date input element.
 * @param {number} year - The current year.
 * @param {string} month - The current month.
 * @param {string} day - The current day.
 * @param {HTMLInputElement} dateInput - The date input element.
 */
function currentDate(year, month, day, dateInput) {
  const currentDate = year + "-" + month + "-" + day;
  dateInput.min = currentDate;
  dateInput.value = currentDate;
}

/**
 * Updates the priority element based on the selected priority.
 * @param {string} elementId - The ID of the priority element.
 * @param {HTMLElement} element - The priority element.
 */
function prio(elementId, element) {
  if (elementId === "urgent") {
    element.style.backgroundColor = "rgb(255, 61, 0)";
    element.querySelector("img").src = "img/Prio-urgent-white.png";
  } else if (elementId === "medium") {
    element.style.backgroundColor = "rgb(255, 168, 0)";
    element.querySelector("img").src = "img/Prio-medium-white.png";
  } else if (elementId === "low") {
    element.style.backgroundColor = "rgb(122, 226, 41)";
    element.querySelector("img").src = "img/Prio-low-white.png";
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
  document.getElementById(
    "subImgContainer"
  ).innerHTML = `<img src="img/icon_cancel.svg">`;
  document.getElementById("subtask").value = ``;
}

/**
 * Adds a subtask to the subtask description section.
 */
function addSubtask() {
  let subtask = document.getElementById("subtask").value;
  if (subtask.trim() !== "") {
    document.getElementById(
      "subTaskDescription"
    ).innerHTML += `<div class="checkContainer"><input type="checkbox"><div class="subBox">${subtask}</div></div>`;
    document.getElementById("subtask").value = ``;
    pushSubtask();
  }
}

/**
 * Displays the dropdown user box and hides the child user container.
 * @param {HTMLElement} dropDownUser - The dropdown user box element.
 * @param {HTMLElement} childUserContainer - The child user container element.
 */
function dropUser(dropDownUser, childUserContainer) {
  dropDownUser.classList.remove("d-none");
  dropDownUser.classList.add("dropDownBox");
  childUserContainer.classList.add("b-none");
}

/**
 * Hides the dropdown user box and displays the child user container.
 * @param {HTMLElement} dropDownUser - The dropdown user box element.
 * @param {HTMLElement} childUserContainer - The child user container element.
 */
function dropUserElse(dropDownUser, childUserContainer) {
  dropDownUser.classList.add("d-none");
  dropDownUser.classList.remove("dropDownBox");
  childUserContainer.classList.remove("b-none");
}

/**
 * Renders the color category options in the categoryColors element.
 */
function renderColorCategory() {
  let categoryColors = document.getElementById("categoryColors");
  categoryColors.innerHTML = "";
  for (let i = 0; i < allColors.length; i++) {
    categoryColors.innerHTML += `<div onclick="selectColor(${i})" id="selectColor${i}" class="color" style="background-color: ${allColors[i]}">
      </div>`;
  }
}

/**
 * Highlights the specified element by adding a class.
 * @param {string} id - The ID of the element to be highlighted.
 */
function highlight(id) {
  document.getElementById(id).classList.add("box-highlight");
}

/**
 * Removes the highlight from the specified element by removing a class.
 * @param {string} id - The ID of the element to remove the highlight from.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("box-highlight");
}

/**
 * Sets the current dragged element during dragging operations.
 * @param {string} id - The ID of the current dragged element.
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Prevents the default behavior for drag and drop events.
 * @param {Event} ev - The dragover event object.
 */
function allowDrop(ev) {
  ev.preventDefault();
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
 * Adds a new category to the allCategory array based on user input.
 */
async function addNewCategory() {
  let newCategory = document.getElementById("inputCategory").value;
  let colorBox = document.getElementById("colorBox");
  let selectedColor = colorBox.querySelector(".selected-color");
  let newColor = selectedColor.getAttribute("data-color");
  allCategory.push({ category: newCategory, color: newColor });
  await save();
  document.getElementById("inputCategory").value = ``;
  closeNewCategory();
  renderCategory();
  openDropBoxCategory();
}

/**
 * Selects a color from the color options and displays it in the color box.
 * @param {number} i - The index of the selected color.
 */
function selectColor(i) {
  let colorBox = document.getElementById("colorBox");
  colorBox.innerHTML = "";
  let selectedColor = document.createElement("div");
  selectedColor.style.backgroundColor = allColors[i];
  selectedColor.setAttribute("data-color", allColors[i]);
  selectedColor.classList.add("selected-color");
  colorBox.appendChild(selectedColor);
}

/**
 * Sets the classes to display the new category form.
 * @param {HTMLElement} categoryContainer - The main category container element.
 * @param {HTMLElement} newCategoryContainer - The new category container element.
 * @param {HTMLElement} categoryColors - The category colors element.
 */
function newCategoryClass(categoryContainer, newCategoryContainer, categoryColors) {
  categoryContainer.classList.add("d-none");
  newCategoryContainer.classList.remove("d-none");
  categoryColors.classList.remove("d-none");
  categoryColors.classList.add("colorsContainer");
  document.getElementById("newCategoryContainer").innerHTML = newCategoryHtml();
}

/**
 * Closes the show card popup and displays the main board container.
 */
function closeShowCard() {
  let showMainBoardContainer = document.getElementById("showMainBoardContainer");
  let mainBoardContainer = document.getElementById("mainBoardContainer");
  document.getElementById('body').style.overflow = 'scroll';
  mainBoardContainer.style.display = "block";
  showMainBoardContainer.innerHTML = "";
  renderBoardCards();
}

/**
 * Closes the popup card and renders the board cards.
 */
function closePopupCard() {
  document.getElementById('body').style.overflow = 'auto';
  let popupCard = document.getElementById("popupContainer");
  let overlayDiv = document.querySelector(".overlay");
  if (overlayDiv) {
    document.body.removeChild(overlayDiv);
  }
  popupCard.innerHTML = "";
  renderBoardCards();
}

/**
 * Selects a category and displays it in the categoryTextBox.
 * @param {number} i - The index of the selected category.
 */
function selectCategory(i) {
  let sourceDiv = document.getElementById(`selectCategory${i}`);
  let targetDiv = document.getElementById(`categoryTextBox`);
  targetDiv.innerHTML = sourceDiv.innerHTML;
  sourceDiv.parentNode.removeChild(sourceDiv);
  openDropBoxCategory();
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
  if (!clickedId) {
    document.getElementById("prioBoxAlarm").innerHTML = `<div class="alarmBoxPrio">Select a priority!</div>`;
    return;
  }
  upadateValuePopUp(task, title, description, date, categoryText, categoryColor, selectedContacts, priority)
  startOtherFunctions(allTasks, taskId, task, currentElement);
}

function upadateValuePopUp(task, title, description, date, categoryText, categoryColor, selectedContacts, priority) {
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

