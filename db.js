const { MongoClient, ObjectID } = require('mongodb');

let db;
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myprojectq';



module.exports = () => {
  return MongoClient
    .connect(url,{ useNewUrlParser: true })
    .then((client) => {
        db = client.db(dbName);
        console.log("connected to db");
    });
};

module.exports.getDb = function(){ return db; }

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
