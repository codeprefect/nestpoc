#!/bin/sh

set -e
npm install yarn -g
cd nestpoc_api
yarn install
yarn db:migrate
