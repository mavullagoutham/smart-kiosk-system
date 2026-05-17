@echo off
echo Starting Backend...

cd Backend

javac -cp "lib/*" -d . src/controller/*.java src/db/*.java src/Service/*.java

java -cp ".;lib/*" controller.Server

pause