<?php

namespace Enigma;

abstract class AdminView extends \Enigma\View
{
    protected $data = null;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function display()
    {
        $template = $this->getTemplate('admin.html');
        $template->display(array(
            'content' => $this->render()
        ));
    }

    abstract public function render();
}
