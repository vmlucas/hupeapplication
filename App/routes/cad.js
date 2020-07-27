
function authenticationMiddleware () {  
   return function (req, res, next) {
     if (req.isAuthenticated()) {
       return next()
     }
     res.redirect("/login?fail='Refaça o Login'")
   }
}

module.exports = function(app,model,passport){

   app.get('/cadAtend',authenticationMiddleware (), (req, res) => {
      res.render('CadastroAtend.ejs', { tipo: 'inicio'})
   })

   app.get('/cadAplic',authenticationMiddleware (), (req, res) => {
      res.render('CadastroAplic.ejs', { tipo: 'inicio'})
   })
}