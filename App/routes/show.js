var moment = require('moment');

function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login?fail=true')
  }
}

module.exports = function(app,model,passport){
    //mostra todos os dados
    app.get('/show', authenticationMiddleware (), (req, res) => {
      model.getAllData((err, results) => {
         if (err) return console.log(err)
         res.render('index.ejs', { moment: moment, data: results })
 
      })
    })
}