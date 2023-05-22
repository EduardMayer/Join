let currentElement = null;
let clickedId = null;
let allTasks = [];
let allCategory = [];
let allSubtask = [];
let allColors = ["#E200BE","#1FD7C1","#0038FF","#FF8A00","#2AD300","#FF0000","#8AA4FF",];
let currentDraggedElement;
let currentTaskId;

load();

/**
 * Funktion zum Einbinden des HTML-Codes für den Header und die linke Navigationsleiste.
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
}
/**
 * Funktion zum Rendern der Karten auf dem Board.
 * Lädt alle Tasks vom Local Storage und rendert die entsprechenden Karten für die verschiedenen Statusbereiche (todo, progress, feedback, done).
 */
async function renderBoardCards() {
  // todo-Karten
  let todoTasks = allTasks.filter((task) => task.status === "todo");
  let todoBox = document.getElementById("todo");
  todoBox.innerHTML = "";
  for (let i = 0; i < todoTasks.length; i++) {
    let task = todoTasks[i];
    todoBox.innerHTML += generateCardHTML(task, i);
  }

  // progress-Karten
  let progressTasks = allTasks.filter((task) => task.status === "progress");
  let progressBox = document.getElementById("progress");
  progressBox.innerHTML = "";
  for (let i = 0; i < progressTasks.length; i++) {
    let task = progressTasks[i];
    progressBox.innerHTML += generateCardHTML(task, i);
  }

  // feedback-Karten
  let feedbackTasks = allTasks.filter((task) => task.status === "feedback");
  let feedbackBox = document.getElementById("feedback");
  feedbackBox.innerHTML = "";
  for (let i = 0; i < feedbackTasks.length; i++) {
    let task = feedbackTasks[i];
    feedbackBox.innerHTML += generateCardHTML(task, i);
  }

  // done-Karten
  let doneTasks = allTasks.filter((task) => task.status === "done");
  let doneBox = document.getElementById("done");
  doneBox.innerHTML = "";
  for (let i = 0; i < doneTasks.length; i++) {
    let task = doneTasks[i];
    doneBox.innerHTML += generateCardHTML(task, i);
  }
}
/**
 * Funktion zum Suchen und Filtern der Karten basierend auf dem eingegebenen Suchbegriff.
 * Sucht nach Übereinstimmungen im Titel und der Beschreibung der Karten und blendet nicht übereinstimmende Karten aus.
 */
function searchCards() {
  let searchInput = document.querySelector(".searchBarContainer input");
  let searchValue = searchInput.value.trim().toLowerCase();
  let cards = document.querySelectorAll(".card");
  let matchedCards = [];

  cards.forEach((card) => {
    let cardTitle = card.querySelector(".cardTitle").textContent.toLowerCase();
    let cardDescription = card
      .querySelector(".cardDescription")
      .textContent.toLowerCase();
    if (cardTitle.includes(searchValue) || cardDescription.includes(searchValue)) 
    { matchedCards.push(card);}
  });

  // Verstecke alle Karten
  cards.forEach((card) => {
    card.style.display = "none";
  });

  // Zeige nur die übereinstimmenden Karten an
  matchedCards.forEach((card) => {
    card.style.display = "block";
  });
}

/**
 * Funktion zur Berechnung des Fortschritts eines Tasks.
 * Zählt die abgeschlossenen Unteraufgaben und die Gesamtanzahl der Unteraufgaben und berechnet den Fortschritt in Prozent.
 * Gibt ein Objekt mit den Werten für abgeschlossene Unteraufgaben, Gesamtanzahl der Unteraufgaben und Fortschritt zurück.
 */
function generateProgress(task) {
  let completedSubtasks = task.subtaskChecked ? task.subtaskChecked.filter((checked) => checked).length : 0;
  let totalSubtasks = task.subtask ? task.subtask.length : 0;
  let progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  return { completedSubtasks, totalSubtasks, progress };
}
/**
 * Funktion zum Generieren des HTML-Codes für den Fortschrittsbalken-Container einer Aufgabenkarte.
 * Nimmt eine Task-Objekt als Parameter und gibt den entsprechenden HTML-Code zurück.
 */
function generateProgressBarContainerHTML(task) {
  let { completedSubtasks, totalSubtasks, progress } = generateProgress(task);

  let progressBarContainerHTML = "";
  if (task.subtask && task.subtask.length > 0) {
    progressBarContainerHTML = `
      <div class="progressBarContainer" id="progressBarContainer">
        <div class="cardProgress"><progress value="${progress}" max="100"></div>
        <div class="checkboxCount">${completedSubtasks}/${totalSubtasks} Done</div>
      </div>
    `;
  }
  return progressBarContainerHTML;
}

/**
 * Funktion zur Überprüfung der Priorität einer Aufgabenkarte.
 * Nimmt eine Task-Objekt als Parameter und gibt die entsprechenden Prioritätsinformationen zurück.
 */
function checkPrioPopupCard(task) {
  if (task.priority === "urgent") {
    priorityImage = "/img/Prio-urgent-white.png";
    priorityText = "Urgent";
    backgroundColor = "rgb(255, 61, 0)";
  } else if (task.priority === "medium") {
    priorityImage = "/img/Prio-medium-white.png";
    priorityText = "Medium";
    backgroundColor = "rgb(255, 168, 0)";
  } else {
    priorityImage = "/img/Prio-low-white.png";
    priorityText = "Low";
    backgroundColor = "rgb(122,226,41)";
  }
  return { priorityImage, priorityText, backgroundColor };
}

/**
 * Funktion zum Erstellen einer neuen Aufgabe.
 * Nimmt den Status als Parameter und erstellt eine Aufgabe mit den angegebenen Eigenschaften.
 */
function createTask(status) {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const date = document.getElementById("date");
  const categoryText = document.getElementById("categoryText");
  const categoryColor = document.getElementById("selectColorBox");
  let priority = clickedId;

  // Überprüfen, ob ein Ziel angeklickt wurde
  if (!clickedId) {
    document.getElementById(
      "prioBoxAlarm"
    ).innerHTML = `<div class="alarmBoxPrio">Select a priority!</div>`;
    return;
  }
  // Neue Aufgabe erstellen
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
  };

  allTasks.push(allTask);
  save();
  allSubtask = [];
  clearTask();
  window.location.href = "board.html";
}

/**
 * Funktion zum Zurücksetzen der Eingabefelder für eine neue Aufgabe.
 */
function clearTask() {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const alarmbox = document.getElementById("prioBoxAlarm");
  const subtask = document.getElementById("subtask");
  const subtaskDescription = document.getElementById("subTaskDescription");

  alarmbox.innerHTML = ``;
  title.value = "";
  description.value = "";
  subtask.value = ``;
  subtaskDescription.innerHTML = ``;

  setCurrentDate();
  clearCategory();

  if (currentElement !== null) {
    currentElement.style.backgroundColor = "";
    resetImage(currentElement);
  }
}

/**
 * Funktion zum Zurücksetzen der Kategorieauswahl.
 */
function clearCategory() {
  let category = document.getElementById("category");
  category.innerHTML = `<div id="categoryTextBox" class="categoryTextBox"><p>Select task category</p></div><div><img src="/img/arrowTask.svg"></div>`;
}

/**
 * Funktion zum Öffnen des Popups zum Hinzufügen einer neuen Aufgabe.
 * Nimmt den Status als Parameter und öffnet das entsprechende Popup-Fenster.
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
 * Funktion für die Schiebeanimation beim Öffnen des Aufgaben-Popups.
 */
function slideAnimation() {
  let mainAddTaskContainer = document.querySelector(".mainAddTaskContainer");
  let overlayDiv = document.createElement("div");
  mainAddTaskContainer.classList.add("open");
  mainAddTaskContainer.classList.remove("d-none");
  overlayDiv.classList.add("overlay");
  document.body.appendChild(overlayDiv);
  setCurrentDate();
}
/**
 * Schließt das Popup-Fenster für die Aufgabenkarte.
 */
function closePopupTaskCard() {
  let mainAddTaskContainer = document.querySelector(".mainAddTaskContainer");
  let overlayDiv = document.querySelector(".overlay");
  document.body.removeChild(overlayDiv);
  mainAddTaskContainer.classList.remove("open");
  mainAddTaskContainer.classList.add("d-none");
}

/**
 * Zeigt die Details einer Aufgabenkarte an.
 * @param {number} taskId - Die ID der Aufgabenkarte.
 */
function showCard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let overlayDiv = document.createElement("div");
  let popupCard = document.getElementById("popupContainer");
  let { priorityImage, priorityText, backgroundColor } = checkPrioPopupCard(task);
  let subtask = generateSubtaskHtml(task, taskId);
  overlayDiv.classList.add("overlay");
  document.body.appendChild(overlayDiv);
  popupCard.innerHTML = generatePopupCardHtml(task, taskId, subtask, backgroundColor, priorityText, priorityImage);
}

/**
 * Generates the HTML content for subtasks based on the task details.
 * @param {object} task - The task object.
 * @param {number} taskId - The ID of the task.
 * @returns {string} - The HTML content for subtasks.
 */
function generateSubtaskHtml(task, taskId) {
  let subtaskHtml = "";
  if (task.subtask && task.subtask.length > 0) {
    for (let i = 0; i < task.subtask.length; i++) {
      let checkboxId = `checkbox-${taskId}-${i}`;
      let checkedAttribute =
        task.subtaskChecked && task.subtaskChecked[i] ? "checked" : "";
      subtaskHtml += `
        <div class="popupCardSubItem">
          <input type="checkbox" class="popupCardCheckbox" id="${checkboxId}" ${checkedAttribute} onclick="updateProgress(${taskId}, ${i})">
          <span class="popupCardSubtask">${task.subtask[i]}</span>
        </div>
      `;
    }
  }
  return subtaskHtml;
}

/**
 * Aktualisiert den Fortschritt einer Unteraufgabe.
 * @param {number} taskId - Die ID der Aufgabenkarte.
 * @param {number} subtaskIndex - Der Index der Unteraufgabe.
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
 * Speichert den Zustand einer Checkbox.
 * @param {number} taskId - Die ID der Aufgabenkarte.
 * @param {number} subtaskIndex - Der Index der Unteraufgabe.
 */
function saveCheckboxState(taskId, subtaskIndex) {
  let checkboxId = `checkbox-${taskId}-${subtaskIndex}`;
  let checkbox = document.getElementById(checkboxId);
  let task = allTasks.find((task) => task.id === taskId);

  // Initialize subtaskChecked array if it doesn't exist
  if (!task.subtaskChecked) {
    task.subtaskChecked = [];
  }
  // Update the state in the task object
  task.subtaskChecked[subtaskIndex] = checkbox.checked; 

  // Save the task in the Local Storage (optional)
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

/**
 * Rendert die Auswahl der Kategorien.
 */
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
 * Setzt die Kategorienauswahl im Popup-Fenster.
 */
function setPopupCategoryCard() {
  let popupCategoryBox = document.getElementById("popupCategoryBox");
  popupCategoryBox.innerHTML = "";

  for (let i = 0; i < allCategory.length; i++) {
    const category = allCategory[i].category;
    const color = allCategory[i].color;
    popupCategoryBox.innerHTML += `<div class="colorPopupCategoryBox" style="background-color:${color}" onclick="selectPopupCategory(${i})" id="selectPopupCategory${i}"><div id="categoryPopupText">${category}</div><div class="selectColorBox" id="selectColorBox" style="background-color:${color};"></div></div>`;
  }
}

/**
 * Wählt eine Kategorie im Popup-Fenster aus.
 * @param {number} i - Der Index der ausgewählten Kategorie.
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
 * Funktion, um das Popup-Kartenelement zum Bearbeiten einer Aufgabe anzuzeigen.
 * @param {number} taskId - Die ID der Aufgabe, die bearbeitet werden soll.
 */
function editPopupCard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let today = new Date();
  let popupCard = document.getElementById("popupContainer");
  checkPrioPopupCard(task);
  popupCard.innerHTML = generateEditPopupCardHtml(task, taskId, today, popupCard);
}

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
 * Speichert den Zustand einer Aufgabenkarte.
 * @param {number} taskId - Die ID der Aufgabenkarte.
 */
function savePopupCard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let title = document.getElementById("popupCardTitle").value;
  let description = document.getElementById("popupcardDescription").value;
  let date = document.getElementById("popupCardDate").value;
  let categoryText = getCategoryText(task, "categoryPopupText");
  let categoryColor = getCategoryColor(task, "selectColorBox");  
  let priority = clickedId;
  
  if (!clickedId) {
    document.getElementById(
      "prioBoxAlarm"
    ).innerHTML = `<div class="alarmBoxPrio">Select a priority!</div>`;
    return;
  }
  
  // Update the task object with the new values
  task.title = title;
  task.description = description;
  task.date = date;
  task.categoryText = categoryText;
  task.categoryColor = categoryColor;
  task.priority = priority;

  updateTaskInArray(allTasks, taskId, task);
  closePopupCard();
}

function updateTaskInArray(allTasks, taskId, updatedTask) {
  let taskIndex = allTasks.findIndex((task) => task.id === taskId);
  allTasks.splice(taskIndex, 1, updatedTask);
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

/**
 * Schließt das Popup-Fenster für die Aufgabenkarte.
 */
function closePopupCard() {
  let popupCard = document.getElementById("popupContainer");
  let overlayDiv = document.querySelector(".overlay");
  if (overlayDiv) {
    document.body.removeChild(overlayDiv);
  }
  popupCard.innerHTML = "";
  renderBoardCards();
}

/**
 * Löscht eine Aufgabenkarte.
 * @param {number} taskId - Die ID der Aufgabenkarte.
 */
function deletePopupCard(taskId) {
  // Finde den Index der zu löschenden Aufgabe im allTasks-Array
  const taskIndex = allTasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    allTasks.splice(taskIndex, 1);
    save();
    renderBoardCards();
    closePopupCard();
  }
}

function highlight(id) {
  document.getElementById(id).classList.add("box-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("box-highlight");
}

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(status) {
  allTasks[currentDraggedElement]["status"] = status;
  save(); // Save the updated task list to local storage
  renderBoardCards(); // Update the UI with the new task status
}

// Dropbox für die Category
function openDropBoxCategory() {
  let dropDownBox = document.getElementById("dropDownBox");
  let childTaskContainer = document.getElementById("category");
  let categoryBox = document.getElementById("categoryBox");
  renderCategory();
  if (dropDownBox.classList.contains("d-none")) {
    dropDownBox.classList.remove("d-none");
    dropDownBox.classList.add("dropDownBox");
    childTaskContainer.classList.add("b-none");
    categoryBox.classList.remove("d-none");
    categoryBox.classList.add("categoryBox");
  } else {
    dropDownBox.classList.add("d-none");
    dropDownBox.classList.remove("dropDownBox");
    childTaskContainer.classList.remove("b-none");
    categoryBox.classList.add("d-none");
    categoryBox.classList.remove("categoryBox");
  }
}

//Neue Container für newCategory wird angezeigt / ausgeblendet
function newCategory() {
  let categoryContainer = document.getElementById("categoryContainer");
  let newCategoryContainer = document.getElementById("newCategoryContainer");
  let categoryColors = document.getElementById("categoryColors");

  categoryContainer.classList.add("d-none");
  newCategoryContainer.classList.remove("d-none");
  categoryColors.classList.remove("d-none");
  categoryColors.classList.add("colorsContainer");
  document.getElementById("newCategoryContainer").innerHTML = newCategoryHtml();
}

// Die Farben für Category wird gerendert
function renderColorCategory() {
  let categoryColors = document.getElementById("categoryColors");
  for (let i = 0; i < allColors.length; i++) {
    categoryColors.innerHTML += `<div onclick="selectColor(${i})" id="selectColor${i}" class="color" style="background-color: ${allColors[i]}">
    </div>`;
  }
}

// Farbe für Category wird ausgewählt
function selectColor(i) {
  let colorBox = document.getElementById("colorBox");
  colorBox.innerHTML = "";
  let selectedColor = document.createElement("div");
  selectedColor.style.backgroundColor = allColors[i];
  selectedColor.setAttribute("data-color", allColors[i]);
  selectedColor.classList.add("selected-color");
  colorBox.appendChild(selectedColor);
}

async function load() {
  allCategory = JSON.parse(localStorage.getItem("allCategory")) || [];
  allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
}

// Speichert Json in das Local Storage
function save() {
  localStorage.setItem(`allCategory`, JSON.stringify(allCategory));
  localStorage.setItem(`allTasks`, JSON.stringify(allTasks));
}

//Pusht die neue Category in das Array und Ausgangsbeschreibug wird angezeigt
function addNewCategory() {
  let newCategory = document.getElementById("inputCategory").value;
  let colorBox = document.getElementById("colorBox");
  let selectedColor = colorBox.querySelector(".selected-color");
  let newColor = selectedColor.getAttribute("data-color");
  allCategory.push({ category: newCategory, color: newColor });
  save();
  document.getElementById("inputCategory").value = ``;
  closeNewCategory();
  renderCategory();
  openDropBoxCategory();
}

// Category wird ausgewählt und hinzugefügt
function selectCategory(i) {
  let sourceDiv = document.getElementById(`selectCategory${i}`);
  let targetDiv = document.getElementById(`categoryTextBox`);

  targetDiv.innerHTML = sourceDiv.innerHTML;
  sourceDiv.parentNode.removeChild(sourceDiv);
  openDropBoxCategory();
}

// Category Container wird geschlossen
function closeNewCategory() {
  let categoryContainer = document.getElementById("categoryContainer");
  let newCategoryContainer = document.getElementById("newCategoryContainer");
  let dropDownBox = document.getElementById("dropDownBox");
  let childTaskContainer = document.getElementById("category");
  let categoryColors = document.getElementById("categoryColors");
  let categoryBox = document.getElementById("categoryBox");

  categoryBox.classList.add("d-none");
  categoryBox.classList.remove("categoryBox");
  categoryContainer.classList.remove("d-none");
  newCategoryContainer.classList.add("d-none");
  dropDownBox.classList.add("d-none");
  dropDownBox.classList.remove("dropDownBox");
  childTaskContainer.classList.remove("b-none");
  categoryColors.classList.add("d-none");
  categoryColors.classList.remove("colorsContainer");
  clearCategory();
}

// Dropbox öffnet/schließt sich
function openDropBoxAssigned() {
  let dropDownUser = document.getElementById("dropDownUser");
  let childUserContainer = document.getElementById("assigned");

  if (dropDownUser.classList.contains("d-none")) {
    dropDownUser.classList.remove("d-none");
    dropDownUser.classList.add("dropDownBox");
    childUserContainer.classList.add("b-none");
  } else {
    dropDownUser.classList.add("d-none");
    dropDownUser.classList.remove("dropDownBox");
    childUserContainer.classList.remove("b-none");
  }
}

// Wechselt die Symbole in der Subtaskleiste
function changeSubImg() {
  document.getElementById("subImgContainer").innerHTML = `<div class="subImgContainer">
  <img onclick="closeSubImg()" src="/img/iconoir_cancel_black.svg">
  <div class="searchBarLine"></div>
  <img onclick="addSubtask()" id="subImg" src="/img/akar-icons_check_black.svg">
</div>`;
}

//Schließt die Subtaskleiste und standart Bild wird eingefügt
function closeSubImg() {
  document.getElementById("subImgContainer").innerHTML = `<img src="/img/icon_cancel.svg">`;
  document.getElementById("subtask").value = ``;
}

//Subtask wird gerendert und hinzugefügt
function addSubtask() {
  let subtask = document.getElementById("subtask").value;
  document.getElementById(
    "subTaskDescription"
  ).innerHTML += `<div class="checkContainer"><input type="checkbox"><div class="subBox">${subtask}</div></div>`;
  document.getElementById("subtask").value = ``;
  pushSubtask();
}

//Pusht den Subtask in das SubtaskArray
function pushSubtask() {
  let subtaskElements = document.querySelectorAll(".subBox");
  let subtaskInfo = [];
  for (let i = 0; i < subtaskElements.length; i++) {
    subtaskInfo.push(subtaskElements[i].innerHTML);
  }
  allSubtask = subtaskInfo;
}

// Die Buttons für die Priorität zeigen Standartwert wieder an
function resetImage(box) {
  const img = box.querySelector("img");
  const defaultImg = img.dataset.defaultImg;
  img.src = defaultImg;
}

// Die Buttons für die Priorität bekommen nach anklicken eine neue Farbe
function checkpriobox(event) {
  let element = event.target;

  if (currentElement === element) {
    element.style.backgroundColor = "";
    resetImage(element);
    currentElement = null;
    clickedId = null;
  } else {
    if (currentElement !== null) {
      currentElement.style.backgroundColor = "";
      resetImage(currentElement);
    }

    if (element.id === "urgent") {
      element.style.backgroundColor = "rgb(255, 61, 0)";
      element.querySelector("img").src = "/img/Prio-urgent-white.png";
    } else if (element.id === "medium") {
      element.style.backgroundColor = "rgb(255, 168, 0)";
      element.querySelector("img").src = "/img/Prio-medium-white.png";
    } else if (element.id === "low") {
      element.style.backgroundColor = "rgb(122,226,41)";
      element.querySelector("img").src = "/img/Prio-low-white.png";
    }
    currentElement = element;
    clickedId = event.target.id;
  }
}

//Setzt das aktuelle Datum in das Datumfeld
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
  const currentDate = year + "-" + month + "-" + day;
  dateInput.min = currentDate; // set minimum date to current date
  dateInput.value = currentDate;
}