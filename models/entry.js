const db = require('../db');

class Entry {
    constructor(obj) {
      for (let key in obj) {
        this[key] = obj[key];
      }
    }
  
    static getRange(from, to) {   
    /*  db.General.range('entries',from,to).toArray().then((items)=>{
        let entries = [];
        items.forEach((item) => {
          entries.push(item);
        });
        cb(null, entries);
      }).catch((err) =>{
        return cb(err)
      });*/
      return new Promise((resolve, reject) => {
        db.General.range('entries',from,to).toArray().then((items)=>{
          let entries = [];
          items.forEach((item) => {
            entries.push(item);
          });
         resolve(entries);
        }).catch((err) =>{
          reject(err);
        });
      });
    }
  
    save(cb) {
      let entryJSON = JSON.stringify(this);
      let datatoInsert = JSON.parse(entryJSON);
      db.General.create('entries',datatoInsert).then((result) => {
          cb();
        }).catch((err) =>{
          return cb(err)
        });
    }
  
    static count(cb) {
      db.General.count('entries').then((number)=>{
        cb(num);
      }).catch((err) =>{
        return cb(err)
      });
     // db.llen('entries', cb);
    }
  }
  
  module.exports = Entry;