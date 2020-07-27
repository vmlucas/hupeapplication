function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect("/login?fail='Refaça o Login'")
  }
}

module.exports = function(app,model,passport){
  
  app.post('/insertDocAtend',authenticationMiddleware (), (req,res) =>{
    var myData = (req.body)
    //var timestamp = new Date();
    //myData.Data = timestamp    
    
    model.insertDataAtend(myData, function(err,result) {
        if(err) return console.log(err) 
        console.log('Salvo atendimento no BD');
        res.render('CadastroAtend.ejs', { tipo: 'sucesso'})
    })
  })   
  
  app.post('/insertDocAplic',authenticationMiddleware (), (req,res) =>{
    var myData = (req.body)
    //var timestamp = new Date();
    //myData.Data = timestamp
    
    model.insertDataAplic(myData, function(err,result) {
        if(err) return console.log(err) 
        console.log('Salvo aplicação no BD');
        res.render('CadastroAplic.ejs', { tipo: 'sucesso'})
    })
  })    
}