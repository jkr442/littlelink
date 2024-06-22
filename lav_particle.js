document.addEventListener('DOMContentLoaded', function() {
    // Check if canvas element exists
    const canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = Math.random() * 0.2 - 0.1; // Adjust velocity for slower movement
            this.vy = Math.random() * 0.2 - 0.1; // Adjust velocity for slower movement
            this.radius = 3;
            this.baseColor = '#FFA500'; // Base color
            this.color = this.baseColor;
            this.speedLimit = 0.01; // Set speed limit
            this.gravStickiness = 1; // Grav-stickiness factor
            this.growthFactor = 0.001; // Growth factor
        }

        draw() {
            console.log("Drawing particle at", this.x, this.y);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * this.growthFactor, 0, Math.PI * 2);
            const hue = 30 + (this.radius - 2) * 20; // Adjust hue based on particle size within the desired range
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`; // Solid color based on size
            ctx.fill();
        }

        update(particles, hazeParticles) {
            console.log("Updating particle at", this.x, this.y);
            // Move particles
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off walls
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.vx = -this.vx;
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.vy = -this.vy;
            }

            // Check for collision with haze particles
            for (const hazeParticle of hazeParticles) {
                const dx = hazeParticle.x - this.x;
                const dy = hazeParticle.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < hazeParticle.radius + this.radius) {
                    // Collision detected, reverse particle's velocity
                    const normalX = dx / distance;
                    const normalY = dy / distance;
                    const overlap = this.radius + hazeParticle.radius - distance;
                    
                    this.x -= overlap * normalX;
                    this.y -= overlap * normalY;
                    
                    const dotProduct = this.vx * normalX + this.vy * normalY;
                    this.vx -= 2 * dotProduct * normalX;
                    this.vy -= 2 * dotProduct * normalY;
                }
            }

            // Apply attraction to nearby particles and calculate brightness
            let brightness = 0;
            for (const particle of particles) {
                if (particle !== this) {
                    const dx = particle.x - this.x;
                    const dy = particle.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 50) {
                        brightness += 1 - distance / 50; // Adjust brightness based on distance
                        const forceX = dx / distance;
                        const forceY = dy / distance;

                        // Adjust attraction force based on grav-stickiness
                        const gravStickinessFactor = 1 + this.gravStickiness * (1 - distance / 50);

                        this.vx += forceX * 0.01 * gravStickinessFactor; // Adjust attraction force for slower movement
                        this.vy += forceY * 0.01 * gravStickinessFactor; // Adjust attraction force for slower movement

                        particle.vx -= forceX * 0.01 * gravStickinessFactor; // Adjust attraction force for slower movement
                        particle.vy -= forceY * 0.01 * gravStickinessFactor; // Adjust attraction force for slower movement

                        // Increase growth factor
                        this.growthFactor += 0.01;

                        // Merge particles if close together for half a second
                        if (distance < this.radius + particle.radius) {
                            if (particle.radius < this.radius) {
                                this.radius += particle.radius * 0.5; // Grow by 50% of smaller particle's size
                                particles.splice(particles.indexOf(particle), 1); // Remove smaller particle
                            } else {
                                particle.radius += this.radius * 0.5; // Grow by 50% of smaller particle's size
                                particles.splice(particles.indexOf(this), 1); // Remove smaller particle
                            }
                        }
                    }
                }
            }

            // Limit brightness to a maximum value
            brightness = Math.min(brightness, 1);

            // Enforce speed limit
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy) / 20 + 10;
            if (speed > this.speedLimit) {
                const ratio = this.speedLimit / speed;
                this.vx *= ratio;
                this.vy *= ratio;
            }

            this.draw();
        }
    }

    // Create particles
    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    // Function to draw haze or smoke
    function drawHaze() {
        const hazeParticles = [];
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 1/2;

            // Calculate brightness based on proximity to particles
            let brightness = 0;
            for (const particle of particles) {
                const dx = particle.x - x;
                const dy = particle.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    brightness += 1 - distance / 100; // Adjust brightness based on distance
                }
            }
            brightness = Math.min(brightness, 1);

            // Draw haze particle with golden light effect
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, `rgba(255, 255, 0, ${brightness})`); // Golden light
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Transparent
            ctx.fillStyle = gradient;
            ctx.fill();

            hazeParticles.push({ x, y, radius });
        }
        return hazeParticles;
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw haze or smoke and get haze particles
        const hazeParticles = drawHaze();

        // Draw and update particles
        for (const particle of particles) {
            particle.update(particles, hazeParticles);
        }
    }
    
    // Reset the globalAlpha to restore full brightness for other canvas elements
    ctx.globalAlpha = 0.75;

    animate(); // Start animation loop after DOMContentLoaded
});
