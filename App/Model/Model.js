const MongoClient = require('mongodb').MongoClient;
//const uri = "mongodb+srv://victor:vic1978@victormongodb-kvbw4.azure.mongodb.net/test?retryWrites=true&w=majority";
const uri = "mongodb://victor:vic1978@victormongodb-shard-00-00-kvbw4.azure.mongodb.net:27017,victormongodb-shard-00-01-kvbw4.azure.mongodb.net:27017,victormongodb-shard-00-02-kvbw4.azure.mongodb.net:27017/Pacientes-SESRJ?ssl=true&replicaSet=VictorMongoDB-shard-0&authSource=admin&retryWrites=true&w=majority"
const client = new MongoClient(uri, {useUnifiedTopology: true});
const dbName = "Pacientes-SESRJ";
const collection = "Hupe_BKP";

exports.getAllData = (callBack) => {
    client.connect((err, client) => {
        if(err) return console.log(err)
        db = client.db(dbName);

        db.collection(collection).find().sort({Nome: 1}).toArray(callBack);
    })
}


exports.getData = (myData, callBack) => {
    client.connect((err, client) => {
        if(err) return console.log(err)
        db = client.db(dbName);
        
        //console.log("nome "+myData.Nome);
        //console.log("CPF "+myData.CPF);
        if( myData.Nome != "")
           db.collection(collection).find({Nome:{ $regex : myData.Nome }}).sort({Nome: 1}).toArray(callBack);
        else if( myData.CPF != "")
           db.collection(collection).find({CPF:{ $regex : myData.CPF }}).toArray(callBack);  
        else if( myData.Medicamento != "")
           db.collection(collection).find({Medicamento:{ $regex : myData.Medicamento }}).sort({Nome: 1}).toArray(callBack);    
        else db.collection(collection).find().sort({Nome: 1}).toArray(callBack);
    })

}

exports.getCollectionsNotNull = (param, callBack) => {
    client.connect((err, client) => {
        if(err) return console.log(err)
        db = client.db(dbName);
        console.log("entrou lista espera not null "+param);
        if( param == "espera")
          db.collection(collection).find({"Lista_Espera.Data" : {$ne : null}}).sort({Nome: 1}).toArray(callBack);
        else if( param == "atend")
          db.collection(collection).find({"Atendimento_Inicial.Data_Atendimento" : {$ne : null}}).sort({Nome: 1}).toArray(callBack);
        else 
          db.collection(collection).find({"Agendamento_Aplicacao.Data" : {$ne : null}}).sort({Nome: 1}).toArray(callBack);
    
    
    })

}


//inserindo no mongo com a data de hoje
exports.insertData = (myData, callBack) => {
    var timestamp = new Date();
    myData.Data = timestamp;

    client.connect((err, client) => {
        if(err) return console.log(err)
        db = client.db(dbName);

        db.collection(collection).insertOne(myData, callBack);
    });    
}


