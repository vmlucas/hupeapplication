var moment = require('moment');

module.exports = function(app,model){
app.get('/showCols', (req, res) => {
    param = req.query.s;
    model.getCollectionsNotNull( param, function(err, results) {
         if (err) return console.log(err)
         res.render('index.ejs', { moment: moment, data: results })
 
     })   
 })
}