/**
 * Enums
 */
var Keys = {
    LEFT : 37,
    UP : 38,
    RIGHT : 39,
    DOWN : 40,
    NONE : 'none'
};
var TileTypes = {
    FLOOR : 'floor',
    WALL : 'wall',
    HOLE : 'hole',
    PLAYER : 'player',
    COIN : 'coin',
    getCount : function () {
        var count = 0;
        for (item in TileTypes)
        {
            if (TileTypes.hasOwnProperty(item) && typeof TileTypes[item] == 'string')
            {
                count++;
            }
        }
        return count;
    }
};
var GameStates = {
    LOADING : 0,
    WAITING : 1,
    MOVING : 2
};
/**
 * Boilerplate for requestAnimationFrame
 */
window.requestFrame = (function () {
    return window.requestAnimationFrame     || 
        window.webkitRequestAnimationFrame  || 
        window.mozRequestAnimationFrame     || 
        window.oRequestAnimationFrame       || 
        window.msRequestAnimationFrame      || 
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();
/**
 * Sprites
 */
var Sprites = {
    images : [
        TileTypes.PLAYER,
        TileTypes.FLOOR,
        TileTypes.HOLE,
        TileTypes.WALL,
        TileTypes.COIN
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
        var update = this.collector(TileTypes.getCount(), callback);
        for (image in this.images)
        {
            imageName = this.images[image];
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
    if (nextTile == false || nextTile.is(TileTypes.WALL))
    {
        this.dx = 0;
        this.dy = 0;
        Enigma.state = GameStates.WAITING;
        return;
    }
    var thisTile = Enigma.getTileAt(this.x, this.y);
    if (thisTile.is(TileTypes.COIN))
    {
        console.log(++Enigma.score);
        thisTile.type = TileTypes.FLOOR;
        console.log(Enigma.remainingCoins());
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
Level[TileTypes.WALL] = [
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
Level[TileTypes.COIN] = [
    [5, 4],
    [0, 1],
    [6, 0]
];
/*
Level[TileTypes.HOLE] = [
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
Level[TileTypes.PLAYER] = [4, 3];
var Enigma = {
    TILE_SIZE : 20,
    state : GameStates.LOADING,
    canvasElement : document.getElementById('game'),
    tileSize : {},
    tiles : [],
    tileCount : [],
    currentKey : Keys.NONE,
    score : 0,
    init : function () {
        this.canvas = this.canvasElement.getContext('2d');
        this.HEIGHT = this.canvasElement.attributes.height.value;
        this.WIDTH = this.canvasElement.attributes.width.value;
        this.tileCount.x = this.WIDTH / this.TILE_SIZE;
        this.tileCount.y = this.HEIGHT / this.TILE_SIZE;
        this.tiles = this.parseLevel(Level);
        this.player = new Tile(
            Level[TileTypes.PLAYER][0],
            Level[TileTypes.PLAYER][1],
            TileTypes.PLAYER
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
            var thisTile = tiles[tile],
                floor = new Tile(thisTile.x, thisTile.y, TileTypes.FLOOR);
            floor.draw();
            tiles[tile].draw();
        }
        this.player.draw();
    },
    remainingCoins : function () {
        var coins = 0;
        for (tile in this.tiles)
        {
            if (this.tiles[tile].type == TileTypes.COIN)
            {
                coins++;
            }
        }
        return coins;
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
            if (tileType == TileTypes.PLAYER)
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
                    tiles.push(new Tile(x, y, TileTypes.FLOOR));
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
    },
    start : function () {
        Sprites.preFetch(function () {
            Enigma.init();
            document.onkeydown = Enigma.keyDownListener;
            document.onkeyup = Enigma.keyUpListener;
        });
        (function gameLoop() {
            window.requestFrame(gameLoop);
            if (Enigma.state !== GameStates.LOADING)
            {
                Enigma.checkForMove();
                Enigma.handleInput();
                Enigma.drawMap(Enigma.tiles);
            }
        })();
    }
};
/**
 * Start the game
 */
Enigma.start();
