let currentElement = null;
let clickedId = null;
let allTasks = [];
let allCategory = [];
let allSubtask = [];
let subtaskChecked = [];
let allColors = [
  "#E200BE",
  "#1FD7C1",
  "#0038FF",
  "#FF8A00",
  "#2AD300",
  "#FF0000",
  "#8AA4FF",
];

let currentDraggedElement;
let currentTaskId;

load();

// Header und linke Navigationsleiste wird hinzugefügt
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

async function renderBoardCards() {
  // lade alle Tasks vom Local Storage

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

function searchCards() {
  let searchInput = document.querySelector(".searchBarContainer input");
  let searchValue = searchInput.value.trim().toLowerCase();

  let cards = document.querySelectorAll(".card");
  let matchedCards = [];

  cards.forEach((card) => {
    let cardTitle = card.querySelector(".cardTitle").textContent.toLowerCase();
    let cardDescription = card.querySelector(".cardDescription").textContent.toLowerCase();

    if (cardTitle.includes(searchValue) || cardDescription.includes(searchValue)) {
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

function generateCardHTML(task) {
  return`
    <div draggable="true" onclick="showCard(${task["id"]})" ondragstart="startDragging(${task["id"]})" class="card">
      <div class="cardCategory" style="background-color:${task.categoryColor}">${task.categoryText}</div>
      <div class="cardTitle">${task.title}</div>
      <div class="cardDescription">${task.description}</div>
      <div class="lowerCard">
        <div class="cardUser"></div>
        <div class="cardPrio"><img src="img/${task.priority}.svg"></div>
      </div>
    </div>
  `;
}

function checkPrioPopupCard(task) {
  let priorityImage, priorityText, backgroundColor;
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



function showCard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let overlayDiv = document.createElement("div");
  let popupCard = document.getElementById("popupContainer");
  let { priorityImage, priorityText, backgroundColor } = checkPrioPopupCard(task);
  overlayDiv.classList.add("overlay");
  document.body.appendChild(overlayDiv);
  let subtask = '';
  for (let i = 0; i < task.subtask.length; i++) {
    subtask += `
      <div class="popupCardSubItem">
        <input type="checkbox" class="popupCardCheckbox">
        <span class="popupCardSubtask">${task.subtask[i]}</span>
      </div>
    `;
  }

  popupCard.innerHTML = `
    <div class="popupCard">
      <div>
        <div class="cancelIconPopupCard" onclick="closePopupCard()"><img src="/img/cross.png"></div>
        <div class="popupcardCategory" style="background-color:${task.categoryColor}">${task.categoryText}</div>
      </div>
      <div class="popupCardTitle" id="popupCardTitle">${task.title}</div>
      <div class="popupcardDescription" id="popupcardDescription">${task.description}</div>
      <div class="popupCardDate" id="popupCardDate"><b>Due date:</b><div>${task.date}</div></div>
      <div class="popupPrioContainer" id="popupPrioContainer" ><b>Priority:</b>
        <div class="popupPrioBox" id="popupPrioBox" style="background-color:${backgroundColor}">${priorityText} <img src="${priorityImage}"></div>
      </div>

      <div class="popupCardAssigned"><b>Assigned To:</b></div>
      <div class="popupCardLowerContainer">
        <div class="popupCardSubContainer">
          <div><b>Subtasks</b></div>
          <div id="popupCardSubBox" class="popupCardSubBox">${subtask}</div>
        </div>
        <div class="popupCardImgContainer">
          <div class="popupCardImgBox">
            <div class="popupDeletButton" onclick="deletePopupCard(${taskId})"><img src="/img/deletebuttonv1.png"></div>
            <div class="popupEditButton" onclick="editPopupCard(${taskId})"><img src="/img/editbuttonv1.png"></div>
          </div> 
        </div>  
      </div>  
    </div>
  `;
}

function editPopupCard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let today = new Date();
  let popupCard = document.getElementById("popupContainer");
  checkPrioPopupCard(task);
  
  popupCard.innerHTML = `
    <div class="popupCard">
      <div>
        <div class="cancelIconPopupCard" onclick="closePopupCard()"><img src="/img/cross.png"></div>
        <div class="popupcardCategory" style="background-color:${task.categoryColor}">${task.categoryText}</div>
      </div>
      <div class="popupCardtitleContainer">
          <label for="title">Title</label>
          <input type="text" class="popupCardTitle" id="popupCardTitle" value="${task.title}">
      </div>
      <div class="popupCarddescriptionContainer">
          <label for="description">Description</label>
          <textarea class="popupcardDescription" id="popupcardDescription">${task.description}</textarea>
      </div>
      <div class="popupCarddateContainer">
      <label for="date">Due date</label>
      <input type="date" class="popupCardDate" id="popupCardDate" min="${today.toISOString().split('T')[0]}" value="${task.date}">
      </div>
      <div class="popupCardprioContainer" id="prioContainer">
      <label for="Prio">Prio</label>
      <div class="prioChildContainer">
          <div id="urgent" onclick="checkpriobox(event)" class="popupCardprioBox">
              Urgent
              <img src="/img/urgent.svg" data-default-img="/img/urgent.svg" alt="Urgent Priority">
          </div>
          <div id="medium" onclick="checkpriobox(event)" class="popupCardprioBox">
              Medium
              <img src="/img/medium.svg" data-default-img="/img/medium.svg" alt="Medium Priority">
          </div>
          <div id="low" onclick="checkpriobox(event)" class="popupCardprioBox">
              Low
              <img src="/img/low.svg" data-default-img="/img/low.svg" alt="Low Priority">
          </div>
      </div>
      <div id="prioBoxAlarm"></div>
      <div class="popupCardEditAssigned"><b>Assigned To:</b></div>
      <div class="popupCardEditImgContainer">
        <div><button class="popupSaveButton" onclick="savePopupCard(${taskId})">Save<img src="/img/akar-icons_check.svg"></button></div>
      </div>
      
  </div>
  
  `;
}

function closePopupCard() {
  let popupCard = document.getElementById("popupContainer");
  let overlayDiv = document.querySelector(".overlay");
  if (overlayDiv) {
    document.body.removeChild(overlayDiv);
  }
  popupCard.innerHTML = "";
}

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
function highlight(id){
document.getElementById(id).classList.add('box-highlight');
}

function removeHighlight(id){
document.getElementById(id).classList.remove('box-highlight');
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
  document.getElementById(
    "newCategoryContainer"
  ).innerHTML = `<label for="Category">Category</label><div class="subtaskChildContainer" >
<div id="colorBox" class="colorBox"></div>
<input type="text" id="inputCategory" placeholder="New category name">
<div class="subImgContainer">
  <img onclick="closeNewCategory()" src="/img/iconoir_cancel_black.svg">
  <div class="searchBarLine"></div>
  <img onclick="addNewCategory()" id="subImg" src="/img/akar-icons_check_black.svg">
</div>
</div>`;
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

//Rendert die Dropbox der Category und fügt aus dem Array alle gespeicherten Werte ein
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
//Lädt die Json aus dem Local Storage
async function load() {
  allCategory = JSON.parse(localStorage.getItem(`allCategory`)) || [];
  allTasks = JSON.parse(localStorage.getItem(`allTasks`)) || [];
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
  document.getElementById(
    "subImgContainer"
  ).innerHTML = `<div class="subImgContainer">
  <img onclick="closeSubImg()" src="/img/iconoir_cancel_black.svg">
  <div class="searchBarLine"></div>
  <img onclick="addSubtask()" id="subImg" src="/img/akar-icons_check_black.svg">
</div>`;
}

//Schließt die Subtaskleiste und standart Bild wird eingefügt
function closeSubImg() {
  document.getElementById(
    "subImgContainer"
  ).innerHTML = `<img src="/img/icon_cancel.svg">`;
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

// Ein Json wird angelegt und in das Array AllTasks gepusht
function createTask(status) {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const date = document.getElementById("date");
  const categoryText = document.getElementById("categoryText");
  const categoryColor = document.getElementById("selectColorBox");
  const priority = clickedId;

  // Überprüfen, ob ein Ziel angeklickt wurde
  if (!clickedId) {
    document.getElementById(
      "prioBoxAlarm"
    ).innerHTML = `<div class="alarmBoxPrio">Select a priority!</div>`;
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
  };

  allTasks.push(allTask);
  save();
  allSubtask = [];
  clearTask();
  window.location.href = "board.html";
}

// Die Felder vom AddTask werden resettet
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

// Categoryfeld bekommt Standart Beschreibung
function clearCategory() {
  let category = document.getElementById("category");
  category.innerHTML = `<div id="categoryTextBox" class="categoryTextBox"><p>Select task category</p></div><div><img src="/img/arrowTask.svg"></div>`;
}

function openAddTaskContainer(status) {
  let popupAddTaskContainer = document.getElementById('popupAddTaskContainer');
  popupAddTaskContainer.innerHTML=``;
  popupAddTaskContainer.innerHTML += popupAddTaskContainerTemplate(status);
  slideAnimation()
}

function slideAnimation(){
  let mainAddTaskContainer = document.querySelector(".mainAddTaskContainer");
  let overlayDiv = document.createElement("div");
  mainAddTaskContainer.classList.add("open");
  mainAddTaskContainer.classList.remove("d-none");
  overlayDiv.classList.add("overlay");
  document.body.appendChild(overlayDiv);
  setCurrentDate()
}

function closePopupTaskCard() {
  let mainAddTaskContainer = document.querySelector(".mainAddTaskContainer");
  let overlayDiv = document.querySelector(".overlay");
  document.body.removeChild(overlayDiv);
  mainAddTaskContainer.classList.remove("open");
  mainAddTaskContainer.classList.add("d-none");
  
}

function popupAddTaskContainerTemplate(status) {
  return`
    <div class="mainAddTaskContainer ">
    <div class="cancelIconPopupCard" onclick="closePopupTaskCard()"><img src="/img/cross.png"></div>
    <div class="headAddTaskContainer">
    <p>Add Task</p>
    </div>
    <div class="bodyAddTaskCotnainer">
      <div class="leftTaskContainer">
        <div class="titleContainer">
          <label for="title">Title</label>
          <input type="text" id="title" placeholder="Enter a title">
        </div>
        <div class="descriptionContainer">
          <label for="description">Description</label>
          <textarea name="description" id="description" placeholder="Enter a Description"></textarea>
        </div>
        <div class="categoryContainer" id="categoryContainer">
          <label for="Category">Category</label>
          <div onclick="openDropBoxCategory()" class="childTaskContainer" id="category">
            <div id="categoryTextBox" class="categoryTextBox">
              <p>Select task category</p>
            </div>
            <div><img src="/img/arrowTask.svg"></div>
          </div>
          <div onclick="newCategory()" class="d-none" id="dropDownBox">
            <div>New Category</div>
          </div>
          <div id="categoryBox" class="d-none"></div>
        </div>
        <div class="d-none" id="newCategoryContainer">
        </div>
        <div id="categoryColors" class="d-none">
        </div>
        <div class="assignedToContainer">
          <label for="Category">Assigned to</label>
          <div onclick="openDropBoxAssigned()" class="childTaskContainer" id="assigned">
            <p>Select contacts to assign</p>
            <img src="/img/arrowTask.svg">
          </div>
          <div class="d-none" id="dropDownUser"></div>
        </div>
      </div>
      <div class="middleTaskContainer"></div>
      <div class="rightAddTaskContainer">
        <div>
          <div class="dateContainer">
            <label for="date">Due date</label>
            <input type="date" id="date">
          </div>
        </div>
        <div class="prioContainer" id="prioContainer">
          <label for="Prio">Prio</label>
          <div class="prioChildContainer">
            <div id="urgent" onclick="checkpriobox(event)" class="prioBox">
              Urgent
              <img src="/img/urgent.svg" data-default-img="/img/urgent.svg" alt="Urgent Priority">
            </div>
            <div id="medium" onclick="checkpriobox(event)" class="prioBox">
              Medium
              <img src="/img/medium.svg" data-default-img="/img/medium.svg" alt="Medium Priority">
            </div>
            <div id="low" onclick="checkpriobox(event)" class="prioBox">
              Low
              <img src="/img/low.svg" data-default-img="/img/low.svg" alt="Low Priority">
            </div>
          </div>
          <div id="prioBoxAlarm"></div>
        </div>
        <div class="subtaskContainer">
          <label for="subtaskChildInput">Subtasks</label>
          <div class="subtaskChildContainer">
              <input onclick="changeSubImg()" id="subtask" type="text" placeholder="Add new subtask">
              <div class="subImgContainer" id="subImgContainer"><img src="/img/icon_cancel.svg"></div>
          </div>
      </div>
      <div id="subTaskDescription" class="subTaskDescription">
      </div>
    </div>
  </div>
  <div class="buttonTaskContainer">
  <button class="buttonTask" onclick="clearTask()">Clear <img class="cancelIcon"
    src="/img/iconoir_cancel.svg"></button>
  <button class="buttonTask2" onclick="createTask('${status}')">Create Task<img src="/img/akar-icons_check.svg"></button>
</div>
</div>`;
}


