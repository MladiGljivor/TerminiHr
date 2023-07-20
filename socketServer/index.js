const express = require('express');
const app = express();
var cors = require("cors")
var bodyParser =require("body-parser")
const http = require('http');
const PORT = 4000;
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/api", (req, res) => {

    res.json({

        message: "Hello world",

    });

});

io.on('connection', (socket) => {

    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('disconnect', () => {

      console.log('🔥: A user disconnected');

    });

});


server.listen(PORT, () => {
    console.log('listening on: 4000');
   
    
  });
  