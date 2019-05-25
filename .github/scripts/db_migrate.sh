#!/bin/sh

set -e
cd ./nestpoc_api
yarn db:migrate
