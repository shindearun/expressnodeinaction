"#expressnodeinaction1" 
Steps taken to set up the project
mkdir C:\projects\expressproject
cd projects\expressproject,
echo "# expressnodeinaction" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/shindearun/expressnodeinaction.git
git push -u origin master

now the readme is on github remote repository.

npm install --save express
npm install express-generator -g // The express-generator package installs the 'express' command-line tool.
npm install ejs -- save // it is a template enjine.(embedded javascript) to render outputs to user.
cd ..
express --view=ejs expressproject // this will create the skeleton with view engine as ejs.
cd expressproject
create .gitignore file // add node_modules name there.
npm install --save-dev eslint
npm install // to install all dependencies.
SET DEBUG=expressproject:* & npm start // this will start the http server.

npm install mongodb --save
modified the bin/www file for initializing mongodb connection.

npm install --save bcrypt //this is used for hashing passwords, so that it is saved in encryted format in db.

npm install res-error --save  // this is so that res.error works. as error is not express functon.
//var resError = require('res-error'); app.use(resError); res.error(404,`${field.join(' ')} is required`);
the above was used in validate.js
OR 
in the application we have added our own res.error method in messages.js and used in validate.js


//For the userId sequence
db.counters.insert({_id: "userid",seq: 0})

https://www.youtube.com/watch?v=2oFKNL7vYV8   how to debug in VS. look at the end 2 minute
https://www.youtube.com/playlist?list=PL13Vva6TJcSsAFUsZwYpJOfR-ENWypLAe


>npm install --save express-session  // for saving messages in session //after 1.5.0 cookie praser is not needed.
>npm install connect-mongo --save   //for saving session data as memeory store leaks memory in prod env.

> npm install --save basic-auth // for rest api authentication.

>npm i --save lodash  //to check for null and parsing integers

>npm install --save-dev nodemon
then in package.json change "node" with nodemon in start command

-------------Node knowledge
res.send() // will convert Javascript objects to json by default.
u can use npm run "anycommand " from script section of package.json. (start,stop,restart,install,postinstall are some predefine commands.)