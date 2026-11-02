/**
 * ==============================================================================
 * BAROPHOLIO - PROJECT PRESENTATION DECK (BARO MINIMAL ARCHITECTURE STYLE)
 * High-performance card stack scroll & flip physics with Baro typography.
 * ==============================================================================
 */

(function (window, document) {
  "use strict";

  // Prevent multiple initializations
  if (window.BaroProjectDeck) return;

  var currentProjectIdx = 0;
  var currentCards = [];
  var isOpen = false;

  // Animation & Physics State
  var targetScroll = 0;
  var smoothScroll = 0;
  var dismissDistance = 640;
  var maxScroll = 0;
  var animFrameId = null;

  // Pointer / Cursor Pill State
  var mouseX = -200;
  var mouseY = -200;
  var pillX = -200;
  var pillY = -200;
  var pillHasMoved = false;

  // DOM Elements
  var overlayEl = null;
  var viewportEl = null;
  var bgIntroEl = null;
  var bgMetaEl = null;
  var bgTitleEl = null;
  var bgOrgEl = null;
  var cursorPillEl = null;
  var pillCounterEl = null;
  var btnMoreEl = null;
  var btnCloseEl = null;

  function initDeckDOM() {
    if (overlayEl) return;

    // Inject Font & Styles
    var style = document.createElement("style");
    style.id = "baro-deck-styles";
    style.textContent = `
      .bpd-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: var(--bg, #f2f0ec);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), visibility 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        font-family: var(--sans, 'Space Grotesk', 'Epilogue', -apple-system, BlinkMacSystemFont, sans-serif);
        user-select: none;
        -webkit-user-select: none;
        overflow: hidden;
      }

      .bpd-overlay.is-active {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      /* Subtle Architectural Canvas Tone */
      .bpd-overlay::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.55) 0%, rgba(240, 238, 233, 0.88) 100%);
        pointer-events: none;
        z-index: 0;
      }

      /* Top Minimalist Corner Controls: Black circle & White back button */
      .bpd-corner-controls {
        position: absolute;
        top: max(22px, env(safe-area-inset-top, 22px));
        right: max(24px, env(safe-area-inset-right, 24px));
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 100;
      }

      /* 1. Icon hình tròn màu đen (Open Full Monograph Book) */
      .bpd-corner-btn-black {
        width: 33px;
        height: 33px;
        border-radius: 50%;
        border: 1px solid #000000;
        background: #000000;
        color: #ffffff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
        transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
        outline: none;
      }

      .bpd-corner-btn-black:hover {
        transform: scale(1.08);
        box-shadow: 0 5px 16px rgba(0, 0, 0, 0.25);
      }

      .bpd-corner-btn-black:active {
        transform: scale(0.94);
      }

      .bpd-corner-btn-black:focus-visible {
        outline: 2px solid var(--accent, #c46210);
        outline-offset: 2px;
      }

      /* 2. Nút back màu trắng (Go Back / Close) */
      .bpd-corner-btn-white {
        width: 33px;
        height: 33px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.14);
        background: #ffffff;
        color: #0d0c0b;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
        transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        outline: none;
      }

      .bpd-corner-btn-white:hover {
        transform: scale(1.08);
        border-color: rgba(0, 0, 0, 0.32);
        box-shadow: 0 5px 16px rgba(0, 0, 0, 0.1);
      }

      .bpd-corner-btn-white:active {
        transform: scale(0.94);
      }

      .bpd-corner-btn-white:focus-visible {
        outline: 2px solid var(--accent, #c46210);
        outline-offset: 2px;
      }

      .bpd-corner-btn-black svg,
      .bpd-corner-btn-white svg {
        width: 14px;
        height: 14px;
        display: block;
      }

      /* Background Minimalist Intro Text (Baro Style) */
      .bpd-bg-intro {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1;
        pointer-events: none;
        text-align: center;
        padding: 0 24px;
        padding-bottom: 5vh;
        will-change: opacity, filter, transform;
        transition: filter 0.2s ease-out;
      }

      .bpd-bg-meta {
        font-family: var(--sans, 'Space Grotesk', sans-serif);
        font-size: 10.5px;
        font-weight: 600;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--accent, #c46210);
        margin-bottom: 12px;
      }

      .bpd-bg-title {
        font-family: var(--sans, 'Space Grotesk', 'Epilogue', sans-serif);
        font-size: clamp(22px, 3.2vw, 35px);
        font-weight: 600;
        line-height: 1.25;
        color: var(--fg, #0d0c0b);
        max-width: clamp(480px, 45vw, 760px);
        letter-spacing: -0.02em;
        margin: 0;
      }

      .bpd-bg-org {
        font-family: var(--sans, 'Space Grotesk', sans-serif);
        font-size: 13px;
        font-weight: 400;
        color: var(--fg-soft, rgba(13, 12, 11, 0.64));
        letter-spacing: 0.02em;
        margin-top: 10px;
      }

      /* Center Card Viewport */
      .bpd-card-viewport {
        position: relative;
        z-index: 10;
        width: min(94vw, 1260px);
        height: min(78vh, calc(min(94vw, 1260px) * 3 / 5));
        aspect-ratio: 5 / 3;
        display: flex;
        align-items: center;
        justify-content: center;
        perspective: 1200px;
        cursor: grab;
      }

      .bpd-card-viewport:active {
        cursor: grabbing;
      }

      /* Stacked Cards */
      .bpd-card {
        position: absolute;
        inset: 0;
        border-radius: clamp(8px, 1.6vw, 16px);
        border: 0.5px solid rgba(13, 12, 11, 0.08);
        box-shadow: 0 24px 56px -12px rgba(15, 14, 12, 0.14), 0 4px 14px rgba(0, 0, 0, 0.04);
        overflow: hidden;
        transform-origin: center bottom;
        background: #eae9e5;
        will-change: transform, opacity;
        user-select: none;
        touch-action: pan-y;
      }

      .bpd-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        pointer-events: none;
      }

      .bpd-card-tag {
        position: absolute;
        bottom: 16px;
        left: 20px;
        padding: 6px 14px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.72);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.85);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
        color: #0d0c0b;
        font-family: var(--sans, 'Space Grotesk', sans-serif);
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        pointer-events: none;
        display: inline-flex;
        align-items: center;
      }

      /* Closing / Overview Final Card (Glassmorphism dạng kính mờ tinh tế) */
      .bpd-card.bpd-card-summary {
        background: rgba(255, 255, 255, 0.42) !important;
        backdrop-filter: blur(28px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(28px) saturate(180%) !important;
        border: 1px solid rgba(255, 255, 255, 0.65) !important;
        box-shadow: 0 24px 60px rgba(13, 12, 11, 0.08) !important;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: clamp(24px, 4.5vw, 48px);
        cursor: default;
        user-select: text;
        -webkit-user-select: text;
        overflow: hidden;
      }

      .bpd-summary-title {
        font-family: var(--sans, 'Space Grotesk', 'Epilogue', sans-serif);
        font-size: clamp(17px, 2.2vw, 24px);
        font-weight: 600;
        line-height: 1.3;
        color: var(--fg, #0d0c0b);
        margin: 0 0 14px;
        max-width: 620px;
        letter-spacing: -0.015em;
        text-align: center;
      }

      /* Script & Description Container */
      .bpd-script-wrap {
        width: 100%;
        max-width: 620px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .bpd-script-content {
        font-family: var(--sans, 'Space Grotesk', 'Inter', sans-serif);
        font-size: clamp(12px, 1.1vw, 13.5px);
        font-weight: 400;
        line-height: 1.62;
        color: var(--fg-soft, rgba(13, 12, 11, 0.72));
        text-align: center;
        width: 100%;
        max-height: 140px;
        overflow-y: hidden;
        transition: max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        padding: 0 4px;
      }

      .bpd-script-content.is-expanded {
        max-height: calc(70vh - 120px);
        overflow-y: auto;
        text-align: left;
        padding: 0 12px 10px;
        scrollbar-width: thin;
        scrollbar-color: rgba(13, 12, 11, 0.25) transparent;
      }

      .bpd-script-content::-webkit-scrollbar {
        width: 4px;
      }
      .bpd-script-content::-webkit-scrollbar-thumb {
        background: rgba(13, 12, 11, 0.25);
        border-radius: 4px;
      }

      /* Toggle Button (< / >) */
      .bpd-script-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        font-family: var(--sans, 'Space Grotesk', sans-serif);
        font-size: 13px;
        font-weight: 700;
        color: var(--accent, #c46210);
        cursor: pointer;
        padding: 0 6px;
        margin-left: 2px;
        line-height: 1;
        transition: transform 0.2s ease, color 0.2s ease;
        vertical-align: baseline;
      }

      .bpd-script-toggle:hover {
        color: #0d0c0b;
        transform: scale(1.25);
      }

      /* Floating Cursor Pill (Minimalist, doesn't block text or buttons) */
      .bpd-cursor-pill {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
        pointer-events: none;
        will-change: transform, opacity;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .bpd-cursor-pill.is-visible {
        opacity: 1;
      }

      .bpd-pill-inner {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 5px 12px;
        border-radius: 20px;
        background: rgba(15, 14, 13, 0.78);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        color: #ffffff;
        font-family: var(--sans, 'Space Grotesk', sans-serif);
        font-size: 11.5px;
        font-weight: 500;
        line-height: 1;
        white-space: nowrap;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
        border: 0.5px solid rgba(255, 255, 255, 0.16);
        transform: translate3d(16px, 16px, 0);
      }

      .bpd-pill-brand {
        font-weight: 600;
        letter-spacing: 0.04em;
      }

      .bpd-pill-sep {
        opacity: 0.35;
      }

      .bpd-pill-counter {
        opacity: 0.88;
        font-variant-numeric: tabular-nums;
      }

      .bpd-pill-hint {
        opacity: 0.5;
        font-size: 10px;
        margin-left: 1px;
      }

      /* Mobile Optimizations */
      @media (max-width: 768px) {
        .bpd-cursor-pill {
          display: none !important;
        }
        .bpd-card-viewport {
          width: 92vw;
          height: auto;
          aspect-ratio: 4 / 3;
        }
        .bpd-bg-title {
          font-size: 20px;
          padding: 0 10px;
        }
        .bpd-corner-controls {
          top: 16px;
          right: 16px;
        }
      }
    `;
    document.head.appendChild(style);

    // Build DOM structure
    overlayEl = document.createElement("div");
    overlayEl.className = "bpd-overlay";
    overlayEl.id = "baroProjectDeck";
    overlayEl.setAttribute("role", "dialog");
    overlayEl.setAttribute("aria-modal", "true");
    overlayEl.setAttribute("aria-label", "Baro Project Deck");

    overlayEl.innerHTML = `
      <!-- Top Corner Controls: Icon hình tròn màu đen & Nút back màu trắng (Không text, tinh tế) -->
      <div class="bpd-corner-controls">
        <button class="bpd-corner-btn-black" id="bpdBtnMore" type="button" aria-label="View Full Monograph Book" title="View Full Monograph Book">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="3.5" fill="currentColor"/><circle cx="12" cy="12" r="8"/></svg>
        </button>
        <button class="bpd-corner-btn-white" id="bpdBtnClose" type="button" aria-label="Back to 3D Sphere" title="Back [ESC]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
      </div>

      <!-- Background Subtle Intro (Baro Style) -->
      <div class="bpd-bg-intro" id="bpdBgIntro">
        <span class="bpd-bg-meta" id="bpdBgMeta">ARCHIVE RECORD</span>
        <h1 class="bpd-bg-title" id="bpdBgTitle">Baro Nguyen — Architectural & Spatial Archive</h1>
        <p class="bpd-bg-org" id="bpdBgOrg">Baropholio Monograph</p>
      </div>

      <!-- Center Card Stack Viewport -->
      <div class="bpd-card-viewport" id="bpdCardViewport">
        <!-- Cards dynamically injected -->
      </div>

      <!-- Floating Cursor Pill (Minimalist, doesn't overlap text) -->
      <div class="bpd-cursor-pill" id="bpdCursorPill" aria-hidden="true">
        <div class="bpd-pill-inner">
          <span class="bpd-pill-brand">Baro</span>
          <span class="bpd-pill-sep">•</span>
          <span class="bpd-pill-counter" id="bpdPillCounter">01 / 04</span>
          <span class="bpd-pill-hint">Scroll / Click</span>
        </div>
      </div>
    `;

    document.body.appendChild(overlayEl);

    viewportEl = document.getElementById("bpdCardViewport");
    bgIntroEl = document.getElementById("bpdBgIntro");
    bgMetaEl = document.getElementById("bpdBgMeta");
    bgTitleEl = document.getElementById("bpdBgTitle");
    bgOrgEl = document.getElementById("bpdBgOrg");
    cursorPillEl = document.getElementById("bpdCursorPill");
    pillCounterEl = document.getElementById("bpdPillCounter");
    btnMoreEl = document.getElementById("bpdBtnMore");
    btnCloseEl = document.getElementById("bpdBtnClose");

    setupEvents();
  }

  function setupEvents() {
    // 1. Black Circle Button -> View Full Project Showcase (HW-6890 + Hanbury clone)
    if (btnMoreEl) {
      btnMoreEl.addEventListener("click", function (e) {
        e.stopPropagation();
        var idx = currentProjectIdx;
        closeDeck();
        if (typeof window.openBook === "function") {
          window.openBook(idx);
        } else if (typeof window.openBaroProjectShowcase === "function") {
          window.openBaroProjectShowcase(idx);
        }
      });
    }

    // 2. White Back Button -> Back to 3D Sphere
    if (btnCloseEl) {
      btnCloseEl.addEventListener("click", function (e) {
        e.stopPropagation();
        closeDeck();
      });
    }

    // Escape key
    window.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") {
        closeDeck();
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        flipToNext();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        flipToPrev();
      }
    });

    // Pointer move for Floating Cursor Pill
    window.addEventListener("pointermove", function (e) {
      if (!isOpen) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!pillHasMoved) {
        pillX = mouseX;
        pillY = mouseY;
        pillHasMoved = true;
      }

      // Check if cursor is near the corner controls or if currently on summary card
      var isNearTopRight = mouseX > window.innerWidth - 130 && mouseY < 85;
      var activeIdx = Math.min(currentCards.length - 1, Math.max(0, Math.floor(smoothScroll / dismissDistance)));
      var isAtSummaryCard = (activeIdx === currentCards.length - 1);

      if (cursorPillEl) {
        if (isNearTopRight || isAtSummaryCard) {
          cursorPillEl.classList.remove("is-visible");
        } else {
          cursorPillEl.classList.add("is-visible");
        }
      }
    }, { passive: true });

    // Wheel Scroll (Physics)
    if (overlayEl) {
      overlayEl.addEventListener("wheel", function (e) {
        if (!isOpen) return;
        e.preventDefault();
        targetScroll += e.deltaY * 1.35;
        targetScroll = Math.max(0, Math.min(maxScroll, targetScroll));
      }, { passive: false });
    }

    // Touch Drag (Mobile)
    var touchStartY = 0;
    var touchStartScroll = 0;
    var isTouching = false;

    if (overlayEl) {
      overlayEl.addEventListener("touchstart", function (e) {
        if (!isOpen) return;
        if (e.target.closest("button") || e.target.closest("a") || e.target.closest(".bpd-script-content")) return;
        isTouching = true;
        touchStartY = e.touches[0].clientY;
        touchStartScroll = targetScroll;
      }, { passive: true });

      overlayEl.addEventListener("touchmove", function (e) {
        if (!isOpen || !isTouching) return;
        var diff = touchStartY - e.touches[0].clientY;
        targetScroll = Math.max(0, Math.min(maxScroll, touchStartScroll + diff * 1.8));
      }, { passive: false });

      overlayEl.addEventListener("touchend", function () {
        isTouching = false;
      }, { passive: true });
    }

    // Click on Card Viewport to flip next / rewind
    if (viewportEl) {
      viewportEl.addEventListener("click", function (e) {
        if (!isOpen) return;
        // Don't flip when clicking inside script text, toggle button, or corner buttons
        if (e.target.closest(".bpd-script-wrap") || e.target.closest(".bpd-script-toggle") || e.target.closest("a") || e.target.closest(".bpd-corner-btn-black") || e.target.closest(".bpd-corner-btn-white")) {
          return;
        }
        var rect = viewportEl.getBoundingClientRect();
        var clickX = e.clientX - rect.left;
        if (clickX < rect.width * 0.25) {
          flipToPrev();
        } else {
          flipToNext();
        }
      });
    }
  }

  function flipToNext() {
    if (targetScroll >= maxScroll - 10) {
      // Loop back to start smoothly
      targetScroll = 0;
    } else {
      var nextStep = Math.floor(targetScroll / dismissDistance) + 1;
      targetScroll = Math.min(maxScroll, nextStep * dismissDistance);
    }
  }

  function flipToPrev() {
    var prevStep = Math.ceil(targetScroll / dismissDistance) - 1;
    targetScroll = Math.max(0, prevStep * dismissDistance);
  }

  // Animation Loop (Spring Lerp Physics)
  function renderLoop() {
    if (!isOpen) return;

    // Smooth scroll interpolation
    smoothScroll += (targetScroll - smoothScroll) * 0.15;
    if (Math.abs(targetScroll - smoothScroll) < 0.1) {
      smoothScroll = targetScroll;
    }

    // Cursor Pill smooth trailing (Spring Lerp)
    pillX += (mouseX - pillX) * 0.22;
    pillY += (mouseY - pillY) * 0.22;
    if (cursorPillEl) {
      cursorPillEl.style.transform = "translate3d(" + pillX + "px, " + pillY + "px, 0)";
    }

    // Background Title blur and fade
    var bgProgress = Math.min(1, Math.max(0, smoothScroll / (dismissDistance * 0.85)));
    if (bgIntroEl) {
      bgIntroEl.style.opacity = (1 - bgProgress * 0.95).toFixed(3);
      bgIntroEl.style.filter = "blur(" + (bgProgress * 12).toFixed(1) + "px)";
      bgIntroEl.style.transform = "scale(" + (1 - bgProgress * 0.05).toFixed(3) + ")";
    }

    // Update Cards
    var total = currentCards.length;
    var activeIdx = Math.min(total - 1, Math.max(0, Math.floor(smoothScroll / dismissDistance)));

    // Pill auto-hide when on summary card to avoid blocking text
    if (cursorPillEl) {
      if (activeIdx === total - 1 || (mouseX > window.innerWidth - 130 && mouseY < 85)) {
        cursorPillEl.classList.remove("is-visible");
      }
    }

    // Update Pill Counter
    if (pillCounterEl) {
      var displayNum = (activeIdx + 1 < 10 ? "0" : "") + (activeIdx + 1);
      var totalNum = (total < 10 ? "0" : "") + total;
      pillCounterEl.textContent = displayNum + " / " + totalNum;
    }

    for (var i = 0; i < total; i++) {
      var cardEl = currentCards[i];
      if (!cardEl) continue;

      var u = i * dismissDistance;
      var h = (u - smoothScroll) / dismissDistance + 1;

      var ty = 0;
      var scale = 1;
      var rot = 0;
      var op = 1;
      var z = total - i;

      if (h < 1) {
        // Card is dismissing upwards
        var progress = 1 - h;
        ty = -progress * dismissDistance * 1.05;
        scale = 1;
        var tiltSign = (i % 2 === 0) ? -1 : 1;
        rot = progress * 3.5 * tiltSign;
        op = h < 0.08 ? 0 : 1;
      } else {
        // Card is in waiting stack
        var diff = h - 1;
        ty = diff * 18;
        scale = Math.max(0.82, 1 - diff * 0.045);
        rot = 0;
        op = diff > 3.2 ? 0 : (diff > 2.2 ? 1 - (diff - 2.2) : 1);
      }

      cardEl.style.transform = "translate3d(0, " + ty.toFixed(1) + "px, 0) scale(" + scale.toFixed(3) + ") rotate(" + rot.toFixed(2) + "deg)";
      cardEl.style.opacity = op.toFixed(3);
      cardEl.style.zIndex = z;
      cardEl.style.pointerEvents = (h >= 0.7 && h <= 1.4) ? "auto" : "none";
    }

    animFrameId = requestAnimationFrame(renderLoop);
  }

  /**
   * OPEN BARO PROJECT DECK
   */
  function openDeck(projectIndex) {
    initDeckDOM();

    var records = window.RECORDS || window.BAROPHOLIO_PROJECTS || [];
    if (!records || records.length === 0) return;

    currentProjectIdx = (projectIndex + records.length) % records.length;
    var rec = records[currentProjectIdx];
    if (!rec) return;

    // Build project gallery plate list
    var images = [];
    if (rec.gallery && Array.isArray(rec.gallery) && rec.gallery.length > 0) {
      images = rec.gallery.slice();
    } else if (rec.images && Array.isArray(rec.images) && rec.images.length > 0) {
      images = rec.images.slice();
    } else if (rec.image) {
      images = [rec.image];
    }
    if (rec.video && images.indexOf(rec.video) === -1) {
      images.unshift(rec.video);
    }

    // Fallback supplementary architectural plates if only 1 image exists
    if (images.length === 1) {
      images.push(
        "02.Project/02_Baropholio brand_240401/Baropholio brand (1).jpg",
        "02.Project/02_Baropholio brand_240401/Baropholio brand (3).jpg"
      );
    }

    // Populate Background Intro Info (Baro Style)
    var num = (currentProjectIdx + 1 < 10 ? "0" : "") + (currentProjectIdx + 1);
    var tot = (records.length < 10 ? "0" : "") + records.length;
    var cat = (rec.category || rec.cat || "ORANGE~").toUpperCase();
    var yr = rec.year || rec.date || "2026";

    var cleanCat = cat.replace(/ORANGE~?/i, "").trim();
    if (bgMetaEl) bgMetaEl.textContent = "PROJECT " + num + " / " + tot + (cleanCat ? " • " + cleanCat : "") + " • " + yr;
    if (bgTitleEl) bgTitleEl.textContent = rec.title || "Untitled Project";
    if (bgOrgEl) bgOrgEl.textContent = (rec.organization || rec.org || "Baropholio Spatial Archive") + " — Tap card or scroll to flip plates";

    // Clear and build cards
    viewportEl.innerHTML = "";
    currentCards = [];

    // 1. Image / Video Cards
    for (var i = 0; i < images.length; i++) {
      var card = document.createElement("div");
      card.className = "bpd-card";
      var plateNum = (i + 1 < 10 ? "0" : "") + (i + 1);
      var totalPlateNum = (images.length + 1 < 10 ? "0" : "") + (images.length + 1);

      var isVid = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(images[i]) || (typeof images[i] === 'string' && images[i].indexOf('data:video') === 0);
      var mediaHtml = isVid
        ? `<video src="${images[i]}" autoplay loop muted playsinline webkit-playsinline disablepictureinpicture controlslist="nodownload" style="width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;"></video>`
        : `<img src="${images[i]}" alt="${rec.title || 'Baro Project'} - Plate ${plateNum}" loading="eager" />`;

      card.innerHTML = `
        ${mediaHtml}
        <div class="bpd-card-tag">Plate ${plateNum} / ${totalPlateNum}</div>
      `;
      var vEl = card.querySelector("video");
      if (vEl) {
        vEl.muted = true;
        vEl.defaultMuted = true;
        vEl.play().catch(function(){});
      }
      viewportEl.appendChild(card);
      currentCards.push(card);
    }

    // 2. Final Overview Summary Card (Kính mờ Glassmorphism, chỉ tên dự án + script rút gọn ... < / >)
    var fullDesc = (rec.description || rec.desc || 'A spatial investigation synthesizing architectural tectonic order with human-scale atmospheric resonance.').trim();
    // Tạo bản rút gọn gọn gàng (khoảng 130 ký tự)
    var isLong = fullDesc.length > 140;
    var shortDesc = isLong ? fullDesc.slice(0, 130).trim() + "..." : fullDesc;

    var summaryCard = document.createElement("div");
    summaryCard.className = "bpd-card bpd-card-summary";

    summaryCard.innerHTML = `
      <h2 class="bpd-summary-title">${rec.title || 'Untitled Project'}</h2>
      <div class="bpd-script-wrap">
        <div class="bpd-script-content" id="bpdScriptContent">
          <span class="bpd-script-text" id="bpdScriptText">${shortDesc}</span>
          ${isLong ? '<button type="button" class="bpd-script-toggle" id="bpdScriptToggle" aria-label="Toggle full description">&lt;</button>' : ''}
        </div>
      </div>
    `;

    viewportEl.appendChild(summaryCard);
    currentCards.push(summaryCard);

    // Bind Toggle Button (< -> > và xổ ra toàn văn)
    if (isLong) {
      var btnToggle = summaryCard.querySelector("#bpdScriptToggle");
      var textEl = summaryCard.querySelector("#bpdScriptText");
      var contentEl = summaryCard.querySelector("#bpdScriptContent");
      var isExpanded = false;

      if (btnToggle && textEl && contentEl) {
        btnToggle.addEventListener("click", function (e) {
          e.stopPropagation();
          isExpanded = !isExpanded;
          if (isExpanded) {
            textEl.textContent = fullDesc + " ";
            btnToggle.textContent = ">";
            contentEl.classList.add("is-expanded");
          } else {
            textEl.textContent = shortDesc + " ";
            btnToggle.textContent = "<";
            contentEl.classList.remove("is-expanded");
          }
        });
      }
    }

    var vpBtn = summaryCard.querySelector(".bpd-view-proj-action");
    if (vpBtn) {
      vpBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        var pIdx = currentProjectIdx;
        closeDeck();
        if (typeof window.openBook === "function") window.openBook(pIdx);
      });
    }

    // Set scroll boundaries
    dismissDistance = Math.min(680, window.innerHeight * 0.8);
    maxScroll = (currentCards.length - 1) * dismissDistance;
    targetScroll = 0;
    smoothScroll = 0;

    // Show overlay
    isOpen = true;
    overlayEl.classList.add("is-active");
    document.body.classList.add("baro-deck-open");

    // Close any previous expanded sheet if existing
    var oldSheet = document.getElementById("gnSheetExpanded");
    if (oldSheet) oldSheet.classList.remove("show");

    // Start render loop
    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(renderLoop);
  }

  /**
   * CLOSE BARO PROJECT DECK
   */
  function closeDeck() {
    if (!isOpen) return;
    isOpen = false;

    if (overlayEl) {
      overlayEl.classList.remove("is-active");
    }
    if (cursorPillEl) {
      cursorPillEl.classList.remove("is-visible");
    }
    document.body.classList.remove("baro-deck-open");

    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    // Reset sphere camera & expanded state
    var eng = window.baroSphereEngine || window.gnSphereEngine;
    if (eng && typeof eng.closeHeroCard === "function") {
      eng.closeHeroCard();
    }
  }

  // Public API
  window.openBaroProjectDeck = openDeck;
  window.closeBaroProjectDeck = closeDeck;
  window.BaroProjectDeck = {
    open: openDeck,
    close: closeDeck
  };

  // Auto-init DOM once page loads
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDeckDOM);
  } else {
    initDeckDOM();
  }

})(window, document);
