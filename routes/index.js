const mysql = require('mysql');
require('dotenv').config();
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false }) 
const _ = require('lodash');
global.atob = require("atob");
const bcrypt = require('bcrypt');
const saltRounds = 12;
const path = require('path')

// 

var router = express.Router();
router.use(cors())

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/images/',  (req, res) => {
//   res.send('Insert of photograph is successfull')
  
// })

router.post('/auth', (req, res) => {
  if(!req.body.username || !req.body.password){
    res.status("400");
    res.send("Invalid details!");
  }else{
    
    let username = JSON.stringify(req.body.username)
    const GET_USER_DATA_QUERY = `SELECT * FROM photoLogin WHERE ${username} = username`;
  connection = mysql.createConnection({
    host: process.env.EXPRESS_APP_DB_HOST,
    user: process.env.USER_DB_USER,
    password: process.env.USER_DB_PW,
    database: process.env.EXPRESS_APP_DB_NAME
  });

  connection.connect(err => {
    if (err) console.log(err);
    console.log('success');
  });

  connection.query(GET_USER_DATA_QUERY, (err, results) => {
    if (err){
        console.log(err);
    }
      console.log('comparing password');
      bcrypt.compare(req.body.password, results[0].password, (err, result) => {
        if(err)console.log(err)
        if(result !== true){
          console.log(result);
          return res.sendStatus(403)
        }
        var username = process.env.EXPRESS_APP_DB_USER;
        var password = process.env.EXPRESS_APP_DB_PASSWORD;
        const user = {
          scope:['signedIn'],
          username,
          password
        }

        let token = jwt.sign({user}, process.env.EXPRESS_APP_SECRET_KEY, { expiresIn: '10m'}, (err, token) => {
            if (err) console.log(err)
            else{
              console.log('pushing token to cookie storage')
              res.cookie('token', token, { httpOnly: true });
              res.send(token);
            }
          });
        
        connection.end();
      })
    })
  }
})



router.get('/images/add', verifyToken, (req, resp) => {
  jwt.verify(req.token, process.env.EXPRESS_APP_SECRET_KEY, (err, authData) => {
    if (err) res.sendStatus(403)
    else{
      res.sendStatus(200);
      const { imageName, fileType, imageLocation, sittingType } = req.query;
      const INSERT_PHOTOGRAPHS_QUERY = `INSERT INTO photographs (imageName, fileType, imageLocation, sittingType) VALUES ('${imageName}', '${fileType}', '${imageLocation}', '${sittingType}')`
      connection.query(INSERT_PHOTOGRAPHS_QUERY, (err, results) => {
        if (err){
            return resp.send(err)
        }
        else{
            return resp.send('Insert of photograph is successfull')
        }
    })
    }
  })
})

router.get('/allImages', (reg, res) => {
  var connection = mysql.createConnection({
    host: process.env.EXPRESS_APP_DB_HOST,
    user: process.env.EXPRESS_APP_GET_USER,
    password: process.env.EXPRESS_APP_GET_USER_PW,
    database: process.env.EXPRESS_APP_DB_NAME
  })
  
  const SELECT_ALL_IMAGES_QUERY = 'SELECT image FROM photographs'
  
  connection.connect(err => {
      if (err) console.log('ERROR', err)
      else
      console.log('Connection Success');
  })

connection.query(SELECT_ALL_IMAGES_QUERY, function (err, results) {
  if (err){
      return res.send(err)
  }
else{
    res.send(results)
  }
  connection.end();
})
})

router.get('/images', verifyToken, (req,res) => {
  jwt.verify(req.token, process.env.EXPRESS_APP_SECRET_KEY, (err, authData) => {
    if (err) {
      console.log(err)
    res.sendStatus(403)
    }
    else{
      let tokenParts = parseJwt(req.token);
      var connection = mysql.createConnection({
          host: process.env.EXPRESS_APP_DB_HOST,
          user: tokenParts.user.username,
          password: tokenParts.user.password,
          database: process.env.EXPRESS_APP_DB_NAME
        })
        
        const SELECT_ALL_IMAGES_QUERY = 'SELECT * FROM photographs'
        
        connection.connect(err => {
            if (err) console.log('ERROR', err)
            else
            console.log('Connection Success');
        })
      
      connection.query(SELECT_ALL_IMAGES_QUERY, function (err, results) {
        if (err){
            return res.send(err)
        }
      else{
          res.send(results)
        }
        connection.end();
      })
    }
  })
  
});

router.get('/users', function(req, res, next) {
	// Comment out this line:
  //res.send('respond with a resource');

  // And insert something like this instead:
  res.json([{
  	id: 1,
  	username: "samsepi0l"
  }, {
  	id: 2,
  	username: "D0loresH4ze"
  }]);
});

// 

function verifyToken(req, res, next){
  //Get header value
  const bearerHeader = req.headers['authorization']
  if(typeof bearerHeader !== 'undefined'){
    //split at the space
    const bearer = _.split(bearerHeader, ' ');
    
    // get token from array
    const bearerToken = bearer[1];
    req.token = bearerToken

    next();
  }
  else{
    //forbidden
    res.sendStatus(403)
  }
}


  function parseJwt (token) {
    if(!token){
      return null;
    }
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};
function encryptPW(myPlaintextPassword){
  bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    if(err) console.log(err);
    console.log(hash);
  });
}

function comparePW(myPlaintextPassword, hash){
  bcrypt.compare(myPlaintextPassword, hash, (err, result) => {
    // result == true
    if(err)console.log(err)
    if(result !== true){
      console.log(result);
      return result
    }
    console.log('result', result);
    return result
  });
}





module.exports = router;
