#! /bin/bash

# Uses these if set, otherwise prompts
#  $mdbUser
#  $mdbPassword
#  $mdbURI

if [ -z "$mdbUser" ]; then
  read -p "MongoDB User: " mdbUser
fi

if [ -z "$mdbPassword" ]; then
  read -s -p "MongoDB Password: " mdbPassword
fi

if [ -z "$mdbURI" ]; then
  read -p "MongoDB URI: " mdbURI
fi

mongo --quiet "$mdbURI" --username "$mdbUser" --password "$mdbPassword" --ssl  < listAll.js

