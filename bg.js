(() => {
    // Modern Cinematic Animated Background Lights (Blue Theme)

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    Object.assign(canvas.style, {
        position: 'fixed',
        inset: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '-1',
        transition: 'opacity 0.6s cubic-bezier(.4,0,.2,1)'
    });

    let DPR = window.devicePixelRatio || 1;
    function resize() {
        DPR = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.floor(window.innerWidth * DPR));
        canvas.height = Math.max(1, Math.floor(window.innerHeight * DPR));
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    // Blue palette with saturation variations
    const LIGHT_COUNT = 10;
    const lights = [12];
    const palette = [
        { r: 11, g: 59, b: 189 },   // vivid blue
        { r: 33, g: 105, b: 205 },  // bright blue
        { r: 79, g: 137, b: 220 },  // light blue
        { r: 120, g: 170, b: 235 }  // pale blue
    ];

    function rand(min, max) { return Math.random() * (max - min) + min; }

    for (let i = 0; i < LIGHT_COUNT; i++) {
        const color = palette[i % palette.length];
        lights.push({
            x: rand(0, window.innerWidth),
            y: rand(0, window.innerHeight),
            vx: rand(-0.04, 0.04),
            vy: rand(-0.03, 0.03),
            radius: rand(window.innerWidth * 0.18, window.innerWidth * 0.32),
            color,
            alpha: rand(0.16, 0.32),
            phase: rand(0, Math.PI * 2),
            flicker: rand(0.95, 1.05)
        });
    }

    let last = performance.now();
    function draw(now) {
        const dt = (now - last) / 1000;
        last = now;

        ctx.globalAlpha = 0.92;
        ctx.fillStyle = '#224fffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        ctx.filter = 'blur(40px) brightness(1.2)';
        ctx.globalCompositeOperation = 'lighter';

        for (const l of lights) {
            l.phase += dt * rand(0.25, 0.7);
            l.x += l.vx * (60 + Math.sin(l.phase) * 30);
            l.y += l.vy * (50 + Math.cos(l.phase) * 30);

            l.flicker += rand(-0.03, 0.03);
            l.flicker = Math.max(0.92, Math.min(1.08, l.flicker));

            if (l.x < -l.radius) l.x = window.innerWidth + l.radius;
            if (l.x > window.innerWidth + l.radius) l.x = -l.radius;
            if (l.y < -l.radius) l.y = window.innerHeight + l.radius;
            if (l.y > window.innerHeight + l.radius) l.y = -l.radius;

            const grad = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.radius);
            grad.addColorStop(0, `rgba(${l.color.r},${l.color.g},${l.color.b},${l.alpha * l.flicker})`);
            grad.addColorStop(0.25, `rgba(${l.color.r},${l.color.g},${l.color.b},${l.alpha * 0.7 * l.flicker})`);
            grad.addColorStop(0.6, `rgba(${l.color.r},${l.color.g},${l.color.b},${l.alpha * 0.22 * l.flicker})`);
            grad.addColorStop(1, `rgba(${l.color.r},${l.color.g},${l.color.b},0)`);

            ctx.beginPath();
            ctx.arc(l.x, l.y, l.radius, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        }

        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'source-over';

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
})();
