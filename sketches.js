// ========================================
// SKETCHES.JS - VERSIÓN MEJORADA
// Contiene 4 animaciones p5.js optimizadas
// ========================================

// Navbar scroll effect
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ========================================
// SKETCH 1: HERO - Campo de Partículas con Ondas
// ========================================
(function(exports){
  const heroSketch = function(p) {
    let circles = [];
    let waves = [];

    // ---- CONFIGURACIÓN DE PARTÍCULAS ----
    const PARTICLE_COUNT = 30;           // Cantidad de círculos (menos = mejor performance)
    const PARTICLE_SPACING = 150;         // Distancia entre círculos
    const PARTICLE_SPEED = 0.03;          // Velocidad de movimiento horizontal
    const WAVE_MOVEMENT = 180;           // Amplitud del movimiento vertical
    const BASE_SIZE = 50;                // Tamaño base de los círculos

    // ---- CONFIGURACIÓN DE ONDAS ----
    const WAVE_EXPANSION_SPEED = 3;      // Velocidad de expansión de las ondas
    const WAVE_FADE_SPEED = 3;           // Velocidad de desvanecimiento
    const WAVE_INFLUENCE_RADIUS = 180;    // Radio de influencia de la onda
    const WAVE_SCALE_EFFECT = 1.5;       // Intensidad del efecto de escala

    p.setup = function() {
      const c = p.createCanvas(p.windowWidth, 500);
      c.parent('hero-canvas');
      c.style('pointer-events', 'auto');

      // Crear partículas con colores variados en tonos azul/violeta
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        circles.push({ 
          index: i, 
          scale: 1, 
          rotation: 0, 
          hue: p.random(200, 280)  // Rango de colores (azul a violeta)
        });
      }

      p.colorMode(p.HSB, 360, 100, 100, 100);
    };

    p.draw = function() {
      p.clear();
      p.noStroke();

      // ---- ACTUALIZAR Y LIMPIAR ONDAS ----
      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.radius += WAVE_EXPANSION_SPEED;
        wave.alpha -= WAVE_FADE_SPEED;
        
        // Eliminar ondas invisibles
        if (wave.alpha <= 0) {
          waves.splice(i, 1);
        }
      }

      // ---- DIBUJAR ONDAS VISIBLES ----
      p.stroke(255, 255, 255, 30);
      p.strokeWeight(2);
      p.noFill();
      for (const wave of waves) {
        if (wave.alpha > 0) {
          p.stroke(200, 170, 100, wave.alpha);
          p.ellipse(wave.x, wave.y, wave.radius * 2);
        }
      }

      // ---- DIBUJAR CÍRCULOS CON EFECTOS ----
      p.noStroke();
      for (let i = 10; i < circles.length; i++) {
        const circle = circles[i];
        
        // Posición base con movimiento continuo
        const baseX = (i * PARTICLE_SPACING + p.frameCount * PARTICLE_SPEED) % p.width;
        const baseY = p.sin((i * 0.3) + p.frameCount * 0.015) * WAVE_MOVEMENT + p.height / 2;

        let totalScale = 1;
        let totalRotation = 0;

        // Calcular influencia de todas las ondas
        for (const wave of waves) {
          const d = p.dist(wave.x, wave.y, baseX, baseY);
          
          // Si está dentro del radio de influencia
          if (d < wave.radius && d > wave.radius - WAVE_INFLUENCE_RADIUS) {
            let influence = p.map(d, wave.radius - WAVE_INFLUENCE_RADIUS, wave.radius, 1, 0);
            influence *= p.map(wave.alpha, 0, 100, 0, 1);
            
            totalScale += influence * WAVE_SCALE_EFFECT;
            totalRotation += influence * 0.6;
          }
        }

        // Suavizar transiciones
        circle.scale = p.lerp(circle.scale, totalScale, 1.15);
        circle.rotation = p.lerp(circle.rotation, totalRotation, 0.15);

        // Dibujar círculo con efecto de doble capa
        p.push();
        p.translate(baseX, baseY);
        p.rotate(circle.rotation);

        // Variación de color animada
        const colorShift = p.sin(p.frameCount * 0.02 + i * 0.5) * 30;
        
        // Capa externa (más transparente)
        p.fill((circle.hue + colorShift) % 360, 80, 95, 35);
        const size = BASE_SIZE * circle.scale;
        p.ellipse(0, 0, size);

        // Capa interna (núcleo brillante)
        p.fill((circle.hue + colorShift) % 360, 60, 100, 80);
        p.ellipse(0, 0, size * 0.35);

        p.pop();
      }
    };

    // ---- CREAR ONDAS AL HACER CLICK ----
    p.mousePressed = function() {
      if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
        waves.push({ 
          x: p.mouseX, 
          y: p.mouseY, 
          radius: 0, 
          alpha: 100 
        });
      }
    };

    p.windowResized = function() {
      p.resizeCanvas(p.windowWidth, 500);
    };
  };

  // ========================================
  // SKETCH 2: SKILLS - Hover con Cambio de Color
  // ========================================
  const skillsSketch = function(p) {
    let circles = [];

    // ---- CONFIGURACIÓN ----
    const CIRCLE_COUNT = 16;              // Cantidad de círculos
    const CIRCLE_SPACING = 80;            // Espaciado entre círculos
    const CIRCLE_SPEED = 0.5;             // Velocidad de movimiento
    const WAVE_AMPLITUDE = 80;            // Altura de la onda
    const BASE_SIZE = 40;                 // Tamaño base
    const HOVER_SIZE = 55;                // Tamaño al hacer hover
    const HOVER_RADIUS = 45;              // Radio de detección del mouse

    p.setup = function() {
      const canvasEl = document.getElementById('skills-canvas');
      const c = p.createCanvas(canvasEl.offsetWidth, 250);
      c.parent('skills-canvas');

      // Crear círculos con colores únicos
      for (let i = 0; i < CIRCLE_COUNT; i++) {
        const base = p.color(255, 255, 255, 50);
        const hover = p.color(
          p.random(100, 255),   // R - variación de rojo
          p.random(150, 255),   // G - variación de verde
          p.random(200, 255),   // B - más azul para mantener paleta
          230
        );
        circles.push({ 
          index: i, 
          baseColor: base, 
          hoverColor: hover, 
          currentColor: base, 
          baseSize: BASE_SIZE, 
          currentSize: BASE_SIZE 
        });
      }
    };

    p.draw = function() {
      p.clear();
      p.noStroke();

      for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        
        // Calcular posición con movimiento ondulante
        const x = (i * CIRCLE_SPACING + p.frameCount * CIRCLE_SPEED) % p.width;
        const y = p.sin((i * 0.35) + p.frameCount * 0.018) * WAVE_AMPLITUDE + p.height / 2;

        // Calcular distancia al mouse
        const d = p.dist(p.mouseX, p.mouseY, x, y);

        // Aplicar efecto hover
        if (d < HOVER_RADIUS + circle.currentSize / 2) {
          circle.currentColor = p.lerpColor(circle.currentColor, circle.hoverColor, 1.2);
          circle.currentSize = p.lerp(circle.currentSize, HOVER_SIZE, 0.2);
        } else {
          circle.currentColor = p.lerpColor(circle.currentColor, circle.baseColor, 0.1);
          circle.currentSize = p.lerp(circle.currentSize, circle.baseSize, 0.1);
        }

        // Dibujar círculo
        p.fill(circle.currentColor);
        p.ellipse(x, y, circle.currentSize);
      }
    };

    p.windowResized = function() {
      const canvasEl = document.getElementById('skills-canvas');
      p.resizeCanvas(canvasEl.offsetWidth, 250);
    };
  };

  // ========================================
  // SKETCH 3: EXPERIMENTOS - "Constelación Fría"
  // ========================================
  // Partículas conectadas como estrellas, líneas suaves y colores fríos (azules/violetas).
  const experimentsSketch = function(p) {
    let particles = [];
    const PARTICLE_COUNT = 60;
    const PARTICLE_SIZE = 18;
    const CONNECTION_DIST = 140;
    const MOUSE_INFLUENCE = 100;
    // Paleta fría y elegante, tonos azul, violeta y cyan
    const COLD_COLORS = [
      [210, 60, 85],  // azul claro vibrante
      [230, 40, 70],  // azul profundo
      [255, 35, 90],  // violeta suave
      [195, 55, 80],  // cyan frío
      [265, 25, 80],  // violeta frío
      [180, 30, 75]   // azul verdoso grisáceo
    ];

    p.setup = function() {
      const canvasEl = document.getElementById('experiments-canvas');
      const c = p.createCanvas(canvasEl.offsetWidth, 300);
      c.parent('experiments-canvas');
      p.colorMode(p.HSB, 360, 100, 100, 100);

      // Inicializar partículas en posiciones aleatorias
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: p.random(p.width),
          y: p.random(p.height),
          vx: p.random(-0.5, 0.5),
          vy: p.random(-0.5, 0.5),
          colorIdx: Math.floor(p.random(COLD_COLORS.length)),
          size: p.random(PARTICLE_SIZE * 0.8, PARTICLE_SIZE * 1.2)
        });
      }
    };

    p.draw = function() {
      // Fondo azul frío suave
      p.background(220, 80, 50, 100);

      // Actualizar partículas
      for (let particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Rebote en bordes
        if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;

        // Influencia del mouse: leve repulsión
        const d = p.dist(p.mouseX, p.mouseY, particle.x, particle.y);
        if (d < MOUSE_INFLUENCE) {
          const angle = p.atan2(particle.y - p.mouseY, particle.x - p.mouseX);
          const force = p.map(d, 0, MOUSE_INFLUENCE, 0.7, 0);
          particle.vx += p.cos(angle) * force * 0.3;
          particle.vy += p.sin(angle) * force * 0.3;
        }

        // Ligeras oscilaciones
        particle.x += p.sin(p.frameCount * 0.01 + particle.x * 0.01) * 0.2;
        particle.y += p.cos(p.frameCount * 0.012 + particle.y * 0.01) * 0.2;

        // Limitar velocidad
        particle.vx = p.constrain(particle.vx, -1, 1);
        particle.vy = p.constrain(particle.vy, -1, 1);
      }

      // Dibujar conexiones entre partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = p.dist(a.x, a.y, b.x, b.y);
          if (d < CONNECTION_DIST) {
            // Color de línea frío y translúcido
            const t = p.map(d, 0, CONNECTION_DIST, 0, 1);
            const c1 = COLD_COLORS[a.colorIdx];
            const c2 = COLD_COLORS[b.colorIdx];
            const hue = p.lerp(c1[100], c2[0], t);
            const sat = p.lerp(c1[1], c2[100], t);
            const bri = p.lerp(c1[2], c2[2], t);
            const alpha = p.map(d, 0, CONNECTION_DIST, 15, 0);
            p.stroke(hue, sat, bri, alpha);
            p.strokeWeight(p.map(d, 0, CONNECTION_DIST, 2, 0.5));
            p.line(a.x, a.y, b.x, b.y);
          }
        }
      }

      // Dibujar partículas (estrellas frías)
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        // Color frío
        const c = COLD_COLORS[particle.colorIdx];
        // Brillo sutil
        const pulse = p.map(p.sin(p.frameCount * 0.03 + i), -1, 1, 0.85, 1.15);
        p.noStroke();
        p.fill(c[0], c[1], c[2], 80);
        p.ellipse(particle.x, particle.y, particle.size * pulse);

        // Halo si el mouse está cerca
        const d = p.dist(p.mouseX, p.mouseY, particle.x, particle.y);
        if (d < MOUSE_INFLUENCE * 0.7) {
          p.noFill();
          p.stroke(c[0], c[1], 100, p.map(d, 0, MOUSE_INFLUENCE * 0.7, 60, 0));
          p.strokeWeight(p.map(d, 0, MOUSE_INFLUENCE * 0.7, 5, 1));
          p.ellipse(particle.x, particle.y, particle.size * 2 + p.sin(p.frameCount * 0.2 + i) * 4);
        }
      }

      // Mensaje sutil en la esquina
      p.noStroke();
      p.fill(0, 0, 100, 130);
      p.textAlign(p.RIGHT, p.BOTTOM);
      p.textSize(10);
      p.text(":)", p.width - 12, p.height - 10);
    };

    p.windowResized = function() {
      const canvasEl = document.getElementById('experiments-canvas');
      p.resizeCanvas(canvasEl.offsetWidth, 300);
    };
  };

  // ========================================
  // SKETCH 4: INTERACTIVO - Partículas con Trail
  // ========================================
  const interactiveSketch = function(p) {
    let circles = [];
    let mouseTrail = [];

    // ---- CONFIGURACIÓN ----
    const CIRCLE_COUNT = 50;              // Cantidad de partículas
    const TRAIL_LENGTH = 40;              // Longitud del rastro del mouse
    const MOUSE_INFLUENCE = 80;          // Radio de influencia del mouse
    const MAX_SPEED = 3;                  // Velocidad máxima

    p.setup = function() {
      const canvasEl = document.getElementById('interactive-canvas');
      const c = p.createCanvas(canvasEl.offsetWidth, 350);
      c.parent('interactive-canvas');

      // Crear partículas con posiciones y velocidades aleatorias
      for (let i = 0; i < CIRCLE_COUNT; i++) {
        circles.push({ 
          x: p.random(p.width), 
          y: p.random(p.height), 
          vx: p.random(-0.5, 0.5), 
          vy: p.random(-0.5, 0.5), 
          size: p.random(25, 55), 
          hue: p.random(360) 
        });
      }

      // Paleta vibrante y moderna: tonos azul, violeta y cyan
      p.colorMode(p.HSB, 360, 100, 100, 100);
    };

    p.draw = function() {
      p.clear();

      // ---- RASTRO DEL MOUSE ----
      mouseTrail.push({ x: p.mouseX, y: p.mouseY, alpha: 100 });
      if (mouseTrail.length > TRAIL_LENGTH) mouseTrail.shift();

      // Dibujar rastro
      p.noFill();
      for (let i = 0; i < mouseTrail.length; i++) {
        const t = mouseTrail[i];
        p.stroke(2000, 80, 100, t.alpha);
        p.strokeWeight(4);
        p.point(t.x, t.y);
        t.alpha -= 5;
      }

      // ---- ACTUALIZAR Y DIBUJAR CÍRCULOS ----
      p.noStroke();
      for (const circle of circles) {
        // Movimiento básico
        circle.x += circle.vx;
        circle.y += circle.vy;

        // Rebote en bordes
        if (circle.x < 0 || circle.x > p.width) circle.vx *= -1;
        if (circle.y < 0 || circle.y > p.height) circle.vy *= -1;

        // Repulsión del mouse
        const d = p.dist(p.mouseX, p.mouseY, circle.x, circle.y);
        if (d < MOUSE_INFLUENCE) {
          const angle = p.atan2(circle.y - p.mouseY, circle.x - p.mouseX);
          const force = p.map(d, 0, MOUSE_INFLUENCE, 0.8, 0);
          circle.vx += p.cos(angle) * force;
          circle.vy += p.sin(angle) * force;
        }

        // Limitar velocidad
        circle.vx = p.constrain(circle.vx, -MAX_SPEED, MAX_SPEED);
        circle.vy = p.constrain(circle.vy, -MAX_SPEED, MAX_SPEED);

        // Color basado en proximidad al mouse
        const proximityAlpha = p.map(d, 0, 250, 100, 25);
        p.fill(circle.hue, 75, 90, proximityAlpha);
        p.ellipse(circle.x, circle.y, circle.size);
      }
    };

    p.windowResized = function() {
      const canvasEl = document.getElementById('interactive-canvas');
      p.resizeCanvas(canvasEl.offsetWidth, 350);
    };
  };

  // ========================================
  // INICIALIZAR TODOS LOS SKETCHES
  // ========================================
  new p5(heroSketch);
  new p5(skillsSketch);
  new p5(experimentsSketch);
  new p5(interactiveSketch);

})(this);