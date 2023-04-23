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
