/**
 * F1 Audio Engine Player & Controller
 * Plays the official authentic F1 racing car sound (wings_of_freedom-f1-racing-car-sound-430459.mp3)
 * synchronized with the tachometer RPM, loading progress, and launch sequence.
 */

export class F1AudioEngine {
  constructor() {
    this.audio = new Audio('/f1_engine_sound.mp3');
    this.audio.preload = 'auto';
    this.audio.loop = false;
    this.isMuted = false; // Unmuted by default on start
    this.isPlaying = false;
    this.hasUserInteracted = false;

    this.toggleBtn = document.getElementById('btn-audio-toggle');
    this.hudAudioBtn = document.getElementById('hud-audio-btn');

    this.initAudioSettings();
    this.initControls();
    this.setupAutoplayUnlock();
  }

  initAudioSettings() {
    this.audio.volume = 0.9;
  }

  initControls() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleAudio();
      });
    }
    if (this.hudAudioBtn) {
      this.hudAudioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleAudio();
      });
    }
  }

  /**
   * Browser security requires a user gesture before unmuted audio can play in some browsers.
   * We attach listeners across pointer, touch, keyboard, and click events so the sound starts
   * instantly the moment the user touches or interacts with the page.
   */
  setupAutoplayUnlock() {
    const unlock = () => {
      if (!this.hasUserInteracted) {
        this.hasUserInteracted = true;
        if (!this.isMuted && !this.isPlaying) {
          this.play();
        }
      }
      events.forEach(evt => window.removeEventListener(evt, unlock));
    };

    const events = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click', 'wheel'];
    events.forEach(evt => window.addEventListener(evt, unlock, { passive: true, once: true }));

    // Attempt instant autoplay right away
    this.play();
  }

  /**
   * Starts playing the F1 engine sound track immediately
   */
  play() {
    if (this.isMuted) return;

    this.audio.currentTime = 0;
    this.audio.volume = 0.9;
    
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying = true;
        this.updateButtons(true);
      }).catch(err => {
        // Autoplay policy prevented immediate playback until user touches/clicks the page
        this.isPlaying = false;
        this.updateButtons(true); // Keep button in ON state so user knows audio is enabled
      });
    }
  }

  /**
   * Stops/pauses the audio
   */
  pause() {
    this.audio.pause();
    this.isPlaying = false;
  }

  /**
   * Toggles audio Mute / Unmute
   */
  toggleAudio() {
    this.isMuted = !this.isMuted;
    this.hasUserInteracted = true;

    if (this.isMuted) {
      this.audio.pause();
      this.isPlaying = false;
      this.updateButtons(false);
    } else {
      this.audio.currentTime = 0;
      this.audio.volume = 0.9;
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.updateButtons(true);
      }).catch(() => {});
    }
  }

  /**
   * Adjusts playback rate dynamically matching the RPM
   */
  updateRpm(rpm) {
    if (this.isMuted || !this.isPlaying) return;

    // Scale playbackRate subtly between 0.85x and 1.35x based on RPM
    const rate = 0.85 + (rpm / 16000) * 0.5;
    this.audio.playbackRate = Math.min(Math.max(rate, 0.75), 1.5);
  }

  /**
   * Replays sound when launch loading is re-triggered
   */
  replay() {
    if (!this.isMuted) {
      this.audio.currentTime = 0;
      this.audio.playbackRate = 1.0;
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.updateButtons(true);
      }).catch(() => {});
    }
  }

  playBeep() {}
  playLaunchSequence() {}

  updateButtons(active) {
    const btn = document.getElementById('btn-audio-toggle');
    const hudBtn = document.getElementById('hud-audio-btn');

    if (btn) {
      if (active && !this.isMuted) {
        btn.classList.add('active');
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          <span>AUDIO FX: ON</span>
        `;
      } else {
        btn.classList.remove('active');
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
          <span>AUDIO FX: OFF</span>
        `;
      }
    }

    if (hudBtn) {
      if (active && !this.isMuted) {
        hudBtn.classList.add('active');
        hudBtn.innerHTML = `<span>🔊 AUDIO: ON</span>`;
      } else {
        hudBtn.classList.remove('active');
        hudBtn.innerHTML = `<span>🔇 AUDIO FX</span>`;
      }
    }
  }
}
