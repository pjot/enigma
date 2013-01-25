<?php

namespace Enigma;

/**
 * Singleton class that supplies global access to a PDO object.
 *
 * @author pjot
 */
final class DbConnection
{
    /**
     * Database configuration variables.
     * TODO: Move this to a config file.
     */
    private static $dbConfig = array(
        'database' => 'enigma',
        'hostname' => 'localhost',
        'username' => 'root',
        'password' => '',
    );

    /**
     * PDO object
     */
    private static $pdo = null;

    /**
     * Private constructor ensures singleton behaviour.
     */
    private function __construct() {}

    /**
     * Public access to the PDO object.
     */
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
