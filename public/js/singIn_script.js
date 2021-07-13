const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s]).{8,}/;
const dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
let flag = false;

function setCookie(name, value, days){
    let expires = "";
    if (days){
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

if (getCookie('userId')){
    window.location = "/chat";  
}

function signInFormisValid(){
    
    let email = document.getElementById('email');
    let password = document.getElementById('password');   
    
    let elemArr = [];
    elemArr.push({elem: email, label: "email", error: 'emailError'});
    elemArr.push({elem: password, label: "password", error: 'passwordError'});
    
    putError(elemArr);
    if (!flag) {
        elemArr.forEach((i) => {
            console.log(i.label, ": ", i.elem.value);
        });
        $.post('/checkUser', {
            email: email.value,
            password: password.value,
        }, data => {
            console.log(data.success);
            setCookie('userId', data.userId);
            console.log(getCookie('userId'));
            if (data.success) window.location = "/chat";         
        });      
    }
}

function signUpFormIsValid(){
    
    let firstName = document.getElementById('firstName');
    let lastName = document.getElementById('lastName');
    let password = document.getElementById('password');
    let email = document.getElementById('email');
    let date = document.getElementById('date');
    
    let elemArr = [];
    elemArr.push({elem: email, label: "email", error: 'emailError'});
    elemArr.push({elem: password, label: "password", error: 'passwordError'});
    elemArr.push({elem: firstName, label: "first name", error: 'firstNameError'});
    elemArr.push({elem: lastName, label: "last name", error: 'firstNameError'});
    elemArr.push({elem: date, label: "date", error: 'dateError'});
    elemArr.push({elem: repeatPassword, label: "repeat", error: 'repeatPasswordError'});
    
    putError(elemArr)
    
//    console.log(firstName.value, lastName.value, password.value, email.value, date.value);
}

function putError(array){
    
    array.forEach((i) => {
        if (i.elem.value === ""){
            i.elem.style.borderColor = "red";
            document.getElementById(i.error).innerHTML = "Enter " + i.label;
            flag = true;
        }
        else if (i.label === "password" && !passReg.test(i.elem.value)) {
            i.elem.style.borderColor = "red";
            document.getElementById(i.error).innerHTML = "Incorrect password";
            flag = true;
        }
        else if (i.label === "date" && !dateReg.test(i.elem.value)){
            i.elem.style.borderColor = "red";
            document.getElementById(i.error).innerHTML = "Incorrect date format";    
        }
        else if (i.label === "repeat" && i.elem.value !== document.getElementById('password').value){
            document.getElementById('repeatPass').style.borderColor = "red";
            document.getElementById('repeatPasswordError').innerHTML = "Passwords didn't match";
        }
        else {
            i.elem.style.borderColor = "darkcyan";
            document.getElementById(i.error).innerHTML = "";
            flag = false;    
        }   
    })
//    if (value.value === ""){
//        value.style.borderColor = "red";
//        document.getElementById(errorDiv).innerHTML = "Enter " + label;
//    } 
//    else {
//        value.style.borderColor = "darkcyan";  
//        document.getElementById(errorDiv).innerHTML = "";
//    }
}