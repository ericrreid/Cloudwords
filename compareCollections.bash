#! /bin/bash

# Looks for non-system collections

# Uses these if set, otherwise prompts
#  $mdbSourceUser
#  $mdbSourcePassword
#  $mdbSourceURI
#  $mdbSourceSSL
#  $mdbDestinationUser
#  $mdbDestinationPassword
#  $mdbDestinationURI
#  $mdbDestinationSSL

if [ -z "$mdbSourceUser" ]; then
  read -p "Source: MongoDB User: " mdbSourceUser
fi

if [ -z "$mdbSourcePassword" ]; then
  read -s -p "Source: MongoDB Password: " mdbSourcePassword
fi

if [ -z "$mdbSourceURI" ]; then
  read -p "Source: MongoDB URI: " mdbSourceURI
fi

if [ "$mdbSourceSSL" ]; then
  sourceSSLString="--ssl"
else
  sourceSSLString=""
fi

if [ -z "$mdbDestinationUser" ]; then
  read -p "Destination: MongoDB User: " mdbDestinationUser
fi

if [ -z "$mdbDestinationPassword" ]; then
  read -s -p "Destination: MongoDB Password: " mdbDestinationPassword
fi

if [ -z "$mdbDestinationURI" ]; then
  read -p "Destination: MongoDB URI: " mdbDestinationURI
fi

if [ "$mdbDestinationSSL" ]; then
  destinationSSLString="--ssl"
else
  destinationSSLString=""
fi


# Data gathering: Source
echo "Counting docs in Source..."
mongo --quiet "$mdbSourceURI" --username "$mdbSourceUser" --password $mdbSourcePassword $sourceSSLString  < countDocs.js > documents.source

echo "Counting indexes in Source..."
mongo --quiet "$mdbSourceURI" --username "$mdbSourceUser" --password $mdbSourcePassword $sourceSSLString  < countIndexes.js > indexes.source

# Data gathering: Destination
echo "Counting docs in Destination..."
mongo --quiet "$mdbDestinationURI" --username "$mdbDestinationUser" --password $mdbDestinationPassword $destinationSSLString  < countDocs.js > documents.destination

echo "Counting indexes in Destination..."
mongo --quiet "$mdbDestinationURI" --username "$mdbDestinationUser" --password $mdbDestinationPassword $destinationSSLString  < countIndexes.js > indexes.destination

echo " "
echo "==================="
echo " "

echo "Diff of # documents:"
diff -y documents.*

echo "Diff of indexes:"
diff -y indexes.*


