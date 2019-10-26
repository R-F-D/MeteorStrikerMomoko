#/bin/zsh

#Publish Dir
cp -av Res ./docs
rm ./doc/Src/game.min.js
rm ./doc/Src/project.json

#Babel
#mkdir ../Babel/MeteorStriker
#mkdir ../Babel/MeteorStriker/res
#cp Frameworks ../Babel/MeteorStriker/
cp -va project.prod.json ../Babel/MeteorStriker/project.json
cp -va .cocos-project.json ../Babel/MeteorStriker/
cp -va index_release.html ../Babel/MeteorStriker/index.html
babel Main.js -d ../Babel/MeteorStriker/
babel Src -d ../Babel/MeteorStriker/Src

#Cocos Compile
cd ../Babel/MeteorStriker
cocos compile -p web -m release -o ../../MeteorStriker/docs/
cd ../../MeteorStriker/docs/
rm ./build.xml
mv ./game.min.js ./Src/
mv ./project.json ./Src/
cd ../

