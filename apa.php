<?php

require_once 'classes/Autoloader.php';

$levels = \Enigma\Level::getAll();
var_dump($levels);
