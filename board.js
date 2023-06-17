let currentElement = null;
let clickedId = null;
let allTasks = [];
let allCategory = [];
let allSubtask = [];
let allColors = ["#E200BE","#1FD7C1","#0038FF","#FF8A00","#2AD300","#FF0000","#8AA4FF",];
let selectedContacts = [];
let initialsColors = {};
let currentDraggedElement;
let currentTaskId;
load();
loadUsers();

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

async function renderBoardCards() {
  await load();
  renderTasksByStatus("todo", "todo");
  renderTasksByStatus("progress", "progress");
  renderTasksByStatus("feedback", "feedback");
  renderTasksByStatus("done", "done");
}

function renderTasksByStatus(status, containerId) {
  const tasks = allTasks.filter((task) => task.status === status);
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  tasks.forEach((task, index) => { 
    container.innerHTML += generateCardHTML(task, index);
  });
}

function searchCards() {
  const searchInput = document.querySelector(".searchBarContainer input");
  const searchValue = searchInput.value.trim().toLowerCase();
  const cards = document.querySelectorAll(".card");
  const matchedCards = [];
  cards.forEach((card) => {const cardTitle = card.querySelector(".cardTitle").textContent.toLowerCase();
    const cardDescription = card.querySelector(".cardDescription").textContent.toLowerCase();
    if (cardTitle.includes(searchValue) ||cardDescription.includes(searchValue)) {
      matchedCards.push(card);
    }
  });
  cards.forEach((card) => {card.style.display = "none";});
  matchedCards.forEach((card) => {card.style.display = "block";
  });
}

function generateProgress(task) {
  let completedSubtasks = task.subtaskChecked ? task.subtaskChecked.filter((checked) => checked).length: 0;
  let totalSubtasks = task.subtask ? task.subtask.length : 0;
  let progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  return { completedSubtasks, totalSubtasks, progress };
}

function generateProgressBarContainerHTML(task) {
  let { completedSubtasks, totalSubtasks, progress } = generateProgress(task);
  let progressBarContainerHTML = "";
  if (task.subtask && task.subtask.length > 0) {
    progressBarContainerHTML = generateProgressHTML(progress,completedSubtasks,totalSubtasks)
  }
  return progressBarContainerHTML;
}

function generateProgressHTML(progress,completedSubtasks,totalSubtasks){
  return `
  <div class="progressBarContainer" id="progressBarContainer">
    <div class="cardProgress"><progress value="${progress}" max="100"></progress></div>
    <div class="checkboxCount">${completedSubtasks}/${totalSubtasks} Done</div>
  </div>
`;
}

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

function createTask(status) {
  const title = document.getElementById("title"); const description = document.getElementById("description"); const date = document.getElementById("date"); const categoryText = document.getElementById("categoryText"); const categoryColor = document.getElementById("selectColorBox");
  let selectedContacts = getSelectedContacts();
  let priority = clickedId;
  if (checkPrioritySelected()) {
    return;
  }
  let allTask = {id: allTasks.length, title: title.value, description: description.value, categoryText: categoryText.innerHTML, categoryColor: categoryColor.style.backgroundColor, date: date.value, priority: priority, status: status, subtask: allSubtask, contacts: selectedContacts,};
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
    return true;
  }
  return false;
}

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

function startNewFunctionsclear(currentElement){
  setCurrentDate();
  clearCategory();
  clearDropBoxAssigned();
  resetElement(currentElement);
}

function resetElement(currentElement) {
  if (currentElement !== null) {
    currentElement.style.backgroundColor = "";
    resetImage(currentElement);
    currentElement = null;
    clickedId = null;
  }
}

function clearCategory() {
  let category = document.getElementById("category");
  category.innerHTML = `<div id="categoryTextBox" class="categoryTextBox"><p>Select task category</p></div><div><img src="img/arrowTask.svg"></div>`;
}

function openAddTaskContainer(status) {
  let popupAddTaskContainer = document.getElementById("popupAddTaskContainer");
  popupAddTaskContainer.innerHTML = ``;
  popupAddTaskContainer.innerHTML += popupAddTaskContainerTemplate(status);
  renderCategory();
  renderColorCategory();
  slideAnimation();
}

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
  const initialsBackgroundColor = initialsColors[name] || getRandomColor();
  initialsColors[name] = initialsBackgroundColor;
  return `<div class="initialsNameBox"><div class="initials" id="initials" style="background-color:${initialsBackgroundColor}">${names}${lastnames}</div><div id="initialsName">${name}</div></div>`;
}

function generateInitials(name) {
  const names = name.substring(0, name.indexOf(" ")).charAt(0);
  const lastnames = name.substring(name.indexOf(" ") + 1).charAt(0);
  const initialsBackgroundColor = initialsColors[name] || getRandomColor(name);
  initialsColors[name] = initialsBackgroundColor;
  return `<div class="initialsSecond" id="initials" style="background-color:${initialsBackgroundColor}">${names}${lastnames}</div>`;
}

function generateFullName(name) {
  return `<div>${name}</div>`;
}

function getRandomColor(name) {
  let User = users.find(u => u.name == name);
  if(User){
    let color = User['color'];
    return color;
  }
  return 'rgb(211,211,211)'
}

async function showCard(taskId) {
  document.getElementById('body').style.overflow = 'hidden';
  let screenWidth = window.innerWidth;
  if (screenWidth >= 769) {
    await showCardPopup(taskId);
  } else {
    showCardMainBoard(taskId);
  }
}

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

function generateSubtaskHtml(task, taskId) {
  let subtaskHtml = "";
  if (task.subtask && task.subtask.length > 0) {
    for (let i = 0; i < task.subtask.length; i++) {
      let checkboxId = `checkbox-${taskId}-${i}`;
      let checkedAttribute =
        task.subtaskChecked && task.subtaskChecked[i] ? "checked" : "";
      subtaskHtml += SubtaskHTMLgerate(checkboxId,checkedAttribute,taskId,i,task);
    }
  }
  return subtaskHtml;
}

function SubtaskHTMLgerate(checkboxId,checkedAttribute,taskId,i,task){
  return `
  <div class="popupCardSubItem">
    <input type="checkbox" class="popupCardCheckbox" id="${checkboxId}" ${checkedAttribute} onclick="updateProgress(${taskId}, ${i})">
    <span class="popupCardSubtask">${task.subtask[i]}</span>
  </div>
`;
}

function updateProgress(taskId, subtaskIndex) {
  let task = allTasks.find((task) => task.id === taskId);
  if (!task.subtaskChecked) {
    task.subtaskChecked = [];
  }
  task.subtaskChecked[subtaskIndex] = !task.subtaskChecked[subtaskIndex];
  renderBoardCards();
  save();
}

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
    selectedContacts.push(contactName);
  } else {
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

function selectPopupCategory(i) {
  let sourceDiv = document.getElementById(`selectPopupCategory${i}`);
  let targetDiv = document.getElementById(`popupcardCategory`);
  let backgroundColor = sourceDiv.style.backgroundColor;
  targetDiv.innerHTML = sourceDiv.innerHTML;
  targetDiv.style.backgroundColor = backgroundColor;
  setPopupCategoryCard();
  popupCategoryBox.innerHTML = ``;
}

async function editPopupCard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let today = new Date();
  let popupCard = document.getElementById("popupContainer");
  await checkPrioPopupCard(task);
  popupCard.innerHTML = generateEditPopupCardHtml(task, taskId, today);
  renderAllContacts(taskId);
}

async function editShowCard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let today = new Date();
  let showCard = document.getElementById("showCard");
  await checkPrioPopupCard(task);
  showCard.innerHTML = generateEditShowCardHtml(task, taskId, today, showCard);
  renderAllContacts(taskId);
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

function upadateValuePopUp(task,title,description,date,categoryText,categoryColor,selectedContacts,priority){
  task.title = title;
  task.description = description;
  task.date = date;
  task.categoryText = categoryText;
  task.categoryColor = categoryColor;
  task.priority = priority;
  task.contacts = selectedContacts;
}

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
  upadateValuePopUp(task,title,description,date,categoryText,categoryColor,selectedContacts,priority)
  startOtherFunctions(allTasks,taskId,task,currentElement);
}

function startOtherFunctions(allTasks,taskId,task,currentElement){
  updateTaskInArray(allTasks, taskId, task);
  resetElement(currentElement);
  closePopupCard();
  closeShowCard();
}

function updateTaskInArray(allTasks, taskId, updatedTask) {
  let taskIndex = allTasks.findIndex((task) => task.id === taskId);
  allTasks.splice(taskIndex, 1, updatedTask);
  setItem("allTasks", JSON.stringify(allTasks));
}

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

function closeShowCard() {
  let showMainBoardContainer = document.getElementById("showMainBoardContainer");
  let mainBoardContainer = document.getElementById("mainBoardContainer");
  mainBoardContainer.style.display = "block";
  showMainBoardContainer.innerHTML = "";
  renderBoardCards();
}

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
  save();
  renderBoardCards();
}

function moveToStatus(taskId, status) {
  allTasks[taskId].status = status;
  save();
  renderBoardCards();
  closeShowCard();
}

function newCategoryClass(categoryContainer,newCategoryContainer,categoryColors){
  categoryContainer.classList.add("d-none");
  newCategoryContainer.classList.remove("d-none");
  categoryColors.classList.remove("d-none");
  categoryColors.classList.add("colorsContainer");
  document.getElementById("newCategoryContainer").innerHTML = newCategoryHtml();
}

function newCategory() {
  let categoryContainer = document.getElementById("categoryContainer");
  let newCategoryContainer = document.getElementById("newCategoryContainer");
  let categoryColors = document.getElementById("categoryColors");
  renderColorCategory();
  newCategoryClass(categoryContainer,newCategoryContainer,categoryColors);
}

function renderColorCategory() {
  let categoryColors = document.getElementById("categoryColors");
  categoryColors.innerHTML = "";
  for (let i = 0; i < allColors.length; i++) {
    categoryColors.innerHTML += `<div onclick="selectColor(${i})" id="selectColor${i}" class="color" style="background-color: ${allColors[i]}">
    </div>`;
  }
}

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
  let allCategoryInString = await getItem("allCategory");
  allCategory = JSON.parse(allCategoryInString) || [];
  let allTaskInString = await getItem("allTasks");
  allTasks = JSON.parse(allTaskInString) || [];
}

async function save() {
  await setItem("allTasks", JSON.stringify(allTasks));
  await setItem("allCategory", JSON.stringify(allCategory));
}

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

function selectCategory(i) {
  let sourceDiv = document.getElementById(`selectCategory${i}`);
  let targetDiv = document.getElementById(`categoryTextBox`);
  targetDiv.innerHTML = sourceDiv.innerHTML;
  sourceDiv.parentNode.removeChild(sourceDiv);
  openDropBoxCategory();
}

function closeNewCategoryfunction(categoryContainer,newCategoryContainer,childTaskContainer,dropDownBox,categoryColors,categoryBox){
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

function closeNewCategory() {
  let categoryContainer = document.getElementById("categoryContainer");
  let newCategoryContainer = document.getElementById("newCategoryContainer");
  let dropDownBox = document.getElementById("newCategoryBox");
  let childTaskContainer = document.getElementById("category");
  let categoryColors = document.getElementById("categoryColors");
  let categoryBox = document.getElementById("categoryBox");
  closeNewCategoryfunction(categoryContainer,newCategoryContainer,childTaskContainer,dropDownBox,categoryColors,categoryBox);
  clearCategory();
}

function dropUser(dropDownUser,childUserContainer){
  dropDownUser.classList.remove("d-none");
  dropDownUser.classList.add("dropDownBox");
  childUserContainer.classList.add("b-none");
}

function dropUserElse(dropDownUser,childUserContainer){
  dropDownUser.classList.add("d-none");
  dropDownUser.classList.remove("dropDownBox");
  childUserContainer.classList.remove("b-none");
}

function openDropBoxAssigned(taskId) {
  let dropDownUser = document.getElementById("dropDownUser");
  let childUserContainer = document.getElementById("assigned");
  renderAllContacts(taskId);
  if (dropDownUser.classList.contains("d-none")) {
    dropUser(dropDownUser,childUserContainer);
  } else {
    dropUserElse(dropDownUser,childUserContainer);
  }
}

function openDropBoxCategory() {
  let dropDownBox = document.getElementById("newCategoryBox");
  let childTaskContainer = document.getElementById("category");
  let categoryBox = document.getElementById("categoryBox");
  renderCategory();
  if (dropDownBox.classList.contains("d-none")) {
    dropDownBoxDnone(dropDownBox,childTaskContainer,categoryBox);
  } else {
    dropDownBoxElse(dropDownBox,childTaskContainer,categoryBox)
  }
}

function dropDownBoxElse(dropDownBox,childTaskContainer,categoryBox){
  dropDownBox.classList.add("d-none");
  dropDownBox.classList.remove("newCategoryBox");
  childTaskContainer.classList.remove("b-none");
  categoryBox.classList.add("d-none");
  categoryBox.classList.remove("categoryBox");
}

function dropDownBoxDnone(dropDownBox,childTaskContainer,categoryBox){
  dropDownBox.classList.remove("d-none");
  dropDownBox.classList.add("newCategoryBox");
  childTaskContainer.classList.add("b-none");
  categoryBox.classList.remove("d-none");
  categoryBox.classList.add("categoryBox");
}

function clearDropBoxAssigned() {
  let dropDownUser = document.getElementById("dropDownUser");
  let childUserContainer = document.getElementById("assigned");
  selectedContacts = [];
  dropDownUser.classList.add("d-none");
  dropDownUser.classList.remove("dropDownBox");
  childUserContainer.classList.remove("b-none");
}

function changeSubImg() {
  document.getElementById("subImgContainer").innerHTML = `<div class="subImgContainer">
  <img onclick="closeSubImg()" src="img/iconoir_cancel_black.svg">
  <div class="searchBarLine"></div>
  <img onclick="addSubtask()" id="subImg" src="img/akar-icons_check_black.svg">
</div>`;
}

function closeSubImg() {
  document.getElementById(
    "subImgContainer"
  ).innerHTML = `<img src="img/icon_cancel.svg">`;
  document.getElementById("subtask").value = ``;
}

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

function pushSubtask() {
  let subtaskElements = document.querySelectorAll(".subBox");
  let subtaskInfo = [];
  for (let i = 0; i < subtaskElements.length; i++) {
    subtaskInfo.push(subtaskElements[i].innerHTML);
  }
  allSubtask = subtaskInfo;
}

function resetImage(box) {
  const img = box.querySelector("img");
  const defaultImg = img.dataset.defaultImg;
  img.src = defaultImg;
}

function ifcurrentElement(element){
  element.style.backgroundColor = "";
  resetImage(element);
  currentElement = null;
  clickedId = null;
}

function ifcurrentElementNull(){
  currentElement.style.backgroundColor = "";
  resetImage(currentElement);
}

function prio(elementId,element){
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

function checkpriobox(elementId) {
  let element = document.getElementById(elementId);
  if (currentElement === element) {
    ifcurrentElement(element)
  } else {
    if (currentElement !== null) {
      ifcurrentElementNull()
    }
    prio(elementId,element);
    currentElement = element;
    clickedId = elementId;
  }
}

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
  currentDate(year,month,day,dateInput);
}

function currentDate(year,month,day,dateInput){
  const currentDate = year + "-" + month + "-" + day;
  dateInput.min = currentDate;
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