function includeHTML() {
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
    getGreeting();
}


function getGreeting() {
    let time = new Date();
    time = time.getHours();

    if (time >= 5 && time < 12) {
        return 'Good morning';
    }
    if (time >= 12 && time < 18) {
        return 'Good afternoon';
    }
    if ((time >= 18 && time < 24) || (time >= 0 && time < 5)) {
        return 'Good evening';
    }
}
