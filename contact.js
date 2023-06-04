let firstLetters = [];
let sortLetter = [];
let usersLetter = [];
let sortedContacts = {};

function sortUsers() {
    users.sort((a, b) => a.name.localeCompare(b.name)); // Kontakte vor dem Hinzufügen nach dem Namen sortieren
    users.forEach(user => {
        if(user != undefined){
            const firstLetter = user.name.charAt(0).toUpperCase();
            SortUserIf(firstLetter, user);
        }
    });
    const sortedContactsArray = Object.entries(sortedContacts)
      .map(([letter, contacts]) => ({
        letter,
        contacts
      }))
      .sort((a, b) => a.letter.localeCompare(b.letter));
    sortedContacts = {};
    sortedContactsArray.forEach(({ letter, contacts }) => {
      sortedContacts[letter] = contacts;
    });
    sortContactsByName();
}

function openEdit(form){
    let email = document.getElementById('contactEmail').innerHTML;
    loadContactForm(form,email);
    opnenOverdiv();
    loadUserInformations(email);
}

function loadUserInformations(email) {
    let u;
    const index = users.findIndex(user => user.email === email);
    if (index !== -1) {
      u = users[index];
      const { name, email: emailC, tel, firstLetter } = u;
      document.getElementById('name').value = name;
      document.getElementById('email').value = emailC;
      document.getElementById('phone').value = tel;
      document.getElementById('twoLettersForEdit').innerHTML = firstLetter;
      document.getElementById('deleteButton').setAttribute('onclick', `deleteContact(${index})`);
      document.getElementById('SaveUserButton').setAttribute('onclick', `SaveUser(${index})`);
    } else {
      console.log('Benutzer nicht gefunden.');
    }
}

async function SaveUser(i){
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    users[i]['name'] = name;
    users[i]['email'] = email;
    users[i]['tel'] = phone;
    await setItem('users', JSON.stringify(users));
    closeOverdiv();
    document.getElementById('informationsContacts').innerHTML = '';
    contactInit();
}

async function deleteContact(i){ 
    users.splice(i,1);
    await setItem('users', JSON.stringify(users))
    closeOverdiv();
    document.getElementById('informationsContacts').innerHTML = '';
    contactInit();
}

function sortContactsByName() {
    for (const letter in sortedContacts) {
      sortedContacts[letter].sort((a, b) => a.name.localeCompare(b.name));
    }
    for(let i = 0; i < firstLetters.length; i++){
        renderUser(i);
    }
}

function SortUserIf(firstLetter, user) {
    if (!sortedContacts[firstLetter]) {
      sortedContacts[firstLetter] = [];
    }
    if (!sortedContacts[firstLetter].includes(user)) {
      sortedContacts[firstLetter].push(user);
    }
  }

async function contactInit(){
    firstLetters = [];
    sortLetter = [];
    usersLetter = [];
    sortedContacts = {};
    await loadUsers();
    getFirstLetters();
    loadContactForm('newContactHTML');
    hover();
}

function loadContactForm(form,email){
    let div = document.getElementById('overdiv');
    if(form == 'newContactHTML'){
        div.innerHTML = newContactHTML();
    }else{
        div.innerHTML = editContactHTML(email);
    }
}

function hover(){
    let image = document.getElementById('Cancel');
    let hoverTrigger = document.querySelector('.cancelButton');

    hoverTrigger.addEventListener('mouseenter', function() {
        image.src = ' img/BlueCancel.svg';
    });

    hoverTrigger.addEventListener('mouseleave', function() {
        image.src = 'img/cancel.svg';
    });
}

function getFirstLetters() {
    for (let i = 0; i < users.length; i++) {
        firstLetters.sort();
        let name = users[i]['name'];
        let firstLetter = name.charAt(0).toUpperCase();
        if (!firstLetters.includes(firstLetter)) {
            firstLetters.push(firstLetter);
            sortLetter.push(firstLetter);
            sortLetter.sort();
            sortArray();
        }else{
            let recurringUser = users[i];
            usersLetter.push(recurringUser);
        }
    }
    firstLettersForContact();
}

function firstLettersForContact(){
    renderContactHTML();
    sortUsers();
}

function renderUser(index){
    let div = document.getElementById(`contact${index}`);
    div.classList.add('ContactHover')
    div.innerHTML = '';
    let indexLetter = firstLetters[index];
    for(let i = 0; i < sortedContacts[indexLetter].length; i++){
        div.innerHTML += /* html */ `
            <div onclick="openContact('${indexLetter}',${i})" class="profile-div">
                <div class="profilePicture">
                    ${sortedContacts[indexLetter][i]['firstLetter']}
                </div>
                <div>
                    <span>${sortedContacts[indexLetter][i]['name']}</span>
                    <a href="#">${sortedContacts[indexLetter][i]['email']}</a>
                </div>
            </div>
        `;
    }
}

function openContact(Letter,i){
    let name = sortedContacts[`${Letter}`][i]['name'];
    let firstandSecoundLetters = sortedContacts[`${Letter}`][i]['firstLetter'];
    let email = sortedContacts[`${Letter}`][i]['email'];
    let phone = sortedContacts[`${Letter}`][i]['tel'];
    document.getElementById('informationsContacts').innerHTML = openContactHTML(name,firstandSecoundLetters,email,phone);
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
       <div onclick="doNotClose(event)" class="Add-contact-div">
            <img onclick="closeOverdiv()" class="cancel-overbutton" src="img/Cancel-greay.svg" alt="">
            <div class="Add-contact">
                <div>
                    <img src="img/logoJoin.svg" alt="">
                    <h4>Add contact</h4>
                    <span>Tasks are better with a team!</span>
                    <div class="addContact-line"></div>
                </div>
            </div>
            <div class="form-overdiv">
                <div class="bigImg">
                    <img src="img/guest.png" alt="">
                </div>
                <form>
                    <div class="relativ-for-icon">
                        <input id="name" minlength="2" required placeholder="Name" type="text">
                        <img src="img/people.svg" alt="">
                    </div>
                    <div class="relativ-for-icon">
                        <input id="email" required placeholder="Email" type="email">
                        <img src="img/emailicon.svg" alt="">
                    </div>
                    <div class="relativ-for-icon">
                        <input id="phone" required placeholder="Phone" type="number">
                        <img src="img/phone.svg" alt="">
                    </div>
                    <div class="buttons">
                        <button type="button" onclick="closeOverdiv();" class="cancelButton">Cancel <img id="Cancel"
                                class="cancelImg" src="img/cancel.svg" alt=""></button>
                        <button type="submit" onclick="createNewContact(); return false;"
                            class="create-contactButton">Create contact <img src="img/hook.svg" alt=""></button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function editContactHTML(email){
    return /* html */ `
       <div onclick="doNotClose(event)" class="Add-contact-div">
            <img onclick="closeOverdiv()" class="cancel-overbutton" src="img/Cancel-greay.svg" alt="">
            <div class="Add-contact">
                <div>
                    <img src="img/logoJoin.svg" alt="">
                    <h4>Edit contact</h4>
                    <div style="height:2px; width:50px; background-color:rgb(40, 172, 226);"></div>
                </div>
            </div>
            <div class="form-overdiv">
                <div class="profilepicture" id="twoLettersForEdit" class="bigImg">
                </div>
                <form >
                    <div class="relativ-for-icon">
                        <input id="name" minlength="2" required placeholder="Name" type="text">
                        <img src="img/people.svg" alt="">
                    </div>
                    <div class="relativ-for-icon">
                        <input id="email" required placeholder="Email" type="email">
                        <img src="img/emailicon.svg" alt="">
                    </div>
                    <div class="relativ-for-icon">
                        <input id="phone" required placeholder="Phone" type="number">
                        <img src="img/phone.svg" alt="">
                    </div>
                    <div class="buttons">
                        <button type="button" id="deleteButton" class="cancelButton">Delete<img id="Cancel"
                                class="cancelImg" src="img/cancel.svg" alt=""></button>
                        <button type="submit" id="SaveUserButton"
                            class="create-contactButton">Save<img src="img/hook.svg" alt=""></button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function closeOverdiv(){
    let div = document.getElementById('overdiv');
    div.classList.add('d-none');
}

function opnenOverdiv(form){
    loadContactForm(form);
    let div = document.getElementById('overdiv');
    div.classList.remove('d-none');
}

function doNotClose(event) {
    event.stopPropagation();
}

function createNewContact(){
    let name = document.getElementById('name');
    let email = document.getElementById('email')
    let phone = document.getElementById('phone')
    registerForContacts(name,email,phone);
    clearInputContacts(name,email,phone);
}

function clearInputContacts(name,email,phone){
    name.value = '';
    email.value = '';
    phone.value = '';
}

async function registerForContacts(name,email,phone) {
    renderfirstNames(name.value);
    if (Array.isArray(users)) {
      users.push({
        'name': name.value,
        'email': email.value,
        'password': 'StartPassword' + `${email.value}`,
        'contact': [],
        'tel': phone.value,
        'firstLetter': initials,
      });
      await setItem('users', JSON.stringify(users));
      contactInit();
      closeOverdiv();
    }
}

function openContactHTML(name,firstandSecoundLetters,email,phone){
    return `
        <div class="contact-Name">
            <div id="twoLettersContact" class="profilepicture">${firstandSecoundLetters}</div>
            <div class="showname">
                <span>${name}</span>
                <a href="#">+ Add Task</a>
            </div>
        </div>
        <div class="contacts-infomations">
            <span>Contact Information</span>
            <div>
                <img src="img/Edit.svg" alt="">
                <a onclick="openEdit('other')" href="#">Edit contact</a>
            </div>
        </div>
        <div class="contacts-adress">
            <span>Email</span>
            <a id="contactEmail" href="#">${email}</a>
        </div>
        <div class="contacts-adress">
            <span>Phone</span>
            <a href="#">${phone}</a>
        </div>
    `;
}