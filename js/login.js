let checked = false;

function RememberMeGetLocalStorage(){
    let RemeberMeAsString = localStorage.getItem('checkbox');
    if(RemeberMeAsString){
        let RemeberMeAsJson = JSON.parse(RemeberMeAsString);
        checked = RemeberMeAsJson;
        RememberMeSetLocalStorage();
        loadFromLocalStorage();
    }
}

function RememberMeSetLocalStorage(){
    let inputcheck = document.getElementById('check');
    if(checked == true){
        localStorage.setItem('checkbox', checked);
        inputcheck.checked = checked;
        checked = false;
    }else{
        inputcheck.checked = checked;
        localStorage.setItem('checkbox', checked);
        checked = true;
    }
}

function loadFromLocalStorage(){
    let userAsString = localStorage.getItem('user');
    if(userAsString){
        let userAsJson = JSON.parse(userAsString);
        pushInInput(userAsJson);
    }
}

function pushInInput(userAsJson){
    if(checked == false){
        let email = document.getElementById('email');
        let password = document.getElementById('password');
        email.value = userAsJson['email'];
        password.value = userAsJson['password'];
        seePassword();
    }else{
        email.value = '';
        password.value = '';
    }
}

function login(event){
    event.preventDefault();
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find(u => u.email == email.value && u.password == password.value);
    trueOrFalse(email,password,user);
}

function guestLogin(){
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    email.value = 'Guest@Guest.de';
    password.value = '123456789';
    let user = users.find(u => u.email == email.value && u.password == password.value);
    trueOrFalse(email,password,user);
}

function trueOrFalse(email,password,user){
    if(user){
        if(user.email != 'Guest@Guest.de'){
            let userAsString = JSON.stringify(user);
            localStorage.setItem('user', userAsString);
        }
        location.href = "summary.html";
    }else{
        email.value = ''
        password.value = ''
        document.getElementById('wrong').classList.remove('d-none');
    }
}

function forgotPassword(){
    alert('You can not canges it!')
}