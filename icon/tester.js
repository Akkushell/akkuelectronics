'use strict';

// Elements
const statusEl = document.getElementById('connectionStatus');
const axesList = document.getElementById('axesList');
const buttonsList = document.getElementById('buttonsList');

// Visual controls
const l1El = document.getElementById('l1');
const r1El = document.getElementById('r1');
const l2Fill = document.getElementById('l2Fill');
const r2Fill = document.getElementById('r2Fill');
const l2Val = document.getElementById('l2Val');
const r2Val = document.getElementById('r2Val');

const leftDot = document.getElementById('leftDot');
const rightDot = document.getElementById('rightDot');
const leftStick = document.getElementById('leftStick');
const rightStick = document.getElementById('rightStick');

const shareEl = document.getElementById('share');
const optionsEl = document.getElementById('options');
const psEl = document.getElementById('ps');

const dpadUp = document.getElementById('dpadUp');
const dpadDown = document.getElementById('dpadDown');
const dpadLeft = document.getElementById('dpadLeft');
const dpadRight = document.getElementById('dpadRight');

const squareEl = document.getElementById('square');
const triangleEl = document.getElementById('triangle');
const crossEl = document.getElementById('cross');
const circleEl = document.getElementById('circle');

const touchpad = document.getElementById('touchpad');
const touchpadClick = document.getElementById('touchpadClick');

// Vibration controls
const weakIntensity = document.getElementById('weakIntensity');
const strongIntensity = document.getElementById('strongIntensity');
const durationMs = document.getElementById('durationMs');
const weakOut = document.getElementById('weakOut');
const strongOut = document.getElementById('strongOut');
const pulseVibe = document.getElementById('pulseVibe');
const longVibe = document.getElementById('longVibe');
const stopVibe = document.getElementById('stopVibe');
const vibeSupport = document.getElementById('vibeSupport');

// Gamepad state
let activeIndex = null;
let rafId = null;

function getGamepads() {
  return navigator.getGamepads ? navigator.getGamepads() : [];
}

function findActiveGamepad() {
  const pads = getGamepads();
  for (let i = 0; i < pads.length; i++) {
    const gp = pads[i];
    if (gp) return { gp, index: i };
  }
  return { gp: null, index: null };
}

window.addEventListener('gamepadconnected', (e) => {
  activeIndex = e.gamepad.index;
  statusEl.textContent = `Connected: ${e.gamepad.id}`;
  statusEl.classList.add('connected');
  buildDynamicLists(e.gamepad);
  startLoop();
});

window.addEventListener('gamepaddisconnected', (e) => {
  statusEl.textContent = 'Controller disconnected';
  statusEl.classList.remove('connected');
  cancelAnimationFrame(rafId);
  activeIndex = null;
});

// Prompt user: press any key to poll
window.addEventListener('keydown', kickstart, { once: true });
window.addEventListener('mousedown', kickstart, { once: true });
function kickstart() {
  if (activeIndex == null) {
    const { gp, index } = findActiveGamepad();
    if (gp) {
      activeIndex = index;
      statusEl.textContent = `Connected: ${gp.id}`;
      statusEl.classList.add('connected');
      buildDynamicLists(gp);
      startLoop();
    } else {
      statusEl.textContent = 'No controller detected. Connect and press any button.';
    }
  }
}

function buildDynamicLists(gp) {
  // Axes
  axesList.innerHTML = '';
  gp.axes.forEach((_, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="label">Axis ${i}</span><span class="val" id="axis-${i}">0.00</span>`;
    axesList.appendChild(li);
  });

  // Buttons
  buttonsList.innerHTML = '';
  gp.buttons.forEach((_, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="label">Button ${i}</span><span class="val" id="btn-${i}">0.00</span>`;
    buttonsList.appendChild(li);
  });
}

function startLoop() {
  cancelAnimationFrame(rafId);
  const loop = () => {
    update();
    rafId = requestAnimationFrame(loop);
  };
  loop();
}

function update() {
  const pads = getGamepads();
  const gp = pads[activeIndex];
  if (!gp) return;

  // Axes update (typical mapping: 0=Lx,1=Ly,2=Rx,3=Ry)
  gp.axes.forEach((v, i) => {
    const span = document.getElementById(`axis-${i}`);
    if (span) span.textContent = v.toFixed(2);
  });

  // Sticks visual
  const lx = gp.axes[0] || 0, ly = gp.axes[1] || 0;
  const rx = gp.axes[2] || 0, ry = gp.axes[3] || 0;
  moveDot(leftDot, leftStick, lx, ly);
  moveDot(rightDot, rightStick, rx, ry);

  // Buttons
  gp.buttons.forEach((b, i) => {
    const val = typeof b === 'object' ? b.value : b;
    const pressed = typeof b === 'object' ? b.pressed : (b === 1.0);
    const span = document.getElementById(`btn-${i}`);
    if (span) span.textContent = (val || 0).toFixed(2);

    // Map selected buttons to UI
    switch(i) {
      case 4: // L1
        toggleActive(l1El, pressed);
        break;
      case 5: // R1
        toggleActive(r1El, pressed);
        break;
      case 6: // L2 analog button
        l2Fill.style.width = `${Math.round((val || 0) * 100)}%`;
        l2Val.textContent = (val || 0).toFixed(2);
        break;
      case 7: // R2
        r2Fill.style.width = `${Math.round((val || 0) * 100)}%`;
        r2Val.textContent = (val || 0).toFixed(2);
        break;
      case 8: // Share
        toggleActive(shareEl, pressed);
        break;
      case 9: // Options
        toggleActive(optionsEl, pressed);
        break;
      case 10: // L3
        leftStick.classList.toggle('active', pressed);
        break;
      case 11: // R3
        rightStick.classList.toggle('active', pressed);
        break;
      case 12: // Dpad Up
        toggleActive(dpadUp, pressed);
        break;
      case 13: // Dpad Down
        toggleActive(dpadDown, pressed);
        break;
      case 14: // Dpad Left
        toggleActive(dpadLeft, pressed);
        break;
      case 15: // Dpad Right
        toggleActive(dpadRight, pressed);
        break;
      case 16: // PS Button
        toggleActive(psEl, pressed);
        break;
      case 17: // Touchpad click (DS4/DS5)
        touchpad.classList.toggle('clicked', pressed);
        break;
      case 0: // Cross (A on standard mapping)
        toggleActive(crossEl, pressed);
        break;
      case 1: // Circle (B)
        toggleActive(circleEl, pressed);
        break;
      case 2: // Square (X)
        toggleActive(squareEl, pressed);
        break;
      case 3: // Triangle (Y)
        toggleActive(triangleEl, pressed);
        break;
      default:
        break;
    }
  });
}

function toggleActive(el, on) {
  if (!el) return;
  if (on) el.classList.add('active'); else el.classList.remove('active');
}

function moveDot(dot, stickEl, x, y) {
  // x,y in [-1,1] with up = -1; invert y for screen
  const area = stickEl.querySelector('.stick-area');
  if (!area) return;
  const rect = area.getBoundingClientRect();
  const radius = rect.width / 2 - dot.offsetWidth / 2 - 4; // padding
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const dx = cx + x * radius;
  const dy = cy + (-y) * radius;
  dot.style.left = `${dx}px`;
  dot.style.top = `${dy}px`;
}

// VIBRATION API
function getActuator(gp) {
  if (!gp) return null;
  if (gp.vibrationActuator && typeof gp.vibrationActuator.playEffect === 'function') return gp.vibrationActuator;
  if (gp.hapticActuators && gp.hapticActuators.length && typeof gp.hapticActuators[0].pulse === 'function') return gp.hapticActuators[0];
  return null;
}

function updateVibeSupport() {
  const pads = getGamepads();
  const gp = activeIndex != null ? pads[activeIndex] : null;
  const act = getActuator(gp);
  if (act && act.type) {
    vibeSupport.textContent = `Vibration support: ${act.type}`;
  } else if (act) {
    vibeSupport.textContent = 'Vibration support: available';
  } else {
    vibeSupport.textContent = 'Vibration support: not available';
  }
}

weakIntensity.addEventListener('input', () => weakOut.textContent = (+weakIntensity.value).toFixed(2));
strongIntensity.addEventListener('input', () => strongOut.textContent = (+strongIntensity.value).toFixed(2));

pulseVibe.addEventListener('click', () => playRumble(weakIntensity.value, strongIntensity.value, +durationMs.value));
longVibe.addEventListener('click', () => playRumble(weakIntensity.value, strongIntensity.value, Math.max(+durationMs.value, 1000)));
stopVibe.addEventListener('click', stopRumble);

function playRumble(weak, strong, duration) {
  const pads = getGamepads();
  const gp = activeIndex != null ? pads[activeIndex] : null;
  const act = getActuator(gp);
  if (!act) return alert('Vibration actuator not available on this controller/browser.');

  // Prefer modern dual-rumble
  if (typeof act.playEffect === 'function') {
    act.playEffect('dual-rumble', {
      duration: Math.min(Math.max(1, duration|0), 5000),
      strongMagnitude: Math.min(Math.max(0, +strong), 1),
      weakMagnitude: Math.min(Math.max(0, +weak), 1),
    });
  } else if (typeof act.pulse === 'function') {
    // Fallback (Chrome older): pulse takes (value, duration)
    act.pulse(Math.max(+strong, +weak), Math.min(Math.max(1, duration|0), 5000));
  }
}

function stopRumble() {
  const pads = getGamepads();
  const gp = activeIndex != null ? pads[activeIndex] : null;
  const act = getActuator(gp);
  if (act && typeof act.reset === 'function') act.reset();
}

setInterval(updateVibeSupport, 1000);

// Initial UI build attempt
(function init() {
  const { gp, index } = findActiveGamepad();
  if (gp) {
    activeIndex = index;
    statusEl.textContent = `Connected: ${gp.id}`;
    statusEl.classList.add('connected');
    buildDynamicLists(gp);
    startLoop();
  }
})();
