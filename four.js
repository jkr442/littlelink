// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define custom shader for glowing effect with procedural noise texture
const customVertexShader = `
    uniform float amplitude;
    attribute float size;
    attribute vec3 customColor;
    varying vec3 vColor;
    void main() {
        vColor = customColor;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const customFragmentShader = `
    uniform vec3 color;
    varying vec3 vColor;

    // Basic noise function
    float random(float x) {
        return fract(sin(x) * 43758.5453);
    }

    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = random(dot(i, vec2(12.9898, 78.233)));
        float b = random(dot(i + vec2(1.0, 0.0), vec2(12.9898, 78.233)));
        float c = random(dot(i + vec2(0.0, 1.0), vec2(12.9898, 78.233)));
        float d = random(dot(i + vec2(1.0, 1.0), vec2(12.9898, 78.233)));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
        // Create noise texture
        float n = noise(gl_PointCoord.xy * 10.0);

        // Apply noise texture to particle color
        vec3 particleColor = color * n;

        // Apply particle color to fragment
        gl_FragColor = vec4(particleColor * vColor, 1.0);
    }
`;

// Create particle geometry
const particleGeometry = new THREE.BufferGeometry();
const positions = [];
const colors = [];
const sizes = [];

// Add particles
const numParticles = 666;
for (let i = 0; i < numParticles; i++) {
    positions.push((Math.random() - 0.5) * 100);
    positions.push((Math.random() - 0.5) * 100);
    positions.push((Math.random() - 0.5) * 100);

    const color = new THREE.Color(0xffffff);
    color.setHSL(i / numParticles, 1.0, 0.5);
    colors.push(color.r, color.g, color.b);

    sizes.push(5); // Decreased particle size
}

particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
particleGeometry.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3));
particleGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

// Create particle material
const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
        amplitude: { value: 1.0 },
        color: { value: new THREE.Color(0xffa500) } // Changed particle color back to orange
    },
    vertexShader: customVertexShader,
    fragmentShader: customFragmentShader,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
});

// Create particle system
const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);

// Set up camera
camera.position.z = 100;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Move particles toward the camera
    const time = Date.now() * 0.00005;
    const particlePositions = particleGeometry.attributes.position.array;
    for (let i = 0; i < particlePositions.length; i += 3) {
        particlePositions[i] += Math.sin(time) * 0.1;
        particlePositions[i + 1] += Math.cos(time) * 0.1;
        particlePositions[i + 2] += -0.1; // Move particles slightly toward the camera
    }
    particleGeometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
}

animate();
