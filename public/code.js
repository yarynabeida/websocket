const app = document.querySelector(".app");
const joinButton =  document.getElementById("join-user");
const sendButton =  document.getElementById("send-message");
const exitButton =  document.getElementById("exit-chat");
const socket = io();
    
let uname;
    
function joinButtonHandler(e){
    e.preventDefault();
    let username = app.querySelector(".join-screen #username").value;
    if (username.length == 0) {
        return;
    }
    
    socket.emit("newuser", username);
    uname = username;
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
};
    
function sendButtonHandler(e){ 
    e.preventDefault();
    
    let message = document.getElementById("message-input").value;
    if (message.length == 0) {
        return;
    }
    
    renderMessage("my", {
        username: uname,
        text: message
    });
    
    socket.emit("chat", {
        username: uname,
        text: message
    });
    document.getElementById("message-input").value = "";
};
    
socket.on("update", function(update) {
    renderMessage("update", update);
});
    
socket.on("chat", function(message) {
    renderMessage("other", message);
});

function renderMessage(type, message){
    const messageContainer = document.getElementById("messages");
    if (type == "my"){
        const el = document.createElement("div");
        el.setAttribute("class", "message my-message");
        el.innerHTML = 
            `<div>
                <div class="name">You</div>
                <div class="text">${message.text}</div>
            </div>`
        ;
        messageContainer.appendChild(el);
    } else if (type == "other") {
        const el = document.createElement("div");
        el.setAttribute("class", "message other-message");
        el.innerHTML = 
            `<div>
                <div class="name">${message.username}</div>
                <div class="text">${message.text}</div>
            </div>`
        ;
        messageContainer.appendChild(el);
        
    } else if (type == "update") {
        const el = document.createElement("div");
        el.setAttribute("class", "update");
        el.innerHTML = `${message}`;
        messageContainer.appendChild(el);
        
    }
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
};
    
function exitButtonHandler(e){ 
    e.preventDefault();
    socket.emit("exituser", uname);
    window.location.href = window.location.href;
};
    
joinButton.addEventListener('click', joinButtonHandler);
sendButton.addEventListener('click', sendButtonHandler);
exitButton.addEventListener('click', exitButtonHandler);
