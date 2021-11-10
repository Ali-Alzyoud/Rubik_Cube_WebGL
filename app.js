window.onload = function () {
    onStart();
};

const MODE = {
    SELECT: "SELECT",
    MOVE: "MOVE",
}

function onStart() {
    const canvas = document.getElementById("gameCanvas");
    const game = new Game(canvas);

    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const ZERO = 96;
    const ONE = 97;
    const NINE = 105;

    const selectColor = [0.0, 0.0, 0.0];
    const moveColor = [0.5, 0.5, 0.5];

    let r = 0;
    let c = 0;
    let mode = MODE.SELECT;
    game.selectColor = selectColor;
    game.redraw();
    let direction = null;

    window.addEventListener('keyup', (e) => {
        direction = null;
        if (e.keyCode == LEFT) {
            if (mode == MODE.MOVE) {
                direction = MOVE_DIRECTION.LEFT;
            }
            else {
                c++;
            }
        } else if (e.keyCode == RIGHT) {
            if (mode == MODE.MOVE) {
                direction = MOVE_DIRECTION.RIGHT;
            }
            else {
                c--;
            }
        } else if (e.keyCode == UP) {
            if (mode == MODE.MOVE) {
                direction = MOVE_DIRECTION.UP;
            } else {
                r--;
            }
        } else if (e.keyCode == DOWN) {
            if (mode == MODE.MOVE) {
                direction = MOVE_DIRECTION.DOWN;
            } else {
                r++
            }
        }
        else {
            if (mode == MODE.SELECT) {
                mode = MODE.MOVE;
                game.selectColor = moveColor;
            } else {
                mode = MODE.SELECT;
                game.selectColor = selectColor;
            }
        }

        if (direction) {
            game.move(direction, r, c);
        } else {
            if (c > 2) {
                game.move(MOVE_DIRECTION.RIGHT, -1, -1);
                c = 0;
            }
            else if (c < 0) {
                game.move(MOVE_DIRECTION.LEFT, -1, -1);
                c = 2;
            } else if (r > 2) {
                game.move(MOVE_DIRECTION.DOWN, -1, -1);
                r = 0;
            }
            else if (r < 0) {
                game.move(MOVE_DIRECTION.UP, -1, -1);
                r = 2;
            }
            game.select(r, c);
        }
    })
}