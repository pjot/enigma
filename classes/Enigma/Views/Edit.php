<?php

namespace Enigma\Views;

class Edit extends \Enigma\View
{
    public function display()
    {
        $template = $this->getTemplate('edit.html');
        $template->display(array(
            'level' => $this->data
        ));
    }
}
