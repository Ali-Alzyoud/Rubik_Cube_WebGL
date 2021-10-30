const VERTEXT_SHADER_SRC =
    `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjMatrix;


    varying   vec4 vColor;
    void main() {
        gl_Position =  uProjMatrix * uViewMatrix * aPosition ;
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
    static MOVE_DIRECTION = {
        LEFT: 0,
        RIGHT: 1,
        TOP: 2,
        BOTTOM: 3,
    };
    static MOVE_TYPE = {
        SECTOR: 0,
        SIDE: 1,
    };
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
        this.fullArray = this.getVerticsArrayFull();
        console.log(this.fullArray);

        this.angle = 0;
        this.next_angle = 0;
        this.count = 0;

        for (let i = 0; i < 27; i++) {
            this.drawCube(i);
        }
    }

    move(direction, r, c) {
        if (this.interval) return;

        if (direction == Game.MOVE_DIRECTION.LEFT || direction == Game.MOVE_DIRECTION.TOP) {
            this.next_angle = -Math.PI / 2;
        }
        else {
            this.next_angle = Math.PI / 2;
        }
        this.angle = 0;
        this.count = 0;
        let point = "X";

        this.interval = setInterval(() => {
            const gl = this.gl;

            this.clean();
            //LEFT
            for (let i = 0; i < 27; i++) {
                this.drawCube(i);
            }

            let M;
            if (direction == Game.MOVE_DIRECTION.TOP || direction == Game.MOVE_DIRECTION.BOTTOM) {
                M = Mat.Mat_rotateX(this.next_angle / 10);
                point = "Y";
            }
            else {
                M = Mat.Mat_rotateY(this.next_angle / 10);
                point = "X";
            }


            if (Math.abs(this.angle - this.next_angle) > 0.0001) {
                this.count++;
                this.angle = this.count * this.next_angle / 10;
                if (point == "X") {

                    if (c >= 0) {
                        const y = 2 - c;
                        for (let z = 0; z < 3; z++) {
                            for (let x = 0; x < 3; x++) {
                                const index = x + y * 3 + z * 9;
                                this.fullArray[index] = this.transformVerticsArray(this.fullArray[index], M);
                            }
                        }
                    }
                    else {
                        for (let y = 0; y < 3; y++)
                            for (let z = 0; z < 3; z++) {
                                for (let x = 0; x < 3; x++) {
                                    const index = x + y * 3 + z * 9;
                                    this.fullArray[index] = this.transformVerticsArray(this.fullArray[index], M);
                                }
                            }
                    }
                }
                else {
                    if (r >= 0) {
                        const x = 2 - r;
                        for (let z = 0; z < 3; z++) {
                            for (let y = 0; y < 3; y++) {
                                const index = x + y * 3 + z * 9;
                                this.fullArray[index] = this.transformVerticsArray(this.fullArray[index], M);
                            }
                        }
                    } else {
                        for (let x = 0; x < 3; x++) {
                            for (let z = 0; z < 3; z++) {
                                for (let y = 0; y < 3; y++) {
                                    const index = x + y * 3 + z * 9;
                                    this.fullArray[index] = this.transformVerticsArray(this.fullArray[index], M);
                                }
                            }
                        }
                    }
                }
            } else {
                //Change cubes positions
                clearInterval(this.interval);


                const index = [];
                const array = [...this.fullArray];
                for (let i = 0; i < 27; i++) {
                    index.push(this.centerToIndex(this.getCenterXYZ(this.fullArray[i])));
                }


                for (let j = 0; j < 27; j++) {
                    for (let i = j; i < 27; i++) {
                        if (i == j) continue;
                        if (index[i] < index[j]) {
                            const temp2 = array[i];
                            array[i] = array[j];
                            array[j] = temp2;

                            const temp = index[i];
                            index[i] = index[j];
                            index[j] = temp;

                        }
                    }
                }

                this.fullArray = array;

                for (let i = 0; i < 27; i++) {
                    console.log(index[i]);
                }

                for (let i = 0; i < 27; i++) {
                    this.drawCube(i);
                }
                this.interval = null;
            }
        }
            , 50);

    }

    drawCube(index) {
        this.setBufferData(index);
        this.draw();
    }

    prepare() {
        this.prepareVertexShader();
        this.prepareFragmentShader();
        this.linkProgram();
    }

    clean() {
        const gl = this.gl;
        gl.viewport(0, 0, this.width, this.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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

    getVerticsArray(scale, transform) {
        const red = [1.0, 0.0, 0.0];
        const blue = [0.0, 0.0, 1.0];
        const green = [0.0, 1.0, 0.0];
        const yellow = [1.0, 1.0, 0.0];
        const orange = [1.0, 0.65, 0.0];
        const white = [1.0, 1.0, 1.0];


        const vertices = new Float32Array([
            // Positions        Colors

            //Back
            ...Mat.Mul_M_V_t(transform, [-1.0 * scale, -1.0 * scale, -1.0 * scale, 1.0]), ...red,
            ...Mat.Mul_M_V_t(transform, [+1.0 * scale, -1.0 * scale, -1.0 * scale, 1.0]), ...red,
            ...Mat.Mul_M_V_t(transform, [+1.0 * scale, +1.0 * scale, -1.0 * scale, 1.0]), ...red,
            ...Mat.Mul_M_V_t(transform, [-1.0 * scale, +1.0 * scale, -1.0 * scale, 1.0]), ...red,

            //Front
            ...Mat.Mul_M_V_t(transform, [-1.0 * scale, -1.0 * scale, +1.0 * scale, 1.0]), ...blue,
            ...Mat.Mul_M_V_t(transform, [+1.0 * scale, -1.0 * scale, +1.0 * scale, 1.0]), ...blue,
            ...Mat.Mul_M_V_t(transform, [+1.0 * scale, +1.0 * scale, +1.0 * scale, 1.0]), ...blue,
            ...Mat.Mul_M_V_t(transform, [-1.0 * scale, +1.0 * scale, +1.0 * scale, 1.0]), ...blue,

            //Top
            ...Mat.Mul_M_V_t(transform, [-1.0 * scale, +1.0 * scale, -1.0 * scale, 1.0]), ...green,
            ...Mat.Mul_M_V_t(transform, [+1.0 * scale, +1.0 * scale, -1.0 * scale, 1.0]), ...green,
            ...Mat.Mul_M_V_t(transform, [+1.0 * scale, +1.0 * scale, +1.0 * scale, 1.0]), ...green,
            ...Mat.Mul_M_V_t(transform, [-1.0 * scale, +1.0 * scale, +1.0 * scale, 1.0]), ...green,

            //Bottom
            ...Mat.Mul_M_V_t(transform, [-1.0 * scale, -1.0 * scale, -1.0 * scale, 1.0]), ...white,
            ...Mat.Mul_M_V_t(transform, [+1.0 * scale, -1.0 * scale, -1.0 * scale, 1.0]), ...white,
            ...Mat.Mul_M_V_t(transform, [+1.0 * scale, -1.0 * scale, +1.0 * scale, 1.0]), ...white,
            ...Mat.Mul_M_V_t(transform, [-1.0 * scale, -1.0 * scale, +1.0 * scale, 1.0]), ...white,


            //Left
            ...Mat.Mul_M_V_t(transform, [-1.0 * scale, -1.0 * scale, -1.0 * scale, 1.0]), ...yellow,
            ...Mat.Mul_M_V_t(transform, [-1.0 * scale, +1.0 * scale, -1.0 * scale, 1.0]), ...yellow,
            ...Mat.Mul_M_V_t(transform, [-1.0 * scale, +1.0 * scale, +1.0 * scale, 1.0]), ...yellow,
            ...Mat.Mul_M_V_t(transform, [-1.0 * scale, -1.0 * scale, +1.0 * scale, 1.0]), ...yellow,

            //Right
            ...Mat.Mul_M_V_t(transform, [+1.0 * scale, -1.0 * scale, -1.0 * scale, 1.0]), ...orange,
            ...Mat.Mul_M_V_t(transform, [+1.0 * scale, +1.0 * scale, -1.0 * scale, 1.0]), ...orange,
            ...Mat.Mul_M_V_t(transform, [+1.0 * scale, +1.0 * scale, +1.0 * scale, 1.0]), ...orange,
            ...Mat.Mul_M_V_t(transform, [+1.0 * scale, -1.0 * scale, +1.0 * scale, 1.0]), ...orange,

        ]);
        return vertices;
    }

    getCenterXYZ(cube) {

        let minX = cube[0 + 1 * 7];
        let minY = cube[1 + 1 * 7];
        let minZ = cube[2 + 1 * 7];

        for (let i = 1; i < 7; i++) {
            if (minX > cube[0 + i * 7]) minX = cube[0 + i * 7];
            if (minY > cube[1 + i * 7]) minY = cube[1 + i * 7];
            if (minZ > cube[2 + i * 7]) minZ = cube[2 + i * 7];
        }

        return [
            Math.floor(minX / 0.50) + 1,
            Math.floor(minY / 0.50) + 1,
            Math.floor(minZ / 0.50) + 1
        ];
    }

    centerToIndex(mid) {

        let x = mid[0] + 1;;
        let y = mid[1] + 1;;
        let z = mid[2] + 1;;

        return x + y * 3 + z * 9;
    }

    transformVerticsArray(array, transform) {

        const getArray = (index) => {
            return [...Mat.Mul_M_V_t(transform, [array[index * 7 + 0], array[index * 7 + 1], array[index * 7 + 2], array[index * 7 + 3]]), array[index * 7 + 4], array[index * 7 + 5], array[index * 7 + 6]];
        }

        const vertices = new Float32Array([
            // Positions        Colors
            ...getArray(0),
            ...getArray(1),
            ...getArray(2),
            ...getArray(3),

            ...getArray(4),
            ...getArray(5),
            ...getArray(6),
            ...getArray(7),

            ...getArray(8),
            ...getArray(9),
            ...getArray(10),
            ...getArray(11),

            ...getArray(12),
            ...getArray(13),
            ...getArray(14),
            ...getArray(15),

            ...getArray(16),
            ...getArray(17),
            ...getArray(18),
            ...getArray(19),

            ...getArray(20),
            ...getArray(21),
            ...getArray(22),
            ...getArray(23),
        ]);
        return vertices;
    }

    getVerticsArrayFull() {
        const full = [];
        for (let z = 0; z < 3; z++) {
            for (let y = 0; y < 3; y++) {
                for (let x = 0; x < 3; x++) {
                    const M1 = Mat.Mat_translate((x - 1) / 2, (y - 1) / 2, (z - 1) / 2);
                    full[z * 9 + y * 3 + x] = this.getVerticsArray(0.245, M1);
                }
            }
        }
        return full;
    }

    setBufferData(index) {
        const gl = this.gl;
        const vertices = this.fullArray[index];
        const vertexBuffer = gl.createBuffer();

        const twoTri = (start) => {
            return [start + 0, start + 1, start + 2,
            start + 2, start + 3, start + 0,

            start + 4, start + 5, start + 6,
            start + 4, start + 6, start + 7
            ];
        }

        const indices = new Uint8Array(
            [
                ...twoTri(0),
                ...twoTri(8),
                ...twoTri(16),
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

        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, f32 * 7, 0);
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, f32 * 7, f32 * 4);
        gl.enableVertexAttribArray(aPosition);
        gl.enableVertexAttribArray(aColor);




        var projection = glMatrix.mat4.create();
        var view = glMatrix.mat4.create();

        glMatrix.mat4.ortho(projection, -1, 1, -1, 1, -3, 3);
        glMatrix.mat4.lookAt(view, [-0.5, -0.5, 2], [0, 0, 0], [0, 1, 0]);


        var uProj = gl.getUniformLocation(this.program, "uProjMatrix")
        gl.uniformMatrix4fv(uProj, false, projection);

        var uView = gl.getUniformLocation(this.program, "uViewMatrix")
        gl.uniformMatrix4fv(uView, false, view);
    }


    draw() {
        const gl = this.gl;
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
    }
}
