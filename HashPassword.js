const bcrypt = require("bcryptjs")

const password = "123"
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