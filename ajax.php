<?php

$levels = array(
    2 => array(
        'name' => 2,
        'player' => array(4, 3),
        'tiles' => array(
            'wall' => array(
                array(1, 1),
                array(2, 2),
                array(3, 3),
            ),
            'coin' => array(
                array(4, 4),
            ),
        ),
    ),
    3 => array(
        'name' => 3,
        'player' => array(4, 3),
        'tiles' => array(
            'wall' => array(
                array(2, 2),
                array(3, 3),
                array(7, 7),
            ),
            'coin' => array(
                array(4, 4),
            ),
        ),
    ),
);

echo json_encode($levels[$_GET['level']]);
