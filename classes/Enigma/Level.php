<?php

namespace Enigma;

use \Enigma\Model;

class Level extends Model
{
    protected static $fields = array(
        'id',
        'data',
        'name',
        'number'
    );
    protected static $table = 'levels';
}
