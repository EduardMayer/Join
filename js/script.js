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



function renderHTML(){
    return`
    <div>
                    <h1>Log in</h1>
                    <div class="overH1-line">
                      <div class="h1-line"></div>
                    </div>
                </div>
                <form class="login-value">
                    <div class="relativ-for-icon">
                        <input required placeholder="Email" type="email" id="email">
                        <img src="img/emailicon.svg" alt="">
                      </div>
                      <div class="relativ-for-icon">
                        <input required onkeyup="checkInput()" id="password" placeholder="Password" type="password">
                        <img id="password-img" onclick="seePassword()" src="img/passwordicon.svg" alt="">
                        <span id="wrong" class="d-none worng">wrong password</span>
                    </div>
                    <div class="password-options">
                        <div class="checkbox">
                            <div>
                                <input type="checkbox">
                            </div>
                            <div>
                                <span>Remember me</span>
                            </div>
                        </div>
                        <div class="forgot">
                          <a onclick="renderPassword()">Forgot my password</a>
                        </div>
                      </div>
                      <div class="login-buttons">
                        <div>
                          <button type="submit" onclick="login(event)" class="login-button">Log in</button>
                        </div>
                        <div>
                          <button type="button" onclick="guestLogin()" id="guest" class="guest-button">Guest Log in</button>
                        </div>
                      </div>
                </form>

`;
}

function SignUpHTML(){
    return `
    <div class="back">
    <img onclick="back()" src="img/blackarrowicon.svg" alt="">
</div>
<div>
    <h1>Sign up</h1>
    <div class="overH1-line">
        <div class="h1-line"></div>
    </div>
</div>
<div class="login-value">
    <form onsubmit="register();return false;">
        <div class="relativ-for-icon">
            <input required id="inputName" placeholder="name" type="text" minlength="2">
            <img src="img/people.svg" alt="">
        </div>
        <div class="relativ-for-icon">
            <input required id="inputEmail" placeholder="Email" type="email">
            <img src="img/emailicon.svg" alt="">
        </div>
        <div class="relativ-for-icon">
            <input required onkeyup="checkInput()" id="password" placeholder="Password" type="password">
            <img id="password-img" onclick="seePassword()" src="img/passwordicon.svg" alt="">
        </div>
        <div class="login-buttons-sign-up">
            <div>
                <button id="Btn" class="login-button">Sign up</button>
            </div>
        </div>
    </form>
</div>

    `;
}

function forgotMyPasswordHTML(){
    return `
    
    <div class="back">
        <img onclick="back()" src="img/blackarrowicon.svg" alt="">
    </div>
    <div>
        <h1>I forgot my password</h1>
        <div class="overH1-line">
            <div class="h1-line"></div>
        </div>
    </div>
    <span class="Password-text">Don't worry! We will send you an email with the instructions to <br> reset your password.</span>
    <div class="login-value">
        <form>
            <div class="relativ-for-icon">
                <input required placeholder="Email" type="email">
                <img src="img/emailicon.svg" alt="">
            </div>
        </form>
    </div>
    <div class="login-buttons-sign-up">
        <div>
            <button style="width: 200px; margin-top: 20px;" class="login-button">Send me the Email</button>
        </div>
    </div>
</div>

    `;
}