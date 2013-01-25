<?php

namespace Enigma;

class DbConnection
{
    private static $dbConfig = array(
        'database' => 'enigma',
        'hostname' => 'localhost',
        'username' => 'root',
        'password' => '',
    );

    private static $pdo = null;

    private function __construct() {}

    public static function getInstance()
    {
        if (empty(self::$pdo))
        {
            self::$pdo = new \PDO( 
                sprintf('mysql:dbname=%s;host=%s', self::$dbConfig['database'], self::$dbConfig['hostname']),
                self::$dbConfig['username'],
                self::$dbConfig['password']
            );
        }
        return self::$pdo;
    }
}
