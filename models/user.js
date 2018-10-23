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

  /*toJSON() {
    return {
      userId: this.userId,
      name: this.name
    };
  }*/

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
    db.General.create('users',this).then((result) => {
          cb();
    }).catch((err) =>{
      return cb(err)
    });
  }

  findOneAndReplace(cb) {
    //let entryJSON = JSON.stringify(this);
    //let datatoInsert = JSON.parse(entryJSON);
    let queryObj = {"userId" : this.userId };
    db.General.findOneAndReplace('users',this,queryObj).then(() => {
          cb();
        }).catch((err) =>{
          return cb(err)
        });
  }

  updateOne(cb) {
    let queryObj = {"userId" : this.userId };
    db.General.updateOne('users',this,queryObj).then(() => {  
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

  static getByName(name, cb) {
    let queryObj = {"name" : name };
    db.General.findOne('users', queryObj).then((user)=>{
      //if no user is found null is return as value in user.
      cb(null, new User(user));
    }).catch((err) =>{
      return cb(err)
    });
  }

  static authenticate(name, pass, cb) {
    User.getByName(name, (err, user) => {
      if (err) {
        return cb(err);
      }
      if (!user || !user.id) {
        return cb();
      }
      bcrypt.hash(pass, user.salt, (err, hash) => {
        if (err){
          return cb(err);
        } 
        if (hash == user.pass){
          return cb(null, user);
        } 
        cb(); // password did not match
      });
    });
  }
   

  
}//end User class


module.exports = User;
