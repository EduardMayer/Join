function login(event){
    event.preventDefault();
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find(u => u.email == email.value && u.password == password.value);
    trueOrFalse(email,password,user);
   
}

function guestLogin(){
    let email = 'Guest@Guest.de';
    let password = '123456789';
    let user = users.find(u => u.email == email.value && u.password == password.value);
    trueOrFalse(email,password,user);
}

function trueOrFalse(email,password,user){
    if(user){
        location.href = "summary.html";
    }else{
        email.value = ''
        password.value = ''
        document.getElementById('wrong').classList.remove('d-none');
    }
}