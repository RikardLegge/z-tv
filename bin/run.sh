#!/bin/sh

cd "$(dirname "$0")/.."

npm install
node_modules/.bin/electron-rebuild
node_modules/.bin/electron main.js
