/**
 * Enums.
 */
var MovementKeys = {
    LEFT : 37,
    UP : 38,
    RIGHT : 39,
    DOWN : 40,
    NONE : 'none'
};

var ActionKeys = {
    R : 82
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
    var thisTile = window.game.getTileAt(this.x, this.y);
    // Check if the current tile has an action attached to it
    switch (thisTile.type)
    {
        case TileTypes.COIN:
            window.game.score++;
            thisTile.type = TileTypes.FLOOR;
            if (window.game.remainingCoins() == 0)
            {
                window.game.won();
                return;
            }
            break;
        case TileTypes.HOLE:
            console.log('Dead!');
            window.game.state = GameStates.WAITING;
            return;
    }
    
    var nextTile = window.game.getTileAt(this.x + this.dx, this.y + this.dy);
    // Stop if we hit the wall or the edge of the map
    // TODO: Make the player die when moving off the map
    if (nextTile == false || nextTile.is(TileTypes.WALL))
    {
        this.dx = 0;
        this.dy = 0;
        window.game.state = GameStates.WAITING;
        return;
    }

    // Move
    this.x += this.dx;
    this.y += this.dy;
    window.game.registerMove();
};

/**
 * Sets the direction of the player from keyboard input.
 */
Tile.prototype.setDirection = function (direction) {
    this.dx = 0;
    this.dy = 0;
    switch (direction)
    {
        case MovementKeys.UP:
            this.dy = -1;
            break;
        case MovementKeys.DOWN:
            this.dy = 1;
            break;
        case MovementKeys.LEFT:
            this.dx = -1;
            break;
        case MovementKeys.RIGHT:
            this.dx = 1;
            break;
    }
};

/**
 * Draws the tile on the canvas.
 */
Tile.prototype.draw = function () {
    var start_x = this.x * window.game.TILE_SIZE,
        start_y = this.y * window.game.TILE_SIZE + window.game.TOP_OFFSET,
        image = ImageCache.getImage(this.type);
    window.game.canvas.drawImage(image, start_x, start_y);
};

/**
 * Checks if the tile is a certain TileType.
 */
Tile.prototype.is = function (type) {
    return this.type == type;
};

/**
 * Main game object. Keeps track of everything.
 * @constructor
 */
var Enigma = function (canvasElement) {
    Enigma.currentKey = MovementKeys.NONE;
    this.TILE_SIZE = 20;
    this.TOP_OFFSET = 20;
    this.state = GameStates.LOADING;
    this.canvasElement = canvasElement;
    this.tiles = [];
    this.tileCount = {};
    this.currentLevel = 0;
    this.score = 0;
    this.totalCoins= 0;
    this.timestamp = 0;
    this.moves = 0;
    this.hasMoved = false;
};

/**
 * Initiate game (after images are fetched).
 */
Enigma.prototype.init = function () {
    // Calculate game constants
    this.canvas = this.canvasElement.getContext('2d');
    this.HEIGHT = this.canvasElement.attributes.height.value;
    this.WIDTH = this.canvasElement.attributes.width.value;
    this.tileCount = {
        x : this.WIDTH / this.TILE_SIZE,
        y : (this.HEIGHT - this.TOP_OFFSET) / this.TILE_SIZE
    };
    // Setup the game
    this.ajaxLoadLevel(1);
};

Enigma.prototype.won = function () {
    this.currentLevel++;
    this.ajaxLoadLevel(this.currentLevel);
};

Enigma.prototype.ajaxLoadLevel = function (level_id) {
    var url = 'ajax.php?level=' + level_id;
    $.getJSON(url, function (data) {
        window.game.loadLevel(data);
        window.game.drawMap(window.game.tiles);
        window.game.state = GameStates.WAITING;
    });
};

/**
 * Loads a level into the game.
 */
Enigma.prototype.loadLevel = function (level) {
    this.score = 0;
    this.moves = 0;
    this.currentLevel = level.name;
    this.parseLevel(level.tiles);
    this.player = new Tile(
        level.player[0],
        level.player[1],
        TileTypes.PLAYER
    );
    this.player.dx = 0;
    this.player.dy = 0;
    this.totalCoins = 0;
    for (tile in this.tiles)
    {
        if (this.tiles[tile].is(TileTypes.COIN))
        {
            ++this.totalCoins;
        }
    }
    console.log('Starting game with level: ' + this.currentLevel);
};

/**
 * Returns the tile at (x, y)-
 */
Enigma.prototype.getTileAt = function (x, y) {
    for (tile in this.tiles)
    {
        if (this.tiles[tile].x == x && this.tiles[tile].y == y)
        {
            return this.tiles[tile];
        }
    }
    return false;
};

/**
 * Draws the current game state to the canvas. Used to refresh the canvas.
 */
Enigma.prototype.drawMap = function (tiles) {
    for (tile in tiles)
    {
        var thisTile = tiles[tile],
            floor = new Tile(thisTile.x, thisTile.y, TileTypes.FLOOR);
        floor.draw();
        tiles[tile].draw();
    }
    this.player.draw();
    this.drawTitleBar();
};

/**
 * Draw titlebar.
 */
Enigma.prototype.drawTitleBar = function () {
    var score = this.score + '',
        x = 0,
        totalCoins = this.totalCoins + '',
        currentLevel = this.currentLevel + '',
        currentMoves = this.moves + '';
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
    x = this.tileCount.x;
    movesReverse = currentMoves.split('').reverse().join('');
    for (letter in movesReverse)
    {
        x--;
        t = new Tile(x, -1, movesReverse[letter]);
        t.draw();
    }
};

/**
 * Calculates remaining coins in the level.
 */
Enigma.prototype.remainingCoins = function () {
    var coins = 0;
    for (tile in this.tiles)
    {
        if (this.tiles[tile].type == TileTypes.COIN)
        {
            coins++;
        }
    }
    return coins;
};

/**
 * Static listener for keyUp event.
 */
Enigma.keyUpListener = function (e) {
    event = e || window.event;
    for (key in MovementKeys)
    {
        if (event.keyCode == MovementKeys[key])
        {
            Enigma.currentKey = MovementKeys.NONE;
            break;
        }
    }
};

/**
 * Static listener for keyDown event.
 */
Enigma.keyDownListener = function (e) {
    event = e || window.event;
    if (event.keyCode == ActionKeys.R)
    {
        window.game.ajaxLoadLevel(window.game.currentLevel);
        return;
    }
    for (key in MovementKeys)
    {
        if (event.keyCode == MovementKeys[key] && event.keyCode != Enigma.currentKey)
        {
            Enigma.currentKey = MovementKeys[key];
            break;
        }
    }
};

/**
 * Parses the tiles in a level and creates Tile objects.
 * Fills up empty tiles with floor tiles.
 */
Enigma.prototype.parseLevel = function (level) {
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
    this.tiles = tiles;
    // Put a floor tile on all remaining tiles
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
    this.tiles = tiles;
};

/**
 * Moves the player if he is in motion.
 */
Enigma.prototype.checkForMove = function () {
    if (this.state == GameStates.MOVING)
    {
        this.player.move(); 
    }
};

Enigma.prototype.registerMove = function () {
    if ( ! this.hasMoved)
    {
        this.moves++;
    }
    this.hasMoved = true;
};

/**
 * Delegates keyboard inputs.
 */
Enigma.prototype.handleInput = function () {
    if (Enigma.currentKey != MovementKeys.NONE && this.state == GameStates.WAITING)
    {
        this.player.setDirection(Enigma.currentKey);
        this.state = GameStates.MOVING;
        this.hasMoved = false;
    }
};

/**
 * Starts the game.
 */
Enigma.prototype.start = function () {
    this.timestamp = + new Date();
    ImageCache.preFetch(function () {
        window.game.init();
        document.onkeydown = Enigma.keyDownListener;
        document.onkeyup = Enigma.keyUpListener;
    });
    this.gameLoop(+new Date());
};

/**
 * Main game loop.
 */
 Enigma.prototype.gameLoop = function (time) {
    var fps = 1000 / (time - this.timestamp);
    this.timestamp = time;
    document.getElementById('fps').innerHTML = Math.floor(fps);
    window.requestFrame(window.game.gameLoop);
    if (window.game.state !== GameStates.LOADING)
    {
        window.game.checkForMove();
        window.game.handleInput();
        window.game.drawMap(window.game.tiles);
    }
};

/**
 * Start the game
 */
window.game = new Enigma(document.getElementById('game'));
window.game.start();
