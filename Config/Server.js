const express = require('express');
const bodyParser = require('body-parser')
const consign = require('consign');
const app = express();

app.listen(process.env.PORT || 3000, function(){
    console.log('server running on port 3000');    
 });

 app.use(express.static("App/Public"));
 app.use(bodyParser.urlencoded({ extended: true }))
 app.set('view engine','ejs');
 app.set('views','./App/views');

 
 module.exports = function(model){
    consign().include('./App/routes').into(app,model);
    return app;
 }