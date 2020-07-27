
module.exports = function(app,model,passport){
    app.post('/login', (req, res) => {
        console.log("login");
        passport.authenticate('local',
                        (err, user, info) => {
                          
                        if (err) {
                          console.log(err);
                          return res.redirect("/login?fail="+err);
                        }
                        if (!user) {
                            return res.redirect("/login?fail='usuario invalido'");
                         }
                         req.logIn(user, function(err) {
                           if (err) {
                              return next(err);
                           } 
                         return res.redirect('/show');
                        });

  })(req, res);
   //     passport.authenticate('local', { successRedirect: '/show', failureRedirect: '/login?fail=true' })
   })
}