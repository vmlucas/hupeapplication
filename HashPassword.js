const bcrypt = require("bcryptjs")

const password = "anders@n2020"
const saltRounds = 10

bcrypt.genSalt(saltRounds, function (err, salt) {
  if (err) {
    throw err
  } else {
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        throw err
      } else {
        console.log("Hash "+hash)
        //$2a$10$FEBywZh8u9M0Cec/0mWep.1kXrwKeiWDba6tdKvDfEBjyePJnDT7K
      }
    })
  }
})


/*
sharon 071184
vmlucas vsvLL430
adm 123
jacqueline jac2020
eduardo edu2020@
patrick patrick@2020
anderson anders@n2020
*/