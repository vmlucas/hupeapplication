from typing import Collection
import pymongo
from pymongo import MongoClient
import pandas as pd
from pandas import DataFrame 
from bson.objectid import ObjectId
from datetime import datetime
import app.azureStorageModel as storage  
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

default_credential = DefaultAzureCredential()
client = SecretClient(vault_url="https://formula1vmlucaskeys.vault.azure.net/", credential=default_credential)


retrieved_secret = (client.get_secret("mongo-server")).value
db_user = (client.get_secret("mongo-login")).value
db_pass = (client.get_secret("mongo-pass")).value
db_server = (client.get_secret("mongo-server")).value

#returns the Collection from the Home DB MongoDB Atlas
def getCollection():
    uri = "mongodb+srv://"+db_user+":"+db_pass+"@"+db_server+"/?retryWrites=true&w=majority"
    client = MongoClient(uri)
    db = client.get_database("Pacientes-SESRJ")
    
    return db.get_collection("HUPE") #Collection



#@param { File } object file object that will be uploaded
#@description - This function does the following
# - It uploads a file to the image bucket on Google Cloud
# - It accepts an object as an argument with the
#   "originalname" and "buffer" as keys
def uploadStorage(file):
   storage.uploadGCStorage(file)        


def listFiles():
   return storage.listFiles()




#DB Queries
def getAllData( ):
  print("Getting the Series Collection")
  collection = getCollection()
  print('buscanco tudo...')
  data = collection.find().limit(150).sort("Nome",pymongo.ASCENDING)
  return data 
  

def getPaciente(nome, cpf):   
  if(nome):
    print("Entrou nome")
    data = getCollection().find({"Nome": nome })
    return data
  else:
    print("entrou cpf")
    data = getCollection().find({"CPF": cpf })
    return data


def getData(df):
   print("Getting the Series Collection")
   collection = getCollection()   
   if df['Nome'][0] != "":
      print('buscanco por nome...')
      data = collection.find({"Nome":{ "$regex" : df['Nome'][0] }}).sort([("Nome", pymongo.DESCENDING)]) 
      return data
   elif df['CPF'][0] != "":
      print('buscanco por CPF...')
      data = collection.find({"CPF":{ "$regex" : df['CPF'][0] }}).sort([("Nome", pymongo.DESCENDING)]) 
      return data
   elif df['Medicamento'][0] != "":
      print('buscanco por Medicamento...')
      data = collection.find({"Medicamento":{ "$regex" : df['Medicamento'][0] }}).sort([("Nome", pymongo.DESCENDING)]) 
      return data      
   else:
      data = collection.find().sort([("Nome", pymongo.DESCENDING)]) 
      return data 


def getCollectionsNotNull(metodo, date):
   print("entrou lista espera not null "+metodo)
   collection = getCollection()

   if( metodo == "espera"):
      data = collection.find({"Lista_Espera.Data" : {"$ne" : None}}).sort([("Nome", pymongo.DESCENDING)]) 
      return data
   elif( metodo == "atend"):
      data = collection.find({"Atendimento_Inicial.Data_Atendimento" : {"$ne" : None}}).sort([("Nome", pymongo.DESCENDING)]) 
      return data
   elif( metodo == "agend"):
      data = collection.find({"Agendamento_Aplicacao.Data" : {"$ne" : None}}).sort([("Nome", pymongo.DESCENDING)]) 
      return data
   elif(metodo == "dtAplic"):
      print(date)
      arrayOfStrings = date.split("/")
      mes = arrayOfStrings[0]
      ano = arrayOfStrings[1]

      data = collection.find({ "Agendamento_Aplicacao": { "$elemMatch": \
                                    { "$and":[ { "Data": {"$gte": datetime.strptime(ano+"-"+mes+"-01",'%Y-%m-%d')}},\
                                               { "Data": {"$lte": datetime.strptime(ano+"-"+mes+"-31",'%Y-%m-%d')}}]}}})\
                               .sort([("Data", pymongo.DESCENDING)])
      return data  
   else:
      print(date)
      arrayOfStrings = date.split("/")
      mes = arrayOfStrings[0]
      ano = arrayOfStrings[1]
      
      data = collection.find({ "Atendimento_Inicial": { "$elemMatch": \
                                    { "$and":[ { "Data_Atendimento": {"$gte": datetime.strptime(ano+"-"+mes+"-01",'%Y-%m-%d')}},\
                                               { "Data_Atendimento": {"$lte": datetime.strptime(ano+"-"+mes+"-31",'%Y-%m-%d')}}]}}})\
                               .sort([("Data_Atendimento", pymongo.DESCENDING)])
      return data

#parei aqui na construcao da API
#inserindo novo paciente 
def insertDataAtend(df):
   print("Dados ",df['Nome'][0]," ",df['medic'][0]," ",df['Data'][0]," ",df['indic'][0])  
   collection = getCollection()

   arrayOfStrings = df['Data'][0].split("/")
   dia = arrayOfStrings[0]
   mes = arrayOfStrings[1]
   ano = arrayOfStrings[2]     
   laudo = ""

   if(df['nomeLaudo'][0] != ""):
      laudo = "https://storage.googleapis.com/hupeapp/"+df['nomeLaudo'][0]
      
        
   query = { "CPF": df['CPF'][0] }
   update = { "$setOnInsert": {   
                          "Nome":df['Nome'][0],
                          "CPF": df['CPF'][0], 
                          "Processo_Judicial": df['Processo_Judicial'][0], 
                          "Medicamento": df['medic'][0],
                          "Origem": df['origem'][0],                          
                      },
                      "$addToSet" : 
                          { "Atendimento_Inicial": 
                                {
                                   "Medicamento" : df['medic'][0],
                                   "Agendado" : df['agendado'][0],
                                   "Indicacao" : df['indic'][0],
                                   "Data_Atendimento" : datetime.strptime(ano+"-"+mes+"-"+dia,'%Y-%m-%d'),
                                   "OBS" : df['obs'][0],
                                   "Laudo" : laudo
                                } 
                         }
                     }
   collection.update_one(query, update, upsert=True) 


def insertDataAplic(df):
   print("Dados ",df['Nome'][0]," ",df['medic'][0]," ",df['Data'][0]," ",df['indic'][0])  
   collection = getCollection()

   arrayOfStrings = df['Data'][0].split("/")
   dia = arrayOfStrings[0]
   mes = arrayOfStrings[1]
   ano = arrayOfStrings[2]     
   query = { "CPF": df['CPF'][0] }

   update = { "$setOnInsert": {   
                          "Nome":df['Nome'][0],
                          "CPF":df['CPF'][0], 
                          "Processo_Judicial": df['Processo_Judicial'][0], 
                          "Medicamento": df['medic'][0],
                          "Origem" : df['origem'][0],
                          "Atendimento_Inicial": [
                                {
                                               "Medicamento" : df['medic'][0],
                                               "Agendado" : df['Data'][0],
                                               "Indicacao" : df['indic'][0],
                                               "Data_Atendimento" : datetime.strptime(ano+"-"+mes+"-"+dia,'%Y-%m-%d'),
                                               "OBS" : " ",
                                               "Laudo" : " "
                                } ]
                      },
                      "$addToSet" : 
                          { 
                            "Agendamento_Aplicacao": 
                                {
                                               "Medicamento" : df['medic'][0],
                                               "Indicacao" : df['indic'][0],
                                               "Data" : datetime.strptime(ano+"-"+mes+"-"+dia,'%Y-%m-%d'),
                                               "OBS" : " "                                              
                                } 
                         }
                     }
        
   collection.update_one(query, update, upsert=True)

