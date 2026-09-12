/**
 * NOTHING - A Completely Useless Website
 * Pure Vanilla JavaScript: SPA Navigation, Rage Typing, Circle Drag & Drop, and Mystery Window
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 0. SPLASH SCREEN — Auto-dismiss after animation completes
  // ==========================================================================
  const splashEl = document.getElementById('splash-screen');

  if (splashEl) {
    // The CSS animation is 2.8s total; we remove the element just after
    // the fade-out finishes so it no longer blocks the page beneath it.
    setTimeout(() => {
      splashEl.classList.add('splash-exit');   // triggers splashFadeOut CSS
      setTimeout(() => {
        splashEl.style.display = 'none';       // fully remove from paint tree
      }, 520);                                  // slightly longer than 0.5s fade
    }, 2280);                                   // 2.8s animation × 78% hold point
  }

  // ==========================================================================
  const views = {
    landing: document.getElementById('view-landing'),
    home: document.getElementById('view-home'),
    rage: document.getElementById('view-rage'),
    circles: document.getElementById('view-circles'),
    window: document.getElementById('view-window'),
    finale: document.getElementById('view-finale')
  };

  const topNav = document.getElementById('top-nav');
  const navHomeBtn = document.getElementById('nav-home-btn');
  const navLandingBtn = document.getElementById('nav-landing-btn');

  const landingEnterBtn = document.getElementById('landing-enter-btn');
  const backToLandingBtn = document.getElementById('back-to-landing-btn');

  const cardRage = document.getElementById('card-rage');
  const cardCircles = document.getElementById('card-circles');
  const cardWindow = document.getElementById('card-window');

  /**
   * Switch between views smoothly without page reload
   * @param {string} viewKey - 'landing' | 'home' | 'rage' | 'circles' | 'window'
   */
  function switchView(viewKey) {
    // Hide all views
    Object.values(views).forEach(v => {
      if (v) v.classList.remove('active');
    });

    // Show selected view
    if (views[viewKey]) {
      views[viewKey].classList.add('active');
    }

    // Toggle navigation bar visibility
    if (viewKey === 'landing' || viewKey === 'home') {
      topNav.classList.add('hidden');
    } else {
      topNav.classList.remove('hidden');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Handle view-specific lifecycle events
    if (viewKey === 'rage') {
      const rageTextarea = document.getElementById('rage-textarea');
      setTimeout(() => rageTextarea && rageTextarea.focus(), 300);
    } else if (viewKey === 'circles') {
      resetCircleGame();
    } else if (viewKey === 'finale') {
      launchFinaleConfetti();
    }
  }

  // Navigation Event Listeners
  if (landingEnterBtn) {
    landingEnterBtn.addEventListener('click', () => switchView('home'));
  }
  if (backToLandingBtn) {
    backToLandingBtn.addEventListener('click', () => switchView('landing'));
  }
  if (navLandingBtn) {
    navLandingBtn.addEventListener('click', () => switchView('landing'));
  }
  if (navHomeBtn) {
    navHomeBtn.addEventListener('click', () => switchView('home'));
  }

  cardRage.addEventListener('click', () => switchView('rage'));
  cardCircles.addEventListener('click', () => switchView('circles'));
  cardWindow.addEventListener('click', () => switchView('window'));

  // ==========================================================================
  // 1.5 FINALE — Confetti, Start Again & Victory Modal Bridge
  // ==========================================================================
  const confettiLayer = document.getElementById('confetti-layer');
  const finaleStartAgainBtn = document.getElementById('finale-start-again-btn');

  const CONFETTI_COLORS = ['#ff3366', '#ffb703', '#00f0ff', '#7000ff', '#00ff87', '#ff758c'];

  /**
   * Burst neon confetti pieces across the screen
   * @param {number} count - number of pieces to spawn
   * @param {boolean} spreadFromCenter - throw pieces outward from screen center
   */
  function launchFinaleConfetti(count = 90, spreadFromCenter = true) {
    if (!confettiLayer) return;
    confettiLayer.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.classList.add('confetti-piece');

      const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      const size = Math.random() * 6 + 6;
      const duration = Math.random() * 2.5 + 2.5;   // 2.5s – 5s
      const delay = Math.random() * 0.6;             // staggered release
      const drift = (Math.random() - 0.5) * 220;     // horizontal scatter
      const spin = Math.random() * 900 + 360;        // rotation amount

      piece.style.left = `${Math.random() * 100}%`;
      piece.style.width = `${size}px`;
      piece.style.height = `${size * 1.6}px`;
      piece.style.background = color;
      piece.style.boxShadow = `0 0 8px ${color}66`;
      piece.style.animationDuration = `${duration}s`;
      piece.style.animationDelay = `${delay}s`;
      piece.style.setProperty('--drift', `${drift}px`);
      piece.style.setProperty('--spin', `${spin}deg`);

      confettiLayer.appendChild(piece);
    }

    // Clean the DOM once every piece has definitely landed
    const totalMs = (0.6 + 5) * 1000;
    setTimeout(() => {
      confettiLayer.innerHTML = '';
    }, totalMs);
  }

  /**
   * Restart the loop: back to the experiences hub with a confetti burst
   */
  function startAgain() {
    launchFinaleConfetti(120);
    setTimeout(() => switchView('home'), 450);
  }

  if (finaleStartAgainBtn) {
    finaleStartAgainBtn.addEventListener('click', startAgain);
  }


  // ==========================================================================
  // 2. Mini-Experience 1: Rage Typing
  // ==========================================================================
  const rageContainer = document.getElementById('rage-container');
  const rageTextarea = document.getElementById('rage-textarea');
  const rageReleaseBtn = document.getElementById('rage-release-btn');
  const rageCharCount = document.getElementById('rage-char-count');
  const rageIntensityLabel = document.getElementById('rage-intensity-label');
  const rageToast = document.getElementById('rage-toast');
  const rageParticles = document.getElementById('rage-particles');

  // Intensity labels based on typed character count
  function updateRageStats() {
    const textLength = rageTextarea.value.length;
    rageCharCount.textContent = `${textLength} characters`;

    if (textLength === 0) {
      rageIntensityLabel.textContent = 'Zen';
      rageIntensityLabel.style.color = '#94a3b8';
      rageContainer.classList.remove('hot-rage');
    } else if (textLength < 50) {
      rageIntensityLabel.textContent = 'Mildly Annoyed';
      rageIntensityLabel.style.color = '#ffb703';
      rageContainer.classList.remove('hot-rage');
    } else if (textLength < 200) {
      rageIntensityLabel.textContent = 'Raging';
      rageIntensityLabel.style.color = '#ff3366';
      rageContainer.classList.add('hot-rage');
    } else {
      rageIntensityLabel.textContent = '🔥 MAXIMUM OVER-RAGE 🔥';
      rageIntensityLabel.style.color = '#ff0033';
      rageContainer.classList.add('hot-rage');
    }
  }

  rageTextarea.addEventListener('input', updateRageStats);

  /**
   * Spawn ash/vapor particle effects bursting from the textarea
   */
  function createReleaseParticles() {
    rageParticles.innerHTML = '';
    const particleCount = 28;

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.classList.add('ash-particle');

      // Random sizes and positions
      const size = Math.random() * 8 + 4;
      const startX = Math.random() * rageContainer.clientWidth;
      const startY = Math.random() * rageContainer.clientHeight;
      const moveX = (Math.random() - 0.5) * 160;
      const moveY = -(Math.random() * 120 + 40);

      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${startX}px`;
      p.style.top = `${startY}px`;
      p.style.setProperty('--tx', `${moveX}px`);
      p.style.setProperty('--ty', `${moveY}px`);

      rageParticles.appendChild(p);
    }
  }

  let isReleasing = false;

  /**
   * RELEASE Action: Shake, vaporize, wipe memory permanently, show toast
   */
  rageReleaseBtn.addEventListener('click', () => {
    if (isReleasing) return;
    isReleasing = true;

    // Shake the container
    rageContainer.classList.add('shaking');
    rageTextarea.classList.add('vaporizing');

    // Create particle explosion
    createReleaseParticles();

    // After animation peaks: clear the text completely with zero recovery
    setTimeout(() => {
      // WIPE TEXT COMPLETELY: Never saved to localStorage, server, or memory
      rageTextarea.value = '';
      updateRageStats();

      // Remove animation classes
      rageContainer.classList.remove('shaking');
      rageTextarea.classList.remove('vaporizing');

      // Clear particles
      rageParticles.innerHTML = '';

      // Display calm toast message
      rageToast.classList.remove('hidden');
      setTimeout(() => {
        rageToast.classList.add('hidden');
      }, 3500);

      isReleasing = false;
      rageTextarea.focus();
    }, 550);
  });


  // ==========================================================================
  // 3. Mini-Experience 2: Circle Game
  // ==========================================================================
  const circleArena = document.getElementById('circle-arena');
  const targetCircle = document.getElementById('target-circle');
  const circlesRemainingLabel = document.getElementById('circles-remaining');
  const circlesWrapper = document.getElementById('draggable-circles-wrapper');
  const circlesVictoryModal = document.getElementById('circles-victory-modal');
  const circlesResetBtn = document.getElementById('circles-reset-btn');
  const circlesFinishBtn = document.getElementById('circles-finish-btn');

  const TOTAL_CIRCLES = 6;
  let remainingCirclesCount = TOTAL_CIRCLES;

  // Circle configuration colors and icons
  const circleStyles = [
    { bg: 'linear-gradient(135deg, #ff3366, #ff6b81)', emoji: '🍎', size: 64 },
    { bg: 'linear-gradient(135deg, #00f0ff, #00b4d8)', emoji: '💎', size: 60 },
    { bg: 'linear-gradient(135deg, #ffb703, #fb8500)', emoji: '⭐', size: 68 },
    { bg: 'linear-gradient(135deg, #7000ff, #aa00ff)', emoji: '🔮', size: 62 },
    { bg: 'linear-gradient(135deg, #00ff87, #60efff)', emoji: '🍀', size: 58 },
    { bg: 'linear-gradient(135deg, #ff758c, #ff7eb3)', emoji: '🌸', size: 64 }
  ];

  /**
   * Initialize or reset the circle arena with floating draggable circles
   */
  function resetCircleGame() {
    circlesVictoryModal.classList.add('hidden');
    circlesWrapper.innerHTML = '';
    remainingCirclesCount = TOTAL_CIRCLES;
    circlesRemainingLabel.textContent = remainingCirclesCount;

    const arenaWidth = circleArena.clientWidth || 800;
    const arenaHeight = circleArena.clientHeight || 450;
    const targetRect = targetCircle.getBoundingClientRect();

    circleStyles.forEach((style, index) => {
      const circle = document.createElement('div');
      circle.classList.add('draggable-circle');
      circle.style.width = `${style.size}px`;
      circle.style.height = `${style.size}px`;
      circle.style.background = style.bg;
      circle.textContent = style.emoji;

      // Calculate a safe perimeter spawn position away from the center
      let posX, posY;
      const angle = (index / TOTAL_CIRCLES) * 2 * Math.PI + 0.3;
      const radiusX = (arenaWidth / 2) - 90;
      const radiusY = (arenaHeight / 2) - 80;

      posX = (arenaWidth / 2) + Math.cos(angle) * radiusX - (style.size / 2);
      posY = (arenaHeight / 2) + Math.sin(angle) * radiusY - (style.size / 2);

      circle.style.left = `${Math.max(20, Math.min(arenaWidth - style.size - 20, posX))}px`;
      circle.style.top = `${Math.max(20, Math.min(arenaHeight - style.size - 20, posY))}px`;

      attachPointerDrag(circle);
      circlesWrapper.appendChild(circle);
    });
  }

  /**
   * Multi-touch and mouse pointer drag-and-drop mechanics
   * @param {HTMLElement} el 
   */
  function attachPointerDrag(el) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    el.addEventListener('pointerdown', (e) => {
      isDragging = true;
      el.classList.add('is-dragging');
      el.setPointerCapture(e.pointerId);

      startX = e.clientX;
      startY = e.clientY;
      initialLeft = parseFloat(el.style.left) || 0;
      initialTop = parseFloat(el.style.top) || 0;
    });

    el.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const circleW = el.offsetWidth || 60;
      const circleH = el.offsetHeight || 60;
      const arenaW = circleArena.clientWidth || 800;
      const arenaH = circleArena.clientHeight || 450;

      const newLeft = Math.max(0, Math.min(arenaW - circleW, initialLeft + deltaX));
      const newTop = Math.max(0, Math.min(arenaH - circleH, initialTop + deltaY));

      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;

      // Visual feedback on target when hovering inside
      checkHoverTarget(el);
    });

    const endDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      el.classList.remove('is-dragging');
      try {
        el.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Pointer may have already been released
      }

      // Check if dropped inside target circle
      if (isInsideTarget(el)) {
        absorbCircle(el);
      }
      targetCircle.classList.remove('hovered');
    };

    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);
  }

  /**
   * Check if a circle is currently inside the target circle's boundary
   */
  function isInsideTarget(el) {
    const arenaRect = circleArena.getBoundingClientRect();
    const circleRect = el.getBoundingClientRect();
    const targetRect = targetCircle.getBoundingClientRect();

    const circleCenterX = circleRect.left + circleRect.width / 2;
    const circleCenterY = circleRect.top + circleRect.height / 2;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    const distance = Math.hypot(circleCenterX - targetCenterX, circleCenterY - targetCenterY);
    const targetRadius = targetRect.width / 2;

    return distance < (targetRadius + 15);
  }

  function checkHoverTarget(el) {
    if (isInsideTarget(el)) {
      targetCircle.classList.add('hovered');
    } else {
      targetCircle.classList.remove('hovered');
    }
  }

  /**
   * Animate absorption and removal of a placed circle
   */
  function absorbCircle(el) {
    if (el.dataset.absorbed === 'true') return;
    el.dataset.absorbed = 'true';

    el.classList.add('popping');

    setTimeout(() => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }

      remainingCirclesCount--;
      circlesRemainingLabel.textContent = remainingCirclesCount;

      // When all circles are placed, display the funny victory message
      if (remainingCirclesCount <= 0) {
        setTimeout(() => {
          circlesVictoryModal.classList.remove('hidden');
        }, 300);
      }
    }, 320);
  }

  circlesResetBtn.addEventListener('click', resetCircleGame);

  // "Claim Reward" bridge: from circle victory modal to the grand finale
  if (circlesFinishBtn) {
    circlesFinishBtn.addEventListener('click', () => switchView('finale'));
  }


  // ==========================================================================
  // 4. Mini-Experience 3: Mystery Window
  // ==========================================================================
  const interactiveWindow = document.getElementById('interactive-window');
  const windowOpenBtn = document.getElementById('window-open-btn');
  const windowCloseBtn = document.getElementById('window-close-btn');
  const activeScenarioEl = document.getElementById('active-scenario');
  const scenarioCounterLabel = document.getElementById('scenario-counter-label');

  let isWindowOpen = false;
  let lastScenarioIndex = -1;

  // 12 Hilariously Useless Random Scenarios
  const scenarios = [
    {
      emoji: '🐦',
      title: 'The Staring Pigeon',
      desc: 'It is making unblinking, judgmental eye contact with you.',
      quote: '"...coo."'
    },
    {
      emoji: '🧱',
      title: 'A Solid Brick Wall',
      desc: 'Built exactly 2 inches from your window frame. Premium architecture.',
      quote: '"Why did you expect a view?"'
    },
    {
      emoji: '🪟',
      title: 'Window Inception',
      desc: 'You look out of the window, only to see another smaller window.',
      quote: '"It\'s windows all the way down."'
    },
    {
      emoji: '🌌',
      title: 'The Cosmic Void',
      desc: 'Pure, silent, empty infinite vacuum of space.',
      quote: '"Error 404: Purpose not found."'
    },
    {
      emoji: '👨‍🚀',
      title: 'Gerald the Astronaut',
      desc: 'Floating past holding a small yellow rubber duck.',
      quote: '"Have you seen mission control?"'
    },
    {
      emoji: '🐈‍⬛',
      title: 'The Cat Heist',
      desc: 'A black cat slowly pushing a ceramic coffee mug off a ledge.',
      quote: '"*thud* ... Oops."'
    },
    {
      emoji: '🚧',
      title: 'Sky Under Construction',
      desc: 'Two traffic cones and caution tape stretched across the clouds.',
      quote: '"Sky maintenance in progress. Check back never."'
    },
    {
      emoji: '🌾',
      title: 'The Lonely Tumbleweed',
      desc: 'Blowing across an abandoned digital wasteland with dramatic tumble.',
      quote: '"*cricket noises*"'
    },
    {
      emoji: '🌧️',
      title: 'Upside-Down Rain',
      desc: 'Raindrops falling towards the sky in complete defiance of physics.',
      quote: '"Today\'s forecast: confused."'
    },
    {
      emoji: '👀',
      title: 'The Staring Eyes',
      desc: 'Two giant cartoon eyes in the dark that blink and look away awkwardly.',
      quote: '"Nothing to see here, move along."'
    },
    {
      emoji: '⏳',
      title: 'Infinite Progress Bar',
      desc: 'A futuristic loading spinner permanently stuck at 99.9%.',
      quote: '"Estimated time remaining: 300 years."'
    },
    {
      emoji: '🪞',
      title: 'The Existential Mirror',
      desc: 'A reflection of someone staring at an open window on a useless website.',
      quote: '"Yes, that\'s literally you right now."'
    }
  ];

  /**
   * Pick and render a new random scenario
   */
  function getRandomScenario() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * scenarios.length);
    } while (newIndex === lastScenarioIndex && scenarios.length > 1);

    lastScenarioIndex = newIndex;
    const sc = scenarios[newIndex];

    activeScenarioEl.innerHTML = `
      <div class="scenario-visual">${sc.emoji}</div>
      <h4 class="scenario-title">${sc.title}</h4>
      <p class="scenario-desc">${sc.desc}</p>
      <div class="scenario-quote">${sc.quote}</div>
    `;

    scenarioCounterLabel.textContent = `Scenario ${newIndex + 1} of ${scenarios.length}`;
  }

  /**
   * Open the window shutters
   */
  function openWindow() {
    if (isWindowOpen) return;
    getRandomScenario();

    interactiveWindow.classList.add('open');
    isWindowOpen = true;

    windowOpenBtn.classList.add('hidden');
    windowCloseBtn.classList.remove('hidden');
  }

  /**
   * Close the window shutters
   */
  function closeWindow() {
    if (!isWindowOpen) return;

    interactiveWindow.classList.remove('open');
    isWindowOpen = false;

    windowCloseBtn.classList.add('hidden');
    windowOpenBtn.classList.remove('hidden');
    scenarioCounterLabel.textContent = 'Window closed. Open again for a different useless view.';
  }

  // Window Event Listeners
  windowOpenBtn.addEventListener('click', openWindow);
  windowCloseBtn.addEventListener('click', closeWindow);
  interactiveWindow.addEventListener('click', () => {
    // Clicking directly on the window toggles it as well
    if (isWindowOpen) {
      closeWindow();
    } else {
      openWindow();
    }
  });

  // Default state: prepare an initial random scenario behind closed shutters
  getRandomScenario();

});
