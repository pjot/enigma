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
        'number',
        'sprite'
    );

    public function toJSON()
    {
        $json_data = json_decode($this->data);
        return json_encode(array(
            'name' => (int) $this->number,
            'player' => $json_data->player,
            'tiles' => $json_data->tiles,
            'sprite' => $this->sprite
        ));
    }
}
