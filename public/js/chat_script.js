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
    
} else {
    window.location = "/";
}

const socket = io.connect();
socket.on('message', message => {
    console.log(message);
});
socket.on('outMessage', message => {        
    console.log(message);
    document.getElementById('messageText').innerHTML += '<p>' + message;   
})

function sendMessage(){
    socket.emit('chatMessage', document.getElementById('message').value);
    document.getElementById('message').value = "";      
}

function logout(){
    eraseCookie('userId');
    window.location = "/";
}