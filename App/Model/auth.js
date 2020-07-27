const db = require('./DBModule')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs'); 

db.connect()
    .then(() => console.log('database connected'))          
    .catch((e) => {
        console.error(e);
        // Always hard exit on a database connection error
        process.exit(1);
});

//Autenticação do usuário 
module.exports = function(passport){

    function findUser(username, callback){
       db.get().collection("Users").findOne({"username": username}, function(err, doc){
          callback(err, doc);
      });
    }
  
    function findUserById(id, callback){
      const ObjectId = require("mongodb").ObjectId;
      db.get().collection('Users').findOne({_id: ObjectId(id) }, (err, doc) => {
          callback(err, doc);
      });
    }
  
    passport.serializeUser(function(user, done){
      done(null,user._id);
    });
  
    passport.deserializeUser(function(id, done){
      findUserById(id, function(err,user){
          done(err, user);
      });
    });
  
    passport.use(new LocalStrategy( { 
        usernameField: 'username',
        passwordField: 'password'
        },(username, password, done) => {
          findUser(username, (err, user) => {
            if (err) 
            { 
              return done(err) 
            }
            // usuário inexistente
            if (!user) 
            { 
              return done(null, false) 
            }
            // comparando as senhas
            bcrypt.compare(password, user.password, (err, isValid) => {
              if (err) { return done(err) }
              if (!isValid) { 
                   console.log("senha invalida "+user.password); 
                   return done(null, false) 
              }
              return done(null, user)
            })
          })
        }
    ));
  }

