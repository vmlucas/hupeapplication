const db = require('./DBModule');
const collection = "Hupe_BKP";


/*db.connect()
    .then(() => console.log('database connected'))          
    .catch((e) => {
        console.error(e);
        // Always hard exit on a database connection error
        process.exit(1);
});*/

//DB Queries
exports.getAllData = (callBack) => {
  db.get().collection(collection).find().limit(150).sort({Nome: 1}).toArray(callBack);
}

exports.getPaciente = (myData, callBack) => {
  
  if(myData.Nome){
    console.log("Entrou nome");
    db.get().collection(collection).find({Nome: myData.Nome }).toArray(callBack);
  }
  else{
    console.log("entrou cpf");
    db.get().collection(collection).find({CPF: myData.CPF }).toArray(callBack);
  }
}

exports.getData = (myData, callBack) => {
        if( myData.Nome != "")
           db.get().collection(collection).find({Nome:{ $regex : myData.Nome }}).sort({Nome: 1}).toArray(callBack);
        else if( myData.CPF != "")
           db.get().collection(collection).find({CPF:{ $regex : myData.CPF }}).sort({Nome: 1}).toArray(callBack);  
        else if( myData.Medicamento != "")
           db.get().collection(collection).find({Medicamento:{ $regex : myData.Medicamento }}).sort({Nome: 1}).toArray(callBack);    
        else db.get().collection(collection).find().sort({Nome: 1}).toArray(callBack);
}

exports.getCollectionsNotNull = (myData, callBack) => {
        console.log("entrou lista espera not null "+myData.metodo);
        if( myData.metodo == "espera"){
          db.get().collection(collection).find({"Lista_Espera.Data" : {$ne : null}}).sort({Nome: 1}).toArray(callBack);
        }
        else if( myData.metodo == "atend"){
          db.get().collection(collection).find({"Atendimento_Inicial.Data_Atendimento" : {$ne : null}}).sort({Nome: 1}).toArray(callBack);
        }
        else if( myData.metodo == "agend"){
          db.get().collection(collection).find({"Agendamento_Aplicacao.Data" : {$ne : null}}).sort({Nome: 1}).toArray(callBack);
        }
        else if(myData.metodo == "dtAplic"){
          var arrayOfStrings = myData.data.split("/");
          mes = arrayOfStrings[0];
          ano = arrayOfStrings[1];
          
          db.get().collection(collection).find({ 
            "Agendamento_Aplicacao": { $elemMatch: { $and:[ 
                                { Data: {"$gte": new Date(ano+"-"+mes+"-01T00:00:00")}}, 
                                { Data: {"$lte": new Date(ano+"-"+mes+"-31T00:00:00")}}]}}})
                  .sort({Data: 1}).toArray(callBack);
        }
        else{
          var arrayOfStrings = myData.data.split("/");
          mes = arrayOfStrings[0];
          ano = arrayOfStrings[1];

          db.get().collection(collection).find({ 
            "Atendimento_Inicial": { $elemMatch: { $and:[ 
                                { Data_Atendimento: {"$gte": new Date(ano+"-"+mes+"-01T00:00:00")}}, 
                                { Data_Atendimento: {"$lte": new Date(ano+"-"+mes+"-31T00:00:00")}}]}}})
                  .sort({Data_Atendimento: 1}).toArray(callBack);
        }
}


//inserindo novo paciente 
exports.insertDataAtend = (myData, callBack) => {
  console.log("Dados "+myData.Nome +" "+myData.medic+" "+myData.Data+" "+myData.indic);  
    
    var arrayOfStrings = myData.Data.split("/");
         dia = arrayOfStrings[0];
         mes = arrayOfStrings[1];
         ano = arrayOfStrings[2];     
      
         var obj = { "Medicamento": myData.medic, 
                     "Agendado" : myData.agendado,
                     "Indicacao": myData.indic,
                     "Data_Atendimento" : new Date(ano+"-"+mes+"-"+dia+"T00:00:00") };
    
    //insert novo paciente
    console.log("paciente não existente "+myData.Nome);
    db.get().collection(collection).insertOne(
                                   { Nome:myData.Nome,
                                     CPF: myData.CPF , 
                                     Medicamento: myData.medic,
                                     Processo_Judicial: myData.Processo_Judicial, 
                                     Origem: myData.origem,
                                     Atendimento_Inicial : [ obj  ]                                      
                                    }, callBack);   
    
     
}


//inserindo novo paciente com aplicação 
exports.insertDataAplic = (myData, callBack) => {
    console.log("Dados "+myData.Nome +" "+myData.medic+" "+myData.Data+" "+myData.indic);  
      
      var arrayOfStrings = myData.Data.split("/");
           dia = arrayOfStrings[0];
           mes = arrayOfStrings[1];
           ano = arrayOfStrings[2];     
        
           var obj = { "Medicamento": myData.medic, 
                       "Indicacao": myData.indic,
                       "Data" : new Date(ano+"-"+mes+"-"+dia+"T00:00:00") };
      
      //insert novo paciente
      console.log("paciente não existente "+myData.Nome);
      db.get().collection(collection).insertOne(
                                     { Nome:myData.Nome,
                                       CPF: myData.CPF , 
                                       Medicamento: myData.medic,
                                       Processo_Judicial: myData.Processo_Judicial, 
                                       Origem: myData.origem,
                                       Atendimento_Inicial : [ 
                                            {
                                               "Medicamento" : myData.medic,
                                               "Agendado" : myData.Data,
                                               "Data_Atendimento" : new Date(ano+"-"+mes+"-"+dia+"T00:00:00"),
                                               "Indicacao" : myData.indic
                                            }
                                                             ],
                                       Agendamento_Aplicacao : [ obj ] 
                                      }, callBack);   
      
       
}

//atualizando paciente 
exports.updateDataAtend = (myData, callBack) => {
  console.log("Dados "+myData.Nome +" "+myData.medic+" "+myData.Data+" "+myData.indic);  
    
    var arrayOfStrings = myData.Data.split("/");
         dia = arrayOfStrings[0];
         mes = arrayOfStrings[1];
         ano = arrayOfStrings[2];     
      
         var obj = { "Medicamento": myData.medic, 
                     "Agendado" : myData.agendado,
                     "Indicacao": myData.indic,
                     "Data_Atendimento" : new Date(ano+"-"+mes+"-"+dia+"T00:00:00") };
    
    var found = db.get().collection(collection).find({Nome: myData.Nome });
    found.each(function(err, doc) {
       if( doc)
       {
         if( doc.Atendimento_Inicial )
         {
            console.log("atendimento existente "+doc.Nome);
            doc.Atendimento_Inicial.push(obj);
            db.get().collection(collection).update({ _id : doc._id }, doc,callBack);
         }
         else{
          console.log("atendimento não existente "+doc.Nome);
          db.get().collection(collection).update({ _id : doc._id},
                      { $set:{
                              "Atendimento_Inicial" : [ obj ]
                              }},callBack);
                   //doc.Agendamento_Aplicacao.push(obj);
         }
       }

   });
  }

//atualizando paciente 
exports.updateDataAplic = (myData, callBack) => {
  console.log("Dados "+myData.Nome +" "+myData.medic+" "+myData.Data+" "+myData.indic);  
    
    var arrayOfStrings = myData.Data.split("/");
         dia = arrayOfStrings[0];
         mes = arrayOfStrings[1];
         ano = arrayOfStrings[2];     
      
         var obj = { "Medicamento": myData.medic, 
                     "Indicacao": myData.indic,
                     "Data" : new Date(ano+"-"+mes+"-"+dia+"T00:00:00") };
    
    var found = db.get().collection(collection).find({Nome: myData.Nome });
    found.each(function(err, doc) {
       if( doc)
       {
         if( doc.Agendamento_Aplicacao )
         {
            console.log("agenda existente "+doc.Nome);
            doc.Agendamento_Aplicacao.push(obj);
            db.get().collection(collection).update({ _id : doc._id }, doc,callBack);
         }
         else{
          console.log("agenda não existente "+doc.Nome);
          db.get().collection(collection).update({ _id : doc._id},
                      { $set:{
                              "Agendamento_Aplicacao" : [ obj ]
                              }},callBack);
                   //doc.Agendamento_Aplicacao.push(obj);
         }
       }

    });
      
}