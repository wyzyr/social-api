var express = require('express');
var router = express.Router();
var db = require('../database/database');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');




router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));


router.use(function(req,res,next) {
    var token =req.headers['auth-token'];
    jwt.verify(token, process.env.SECRET, function(err, decoded){
        if(err) {
           res.status(400).send("Token is invalid"); 
        }else {
            console.log("This is user ID", decoded.id);
            req.user_id = decoded.id;
            next();
        }
    })    
});


router.get('/get_friends', function(req, res) {
    var query = "SELECT friend.friend_id, friend.date_friended, u.username, u.display_name FROM user_friends friend INNER JOIN users u ON(u.id = friend.friend_id) WHERE user_id ="+ req.user_id;
    db.query(query).spread(function(result,metadata){ 
        res.json({
            
            data: result
        });
    
    }).catch(function(err) {
        res.status(500).send(err)
    })
});



router.get('/get_friend_request',function(req,res) {
    var query = "SELECT request.id, u.username, request.sender_id FROM user_friend_requests request INNER JOIN users u ON u.id = request.sender_id GROUP BY request.id, request.receiver_id, u.username HAVING request.receiver_id="+ req.user_id +"AND status = 'pending'";
    
    db.query(query).spread(function(result, metadata) {
        
        res.json({
            data: result
        });
    }).catch(function(err) {
        res.status(500).send(err)
});
})




router.get('/get_users_by_quantity', function(req,res) {
    var query = "SELECT id, username, first_name, last_name FROM users WHERE id != " + req.user_id + " AND id NOT IN (SELECT friend_id FROM user_friends WHERE user_id ="+ req.user_id+")";
    
    db.query(query).spread(function(result, metadata) {
        
        res.json({
            data: result
        })
        
    }).catch(function(err){
             res.status(500).send("Unable to query this time!!")
             })
})









router.post('/update_rating', function(req,res) {
    var query = "UPDATE users SET rating =" + req.body.rating + "WHERE id = " +req.user_id;
     db.query(query).spread(function(result, metadata) {
      res.status(200).send("Update sucesfull")
     
     }).catch(function(err) {
        res.status(500).send(err)
     } )
})



router.post('/update-details', function(req,res){
    var query = "UPDATE users SET username='" + req.body.content + "', display_name = '" + req.body.display + "', first_name = '" + req.body.first + "', last_name = '" + req.body.last + "' WHERE id = " +req.user_id;
    db.query(query).spread(function(result, metadata) {
      res.status(200).send("Update sucesfull")
     
     }).catch(function(err) {
        res.status(500).send(err)
     } )
})



router.post('/request_friend', function(req,res) {
   var query = "SELECT * FROM user_friend_requests WHERE sender_Id=" + req.user_id + " AND receiver_Id = " + req.body.receiver_Id;
    
    db.query(query).spread(function(result, metadata) {
      if(result.length === 0) {
          insertRequest();
      }  
   
    }).catch(function(err){
        res.status(500).send(err);
    });
    
    function insertRequest(){
        var query = "INSERT INTO user_friend_requests (sender_Id, receiver_Id, status) VALUES (" + req.user_id + ","+ req.body.receiver_Id + ",'pending')";
        
        db.query(query).spread(function(result, metadata){ 
            res.status(200).send("Friend request created sucessfully")
        
        }).catch(function(err) {
            res.status(500).send(err)
        })
    }
});
router.post('/request_friend_respond',function(req,res) {
    var query = "SELECT * FROM user_friend_requests WHERE id=" + req.body.request_id;
    var senderId;
    var receivedId;
    
    db.query(query).spread(function(result, metadata){
        if (result.length > 0){
            senderId = result[0].sender_id;
            receivedId = result[0].receiver_id;
            updateRequest();
        } else {
            res.status(400).send("Request Doesn't Exist :(")
        }
    });
    
    function updateRequest(){
        var isAccepted = req.body.confirmation === 'confirmed';
        var query;
        
        if(isAccepted){
            query = "UPDATE user_friend_requests SET status='confirmed' WHERE id=" + req.body.request_id;
        } else {
            query = "DELETE FROM user_friend_requests WHERE id=" + req.body.request_id;
        }
        
        db.query(query).spread(function(){
            if (isAccepted){
                performSenderInsert();
            } else {
                res.status(200).send("We have successfully deleted the request.")
            }
        }).catch(function(){
            res.status(400).send("Unable to process Update to User_Friend_Requests at this time")
        })
    }
    
    function performSenderInsert(){
        var query = "INSERT INTO user_friends (user_id, friend_id, date_friended) VALUES (" + senderId + ", " + receivedId + ", now())";
        
        db.query(query).spread(function(){
            performReceiverInsert();
        }).catch(function(){
            res.status(500).send("Unable to send a friend request at this time.")
        })
    }
    
    function performReceiverInsert(){
        var query = "INSERT INTO user_friends (user_Id, friend_Id, date_friended) VALUES (" + receivedId + ", " + senderId + ", now())";
        
        db.query(query).spread(function(){
            res.status(200).send("The user was successfully confirmed")
        }).catch(function(){
            res.status(500).send("Unable to send a friend request at this time.")
        })
    }
    
});






module.exports = router;