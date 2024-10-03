export const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec3 a_normal;
    uniform mat4 u_matrix;
    varying vec3 v_normal;
    void main() {
        gl_Position = u_matrix * a_position;
        v_normal = a_normal;
    }
`;

export const fragmentShaderSource = `
    precision mediump float;
    varying vec3 v_normal;
    void main() {
        vec3 lightDirection = normalize(vec3(0.5, 0.7, 1.0));
        float light = dot(v_normal, lightDirection) * 0.5 + 0.5;
        gl_FragColor = vec4(light, light, light, 1.0);
    }
`;
