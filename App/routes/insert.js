
module.exports = function(app,model){
  app.post('/insertDoc',(req,res) =>{
    var myData = (req.body)
    var timestamp = new Date();
    myData.Data = timestamp
    
    model.insertData(myData, function(err,result) {
        if(err) return console.log(err) 
        console.log('Salvo no BD');
        res.redirect('/show')
    })
  })    
}