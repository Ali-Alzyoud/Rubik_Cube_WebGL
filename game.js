const VERTEXT_SHADER_SRC =
    'attribute vec4 aPosition;' +
    'void main() {' +
    'gl_Position = aPosition;' +
    '}';


const FRAGMENT_SHADER_SRC =
    'precision mediump float;' +
    'void main() {' +
    'gl_FragColor = vec4(1.0,0.0,0.0,1.0);' +
    '}';

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        this.width = canvas.width;
        this.height = canvas.height;
        this.vShader = null;
        this.fShader = null;
        this.program = null;
        this.clean();
        this.prepareVertexShader();
        this.prepareFragmentShader();
        this.linkProgram();
        this.setBufferData();
        this.draw();
    }

    clean() {
        const gl = this.gl;
        gl.viewport(0, 0, this.width, this.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    prepareVertexShader() {
        // create,set and compile vertex shader
        const gl = this.gl;
        if (!this.vShader) {
            this.vShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(this.vShader, VERTEXT_SHADER_SRC);
            gl.compileShader(this.vShader);
            var vCompiled = gl.getShaderParameter(this.vShader, gl.COMPILE_STATUS);
            if (!vCompiled)
                console.log("vertex compile error");
        }
    }

    prepareFragmentShader() {
        // create,set and compile vertex shader
        const gl = this.gl;
        if (!this.fShader) {
            this.fShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(this.fShader, FRAGMENT_SHADER_SRC);
            gl.compileShader(this.fShader);
            var vCompiled = gl.getShaderParameter(this.fShader, gl.COMPILE_STATUS);
            if (!vCompiled)
                console.log("vertex compile error");
        }
    }

    linkProgram() {
        //Create,attach,link and use Program
        const gl = this.gl;
        if (!this.program) {
            this.program = gl.createProgram();
            gl.attachShader(this.program, this.vShader);
            gl.attachShader(this.program, this.fShader);
            gl.linkProgram(this.program);
            gl.useProgram(this.program);
            var linked = gl.getProgramParameter(this.program, gl.LINK_STATUS);
            if (!linked)
                alert("program link error");
        }
    }

    setBufferData(){
        const gl = this.gl;
        const positions = new Float32Array(
            [-1.0, -1.0, 1.0, -1.0, 0.0, 1.0]);
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    }


    draw() {
        const gl = this.gl;
        const aPosition = gl.getAttribLocation(this.program, 'aPosition');
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }


}