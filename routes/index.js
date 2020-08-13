const mysql = require('mysql');
require('dotenv').config();
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bodyParser = require("body-parser");
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
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
        var password = process.env.EXPRESS_APP_DB_ENCRYPTED_PASSWORD;
        const user = {
          scope:['signedIn'],
          password
        }

        let token = jwt.sign({user}, process.env.EXPRESS_APP_SECRET_KEY, { expiresIn: '1d'}, (err, token) => {
            if (err) console.log(err)
            else{
              // console.log('pushing token to cookie storage')
              // res.cookie('token', token, { httpOnly: true });
              res.send(token);
              // res.json({token});
            }
          });
        
        connection.end();
      })
    })
  }
})

router.post('image/upload', verifyToken, (req, res) => {
  if(!req.token){
    res.sendStatus(403);
  }
  jwt.verify(req.token, process.env.EXPRESS_APP_SECRET_KEY, (err, authData) => {
    if (err) res.sendStatus(403)
    else{
      let tokenParts = parseJwt(req.token);
      bcrypt.compare(process.env.EXPRESS_APP_DB_PASSWORD, tokenParts.user.password, (err, result) => {
        if(err){
          console.log(err)
          return res.sendStatus(403)
        }
        if(!result){
          console.log(result)
          return res.sendStatus(403)
        }
        
      })
    }
  })
})



router.post('/image/add', verifyToken, (req, resp) => {
  console.log('file', req)
  if(!req.token){
    res.sendStatus(403);
  }
  jwt.verify(req.token, process.env.EXPRESS_APP_SECRET_KEY, (err, authData) => {
    if (err) res.sendStatus(403)
    else{
      let tokenParts = parseJwt(req.token);
      bcrypt.compare(process.env.EXPRESS_APP_DB_PASSWORD, tokenParts.user.password, (err, result) => {
        if(err){
          console.log(err)
          return res.sendStatus(403)
        }
        if(!result){
          console.log(result)
          return res.sendStatus(403)
        }
        var connection = mysql.createConnection({
          host: process.env.EXPRESS_APP_DB_HOST,
          user: process.env.EXPRESS_APP_DB_USER,
          password: process.env.EXPRESS_APP_DB_PASSWORD,
          database: process.env.EXPRESS_APP_DB_NAME
        })

        multer({storage: storage});

        let imageName = req.body.data.imageName;
        let fileType = req.body.data.fileType;
        let imageLocation = req.body.data.formData;
        let sittingType = req.body.data.sittingType
        let imageComments = req.body.data.imageComments
        const INSERT_PHOTOGRAPHS_QUERY = "INSERT INTO photographs (imageName, fileType, imageLocation, sittingType, imageComments) VALUES ('"+imageName+"', '"+fileType+"', '"+imageLocation+"', '"+sittingType+"', '"+imageComments+"')"
        
        connection.connect(err => {
          if (err){ 
            console.log('ERROR', err)
            return resp.sendStatus(403);
        }
          else
          console.log('Connection Success');
      })
        
        connection.query(INSERT_PHOTOGRAPHS_QUERY, (err, results) => {
            if (err){
                return resp.sendStatus(403)
            }
            else{
              resp.sendStatus(200)
            }
            connection.end();
         })
      })
      
    }
  })
})


router.get('/images', verifyToken, (req,res) => {
  if(!req.token){
    res.sendStatus(403);
  }
  jwt.verify(req.token, process.env.EXPRESS_APP_SECRET_KEY, (err, authData) => {
    if (err) {
      console.log(err)
    res.sendStatus(403)
    }
    else{
      let tokenParts = parseJwt(req.token);
      bcrypt.compare(process.env.EXPRESS_APP_DB_PASSWORD, tokenParts.user.password, (err, result) => {
        if(err){
          console.log(err)
          return res.sendStatus(403)
        }
        if(!result){
          console.log(result)
          return res.sendStatus(403)
        }
        var connection = mysql.createConnection({
          host: process.env.EXPRESS_APP_DB_HOST,
          user: process.env.EXPRESS_APP_DB_USER,
          password: process.env.EXPRESS_APP_DB_PASSWORD,
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
            res.status(200);
            res.send(results)
          }
          connection.end();
        })
      })
    }
  })
  
});

router.get('/image/:id', verifyToken, (req, res) => {
  console.log(req.token)
  if(!req.token){
    res.sendStatus(403);
  }
  if(!req.params.id || req.params.id === 'undefined'){
    res.status("400");
    res.send("Invalid photo id!");
  }else{
    jwt.verify(req.token, process.env.EXPRESS_APP_SECRET_KEY, (err) => {
      if (err) {
        console.log('err', err)
      res.sendStatus(403)
      }
      else{
        let tokenParts = parseJwt(req.token);
        bcrypt.compare(process.env.EXPRESS_APP_DB_PASSWORD, tokenParts.user.password, (err, result) => {
          if(err){

           
            return res.sendStatus(403)
          }
          if(!result){
            
            return res.sendStatus(403)
          }
          var connection = mysql.createConnection({
            host: process.env.EXPRESS_APP_DB_HOST,
            user: process.env.EXPRESS_APP_DB_USER,
            password: process.env.EXPRESS_APP_DB_PASSWORD,
            database: process.env.EXPRESS_APP_DB_NAME
          })
          let photoID = req.params.id;
          const SELECT_IMAGE_BY_ID_QUERY = `SELECT * FROM photographs WHERE photoId = ${photoID}`
          
          connection.connect(err => {
              if (err) console.log('ERROR', err)
              else
              console.log('Connection Success');
          })
        
          connection.query(SELECT_IMAGE_BY_ID_QUERY, function (err, results) {
            if (err){
                return res.send(err)
            }
            else{
              console.log('results', results[0]);
                res.status(200);
                res.send(results)
              }
            connection.end()
          })
        })
        
      }
    
    });
  }
})

router.post('/image/delete/', verifyToken, (req, res) => {
  console.log('body',req.body)
  if(!req.token){
    res.sendStatus(403);
  }
  if(!req.body.data.id || req.body.data.id === 'undefined'){
    res.status("400");
    res.send("Invalid photo id!");
  }else{
    jwt.verify(req.token, process.env.EXPRESS_APP_SECRET_KEY, (err) => {
      if (err) {
        console.log(err)
      res.sendStatus(403)
      }
      else{
        let tokenParts = parseJwt(req.token);
        bcrypt.compare(process.env.EXPRESS_APP_DB_PASSWORD, tokenParts.user.password, (err, result) => {
          console.log('results', result)
          if(err){
            return res.sendStatus(403)
          }
          if(!result){
            console.log('forbidden')
            return res.sendStatus(403)
          }
          var connection = mysql.createConnection({
            host: process.env.EXPRESS_APP_DB_HOST,
            user: process.env.EXPRESS_APP_DB_USER,
            password: process.env.EXPRESS_APP_DB_PASSWORD,
            database: process.env.EXPRESS_APP_DB_NAME
          })
          let photoID = req.body.data.id;
          console.log(typeof photoID);
          const DELETE_IMAGE_BY_ID_QUERY = "DELETE FROM photographs WHERE photoID = '"+photoID+"'"
          
          connection.connect(err => {
              if (err) console.log('ERROR', err)
              else
              console.log('Connection Success');
          })
        
          connection.query(DELETE_IMAGE_BY_ID_QUERY, function (err, results) {
            if (err){
                return res.send(err)
            }
          else{
              res.sendStatus(200);
            }
            connection.end();
          })
        })
      }
    });
  }
})

router.post('/image/update', verifyToken, (req, res) => {
  if(!req.token){
    res.sendStatus(403);
  }
  if(!req.body.id || req.body.id === 'undefined'){
    res.status("400");
    res.send("Invalid photo id!");
  }else{
    jwt.verify(req.token, process.env.EXPRESS_APP_SECRET_KEY, (err) => {
      if (err) {
        console.log(err)
      res.sendStatus(403)
      }
      else{
        let tokenParts = parseJwt(req.token);
        bcrypt.compare(process.env.EXPRESS_APP_DB_PASSWORD, tokenParts.user.password, (err, result) => {
          if(err){
            return res.sendStatus(403)
          }
          if(!result){
            return res.sendStatus(403)
          }
          var connection = mysql.createConnection({
            host: process.env.EXPRESS_APP_DB_HOST,
            user: process.env.EXPRESS_APP_DB_USER,
            password: process.env.EXPRESS_APP_DB_PASSWORD,
            database: process.env.EXPRESS_APP_DB_NAME
          })
          let photoID = parseInt(req.body.id);
          console.log(typeof photoID);
          let imageName = req.body.imageName.toString();
          let fileType = req.body.fileType.toString();
          let sittingType = req.body.sittingType.toString();
          const UPDATE_IMAGE_BY_ID_QUERY = "UPDATE photographs SET imageName = '" +imageName+"', fileType = '"+fileType+"', sittingType = '"+sittingType+"' WHERE photoID = '"+photoID+"'"
          
          connection.connect(err => {
              if (err) console.log('ERROR', err)
              else
              console.log('Connection Success');
          })
        
          connection.query(UPDATE_IMAGE_BY_ID_QUERY, function (err, results) {
            if (err){
                return res.send(err)
            }
          else{
              res.status(200);
              res.send(results)
            }
            connection.end();
          })
        })
      }
    });
  }
})

router.post("/verifyToken", verifyToken, (req, res) => {
  if(!req.token){
    res.sendStatus(403);
  }
  jwt.verify(req.body.token, process.env.EXPRESS_APP_SECRET_KEY, (err) => {
    if (err) {
      console.log(err);
    res.sendStatus(403);
    }
    else{
      res.sendStatus(200);
    }
  })

})

router.post("/encrypt" , (req,res) => {
  const encryption = encryptPW(req.body.string);
  res.send(encryption)
})

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
    res.sendStatus(403);
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
    if(err){ console.log(err)
      return err;
    };
    console.log(hash);
    return hash;
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

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "/media")

  },
  filename: function (req, file, cb) {

    cb(null, file.fieldname + '-' + Date.now())

  }

})





module.exports = router;
