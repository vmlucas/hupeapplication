function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect("/login?fail='Refaça o Login'")
  }
}

module.exports = function(app,model){
    app.post('/updateDocAtend',authenticationMiddleware (), (req,res) =>{
      var myData = (req.body)
      //var timestamp = new Date();
      //myData.Data = timestamp
      
      model.updateDataAtend(myData, function(err,result) {
          if(err) return console.log(err) 
          console.log('Atualizado Atendimentos no BD');
          res.render('CadastroAtend.ejs', { tipo: 'sucesso'})
      })
    })    

    app.post('/updateDocAplic',authenticationMiddleware (), (req,res) =>{
      var myData = (req.body)
      //var timestamp = new Date();
      //myData.Data = timestamp
      
      model.updateDataAplic(myData, function(err,result) {
          if(err) return console.log(err) 
          console.log('Atualizado no BD');
          res.render('CadastroAplic.ejs', { tipo: 'sucesso'})
      })
    })   
  }