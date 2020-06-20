
module.exports = function(app,model){
   app.get('/cad', (req, res) => {
      res.render('Cadastro.ejs')
   })
}