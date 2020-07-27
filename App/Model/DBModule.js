const MongoClient = require('mongodb').MongoClient;
//const uri = "mongodb+srv://victor:vic1978@victormongodb-kvbw4.azure.mongodb.net/test?retryWrites=true&w=majority";
const uri = "mongodb://victor:vic1978@victormongodb-shard-00-00-kvbw4.azure.mongodb.net:27017,victormongodb-shard-00-01-kvbw4.azure.mongodb.net:27017,victormongodb-shard-00-02-kvbw4.azure.mongodb.net:27017/Pacientes-SESRJ?ssl=true&replicaSet=VictorMongoDB-shard-0&authSource=admin&retryWrites=true&w=majority"
const client = new MongoClient(uri, {useUnifiedTopology: true});
const dbName = "Pacientes-SESRJ";
conn = null;

exports.connect = () => new Promise((resolve, reject) => {
    client.connect((err, client) => {
            if (err) { throw new Error("Erro Conexao MongoDB") };
            db = client.db(dbName);
            resolve(db);
            conn = db;
            console.log("Criou conexao");
        });
});

exports.getURI = () =>{
    return uri;
}

exports.get = () => {
    if(!conn) throw new Error("Crie uma Conexao MongoDB");
    return conn;
}

/*
class Connection {
    
    static connectToMongo() {
        if ( this.db ) return Promise.resolve(this.db)
        this.client.connect((err, client) => {
            if (err) { throw new Error("Erro Conexao MongoDB") };
            db = client.db("Pacientes-SESRJ");
            console.log("Criou conexao");
            db.collection("Users").find({ username: "admin"}, function(err, doc){
                console.log("dentro finduser erro "+err);
                console.log("dentro finduser doc "+doc);
            });
        });
        //return MongoClient.connect(this.url, this.options)
        //    .then(db => this.db = db)
    }
    

    // or in the new async world
    /*static async connectToMongo() {
        if (this.db) return this.db
        this.db = await MongoClient.connect(this.url, this.options)
        return this.db
    }
}

Connection.db = null
Connection.url = "mongodb://victor:vic1978@victormongodb-shard-00-00-kvbw4.azure.mongodb.net:27017,victormongodb-shard-00-01-kvbw4.azure.mongodb.net:27017,victormongodb-shard-00-02-kvbw4.azure.mongodb.net:27017/Pacientes-SESRJ?ssl=true&replicaSet=VictorMongoDB-shard-0&authSource=admin&retryWrites=true&w=majority"
Connection.client = new MongoClient(this.url, {useUnifiedTopology: true});
Connection.options = {
    bufferMaxEntries:   0,
    reconnectTries:     5000,
    useNewUrlParser:    true,
    useUnifiedTopology: true,
}

module.exports = { Connection }


/*exports.connect = () => new Promise((resolve, reject) => {
    client.connect((err, client) => {
            if (err) { throw new Error("Erro Conexao MongoDB") };
            db = client.db(dbName);
            connection = db;
            console.log("Criou conexao");
        });
});*/
/*
exports.getURI = () =>{
    return uri;
}

exports.get = () => {
    if(!connection) {
        client.connect((err, client) => {
            if (err) { throw new Error("Erro Conexao MongoDB") };
            db = client.db(dbName);
            connection = db;
            console.log("Criou conexao");
        });
    }

    return connection;
}*/

