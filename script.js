let isPasswordSeen = false

function seePassword(){
    let input = document.getElementById('password');
    if(!isPasswordSeen){
        input.type = 'text';
        isPasswordSeen = true;
    }else{
        input.type = 'password';
        isPasswordSeen = false;
    }
}

function checkInput(){
    let input = document.getElementById('password');
    let img = document.getElementById('password-img');
    if(input.value != ''){
        if(!isPasswordSeen){
            img.src = 'nicht sehen';
        }else{
            img.src = 'sehen';
        }
    }else{
        img.src = 'img/passwordicon.svg';
    }
}