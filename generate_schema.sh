#!/bin/bash
mysqldump --skip-comments --no-set-names -u root enigma levels | sed 's/\/.*//' | grep . > levels.sql
