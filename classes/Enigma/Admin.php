<?php

namespace Enigma;

/**
 * Class containing an admin controller.
 *
 * @author pjot
 */
class Admin
{
    private $get = null;
    private $action = null;
    private $view = null;

    /**
     * Constructor requires the _GET string.
     */
    public function __construct($get)
    {
        $this->get = $get;
    }

    /**
     * Run the controller.
     */
    public function run()
    {
        $this->getAction();
        $this->doAction();
        $this->displayView();
    }

    /**
     * Checks the URL for actions.
     */
    private function getAction()
    {
        if ( ! isset($this->get['action']))
        {
            $this->get['action'] = '';
        }
        switch (strtolower($this->get['action']))
        {
            case 'edit':
                $this->action = 'Edit';
                break;
            case 'list':
            default:
                $this->action = 'List';
                break;
        }
    }

    /**
     * Executes the selected action.
     *
     * The action called by this method should initialize the view.
     */
    private function doAction()
    {
        $this->{'action' . $this->action}();
    }

    /**
     * Edit a level.
     */
    private function actionEdit()
    {

    }

    /**
     * List all levels.
     */
    private function actionList()
    {
        $this->view = new \Enigma\Views\Listing(
            \Enigma\Level::getAll()
        );
    }

    /**
     * Display the view.
     */
    private function displayView()
    {
        echo $this->view->display();
    }
}