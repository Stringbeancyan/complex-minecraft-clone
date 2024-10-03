const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl');

// Set the canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Vertex shader program
const vsSource = `
    attribute vec3 coordinates;
    uniform mat4 modelViewProjectionMatrix;
    void main(void) {
        gl_Position = modelViewProjectionMatrix * vec4(coordinates, 1.0);
    }
`;

// Fragment shader program
const fsSource = `
    void main(void) {
        gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0); // Grey color for cubes
    }
`;

// Compile shader
function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Create shader program
const vertexShader = compileShader(vsSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fsSource, gl.FRAGMENT_SHADER);
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Cube vertices
const cubeVertices = new Float32Array([
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
]);

// Cube indices
const cubeIndices = new Uint16Array([
    0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7, // back
    8, 9, 10, 8, 10, 11, // top
    12, 13, 14, 12, 14, 15, // bottom
    16, 17, 18, 16, 18, 19, // right
    20, 21, 22, 20, 22, 23  // left
]);

// Create buffers
const cubeVertexBuffer = gl.createBuffer();
const cubeIndexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeIndices, gl.STATIC_DRAW);

// Draw cube function
function drawCube() {
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, 'coordinates'), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, 'coordinates'));

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
}

// Rendering loop
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    for (let x = -5; x < 5; x++) {
        for (let z = -5; z < 5; z++) {
            const modelViewProjectionMatrix = mat4.create(); // Assuming you use glMatrix for math
            mat4.translate(modelViewProjectionMatrix, modelViewProjectionMatrix, [x * 2, 0, z * 2]);
            gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, 'modelViewProjectionMatrix'), false, modelViewProjectionMatrix);
            drawCube();
        }
    }

    requestAnimationFrame(render);
}

render();
