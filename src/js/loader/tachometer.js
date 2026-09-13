/**
 * F1 Tachometer Gauge Controller - Exact Reference UI
 * Handles SVG circular dial generation, tick marks matching reference,
 * physics-based needle smoothing, and redline visual activation.
 */

export class Tachometer {
  constructor(options = {}) {
    this.maxRpm = 16000;
    this.redlineRpm = 11500;
    this.startAngle = -135; // degrees (bottom-left 0 RPM)
    this.sweepAngle = 270;  // degrees (total span to 16,000 RPM)
    
    this.currentRpm = 0;
    this.targetRpm = 0;
    this.currentAngle = this.startAngle;
    
    this.svgElement = document.getElementById('gauge-svg-exact');
    this.needleElement = document.getElementById('gauge-needle-exact');
    this.rpmDisplay = document.getElementById('exact-rpm-val');
    this.pctDisplay = document.getElementById('exact-pct-val');
    this.progressFill = document.getElementById('pill-progress-fill');
    
    this.animationFrameId = null;
    this.isRedline = false;

    this.initGaugeSvg();
    this.startAnimationLoop();
  }

  /**
   * Generates the SVG Dial Ticks, Numbers, and Glow Arcs
   */
  initGaugeSvg() {
    if (!this.svgElement) return;

    const cx = 240;
    const cy = 240;
    const outerRadius = 205;
    const tickRadius = 195;
    const textRadius = 156;

    let svgHtml = `
      <defs>
        <filter id="exactRedlineGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
    `;

    // 1. Redline Glowing Outer Arc (from 11k to 16k RPM)
    const redlineStartFraction = 11000 / this.maxRpm;
    const redlineStartDeg = this.startAngle + redlineStartFraction * this.sweepAngle;
    const redlineEndDeg = this.startAngle + this.sweepAngle;
    
    const rStartRad = (redlineStartDeg - 90) * Math.PI / 180;
    const rEndRad = (redlineEndDeg - 90) * Math.PI / 180;
    
    const rx1 = cx + (outerRadius - 2) * Math.cos(rStartRad);
    const ry1 = cy + (outerRadius - 2) * Math.sin(rStartRad);
    const rx2 = cx + (outerRadius - 2) * Math.cos(rEndRad);
    const ry2 = cy + (outerRadius - 2) * Math.sin(rEndRad);
    
    svgHtml += `
      <path d="M ${rx1} ${ry1} A ${outerRadius - 2} ${outerRadius - 2} 0 0 1 ${rx2} ${ry2}" 
            fill="none" stroke="#ff1801" stroke-width="5" stroke-linecap="round" filter="url(#exactRedlineGlow)" opacity="0.9" />
      <path d="M ${rx1} ${ry1} A ${outerRadius - 2} ${outerRadius - 2} 0 0 1 ${rx2} ${ry2}" 
            fill="none" stroke="#ff1801" stroke-width="3" stroke-linecap="round" />
    `;

    // 2. Dial Ticks and Major Numbers (0, 2, 4, 6, 8, 10, 12, 14, 16)
    const totalTicks = 80; // every 200 RPM
    for (let i = 0; i <= totalTicks; i++) {
      const rpm = (i / totalTicks) * this.maxRpm;
      const fraction = i / totalTicks;
      const angleDeg = this.startAngle + fraction * this.sweepAngle;
      const angleRad = (angleDeg - 90) * Math.PI / 180;

      const isEvenMajor = i % 10 === 0; // every 2000 RPM (0, 2, 4, 6, 8, 10, 12, 14, 16)
      const isOddMajor = i % 5 === 0 && !isEvenMajor; // every 1000 RPM (1, 3, 5, 7, 9, 11, 13, 15)
      const isMinor = !isEvenMajor && !isOddMajor;

      let tickLen = isEvenMajor ? 18 : (isOddMajor ? 12 : 7);
      let strokeWidth = isEvenMajor ? 2.5 : (isOddMajor ? 1.8 : 1);
      
      let tickColor = (rpm >= 11500) ? '#ff1801' : 'rgba(255, 255, 255, 0.7)';

      const tx1 = cx + tickRadius * Math.cos(angleRad);
      const ty1 = cy + tickRadius * Math.sin(angleRad);
      const tx2 = cx + (tickRadius - tickLen) * Math.cos(angleRad);
      const ty2 = cy + (tickRadius - tickLen) * Math.sin(angleRad);

      svgHtml += `<line x1="${tx1}" y1="${ty1}" x2="${tx2}" y2="${ty2}" stroke="${tickColor}" stroke-width="${strokeWidth}" stroke-linecap="round" />`;

      // Numbers for even major ticks (0, 2, 4, 6, 8, 10, 12, 14, 16)
      if (isEvenMajor) {
        const numVal = Math.round(rpm / 1000);
        const nx = cx + textRadius * Math.cos(angleRad);
        const ny = cy + textRadius * Math.sin(angleRad) + 5;

        const isRedNum = numVal >= 12;
        const textColor = isRedNum ? '#ff1801' : '#ffffff';

        svgHtml += `
          <text x="${nx}" y="${ny}" text-anchor="middle" font-family="'Orbitron', sans-serif" 
                font-size="16" font-weight="900" font-style="italic" fill="${textColor}">
            ${numVal}
          </text>
        `;

        // Add REDLINE label under '16'
        if (numVal === 16) {
          svgHtml += `
            <text x="${nx + 8}" y="${ny + 15}" text-anchor="middle" font-family="'Orbitron', sans-serif" 
                  font-size="8" font-weight="700" fill="#ff1801" letter-spacing="0.1em">
              REDLINE
            </text>
          `;
        }
      }
    }

    this.svgElement.innerHTML = svgHtml;
  }

  /**
   * Physics Animation Loop (Lerp + Micro Vibration at Redline)
   */
  startAnimationLoop() {
    const loop = () => {
      const diff = this.targetRpm - this.currentRpm;
      this.currentRpm += diff * 0.085;

      if (Math.abs(diff) < 2) {
        this.currentRpm = this.targetRpm;
      }

      const fraction = Math.min(Math.max(this.currentRpm / this.maxRpm, 0), 1);
      let angle = this.startAngle + fraction * this.sweepAngle;

      // Subtle needle vibration when approaching & at redline
      if (this.currentRpm >= 12000) {
        const intensity = ((this.currentRpm - 12000) / 4000) * 1.5;
        angle += (Math.random() - 0.5) * intensity;
      }

      this.currentAngle = angle;
      this.updateVisuals(this.currentRpm, fraction, angle);

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  /**
   * Updates needle rotation and DOM numbers
   */
  updateVisuals(rpm, fraction, angle) {
    if (this.needleElement) {
      this.needleElement.style.transform = `rotate(${angle}deg)`;
    }

    if (this.rpmDisplay) {
      this.rpmDisplay.textContent = Math.round(rpm).toLocaleString();
    }

    if (this.pctDisplay) {
      const pct = Math.round(fraction * 100);
      this.pctDisplay.textContent = `${pct}%`;
    }

    if (this.progressFill) {
      this.progressFill.style.width = `${(fraction * 100).toFixed(1)}%`;
    }
  }

  /**
   * Sets loading progress (0.0 to 1.0)
   */
  setProgress(progress) {
    const clamped = Math.min(Math.max(progress, 0), 1);
    this.targetRpm = clamped * this.maxRpm;
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
