var express = require('express');
var router = express.Router();
var db = require('../database/database');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');




router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

/*router.use(function(req,res,next) {
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


*/


router.get('/get-profile-id/:id', function(req, res){
   var query ="SELECT id, username, display_name, first_name, last_name, rating FROM users WHERE id=" +req.params.id;

    // db.query(query).spread(function(result, metadata){a
    //     console.log(result);
    //     res.json({
    //         data: result
    //     })
    //
    // }).catch(function(err){
    //     res.status(500).send("Unable to grab User ID");
    // });
    db.query(query).then(user => {
        res.json(user[0]);
    });
  

});









module.exports = router;