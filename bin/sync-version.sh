#!/bin/bash
set -e
cd ..
VERSION=$(cat ./VERSION)
echo "Syncing version to $VERSION in all submodules..."
#sync version with /log_output
jq --arg ver "$VERSION" '.version = $ver' ./log_output/package.json > tmp.$$.json && mv tmp.$$.json ./log_output/package.json
jq --arg ver "$VERSION" '.version = $ver' ./log_output/package-lock.json > tmp.$$.json && mv tmp.$$.json ./log_output/package-lock.json

#sync version with /the_project/todo-app
jq --arg ver "$VERSION" '.version = $ver' ./the_project/todo-app/package.json > tmp.$$.json && mv tmp.$$.json ./the_project/todo-app/package.json
jq --arg ver "$VERSION" '.version = $ver' ./the_project/todo-app/package-lock.json > tmp.$$.json && mv tmp.$$.json ./the_project/todo-app/package-lock.json

#sync version with /the_project/todo-frontend
jq --arg ver "$VERSION" '.version = $ver' ./the_project/todo-frontend/package.json > tmp.$$.json && mv tmp.$$.json ./the_project/todo-frontend/package.json
jq --arg ver "$VERSION" '.version = $ver' ./the_project/todo-frontend/package-lock.json > tmp.$$.json && mv tmp.$$.json ./the_project/todo-frontend/package-lock.json

git add ./log_output/package.json
git add ./the_project/todo-app/package.json 
git commit -m "chore: sync version to $VERSION in package.json"
git tag "v$VERSION"
echo "Synced version $VERSION across all submodules."
