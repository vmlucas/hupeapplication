#execute on flask shell (write flask shell on terminal)
from app.main import db, User

#create the user table
db.create_all()  
#create new user
user = User(user_id='vmlucas@gmail.com',first_name='Victor', last_name='Lucas',
              email = 'vmlucas@gmail.com',contact_no = '21-994486864', 
              status = True, loginpassword = 'vsvLL430')

db.session.add(user)
db.session.commit()

#senhas
''''
  vmlucas@gmail.com vsvLL430
'''
  