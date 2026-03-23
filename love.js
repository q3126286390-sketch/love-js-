<canvas id="canvas"></canvas>
// ===== 鑾峰彇 canvas =====
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ===== 鑷€傚簲灞忓箷 =====
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ===== 榧犳爣浣嶇疆 =====
let mouse = { x: null, y: null };

window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// ===== 鉂わ笍 鐢诲績褰� =====
function drawHeart(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size, y - size, x - size * 2, y + size / 2, x, y + size * 2);
    ctx.bezierCurveTo(x + size * 2, y + size / 2, x + size, y - size, x, y);
    ctx.fillStyle = "rgba(255,105,180,0.8)";
    ctx.fill();
}

// ===== 绮掑瓙绫� =====
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

        // 杈圭晫鍙嶅脊
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // 榧犳爣鍚稿紩鏁堟灉
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

// ===== 鍒濆鍖栫矑瀛� =====
let particles = [];
const PARTICLE_COUNT = 120;

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

initParticles();

// ===== 杩炵嚎鏁堟灉 =====
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

// ===== 鐐瑰嚮鐢熸垚鐖卞績鐖嗙偢 =====
window.addEventListener("click", (e) => {
    for (let i = 0; i < 12; i++) {
        particles.push(new Particle(e.x, e.y));
    }
});

// ===== 鍔ㄧ敾寰幆 =====
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
