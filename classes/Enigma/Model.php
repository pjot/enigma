<?php

namespace Enigma;

use \Enigma\DbConnection;

class Model
{
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
