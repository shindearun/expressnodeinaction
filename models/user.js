const db = require('../db');
const bcrypt = require('bcrypt');

class User {
    
  constructor(obj) {
    for (let key in obj) {
      this[key] = obj[key];
    }
    if(this['userId']){        
    }else{
        this['userId'] = 0;
    }
  }

  toJSON() {
    return {
      userId: this.userId,
      name: this.name
    };
  }

  save(cb) {
    if (this.userId !== 0) {
      this.update(cb);
    } else {
        db.getNextSequence("userid").then((userid)=>{
            this.userId = userid;
            this.hashPassword((err) => {
                if (err) return cb(err);
                this.insert(cb);
              });
        }).catch((err)=>{
            cb(err);
        });
    }
  }
  insert(cb) {
    let entryJSON = JSON.stringify(this);
    let datatoInsert = JSON.parse(entryJSON);
    db.General.create('users',datatoInsert).then((result) => {
          cb();
    }).catch((err) =>{
      return cb(err)
    });
  }

  update(cb) {
    let entryJSON = JSON.stringify(this);
    let datatoInsert = JSON.parse(entryJSON);
    db.General.updateOne('users',datatoInsert,'userId :'+this.userId).then((result) => {
          cb();
        }).catch((err) =>{
          return cb(err)
        });
  }

  hashPassword(cb) {
    bcrypt.genSalt(12, (err, salt) => {
      if (err){
        console.log('in Gen Salt ',err);
        return cb(err);
      } 
      console.log('Salt is ',salt);
      this.salt = salt;
      bcrypt.hash(this.pass, salt, (err, hash) => {
        if (err) return cb(err);
        this.pass = hash;
        cb();
      });
    });
  }
}


module.exports = User;
