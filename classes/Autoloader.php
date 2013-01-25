<?php

function autoload($className) {
	$fileName = sprintf('%s/%s.php', dirname(__FILE__), str_replace('\\', '/', $className));
	if (file_exists($fileName)) {
		require($fileName);
		return true;
	}
	return false;
}
spl_autoload_register('autoload');

require_once 'Twig/Autoloader.php';
Twig_Autoloader::register();

