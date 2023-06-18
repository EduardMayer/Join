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

function updateTaskInArray(allTasks, taskId, updatedTask) {
  let taskIndex = allTasks.findIndex((task) => task.id === taskId);
  allTasks.splice(taskIndex, 1, updatedTask);
  setItem("allTasks", JSON.stringify(allTasks));
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

function newCategory() {
  let categoryContainer = document.getElementById("categoryContainer");
  let newCategoryContainer = document.getElementById("newCategoryContainer");
  let categoryColors = document.getElementById("categoryColors");
  renderColorCategory();
  newCategoryClass(categoryContainer,newCategoryContainer,categoryColors);
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

function clearDropBoxAssigned() {
  let dropDownUser = document.getElementById("dropDownUser");
  let childUserContainer = document.getElementById("assigned");
  selectedContacts = [];
  dropDownUser.classList.add("d-none");
  dropDownUser.classList.remove("dropDownBox");
  childUserContainer.classList.remove("b-none");
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