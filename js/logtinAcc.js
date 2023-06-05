let logtinUser;

function loadLogtinUser(){
    let logtinUserAsString = localStorage.getItem('user');
    logtinUser = JSON.parse(logtinUserAsString);
}

function renderUserProfileHead(){
    let profileDiv = document.getElementById('headProfile');
    let letters = logtinUser['firstLetter']
    profileDiv.innerHTML = letters;
    profileDiv.style.backgroundColor = logtinUser['color'];
}

