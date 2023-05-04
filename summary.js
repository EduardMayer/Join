const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

function init() {
    renderSummaryCards();
    renderGreetingMessage();
    countTaskStatuses() 
}


function countTaskStatuses() {
    let totalCount = allTasks.length;
    let todoCount = 0;
    let progressCount = 0;
    let feedbackCount = 0;
    let doneCount = 0;
    let urgentCount = 0;
    
    for (let i = 0; i < allTasks.length; i++) {
      const task = allTasks[i];
      
      switch(task.status) {
        case 'todo':
          todoCount++;
          break;
        case 'progress':
          progressCount++;
          break;
        case 'feedback':
          feedbackCount++;
          break;
        case 'done':
          doneCount++;
          break;
      }
    
      if (task.priority === 'urgent') {
        urgentCount++;
      }
    }
   
    renderSummaryCards(totalCount, todoCount, progressCount, feedbackCount, doneCount,urgentCount);
  }

function renderSummaryCards(totalCount, todoCount, progressCount, feedbackCount, doneCount, urgentCount){
let contentSummary = document.getElementById('content-summary');

    contentSummary.innerHTML = `<div class="content">
    <div>
        <div class="workstation">
            <div class="tasks-container">
                <div class="task-box">
                    <span>${totalCount}</span>
                    <p>Tasks in Board</p>
                </div>
                <div class="task-box">
                    <span>${progressCount}</span>
                    <p>Tasks in Progress</p>
                </div>
                <div class="task-box">
                    <span>${feedbackCount}</span>
                    <p>Awaiting Feedback</p>
                </div>
            </div>
            <div class="tasks-urgent">
                <img src="img/Frame 59.svg">
                <div class="urgent">
                    <span>${urgentCount}</span>
                    <p>Urgent</p>
                </div>
                <div class="verticalLine-urgent"><img src="img/verticalline-urgent-grey.svg"></div>
                <div class="deadline">
                    <span id="date" class="date"></span>
                    <p>Upcoming Deadline</p>
                </div>
            </div>
            <div class="todo-done">
                <div class="todo">
                    <img src="img/Group 7.svg">
                    <div class="todo-done-ticket">
                        <span>${todoCount}</span>
                        <p>To-do</p>
                    </div>
                </div>
                <div class="done">
                    <img src="img/done-button.svg">
                    <div class="todo-done-ticket">
                        <span>${doneCount}</span>
                        <p>Done</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="greet">
        <div id="greeting-message">Good evening</div>
        <div id="greeting-user"></div>
    </div>
</div>`;
}

function checkPosition() {
    
    let inToDo = 0;
    let inInProgress = 0;
    let inAwaitingFeedback = 0;
    let inDone = 0;
    let areUrgent = 0;

    for (let i = 0; i < tasks.length; i++) {
        const task = alltasks[i];
        if (task['status'] == 'todo') { inToDo++ }
        if (task['status'] == 'progress') { inInProgress++ }
        if (task['status'] == 'feedback') { inAwaitingFeedback++ }
        if (task['status'] == 'done') { inDone++ }
        if (task['priority'] == 'urgent') { areUrgent++ }
    }
    renderNumbersSummary(inToDo, inInProgress, inAwaitingFeedback, inDone, areUrgent);
    setDate();
}

function renderNumbersSummary(inToDo, inInProgress, inAwaitingFeedback, inDone, areUrgent) {
    document.getElementById('tasksOnBoard').innerHTML = `${tasks.length}`;
    document.getElementById('summaryTodo').innerHTML = `${inToDo}`;
    document.getElementById('tasksInProgress').innerHTML = `${inInProgress}`;
    document.getElementById('tasksInFeedback').innerHTML = `${inAwaitingFeedback}`;
    document.getElementById('tasksDone').innerHTML = `${inDone}`;
    document.getElementById('tasksUrgent').innerHTML = `${areUrgent}`;
}

function renderGreetingMessage() {
    // let user = getUser();
    let message = getGreeting();
    if (message) {
        document.getElementById('greeting-message').innerHTML = message;
        // document.getElementById('greeting-user').innerHTML = '';

    } else {
        document.getElementById('greeting-message').innerHTML = message + ',';
        // document.getElementById('greeting-user').innerHTML = user;
    }
}

function setDate() {
    let date = document.getElementById('date');
    let now = new Date();
    let year = now.getFullYear();
    let month = monthNames[now.getMonth()];
    let day = now.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    const currentDate = month + " " + day + "," + " " + year;

    date.innerHTML = currentDate;
}


function getGreeting() {
    let time = new Date();
    time = time.getHours();

    if (time >= 6 && time < 12) {
        return 'Good morning';
    }
    if (time >= 12 && time < 18) {
        return 'Good afternoon';
    }
    if ((time >= 18 && time < 24) || (time >= 0 && time < 6)) {
        return 'Good evening';
    }
}
