const mongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://victor:vic1978@victormongodb-kvbw4.azure.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "Pacientes-SESRJ";
const collection = "Hupe_BKP";

exports.getAllData = (callBack) => {
    mongoClient.connect(uri,(err, client) => {
        if(err) return console.log(err)
        db = client.db(dbName);

        db.collection(collection).find().sort({Nome: 1}).toArray(callBack);
    })
}


exports.getData = (myData, callBack) => {
    mongoClient.connect(uri,(err, client) => {
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

exports.getAllEspera = (callBack) => {
    mongoClient.connect(uri,(err, client) => {
        if(err) return console.log(err)
        db = client.db(dbName);
        console.log("entrou lista espera not null");
        db.collection(collection).find({"Lista_Espera.Data" : {$ne : null}}).sort({Nome: 1}).toArray(callBack);
    })

}


//inserindo no mongo com a data de hoje
exports.insertData = (myData, callBack) => {
    var timestamp = new Date();
    myData.Data = timestamp;

    mongoClient.connect(uri,(err, client) => {
        if(err) return console.log(err)
        db = client.db(dbName);

        db.collection(collection).insertOne(myData, callBack);
    });    
}


