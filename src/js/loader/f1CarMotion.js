/**
 * F1 Car Motion & Aerodynamic Particle Controller
 * Manages the animated F1 car acceleration along the telemetry speedway,
 * titanium skid block sparks, aerodynamic wind-tunnel vortex streamlines,
 * active DRS rear wing flap, and wheel spin dynamics.
 */

export class F1CarMotion {
  constructor() {
    this.container = document.getElementById('f1-car-motion-strip');
    this.carElement = document.getElementById('f1-motion-car');
    this.canvas = document.getElementById('f1-aero-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.speedTrapVal = document.getElementById('car-speed-val');
    this.drsFlap = document.getElementById('car-drs-flap');
    this.exhaustGlow = document.getElementById('car-exhaust-flame');
    this.speedwayProgressFill = document.getElementById('speedway-progress-fill');
    
    this.particles = [];
    this.sparks = [];
    this.currentProgress = 0;
    this.targetProgress = 0;
    this.currentSpeed = 0;
    this.isLaunching = false;
    this.animationId = null;

    this.initCanvas();
    this.startMotionLoop();
  }

  initCanvas() {
    if (!this.canvas) return;

    const resize = () => {
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width * window.devicePixelRatio || window.innerWidth;
      this.canvas.height = rect.height * window.devicePixelRatio || 90;
      if (this.ctx) {
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    resize();
    window.addEventListener('resize', resize);
  }

  /**
   * Main Motion & Particle Animation Loop
   */
  startMotionLoop() {
    const loop = () => {
      // Smooth progress lerp
      this.currentProgress += (this.targetProgress - this.currentProgress) * 0.1;
      
      // Calculate realistic F1 speed (0 to 355 km/h)
      // Ease curve: explosive top end in 7th/8th gear
      const speedKmH = Math.round(Math.pow(this.currentProgress, 1.15) * 352);
      this.currentSpeed = speedKmH;

      this.updateCarPosition(this.currentProgress, speedKmH);
      this.renderAeroAndSparks(this.currentProgress, speedKmH);

      this.animationId = requestAnimationFrame(loop);
    };

    this.animationId = requestAnimationFrame(loop);
  }

  /**
   * Updates F1 car physical position along the track
   */
  updateCarPosition(progress, speed) {
    if (!this.carElement) return;

    // Track position: 0% to 92% of the speedway width
    const minLeft = 2; // %
    const maxLeft = 90; // %
    const currentLeft = minLeft + progress * (maxLeft - minLeft);

    this.carElement.style.left = `${currentLeft}%`;

    // Speed trap readout above car
    if (this.speedTrapVal) {
      this.speedTrapVal.textContent = `${speed} KM/H`;
    }

    // Speedway progress ribbon fill
    if (this.speedwayProgressFill) {
      this.speedwayProgressFill.style.width = `${Math.min(progress * 100, 100)}%`;
    }

    // DRS Flap activation (> 65% progress)
    if (this.drsFlap) {
      if (progress >= 0.65) {
        this.drsFlap.classList.add('drs-open');
      } else {
        this.drsFlap.classList.remove('drs-open');
      }
    }

    // Exhaust flame / afterburner pulse at high RPM (> 85%)
    if (this.exhaustGlow) {
      if (progress >= 0.85) {
        this.exhaustGlow.style.opacity = (0.7 + Math.random() * 0.3).toString();
        this.exhaustGlow.style.transform = `scaleX(${1 + Math.random() * 0.6})`;
      } else {
        this.exhaustGlow.style.opacity = '0';
      }
    }

    // Chassis downforce vibration at high speed
    if (speed > 260) {
      const jitterY = (Math.random() - 0.5) * 1.2;
      this.carElement.style.transform = `translateY(${jitterY}px)`;
    } else {
      this.carElement.style.transform = 'translateY(0px)';
    }
  }

  /**
   * Renders Titanium Skid Block Sparks & Wind-Tunnel Streamlines
   */
  renderAeroAndSparks(progress, speed) {
    if (!this.ctx || !this.canvas || !this.carElement) return;

    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    this.ctx.clearRect(0, 0, width, height);

    // Get current car bounding box relative to canvas
    const carRect = this.carElement.getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();
    const carX = carRect.left - canvasRect.left + carRect.width * 0.15; // rear axle position
    const carY = carRect.top - canvasRect.top + carRect.height * 0.75;  // bottom diffuser

    // 1. Generate Titanium Sparks when speed > 140 km/h
    if (speed > 140 && Math.random() < (speed / 350) * 0.85) {
      const sparkCount = Math.floor(1 + (speed / 350) * 4);
      for (let i = 0; i < sparkCount; i++) {
        this.sparks.push({
          x: carX,
          y: carY + (Math.random() - 0.5) * 4,
          vx: -(2 + Math.random() * (speed / 35)),
          vy: (Math.random() - 0.6) * 2.5,
          size: 1 + Math.random() * 2,
          life: 1.0,
          decay: 0.03 + Math.random() * 0.04,
          color: Math.random() > 0.3 ? '#ffcc00' : '#ffffff'
        });
      }
    }

    // 2. Generate Aerodynamic Streamlines (Wind tunnel trails)
    if (speed > 80 && Math.random() < 0.6) {
      this.particles.push({
        x: carX + carRect.width * 0.8,
        y: carRect.top - canvasRect.top + 8 + Math.random() * (carRect.height - 16),
        vx: -(3 + Math.random() * (speed / 30)),
        length: 15 + Math.random() * (speed / 10),
        life: 1.0,
        decay: 0.04 + Math.random() * 0.03,
        color: Math.random() > 0.4 ? 'rgba(0, 240, 255, ' : 'rgba(255, 24, 1, '
      });
    }

    // Draw and update Sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      if (s.life <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = s.life;
      this.ctx.fillStyle = s.color;
      this.ctx.shadowColor = '#ffaa00';
      this.ctx.shadowBlur = 6;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Draw and update Aero Streamlines
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.strokeStyle = `${p.color}${p.life * 0.6})`;
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x - p.length, p.y);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  /**
   * Updates target progress (0.0 to 1.0)
   */
  setProgress(progress) {
    this.targetProgress = Math.min(Math.max(progress, 0), 1.0);
  }

  /**
   * Final hyper-speed rocket launch across the finish line
   */
  triggerLaunchBlast() {
    this.isLaunching = true;
    if (this.carElement) {
      this.carElement.classList.add('car-launch-blast');
    }
  }

  reset() {
    this.currentProgress = 0;
    this.targetProgress = 0;
    this.currentSpeed = 0;
    this.isLaunching = false;
    this.particles = [];
    this.sparks = [];
    if (this.carElement) {
      this.carElement.classList.remove('car-launch-blast');
      this.carElement.style.left = '2%';
    }
  }
}
