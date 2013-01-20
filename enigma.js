/**
 * Enums.
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
    /**
     * Static method to get number of used tiles for prefetching.
     */
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
 * Boilerplate for cross-browser requestAnimationFrame
 */
window.requestFrame = (function () {
    return window.requestAnimationFrame     || 
        window.webkitRequestAnimationFrame  || 
        window.mozRequestAnimationFrame     || 
        window.oRequestAnimationFrame       || 
        window.msRequestAnimationFrame      || 
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/**
 * Image caching object.
 */
var ImageCache = {
    /**
     * Array of the images to cache.
     */
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

    /**
     * Method used to keep track of number of loaded images.
     */
    collector : function (expectedCount, callback) {
        var receivedCount = 0;
        return function () {
            if (++receivedCount == expectedCount)
            {
                callback();
            }
        };
    },

    /**
     * Prefetches all the images.
     */
    preFetch : function (callback) {
        var update = ImageCache.collector(TileTypes.getCount(), callback);
        for (image in ImageCache.images)
        {
            imageName = ImageCache.images[image];
            ImageCache[imageName] = new Image();
            ImageCache[imageName].src = 'images/' + imageName + '.png';
            ImageCache[imageName].addEventListener('load', update);
        }
    },

    /**
     * Get an image tag for a loaded image.
     */
    getImage : function (image) {
        return ImageCache[image];
    }
}

/**
 * Object representing a tile.
 * @constructor
 */
var Tile = function (x, y, type) {
    // Position
    this.x = x;
    this.y = y;
    // Type
    this.type = type;
};

/**
 * Moves the tile (according to the set dx and dy).
 */
Tile.prototype.move = function () {
    var thisTile = Enigma.getTileAt(this.x, this.y);
    // Check if the current tile has an action attached to it
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
    
    var nextTile = Enigma.getTileAt(this.x + this.dx, this.y + this.dy);
    // Stop if we hit the wall or the edge of the map
    // TODO: Make the player die when moving off the map
    if (nextTile == false || nextTile.is(TileTypes.WALL))
    {
        this.dx = 0;
        this.dy = 0;
        Enigma.state = GameStates.WAITING;
        return;
    }

    // Move
    this.x += this.dx;
    this.y += this.dy;
};

/**
 * Sets the direction of the player from keyboard input.
 */
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

/**
 * Draws the tile on the canvas.
 */
Tile.prototype.draw = function () {
    var start_x = this.x * Enigma.TILE_SIZE,
        start_y = this.y * Enigma.TILE_SIZE + Enigma.TOP_OFFSET,
        image = ImageCache.getImage(this.type);
    Enigma.canvas.drawImage(image, start_x, start_y);
};

/**
 * Checks if the tile is a certain TileType.
 */
Tile.prototype.is = function (type) {
    return this.type == type;
};

/**
 * Level 1 object
 * TODO: Fetch levels using Ajax.
 */
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

/**
 * Main game object. Keeps track of everything.
 */
var Enigma = {
    // Tile size in pixels
    TILE_SIZE : 20,
    // Titlebar height
    TOP_OFFSET : 20,
    // Current game state
    state : GameStates.LOADING,
    // Canvas element
    canvasElement : document.getElementById('game'),
    // Array of the tiles
    tiles : [],
    // Number of tiles in x and y
    tileCount : {},
    // Key currently pressed
    currentKey : Keys.NONE,
    // Current level
    currentLevel : 0,
    // Current score
    score : 0,
    // Total coins left in level
    totalCoins: 0,
    // Timestamp used to calculate FPS
    timestamp : 0,

    /**
     * Initiate game (after images are fetched.
     */
    init : function () {
        // Calculate game constants
        Enigma.canvas = Enigma.canvasElement.getContext('2d');
        Enigma.HEIGHT = Enigma.canvasElement.attributes.height.value;
        Enigma.WIDTH = Enigma.canvasElement.attributes.width.value;
        Enigma.tileCount.x = Enigma.WIDTH / Enigma.TILE_SIZE;
        Enigma.tileCount.y = (Enigma.HEIGHT - Enigma.TOP_OFFSET) / Enigma.TILE_SIZE;

        // Setup the game
        Enigma.loadLevel(Level);
        Enigma.drawMap(Enigma.tiles);
        Enigma.state = GameStates.WAITING;
    },

    /**
     * Loads a level into the game.
     */
    loadLevel : function (level) {
        Enigma.currentLevel = level.name;
        Enigma.tiles = Enigma.parseLevel(level.tiles);
        Enigma.player = new Tile(
            level.player[0],
            level.player[1],
            TileTypes.PLAYER
        );
        Enigma.player.dx = 0;
        Enigma.player.dy = 0;
        Enigma.totalCoins = 0;
        for (tile in Enigma.tiles)
        {
            if (Enigma.tiles[tile].is(TileTypes.COIN))
            {
                ++Enigma.totalCoins;
            }
        }
    },

    /**
     * Returns the tile at (x, y)-
     */
    getTileAt : function (x, y) {
        for (tile in Enigma.tiles)
        {
            if (Enigma.tiles[tile].x == x && Enigma.tiles[tile].y == y)
            {
                return Enigma.tiles[tile];
            }
        }
        return false;
    },

    /**
     * Draws the current game state to the canvas. Used to refresh the canvas.
     */
    drawMap : function (tiles) {
        for (tile in tiles)
        {
            var EnigmaTile = tiles[tile],
                floor = new Tile(EnigmaTile.x, EnigmaTile.y, TileTypes.FLOOR);
            floor.draw();
            tiles[tile].draw();
        }
        Enigma.player.draw();
        Enigma.drawTitleBar();
    },

    /**
     * Draw titlebar.
     */
    drawTitleBar : function () {
        var score = Enigma.score + '',
            x = 0,
            totalCoins = Enigma.totalCoins + '',
            currentLevel = Enigma.currentLevel + '';
        // Draw background
        for (i = 0; i < Enigma.tileCount.x; i++)
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

    /**
     * Calculates remaining coins in the level.
     */
    remainingCoins : function () {
        var coins = 0;
        for (tile in Enigma.tiles)
        {
            if (Enigma.tiles[tile].type == TileTypes.COIN)
            {
                coins++;
            }
        }
        return coins;
    },

    /**
     * Listener for keyUp event.
     */
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

    /**
     * Listener for keyDown event.
     */
    keyDownListener : function (e) {
        event = e || window.event;
        for (key in Keys)
        {
            if (event.keyCode == Keys[key] && event.keyCode != Enigma.currentKey)
            {
                Enigma.currentKey = Keys[key];
                break;
            }
        }
    },

    /**
     * Parses the tiles in a level and creates Tile objects.
     * Fills up empty tiles with floor tiles.
     */
    parseLevel : function (level) {
        var tiles = [];
        // Place the non-floor tiles 
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
        // Store them
        Enigma.tiles = tiles;
        // Put a floor tile on all remaining tiles
        for (x = 0; x < Enigma.tileCount.x; x++)
        {
            for (y = 0; y < Enigma.tileCount.y; y++)
            {
                if (Enigma.getTileAt(x, y) == false)
                {
                    tiles.push(new Tile(x, y, TileTypes.FLOOR));
                }
            }
        }
        return tiles;
    },

    /**
     * Moves the player if he is in motion.
     */
    checkForMove : function () {
        if (Enigma.state == GameStates.MOVING)
        {
            Enigma.player.move(); 
        }
    },

    /**
     * Delegates keyboard inputs.
     */
    handleInput : function () {
        if (Enigma.currentKey != Keys.NONE && Enigma.state == GameStates.WAITING)
        {
            Enigma.player.setDirection(Enigma.currentKey);
            Enigma.state = GameStates.MOVING;
        }
    },

    /**
     * Starts the game.
     */
    start : function () {
        Enigma.timestamp = + new Date();
        ImageCache.preFetch(function () {
            Enigma.init();
            document.onkeydown = Enigma.keyDownListener;
            document.onkeyup = Enigma.keyUpListener;
        });
        Enigma.gameLoop(+new Date());
    },

    /**
     * Main game loop.
     */
     gameLoop : function (time) {
        var fps = 1000 / (time - Enigma.timestamp);
        Enigma.timestamp = time;
        document.getElementById('fps').innerHTML = Math.floor(fps);
        window.requestFrame(Enigma.gameLoop);
        if (Enigma.state !== GameStates.LOADING)
        {
            Enigma.checkForMove();
            Enigma.handleInput();
            Enigma.drawMap(Enigma.tiles);
        }
    }
};

/**
 * Start the game
 */
Enigma.start();
