<?php

namespace Enigma\Views;

class Listing extends \Enigma\AdminView
{
    public function render()
    {
        $template = $this->getTemplate('list.html');
        return $template->render(array(
            'levels' => $this->data
        ));
    }
}
