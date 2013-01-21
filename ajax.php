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
    4 => array(
        'name' => 4,
        'player' => array(8, 8),
        'tiles' => array(
            'wall' => array(
                array(0, 0),
                array(0, 1),
                array(0, 2),
                array(0, 3),
            ),
            'coin' => array(
                array(8, 6),
                array(8, 7),
            ),
            'hole' => array(
            ),
        ),
    ),
    5 => array(
        'name' => 5,
        'player' => array(9, 10),
        'tiles' => array(
            'wall' => array(
                array(0, 9),
                array(9, 5),
                array(10, 7),
                array(13, 10),
                array(14, 10),
                array(15, 6),
            ),
            'coin' => array(
                array(4, 9),
                array(9, 6),
                array(13, 9),
                array(14, 6),
                array(14, 9),
            ),
            'hole' => array(
            ),
        ),
    ),
);

echo json_encode($levels[$_GET['level']]);
