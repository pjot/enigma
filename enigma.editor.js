/**
 * Enums.
 */
var TileTypes = {
    // Game tiles
    FLOOR   : 'floor',
    WALL    : 'wall',
    HOLE    : 'hole',
    PLAYER  : 'player',
    COIN    : 'coin',
    BOUNCE_R: 'bounce_r',
    BOUNCE_L: 'bounce_l',
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
        TileTypes.BOUNCE_L,
        TileTypes.BOUNCE_R,
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

Tile.prototype.toggle = function () {
    this.type = window.game.tileSelection;
    t = new Tile(this.x, this.y, TileTypes.FLOOR);
    t.draw();
    this.draw();
    if (this.is(TileTypes.PLAYER))
    {
        window.game.player = this;
    }
};

/**
 * Checks if the tile is a certain TileType.
 */
Tile.prototype.is = function (type) {
    return this.type == type;
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

Tile.prototype.drawFrame = function () {
    var start_x = this.x * window.game.TILE_SIZE,
        start_y = this.y * window.game.TILE_SIZE + window.game.TOP_OFFSET,
        canvas = window.game.canvas;
    window.game.drawMap(window.game.tiles);
    window.game.player.draw();
    canvas.fillStyle = 'rgba(255, 125, 0, 0.5)';
    canvas.fillRect(start_x, start_y, window.game.TILE_SIZE, window.game.TILE_SIZE);
    tile = new Tile(this.x, this.y, window.game.tileSelection);
    canvas.globalAlpha = 0.5;
    tile.draw();
    canvas.globalAlpha = 1;
};

/**
 * Main game object. Keeps track of everything.
 * @constructor
 */
var Enigma = function (canvasElement, tileContainer) {
    this.TILE_SIZE = 20;
    this.TOP_OFFSET = 0;
    this.PADDING = 4;
    this.canvasElement = canvasElement;
    this.tileContainer = tileContainer;
    this.tiles = [];
    this.tileCount = {};
    this.mouseDown = false;
};

/**
 * Initiate game (after images are fetched).
 */
Enigma.prototype.init = function () {
    // Calculate game constants
    this.canvasElement.onclick = Enigma.onClickListener;
    this.canvasElement.onmousemove = Enigma.onMouseMoveListener;
    this.canvasElement.onmousedown = Enigma.onMouseDownListener;
    this.canvasElement.onmouseup = Enigma.onMouseUpListener;
    this.canvas = this.canvasElement.getContext('2d');
    this.HEIGHT = this.canvasElement.attributes.height.value;
    this.WIDTH = this.canvasElement.attributes.width.value;
    this.tileCount = {
        x : this.WIDTH / this.TILE_SIZE,
        y : (this.HEIGHT - this.TOP_OFFSET) / this.TILE_SIZE
    };
    for (i in this.tileContainer.children)
    {
        var child = this.tileContainer.children[i];
        child.onclick = Enigma.tileClickListener;
    }
    this.setTileSelection();
};

Enigma.prototype.setTileSelection = function () {
    for (i in this.tileContainer.children)
    {
        var child = this.tileContainer.children[i];
        if (child.className == 'img-polaroid')
        {
            this.tileSelection = child.getAttribute('rel');
        }
    }
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
};

Enigma.prototype.ajaxLoadLevel = function (level_id) {
    var url = 'ajax.php?level=' + level_id;
    $.getJSON(url, function (data) {
        window.game.loadLevel(data);
        window.game.drawMap(window.game.tiles);
        window.game.player.draw();
    });
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
 * Loads a level into the game.
 */
Enigma.prototype.loadLevel = function (level) {
    this.parseLevel(level.tiles);
    this.player = new Tile(
        level.player[0],
        level.player[1],
        TileTypes.PLAYER
    );
};

/**
 * Serializes map so it can be sent to the server
 */
Enigma.prototype.serializeMap = function () {
    var types = [
            TileTypes.WALL, 
            TileTypes.COIN, 
            TileTypes.HOLE, 
            TileTypes.BOUNCE_L, 
            TileTypes.BOUNCE_R
        ],
        level = {};
    level.player = [this.player.x, this.player.y];
    level.tiles = {};
    for (i in types)
    {
        var thisType = [];
        for (t in this.tiles)
        {
            var tile = this.tiles[t];
            if (tile.is(types[i]))
            {
                thisType.push([tile.x, tile.y]);
            }
        }
        level.tiles[types[i]] = thisType;
    }
    var postData = {
        data : JSON.stringify(level),
        number : document.getElementById('number').value,
        name : document.getElementById('name').value,
        id : document.getElementById('id').value,
        sprite : document.getElementById('sprite').value
    };
    $.post('admin.php?action=save', postData, function (data) {
        $('#save_modal').modal();
    });
};

/**
 * Static listener for keyUp event.
 */
Enigma.onClickListener = function (e) {
    var event = e || window.event,
        tile = window.game.getTileAt(
            Math.floor(event.offsetX / window.game.TILE_SIZE),
            Math.floor((event.offsetY - window.game.TOP_OFFSET) / window.game.TILE_SIZE)
        );
    tile.toggle();
};

Enigma.onMouseDownListener = function (e) {
    var event = e || window.event;
    window.game.mouseDown = true;
};

Enigma.onMouseUpListener = function (e) {
    var event = e || window.event;
    window.game.mouseDown = false;
};

Enigma.onMouseMoveListener = function (e) {
    var event = e || window.event,
        tile = window.game.getTileAt(
            Math.floor(event.offsetX / window.game.TILE_SIZE),
            Math.floor((event.offsetY - window.game.TOP_OFFSET) / window.game.TILE_SIZE)
        );
    if (tile !== false)
    {
        tile.drawFrame();
        if (window.game.mouseDown)
        {
            tile.toggle();
        }
    }
};

Enigma.tileClickListener = function (e) {
    var event = e || window.event,
        element = event.target,
        siblings = element.parentElement.children;
    for (i in siblings)
    {
        siblings[i].className = '';
    }
    element.className = 'img-polaroid';
    window.game.setTileSelection();
};

Enigma.prototype.makeEmptyLevel = function () {
    var tiles = [];
    // Put a floor tile on all remaining tiles
    for (x = 0; x < this.tileCount.x; x++)
    {
        for (y = 0; y < this.tileCount.y; y++)
        {
        tiles.push(new Tile(x, y, TileTypes.FLOOR));
        }
    }
    this.tiles = tiles;
    this.drawMap(this.tiles);
};

/**
 * Starts the game.
 */
Enigma.prototype.start = function () {
    ImageCache.preFetch(function () {
        window.game.init();
        if (currentLevel !== 0)
        {
            window.game.ajaxLoadLevel(currentLevel);
        }
        else
        {
            window.game.makeEmptyLevel();
        }
    });
};

/**
 * Start the game
 */
window.game = new Enigma(
    document.getElementById('game'),
    document.getElementById('tile_selection')
);
window.game.start();
