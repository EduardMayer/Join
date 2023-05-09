const monthNames = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

function init() {
  renderSummaryCards();
  renderGreetingMessage();
  countTaskStatuses();
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

    switch (task.status) {
      case "todo":
        todoCount++;
        break;
      case "progress":
        progressCount++;
        break;
      case "feedback":
        feedbackCount++;
        break;
      case "done":
        doneCount++;
        break;
    }

    if (task.priority === "urgent") {
      urgentCount++;
    }
  }
  renderSummaryCards(
    totalCount,
    todoCount,
    progressCount,
    feedbackCount,
    doneCount,
    urgentCount
  );
}

function renderSummaryCards(
  totalCount,
  todoCount,
  progressCount,
  feedbackCount,
  doneCount,
  urgentCount
) {
  let contentSummary = document.getElementById("content-summary");

  contentSummary.innerHTML = `
    <div class="content">
      <div class="tasks-container">
        <div class="task-boxes">
          <div class="task-box"> ${totalCount}</div>
            <p>Tasks in
            <br>
            Board</p>  
        </div>
        <div class="task-boxes">
          <div class="task-box">${progressCount}</div>
            <p>Tasks in Progress</p>
          </div>
        <div class="task-boxes">
          <div class="task-box">${feedbackCount}</div> 
            <p>Awaiting Feedback</p>
          </div>
      </div>
      <div class="tasks-urgent-deadline">
        <div class="tasks-urgent"><img src="img/Frame 59.svg">
          <div class="urgent-info">
            <div class="urgnet-number">${urgentCount}</div>
            <div class="urgent-name">Urgent</div>
          </div> 
        </div>   
        <div class="verticalLine-urgent"><img src="img/verticalline-urgent-grey.svg"></div>
          <div class="deadline">
            <div id="date" class="deadline-date"></div>
            <div class="deadline-upcoming">Upcoming Deadline</div>
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
        
        </div><div class="greet">
          <div id="greeting-message">Good evening</div>
            <div id="greeting-user"></div>
        </div>
      </div>
    </div>`;
}

function renderGreetingMessage() {
  // let user = getUser();
  let message = getGreeting();
  if (message) {
    document.getElementById("greeting-message").innerHTML = message;
    // document.getElementById('greeting-user').innerHTML = '';
  } else {
    document.getElementById("greeting-message").innerHTML = message + ",";
    // document.getElementById('greeting-user').innerHTML = user;
  }
}

function setDate() {
  let urgentTasks = allTasks.filter((t) => t.priority === "urgent" && t.date);
  let sortedUrgentTasks = urgentTasks
    .map((t) => new Date(t.date))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (sortedUrgentTasks.length === 0) {
    console.log("No urgent tasks found.");
    return;
  }

  let closestDate = sortedUrgentTasks.reduce((a, b) => Math.abs(b - new Date()) < Math.abs(a - new Date()) ? b : a);
  let closestDateString = closestDate.toLocaleString('default', { month: 'long', day: '2-digit', year: 'numeric' });
  
  document.getElementById("date").innerHTML = `${closestDateString}`;
}

function getGreeting() {
  let time = new Date();
  time = time.getHours();

  if (time >= 6 && time < 12) {
    return "Good morning";
  }
  if (time >= 12 && time < 18) {
    return "Good afternoon";
  }
  if ((time >= 18 && time < 24) || (time >= 0 && time < 6)) {
    return "Good evening";
  }
}
