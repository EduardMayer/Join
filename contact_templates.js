function openContactHTML(name,firstandSecoundLetters,email,phone,Letter,i){
    return `
        <div class="contact-Name">
            <div style="background-color: ${sortedContacts[`${Letter}`][i]['color']}!important;" id="twoLettersContact" class="profilepicture">${firstandSecoundLetters}</div>
            <div class="showname">
                <span>${name}</span>
                <a class="contactAddTask" onclick="openAddTaskContainer('todo')">+ Add Task</a>
            </div>
        </div>
        <div class="contacts-infomations">
            <span>Contact Information</span>
            <div onclick="openEdit('other')" class="openContactOnlyDesk">
                <img src="img/Edit2.svg" alt="">
                <a href="#">Edit contact</a>
            </div>
        </div>
        <div class="contacts-adress">
            <span>Email</span>
            <a id="contactEmail" href="mailto:${email}">${email}</a>
        </div>
        <div class="contacts-adress">
            <span>Phone</span>
            <a href="tel:${phone}">${phone}</a>
        </div>
    `;
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
            <img onclick="closeOverdiv()" class="cancel-overbutton dark" src="img/Cancel-greay.svg" alt="">
            <img onclick="closeOverdiv()" class="cancel-overbutton bright" src="img/WhiteC.svg" alt="">
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
                <form class="form">
                    <div class="relativ-for-icon">
                        <input id="name" minlength="2" required placeholder="Name" type="text">
                        <img src="img/people.svg" alt="">
                    </div>
                    <div class="relativ-for-icon">
                        <input id="email" required placeholder="Email" type="email">
                        <img src="img/emailicon.svg" alt="">
                    </div>
                    <div class="relativ-for-icon imgPhone">
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

function editContactHTML(){
    return /* html */ `
       <div onclick="doNotClose(event)" class="Add-contact-div">
            <img onclick="closeOverdiv()" class="cancel-overbutton dark" src="img/Cancel-greay.svg" alt="">
            <img onclick="closeOverdiv()" class="cancel-overbutton bright " src="img/WhiteC.svg" alt="">
            <div class="Add-contact">
                <div>
                    <img src="img/logoJoin.svg" alt="">
                    <h4>Edit contact</h4>
                    <div style="height:2px; width:50px; background-color:rgb(40, 172, 226);"></div>
                </div>
            </div>
            <div class="form-overdiv">
                <div class="profilepictureEdit" id="twoLettersForEdit" class="bigImg">
                </div>
                <form class="form">
                    <div class="relativ-for-icon">
                        <input id="name" minlength="2" required placeholder="Name" type="text">
                        <img src="img/people.svg" alt="">
                    </div>
                    <div class="relativ-for-icon">
                        <input id="email" required placeholder="Email" type="email">
                        <img src="img/emailicon.svg" alt="">
                    </div>
                    <div class="relativ-for-icon imgPhone">
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

function userTemplate(){
    return/* html */ `
    <div onclick="openContact('${indexLetter}',${i})" class="profile-div">
        <div style="background-color: ${sortedContacts[indexLetter][i]['color']}!important" class="profilePicture">
            ${sortedContacts[indexLetter][i]['firstLetter']}
        </div>
        <div class="overview-Informations">
            <span>${sortedContacts[indexLetter][i]['name']}</span>
            <a class="email-link" href="#">${sortedContacts[indexLetter][i]['email']}</a>
        </div>
    </div>
`;
}

function contactTemplate(){
return/* html */`
<div>
    <h3>${letterHTML(sortLetter[i]).toUpperCase()}</h3>
    <div class="forh3"></div>
    <div id="contact${i}"></div>
</div>
<button class="new-contact button mobile-only" onclick="openOverdiv('newContactHTML')">
        <span>New Contact</span>
        <img src="img/addContact.svg"></button>
`;
usersLetter.sort();

}