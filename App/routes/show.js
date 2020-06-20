var moment = require('moment');

module.exports = function(app,model){
    //mostra todos os dados
    app.get('/show', (req, res) => {
      model.getAllData((err, results) => {
         if (err) return console.log(err)
         res.render('index.ejs', { moment: moment, data: results })
 
      })
    })
}