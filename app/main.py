import flask
from flask import Flask, render_template, request, url_for, flash, redirect, session
from flask_login import current_user, UserMixin, LoginManager, login_required, login_user,logout_user
import pandas as pd
from pandas import DataFrame 
from app.model import insertDataAtend, insertDataAplic, getAllData, getPaciente, getCollectionsNotNull, getData, uploadGCStorage, listFiles
import os
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
db = SQLAlchemy(app)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] =\
        'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
#login_manager.login_view = 'login'
app.config['SECRET_KEY'] = 'thisissecret'

#login management
class User(UserMixin,db.Model):
        __tablename__ = 'user'
        user_id = db.Column(db.VARCHAR,primary_key = True)
        first_name = db.Column(db.VARCHAR)
        last_name = db.Column(db.VARCHAR)
        email = db.Column(db.VARCHAR)
        contact_no = db.Column(db.VARCHAR)
        status = db.Column(db.BOOLEAN)
        loginpassword = db.Column(db.VARCHAR)
        _authenticated = bool
        
        def get_id(self):
            return str(self.user_id)

        @property
        def is_authenticated(self):
           return self._authenticated

        @is_authenticated.setter
        def is_authenticated(self, value):
          if value:
              self._authenticated = True
          else:
              self._authenticated = False    



@login_manager.user_loader
def load_user(id):
    try:
        return User.query.get(id)
    except:
        return None


@app.route('/login',methods=('GET', 'POST'))
def login():
    session.pop('id', None)
    em = request.form['email']
    pwd = request.form['password']
    usr = User.query.filter_by(email = em).first()
    if usr:
        print('login',usr)
        if usr and usr.loginpassword == pwd:
            login_user(usr,remember = False)
            session['id'] = usr.user_id
            usr.is_authenticated = True
            print('login set session',session['id'])
            return redirect(url_for('index'))
        else:
            return render_template('login.html',message='Usuário nao encontrado')
    else:
        #return render_template('testlogin.html')
        return render_template('login.html',message='Usuário nao encontrado')



@app.route('/',methods=('GET', 'POST'))
def home():
    print('aqui')
    return render_template('login.html')
    

@app.route('/logout',methods=('GET', 'POST'))
@login_required
def logout():
        logout_user()
        session.pop('id', None)
        return 'you are logged out'


@app.route("/home",methods=('GET', 'POST'))
@login_required
def index():
    result = getAllData()    
    return render_template('index.html',data=result)


@app.route("/buscarLaudos",methods=('GET', 'POST'))
@login_required
def buscarLaudos():
        files = listFiles()
        json = {"message": "Load was successful",
                "fileNames": files} 
        return json, 200
        

@app.route("/uploads",methods=('GET', 'POST'))
@login_required
def uploads():           
      myFile = request.files['file']
      uploadGCStorage(myFile)

      files = listFiles()
      json = {"message": "Upload was successful",
                "fileNames": files} 
      return json, 200
     
      
       
@app.route('/show', methods=('GET', 'POST'))
@login_required
def getAll():
    result = getAllData()    
    return render_template('index.html',data=result)

 
#showFiltro por nome ou cpf
@app.route('/showFiltro', methods=('GET', 'POST'))
@login_required
def getFilteredData():
    Nome = request.form['Nome']
    CPF = request.form['CPF']
    Medicamento = request.form['Medicamento']
         
    data = [[Nome,CPF,Medicamento]] 
    df = pd.DataFrame(data,columns=['Nome','CPF','Medicamento'])
    
    result = getData(df)
    return render_template('index.html',data=result)
 


@app.route('/cadAtend', methods=('GET', 'POST'))
@login_required
def cadAtend():
    return render_template('CadastroAtend.html', tipo= 'inicio',textoForm = 'Digite o nome do Paciente ou CPF para verificação',titulo = '')


@app.route('/cadAplic', methods=('GET', 'POST'))
@login_required
def cadAplic():
      return render_template('CadastroAplic.html', tipo= 'inicio',textoForm = 'Digite o nome do Paciente ou CPF para verificação',titulo = '')


@app.route('/buscarAtend', methods=('GET', 'POST'))
@login_required
def buscarAtend():
    print('busca antend')
    nome = request.form['nomeBusca']
    cpf = request.form['CPF']
    results = getPaciente(nome,cpf)
    tmp = results.clone()
    for r in tmp:
        page = 'Atualização'
        nomeR = r['Nome']
        cpfR = r['CPF']

    if (page == 'Atualização'):
       return render_template('CadastroAtend.html', tipo='dados',titulo = page, textoForm = 'Dados Paciente', nome=nomeR, cpf = cpfR, botao = 'update', data=results)
     


@app.route('/buscarAplic', methods=('GET', 'POST'))
@login_required
def buscarAplic():
    nome = request.form['nomeBusca']
    cpf = request.form['CPF']
    results = getPaciente(nome,cpf)
    tmp = results.clone()
    for r in tmp:
        page = 'Atualização'
        nomeR = r['Nome']
        cpfR = r['CPF']
    
    if (page == 'Atualização'):
       return render_template('CadastroAplic.html', tipo='dados', titulo = page, textoForm = 'Dados Paciente', nome=nomeR, cpf = cpfR, botao = 'update', data=results)


@app.route('/insertDocAtend', methods=('GET', 'POST'))
@login_required
def insertDocAtend():    
    if request.method == 'POST':
        Nome = request.form['Nome']
        medic = request.form['medic']
        Data = request.form['Data']
        indic = request.form['indic']        
         
        if not Nome:
            flash('Nome tem de ser digitado!')
        else:
            data = [[Nome,medic,Data,indic]] 
            df = pd.DataFrame(data,columns=['Nome','medic','Data','indic'])
            insertDataAtend(df)
            return render_template('CadastroAtend.html', tipo= 'sucesso',textoForm = 'Dados Atualizados!!! Digite o nome do Paciente ou CPF para verificação',titulo = '')
            
    return redirect(url_for('index')) 

