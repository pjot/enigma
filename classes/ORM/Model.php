<?php

namespace ORM;

abstract class Model
{
    /**
     * @var int
     */
    public $id;
    protected static $table;

    protected static function getFields()
    {
        $reflection = new \ReflectionClass(get_called_class());
        $fields = array();
        foreach ($reflection->getProperties() as $property)
        {
            if ($property->isPublic())
            {
                $fields[] = new \ORM\Field($property);
            }
        }
        return $fields;
    }

    protected static function generateCreateTable()
    {
        $table = array();
        $fields = array();
        foreach (static::getFields() as $field)
        {
            $fields[] = sprintf("%s %s", $field->name, $field->dbType); 
        }
        return sprintf("CREATE TABLE %s (%s)", static::$table, implode(',', $fields));
    }

    public static function getById($id)
    {

    }
}
