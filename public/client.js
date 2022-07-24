const socket=io('http://localhost:9000')
let textarea=document.querySelector('#textarea');
let button=document.querySelector('.btn');
let messageArea=document.querySelector('.message-area');
var audioJoin=new Audio('s4.mp3');
var audioReceive=new Audio('s5.mp3');
var audioLeave=new Audio('s2.mp3');



let name1;
do{
    name1=prompt("Enter Your Name to Join")
    socket.emit('new-user-joined',name1);
    socket.on('user-joined',(obj)=>{
        appendMessage(obj,'incoming-message');
        audioJoin.play();

    })

}
while(! name1);
button.addEventListener('click',(e)=>{
    e.preventDefault();
    sendMessage(textarea.value);
    textarea.value="";
})
function sendMessage(msgs){
    let msg={
        user:name1,
        message:msgs.trim()
    }
    appendMessage(msg,'outgoing-message');
    socket.emit('message',msg)
}

function appendMessage(msg,type){
    let mainDiv=document.createElement('div');
    let className=type;
    mainDiv.classList.add(className,'message');
    let markup=`
    <h4>${msg.user}</h4>
    <p class="para">${msg.message}</p>`
    mainDiv.innerHTML=markup;
messageArea.append(mainDiv);
}
socket.on('message',(msg)=>{
    appendMessage(msg,'incoming-message');
    audioReceive.play();
   
})
// socket.on('left',(msg)=>{
//     appendMessage(msg,'incoming-message');
//     console.log(msg)
// })
socket.on('leaves',id=>{
  const obj={user:id,message:"Left the Chats"};
  appendMessage(obj,'incoming-message');
  audioLeave.play();
})
