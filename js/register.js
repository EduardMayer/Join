let users = [];

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
    if (Array.isArray(users)) {
      users.push({
        'name': inputName.value,
        'email': inputEmail.value,
        'password': password.value,
        'contact': [],
        'img': 'img/guest.png',
      });
      await setItem('users', JSON.stringify(users))
      clearInput();
      render();
      back();
    }
}

function clearInput(){
    inputName.value = '';
    inputEmail.value = '';
    password.value = '';
    Btn.disabled = false;
}