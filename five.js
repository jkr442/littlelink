// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set the desired size for the particles
const particleSize = 0.3; // Adjust this value to change particle size

// Create particle geometry with increased size
const particleGeometry = new THREE.SphereGeometry(particleSize, 32, 32);

// Create particle materials
const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const greyParticleMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
const darkGreyParticleMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
const orangeParticleMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
const redParticleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // New material for red particles

// Create particle systems
const numParticles = 666;
const particles = [];
const orangeParticles = [];
const darkGreyParticles = [];
const redParticles = []; // Array for red particles

// Create random initial velocities for particles
const velocities = [];
for (let i = 0; i < numParticles; i++) {
    velocities.push(new THREE.Vector3(
        Math.random() * 0.001 - 0.0005, // x (slower)
        Math.random() * 0.001 - 0.0005, // y (slower)
        Math.random() * 0.001 - 0.0005  // z (slower)
    ));
}

// Create particles for layer 1 (yellow)
for (let i = 0; i < numParticles; i++) {
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.x = Math.random() * 20 - 10;
    particle.position.y = Math.random() * 20 - 10;
    particle.position.z = Math.random() * 20 - 10;
    particles.push(particle);
    scene.add(particle);
}

// Create particles for layer 2 (orange)
for (let i = 0; i < numParticles; i++) {
    const particle = new THREE.Mesh(particleGeometry, orangeParticleMaterial);
    particle.position.x = Math.random() * 20 - 10;
    particle.position.y = Math.random() * 20 - 10;
    particle.position.z = Math.random() * 20 - 10;
    orangeParticles.push(particle);
    scene.add(particle);
}

// Create particles for layer 3 (dark grey)
for (let i = 0; i < numParticles; i++) {
    const particle = new THREE.Mesh(particleGeometry, darkGreyParticleMaterial);
    particle.position.x = Math.random() * 20 - 10;
    particle.position.y = Math.random() * 20 - 10;
    particle.position.z = Math.random() * 20 - 10;
    darkGreyParticles.push(particle);
    scene.add(particle);
}

// Create particles for layer 4 (red)
for (let i = 0; i < numParticles; i++) {
    const particle = new THREE.Mesh(particleGeometry, redParticleMaterial);
    particle.position.x = Math.random() * 20 - 10;
    particle.position.y = Math.random() * 20 - 10;
    particle.position.z = Math.random() * 20 - 10;
    redParticles.push(particle);
    scene.add(particle);
}

// Set up camera
camera.position.z = 5;

// Set up a dark grey background for the scene
scene.background = new THREE.Color(0x333333);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
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
    darkGreyParticles.forEach((particle, index) => {
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
    redParticles.forEach((particle, index) => {
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
