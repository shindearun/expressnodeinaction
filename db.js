const { MongoClient, ObjectID } = require('mongodb');

let db;
let mongoClientVar;
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'expressnodeinaction';



module.exports = () => {
  return MongoClient
    .connect(url,{ useNewUrlParser: true })
    .then((client) => {
        db = client.db(dbName);
        mongoClientVar= client;
        console.log("connected to db");
    })
    .catch((err) =>{console.log("not connected to db");
              throw err;
  }
    );
};

module.exports.getDb = function(){ return db; }
module.exports.getMongoClientVar = function(){ return mongoClientVar; }

function getNextSequence(name) {
  return new Promise((resolve,reject)=>{
   db.collection("counters").findOneAndUpdate(
            { "_id": name }, { $inc: { seq: 1 } },
            {"returnOriginal": false}
          ).then((ret)=>{
            resolve(Number.parseInt(ret.value.seq));
          }).catch((err)=>{
              reject(err);
          });
        });
}

module.exports.getNextSequence = getNextSequence;

module.exports.General = {
  all(collectionName,sortQueryOrder) {
    if(!sortQueryOrder){
      sortQueryOrder ="";
    }
    return db.collection(collectionName).find().sort({sortQueryOrder}).toArray();
  },

  find(collectionName,_id) {
    if (typeof _id !== 'object') _id = ObjectID(_id);
    return db.collection(collectionName).findOne({ _id });
  },

  findOne(collectionName,queryObj) {
      return db.collection(collectionName).findOne( queryObj ); 
  },

  create(collectionName,data) {
    return db.collection(collectionName).insertOne(data, { w: 1 });
  },

  delete(collectionName,_id) {
    if (typeof _id !== 'object') _id = ObjectID(_id);
    return db.collection(collectionName).deleteOne({ _id }, { w: 1 });
  },

  updateOne(collectionName,data,queryObj) {
    if (queryObj){
      let updatedDoc = { $set:  data };
      return db.collection(collectionName).updateOne(queryObj,updatedDoc, { w: 1 });
    }else{
      return new Promise((resolve, reject)=>{
          reject(new Error("Please provide QueryString to updateOne"));
      })
    }
  },
  findOneAndReplace(collectionName,data,queryObj) {
    if (queryObj){
      return db.collection(collectionName).findOneAndReplace(queryObj,data, { w: 1 });
    }else{
      return new Promise((resolve, reject)=>{
          reject(new Error("Please provide QueryString to updateOne"));
      })
    }
  },
  

  count(collectionName) {
    return db.collection(collectionName).count();
  },

  range(collectionName,from,to){
      //   db . people .find ( { age: { $gt: 25 , $lte: 50 } } )
    let skipnum = from;
    let limit = 0;
    if(to !== -1){
       limit = to - from; 
    }
    return db.collection(collectionName).find ().skip(from).limit(0);
  }

}
module.exports.Article = {
  all() {
    return db.collection('articles2').find().sort({ title: 1 }).toArray();
  },

  find(_id) {
    if (typeof _id !== 'object') _id = ObjectID(_id);
    return db.collection('articles2').findOne({ _id });
  },

  create(data) {
    return db.collection('articles2').insertOne(data, { w: 1 });
  },

  delete(_id) {
    if (typeof _id !== 'object') _id = ObjectID(_id);
    return db.collection('articles2').deleteOne({ _id }, { w: 1 });
  }
};
