// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create particle geometry and material
const particleGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const greyParticleMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
const orangeParticleMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });

// Create particle systems
const numParticles = 333;
const particles = [];
const greyParticles = [];
const orangeParticles = [];

// Create random initial velocities for particles
const velocities = [];
for (let i = 0; i < numParticles; i++) {
    velocities.push(new THREE.Vector3(
        Math.random() * 0.02 - 0.01, // x
        Math.random() * 0.02 - 0.01, // y
        Math.random() * 0.02 - 0.01  // z
    ));
}

// Function to generate a random position with a Gaussian distribution
function randomGaussian(min, max, sigma) {
    const u = 0, v = 0;
    let x, y, z;
    do {
        x = Math.random() * (max - min) + min;
        y = Math.random() * (max - min) + min;
        z = Math.exp(-0.5 * (Math.pow((x - u) / sigma, 2.0) + Math.pow((y - v) / sigma, 2.0))) /
            (2.0 * Math.PI * sigma * sigma);
    } while (z < Math.random()); // Rejection sampling
    return { x: x, y: y };
}

// Create particles for layer 1 (yellow)
for (let i = 0; i < numParticles; i++) {
    const position = randomGaussian(-6, 6, 2); // Adjusted for 6:13 aspect ratio
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.x = position.x;
    particle.position.y = position.y;
    particle.position.z = Math.random() * 5 - 15; // Adjusted initial z position
    particles.push(particle);
    scene.add(particle);
}

// Create particles for layer 2 (grey)
for (let i = 0; i < numParticles; i++) {
    const position = randomGaussian(-9, 9, 3); // Adjusted for 6:13 aspect ratio
    const particle = new THREE.Mesh(particleGeometry, greyParticleMaterial);
    particle.position.x = position.x;
    particle.position.y = position.y;
    particle.position.z = Math.random() * 5 - 20; // Adjusted initial z position
    greyParticles.push(particle);
    scene.add(particle);
}

// Create particles for layer 3 (orange)
for (let i = 0; i < numParticles; i++) {
    const position = randomGaussian(-12, 12, 4); // Adjusted for 6:13 aspect ratio
    const particle = new THREE.Mesh(particleGeometry, orangeParticleMaterial);
    particle.position.x = position.x;
    particle.position.y = position.y;
    particle.position.z = Math.random() * 5 - 25; // Adjusted initial z position
    orangeParticles.push(particle);
    scene.add(particle);
}

// Set up camera
camera.position.z = 50;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the entire scene around the Y-axis
    scene.rotation.y += 0.001; // Adjust the speed of rotation as needed

    particles.forEach((particle, index) => {
        // Update particle positions with assigned velocities
        particle.position.add(velocities[index]);

        // Wrap particles around the screen
        if (particle.position.x < -10) particle.position.x = 10;
        if (particle.position.x > 10) particle.position.x = -10;
        if (particle.position.y < -10) particle.position.y = 10;
        if (particle.position.y > 10) particle.position.y = -10;
        if (particle.position.z < -10) particle.position.z = 10;
        if (particle.position.z > 10) particle.position.z = -10;
    });
    greyParticles.forEach((particle, index) => {
        // Update particle positions with assigned velocities
        particle.position.add(velocities[index]);

        // Wrap particles around the screen
        if (particle.position.x < -15) particle.position.x = 15;
        if (particle.position.x > 15) particle.position.x = -15;
        if (particle.position.y < -15) particle.position.y = 15;
        if (particle.position.y > 15) particle.position.y = -15;
        if (particle.position.z < -15) particle.position.z = 15;
        if (particle.position.z > 15) particle.position.z = -15;
    });
    orangeParticles.forEach((particle, index) => {
        // Update particle positions with assigned velocities
        particle.position.add(velocities[index]);

        // Wrap particles around the screen
        if (particle.position.x < -20) particle.position.x = 20;
        if (particle.position.x > 20) particle.position.x = -20;
        if (particle.position.y < -20) particle.position.y = 20;
        if (particle.position.y > 20) particle.position.y = -20;
        if (particle.position.z < -20) particle.position.z = 20;
        if (particle.position.z > 20) particle.position.z = -20;
    });
    renderer.render(scene, camera);
}

animate();
