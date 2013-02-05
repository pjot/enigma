<?php

namespace Enigma\Views;

class Edit extends \Enigma\AdminView
{
    public function render()
    {
        $template = $this->getTemplate('edit.html');
        return $template->render(array(
            'level' => $this->data
        ));
    }
}
