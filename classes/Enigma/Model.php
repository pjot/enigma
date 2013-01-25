<?php

namespace Enigma;

use \Enigma\DbConnection;

/**
 * Base model, handles CRUD actions on the models.
 * All models extends this class.
 *
 * @author pjot
 */
class Model
{
    /**
     * Saves the instance to the database. Updates or creates depending on the id field.
     */
    public function save()
    {
        if (isset($this->id))
        {
            return $this->update();
        }
        else
        {
            return $this->create();
        }
    }

    /**
     * Returns the table name for a model.
     *
     * The table name is the class name plus an s. The method also removes the namespace. Example:
     * Input: \Enigma\Level
     * Output: levels
     */
    private static function getTable($class)
    {
        return sprintf(
            '%ss',
            array_pop(
                explode(
                    '\\', 
                    strtolower($class)
                )
            )
        );
    }

    /**
     * Creates a row in the database.
     */
    protected function create()
    {
        $fields = array();
        $values = array();
        $prep = array();
        foreach (static::$fields as $field)
        {
            if ( ! isset($this->$field))
            {
                continue;
            }
            $fields[] = $field;
            $prep[] = ':' . $field;
            $values[':' . $field] = $this->$field;
        }
        $sql = sprintf(
            'insert into %s (%s) values (%s)',
            self::getTable(get_called_class()),
            implode($fields, ','),
            implode($prep, ',')
        );
        $db = DbConnection::getInstance();
        $statement = $db->prepare($sql);
        $statement->execute($values);
        $this->id = $db->lastInsertId();
    }

    /**
     * Updates a row in the database.
     */
    protected function update()
    {
        $fields = array();
        $values = array();
        foreach (static::$fields as $field)
        {
            $fields[] = sprintf(
                '%s = :%s',
                $field,
                $field
            );
            $values[':' . $field] = $this->$field;
        }
        $sql = sprintf(
            'update %s set %s where id = "%s"',
            self::getTable(get_called_class()),
            implode($fields, ','),
            $this->id
        );
        $db = DbConnection::getInstance();
        $statement = $db->prepare($sql);
        return $statement->execute($values) === true;
    }

    /**
     * Fetches all objects in the database. Returns an array containing the objects.
     */
    public static function getAll()
    {
        $sql = sprintf(
            'select %s from %s',
            implode(static::$fields, ','),
            self::getTable(get_called_class())
        );
        $db = DbConnection::getInstance();
        $result = $db->query($sql);
        $class = get_called_class();
        $items = array();
        while ($row = $result->fetch(\PDO::FETCH_ASSOC))
        {
            $item = new $class();
            foreach ($row as $key => $value)
            {
                $item->$key = $value;
            }
            $items[] = $item;
        }
        return $items;
    }

    public static function getWhere($field, $value)
    {
        $class = get_called_class();
        $item = new $class();
        $sql = sprintf(
            'select %s from %s where %s = "%s"',
            implode(static::$fields, ','),
            self::getTable(get_called_class()),
            $field,
            $value
        );
        $db = DbConnection::getInstance();
        $result = $db->query($sql);
        if ($result->rowCount() !== 1)
        {
            return $item;
        }
        $row = $result->fetch(\PDO::FETCH_ASSOC);
        foreach ($row as $key => $value)
        {
            $item->$key = $value;
        }
        return $item;
    }

    /**
     * Fetches a single object and returns it.
     */
    public static function getById($id)
    {
        $sql = sprintf(
            'select %s from %s where id = "%s"',
            implode(static::$fields, ','),
            self::getTable(get_called_class()),
            $id
        );
        $db = DbConnection::getInstance();
        $result = $db->query($sql);
        if ($result->rowCount() !== 1)
        {
            throw new Exception();
        }
        $class = get_called_class();
        $item = new $class();
        $row = $result->fetch(\PDO::FETCH_ASSOC);
        foreach ($row as $key => $value)
        {
            $item->$key = $value;
        }
        return $item;
    }
}
