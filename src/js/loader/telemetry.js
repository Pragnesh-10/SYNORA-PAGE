/**
 * Telemetry Panels Manager - Exact Reference UI
 * Handles the sequential Systems Check list verification for both desktop and mobile views,
 * dynamic spinner transition, and telemetry states.
 */

export class TelemetryManager {
  constructor() {
    this.checkEngine = document.getElementById('chk-engine');
    this.checkSystems = document.getElementById('chk-systems');
    this.checkNetwork = document.getElementById('chk-network');
    this.checkAssets = document.getElementById('chk-assets');
    this.checkTrackReady = document.getElementById('chk-track-ready');
    this.spinnerTrack = document.getElementById('track-ready-spinner');
    this.markTrack = document.getElementById('track-ready-check');

    // Mobile specific indicators
    this.mCheckEngine = document.getElementById('m-chk-engine');
    this.mCheckSystems = document.getElementById('m-chk-systems');
    this.mCheckNetwork = document.getElementById('m-chk-network');
  }

  /**
   * Updates telemetry items based on loading progress (0.0 to 1.0)
   */
  update(progress) {
    const pct = progress * 100;

    // 1. Engine Check (at 20%)
    if (pct >= 20) {
      if (this.checkEngine) this.checkEngine.classList.add('verified');
      if (this.mCheckEngine) this.mCheckEngine.classList.add('verified');
    } else {
      if (this.checkEngine) this.checkEngine.classList.remove('verified');
      if (this.mCheckEngine) this.mCheckEngine.classList.remove('verified');
    }

    // 2. Systems Check (at 45%)
    if (pct >= 45) {
      if (this.checkSystems) this.checkSystems.classList.add('verified');
      if (this.mCheckSystems) this.mCheckSystems.classList.add('verified');
    } else {
      if (this.checkSystems) this.checkSystems.classList.remove('verified');
      if (this.mCheckSystems) this.mCheckSystems.classList.remove('verified');
    }

    // 3. Network Check (at 65%)
    if (pct >= 65) {
      if (this.checkNetwork) this.checkNetwork.classList.add('verified');
      if (this.mCheckNetwork) this.mCheckNetwork.classList.add('verified');
    } else {
      if (this.checkNetwork) this.checkNetwork.classList.remove('verified');
      if (this.mCheckNetwork) this.mCheckNetwork.classList.remove('verified');
    }

    // 4. Assets Check (at 85%)
    if (this.checkAssets) {
      if (pct >= 85) {
        this.checkAssets.classList.add('verified');
      } else {
        this.checkAssets.classList.remove('verified');
      }
    }

    // 5. Track Ready Check (at 98%)
    if (this.checkTrackReady) {
      if (pct >= 98) {
        this.checkTrackReady.classList.add('verified');
        if (this.spinnerTrack) this.spinnerTrack.style.display = 'none';
        if (this.markTrack) this.markTrack.style.display = 'inline-block';
      } else {
        this.checkTrackReady.classList.remove('verified');
        if (this.spinnerTrack) this.spinnerTrack.style.display = 'inline-block';
        if (this.markTrack) this.markTrack.style.display = 'none';
      }
    }
  }

  reset() {
    [this.checkEngine, this.checkSystems, this.checkNetwork, this.checkAssets, this.checkTrackReady, this.mCheckEngine, this.mCheckSystems, this.mCheckNetwork].forEach(item => {
      if (item) item.classList.remove('verified');
    });
    if (this.spinnerTrack) this.spinnerTrack.style.display = 'inline-block';
    if (this.markTrack) this.markTrack.style.display = 'none';
  }
}
