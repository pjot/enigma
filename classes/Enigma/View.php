<?php

namespace Enigma;

abstract class View
{
    protected $data = null;

    public function __construct($data)
    {
        $this->data = $data;
    }

    abstract public function display();
}
