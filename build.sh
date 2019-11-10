#/bin/zsh

#Publish Dir
cp -av Res ./docs
rm ./docs/Src/game.min.js
rm ./docs/Src/project.json

#Babel
#mkdir ../Babel/MeteorStriker
#mkdir ../Babel/MeteorStriker/res
#cp Frameworks ../Babel/MeteorStriker/
cp -va index.html ../Babel/MeteorStriker/index.html
cp -va project.json ../Babel/MeteorStriker/
cp -va .cocos-project.json ../Babel/MeteorStriker/
babel Main.js -d ../Babel/MeteorStriker/
babel Src -d ../Babel/MeteorStriker/Src

#Cocos Compile
cd ../Babel/MeteorStriker
cocos compile -p web -m release -o ../../MeteorStriker/docs/
cd ../../MeteorStriker/docs/
mv ./game.min.js ./Src/
cp -va ../project.prod.json ./Src/project.json
rm ./build.xml
rm ./project.json
rm ./index.html
cd ../

