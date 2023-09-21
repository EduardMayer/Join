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
    showMainBoardContainer.innerHTML = generateShowCardHtml(task, taskId, subtask, backgroundColor, priorityText, priorityImage, assignedContactsHtml);
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
        subtaskHtml += SubtaskHTMLgerate(checkboxId, checkedAttribute, taskId, i, task);
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
    renderCategory();
    if (dropDownBox.classList.contains("d-none")) {
      dropDownBoxDnone(dropDownBox, childTaskContainer, categoryBox);
    } else {
      dropDownBoxElse(dropDownBox, childTaskContainer, categoryBox)
    }
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
   * Checks if the current element matches the specified element and resets it if true.
   * If not, resets the current element and sets the new element as the current element.
   * @param {string} elementId - The ID of the element to be checked.
   */
  function checkpriobox(elementId) {
    let element = document.getElementById(elementId);
    if (currentElement === element) {
      ifcurrentElement(element)
    } else {
      if (currentElement !== null) {
        ifcurrentElementNull()
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
  
