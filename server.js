const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const Users = require('./models/Users');
const cookieParser = require('cookie-parser');
const PORT = 3000;

app.set('view engine', 'ejs');
app.use('/views', express.static('views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
let users = [];

let Schema = mongoose.Schema;
mongoose.connect('mongodb+srv://thelyaa:Fkm,tlj1@socketchat.ymrvf.mongodb.net/socketChat?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

app.get('/', function(req, res){
    res.render('auth')
});

app.get('/chat', (req, res) => {
    res.render('chat')
});

let userId = "";
app.post('/checkUser', (req, res) => {
    console.log(req.body.email, req.body.password);
    Users.find({
        email: req.body.email
    }, (err, result) => {
        console.log(result, result.length);
        if (result.length !== 0 && req.body.password === result[0].password) 
            res.send({
                success: true,
                userId: result[0]._id
            });
        userId = result[0]._id;
    });
});

const server = app.listen(PORT, () => console.log('server started'));
const io = require('socket.io')(server);

io.sockets.on('connection', socket => {
    console.log('success');
    
    socket.emit('message', {msg: 'welcome', userId: userId});
    
    socket.broadcast.emit('message', {msg: 'new user', userId: userId});
     
    socket.on('disconnect', () => {
        console.log('exit');
    });
    
    socket.on('chatMessage', (data) => {
        console.log(data);    
        io.emit('outMessage', data);
    });   
});