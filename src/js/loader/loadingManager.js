/**
 * Real Asset & Telemetry Loading Manager
 * Coordinates real resource loading (DOM, fonts, images, stylesheets),
 * smooth throttle curve interpolation, minimum duration guard,
 * and the F1 5-light "Lights Out" launch transition.
 */

export class LoadingManager {
  constructor(tachometer, shiftLights, telemetry, audioEngine, carMotion, onComplete) {
    this.tachometer = tachometer;
    this.shiftLights = shiftLights;
    this.telemetry = telemetry;
    this.audioEngine = audioEngine;
    this.carMotion = carMotion;
    this.onComplete = onComplete;

    this.loaderElement = document.getElementById('f1-loader');
    this.startGantry = document.getElementById('f1-start-gantry');
    this.skipBtn = document.getElementById('btn-skip-loader');
    
    this.realProgress = 0.05;
    this.displayProgress = 0;
    this.minDurationMs = 2300; // ~2.3 seconds optimal F1 launch acceleration
    this.startTime = null;
    this.isFinished = false;
    this.isLaunching = false;

    this.assetStages = [
      { threshold: 0.15, text: 'INITIALIZING ECU KERNEL...' },
      { threshold: 0.35, text: 'MOUNTING SYNORA_CORE_ENGINE.BIN' },
      { threshold: 0.55, text: 'CONFIGURING TELEMETRY BUS & SENSORS' },
      { threshold: 0.75, text: 'CHARGING ERS ENERGY CAPACITOR' },
      { threshold: 0.90, text: 'ARMING DRS & BRAKE HYDRAULICS' },
      { threshold: 1.00, text: 'TRACK STATUS: GREEN FLAG READY' }
    ];

    this.initRealLoadTracking();
    this.initSkipButton();
    this.startProgressLoop();
  }

  /**
   * Tracks real asset and page loading metrics
   */
  async initRealLoadTracking() {
    let loadedWeight = 0;
    const totalWeight = 100;

    // 1. Document Ready State (25%)
    if (document.readyState === 'complete') {
      loadedWeight += 25;
    } else {
      window.addEventListener('load', () => {
        loadedWeight += 25;
        this.realProgress = Math.max(this.realProgress, loadedWeight / totalWeight);
      }, { once: true });
    }

    // 2. Fonts Ready (30%)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        loadedWeight += 30;
        this.realProgress = Math.max(this.realProgress, loadedWeight / totalWeight);
      }).catch(() => {
        loadedWeight += 30;
      });
    } else {
      loadedWeight += 30;
    }

    // 3. Images and Stylesheets (35%)
    const images = Array.from(document.images);
    if (images.length === 0) {
      loadedWeight += 35;
    } else {
      let imgsLoaded = 0;
      images.forEach(img => {
        if (img.complete) {
          imgsLoaded++;
        } else {
          img.addEventListener('load', () => {
            imgsLoaded++;
            const imgProgress = (imgsLoaded / images.length) * 35;
            this.realProgress = Math.max(this.realProgress, (loadedWeight + imgProgress) / totalWeight);
          });
          img.addEventListener('error', () => {
            imgsLoaded++;
          });
        }
      });
      if (imgsLoaded === images.length) {
        loadedWeight += 35;
      }
    }

    // 4. Initial scripts and DOM parse (10%)
    loadedWeight += 10;
    this.realProgress = Math.max(this.realProgress, loadedWeight / totalWeight);
  }

  initSkipButton() {
    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => {
        this.skip();
      });
    }
  }

  /**
   * Main Progress Tick Loop
   */
  startProgressLoop() {
    if (this.audioEngine) {
      this.audioEngine.play();
    }

    this.startTime = null;

    const tick = (now) => {
      if (this.isFinished) return;

      if (!this.startTime) {
        this.startTime = now;
      }

      const elapsed = Math.max(0, now - this.startTime);
      const timeFraction = Math.min(elapsed / this.minDurationMs, 1.0);

      // Progressive F1 throttle acceleration curve
      const easedTime = Math.pow(timeFraction, 1.12);
      
      // Target progress merges real page progress with smooth time progression
      const targetProgress = Math.min(Math.max(this.realProgress * 0.7 + easedTime * 0.3, easedTime), 1.0);

      // Smooth step towards target
      this.displayProgress += (targetProgress - this.displayProgress) * 0.16;

      if (timeFraction >= 1.0 && Math.abs(1.0 - this.displayProgress) < 0.015) {
        this.displayProgress = 1.0;
      }

      // Update Tachometer, Telemetry, and Audio
      if (this.tachometer) {
        this.tachometer.setProgress(this.displayProgress);
        const currentRpm = this.tachometer.currentRpm;
        if (this.shiftLights) this.shiftLights.update(currentRpm);
        if (this.audioEngine) this.audioEngine.updateRpm(currentRpm);
      }

      if (this.telemetry) this.telemetry.update(this.displayProgress);
      if (this.carMotion) this.carMotion.setProgress(this.displayProgress);

      // Check for completion (elapsed >= minDuration AND displayProgress >= 0.99)
      if (timeFraction >= 1.0 && this.displayProgress >= 0.99 && !this.isLaunching) {
        this.isLaunching = true;
        this.displayProgress = 1.0;
        if (this.tachometer) this.tachometer.setProgress(1.0);
        if (this.telemetry) this.telemetry.update(1.0);
        if (this.carMotion) this.carMotion.setProgress(1.0);
        this.triggerLaunchSequence();
        return;
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  /**
   * 5-Light F1 Gantry Start Sequence & Seamless Portal Transition
   */
  triggerLaunchSequence() {
    if (this.isFinished) return;

    if (this.startGantry) {
      this.startGantry.classList.add('visible');
      const lights = Array.from(this.startGantry.querySelectorAll('.gantry-light'));

      // Sequential light up of 5 red starting lights (F1 Start Procedure)
      lights.forEach((light, i) => {
        setTimeout(() => {
          light.classList.add('lit');
          if (this.audioEngine) this.audioEngine.playBeep(950 + i * 80, 0.08);
        }, i * 160);
      });

      // After 5 lights are ON: Brief tension pause (~350ms), then LIGHTS OUT!
      const totalLightTime = lights.length * 160 + 350;
      setTimeout(() => {
        // LIGHTS OUT!
        lights.forEach(l => l.classList.remove('lit'));
        if (this.audioEngine) this.audioEngine.playLaunchSequence();

        // Trigger F1 Car Hyper-speed Blast across finish line
        if (this.carMotion) {
          this.carMotion.triggerLaunchBlast();
        }

        // High velocity dashboard launch animation
        if (this.loaderElement) {
          this.loaderElement.classList.add('launching');
          
          setTimeout(() => {
            this.loaderElement.classList.add('loader-hidden');
            this.isFinished = true;
            if (typeof this.onComplete === 'function') {
              this.onComplete();
            }
          }, 450);
        }
      }, totalLightTime);
    } else {
      // Fallback if gantry DOM is missing
      setTimeout(() => {
        if (this.carMotion) {
          this.carMotion.triggerLaunchBlast();
        }
        if (this.loaderElement) {
          this.loaderElement.classList.add('loader-hidden');
        }
        this.isFinished = true;
        if (typeof this.onComplete === 'function') {
          this.onComplete();
        }
      }, 500);
    }
  }

  /**
   * Immediate Skip
   */
  skip() {
    this.isFinished = true;
    if (this.loaderElement) {
      this.loaderElement.classList.add('loader-hidden');
    }
    if (typeof this.onComplete === 'function') {
      this.onComplete();
    }
  }

  /**
   * Replays the F1 Launch Loading Animation
   */
  replay(minDurationMs = 2300) {
    this.isFinished = false;
    this.isLaunching = false;
    this.displayProgress = 0;
    this.minDurationMs = minDurationMs;
    this.startTime = null;

    if (this.loaderElement) {
      this.loaderElement.classList.remove('loader-hidden', 'launching');
    }
    if (this.startGantry) {
      this.startGantry.classList.remove('visible');
      const lights = this.startGantry.querySelectorAll('.gantry-light');
      lights.forEach(l => l.classList.remove('lit'));
    }

    if (this.tachometer) this.tachometer.setProgress(0);
    if (this.shiftLights) this.shiftLights.reset();
    if (this.telemetry) this.telemetry.reset();
    if (this.carMotion) this.carMotion.reset();
    if (this.audioEngine) this.audioEngine.replay();

    this.startProgressLoop();
  }
}
