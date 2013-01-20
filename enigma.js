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
    // Game tiles
    FLOOR   : 'floor',
    WALL    : 'wall',
    HOLE    : 'hole',
    PLAYER  : 'player',
    COIN    : 'coin',
    // Titlebar tiles
    ONE     : '1',
    TWO     : '2',
    THREE   : '3',
    FOUR    : '4',
    FIVE    : '5',
    SIX     : '6',
    SEVEN   : '7',
    EIGHT   : '8',
    NINE    : '9',
    ZERO    : '0',
    SLASH   : 'slash',
    TITLEBAR: 'titlebar',
    // Static function to get number of used tiles for prefetching
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
        TileTypes.COIN,
        TileTypes.ONE,
        TileTypes.TWO,
        TileTypes.THREE,
        TileTypes.FOUR,
        TileTypes.FIVE,
        TileTypes.SIX,
        TileTypes.SEVEN,
        TileTypes.EIGHT,
        TileTypes.NINE,
        TileTypes.ZERO,
        TileTypes.SLASH,
        TileTypes.TITLEBAR
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
    switch (thisTile.type)
    {
        case TileTypes.COIN:
            Enigma.score++;
            thisTile.type = TileTypes.FLOOR;
            if (Enigma.remainingCoins() == 0)
            {
                console.log('Won!');
                Enigma.state = GameStates.WAITING;
                return;
            }
            break;
        case TileTypes.HOLE:
            console.log('Dead!');
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
        start_y = this.y * Enigma.TILE_SIZE + Enigma.TOP_OFFSET,
    canvas = Enigma.canvas;
    image = Sprites.getImage(this.type);
    canvas.drawImage(image, start_x, start_y);
};
Tile.prototype.is = function (type) {
    return this.type == type;
};
var Level = {
    name : 1,
    player : [4, 3],
    tiles : {}
};
Level.tiles[TileTypes.WALL] = [
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
Level.tiles[TileTypes.COIN] = [
    [11, 4],
    [0, 1],
    [6, 0],
    [7, 0],
    [8, 0],
    [9, 0],
    [10, 0],
    [11, 0],
    [12, 0],
    [13, 0]
];
Level.tiles[TileTypes.HOLE] = [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [17, 9]
];
var Enigma = {
    TILE_SIZE : 20,
    TOP_OFFSET : 20,
    state : GameStates.LOADING,
    canvasElement : document.getElementById('game'),
    tiles : [],
    tileCount : [],
    currentKey : Keys.NONE,
    currentLevel : 0,
    score : 0,
    totalCoins: 0,
    timestamp : 0,
    init : function () {
        this.canvas = this.canvasElement.getContext('2d');
        this.HEIGHT = this.canvasElement.attributes.height.value;
        this.WIDTH = this.canvasElement.attributes.width.value;
        this.tileCount.x = this.WIDTH / this.TILE_SIZE;
        this.tileCount.y = (this.HEIGHT - this.TOP_OFFSET) / this.TILE_SIZE;
        this.loadLevel(Level);
        this.drawMap(this.tiles);
        this.state = GameStates.WAITING;
    },
    loadLevel : function (level) {
        this.currentLevel = level.name;
        this.tiles = this.parseLevel(level.tiles);
        this.player = new Tile(
            level.player[0],
            level.player[1],
            TileTypes.PLAYER
        );
        this.totalCoins = 0;
        for (tile in this.tiles)
        {
            if (this.tiles[tile].is(TileTypes.COIN))
            {
                ++this.totalCoins;
            }
        }
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
        this.drawTitleBar();
    },
    drawTitleBar : function () {
        var score = this.score + '',
            x = 0,
            totalCoins = this.totalCoins + '',
            currentLevel = this.currentLevel + '';
        // Draw background
        for (i = 0; i < this.tileCount.x; i++)
        {
            t = new Tile(i, -1, TileTypes.TITLEBAR);
            t.draw();
        }
        // Draw current level
        for (letter in currentLevel)
        {
            t = new Tile(x, -1, currentLevel[letter]);
            t.draw();
            x++;
        }
        // Draw current score
        for (letter in score)
        {
            x++;
            t = new Tile(x, -1, score[letter]);
            t.draw();
        }
        x++;
        t = new Tile(x, -1, TileTypes.SLASH);
        t.draw();
        // Draw target score
        for (letter in totalCoins)
        {
            x++;
            t = new Tile(x, -1, totalCoins[letter]);
            t.draw();
        }
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
        Enigma.timestamp = + new Date();
        Sprites.preFetch(function () {
            Enigma.init();
            document.onkeydown = Enigma.keyDownListener;
            document.onkeyup = Enigma.keyUpListener;
        });
        (function gameLoop(time) {
            var fps = 1000 / (time - Enigma.timestamp);
            Enigma.timestamp = time;
            document.getElementById('fps').innerHTML = Math.floor(fps);
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
