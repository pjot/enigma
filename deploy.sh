#!/bin/bash

# Clear Twig cache directory
rm -r cache/*
# Update database
mysql -u root -p enigma < schema.sql
# Remove schema file
rm schema.sql
# Remove deploy script
rm deploy.sh
