#!/bin/sh

DIR="${PWD}"
cd "$(dirname "$0")/.."

npm install
node cmd/exportReport.js > "${DIR}"/export.csv
