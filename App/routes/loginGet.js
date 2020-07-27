module.exports = function(app,model,passport){
    app.get('/login', (req, res) => {
        msg = req.query.fail;
        if(msg)
        res.render('login', { message: msg });
      else
        res.render('login', { message: null });
    })
}