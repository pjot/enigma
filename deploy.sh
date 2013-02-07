#!/bin/bash

# Update database
echo "Database password"
mysql -u root -p enigma < levels.sql
# Remove files
rm levels.sql README.md deploy.sh generate_schema.sh
