function generateCardHTML(task) {
  let progressBarContainerHTML = generateProgressBarContainerHTML(task);
  return `
      <div draggable="true" onclick="showCard(${task.id})" ondragstart="startDragging(${task.id})" class="card">
        <div class="cardCategory" style="background-color:${task.categoryColor}">${task.categoryText}</div>
        <div class="cardTitle">${task.title}</div>
        <div class="cardDescription">${task.description}</div>
        ${progressBarContainerHTML}
        <div class="lowerCard">
          <div class="cardUser"></div>
          <div class="cardPrio"><img src="img/${task.priority}.svg"></div>
        </div>
      </div>
    `;
}

function generatePopupCardHtml(task,taskId,subtaskHtml,backgroundColor,priorityText,priorityImage) {
  return `
      <div class="popupCard">
        <div>
          <div class="cancelPopupCardBox"><div onclick="closePopupCard()" class="cancelIconPopupCard"><img src="/img/cross.png"></div></div>
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
            <div id="popupCardSubBox" class="popupCardSubBox">${subtaskHtml}</div>
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

function generateEditPopupCardHtml(task, taskId, today) {
  return `
    <div class="popupCard">
    <form onsubmit="event.preventDefault(); savePopupCard(${taskId})">
      <div>
        <div class="cancelPopupCardBox"><div onclick="closePopupCard()" class="cancelIconPopupCard"><img src="/img/cross.png"></div></div>
        <div class="editPopupCardCategory" id="popupcardCategory" onclick="setPopupCategoryCard(${taskId})" style="background-color:${task.categoryColor}">${task.categoryText}</div>
        <div id="popupCategoryBox" class="popupCategoryBox"></div>
      </div>
      <div class="popupCardtitleContainer">
          <label for="title">Title</label>
          <input required type="text" class="popupCardTitle" id="popupCardTitle" minlength="3" value="${task.title}">
      </div>
      <div class="popupCarddescriptionContainer">
          <label for="description">Description</label>
          <textarea required class="popupcardDescription" id="popupcardDescription" minlength="3">${task.description}</textarea>
      </div>
      <div class="popupCarddateContainer">
        <label for="date">Due date</label>
        <input type="date" class="popupCardDate" id="popupCardDate" min="${today.toISOString().split("T")[0]}" value="${task.date}">
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
      </div>
      <div class="popupCardEditAssigned"><b>Assigned To:</b></div>
      <div class="popupCardEditImgContainer">
        <div>
          <button class="popupSaveButton" type="submit">Ok<img src="/img/akar-icons_check.svg"></button>
        </div>
      </div>
    </form>
    </div>
  `;
}

function generateShowCardHtml(task,taskId,subtaskHtml,backgroundColor,priorityText,priorityImage) {
  return `
      <div class="showCard" id="showCard">
        <div class="showCategoryContainer">
          <div class="popupcardCategory" style="background-color:${task.categoryColor}">${task.categoryText}</div><div onclick="closeShowCard()" class="cancelIconShowCard"><img src="/img/blackarrowicon.svg"></div>
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
            <div id="popupCardSubBox" class="popupCardSubBox">${subtaskHtml}</div>
          </div>
          </div>
          <div class="popupCardImgContainer">
            <div class="popupCardImgBox">
              <div class="popupDeletButton" onclick="deletePopupCard(${taskId})"><img src="/img/deletebuttonv1.png"></div>
              <div class="popupEditButton" onclick="editShowCard(${taskId})"><img src="/img/editbuttonv1.png"></div>
          </div>   
          </div>  
      </div>
    `;
}

function generateEditShowCardHtml(task, taskId, today) {
  return `
    <form onsubmit="event.preventDefault(); savePopupCard(${taskId})">
      <div>
        <div class="cancelPopupCardBox"><div onclick="closeShowCard()" class="cancelIconPopupCard"><img src="/img/cross.png"></div></div>
        <div class="editPopupCardCategory" id="popupcardCategory" onclick="setPopupCategoryCard(${taskId})" style="background-color:${task.categoryColor}">${task.categoryText}</div>
        <div id="popupCategoryBox" class="popupCategoryBox"></div>
      </div>
      <div class="popupCardtitleContainer">
          <label for="title">Title</label>
          <input required type="text" class="popupCardTitle" id="popupCardTitle" minlength="3" value="${task.title}">
      </div>
      <div class="popupCarddescriptionContainer">
          <label for="description">Description</label>
          <textarea required class="popupcardDescription" id="popupcardDescription" minlength="3">${task.description}</textarea>
      </div>
      <div class="popupCarddateContainer">
        <label for="date">Due date</label>
        <input type="date" class="popupCardDate" id="popupCardDate" min="${today.toISOString().split("T")[0]}" value="${task.date}">
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
      </div>
      <div class="popupCardEditAssigned"><b>Assigned To:</b></div>
      <div class="popupCardEditImgContainer">
        <div>
          <button class="popupSaveButton" type="submit">Ok<img src="/img/akar-icons_check.svg"></button>
        </div>
      </div>
    </form>
    </div>
  `;
}


function popupAddTaskContainerTemplate(status) {
  return `
    <div class="mainAddTaskContainer">
      <div class="cancelIconPopupCard" onclick="closePopupTaskCard()"><img src="/img/cross.png"></div>
      <div class="headAddTaskContainer">
        <p>Add Task</p>
      </div>
      <form onsubmit="event.preventDefault(); createTask('${status}')">
        <div class="bodyAddTaskCotnainer">
          <div class="leftAddTaskContainer">
            <div class="titleContainer">
              <label for="title">Title</label>
              <input required type="text" id="title" placeholder="Enter a title" minlength="3">
            </div>
            <div class="descriptionContainer">
              <label for="description">Description</label>
              <textarea required name="description" id="description" placeholder="Enter a Description" minlength="3"></textarea>
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
            <div class="d-none" id="newCategoryContainer"></div>
            <div id="categoryColors" class="d-none"></div>
            <div class="assignedToContainer">
              <label for="Category">Assigned to</label>
              <div onclick="openDropBoxAssigned()" class="childTaskContainer" id="assigned">
                <p>Select contacts to assign</p>
                <img src="/img/arrowTask.svg">
              </div>
              <div class="d-none" id="dropDownUser"></div>
            </div>
          </div>
          <div class="middleAddTaskContainer"></div>
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
            <div id="subTaskDescription" class="subTaskDescription"></div>
          </div>
        </div>
        <div class="buttonAddTaskContainer">
          <button class="buttonTask" onclick="clearTask()">Clear <img class="cancelIcon" src="/img/iconoir_cancel.svg"></button>
          <button class="buttonTask2" type="submit">Create Task<img src="/img/akar-icons_check.svg"></button>
        </div>
      </form>
    </div>
  `;
}
  
  function newCategoryHtml(){return`<label for="Category">Category</label><div class="subtaskChildContainer" >
  <div id="colorBox" class="colorBox"></div>
  <input type="text" id="inputCategory" placeholder="New category name">
  <div class="subImgContainer">
    <img onclick="closeNewCategory()" src="/img/iconoir_cancel_black.svg">
    <div class="searchBarLine"></div>
    <img onclick="addNewCategory()" id="subImg" src="/img/akar-icons_check_black.svg">
  </div>
  </div>`;
}