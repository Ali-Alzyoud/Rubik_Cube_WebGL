const VERTEXT_SHADER_SRC =
    `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    uniform mat4 uModel;


    varying   vec4 vColor;
    void main() {
        gl_Position = aPosition * uModel;
        vColor = aColor;
    }
    `;


const FRAGMENT_SHADER_SRC =
    `
    precision mediump float;
    varying   vec4 vColor;
    void main() {
        gl_FragColor = vColor;
    }
    `;

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
        this.prepare();
        this.setBufferData();

        this.angle = 1;
        setInterval(() => {
            const gl = this.gl;

            this.clean();
            this.drawCube(0.5,  0.5 , 0);
            this.drawCube(0.5,  0.0 , 0);
            this.drawCube(0.5, -0.5 , 0);

            this.drawCube(0.0,  0.5 , 0);
            this.drawCube(0.0,  0.0 , 0);
            this.drawCube(0.0, -0.5 , 0);

            
            this.drawCube(-0.5,  0.5 , 0);
            this.drawCube(-0.5,  0.0 , 0);
            this.drawCube(-0.5, -0.5 , 0);

            this.angle+= 0.01;
        }, 20);
    }

    drawCube(x , y, z){
        const gl = this.gl;
        const uModel = gl.getUniformLocation(this.program, 'uModel');

        const M1 = Mat.Mat_translate(x, y, z);
        const M2 = Mat.Mat_rotateX(this.angle);
        const M3 = Mat.Mat_rotateY(this.angle);
        const M4 = Mat.Mat_rotateZ(this.angle);

        if (x > 0) {
            gl.uniformMatrix4fv(uModel, false, Mat.Mul2(M2, M1).getFloatArray());
        }
        else if (x == 0) {
            gl.uniformMatrix4fv(uModel, false, Mat.Mul2(M3, M1).getFloatArray());
        }
        else {
            gl.uniformMatrix4fv(uModel, false, Mat.Mul2(M4, M1).getFloatArray());
        }

        this.draw();
    }

    prepare(){
        this.prepareVertexShader();
        this.prepareFragmentShader();
        this.linkProgram();
    }

    clean() {
        const gl = this.gl;
        gl.viewport(0, 0, this.width, this.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
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

    getVerticsArray(scale, xShift) {
        const red =     [1.0, 0.0 , 0.0];
        const green =   [0.0, 1.0 , 0.0];
        const blue =    [0.0, 0.0 , 1.0];
        const white =   [1.0, 1.0 , 1.0];


        const vertices = new Float32Array(
               // Positions        Colors
            [   -1.0*scale , -1.0*scale, -1.0*scale,    ...red,
                +1.0*scale , -1.0*scale, -1.0*scale,    ...red,
                +1.0*scale , +1.0*scale, -1.0*scale,    ...red,
                -1.0*scale , +1.0*scale, -1.0*scale,    ...red,

                -1.0*scale , -1.0*scale, +1.0*scale,    ...blue,
                +1.0*scale , -1.0*scale, +1.0*scale,    ...blue,
                +1.0*scale , +1.0*scale, +1.0*scale,    ...blue,
                -1.0*scale , +1.0*scale, +1.0*scale,    ...blue,
            ]);
        return vertices;
    }

    setBufferData(){
        const gl = this.gl;
        const vertices = this.getVerticsArray(0.15, 0.25);
        const vertexBuffer = gl.createBuffer();

        const indices = new Uint8Array(
            [ 
             0,1,2,     2,3,0,//Front
             4,5,6,     4,6,7,//Back
             0,1,5,     0,5,4,//Top
             3,2,6,     3,6,7,//Bottom
             1,2,5,     5,2,6,//Left
             0,3,4,     3,4,7,//Right
             ]
            );

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

        const aPosition = gl.getAttribLocation(this.program, 'aPosition');
        const aColor = gl.getAttribLocation(this.program, 'aColor');
        const f32 = 4;

        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, f32*6, 0);
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, f32*6,  f32*3);
        gl.enableVertexAttribArray(aPosition);
        gl.enableVertexAttribArray(aColor);
    }


    draw() {
        const gl = this.gl;
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
    }


}