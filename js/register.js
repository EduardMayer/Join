let users = [];
let allContacts = [];
let initials = '';

async function userInit(){
    await loadUsers();
}

function showLogOut(){
    let logOutButton =  document.getElementById('logout');
    let helpButton = document.getElementById('openhelp');
    let legalButton = document.getElementById('openlegal');
    if(window.innerWidth <= 768) {
      if(logOutButton.classList.contains('d-none')){
        logOutButton.classList.remove('d-none');
        helpButton.classList.remove('d-none');
        legalButton.classList.remove('d-none');
      }else{
        logOutButton.classList.add('d-none');
        helpButton.classList.add('d-none');
        legalButton.classList.add('d-none');
      };
    }else{
      if(logOutButton.classList.contains('d-none')){
        document.getElementById('logout').classList.remove('logoutdiv')
        document.getElementById('logout').classList.add('logoutdivOne')
        logOutButton.classList.remove('d-none')
      }else{
        document.getElementById('logout').classList.add('logoutdiv')
        document.getElementById('logout').classList.remove('logoutdivOne')
        logOutButton.classList.add('d-none');
      };
    }
    
}

function openhelp(){
  location.href = "help.html";
}

function openlegal(){
  location.href = "legal.html";
}

function logout(){
  location.href = "index.html";
}

async function loadUsers() {
    const storedUsers = await getItem('users');
    users = storedUsers ? JSON.parse(storedUsers) : [];
    updateAllContacts();
}

function updateAllContacts() {
    allContacts = users.map(user => user.name).sort();
}

async function getRandomColor() {
    let colors = ["orange", "hsl(193.32deg 88.4% 45.3%)", "hsl(330.81deg 88.4% 45.3%)", "hsl(0deg 97.03% 50.22%),rgb(221, 23, 221),rgb(31, 196, 31)"];
    let randomIndex = Math.floor(Math.random() * colors.length);
    let randomColor = colors[randomIndex];
    return randomColor;
}

async function register() {
    Btn.disabled = true;
    let name = inputName.value;
    let email = inputEmail.value
    renderfirstNames(name);
    let rendomColor = await getRandomColor();
    if (Array.isArray(users)) {
      users.push({
        'name': name,
        'email': email,
        'password': password.value,
        'contact': [],
        'tel': '000',
        'firstLetter': initials,
        'color': rendomColor,
      });
      await setItem('users', JSON.stringify(users))
      clearInput();
      render();
      back();
      setinLocalstorage(email)
    }
}

function setinLocalstorage(email){
    let user =  users.find(u => u.email == email);
    let userAsString = JSON.stringify(user);
    localStorage.setItem('user', userAsString);
    location.href = "summary.html";
}

function clearInput(){
    inputName.value = '';
    inputEmail.value = '';
    password.value = '';
    Btn.disabled = false;
}

function renderfirstNames(inputname){
  let names = inputname.split(' ');
  initials = '';
  for(let i = 0; i < names.length; i++){
      let name = names[i];
      let initial = name.charAt(0);
      initials += initial;
  }
  updateAllContacts(); 
}