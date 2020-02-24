var db = require('../database/database');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var jwt = require('jsonwebtoken');

module.exports.createUser = function(req, res) {
    var password = bcrypt.hashSync(req.body.user_password, salt);
    var query = "INSERT INTO users (username, user_password, rating) VALUES ('" + req.body.username + "','" + password + "','" + 0 + "')";
    
    db.query(query).spread(function(result, metadata) {
        res.status(200).send("User was created");
        
        }).catch(function(err){
        res.status(500).send("User was not created");
    })
}


module.exports.logIn = function(req, res) {
    var submittedPassword = req.body.loginPass;
    var query = "SELECT * FROM users WHERE username = '" + req.body.loginName +"'"; 
    
    db.query(query).spread(function(result, metadata) {
        if(result.length>0) {
         var userData = result[0];
            var isVerified = bcrypt.compareSync(submittedPassword,userData.user_password);
            
            if(isVerified) {
                delete userData.user_password;
                //user auth. Give token
                var token = jwt.sign(userData, process.env.SECRET, {
                    expiresIn : 60*60*24
                })
                res.json({
                    userData: userData,
                    token: token
                });
            }else {
                res.status(400).send("Falirue, wrong password or username ");
                
            }
        }


    }).catch(function(err){
        res.status(500).send("unable to precess");
    })
    
    
}

