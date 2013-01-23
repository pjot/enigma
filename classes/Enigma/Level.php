<?php

namespace Enigma;

class Level extends \ORM\Model
{
    /**
     * @var varchar
     */
    public $name;
    /**
     * @var text
     */
    public $data;

    protected static $table = 'levels';

    public static function b()
    {
        return self::generateCreateTable();
    }

    public static function a()
    {
        return self::getFields();
    }

    public static function getById($id)
    {
        if ( ! is_int($id))
        {
            throw new InvalidArgumentException('id must be int');
        }

    }
}
