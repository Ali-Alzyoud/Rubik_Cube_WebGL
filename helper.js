class Mat {
    constructor(){
        this.a11 = 1.0;
        this.a12 = 0.0;
        this.a13 = 0.0;
        this.a14 = 0.0;

        this.a21 = 0.0;
        this.a22 = 1.0;
        this.a23 = 0.0;
        this.a24 = 0.0;

        this.a31 = 0.0;
        this.a32 = 0.0;
        this.a33 = 1.0;
        this.a34 = 0.0;

        this.a41 = 0.0;
        this.a42 = 0.0;
        this.a43 = 0.0;
        this.a44 = 1.0;

        this.floatArray = null;
    }
    getFloatArray() {
        if (!this.floatArray) {
            const { 
                a11, a12, a13, a14,
                a21, a22, a23, a24,
                a31, a32, a33, a34,
                a41, a42, a43, a44,
            } = this;

            this.floatArray = new Float32Array(
                [
                    a11, a12, a13, a14,
                    a21, a22, a23, a24,
                    a31, a32, a33, a34,
                    a41, a42, a43, a44,
                ]
            );
        }

        return this.floatArray;
    }
    static Mat_Identitiy() {
        return new Mat();
    }

    static Mat_translate(x, y, z) {
        const mat = new Mat();
        mat.a14 = x;
        mat.a24 = y;
        mat.a34 = z;
        return mat;
    }

    static Mat_rotateZ(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const mat = new Mat();
        mat.a11 = cos;
        mat.a12 = sin;
        mat.a21 =-sin;
        mat.a22 = cos;
        return mat;
    }

    static Mat_rotateX(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const mat = new Mat();
        mat.a22 = cos;
        mat.a23 = sin;
        mat.a32 =-sin;
        mat.a33 = cos;
        return mat;
    }

    static Mat_rotateY(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const mat = new Mat();
        mat.a11 = cos;
        mat.a13 = sin;
        mat.a31 =-sin;
        mat.a33 = cos;
        return mat;
    }

    static Mul2(a, b){
        const mat = new Mat();
        const a11 = a.a11;
        const a12 = a.a12;
        const a13 = a.a13;
        const a14 = a.a14;
        const a21 = a.a21;
        const a22 = a.a22;
        const a23 = a.a23;
        const a24 = a.a24;
        const a31 = a.a31;
        const a32 = a.a32;
        const a33 = a.a33;
        const a34 = a.a34;
        const a41 = a.a41;
        const a42 = a.a42;
        const a43 = a.a43;
        const a44 = a.a44;
        const b11 = b.a11;
        const b12 = b.a12;
        const b13 = b.a13;
        const b14 = b.a14;
        const b21 = b.a21;
        const b22 = b.a22;
        const b23 = b.a23;
        const b24 = b.a24;
        const b31 = b.a31;
        const b32 = b.a32;
        const b33 = b.a33;
        const b34 = b.a34;
        const b41 = b.a41;
        const b42 = b.a42;
        const b43 = b.a43;
        const b44 = b.a44;
        mat.a11 = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        mat.a12 = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        mat.a13 = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        mat.a14 = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        mat.a21 = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        mat.a22 = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        mat.a23 = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        mat.a24 = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        mat.a31 = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        mat.a32 = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        mat.a33 = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        mat.a34 = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        mat.a41 = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        mat.a42 = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        mat.a43 = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        mat.a44 = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        return mat;
    }

    static Mul3(a, b, c){
        return Mat.Mul2(Mat.Mul2(a,b), c);
    }

    static Mul4(a, b, c, d){
        return Mat.Mul2(Mat.Mul2(Mat.Mul2(a,b), c), d);
    }
}