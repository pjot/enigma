(function () {

    var Tile = function (x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    };
    var TileType = {
        BLANK : 'blank',
        WALL : 'wall',
        HOLE : 'hole',
        PLAYER : 'player'
    }
    Tile.prototype.draw = function () {
        var start_x = this.x * Enigma.TILE_SIZE,
            start_y = this.y * Enigma.TILE_SIZE,
            canvas = Enigma.canvas;
        canvas.beginPath();
        switch (this.type)
        {
            case TileType.PLAYER:
                canvas.fillStyle = '#0F0';
                canvas.arc(
                    start_x + Enigma.TILE_SIZE / 2,
                    start_y + Enigma.TILE_SIZE / 2,
                    Enigma.TILE_SIZE / 2,
                    0,
                    2 * Math.PI
                );
                break;
            case TileType.BLANK:
                canvas.moveTo(start_x, start_y);
                canvas.fillStyle = '#aaa';
                canvas.lineTo(start_x + Enigma.TILE_SIZE, start_y);
                canvas.lineTo(start_x + Enigma.TILE_SIZE, start_y + Enigma.TILE_SIZE);
                canvas.lineTo(start_x, start_y + Enigma.TILE_SIZE);
                canvas.lineTo(start_x, start_y);
                break;
            case TileType.WALL:
                canvas.moveTo(start_x, start_y);
                canvas.fillStyle = '#222';
                canvas.lineTo(start_x + Enigma.TILE_SIZE, start_y);
                canvas.lineTo(start_x + Enigma.TILE_SIZE, start_y + Enigma.TILE_SIZE);
                canvas.lineTo(start_x, start_y + Enigma.TILE_SIZE);
                canvas.lineTo(start_x, start_y);
                break;
            case TileType.HOLE:
                canvas.moveTo(start_x, start_y);
                canvas.fillStyle = '#FFF';
                canvas.lineTo(start_x + Enigma.TILE_SIZE, start_y);
                canvas.lineTo(start_x + Enigma.TILE_SIZE, start_y + Enigma.TILE_SIZE);
                canvas.lineTo(start_x, start_y + Enigma.TILE_SIZE);
                canvas.lineTo(start_x, start_y);
                break;
        }
        canvas.fill();
        canvas.closePath()
    };
    Tile.prototype.getType = function () {
        return this.type;
    };
    var Level = {};
    Level[TileType.WALL] = [
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6]
    ];
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
    Level[TileType.PLAYER] = [
        [4, 3]
    ];
    var Enigma = {
        TILE_SIZE : 20,
        canvasElement : document.getElementById('game'),
        tileSize : {},
        tiles : [],
        init : function () {
            this.canvas = this.canvasElement.getContext('2d');
            this.HEIGHT = this.canvasElement.attributes.height.value;
            this.WIDTH = this.canvasElement.attributes.width.value;
            this.tiles.x = this.WIDTH / this.TILE_SIZE;
            this.tiles.y = this.HEIGHT / this.TILE_SIZE;
            this.tiles = this.parseLevel(Level);
            this.drawMap(this.tiles);
        },
        drawMap : function (tiles) {
            for (tile in tiles)
            {
                tiles[tile].draw();
            }
        },
        parseLevel : function (level) {
            var tiles = [];
            for (x = 0; x < this.tiles.x; x++)
            {
                for (y = 0; y < this.tiles.y; y++)
                {
                    tiles.push(new Tile(x, y, TileType.BLANK));
                }
            }
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
            return tiles;
        }
    };
    Enigma.init();
})();
