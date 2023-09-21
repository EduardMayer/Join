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
let allColors = ["#E200BE","#1FD7C1","#0038FF","#FF8A00","#2AD300","#FF0000","#8AA4FF",];
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

async function renderCategory() {
  await load();
  let categoryBox = document.getElementById("categoryBox");
  categoryBox.innerHTML = "";
  for (let i = 0; i < allCategory.length; i++) {
    const category = allCategory[i].category;
    const color = allCategory[i].color;
    categoryBox.innerHTML += `<div class="colorCategoryBox" onclick="selectCategory(${i})" id="selectCategory${i}"><div id="categoryText">${category}</div><div class="selectColorBox" id="selectColorBox" style="background-color:${color};"></div></div>`;
  }
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
 * Creates a new task based on user input and saves it to the allTasks array.
 * @param {string} status - The status of the task to be created.
 */
function createTask(status) {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const date = document.getElementById("date");
  const categoryText = document.getElementById("categoryText");
  const categoryColor = document.getElementById("selectColorBox");
  let selectedContacts = getSelectedContacts();
  let priority = clickedId;
  if (checkPrioritySelected()) {
    return;
  }
  let allTask = {
    id: allTasks.length,
    title: title.value,
    description: description.value,
    categoryText: categoryText.innerHTML,
    categoryColor: categoryColor.style.backgroundColor,
    date: date.value,
    priority: priority,
    status: status,
    subtask: allSubtask,
    contacts: selectedContacts,
  };
  showPopup();
  allTasks.push(allTask);
  save();
  allSubtask = [];
  clearTask();
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
  let User = users.find((u) => u.name == name);
  if (User) {
    let color = User["color"];
    return color;
  }
  return "rgb(211,211,211)";
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
 * Generates the HTML for the subtasks in a task card.
 * @param {Object} task - The task object.
 * @param {number} taskId - The ID of the task.
 * @returns {string} The HTML code for the subtasks.
 */
function generateSubtaskHtml(task, taskId) {
  let subtaskHtml = "";
  if (task.subtask && task.subtask.length > 0) {
    for (let i = 0; i < task.subtask.length; i++) {
      let checkboxId = `checkbox-${taskId}-${i}`;
      let checkedAttribute =
        task.subtaskChecked && task.subtaskChecked[i] ? "checked" : "";
      subtaskHtml += SubtaskHTMLgerate(checkboxId,checkedAttribute,taskId, i,task);
    }
  }
  return subtaskHtml;
}

/**
 * Updates the progress and saves the checkbox state when a subtask checkbox is clicked.
 * @param {number} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask in the task's subtask array.
 */
function updateProgress(taskId, subtaskIndex) {
  let task = allTasks.find((task) => task.id === taskId);
  if (!task.subtaskChecked) {
    task.subtaskChecked = [];
  }
  task.subtaskChecked[subtaskIndex] = !task.subtaskChecked[subtaskIndex];
  renderBoardCards();
  save();
}

/**
 * Saves the checkbox state for a subtask in the allTasks array.
 * @param {number} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask in the task's subtask array.
 */
function saveCheckboxState(taskId, subtaskIndex) {
  let checkboxId = `checkbox-${taskId}-${subtaskIndex}`;
  let checkbox = document.getElementById(checkboxId);
  let task = allTasks.find((task) => task.id === taskId);
  if (!task.subtaskChecked) {
    task.subtaskChecked = [];
  }
  task.subtaskChecked[subtaskIndex] = checkbox.checked;
  setItem("allTasks", JSON.stringify(allTasks));
}

/**
 * Renders all available contacts for task assignment in the dropdown user box.
 * @param {number} taskId - The ID of the task to be assigned.
 */
function renderAllContacts(taskId) {
  let dropDownUser = document.getElementById("dropDownUser");
  dropDownUser.innerHTML = "";
  for (let i = 0; i < allContacts.length; i++) {
    const name = allContacts[i];
    const isChecked = selectedContacts.includes(name) ? "checked" : "";
    dropDownUser.innerHTML += `<div class="contactBox"><input type="checkbox" id="contact${i}" name="contact${i}" ${isChecked} onchange="saveSelectedContact(${i})"><label for="contact${i}">${name}</label></div>`;
  }
  markMatchingContacts(taskId);
}

/**
 * Asynchronously loads data from the storage.
 * It retrieves the 'allCategory' and 'allTasks' from storage and populates the corresponding arrays.
 */
async function load() {
  let allCategoryInString = await getItem("allCategory");
  allCategory = JSON.parse(allCategoryInString) || [];

  let allTaskInString = await getItem("allTasks");
  allTasks = JSON.parse(allTaskInString) || [];
}

/**
 * Asynchronously saves data to the storage.
 * It saves the 'allTasks' and 'allCategory' arrays as JSON strings to the local storage.
 */
async function save() {
  await setItem("allTasks", JSON.stringify(allTasks));
  await setItem("allCategory", JSON.stringify(allCategory));
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
