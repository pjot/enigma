<?php

require_once 'classes/Autoloader.php';

$p = new \PDO(
    sprintf('mysql:dbname=%s;host=%s', \ORM\Config::DATABASE, \ORM\Config::HOSTNAME),
    \ORM\Config::USERNAME,
    \ORM\Config::PASSWORD
);

$stm = $p->query('describe levels');

if ($stm === false)
{
    echo \Enigma\Level::b();
    echo "\n";
    exit;
}

$dbFields = array();
while ($row = $stm->fetch(\PDO::FETCH_ASSOC))
{
    $dbFields[] = new \ORM\Field($row);
}

$fileFields = \Enigma\Level::a();

foreach ($fileFields as $field)
{
    echo "Looking for match for {$field->name}...";
    $found = 'No such column';
    foreach ($dbFields as $dbField)
    {
        if ($dbField->name === $field->name)
        {
            if ($field->sameDB($dbField))
            {
                $found = 'Match';
            }
            else
            {
                $found = "Non-matching: {$field->dbType} vs {$dbField->dbType}";
            }
        }
    }
    echo "$found\n";
}
