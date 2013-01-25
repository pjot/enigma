<?php

require_once 'classes/Autoloader.php';

$admin = new \Enigma\Admin($_GET);
$admin->run();
