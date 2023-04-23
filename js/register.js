let users = [];

async function userInit(){
    await loadUsers();
}

async function loadUsers(){
    users = await getItem('users')
}

async function register(){
    Btn.disabled = true;
    users.push({
        name: inputName.value,
        email: inputEmail.value,
        password: password.value
    });
    await setItem('users', JSON.stringify(users))
    clearInput();
}

function clearInput(){
    inputName.value = '';
    inputEmail.value = '';
    password.value = '';
    Btn.disabled = false;
}