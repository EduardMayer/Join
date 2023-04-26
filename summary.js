const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];


function init() {
    renderGreetingMassage();
}

function renderGreetingMassage() {
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
    const currentDate = month+" " + day + "," + " "+ year;
    
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
