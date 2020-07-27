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
    app.post('/buscarAtend', authenticationMiddleware (), (req, res) => {
        var myData = req.body;
        model.getPaciente(myData, function(err, results) {
             if (err) return console.log(err)
             res.render('CadastroAtend.ejs', { tipo: 'dados', name: myData.Nome, moment: moment, data: results})
         }) 
       
    })

    app.post('/buscarAplic', authenticationMiddleware (), (req, res) => {
      var myData = req.body;
      model.getPaciente(myData, function(err, results) {
           if (err) return console.log(err)
           res.render('CadastroAplic.ejs', { tipo: 'dados', name: myData.Nome, moment: moment, data: results})
       }) 
     
  })
 }