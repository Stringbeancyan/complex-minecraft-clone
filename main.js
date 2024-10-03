const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl');

// Set the canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

// Set clear color and enable depth testing
gl.clearColor(0.5, 0.7, 1.0, 1.0); // Light blue background
gl.enable(gl.DEPTH_TEST);

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
    precision mediump float;
    void main(void) {
        gl_FragColor = vec4(0.6, 0.3, 0.1, 1.0); // Brown color for blocks
    }
`;

// Compile shader function
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

// Set up camera
let cameraPosition = [0, 5, -10];
let cameraRotation = [0, 0];

function updateCamera() {
    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, cameraPosition);
    mat4.rotateY(viewMatrix, viewMatrix, cameraRotation[1]);
    mat4.rotateX(viewMatrix, viewMatrix, cameraRotation[0]);
    return viewMatrix;
}

// Draw cube function
function drawCube() {
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, 'coordinates'), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, 'coordinates'));

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
}

// Terrain generation
function generateTerrain() {
    const terrainSize = 10;
    for (let x = -terrainSize; x < terrainSize; x++) {
        for (let z = -terrainSize; z < terrainSize; z++) {
            gl.pushMatrix();
            gl.translate(x * 2, 0, z * 2);
            drawCube();
            gl.popMatrix();
        }
    }
}

// Movement
let keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});
document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Handle player movement and jumping
let playerY = 5; // Player's vertical position
let isJumping = false;
const gravity = -0.1;
const jumpForce = 0.2;

function updatePlayer() {
    if (keys['w']) cameraPosition[2] += 0.1; // Move forward
    if (keys['s']) cameraPosition[2] -= 0.1; // Move backward
    if (keys['a']) cameraPosition[0] -= 0.1; // Move left
    if (keys['d']) cameraPosition[0] += 0.1; // Move right
    if (keys[' ']) {
        if (!isJumping) {
            isJumping = true;
            playerY += jumpForce;
        }
    }

    // Apply gravity
    if (isJumping) {
        playerY += gravity;
        if (playerY < 5) {
            playerY = 5; // Reset to ground level
            isJumping = false;
        }
    }
}

// Rendering loop
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const modelViewProjectionMatrix = mat4.create();
    
    mat4.translate(modelViewProjectionMatrix, modelViewProjectionMatrix, cameraPosition);
    mat4.translate(modelViewProjectionMatrix, modelViewProjectionMatrix, [0, playerY, 0]); // Adjust player height
    mat4.rotateY(modelViewProjectionMatrix, modelViewProjectionMatrix, cameraRotation[1]);
    mat4.rotateX(modelViewProjectionMatrix, modelViewProjectionMatrix, cameraRotation[0]);
    
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, 'modelViewProjectionMatrix'), false, modelViewProjectionMatrix);
    
    generateTerrain();
    
    updatePlayer();
    requestAnimationFrame(render);
}

// Start the render loop
render();
