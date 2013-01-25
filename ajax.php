<?php

require_once 'classes/Autoloader.php';

$level = \Enigma\Level::getWhere('number', $_GET['level']);
echo $level->toJSON();
