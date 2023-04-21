let currentElement = null;

// Header und links Navigtionsleiste wird hinzugefügt
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
  let childTaskContainer = document.getElementById("childTaskContainer");
  // Anzeigen des Dropdown-Menüs, wenn es ausgeblendet ist
  if (dropDownBox.classList.contains("d-none")) {
    dropDownBox.classList.remove("d-none");
    dropDownBox.classList.add("dropDownBox");
    childTaskContainer.classList.add("d-border");
  }
  // Schließen des Dropdown-Menüs, wenn es bereits sichtbar ist
  else {
    dropDownBox.classList.add("d-none");
    dropDownBox.classList.remove("dropDownBox");
    childTaskContainer.classList.remove("d-border");
  }
}

function openDropBoxAssigned() {
  let dropDownUser = document.getElementById("dropDownUser");
  let childUserContainer = document.getElementById("childUserContainer");
  // Anzeigen des Dropdown-Menüs, wenn es ausgeblendet ist
  if (dropDownUser.classList.contains("d-none")) {
    dropDownUser.classList.remove("d-none");
    dropDownUser.classList.add("dropDownBox");
    childUserContainer.classList.add("d-border");
  }
  // Schließen des Dropdown-Menüs, wenn es bereits sichtbar ist
  else {
    dropDownUser.classList.add("d-none");
    dropDownUser.classList.remove("dropDownBox");
    childUserContainer.classList.remove("d-border");
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

//Subtask wird hinzugefügt
function addSubtask() {
  let subtask = document.getElementById("subtask").value;
  document.getElementById(
    "subTaskDescription"
  ).innerHTML += `<div class="checkContainer"><input type="checkbox"> ${subtask}</div>`;
  document.getElementById("subtask").value = ``;
}

// Die Buttons für die Priorität bekommen nach anklicken eine neue Farbe
function resetImage(box) {
  const img = box.querySelector("img");
  const defaultImg = img.dataset.defaultImg;
  img.src = defaultImg;
}

function checkpriobox(event) {
  let element = event.target;

  if (currentElement !== null) {
    currentElement.style.backgroundColor = "";
    resetImage(currentElement);
  }

  if (element.id === "urgentbox") {
    element.style.backgroundColor = "rgb(255, 61, 0)";
    element.querySelector("img").src = "/img/Prio-urgent-white.png";
  } else if (element.id === "mediumbox") {
    element.style.backgroundColor = "rgb(255, 168, 0)";
    element.querySelector("img").src = "/img/Prio-medium-white.png";
  } else if (element.id === "lowbox") {
    element.style.backgroundColor = "rgb(122,226,41)";
    element.querySelector("img").src = "/img/Prio-low-white.png";
  }

  currentElement = element;
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