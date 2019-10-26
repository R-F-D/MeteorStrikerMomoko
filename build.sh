#/bin/zsh

#Publish Dir
cp -r ./Res ./docs/Res

#Babel
#mkdir ../Babel/MeteorStriker
#mkdir ../Babel/MeteorStriker/res
#cp Frameworks ../Babel/MeteorStriker/
cp project.json ../Babel/MeteorStriker/
cp .cocos-project.json ../Babel/MeteorStriker/
cp index_release.html ../Babel/MeteorStriker/index.html
babel Main.js -d ../Babel/MeteorStriker/
babel Src -d ../Babel/MeteorStriker/Src

#Cocos Compile
cd ../Babel/MeteorStriker
cocos compile -p web -m release -o ../../MeteorStriker/docs/
rm ../../MeteorStriker/docs/build.xml
