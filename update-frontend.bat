@echo off
echo Updating sun-movement-frontend folder...
git fetch origin
git checkout origin/master -- sun-movement-frontend/
echo Frontend folder has been updated.
