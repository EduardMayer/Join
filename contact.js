let firstLetters = [];
let sortLetter = [];
let usersLetter = [];

async function contactInit(){
    await loadUsers();
    getFirstLetters();
}

function getFirstLetters() {
    for (let i = 0; i < users.length; i++) {
        firstLetters.sort();
        let name = users[i]['name'];
        let firstLetter = name.charAt(0);
        if (!firstLetters.includes(firstLetter)) {
            firstLetters.push(firstLetter);
            sortLetter.push(firstLetter);
            usersLetter.push(users.find(l => l['name'].charAt(0) === sortLetter[i]));
            usersLetter.sort((a, b) => a.name.localeCompare(b.name)); // Sortiere usersLetter nach dem Namen
            sortLetter.sort();
            renderContactHTML();
        }
    }
    renderUser();
    sortArray(); // Sortiere das Array außerhalb der Schleife, nachdem alle Buchstaben hinzugefügt wurden
}

function renderUser(){
    for(let i = 0; i < usersLetter.length; i++){
        let div = document.getElementById(`contact${i}`);
        div.innerHTML = '';
        div.innerHTML += /* html */ `
            <div class="profile-div">
                <div class="profilePicture">
                    ${usersLetter[i]['firstLetter']}
                </div>
                <div>
                    <span>${usersLetter[i]['name']}</span>
                    <a href="#">${usersLetter[i]['email']}</a>
                </div>
            </div>
        `;
    }
}

function renderContactHTML(){
    let div = document.getElementById('contact-list-overview');
    div.innerHTML = '';
    for(let i = 0; i < sortLetter.length; i++){
        div.innerHTML += /* html */`
        <div>
            <h3>${letterHTML(sortLetter[i]).toUpperCase()}</h3>
            <div class="forh3"></div>
            <div id="contact${i}">
            </div>
        </div>
        `;
        usersLetter.sort();
    }
}

function sortArray(){
    let unsort = firstLetters;
    unsort.sort();
    firstLetters = unsort; 
}

function letterHTML(letter){
    return /* html */ `
        <div>
            <h2>${letter}</h2>
            <div id="contact-${letter}">
                
            </div>
        </div>
    `;
}

function newContactHTML(){
    return /* html */ `
        <div>
            <div class="newContact-logo">
                <div>
                    <img src="img/logoJoin.svg" alt="">
                </div>
                <div>
                    <span>Add contact</span>
                    <span>Tasks are better with a team!</span>
                    <div style="height:2px; width:50px; background-color:rgb(40, 172, 226);"></div>
                </div>
            </div>  
            <div>
                <div>
                    <img src="profile picture" alt="">
                </div>
                <form onsubmit="createContact()">
                    <div>
                        <input required type="text" placeholder="Name" pattern="[a-zA-ZÄäÜüÖöß ]*" minlength="2" maxlength="30">
                        <img src="img/people.svg" alt="">
                    </div>
                    <div>
                        <input required type="email" placeholder="Email">
                        <img src="img/emailicon.svg" alt="">
                    </div>
                    <div>
                        <input required type="number" placeholder="Email" minlength="11" maxlength="16">
                        <img src="img/Vector.svg" alt="">
                    </div>
                    <div>
                        <div>
                            <button type="button">Cancel <img src="img/cancel.svg" alt=""></button>
                        </div>
                        <div>
                            <button type="submit">Create contact <img src="img/chop.svg" alt=""></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function editContactHTML(){
    return /* html */ `
        <div>
            <img src="img/cancel.svg" alt="">
            <div>
                <img src="img/logoJoin.svg" alt="">
                <span>Edit contact</span>
                <div style="height:2px; width:50px; background-color:rgb(40, 172, 226);"></div>
            </div>
            <div>
                <div>
                    <img src="" alt="">
                </div>
                <form onsubmit="createContact()">
                    <div>
                        <input required type="text" placeholder="Name" pattern="[a-zA-ZÄäÜüÖöß ]*" minlength="2" maxlength="30">
                        <img src="img/people.svg" alt="">
                    </div>
                    <div>
                        <input required type="email" placeholder="Email">
                        <img src="img/emailicon.svg" alt="">
                    </div>
                    <div>
                        <input required type="number" placeholder="Email" minlength="11" maxlength="16">
                        <img src="img/Vector.svg" alt="">
                    </div>
                    <div>
                        <div>
                            <button type="button">Delete </button>
                        </div>
                        <div>
                            <button type="submit">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
}