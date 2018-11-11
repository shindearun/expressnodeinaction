const db = require('../db');
const fs = require('fs');

class Entry {
    constructor(obj) {
      for (let key in obj) {
        this[key] = obj[key];
      }
    }

    static getFromFile() { 
      return new Promise((resolve, reject) => {
        try{
          const entries = [];
          let entriesRaw = fs.readFileSync('entries.txt', 'utf8');
          entriesRaw = entriesRaw.split('---');
          entriesRaw.map((entryRaw) => {
            const entry = {};
            const lines = entryRaw.split('\n');
            lines.map((line) => {
              if (line.indexOf('title: ') === 0) {
                entry.title = line.replace('title: ', '');
              } else if (line.indexOf('date: ') === 0) {
                entry.date = line.replace('date: ', '');
              } else {
                entry.body = entry.body || '';
                entry.body += line;
              }
            });
            entries.push(entry);
        });
         resolve(entries);
        }catch(err){
          reject(err);
        };
      });
    }
  
    static getRange(from, to,userName) { 
      let queryObj = {};
      if(userName){
        queryObj = {
          username: userName
        }
      }
      
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
        db.General.range('entries',from,to,queryObj).toArray().then((items)=>{
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
        cb(null,number);
      }).catch((err) =>{
        return cb(err)
      });
     // db.llen('entries', cb);
    }

    static countByQuery(cb,queryObj) {
      db.General.countByQuery('entries',queryObj).then((number)=>{
        cb(null,number);
      }).catch((err) =>{
        return cb(err)
      });
     // db.llen('entries', cb);
    }
  }
  
  module.exports = Entry;
