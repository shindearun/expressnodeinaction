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