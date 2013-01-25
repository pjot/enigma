<?php

namespace Enigma\Views;

class Listing extends \Enigma\View
{
    public function display()
    {
        $template = $this->getTemplate('list.html');
        $template->display(array(
            'levels' => $this->data
        ));
    }
}
