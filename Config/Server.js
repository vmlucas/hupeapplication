const express = require('express');
const bodyParser = require('body-parser')
const consign = require('consign');
const app = express();
const passport = require('passport')  
const session = require('express-session')  
const MongoStore = require('connect-mongo')(session)
const Conn = require('../App/Model/DBModule');
require('../App/Model/auth')(passport);

app.use(express.static("App/Public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({  
      store: new MongoStore({
             url: Conn.getURI(),
             collection: 'Users',
             ttl: 30 * 60 // = 30 minutos de sessão
      }),
      secret: '123',//configure um segredo seu aqui
      resave: false,
      saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
console.log("passport");
app.set('view engine','ejs');
app.set('views','./App/views');
app.listen(process.env.PORT || 3000, function(){
       console.log('server running on port 3000');  
});

 
module.exports = function(model){
      consign().include('./App/routes').into(app,model,passport);
      return app;
}  