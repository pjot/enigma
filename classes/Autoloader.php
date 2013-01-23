<?php

function autoload($className) {
	$fileName = sprintf('/var/www/enigma/classes/%s.php', str_replace('\\', '/', $className));
	if (file_exists($fileName)) {
		require($fileName);
		return true;
	}
	return false;
}
spl_autoload_register('autoload');
