let currentElement = null;
let clickedId = null;
let allTasks = [];
let allCategory = [];
let allSubtask = [];
let selectedColor = [];


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


function openDropBoxCategory() {
  let dropDownBox = document.getElementById("dropDownBox");
  let childTaskContainer = document.getElementById("category");
  renderCategory();
  // Anzeigen des Dropdown-Menüs, wenn es ausgeblendet ist
  if (dropDownBox.classList.contains("d-none")) {
    dropDownBox.classList.remove("d-none");
    dropDownBox.classList.add("dropDownBox");
    childTaskContainer.classList.add("b-none");
  }
  // Schließen des Dropdown-Menüs, wenn es bereits sichtbar ist
  else {
    dropDownBox.classList.add("d-none");
    dropDownBox.classList.remove("dropDownBox");
    childTaskContainer.classList.remove("b-none");
  }
}

function newCategory(){
let categoryContainer = document.getElementById("categoryContainer");
let newCategoryContainer = document.getElementById("newCategoryContainer");
let categoryColors = document.getElementById("categoryColors");

categoryContainer.classList.add("d-none");
newCategoryContainer.classList.remove("d-none");
categoryColors.classList.remove("d-none");
categoryColors.classList.add("colorsContainer");

document.getElementById("newCategoryContainer").innerHTML =`<label for="Category">Category</label><div class="subtaskChildContainer" >
<input type="text" id="inputCategory" placeholder="New category name">
<div class="subImgContainer">
  <img onclick="closeNewCategory()" src="/img/iconoir_cancel_black.svg">
  <div class="searchBarLine"></div>
  <img onclick="addNewCategory()" id="subImg" src="/img/akar-icons_check_black.svg">
</div>
</div>`;
}

//Rendert die Dropbox und fügt aus dem Array alle gespeicherten Werte ein
async function renderCategory() {
  await load();
  let categoryBox = document.getElementById('categoryBox');
  categoryBox.innerHTML = '';
  for (let i = 0; i < allCategory.length; i++) {
    categoryBox.innerHTML += `<div onclick="selectCategory(${i})">${allCategory[i]}</div>`;
  }
}
//Lädt die Json aus dem Local Storage
async function load() {
  allCategory = JSON.parse(localStorage.getItem(`allCategory`)) || [];
}
// Speichert Json in das Local Storage
function save() {
  localStorage.setItem(`allCategory`, JSON.stringify(allCategory));
}


function addNewCategory(){
  let newCategory = document.getElementById('inputCategory').value;
  allCategory.push(newCategory);
  save();
  document.getElementById('inputCategory').value = ``;
  closeNewCategory();
  renderCategory();
  openDropBoxCategory()
}

function closeNewCategory(){
  let categoryContainer = document.getElementById("categoryContainer");
  let newCategoryContainer = document.getElementById("newCategoryContainer");
  let dropDownBox = document.getElementById("dropDownBox");
  let childTaskContainer = document.getElementById("category");
  let categoryColors = document.getElementById("categoryColors");

  categoryContainer.classList.remove("d-none");
  newCategoryContainer.classList.add("d-none");
  dropDownBox.classList.add("d-none");
  dropDownBox.classList.remove("dropDownBox");
  childTaskContainer.classList.remove("b-none");
  categoryColors.classList.add("d-none");
  categoryColors.classList.remove("colorsContainer");
}

function openDropBoxAssigned() {
  let dropDownUser = document.getElementById("dropDownUser");
  let childUserContainer = document.getElementById("assigned");
  // Anzeigen des Dropdown-Menüs, wenn es ausgeblendet ist
  if (dropDownUser.classList.contains("d-none")) {
    dropDownUser.classList.remove("d-none");
    dropDownUser.classList.add("dropDownBox");
    childUserContainer.classList.add("b-none");
  }
  // Schließen des Dropdown-Menüs, wenn es bereits sichtbar ist
  else {
    dropDownUser.classList.add("d-none");
    dropDownUser.classList.remove("dropDownBox");
    childUserContainer.classList.remove("b-none");
  }
}
// Wechselt die Symbole in der Subtaskleiste
function changeSubImg() {
  document.getElementById("subImgContainer").innerHTML =`<div class="subImgContainer">
  <img onclick="closeSubImg()" src="/img/iconoir_cancel_black.svg">
  <div class="searchBarLine"></div>
  <img onclick="addSubtask()" id="subImg" src="/img/akar-icons_check_black.svg">
</div>`;
}

//Schließt die Subtaskleiste und standart Bild wird eingefügt
function closeSubImg(){
  document.getElementById("subImgContainer").innerHTML =`<img src="/img/icon_cancel.svg">`;
  document.getElementById("subtask").value =``;
}

//Subtask wird gerendert und hinzugefügt
function addSubtask() {
  let subtask = document.getElementById("subtask").value;
  document.getElementById(
    "subTaskDescription"
  ).innerHTML += `<div class="checkContainer" ><input type="checkbox""><div id="subBox">${subtask}</div></div>`;
  document.getElementById("subtask").value = ``; 
  pushSubtask()
}

//Pusht den Subtask in das SubtaskArray
function pushSubtask(){
  let subtaskInfo = document.getElementById("subBox").innerHTML;
  allSubtask.push(subtaskInfo);
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

  if (currentElement === element) { // Check if clicked element is the same as current element
    element.style.backgroundColor = "";
    resetImage(element);
    currentElement = null;
    clickedId = null;
  } else {
    if (currentElement !== null) { // Check if there is a current element
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
  const dateInput = document.getElementById('date');
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
  dateInput.value = currentDate;
}


// Ein Json wird angelegt und in das Array AllTasks gepusht
function createTask() {
  const title = document.getElementById('title');
  const description = document.getElementById('description');
  const date = document.getElementById('date');
  
  // Überprüfen, ob ein Ziel angeklickt wurde
  if (!clickedId) {
    document.getElementById('prioBoxAlarm').innerHTML = `<div class="alarmBoxPrio">Select a priority!</div>`;
    return;
  }
  const priority = clickedId;
  

  
let allTask = {
    "title": title.value,
    "description": description.value,
    "date": date.value,
    "priority": priority,
    "subtask": allSubtask,
  };

  allTasks.push(allTask);
  allSubtask = [];
  clearTask();
  console.log(allTask);
}


function clearTask() {
  const title = document.getElementById('title');
  const description = document.getElementById('description');
  const alarmbox = document.getElementById('prioBoxAlarm');
  const subtask = document.getElementById('subtask');
  const subtaskDescription = document.getElementById('subTaskDescription');
  
  alarmbox.innerHTML =``;
  title.value = '';
  description.value = '';
  subtask.value = ``;
  subtaskDescription.innerHTML = ``;
  
  setCurrentDate();

  if (currentElement !== null ) {
    currentElement.style.backgroundColor = '';
    resetImage(currentElement);
  } 
}