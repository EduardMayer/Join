let currentElement = null;


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/head_navbar.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function openAddTaskContainer(){


}

function addSubtask(){
    let subtask = document.getElementById('subtask').value;
    document.getElementById('subTaskDescription').innerHTML += `<div class="checkContainer"><input type="checkbox"> ${subtask}</div>`;
    document.getElementById('subtask').value = ``;
}


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