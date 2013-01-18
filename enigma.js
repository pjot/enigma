window.requestAnimFrame = (function () {
    return window.requestAnimationFrame     || 
        window.webkitRequestAnimationFrame  || 
        window.mozRequestAnimationFrame     || 
        window.oRequestAnimationFrame       || 
        window.msRequestAnimationFrame      || 
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();
var Keys = {
    LEFT : 37,
    UP : 38,
    RIGHT : 39,
    DOWN : 40,
    NONE : 'none'
}
var TileType = {
    FLOOR : 'floor',
    WALL : 'wall',
    HOLE : 'hole',
    PLAYER : 'player'
}
var Sprites = {
    images : [
        TileType.PLAYER,
        TileType.FLOOR,
        TileType.HOLE,
        TileType.WALL
    ],
    collector : function (expectedCount, callback) {
        var receivedCount = 0;
        return function () {
            if (++receivedCount == expectedCount)
            {
                callback();
            }
        };
    },
    preFetch : function (callback) {
        var update = this.collector(this.images.length, callback);
        for (image in this.images)
        {
            var imageName = this.images[image];
            this[imageName] = new Image();
            this[imageName].src = 'images/' + imageName + '.png';
            this[imageName].addEventListener('load', update, false);
        }
    },
    getImage : function (image) {
        return this[image];
    }
}
var Tile = function (x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.dx = 0;
    this.dy = 0;
};
Tile.prototype.move = function () {
    var nextTile = Enigma.getTileAt(this.x + this.dx, this.y + this.dy);
    if (nextTile == false || nextTile.is(TileType.WALL))
    {
        this.dx = 0;
        this.dy = 0;
        Enigma.state = GameStates.WAITING;
        return;
    }
    this.x += this.dx;
    this.y += this.dy;
};
Tile.prototype.setDirection = function (direction) {
    this.dx = 0;
    this.dy = 0;
    switch (direction)
    {
        case Keys.UP:
            this.dy = -1;
            break;
        case Keys.DOWN:
            this.dy = 1;
            break;
        case Keys.LEFT:
            this.dx = -1;
            break;
        case Keys.RIGHT:
            this.dx = 1;
            break;
    }
};
Tile.prototype.draw = function () {
    var start_x = this.x * Enigma.TILE_SIZE,
        start_y = this.y * Enigma.TILE_SIZE,
    canvas = Enigma.canvas;
    image = Sprites.getImage(this.type);
    canvas.drawImage(image, start_x, start_y);
};
Tile.prototype.is = function (type) {
    return this.type == type;
};
var Level = {};
Level[TileType.WALL] = [
    [1, 1],
    [2, 2],
    [3, 2],
    [12, 3],
    [12, 1],
    [3, 3],
    [8, 6],
    [11, 6],
    [18, 5],
    [3, 0],
    [4, 4],
    [5, 5],
    [6, 6]
];
/*
Level[TileType.HOLE] = [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9]
];
*/
Level[TileType.PLAYER] = [4, 3];
GameStates = {
    LOADING : 0,
    WAITING : 1,
    MOVING : 2,
};
var Enigma = {
    TILE_SIZE : 20,
    state : GameStates.LOADING,
    canvasElement : document.getElementById('game'),
    tileSize : {},
    tiles : [],
    tileCount : [],
    currentKey : Keys.NONE,
    init : function () {
        this.canvas = this.canvasElement.getContext('2d');
        this.HEIGHT = this.canvasElement.attributes.height.value;
        this.WIDTH = this.canvasElement.attributes.width.value;
        this.tileCount.x = this.WIDTH / this.TILE_SIZE;
        this.tileCount.y = this.HEIGHT / this.TILE_SIZE;
        this.tiles = this.parseLevel(Level);
        this.player = new Tile(
            Level[TileType.PLAYER][0],
            Level[TileType.PLAYER][1],
            TileType.PLAYER
        );
        this.drawMap(this.tiles);
        this.state = GameStates.WAITING;
    },
    getTileAt : function (x, y) {
        for (tile in this.tiles)
        {
            if (this.tiles[tile].x == x && this.tiles[tile].y == y)
            {
                return this.tiles[tile];
            }
        }
        return false;
    },
    drawMap : function (tiles) {
        for (tile in tiles)
        {
            tiles[tile].draw();
        }
        this.player.draw();
    },
    keyUpListener : function (e) {
        event = e || window.event;
        for (key in Keys)
        {
            if (event.keyCode == Keys[key])
            {
                Enigma.currentKey = Keys.NONE;
                break;
            }
        }
    },
    keyDownListener : function (e) {
        event = e || window.event;
        for (key in Keys)
        {
            if (event.keyCode == Keys[key] && event.keyCode != this.currentKey)
            {
                Enigma.currentKey = Keys[key];
                break;
            }
        }
    },
    parseLevel : function (level) {
        var tiles = [];
        for (tileType in level)
        {
            if (tileType == TileType.PLAYER)
            {
                continue;
            }
            for (row in level[tileType])
            {
                tiles.push(new Tile(
                    level[tileType][row][0],
                    level[tileType][row][1],
                    tileType
                ));
            }
        }
        this.tiles = tiles;
        for (x = 0; x < this.tileCount.x; x++)
        {
            for (y = 0; y < this.tileCount.y; y++)
            {
                if (this.getTileAt(x, y) == false)
                {
                    tiles.push(new Tile(x, y, TileType.FLOOR));
                }
            }
        }
        return tiles;
    },
    checkForMove : function () {
        if (this.state == GameStates.MOVING)
        {
            this.player.move(); 
        }
    },
    handleInput : function () {
        if (this.currentKey != Keys.NONE && this.state == GameStates.WAITING)
        {
            this.player.setDirection(this.currentKey);
            this.state = GameStates.MOVING;
        }
    }
};
Sprites.preFetch(function () {
    Enigma.init();
    document.onkeydown = Enigma.keyDownListener;
    document.onkeyup = Enigma.keyUpListener;
});
(function animationLoop() {
    requestAnimFrame(animationLoop);
    if (Enigma.state !== GameStates.LOADING)
    {
        Enigma.checkForMove();
        Enigma.handleInput();
        Enigma.drawMap(Enigma.tiles);
    }
})();
