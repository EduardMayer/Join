let currentElement = null;
let clickedId = null;
let allTasks = [];
let allCategory = [];
let allSubtask = [];
let allColors = [
  "#E200BE",
  "#1FD7C1",
  "#0038FF",
  "#FF8A00",
  "#2AD300",
  "#FF0000",
  "#8AA4FF",
];
let selectedContacts = [];
let initialsColors = {};
let currentDraggedElement;
let currentTaskId;
load();
loadUsers();

/**
 * Funktion zum Einbinden des HTML-Codes für den Header und die linke Navigationsleiste.
 * Ruft eine Liste von Elementen ab, die das Attribut 'w3-include-html' haben, und lädt den entsprechenden HTML-Code für jedes Element.
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
 * Funktion zum Rendern der Aufgabenkarten auf dem Board basierend auf dem Status.
 * Ruft die Funktion 'renderTasksByStatus' für jeden Status auf und rendert die entsprechenden Aufgabenkarten in den entsprechenden Containern.
 */
async function renderBoardCards() {
  await load();
  renderTasksByStatus("todo", "todo");
  renderTasksByStatus("progress", "progress");
  renderTasksByStatus("feedback", "feedback");
  renderTasksByStatus("done", "done");
}

/**
 * Funktion zum Rendern der Aufgabenkarten basierend auf dem Status.
 * Filtert alle Aufgaben nach dem angegebenen Status und rendert die entsprechenden Aufgabenkarten im angegebenen Container.
 * @param {string} status - Der Status der Aufgaben.
 * @param {string} containerId - Die ID des Containers, in dem die Aufgabenkarten gerendert werden sollen.
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
 * Funktion zum Suchen und Filtern der Aufgabenkarten basierend auf dem eingegebenen Suchbegriff.
 * Sucht nach Übereinstimmungen im Titel und der Beschreibung der Aufgabenkarten und blendet nicht übereinstimmende Aufgabenkarten aus.
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
    if (
      cardTitle.includes(searchValue) ||
      cardDescription.includes(searchValue)
    ) {
      matchedCards.push(card);
    }
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
 * Funktion zur Berechnung des Fortschritts einer Aufgabe.
 * Zählt die abgeschlossenen Unteraufgaben und die Gesamtanzahl der Unteraufgaben und berechnet den Fortschritt in Prozent.
 * Gibt ein Objekt mit den Werten für abgeschlossene Unteraufgaben, Gesamtanzahl der Unteraufgaben und Fortschritt zurück.
 * @param {object} task - Das Task-Objekt.
 * @returns {object} - Ein Objekt mit den Werten für abgeschlossene Unteraufgaben, Gesamtanzahl der Unteraufgaben und Fortschritt.
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
 * Funktion zum Generieren des HTML-Codes für den Fortschrittsbalken-Container einer Aufgabenkarte.
 * Nimmt ein Task-Objekt als Parameter und gibt den entsprechenden HTML-Code zurück.
 * @param {object} task - Das Task-Objekt.
 * @returns {string} - Der generierte HTML-Code für den Fortschrittsbalken-Container.
 */
function generateProgressBarContainerHTML(task) {
  let { completedSubtasks, totalSubtasks, progress } = generateProgress(task);

  let progressBarContainerHTML = "";
  if (task.subtask && task.subtask.length > 0) {
    progressBarContainerHTML = `
  <div class="progressBarContainer" id="progressBarContainer">
    <div class="cardProgress"><progress value="${progress}" max="100"></progress></div>
    <div class="checkboxCount">${completedSubtasks}/${totalSubtasks} Done</div>
  </div>
`;
  }
  return progressBarContainerHTML;
}

/**
 * Funktion zur Überprüfung der Priorität einer Aufgabenkarte.
 * Nimmt ein Task-Objekt als Parameter und gibt die entsprechenden Prioritätsinformationen zurück.
 * @param {object} task - Das Task-Objekt.
 * @returns {object} - Ein Objekt mit den Prioritätsinformationen (Bild, Text und Hintergrundfarbe).
 */
async function checkPrioPopupCard(task) {
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
    backgroundColor = "rgb(122,226,41)";
  }
  return { priorityImage, priorityText, backgroundColor };
}

/**
 * Funktion zum Erstellen einer neuen Aufgabe.
 * Nimmt den Status als Parameter und erstellt eine Aufgabe mit den angegebenen Eigenschaften.
 * @param {string} status - Der Status der Aufgabe.
 */
function createTask(status) {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const date = document.getElementById("date");
  const categoryText = document.getElementById("categoryText");
  const categoryColor = document.getElementById("selectColorBox");
  let selectedContacts = getSelectedContacts();
  let priority = clickedId;

  // Überprüfen, ob ein Ziel angeklickt wurde
  if (checkPrioritySelected()) {
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
    contacts: selectedContacts,
  };

  showPopup();
  allTasks.push(allTask);
  save();
  allSubtask = [];
  clearTask();
}

function checkPrioritySelected() {
  if (!clickedId) {
    document.getElementById(
      "prioBoxAlarm"
    ).innerHTML = `<div class="alarmBoxPrio">Select a priority!</div>`;
    return true; // Gibt true zurück, wenn keine Priorität ausgewählt wurde
  }
  return false; // Gibt false zurück, wenn eine Priorität ausgewählt wurde
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
  title.value = ``;
  description.value = ``;
  subtask.value = ``;
  subtaskDescription.innerHTML = ``;

  setCurrentDate();
  clearCategory();
  clearDropBoxAssigned();
  resetElement(currentElement);
}

/**
 * Funktion zum Zurücksetzen des ausgewählten Elements und des Hintergrunds.
 * @param {object} currentElement - Das aktuelle ausgewählte Element.
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
 * Funktion zum Zurücksetzen der Kategorieauswahl.
 */
function clearCategory() {
  let category = document.getElementById("category");
  category.innerHTML = `<div id="categoryTextBox" class="categoryTextBox"><p>Select task category</p></div><div><img src="img/arrowTask.svg"></div>`;
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

  mainAddTaskContainer.style.transform = "translateX(150%)";
  overlayDiv.classList.add("overlay");
  document.body.appendChild(overlayDiv);
  setCurrentDate();

  // Warte kurz, um die Animation zu verzögern
  setTimeout(function () {
    mainAddTaskContainer.style.transform = "translate(0%)";
  }, 100);
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

function generateInitialsAndFullName(name) {
  const names = name.substring(0, name.indexOf(" ")).charAt(0);
  const lastnames = name.substring(name.indexOf(" ") + 1).charAt(0);

  // Überprüfe, ob die Farbe für die Initialen bereits vorhanden ist, sonst generiere eine neue
  const initialsBackgroundColor = initialsColors[name] || getRandomColor();

  // Speichere die Farbe im Objekt
  initialsColors[name] = initialsBackgroundColor;

  return `<div class="initialsNameBox"><div class="initials" id="initials" style="background-color:${initialsBackgroundColor}">${names}${lastnames}</div><div id="initialsName">${name}</div></div>`;
}

function generateInitials(name) {
  const names = name.substring(0, name.indexOf(" ")).charAt(0);
  const lastnames = name.substring(name.indexOf(" ") + 1).charAt(0);

  // Hole die gespeicherte Farbe für die Initialen oder generiere eine neue zufällige Farbe
  const initialsBackgroundColor = initialsColors[name] || getRandomColor(name);

  // Aktualisiere die Farbe im Objekt
  initialsColors[name] = initialsBackgroundColor;

  return `<div class="initialsSecond" id="initials" style="background-color:${initialsBackgroundColor}">${names}${lastnames}</div>`;
}

function generateFullName(name) {
  return `<div>${name}</div>`;
}

function getRandomColor(name) {
  let User = users.find(u => u.name == name)
  let color = User['color'];
  return color;
}

/**
 * Zeigt die Details einer Aufgabenkarte an.
 * @param {number} taskId - Die ID der Aufgabenkarte.
 */
async function showCard(taskId) {
  let screenWidth = window.innerWidth;
  if (screenWidth >= 769) {
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
    popupCard.innerHTML = generatePopupCardHtml(
      task,
      taskId,
      subtask,
      backgroundColor,
      priorityText,
      priorityImage,
      assignedContactsHtml
    );
  } else {
    let task = allTasks.find((task) => task.id === taskId);
    let showMainBoardContainer = document.getElementById(
      "showMainBoardContainer"
    );
    let mainBoardContainer = document.getElementById("mainBoardContainer");
    let { priorityImage, priorityText, backgroundColor } =
      checkPrioPopupCard(task);
    let subtask = generateSubtaskHtml(task, taskId);
    let assignedContactsHtml = task.contacts
      .map((contact) => generateInitialsAndFullName(contact))
      .join("");
    mainBoardContainer.style.display = "none";
    showMainBoardContainer.innerHTML = generateShowCardHtml(
      task,
      taskId,
      subtask,
      backgroundColor,
      priorityText,
      priorityImage,
      assignedContactsHtml
    );
  }
  
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
  setItem("allTasks", JSON.stringify(allTasks));
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

function renderAllContacts(taskId) {
  let dropDownUser = document.getElementById("dropDownUser");
  dropDownUser.innerHTML = "";

  for (let i = 0; i < allContacts.length; i++) {
    const name = allContacts[i];
    const isChecked = selectedContacts.includes(name) ? "checked" : ""; // Überprüfe, ob der Kontakt ausgewählt ist
    dropDownUser.innerHTML += `<div class="contactBox"><input type="checkbox" id="contact${i}" name="contact${i}" ${isChecked} onchange="saveSelectedContact(${i})"><label for="contact${i}">${name}</label></div>`;
  }

  markMatchingContacts(taskId);
}

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

function saveSelectedContact(index) {
  const checkbox = document.getElementById(`contact${index}`);
  const contactName = allContacts[index];

  if (checkbox.checked) {
    // Checkbox wurde ausgewählt, füge den Kontakt zur Liste hinzu
    selectedContacts.push(contactName);
  } else {
    // Checkbox wurde abgewählt, entferne den Kontakt aus der Liste
    const contactIndex = selectedContacts.indexOf(contactName);
    if (contactIndex !== -1) {
      selectedContacts.splice(contactIndex, 1);
    }
  }
}

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
 * Setzt die Kategorienauswahl im Popup-Fenster.
 */
function setPopupCategoryCard() {
  let popupCategoryBox = document.getElementById("popupCategoryBox");

  // Überprüfe, ob der Popup-Container bereits sichtbar ist
  if (popupCategoryBox.innerHTML !== "") {
    popupCategoryBox.innerHTML = ""; // Wenn sichtbar, leere den Inhalt und beende die Funktion
    return;
  }

  // Wenn nicht sichtbar, erzeuge den Inhalt wie zuvor
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
async function editPopupCard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let today = new Date();
  let popupCard = document.getElementById("popupContainer");
  await checkPrioPopupCard(task);
  popupCard.innerHTML = generateEditPopupCardHtml(task, taskId, today);
  renderAllContacts(taskId);
}

/**
 * Funktion, um das Popup-Kartenelement zum Bearbeiten einer Aufgabe anzuzeigen.
 * @param {number} taskId - Die ID der Aufgabe, die bearbeitet werden soll.
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
 * Funktion zum Abrufen des Kategorietexts für eine Aufgabenkarte.
 * Nimmt ein Task-Objekt und die ID des Standard-Textelements entgegen.
 * Ruft das Textelement anhand der angegebenen ID ab und gibt den darin enthaltenen Text zurück.
 * Wenn das Textelement nicht gefunden wird oder keinen Text enthält, wird der Kategorietext aus dem Task-Objekt verwendet.
 * @param {object} task - Das Task-Objekt.
 * @param {string} defaultTextElementId - Die ID des Standard-Textelements.
 * @returns {string} - Der Kategorietext.
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
 * Funktion zum Abrufen der Kategoriefarbe für eine Aufgabenkarte.
 * Nimmt ein Task-Objekt und die ID des Standard-Farbelements entgegen.
 * Ruft das Farbelement anhand der angegebenen ID ab und gibt die Hintergrundfarbe zurück.
 * Wenn das Farbelement nicht gefunden wird oder keine Hintergrundfarbe enthält, wird die Kategoriefarbe aus dem Task-Objekt verwendet.
 * @param {object} task - Das Task-Objekt.
 * @param {string} defaultColorElementId - Die ID des Standard-Farbelements.
 * @returns {string} - Die Kategoriefarbe.
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
  let selectedContacts = getSelectedContacts(); // Speichert die ausgewählten Kontakte in einer Variablen
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
  task.contacts = selectedContacts; // Aktualisiert die ausgewählten Kontakte in der Aufgabe

  updateTaskInArray(allTasks, taskId, task);
  resetElement(currentElement);
  closePopupCard();
  closeShowCard();
}

/**
 * Funktion zum Aktualisieren der Beschreibung für eine Aufgabenkarte.
 * Aktualisiert die Beschreibung für die gegebene Aufgabenkarte.
 * @param {string} taskId - Die ID der Aufgabenkarte.
 */
function updateTaskInArray(allTasks, taskId, updatedTask) {
  let taskIndex = allTasks.findIndex((task) => task.id === taskId);
  allTasks.splice(taskIndex, 1, updatedTask);
  setItem("allTasks", JSON.stringify(allTasks));
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

function closeShowCard() {
  let showMainBoardContainer = document.getElementById(
    "showMainBoardContainer"
  );
  let mainBoardContainer = document.getElementById("mainBoardContainer");
  mainBoardContainer.style.display = "block";
  showMainBoardContainer.innerHTML = "";
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
 * Fügt der Element-ID die CSS-Klasse "box-highlight" hinzu, um das Element hervorzuheben.
 * @param {string} id - Die ID des Elements, das hervorgehoben werden soll.
 */
function highlight(id) {
  document.getElementById(id).classList.add("box-highlight");
}
/**
 * Entfernt die CSS-Klasse "box-highlight" von der Element-ID, um das Element nicht mehr hervorzuheben.
 * @param {string} id - Die ID des Elements, von dem die Hervorhebung entfernt werden soll.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("box-highlight");
}
/**
 * Setzt das aktuell gezogene Element auf die angegebene ID.
 * @param {string} id - Die ID des gezogenen Elements.
 */
function startDragging(id) {
  currentDraggedElement = id;
}
/**
 * Erlaubt das Ablegen von Elementen in einem Drop-Bereich.
 * @param {object} ev - Das Ereignisobjekt für das Drag & Drop-Ereignis.
 */
function allowDrop(ev) {
  ev.preventDefault();
}
/**
 * Ändert den Status einer Aufgabe auf den angegebenen Wert.
 * Aktualisiert die Aufgabenliste im Local Storage und die Benutzeroberfläche.
 * @param {string} status - Der neue Status der Aufgabe.
 */
function moveTo(status) {
  allTasks[currentDraggedElement]["status"] = status;
  save();
  renderBoardCards();
}

function moveToStatus(taskId, status) {
  allTasks[taskId].status = status;
  save();
  renderBoardCards();
  closeShowCard();
}

/**
 * Zeigt den Container für die Erstellung einer neuen Kategorie an und rendert die Farben für die Kategorieauswahl.
 */
function newCategory() {
  let categoryContainer = document.getElementById("categoryContainer");
  let newCategoryContainer = document.getElementById("newCategoryContainer");
  let categoryColors = document.getElementById("categoryColors");
  renderColorCategory();
  categoryContainer.classList.add("d-none");
  newCategoryContainer.classList.remove("d-none");
  categoryColors.classList.remove("d-none");
  categoryColors.classList.add("colorsContainer");
  document.getElementById("newCategoryContainer").innerHTML = newCategoryHtml();
}

/**
 * Rendert die Farben für die Kategorieauswahl.
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
 * Wählt eine Farbe für die Kategorieauswahl aus und aktualisiert die Anzeige.
 * @param {number} i - Der Index der ausgewählten Farbe.
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
 * Lädt die gespeicherten Daten aus dem Local Storage.
 * Ruft die Funktionen "renderCategory" auf, um die Kategorien anzuzeigen.
 */
async function load() {
  let allCategoryInString = await getItem("allCategory");
  allCategory = JSON.parse(allCategoryInString) || [];
  let allTaskInString = await getItem("allTasks");
  allTasks = JSON.parse(allTaskInString) || [];
}

/**
 * Speichert die aktuellen Daten im Local Storage.
 */
async function save() {
  await setItem("allTasks", JSON.stringify(allTasks));
  await setItem("allCategory", JSON.stringify(allCategory));
}

/**
 * Fügt eine neue Kategorie basierend auf den Eingaben hinzu.
 * Speichert die Kategorie im Array "allCategory" und aktualisiert die Benutzeroberfläche.
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
 * Wählt eine Kategorie aus und fügt sie in das Textfeld ein.
 * Entfernt die ausgewählte Kategorie aus der Dropdown-Box.
 */
function selectCategory(i) {
  let sourceDiv = document.getElementById(`selectCategory${i}`);
  let targetDiv = document.getElementById(`categoryTextBox`);

  targetDiv.innerHTML = sourceDiv.innerHTML;
  sourceDiv.parentNode.removeChild(sourceDiv);
  openDropBoxCategory();
}

/**
 * Schließt den Container für die Erstellung einer neuen Kategorie und setzt die Anzeige zurück.
 */
function closeNewCategory() {
  let categoryContainer = document.getElementById("categoryContainer");
  let newCategoryContainer = document.getElementById("newCategoryContainer");
  let dropDownBox = document.getElementById("newCategoryBox");
  let childTaskContainer = document.getElementById("category");
  let categoryColors = document.getElementById("categoryColors");
  let categoryBox = document.getElementById("categoryBox");

  categoryBox.classList.add("d-none");
  categoryBox.classList.remove("categoryBox");
  categoryColors.classList.add("d-none");
  categoryColors.classList.remove("colorsContainer");
  categoryContainer.classList.remove("d-none");
  newCategoryContainer.classList.add("d-none");
  childTaskContainer.classList.remove("b-none");
  dropDownBox.classList.add("d-none");
  dropDownBox.classList.remove("dropDownBox");

  clearCategory();
}

/**
 * Öffnet oder schließt die Dropdown-Box für die Zuweisung an einen Benutzer.
 */
function openDropBoxAssigned(taskId) {
  let dropDownUser = document.getElementById("dropDownUser");
  let childUserContainer = document.getElementById("assigned");
  renderAllContacts(taskId);
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

function openDropBoxEditAssigned(taskId) {
  let dropDownUser = document.getElementById("dropDownUser");
  let childUserContainer = document.getElementById("assigned");
  renderAllContacts(taskId);
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

function clearDropBoxAssigned() {
  let dropDownUser = document.getElementById("dropDownUser");
  let childUserContainer = document.getElementById("assigned");
  selectedContacts = [];
  dropDownUser.classList.add("d-none");
  dropDownUser.classList.remove("dropDownBox");
  childUserContainer.classList.remove("b-none");
}

/**
 * Öffnet oder schließt die Dropdown-Box für die Kategorieauswahl.
 * Zeigt die Kategorien anhand der renderCategory-Funktion an.
 */
function openDropBoxCategory() {
  let dropDownBox = document.getElementById("newCategoryBox");
  let childTaskContainer = document.getElementById("category");
  let categoryBox = document.getElementById("categoryBox");
  renderCategory();
  if (dropDownBox.classList.contains("d-none")) {
    dropDownBox.classList.remove("d-none");
    dropDownBox.classList.add("newCategoryBox");
    childTaskContainer.classList.add("b-none");
    categoryBox.classList.remove("d-none");
    categoryBox.classList.add("categoryBox");
  } else {
    dropDownBox.classList.add("d-none");
    dropDownBox.classList.remove("newCategoryBox");
    childTaskContainer.classList.remove("b-none");
    categoryBox.classList.add("d-none");
    categoryBox.classList.remove("categoryBox");
  }
}

/**
 * Ändert die Symbole in der Subtask-Leiste, um die Subtask-Eingabe anzuzeigen.
 */
function changeSubImg() {
  document.getElementById(
    "subImgContainer"
  ).innerHTML = `<div class="subImgContainer">
  <img onclick="closeSubImg()" src="img/iconoir_cancel_black.svg">
  <div class="searchBarLine"></div>
  <img onclick="addSubtask()" id="subImg" src="img/akar-icons_check_black.svg">
</div>`;
}

/**
 * Schließt die Subtask-Leiste und setzt das Standardbild ein.
 */
function closeSubImg() {
  document.getElementById(
    "subImgContainer"
  ).innerHTML = `<img src="img/icon_cancel.svg">`;
  document.getElementById("subtask").value = ``;
}

/**
 * Fügt einen Subtask hinzu und aktualisiert die Anzeige.
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
 * Aktualisiert das Subtask-Array mit den aktuellen Subtask-Informationen.
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
 * Setzt das Standardbild für die Prioritätsbuttons wieder ein.
 * @param {object} box - Das HTML-Element des Prioritätsbuttons.
 */
function resetImage(box) {
  const img = box.querySelector("img");
  const defaultImg = img.dataset.defaultImg;
  img.src = defaultImg;
}
/**
 * Ändert die Hintergrundfarbe und das Symbolbild des ausgewählten Prioritätsbuttons.
 * @param {object} event - Das Ereignisobjekt für das Klicken auf den Prioritätsbutton.
 */
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
      element.querySelector("img").src = "img/Prio-urgent-white.png";
    } else if (element.id === "medium") {
      element.style.backgroundColor = "rgb(255, 168, 0)";
      element.querySelector("img").src = "img/Prio-medium-white.png";
    } else if (element.id === "low") {
      element.style.backgroundColor = "rgb(122,226,41)";
      element.querySelector("img").src = "img/Prio-low-white.png";
    }
    currentElement = element;
    clickedId = event.target.id;
  }
}

/**
 * Setzt das aktuelle Datum als Standardwert im Datumfeld.
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
  const currentDate = year + "-" + month + "-" + day;
  dateInput.min = currentDate; // set minimum date to current date
  dateInput.value = currentDate;
}

function showPopup() {
  const popup = document.querySelector(".popupAddTaskBoard");
  popup.style.transform = "translate(-50%, -50%)";
  setTimeout(hidePopup, 1000);
}

function hidePopup() {
  const popup = document.querySelector(".popupAddTaskBoard");
  popup.style.transform = "translate(-50%, 500%)";
  window.location.href = "board.html";
}
