<?php

namespace Enigma;

abstract class View
{
    protected $data = null;

    public function __construct($data)
    {
        $this->data = $data;
    }

    protected function getTemplate($template)
    {
        $loader = new \Twig_Loader_Filesystem('templates/');
        $twig = new \Twig_Environment($loader);
        return $twig->loadTemplate($template);
    }

    abstract public function display();
}
