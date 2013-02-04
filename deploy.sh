#!/bin/bash

# Clear Twig cache directory
if [ -e cache/* ]
    then rm -r cache/*
fi
# Update database
mysql -u root -p enigma < levels.sql
# Remove schema file
rm schema.sql README.md deploy.sh generate_schema.sql
