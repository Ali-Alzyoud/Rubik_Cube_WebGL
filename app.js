window.onload = function () {
    onStart();
};

function onStart(){
    const canvas = document.getElementById("gameCanvas");
    const game = new Game(canvas);
}