let isPasswordSeen = false;
let eyeImg = false;



function init(){
    render();
}

function render(){
    let div = document.getElementById('loginDiv');
    div.innerHTML = renderHTML();
}

function renderSignUp(){
    document.getElementById('navbar').classList.add('d-none');
    let div = document.getElementById('loginDiv');
    div.innerHTML = SignUpHTML();
}

function renderPassword(){
    document.getElementById('navbar').classList.add('d-none');
    let div = document.getElementById('loginDiv');
    div.innerHTML = forgotMyPasswordHTML();
}

function seePassword(){
    let input = document.getElementById('password');
    let img = document.getElementById('password-img');
    if(!isPasswordSeen){
        input.type = 'text';
        isPasswordSeen = true;
        img.src = 'img/seePassword.svg';
    }else{
        input.type = 'password';
        isPasswordSeen = false;
        img.src = 'img/seeNotPassword.svg';
    }
}

function checkInput(){
    let input = document.getElementById('password');
    let img = document.getElementById('password-img');
    if(input.value == ''){
        input.type = 'password';
        img.src = 'img/passwordicon.svg';
    }else{
        img.src = 'img/seeNotPassword.svg';
    }
}

function back(){
    document.getElementById('navbar').classList.remove('d-none');
    render();
}



