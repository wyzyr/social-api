var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var db = require('./server/database/database');
var jwt = require('jsonwebtoken');
var app = express();

var http = require('http').createServer(app);

var io = require('socket.io')(http);

app.use(cors());

process.env.SECRET = "Some SECRET ENV";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/client', express.static(__dirname + '/client'));


//Controllers
var userController = require('./server/controllers/user-controller');


//ROUTERS
var secureUserRouter = require('./server/routes/user');
var securePostRouter = require('./server/routes/post');
var secureProfileRouter = require('./server/routes/user-profile');


app.use('/secure-api/user',secureUserRouter);
app.use('/secure-api/post', securePostRouter);
app.use('/secure-api/user-profile', secureProfileRouter);


//routes
app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
})

io.on('connection', function(socket){    
   console.log('user conected'); 
    socket.on('disconnect', function(){
       console.log('user disconnected'); 
    });
});

io.on('foo' , (data, callback) => {
    callback(0);
});

app.post('/api/user/create', userController.createUser);
app.post('/api/user/login', userController.logIn);



db.sync().then(function () {
    http.listen(process.env.PORT || 5000, function(){
        console.log("it works");
 })
})
