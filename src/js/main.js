/**
 * SYNORA F1 Telemetry & Hackathon Portal Coordinator
 */

import { Tachometer } from './loader/tachometer.js';
import { ShiftLights } from './loader/shiftLights.js';
import { TelemetryManager } from './loader/telemetry.js';
import { F1AudioEngine } from './loader/audioEngine.js';
import { F1CarMotion } from './loader/f1CarMotion.js';
import { LoadingManager } from './loader/loadingManager.js';
import { SynoraPortal } from './portal/portal.js';
import { HudControls } from './portal/hudControls.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize F1 Dashboard Core Components
  const tachometer = new Tachometer();
  const telemetry = new TelemetryManager();
  const audioEngine = new F1AudioEngine();

  // 2. Initialize Synora Portal
  const portal = new SynoraPortal();

  // 3. Initialize Loading Orchestrator
  const loadingManager = new LoadingManager(
    tachometer,
    null,
    telemetry,
    audioEngine,
    null,
    () => {
      console.log('🏁 SYNORA TELEMETRY: Launch sequence completed. Welcome to SYNORA 2026!');
    }
  );

  // 4. Initialize HUD & Telemetry Controls
  const hudControls = new HudControls(loadingManager, tachometer, audioEngine);

  // Expose to window for interactive debugging / test scripts
  window.SYNORA = {
    tachometer,
    telemetry,
    audioEngine,
    loadingManager,
    portal,
    hudControls
  };
});

