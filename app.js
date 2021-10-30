window.onload = function () {
    onStart();
};

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

    let r = 0;
    let c = 0;

    window.addEventListener('keyup', (e) => {
        if (e.keyCode == LEFT) {
            game.move(Game.MOVE_DIRECTION.LEFT, r, c);
        } else if (e.keyCode == RIGHT) {
            game.move(Game.MOVE_DIRECTION.RIGHT, r, c);
        } else if (e.keyCode == UP) {
            game.move(Game.MOVE_DIRECTION.BOTTOM, r, c);
        } else if (e.keyCode == DOWN) {
            game.move(Game.MOVE_DIRECTION.TOP, r, c);
        }

        if (e.keyCode >= ONE && e.keyCode <= NINE) {
            const index = e.keyCode - ONE;
            r = index % 3;
            c = Math.floor(index / 3);
        } else if (e.keyCode == ZERO) {
            r = -1;
            c = -1;
        }
    })
}