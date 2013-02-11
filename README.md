enigma
======

This is an Enigma-ish game written in JS. (see http://enigma.nongnu.org/).

Setup for development
---------------------
* Create MySQL database "enigma"
* Clone git repo into folder handled by Apache
* Change DB settings to make it work (TODO: Store DB settings in a config file)

Pre-release
-----------

* Make sure you are developing in a feature branch
* Examine and run ./generate_schema.sh
* Commit the changes
* Push the branch and update the issue accordingly

Deploy
------

* Create MySQL database "enigma"
* Clone git repo into folder handled by Apache
* Examine and run ./deploy.sh in the folder
