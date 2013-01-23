<?php

namespace ORM;

class Field
{
    public $name;
    public $type;
    public $dbType;

    public function __construct($input)
    {
        if ($input instanceof \ReflectionProperty)
        {
            $this->name = $input->getName();
            $this->type = self::getTypeFromDocComment($input->getDocComment());
            $this->dbType = \ORM\Types::toDb($this->type);
        }
        else if (is_array($input))
        {
            $this->name = $input['Field'];
            $this->dbType = $input['Type'];
        }
    }

    public function sameDB(\ORM\Field $field)
    {
        return $this->dbType === $field->dbType;
    }

    private static function getTypeFromDocComment($docComment)
    {
        preg_match('/.*@var (\w+)\n.*/m', $docComment, $matches);
        return $matches[1];
    }
}
