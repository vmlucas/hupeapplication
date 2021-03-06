var moment = require('moment');

function authenticationMiddleware () {  
    return function (req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      }
      res.redirect("/login?fail='Refaça o Login'")
    }
}

module.exports = function(app,model,passport){
app.post('/showCols',authenticationMiddleware (), (req, res) => {
    var myData = (req.body)
    model.getCollectionsNotNull( myData, function(err, results) {
         if (err) return console.log(err)
         res.render('index.ejs', { moment: moment, data: results })
 
     })     
 })
}