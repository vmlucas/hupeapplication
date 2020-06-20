//mostra todos os dados
var moment = require('moment');

module.exports = function(app,model){
    app.get('/', (req, res) => {
    model.getAllData((err, results) => {
         if (err) return console.log(err)
         res.render('index.ejs', { moment: moment, data: results })
 
        })
    })
}