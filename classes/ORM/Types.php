<?php

namespace ORM;

abstract class Types{
    const INT = 'int';
    const VARCHAR = 'varchar';
    const TEXT = 'text';

    private static $typesMap = array(
        self::INT => 'int(8)',
        self::VARCHAR => 'varchar(255)',
        self::TEXT => 'text',
    );

    public static function toDB($type)
    {
        if ( ! isset(self::$typesMap[$type]))
        {
            throw new InvalidArgumentException($type . ' is not a valid field type');
        }
        return self::$typesMap[$type];
    }
}
