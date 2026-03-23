

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");




let mouse = { x: null, y: null };

window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});


function drawHeart(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size, y - size, x - size * 2, y + size / 2, x, y + size * 2);
    ctx.bezierCurveTo(x + size * 2, y + size / 2, x + size, y - size, x, y);
    ctx.fillStyle = "rgba(255,105,180,0.8)";
    ctx.fill();
}


class Particle {
    constructor(x = null, y = null) {
        this.x = x !== null ? x : Math.random() * canvas.width;
        this.y = y !== null ? y : Math.random() * canvas.height;
        this.size = Math.random() * 4 + 2;
        this.vx = Math.random() * 0.5 - 0.25;
        this.vy = Math.random() * 0.5 - 0.25;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                this.x += dx * 0.01;
                this.y += dy * 0.01;
            }
        }
    }

    draw() {
        drawHeart(this.x, this.y, this.size);
    }
}


let particles = [];
const PARTICLE_COUNT = 120;

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

initParticles();


function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let dist = dx * dx + dy * dy;

            if (dist < 8000) {
                ctx.strokeStyle = "rgba(255,182,193,0.2)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}


window.addEventListener("click", (e) => {
    for (let i = 0; i < 12; i++) {
        particles.push(new Particle(e.x, e.y));
    }
});


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    connectParticles();

    requestAnimationFrame(animate);
}

animate();
