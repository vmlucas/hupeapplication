
var moment = require('moment');

module.exports = function(app,model){
//showFiltro por nome ou cpf
app.post('/showFiltro', (req, res) => {
    var myData = req.body;
    model.getData(myData, function(err, results) {
         if (err) return console.log(err)
         res.render('index.ejs', { moment: moment, data: results })
 
     })   
 })
}