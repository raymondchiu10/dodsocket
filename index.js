const port = 10000;
const server = require("http").Server();

var io = require("socket.io")(server);

var users = {};

io.on("connection", function(socket){
    
    socket.on("disconnect", function(){
        
        var index = users[this.myRoom].indexOf(socket.id);
        users[this.myRoom].splice(index, 1);
        io.in(this.myRoom).emit("DoDsomeoneDcd", users[this.myRoom]);
    })
    
    socket.on("DoDjoinroom", function(data){
        console.log("joining room", data.room, data.name);
        
        socket.join(data.room);
        socket.myRoom = data.room;
        
        if(!users[data.room]){
            users[data.room] = [];
        };
        
        users[data.room].push(data.name);
        
        io.in(data.room).emit("DoDuserjoined", users[data.room]);
        
    });
    
    socket.on("DoDchoseHost", function(){
        socket.to(this.myRoom).emit("DoDconfirmHost");
    });
    
    socket.on("DoDconfirmHostDoor", function(data){
        io.in(this.myRoom).emit("DoDreceivedHostDoor", data);
    });
    
    socket.on("DoDsubmitGuess", function(){
        io.in(this.myRoom).emit("DoDreceiveGuess");
    });
    
    socket.on("DoDwrongGuess", function(){
        io.in(this.myRoom).emit("DoDlostPlayer");
    });
    
    socket.on("DoDresetGame", function(){
        io.in(this.myRoom).emit("DoDresetAllStateVariables");
    });
    
});

server.listen(port, (err)=>{
    if(err){
        console.log(err);
        return false;
    }
    
    console.log("Port is running");
});