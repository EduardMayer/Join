let users = [];
let initials = '';

async function userInit(){
    await loadUsers();
}

function showLogOut(){
    let logOutButton =  document.getElementById('logout');
    if(logOutButton.classList.contains('d-none')){
        logOutButton.classList.remove('d-none')
    }else{
      logOutButton.classList.add('d-none');
    };
}

function logout(){
  location.href = "index.html";
}

async function loadUsers() {
    const storedUsers = await getItem('users');
    users = storedUsers ? JSON.parse(storedUsers) : [];
  }

async function register() {
    Btn.disabled = true;
    let name = inputName.value;
    renderfirstNames(name);
    if (Array.isArray(users)) {
      users.push({
        'name': name,
        'email': inputEmail.value,
        'password': password.value,
        'contact': [],
        'tel': 000,
        'firstLetter': initials,
      });
      await setItem('users', JSON.stringify(users))
      clearInput();
      render();
      back();
      location.href = "summary.html";
    }
}

function clearInput(){
    inputName.value = '';
    inputEmail.value = '';
    password.value = '';
    Btn.disabled = false;
}

function renderfirstNames(inputname){
  let names = inputname.split(' ');

  for(let i = 0; i < names.length; i++){
      let name = names[i];
      let initial = name.charAt(0);
      initials += initial;
  }
}