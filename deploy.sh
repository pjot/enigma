#!/bin/bash

# Update database
mysql -u root -p enigma < levels.sql
# Remove files
rm schema.sql README.md deploy.sh generate_schema.sql
