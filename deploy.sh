#!/bin/bash

# Clear Twig cache directory
if [ -e cache/* ]
    then rm -r cache/*
fi
# Update database
mysql -u root -p enigma < schema.sql
# Remove schema file
rm schema.sql README.md deploy.sh
