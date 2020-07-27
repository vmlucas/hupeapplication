//mostra todos os dados
var moment = require('moment');

module.exports = function(app,model,passport){
    app.get('/', (req, res) => {
    res.render('login.ejs', { message: null })
    })
}