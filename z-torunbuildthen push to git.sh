#!/bin/bash
npm run build
xcopy .\build ..\build /E /Y
cd ..\build
git add .
git commit -m "almaty"
git push https://dontstopbelievin:87776180087a@github.com/dontstopbelievin/uaigfrontbuild.git
PAUSE