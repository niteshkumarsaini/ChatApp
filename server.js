const bodyParser = require("body-parser");
const express=require("express");
const app=express();
const http=require("http").createServer(app)
app.use(bodyParser.urlencoded({extended:true}))


const port=9000;
app.use('/',express.static('public'));
http.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})
app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/file.html");
})
app.get("/static",(req,res)=>{
    app.get('/',(req,res)=>{
        res.sendFile(__dirname+"/file.html");
    })
    
    // res.sendFile(__dirname+"/error.html");
})
app.post('/static',(req,res)=>{
    let email=req.body.email;
    let password=req.body.password;
    if(email=="niteshsaini8077@gmail.com" && password=='0123456789'){
        res.sendFile(__dirname+"/index.html");

    }
    else{
        res.statusCode=404;
        res.sendFile(__dirname+"/error.html");
        
    }
})
const io=require("socket.io")(http)
const users={};
io.on('connection',socket=>{
socket.on('new-user-joined',name1=>{
    console.log("New user joined",name1);
    users[socket.id]=name1;
    const obj={user:name1,message:`Joined the chats`};
    socket.broadcast.emit('user-joined',obj);

});
socket.on('message',(msg)=>{
 socket.broadcast.emit('message',msg)

})


socket.on("disconnect",(name)=>{
   name=users[socket.id];
    
    socket.broadcast.emit('leaves',name);
    // console.log('left the chats')

})

})

