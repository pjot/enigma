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
     * Creates a row in the database.
     */
    protected function create()
    {
        $fields = array();
        $values = array();
        foreach (static::$fields as $field)
        {
            if ( ! isset($this->$field))
            {
                continue;
            }
            $fields[] = $field;
            $values[] = sprintf('"%s"', $this->$field); 
        }
        $sql = sprintf(
            'insert into %s (%s) values (%s)',
            static::$table,
            implode($fields, ','),
            implode($values, ',')
        );
        $db = DbConnection::getInstance();
        $db->exec($sql);
        $this->id = $db->lastInsertId();
    }

    /**
     * Updates a row in the database.
     */
    protected function update()
    {
        $fields = array();
        foreach (static::$fields as $field)
        {
            $fields[] = sprintf(
                '%s = "%s"',
                $field,
                $this->$field
            );
        }
        $sql = sprintf(
            'update %s set %s where id = "%s"',
            static::$table,
            implode($fields, ','),
            $this->id
        );
        $db = DbConnection::getInstance();
        return $db->exec($sql) === 1;
    }

    /**
     * Fetches all objects in the database. Returns an array containing the objects.
     */
    public static function getAll()
    {
        $sql = sprintf(
            'select %s from %s',
            implode(static::$fields, ','),
            static::$table
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

    /**
     * Fetches a single object and returns it.
     */
    public static function getById($id)
    {
        $sql = sprintf(
            'select %s from %s where id = "%s"',
            implode(static::$fields, ','),
            static::$table,
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
