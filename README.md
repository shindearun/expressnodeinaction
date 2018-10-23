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

cd ..
express --view=ejs expressproject
cd expressproject
create .gitignore file // add node_modules name there.
npm install --save-dev eslint
npm install
SET DEBUG=expressproject:* & npm start // this willstart the http server.

npm install mongodb --save
modified the bin/www file for initializing mongodb connection.

npm install res-error --save  // this is so that res.error works. as error is not express functon.
//var resError = require('res-error'); app.use(resError); res.error(404,`${field.join(' ')} is required`);
the above was used in validate.js
OR 
in th application we have added our own res.error method in messages.js and usedin validate.js


//For the userId sequence
db.counters.insert({_id: "userid",seq: 0})

https://www.youtube.com/watch?v=2oFKNL7vYV8   how to debug in VS. look at the end 2 minute
https://www.youtube.com/playlist?list=PL13Vva6TJcSsAFUsZwYpJOfR-ENWypLAe


>npm install --save express-session  // for saving messages in session