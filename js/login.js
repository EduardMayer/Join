function login(){
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find(u => u.email.value == email.value && u.password.value == password.value);
    if(user){
        //Anmeldung
    }
}