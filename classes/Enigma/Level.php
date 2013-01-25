<?php

namespace Enigma;

use \Enigma\Model;

/**
 * Class representing a level in the game.
 *
 * @author pjot
 */
class Level extends Model
{
    /**
     * Database fields.
     */
    protected static $fields = array(
        'id',
        'data',
        'name',
        'number'
    );
    /**
     * Database table
     */
    protected static $table = 'levels';
}
