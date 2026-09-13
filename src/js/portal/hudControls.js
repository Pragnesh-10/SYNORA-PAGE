/**
 * Floating HUD & Testing Controls
 * Allows users to replay the F1 launch animation, test manual RPM sweeps,
 * and toggle telemetry modes.
 */

export class HudControls {
  constructor(loadingManager, tachometer, audioEngine) {
    this.loadingManager = loadingManager;
    this.tachometer = tachometer;
    this.audioEngine = audioEngine;

    this.replayBtns = document.querySelectorAll('.btn-replay-loader');
    this.hudAudioBtn = document.getElementById('hud-audio-btn');
    this.hudManualModal = document.getElementById('telemetry-test-modal');
    this.btnTestRpm = document.getElementById('btn-test-rpm');
    this.rpmSlider = document.getElementById('manual-rpm-slider');
    this.sliderRpmDisplay = document.getElementById('slider-rpm-display');
    this.btnCloseTest = document.getElementById('btn-close-test');

    this.initEvents();
  }

  initEvents() {
    // Replay Launch Loader
    this.replayBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          this.loadingManager.replay(2400);
        }, 150);
      });
    });

    // Floating HUD Audio Toggle
    if (this.hudAudioBtn) {
      this.hudAudioBtn.addEventListener('click', () => {
        this.audioEngine.toggleAudio();
        this.syncAudioButtons();
      });
    }

    // Manual RPM Test Modal & Slider
    if (this.btnTestRpm && this.hudManualModal) {
      this.btnTestRpm.addEventListener('click', () => {
        this.hudManualModal.classList.add('visible');
      });
    }

    if (this.btnCloseTest && this.hudManualModal) {
      this.btnCloseTest.addEventListener('click', () => {
        this.hudManualModal.classList.remove('visible');
      });
    }

    if (this.rpmSlider) {
      this.rpmSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (this.sliderRpmDisplay) {
          this.sliderRpmDisplay.textContent = `${val.toLocaleString()} RPM`;
        }
        
        // Temporarily override tachometer progress for testing
        const fraction = val / 16000;
        this.tachometer.setProgress(fraction, `MANUAL TEST INJECTION: ${val} RPM`);
        this.audioEngine.updateRpm(val);
      });
    }
  }

  syncAudioButtons() {
    const isMuted = this.audioEngine.isMuted;
    if (this.hudAudioBtn) {
      if (isMuted) {
        this.hudAudioBtn.classList.remove('active');
        this.hudAudioBtn.innerHTML = `<span>🔇 AUDIO FX</span>`;
      } else {
        this.hudAudioBtn.classList.add('active');
        this.hudAudioBtn.innerHTML = `<span>🔊 AUDIO: ON</span>`;
      }
    }
  }
}
