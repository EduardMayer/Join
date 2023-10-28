let firstLetters = [];
let sortLetter = [];
let usersLetter = [];
let sortedContacts = {};

/**
 * Sorts the user contacts and organizes them by their first letter.
 */
function sortUsers() {
    users.sort((a, b) => a.name.localeCompare(b.name)); // Kontakte vor dem Hinzufügen nach dem Namen sortieren
    users.forEach(user => {
        if (user != undefined) {
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


/**
 * Opens the edit form for a contact with the provided email.
 * @param {string} form - The form type ('newContactHTML' or 'editContactHTML').
 */
function openEdit(form) {
    let email = document.getElementById('contactEmail').innerHTML;
    loadContactForm(form, email);
    openOverdiv();
    loadUserInformations(email);
    let WithoutTitel = document.getElementById('phone');
    WithoutTitel.title = '';
}

/**
 * Loads user information into the edit form based on the provided email.
 * @param {string} email - The email address of the contact.
 */
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

/**
 * Generates initials for a name input by extracting the first letter of each name.
 * @param {string} inputname - The name input.
 * @returns {string} The initials of the name input.
 */
function newLetters(inputname) {
    let names = inputname.split(' ');
    let initials = '';
    for (let i = 0; i < names.length; i++) {
        let name = names[i];
        let initial = name.charAt(0).toUpperCase();
        initials += initial;
    }
    return initials;
}

/**
 * Saves the edited user information back to the users array.
 * @param {number} i - The index of the contact in the users array.
 * @returns {boolean} Returns false to prevent form submission.
 */
async function SaveUser(i) {
    let name = document.getElementById('name').value;
    let firstLetter = newLetters(name);
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    
    if (email && name && phone != '') {
        users[i]['name'] = name;
        users[i]['email'] = email;
        users[i]['tel'] = phone;
        users[i]['firstLetter'] = firstLetter;
        await setItem('users', JSON.stringify(users));
        renderAllContacts();
        closeOverdiv();
        contactInit();
        closeOverdivArrow();
    }

    return false;
}

function renderAllContacts() {
    for (const letter in sortedContacts) {
        for (let i = 0; i < sortedContacts[letter].length; i++) {
            const currentContact = sortedContacts[letter][i];
            const currentLetter = letter;
            const currentIndex = i;

            // Überprüfen, ob der aktuelle Kontakt der bearbeitete Kontakt ist
            if (currentContact.email === document.getElementById('email').value) {
                setInformationsForContact(currentLetter, currentIndex);
                break; // Beenden Sie die Schleife, da der Kontakt gefunden wurde
            }
        }
    }
}
/**
 * Deletes a contact from the users array based on the provided index.
 * @param {number} i - The index of the contact in the users array.
 */
async function deleteContact(i) {
    users.splice(i, 1);
    await setItem('users', JSON.stringify(users))
    closeOverdiv();
    document.getElementById('informationsContacts').innerHTML = '';
    contactInit();
    closeOverdivArrow();
}

/**
 * Sorts the contacts within each letter section alphabetically by name.
 */
function sortContactsByName() {
    for (const letter in sortedContacts) {
        sortedContacts[letter].sort((a, b) => a.name.localeCompare(b.name));
    }
    for (let i = 0; i < firstLetters.length; i++) {
        renderUser(i);
    }
}

/**
 * Helper function used in sortUsers to organize contacts based on their first letter.
 * @param {string} firstLetter - The first letter of the contact's name.
 * @param {Object} user - The user object to be sorted.
 */
function SortUserIf(firstLetter, user) {
    if (!sortedContacts[firstLetter]) {
        sortedContacts[firstLetter] = [];
    }
    if (!sortedContacts[firstLetter].includes(user)) {
        sortedContacts[firstLetter].push(user);
    }
}

/**
* Initializes the contact management system.
*/
async function contactInit() {
    firstLetters = [];
    sortLetter = [];
    usersLetter = [];
    sortedContacts = {};
    await loadUsers();
    getFirstLetters();
    loadContactForm('newContactHTML');
    hover();
}

/**
 * Loads the contact form (either for adding a new contact or editing an existing one) into the overdiv element.
 * @param {string} form - The form type ('newContactHTML' or 'editContactHTML').
 * @param {string} [email] - The email address of the contact (only required for the edit form).
 */
function loadContactForm(form, email) {
    let div = document.getElementById('overdiv');
    if (form == 'newContactHTML') {
        div.innerHTML = newContactHTML();
    } else {
        div.innerHTML = editContactHTML();
    }
}

/**
 * Adds hover event listeners to the cancel button to change its image on hover.
 */
function hover() {
    let image = document.getElementById('Cancel');
    let hoverTrigger = document.querySelector('.cancelButton');

    hoverTrigger.addEventListener('mouseenter', function () {
        image.src = ' img/BlueCancel.svg';
    });

    hoverTrigger.addEventListener('mouseleave', function () {
        image.src = 'img/cancel.svg';
    });
}

/**
 * Extracts the first letters from the contacts and organizes them into arrays.
 */
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
        } else {
            let recurringUser = users[i];
            usersLetter.push(recurringUser);
        }
    }
    firstLettersForContact();
}

/**
 * Renders the contact list by generating HTML for the contacts under each letter.
 */
function firstLettersForContact() {
    renderContactHTML();
    sortUsers();
}

/**
 * Renders the contacts under a specific letter.
 * @param {number} index - The index of the letter in the firstLetters array.
 */
function renderUser(index) {
    let div = document.getElementById(`contact${index}`);
    div.classList.add('ContactHover');
    div.innerHTML = '';
    div.innerHTML = generateUserHTML(index);
}

/**
 * Renders the HTML for displaying the contacts under each letter.
 */
function renderContactHTML() {
    let div = document.getElementById('contact-list-overview');
    div.innerHTML = '';
    for (let i = 0; i < sortLetter.length; i++) {
        div.innerHTML += contactHTML(sortLetter[i], i);
        usersLetter.sort();
    }
}

/**
 * Checks if the window width is below a certain value.
 * @param {number} width - The width value to compare with.
 * @returns {boolean} Returns true if the window width is below the specified value.
 */
function isWindowBelowWidth(width) {
    return window.innerWidth < width;
}

/**
 * Opens the contact details view for a specific contact.
 * @param {string} Letter - The letter corresponding to the contact's name.
 * @param {number} i - The index of the contact in the sortedContacts array.
 */
function openContact(Letter, i) {
    if (!isWindowBelowWidth(1160)) {
        setInformationsForContact(Letter, i);
    } else {
        setInformationsForContact(Letter, i);
        document.getElementById('contact-info-container').classList.replace('contact-info-container', 'contact-info-container-new');
    }
}

/**
 * Sets the contact details information in the contact details view.
 * @param {string} Letter - The letter corresponding to the contact's name.
 * @param {number} i - The index of the contact in the sortedContacts array.
 */
function setInformationsForContact(Letter, i) {
    if (sortedContacts[Letter] && i >= 0 && i < sortedContacts[Letter].length) {
        let name = sortedContacts[Letter][i]['name'];
        let firstandSecoundLetters = sortedContacts[Letter][i]['firstLetter'];
        let email = sortedContacts[Letter][i]['email'];
        let phone = sortedContacts[Letter][i]['tel'];
        document.getElementById('informationsContacts').innerHTML = openContactHTML(name, firstandSecoundLetters, email, phone, Letter, i);
        mobileDelButton(email);
    }
}

/**
 * Sorts the firstLetters array alphabetically.
 */
function sortArray() {
    let unsort = firstLetters;
    unsort.sort();
    firstLetters = unsort;
}

/**
 * Closes the overdiv element and removes the overlay.
 */
function closeOverdiv() {
    let div = document.getElementById('overdiv');
    let overlayDiv = document.querySelector(".overlay");
    div.classList.remove('overdiv-slide');
    if (overlayDiv) {
        document.body.removeChild(overlayDiv);
    }

}
/**
 * Closes the contact details view in mobile view.
 */
function closeOverdivArrow() {
    document.getElementById('contact-info-container').classList.replace('contact-info-container-new', 'contact-info-container');
}

/**
 * Opens the overdiv element.
 * @param {string} form - The form type ('newContactHTML' or 'editContactHTML').
 */
function openOverdiv(form) {
    loadContactForm(form);
    let div = document.getElementById('overdiv');
    let overlayDiv = document.createElement("div");

    div.classList.add('overdiv-slide');
    overlayDiv.classList.add("overlay");
    document.body.appendChild(overlayDiv);
}
/**
 * Prevents closing the overdiv when clicking inside it.
 * @param {Event} event - The click event object.
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * Generates a random color for the contact.
 * @returns {Promise<string>} A Promise that resolves to a random color string.
 */
async function getRandomColorContact() {
    let colors = ["orange", "hsl(193.32deg 88.4% 45.3%)", "hsl(330.81deg 88.4% 45.3%)", "hsl(0deg 97.03% 50.22%)", "rgb(221, 23, 221)", "rgb(31, 196, 31)"];
    let randomIndex = Math.floor(Math.random() * colors.length);
    let randomColor = colors[randomIndex];
    return randomColor;
}

/**
 * Creates a new contact by registering the user's input.
 */
function createNewContact() {
    let name = document.getElementById('name');
    let email = document.getElementById('email')
    let phone = document.getElementById('phone')
    registerForContacts(name, email, phone);
}

/**
 * Clears the input fields for contact creation.
 * @param {HTMLInputElement} name - The input field for the contact's name.
 * @param {HTMLInputElement} email - The input field for the contact's email.
 * @param {HTMLInputElement} phone - The input field for the contact's phone number.
 */
function clearInputContacts(name, email, phone) {
    name.value = '';
    email.value = '';
    phone.value = '';
}

/**
 * Registers a new contact by adding it to the users array.
 * @param {HTMLInputElement} name - The input field for the contact's name.
 * @param {HTMLInputElement} email - The input field for the contact's email.
 * @param {HTMLInputElement} phone - The input field for the contact's phone number.
 */
async function registerForContacts(name, email, phone) {
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
        clearInputContacts(name, email, phone);
    }
}

/**
 * Sets the mobile delete button action to delete a contact.
 * @param {string} email - The email address of the contact.
 */
function mobileDelButton(email) {
    if (window.innerWidth <= 768) {
        let index = users.findIndex(u => u['email'] == email);
        let button = document.getElementById('delMobile');
        button.setAttribute('onclick', `deleteContact(${index})`);
    }
}

/**
 * Checks and limits the input length of a field to a maximum value.
 * @param {HTMLInputElement} input - The input field to check the length.
 * @param {number} maxLength - The maximum allowed length for the input.
 */
function checkInputLength(input, maxLength) {
    if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
    }
}