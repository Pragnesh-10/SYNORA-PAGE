/**
 * SYNORA Freshers Hackathon Portal Scripts
 * Handles countdown timer, interactive hero telemetry widget,
 * track filtering, and schedule timeline highlights.
 */

export class SynoraPortal {
  constructor() {
    this.initCountdown();
    this.initHeroMiniGauge();
    this.initTrackFilters();
    this.initRegistrationModal();
  }

  /**
   * 36-Hour Hackathon Countdown Timer
   */
  initCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (!daysEl) return;

    // Set launch date: 14 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);
    targetDate.setHours(9, 0, 0, 0);

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /**
   * Hero Mini Speedometer / RPM Telemetry Widget
   */
  initHeroMiniGauge() {
    const heroRpmVal = document.getElementById('hero-rpm-val');
    const heroSpeedVal = document.getElementById('hero-speed-val');
    const heroGearVal = document.getElementById('hero-gear-val');
    const heroThrottleFill = document.getElementById('hero-throttle-fill');

    if (!heroRpmVal) return;

    let baseRpm = 11200;
    let baseSpeed = 294;

    setInterval(() => {
      // Simulate high-speed racing telemetry fluctuations
      const rpmFluctuation = Math.round((Math.sin(Date.now() * 0.003) * 600) + (Math.random() - 0.5) * 200);
      const currentRpm = Math.min(Math.max(baseRpm + rpmFluctuation, 9000), 15800);
      
      const speedFluctuation = Math.round((Math.cos(Date.now() * 0.002) * 15) + (Math.random() - 0.5) * 4);
      const currentSpeed = baseSpeed + speedFluctuation;

      const throttle = Math.round(75 + Math.sin(Date.now() * 0.004) * 22);

      if (heroRpmVal) heroRpmVal.textContent = currentRpm.toLocaleString();
      if (heroSpeedVal) heroSpeedVal.textContent = `${currentSpeed} KM/H`;
      if (heroThrottleFill) heroThrottleFill.style.width = `${throttle}%`;
      if (heroGearVal) {
        heroGearVal.textContent = currentSpeed > 280 ? '7' : '6';
      }
    }, 100);
  }

  /**
   * Track Theme Category Filtering
   */
  initTrackFilters() {
    const filterBtns = document.querySelectorAll('.track-filter-btn');
    const trackCards = document.querySelectorAll('.track-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter') || 'all';

        trackCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            setTimeout(() => { card.style.opacity = '1'; }, 20);
          } else {
            card.style.opacity = '0';
            setTimeout(() => { card.style.display = 'none'; }, 200);
          }
        });
      });
    });
  }

  /**
   * Registration Modal & Interactive Forms
   */
  initRegistrationModal() {
    const modal = document.getElementById('reg-modal');
    const openBtns = document.querySelectorAll('.btn-open-reg');
    const closeBtn = document.getElementById('btn-close-modal');
    const form = document.getElementById('hackathon-reg-form');
    const successMsg = document.getElementById('reg-success-msg');

    if (!modal) return;

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('visible');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('visible');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('visible');
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
        setTimeout(() => {
          modal.classList.remove('visible');
          setTimeout(() => {
            form.reset();
            form.style.display = 'flex';
            if (successMsg) successMsg.style.display = 'none';
          }, 400);
        }, 2500);
      });
    }
  }
}
