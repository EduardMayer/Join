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
    openOverdiv();
    loadUserInformations(email);
    let WithoutTitel = document.getElementById('phone');
    WithoutTitel.title = '';
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
      document.getElementById('twoLettersForEdit').style.backgroundColor = users[index]['color'];
    }
}

async function SaveUser(i){
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    if(email && name && phone != ''){
        users[i]['name'] = name;
        users[i]['email'] = email;
        users[i]['tel'] = phone;
        await setItem('users', JSON.stringify(users));
        closeOverdiv();
        document.getElementById('informationsContacts').innerHTML = '';
        contactInit();
    }
    return false;
}

async function deleteContact(i){ 
    users.splice(i,1);
    await setItem('users', JSON.stringify(users))
    closeOverdiv();
    document.getElementById('informationsContacts').innerHTML = '';
    contactInit();
    closeOverdivArrow();
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
        div.innerHTML = editContactHTML();
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

function renderUser(index) {
    let div = document.getElementById(`contact${index}`);
    div.classList.add('ContactHover');
    div.innerHTML = '';
    div.innerHTML = generateUserHTML(index);
}

function renderContactHTML() {
    let div = document.getElementById('contact-list-overview');
    div.innerHTML = '';
    for (let i = 0; i < sortLetter.length; i++) {
        div.innerHTML += contactHTML(sortLetter[i], i);
        usersLetter.sort();
    }
}

function isWindowBelowWidth(width) {
    return window.innerWidth < width;
}

function openContact(Letter,i){
    if (!isWindowBelowWidth(1160)) {
        setInformationsForContact(Letter, i);
    }else{
        setInformationsForContact(Letter, i);
        document.getElementById('contact-info-container').classList.replace('contact-info-container', 'contact-info-container-new');
    }
}

function setInformationsForContact(Letter, i){
    let name = sortedContacts[`${Letter}`][i]['name'];
    let firstandSecoundLetters = sortedContacts[`${Letter}`][i]['firstLetter'];
    let email = sortedContacts[`${Letter}`][i]['email'];
    let phone = sortedContacts[`${Letter}`][i]['tel'];
    document.getElementById('informationsContacts').innerHTML = openContactHTML(name,firstandSecoundLetters,email,phone,Letter,i);
    mobileDelButton(email);
}



function sortArray(){
    let unsort = firstLetters;
    unsort.sort();
    firstLetters = unsort; 
}



function closeOverdiv(){
    let div = document.getElementById('overdiv');
    let overlayDiv = document.querySelector(".overlay");
    div.classList.remove('overdiv-slide');
    if (overlayDiv) { 
        document.body.removeChild(overlayDiv);
    }
   
}
function closeOverdivArrow(){
    document.getElementById('contact-info-container').classList.replace('contact-info-container-new','contact-info-container');
}

function openOverdiv(form){
    loadContactForm(form);
    let div = document.getElementById('overdiv');
    let overlayDiv = document.createElement("div");
    
    div.classList.add('overdiv-slide');
    overlayDiv.classList.add("overlay");
    document.body.appendChild(overlayDiv);
}

function doNotClose(event) {
    event.stopPropagation();
}

async function getRandomColorContact() {
    let colors = ["orange", "hsl(193.32deg 88.4% 45.3%)", "hsl(330.81deg 88.4% 45.3%)", "hsl(0deg 97.03% 50.22%)","rgb(221, 23, 221)","rgb(31, 196, 31)"];
    let randomIndex = Math.floor(Math.random() * colors.length);
    let randomColor = colors[randomIndex];
    return randomColor;
}

function createNewContact(){
    let name = document.getElementById('name');
    let email = document.getElementById('email')
    let phone = document.getElementById('phone')
    registerForContacts(name,email,phone);
}

function clearInputContacts(name,email,phone){
    name.value = '';
    email.value = '';
    phone.value = '';
}

async function registerForContacts(name,email,phone) {
    renderfirstNames(name.value);
    let rendomColor = await getRandomColorContact();
    if (Array.isArray(users)) {
      users.push({
        'name': name.value,
        'email': email.value,
        'password': 'StartPassword' + `${email.value}`,
        'contact': [],
        'tel': phone.value,
        'firstLetter': initials,
        'color': rendomColor,
      });
      await setItem('users', JSON.stringify(users));
      contactInit();
      closeOverdiv();
      clearInputContacts(name,email,phone);
    } 
}

function mobileDelButton(email){
    if(window.innerWidth <= 768){
        let index = users.findIndex(u => u['email'] == email);
        let button = document.getElementById('delMobile');
        button.setAttribute('onclick', `deleteContact(${index})`);
    }
}