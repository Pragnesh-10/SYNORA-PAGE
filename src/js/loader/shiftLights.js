/**
 * F1 Shift Lights Controller
 * Manages the 15-LED steering wheel rev array (5 Green -> 5 Red -> 5 Blue)
 * with progressive illumination and redline strobe flash.
 */

export class ShiftLights {
  constructor() {
    this.barElement = document.getElementById('shift-lights-bar');
    this.lights = [];
    this.totalLights = 15;
    
    // Thresholds
    this.startRpm = 5000;
    this.maxRpm = 16000;
    this.redlineRpm = 14500;

    this.initLights();
  }

  initLights() {
    if (!this.barElement) return;

    this.lights = Array.from(this.barElement.querySelectorAll('.shift-light'));
  }

  /**
   * Updates shift lights based on current RPM
   */
  update(currentRpm) {
    if (!this.barElement || this.lights.length === 0) return;

    // Calculate how many lights to turn on
    let activeCount = 0;
    if (currentRpm > this.startRpm) {
      const fraction = (currentRpm - this.startRpm) / (this.maxRpm - this.startRpm);
      activeCount = Math.floor(fraction * this.totalLights);
      activeCount = Math.min(Math.max(activeCount, 0), this.totalLights);
    }

    this.lights.forEach((light, index) => {
      if (index < activeCount) {
        light.classList.add('active');
      } else {
        light.classList.remove('active');
      }
    });

    // Check for redline flash mode
    if (currentRpm >= this.redlineRpm) {
      this.barElement.classList.add('redline-flash');
    } else {
      this.barElement.classList.remove('redline-flash');
    }
  }

  reset() {
    if (!this.barElement) return;
    this.barElement.classList.remove('redline-flash');
    this.lights.forEach(l => l.classList.remove('active'));
  }
}
