<?php

namespace Enigma\Views;

class Listing extends \Enigma\View
{
    public function display()
    {
        echo '<pre>';
        var_dump($this->data);
        echo '</pre>';
    }
}
