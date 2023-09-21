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
 * Marks the checkboxes for matching contacts in the popup card.
 * @param {number} taskId - The ID of the task to be matched with contacts.
 */
function markMatchingContacts(taskId) {
  const task = allTasks.find((task) => task.id === taskId);
  if (task) {
    const taskContacts = task.contacts;
    for (let i = 0; i < allContacts.length; i++) {
      const contact = allContacts[i];
      const checkboxId = `contact${i}`;
      const checkbox = document.getElementById(checkboxId);
      if (taskContacts.includes(contact)) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    }
  }
}

/**
 * Saves the selected contact in the selectedContacts array.
 * @param {number} index - The index of the selected contact.
 */
function saveSelectedContact(index) {
  const checkbox = document.getElementById(`contact${index}`);
  const contactName = allContacts[index];
  if (checkbox.checked) {
    selectedContacts.push(contactName);
  } else {
    const contactIndex = selectedContacts.indexOf(contactName);
    if (contactIndex !== -1) {
      selectedContacts.splice(contactIndex, 1);
    }
  }
}

/**
 * Sets the classes to display the new category form.
 * @param {HTMLElement} categoryContainer - The main category container element.
 * @param {HTMLElement} newCategoryContainer - The new category container element.
 * @param {HTMLElement} categoryColors - The category colors element.
 */
function newCategoryClass(categoryContainer,newCategoryContainer,categoryColors) {
  categoryContainer.classList.add("d-none");
  newCategoryContainer.classList.remove("d-none");
  categoryColors.classList.remove("d-none");
  categoryColors.classList.add("colorsContainer");
  document.getElementById("newCategoryContainer").innerHTML = newCategoryHtml();
}
/**
 * Checks if the current element matches the specified element and resets it if true.
 * If not, resets the current element and sets the new element as the current element.
 * @param {string} elementId - The ID of the element to be checked.
 */
function checkpriobox(elementId) {
  let element = document.getElementById(elementId);
  if (currentElement === element) {
    ifcurrentElement(element);
  } else {
    if (currentElement !== null) {
      ifcurrentElementNull();
    }
    prio(elementId, element);
    currentElement = element;
    clickedId = elementId;
  }
}

/**
 * Sets the popup category card with available category options.
 */
function setPopupCategoryCard() {
  let popupCategoryBox = document.getElementById("popupCategoryBox");
  if (popupCategoryBox.innerHTML !== "") {
    popupCategoryBox.innerHTML = "";
    return;
  }
  for (let i = 0; i < allCategory.length; i++) {
    const category = allCategory[i].category;
    const color = allCategory[i].color;
    popupCategoryBox.innerHTML += `<div class="colorPopupCategoryBox" style="background-color:${color}" onclick="selectPopupCategory(${i})" id="selectPopupCategory${i}"><div id="categoryPopupText">${category}</div><div class="selectColorBox" id="selectColorBox" style="background-color:${color};"></div></div>`;
  }
}

/**
 * Generates the HTML for a subtask element in the popup card.
 * @param {string} checkboxId - The ID of the subtask checkbox.
 * @param {string} checkedAttribute - The "checked" attribute for the checkbox.
 * @param {number} taskId - The ID of the task associated with the subtask.
 * @param {number} i - The index of the subtask.
 * @param {Object} task - The task object containing subtask information.
 * @returns {string} The HTML code for the subtask element.
 */
function SubtaskHTMLgerate(checkboxId, checkedAttribute, taskId, i, task) {
  return `
    <div class="popupCardSubItem">
      <input type="checkbox" class="popupCardCheckbox" id="${checkboxId}" ${checkedAttribute} onclick="updateProgress(${taskId}, ${i})">
      <span class="popupCardSubtask">${task.subtask[i]}</span>
    </div>
  `;
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
 * Selects a category for a task in the popup card and updates the category box.
 * @param {number} i - The index of the selected category.
 */
function selectPopupCategory(i) {
  let sourceDiv = document.getElementById(`selectPopupCategory${i}`);
  let targetDiv = document.getElementById(`popupcardCategory`);
  let backgroundColor = sourceDiv.style.backgroundColor;
  targetDiv.innerHTML = sourceDiv.innerHTML;
  targetDiv.style.backgroundColor = backgroundColor;
  setPopupCategoryCard();
  popupCategoryBox.innerHTML = ``;
}

/**
 * Gets the category text for a task based on user input or default values.
 * @param {Object} task - The task object.
 * @param {string} defaultTextElementId - The ID of the default text element.
 * @returns {string} The category text for the task.
 */
function getCategoryText(task, defaultTextElementId) {
  let textElement = document.getElementById(defaultTextElementId);
  let text;
  if (textElement && textElement.textContent) {
    text = textElement.textContent;
  } else {
    text = task.categoryText;
  }
  return text;
}

/**
 * Gets the category color for a task based on user input or default values.
 * @param {Object} task - The task object.
 * @param {string} defaultColorElementId - The ID of the default color element.
 * @returns {string} The category color for the task.
 */
function getCategoryColor(task, defaultColorElementId) {
  let colorElement = document.getElementById(defaultColorElementId);
  let color;
  if (colorElement && colorElement.style.backgroundColor) {
    color = colorElement.style.backgroundColor;
  } else {
    color = task.categoryColor;
  }
  return color;
}
/**
 * Generates the progress information for a task.
 * @param {Object} task - The task object.
 * @returns {Object} An object containing the progress information.
 */
function generateProgress(task) {
  let completedSubtasks = task.subtaskChecked
    ? task.subtaskChecked.filter((checked) => checked).length
    : 0;
  let totalSubtasks = task.subtask ? task.subtask.length : 0;
  let progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
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
    progressBarContainerHTML = generateProgressHTML(
      progress,
      completedSubtasks,
      totalSubtasks
    );
  }
  return progressBarContainerHTML;
}

/**
 * Switches to the new category view, showing the form to create a new category.
 * It also renders the color options for the new category.
 */
function newCategory() {
  let categoryContainer = document.getElementById("categoryContainer");
  let newCategoryContainer = document.getElementById("newCategoryContainer");
  let categoryColors = document.getElementById("categoryColors");
  renderColorCategory();
  newCategoryClass(categoryContainer, newCategoryContainer, categoryColors);
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