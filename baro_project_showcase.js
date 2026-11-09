/**
 * ==============================================================================
 * BAROPHOLIO - PROJECT FULL VIEW SHOWCASE (BARO x HW-6890 x HANBURY DESIGN)
 * Architectural showcase replacing legacy 2-page monograph book spread.
 * 
 * DESIGN TOKENS & ALIGNMENT:
 * - Full White Palette: #ffffff surface, crisp dark typography (#0d0c0b)
 * - Baropholio Accent Orange: #c46210 (replaced all red colors)
 * - Synced Font: var(--sans, "Space Grotesk", "Epilogue", sans-serif)
 * - Synced Sharp Glassmorphic Close Button (0px radius, 90deg rotate on hover)
 * - Synced Baropholio Cursor (#dot tracking & #dot.wide hover states)
 * - Full-width intermediate image stream (almost touching, 0 text description)
 * - Refined smaller project narrative & metadata typography
 * ==============================================================================
 */

(function (window, document) {
  "use strict";

  if (window.BaroProjectShowcase) return;

  var isOpen = false;
  var currentProjectIdx = 0;
  var currentImages = [];
  var currentRecord = null;
  var heroTimer = null;
  var heroImgIdx = 0;

  // Lightbox state
  var lightboxOpen = false;
  var lightboxImgIdx = 0;

  // DOM Elements
  var showcaseEl = null;
  var heroBgEl = null;
  var heroTitleEl = null;
  var fullStreamTrackEl = null;
  var lightboxEl = null;
  var lightboxImgEl = null;
  var lightboxScriptEl = null;
  var lightboxCounterEl = null;

  function getRecords() {
    return window.RECORDS || window.BAROPHOLIO_PROJECTS || [];
  }

  function injectBaroStyles() {
    if (document.getElementById("baro-showcase-styles")) return;

    var style = document.createElement("style");
    style.id = "baro-showcase-styles";
    style.textContent = `
      @font-face {
        font-family: 'FCaslon30ITC';
        src: url('fonts/fcaslon-thirty-itc-std-maisfontes.ea8c/fcaslon-thirty-itc-std.otf') format('opentype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }

      /* Ensure legacy 2-page book spread is permanently hidden */
      #bookModal {
        display: none !important;
        pointer-events: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }

      /* Synchronize Baropholio Custom Cursor #dot over showcase */
      #dot {
        z-index: 100005 !important;
      }

      /* Root Showcase System Tokens - FULL WHITE & BAROPHOLIO ORANGE */
      :root {
        --baro-surface: #ffffff;
        --baro-surface-subtle: #fafaf9;
        --baro-surface-card: #ffffff;
        --baro-text-primary: #0d0c0b;
        --baro-text-secondary: rgba(13, 12, 11, 0.72);
        --baro-text-tertiary: rgba(13, 12, 11, 0.48);
        --baro-accent: #c46210; /* Baropholio Signature Warm Orange */
        --baro-border: rgba(13, 12, 11, 0.1);
        --baro-border-light: rgba(13, 12, 11, 0.06);
        --baro-font-stack: var(--sans, "Space Grotesk", "Epilogue", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
        --baro-body-font: var(--body, "FCaslon30ITC", "EB Garamond", "Garamond", Georgia, serif);
        --baro-ease: cubic-bezier(0.16, 1, 0.3, 1);
        --baro-duration-fast: 300ms;
        --baro-duration-instant: 150ms;
      }

      /* Baro Showcase Main Viewport - FULL WHITE */
      .baro-showcase-viewport {
        position: fixed;
        inset: 0;
        z-index: 99995;
        background: #ffffff;
        color: var(--baro-text-primary);
        font-family: var(--baro-body-font);
        overflow-y: auto;
        overflow-x: hidden;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity var(--baro-duration-fast) var(--baro-ease), visibility var(--baro-duration-fast);
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }

      .baro-showcase-viewport.is-active {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      body.baro-showcase-open {
        overflow: hidden !important;
      }

      /* Baro Top Navigation Bar */
      .baro-top-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 32px;
        z-index: 120;
        pointer-events: none;
      }

      .baro-top-nav-left {
        display: none !important;
      }

      .baro-top-nav-right {
        display: flex;
        align-items: center;
        gap: 12px;
        pointer-events: auto;
      }

      .baro-pill-badge {
        display: none !important;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--baro-text-primary, #0d0c0b);
        background: rgba(255, 255, 255, 0.72);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        height: 36px;
        max-width: 260px;
        padding: 0 16px;
        border-radius: 999px;
        border: 1px solid rgba(13, 12, 11, 0.12);
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.85);
        display: inline-flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
        box-sizing: border-box;
        overflow: hidden;
        user-select: none;
        cursor: default;
        transition: max-width 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                    padding 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                    gap 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                    background 0.25s ease,
                    box-shadow 0.25s ease,
                    border-color 0.25s ease;
        will-change: max-width, padding;
      }

      .baro-pill-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--baro-accent, #c46210);
        flex-shrink: 0;
        transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
      }

      #baroTopBadgeText {
        display: inline-block;
        white-space: nowrap;
        opacity: 1;
        max-width: 200px;
        transform: translateX(0);
        transition: opacity 0.22s ease 0.06s,
                    max-width 0.38s cubic-bezier(0.22, 1, 0.36, 1),
                    transform 0.22s ease 0.06s;
      }

      /* Rút gọn từ phải sang trái chỉ còn 1 hình tròn khi cuộn chuột */
      .baro-pill-badge.is-scrolling {
        max-width: 36px;
        padding: 0;
        gap: 0;
        justify-content: center;
        border-radius: 50%;
        cursor: pointer;
      }

      .baro-pill-badge.is-scrolling .baro-pill-dot {
        transform: scale(1.2);
      }

      .baro-pill-badge.is-scrolling #baroTopBadgeText {
        opacity: 0;
        max-width: 0;
        transform: translateX(12px);
        margin: 0;
        pointer-events: none;
        transition: opacity 0.14s ease,
                    max-width 0.32s cubic-bezier(0.22, 1, 0.36, 1),
                    transform 0.14s ease;
      }

      .baro-pill-badge.is-scrolling:hover {
        max-width: 260px;
        padding: 0 16px;
        gap: 8px;
        border-radius: 999px;
      }

      .baro-pill-badge.is-scrolling:hover #baroTopBadgeText {
        opacity: 1;
        max-width: 200px;
        transform: translateX(0);
        transition: opacity 0.22s ease 0.06s,
                    max-width 0.38s cubic-bezier(0.22, 1, 0.36, 1),
                    transform 0.22s ease 0.06s;
      }

      /* Sharp Close Button — Main: ultra-transparent glass */
      .baro-close-button {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 36px !important;
        height: 36px !important;
        border-radius: 0px !important;
        background: rgba(255, 255, 255, 0.06) !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
        border: 1px solid rgba(13, 12, 11, 0.07) !important;
        box-shadow: none !important;
        color: rgba(13, 12, 11, 0.28) !important;
        cursor: pointer !important;
        transition:
          background .25s ease,
          border-color .25s ease,
          transform .25s ease,
          color .25s ease !important;
        flex-shrink: 0;
        padding: 0;
      }

      .baro-close-button:hover {
        background: #0d0c0b !important;
        color: #ffffff !important;
        border-color: #0d0c0b !important;
        transform: rotate(90deg) !important;
      }

      /* Lightbox close: standard white glass */
      .baro-lb-close-btn {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 36px !important;
        height: 36px !important;
        border-radius: 0px !important;
        background: rgba(255, 255, 255, 0.75) !important;
        backdrop-filter: blur(20px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
        border: 1px solid rgba(13, 12, 11, 0.15) !important;
        box-shadow: 0 4px 16px rgba(13, 12, 11, 0.08) !important;
        color: #0d0c0b !important;
        cursor: pointer !important;
        transition:
          background .25s ease,
          border-color .25s ease,
          transform .25s ease,
          color .25s ease !important;
        flex-shrink: 0;
        padding: 0;
      }

      .baro-lb-close-btn:hover {
        background: #0d0c0b !important;
        color: #ffffff !important;
        border-color: #0d0c0b !important;
        transform: rotate(90deg) !important;
      }

      .baro-close-button svg,
      .baro-lb-close-btn svg {
        pointer-events: none;
        width: 16px;
        height: 16px;
      }

      /* ========================================================================
         1. HW-6890 AMBIENT HERO EFFECT (FULL WHITE CANVAS)
         - Project images fade in/out softly in background
         - CENTER HAS ONLY THE PROJECT TITLE (Baropholio font, uppercase, pure clean)
         ======================================================================== */
      .baro-hw-ambient-hero {
        position: relative;
        width: 100%;
        min-height: 100vh;
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: #ffffff;
      }

      .baro-hw-bg-stage {
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
      }

      .baro-hw-slide {
        position: absolute;
        inset: -3%;
        background-size: cover;
        background-position: center center;
        opacity: 0;
        transform: scale(1.01);
        transition: opacity 2.4s cubic-bezier(0.4, 0, 0.2, 1), transform 6s cubic-bezier(0.2, 0, 0.2, 1);
        filter: saturate(0.92) contrast(1.02);
      }

      .baro-hw-slide.is-visible {
        opacity: 0.32;
        transform: scale(1.06);
      }

      /* Soft white radial vignette for crisp typography legibility */
      .baro-hw-scrim {
        position: absolute;
        inset: 0;
        z-index: 2;
        background: radial-gradient(circle at center, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.85) 65%, #ffffff 100%);
        pointer-events: none;
      }

      /* Hero Center: ONLY PROJECT TITLE */
      .baro-hw-center-wrap {
        position: relative;
        z-index: 10;
        max-width: 1100px;
        padding: 0 32px;
        text-align: center;
      }

      .baro-hw-project-title {
        font-family: var(--baro-font-stack);
        font-size: clamp(2.6rem, 6.5vw, 5.2rem);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: -0.035em;
        line-height: 1.05;
        color: var(--baro-text-primary);
        margin: 0;
        text-wrap: balance;
      }

      /* Minimal Scroll Prompt */
      .baro-hw-scroll-cue {
        position: absolute;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity var(--baro-duration-fast);
      }

      .baro-hw-scroll-cue:hover {
        opacity: 1;
      }

      .baro-hw-scroll-cue span {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--baro-text-secondary);
      }

      .baro-hw-cue-line {
        width: 1px;
        height: 30px;
        background: linear-gradient(to bottom, var(--baro-accent), transparent);
        animation: baroPulseLine 2.2s infinite ease-in-out;
      }

      @keyframes baroPulseLine {
        0% { transform: scaleY(0); transform-origin: top; }
        50% { transform: scaleY(1); transform-origin: top; }
        50.1% { transform: scaleY(1); transform-origin: bottom; }
        100% { transform: scaleY(0); transform-origin: bottom; }
      }

      /* ========================================================================
         2. FULL WIDTH INTERMEDIATE IMAGE STREAM
         (Dưới phần cuộn & trên phần mô tả dự án):
         - Luôn trong trạng thái FULL WIDTH (width: 100vw/100%)
         - Chữ mô tả bên dưới ảnh BỎ ĐI KO HIỆN
         - Khoảng cách trên dưới gần như DÍNH VỚI NHAU (gap: 3px)
         - Hoàn toàn KHÔNG CROP (object-fit: contain / natural ratio)
         ======================================================================== */
      .baro-full-stream-track {
        position: relative;
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 3px; /* Gần như dính với nhau */
        background: #ffffff;
      }

      .baro-full-stream-item {
        position: relative;
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
        background: #ffffff;
        cursor: zoom-in;
        overflow: hidden;
      }

      /* Full width, hoàn toàn không crop */
      .baro-full-stream-item img {
        width: 100%;
        max-width: 100%;
        height: auto;
        display: block;
        object-fit: contain;
        margin: 0 auto;
        background: #ffffff;
        transition: opacity var(--baro-duration-fast) var(--baro-ease);
      }

      .baro-full-stream-item:hover img {
        opacity: 0.95;
      }

      /* ========================================================================
         3. FULL PROJECT DOSSIER & REFINED SMALLER TYPOGRAPHY
         - Phần chữ mô tả dự án tất cả đều NHỎ LẠI tinh gọn
         - Bảng meta specs nhỏ nhắn, chuẩn thanh lịch
         - Asymmetrical gallery bổ sung không crop
         ======================================================================== */
      .baro-dossier-section {
        position: relative;
        max-width: 1360px;
        margin: 0 auto;
        padding: 72px 32px 120px;
        background: #ffffff;
        border-top: 1px solid var(--baro-border);
      }

      .baro-dossier-header {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 56px;
        margin-bottom: 72px;
        align-items: start;
      }

      .baro-dossier-left {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      /* Tiêu đề dự án nhỏ gọn, thanh nhã */
      .baro-dossier-title {
        font-family: var(--baro-font-stack);
        font-size: clamp(1.4rem, 2.4vw, 2.1rem);
        font-weight: 700;
        letter-spacing: -0.025em;
        text-transform: uppercase;
        line-height: 1.15;
        color: var(--baro-text-primary);
        margin: 0;
      }

      /* Toàn bộ chữ mô tả dự án nhỏ lại */
      .baro-dossier-narrative {
        font-family: var(--baro-body-font);
        font-size: 0.98rem;
        line-height: 1.75;
        color: #0d0c0b;
        white-space: pre-line;
      }

      .baro-dossier-right {
        display: flex;
        flex-direction: column;
        gap: 14px;
        background: #ffffff;
        padding: 24px 28px;
        border: none;
      }

      .baro-meta-table {
        display: flex;
        flex-direction: column;
        gap: 5px;
        font-family: var(--baro-body-font);
      }

      .baro-meta-row {
        display: grid;
        grid-template-columns: 105px 1fr;
        gap: 10px;
        font-size: 0.72rem;
        line-height: 1.35;
        border: none;
        border-bottom: none;
        padding-bottom: 0;
      }

      .baro-meta-row:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .baro-meta-key {
        font-family: var(--baro-font-stack);
        font-weight: 600;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        font-size: 0.65rem;
        color: #0d0c0b;
      }

      .baro-meta-val {
        font-family: var(--baro-body-font);
        font-weight: 500;
        font-size: 0.82rem;
        color: var(--baro-text-primary);
      }

      .baro-ext-link-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 18px;
        background: var(--baro-accent);
        color: #ffffff;
        text-decoration: none;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        transition: opacity var(--baro-duration-instant), transform var(--baro-duration-instant);
        margin-top: 4px;
      }

      .baro-ext-link-btn:hover {
        opacity: 0.88;
        transform: translateY(-1px);
      }

      /* Asymmetrical Moodboard Collage Gallery — Non-overlapping, Varied Sizes */
      .baro-gallery-stream {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-top: 0;
      }

      /* Row containers */
      .baro-plate-row {
        width: 100%;
        display: flex;
        align-items: stretch;
        gap: 20px;
      }

      /* Full bleed hero shot */
      .baro-plate-row.full-width {
        max-width: 100%;
      }

      /* Landscape left (60%) + Portrait right (38%) */
      .baro-plate-row.split-uneven-1 {
        display: grid;
        grid-template-columns: 1.58fr 1fr;
        gap: 20px;
        align-items: start;
      }

      /* Portrait left (38%) + Landscape right (60%) */
      .baro-plate-row.split-uneven-2 {
        display: grid;
        grid-template-columns: 1fr 1.58fr;
        gap: 20px;
        align-items: start;
      }

      /* Three equal squares */
      .baro-plate-row.triple-col {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 20px;
        align-items: start;
      }

      /* Wide panoramic center, 88% width */
      .baro-plate-row.panoramic {
        max-width: 88%;
        margin: 0 auto;
        display: block;
      }

      /* Offset square — 50% centered, shifted right */
      .baro-plate-row.offset-right {
        max-width: 54%;
        margin: 0 0 0 auto;
        display: block;
      }

      /* Offset square — 50% centered, shifted left */
      .baro-plate-row.offset-left {
        max-width: 54%;
        margin: 0 auto 0 0;
        display: block;
      }

      /* Legacy alias */
      .baro-plate-row.centered-focus {
        max-width: 68%;
        margin: 0 auto;
      }

      .baro-plate-item {
        position: relative;
        background: #ffffff;
        border: 1px solid var(--baro-border);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        cursor: zoom-in;
        overflow: hidden;
        transition: transform var(--baro-duration-fast) var(--baro-ease), box-shadow var(--baro-duration-fast);
      }

      .baro-plate-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
      }

      .baro-plate-item.is-interactive-media {
        cursor: default !important;
        background: #0d0c0b;
      }
      .baro-plate-item.is-interactive-media:hover {
        transform: none !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04) !important;
      }

      /* 100% uncropped */
      .baro-plate-item img {
        width: 100%;
        height: auto;
        max-height: 85vh;
        object-fit: contain;
        display: block;
        margin: 0 auto;
        background: #ffffff;
      }

      .baro-plate-item video {
        width: 100%;
        height: auto;
        max-height: 85vh;
        object-fit: contain;
        display: block;
        margin: 0 auto;
        background: #0d0c0b;
        pointer-events: auto !important;
      }
      }

      /* Footer Next / Prev Project Navigation */
      .baro-footer-nav {
        margin-top: 96px;
        padding-top: 36px;
        border-top: 1px solid var(--baro-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .baro-nav-btn {
        display: flex;
        flex-direction: column;
        gap: 4px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px 0;
        text-align: left;
        color: var(--baro-text-primary);
        font-family: inherit;
        transition: opacity var(--baro-duration-instant), transform var(--baro-duration-instant);
      }

      .baro-nav-btn:hover {
        opacity: 0.7;
        transform: translateX(4px);
      }

      .baro-nav-btn.prev:hover {
        transform: translateX(-4px);
      }

      .baro-nav-label {
        font-size: 10px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--baro-text-tertiary);
      }

      .baro-nav-title {
        font-size: 1.15rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        text-transform: uppercase;
      }

      /* ========================================================================
         4. FULLSCREEN LIGHTBOX:
         - Full-size uncropped image
         - Script nhỏ góc dưới cùng nếu có
         - Bấm qua lại giữa các ảnh
         - Button close đồng bộ Baropholio
         ======================================================================== */
      .baro-lightbox-overlay {
        position: fixed;
        inset: 0;
        z-index: 100000;
        background: rgba(10, 10, 10, 0.94);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity var(--baro-duration-fast) var(--baro-ease), visibility var(--baro-duration-fast);
      }

      .baro-lightbox-overlay.is-open {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .baro-lb-top-bar {
        position: absolute;
        top: 24px;
        left: 32px;
        right: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 10;
        pointer-events: none;
      }

      .baro-lb-counter {
        color: #ffffff;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.25);
        padding: 6px 14px;
        border-radius: 999px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        display: inline-flex;
        align-items: center;
      }

      .baro-lb-close-btn {
        pointer-events: auto;
      }

      .baro-lb-nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 44px;
        height: 44px;
        border-radius: 0px !important;
        background: rgba(255, 255, 255, 0.15) !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        transition: background var(--baro-duration-instant), transform var(--baro-duration-instant);
      }

      .baro-lb-nav-btn:hover {
        background: var(--baro-accent) !important;
        border-color: var(--baro-accent) !important;
        transform: translateY(-50%) scale(1.05);
      }

      .baro-lb-prev { left: 24px; }
      .baro-lb-next { right: 24px; }

      .baro-lb-viewport {
        position: relative;
        max-width: 92vw;
        max-height: 84vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* 100% fullsize uncropped */
      .baro-lb-image {
        max-width: 92vw;
        max-height: 84vh;
        width: auto;
        height: auto;
        object-fit: contain;
        display: block;
        box-shadow: 0 24px 72px rgba(0, 0, 0, 0.7);
        user-select: none;
        transition: opacity var(--baro-duration-instant) ease;
      }

      /* Script nhỏ góc dưới cùng nếu có */
      .baro-lb-script-wrap {
        position: absolute;
        bottom: 24px;
        left: 32px;
        right: 32px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        pointer-events: none;
        z-index: 10;
      }

      .baro-lb-script {
        font-size: 12px;
        font-weight: 400;
        letter-spacing: 0.03em;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.88);
        background: rgba(18, 18, 18, 0.75);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        padding: 6px 14px;
        border-radius: 0px;
        max-width: 600px;
        border: 1px solid rgba(255, 255, 255, 0.15);
      }

      .baro-lb-script:empty {
        display: none;
      }

      /* Responsive adjustments */
      @media (max-width: 960px) {
        .baro-dossier-info-block {
          grid-template-columns: 1fr;
          gap: 28px;
        }

        .baro-plate-row.split-uneven-1,
        .baro-plate-row.split-uneven-2 {
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .baro-plate-row.centered-focus {
          max-width: 100%;
        }

        .baro-lb-nav-btn {
          width: 36px;
          height: 36px;
        }
        .baro-lb-prev { left: 8px; }
        .baro-lb-next { right: 8px; }
      }
    `;

    document.head.appendChild(style);
  }

  function initBaroDOM() {
    if (showcaseEl) return;
    injectBaroStyles();

    showcaseEl = document.createElement("div");
    showcaseEl.id = "baroProjectShowcase";
    showcaseEl.className = "baro-showcase-viewport";
    showcaseEl.setAttribute("role", "dialog");
    showcaseEl.setAttribute("aria-modal", "true");
    showcaseEl.setAttribute("aria-label", "Baropholio Full Project Showcase");

    showcaseEl.innerHTML = `
      <!-- Top Fixed Nav Controls -->
      <header class="baro-top-nav">
        <div class="baro-top-nav-left">
          <span class="baro-pill-badge" id="baroTopBadge">
            <span class="baro-pill-dot"></span>
            <span id="baroTopBadgeText">PROJECT</span>
          </span>
        </div>
        <div class="baro-top-nav-right">
          <button class="baro-close-button" id="baroBtnClose" aria-label="Close Project View" title="Close [ESC]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </header>

      <!-- 1. HW-6890 AMBIENT HERO EFFECT (FULL WHITE) -->
      <section class="baro-hw-ambient-hero" id="baroHeroSection">
        <div class="baro-hw-bg-stage" id="baroHeroBg"></div>
        <div class="baro-hw-scrim"></div>
        <div class="baro-hw-center-wrap">
          <h1 class="baro-hw-project-title" id="baroHeroTitle">PROJECT TITLE</h1>
        </div>
        <div class="baro-hw-scroll-cue" id="baroScrollCue">
          <span>SCROLL TO EXPLORE</span>
          <div class="baro-hw-cue-line"></div>
        </div>
      </section>

      <!-- 2. FULL WIDTH INTERMEDIATE IMAGE STREAM (DƯỚI SCROLL, TRÊN MÔ TẢ) -->
      <section class="baro-full-stream-track" id="baroFullStreamTrack"></section>

      <!-- 3. FULL DOSSIER & REFINED SMALLER TYPOGRAPHY -->
      <section class="baro-dossier-section" id="baroDossierSection">
        <div class="baro-dossier-header">
          <div class="baro-dossier-left">
            <h2 class="baro-dossier-title" id="baroDossierTitle">PROJECT TITLE</h2>
            <div class="baro-dossier-narrative" id="baroDossierNarrative"></div>
          </div>
          <div class="baro-dossier-right">
            <div class="baro-meta-table" id="baroMetaTable"></div>
            <a href="#" class="baro-ext-link-btn" id="baroExtLink" target="_blank" rel="noopener noreferrer" style="display:none;">
              <span>VIEW PUBLISHED MONOGRAPH</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        </div>

        <div class="baro-gallery-stream" id="baroGalleryStream"></div>

        <div class="baro-footer-nav">
          <button class="baro-nav-btn prev" id="baroPrevProjBtn" type="button">
            <span class="baro-nav-label">&larr; PREVIOUS PROJECT</span>
            <span class="baro-nav-title" id="baroPrevProjTitle">PREV</span>
          </button>
          <button class="baro-nav-btn next" id="baroNextProjBtn" type="button">
            <span class="baro-nav-label">NEXT PROJECT &rarr;</span>
            <span class="baro-nav-title" id="baroNextProjTitle">NEXT</span>
          </button>
        </div>
      </section>

      <!-- 4. FULLSCREEN LIGHTBOX -->
      <div class="baro-lightbox-overlay" id="baroLightbox" role="dialog" aria-modal="true">
        <div class="baro-lb-top-bar">
          <span class="baro-lb-counter" id="baroLbCounter">PLATE 01 / 01</span>
          <button class="baro-lb-close-btn" id="baroLbClose" aria-label="Close Lightbox" title="Close [ESC]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <button class="baro-lb-nav-btn baro-lb-prev" id="baroLbPrev" aria-label="Previous image">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <button class="baro-lb-nav-btn baro-lb-next" id="baroLbNext" aria-label="Next image">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

        <div class="baro-lb-viewport" id="baroLbViewport">
          <img src="" alt="" class="baro-lb-image" id="baroLbImage" />
        </div>

        <div class="baro-lb-script-wrap">
          <div class="baro-lb-script" id="baroLbScript"></div>
        </div>
      </div>
    `;

    document.body.appendChild(showcaseEl);

    heroBgEl = document.getElementById("baroHeroBg");
    heroTitleEl = document.getElementById("baroHeroTitle");
    fullStreamTrackEl = document.getElementById("baroFullStreamTrack");
    lightboxEl = document.getElementById("baroLightbox");
    lightboxImgEl = document.getElementById("baroLbImage");
    lightboxScriptEl = document.getElementById("baroLbScript");
    lightboxCounterEl = document.getElementById("baroLbCounter");

    bindBaroEvents();
    setupCursorDotSync();
  }

  // Synchronize Baropholio Cursor Dot (#dot)
  function setupCursorDotSync() {
    var dot = document.getElementById("dot");
    if (!dot) return;

    // Delegate hover events to expand cursor to wide state
    document.addEventListener("mouseover", function (e) {
      if (!isOpen) return;
      var target = e.target.closest("button, a, .baro-full-stream-item, .baro-plate-item, .baro-hw-scroll-cue");
      if (target) {
        dot.classList.add("wide");
      }
    }, { passive: true });

    document.addEventListener("mouseout", function (e) {
      if (!isOpen) return;
      var target = e.target.closest("button, a, .baro-full-stream-item, .baro-plate-item, .baro-hw-scroll-cue");
      if (target) {
        dot.classList.remove("wide");
      }
    }, { passive: true });
  }

  function bindBaroEvents() {
    var closeBtn = document.getElementById("baroBtnClose");
    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        closeShowcase();
      });
    }

    var scrollCue = document.getElementById("baroScrollCue");
    if (scrollCue) {
      scrollCue.addEventListener("click", function () {
        if (fullStreamTrackEl) {
          fullStreamTrackEl.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    var prevProjBtn = document.getElementById("baroPrevProjBtn");
    var nextProjBtn = document.getElementById("baroNextProjBtn");
    if (prevProjBtn) {
      prevProjBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var recs = getRecords();
        if (recs.length === 0) return;
        var prevIdx = (currentProjectIdx - 1 + recs.length) % recs.length;
        openShowcase(prevIdx);
      });
    }
    if (nextProjBtn) {
      nextProjBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var recs = getRecords();
        if (recs.length === 0) return;
        var nextIdx = (currentProjectIdx + 1) % recs.length;
        openShowcase(nextIdx);
      });
    }

    // Scroll interaction for top badge: shrinks from right to left into a circle dot, expands back when stopped
    var topBadgeEl = document.getElementById("baroTopBadge");
    var badgeScrollTimer = null;

    function handleBadgeScroll() {
      if (!topBadgeEl || !isOpen) return;
      if (!topBadgeEl.classList.contains("is-scrolling")) {
        topBadgeEl.classList.add("is-scrolling");
      }
      clearTimeout(badgeScrollTimer);
      badgeScrollTimer = setTimeout(function () {
        if (topBadgeEl) {
          topBadgeEl.classList.remove("is-scrolling");
        }
      }, 350);
    }

    if (showcaseEl) {
      showcaseEl.addEventListener("scroll", handleBadgeScroll, { passive: true });
      showcaseEl.addEventListener("wheel", handleBadgeScroll, { passive: true });
    }

    if (topBadgeEl) {
      topBadgeEl.addEventListener("click", function () {
        if (topBadgeEl.classList.contains("is-scrolling")) {
          topBadgeEl.classList.remove("is-scrolling");
        } else if (showcaseEl) {
          showcaseEl.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }

    var lbClose = document.getElementById("baroLbClose");
    if (lbClose) {
      lbClose.addEventListener("click", function (e) {
        e.stopPropagation();
        closeLightbox();
      });
    }

    var lbPrev = document.getElementById("baroLbPrev");
    if (lbPrev) {
      lbPrev.addEventListener("click", function (e) {
        e.stopPropagation();
        prevLightboxImage();
      });
    }

    var lbNext = document.getElementById("baroLbNext");
    if (lbNext) {
      lbNext.addEventListener("click", function (e) {
        e.stopPropagation();
        nextLightboxImage();
      });
    }

    if (lightboxEl) {
      lightboxEl.addEventListener("click", function (e) {
        if (e.target === lightboxEl || e.target.id === "baroLbViewport") {
          closeLightbox();
        }
      });
    }

    window.addEventListener("keydown", function (e) {
      if (!isOpen) return;

      if (lightboxOpen) {
        if (e.key === "Escape") {
          closeLightbox();
        } else if (e.key === "ArrowLeft") {
          prevLightboxImage();
        } else if (e.key === "ArrowRight") {
          nextLightboxImage();
        }
        return;
      }

      if (e.key === "Escape") {
        closeShowcase();
      }
    });

    // Touch Swipe on Lightbox
    var touchStartX = 0;
    var touchStartY = 0;
    if (lightboxEl) {
      lightboxEl.addEventListener("touchstart", function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      lightboxEl.addEventListener("touchend", function (e) {
        var diffX = e.changedTouches[0].clientX - touchStartX;
        var diffY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) nextLightboxImage();
          else prevLightboxImage();
        }
      }, { passive: true });
    }
  }

  // 1. HW-6890 Ambient Slideshow (Full White Canvas)
  function startHeroSlideshow(images) {
    stopHeroSlideshow();
    if (!heroBgEl || !images || images.length === 0) return;

    heroBgEl.innerHTML = "";
    var slides = [];

    images.forEach(function (src, i) {
      var slide = document.createElement("div");
      slide.className = "baro-hw-slide" + (i === 0 ? " is-visible" : "");
      slide.style.backgroundImage = 'url("' + src + '")';
      heroBgEl.appendChild(slide);
      slides.push(slide);
    });

    heroImgIdx = 0;

    heroTimer = setInterval(function () {
      if (!slides || slides.length <= 1) return;
      slides[heroImgIdx].classList.remove("is-visible");
      heroImgIdx = (heroImgIdx + 1) % slides.length;
      slides[heroImgIdx].classList.add("is-visible");
    }, 3800);
  }

  function stopHeroSlideshow() {
    if (heroTimer) {
      clearInterval(heroTimer);
      heroTimer = null;
    }
    if (heroBgEl) {
      heroBgEl.innerHTML = "";
    }
  }

  // ─── Media type detector ─────────────────────────────────────────────────
  function detectMediaType(src) {
    if (!src) return 'image';
    if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src) || src.startsWith('data:video')) return 'video';
    if (/\.(mp3|wav|ogg|aac|flac)(\?.*)?$/i.test(src) || src.startsWith('data:audio')) return 'audio';
    if (/\.pdf(\?.*)?$/i.test(src) || src.startsWith('data:application/pdf')) return 'pdf';
    if (/\.gif(\?.*)?$/i.test(src) || src.startsWith('data:image/gif')) return 'gif';
    return 'image';
  }

  // ─── Create media element (no-download protected, interactive in dossier gallery) ──
  function createMediaEl(src, alt, lazy, isInteractive) {
    var type = detectMediaType(src);
    var el;
    if (type === 'video') {
      el = document.createElement('video');
      el.src = src;
      el.playsInline = true;
      el.setAttribute('playsinline', '');
      el.setAttribute('webkit-playsinline', '');
      el.setAttribute('controlsList', 'nodownload');

      if (isInteractive) {
        // Interactive video below the project script: can play/pause, seek, volume on/off
        el.controls = true;
        el.autoplay = false;
        el.muted = false;
        el.volume = 1.0;
        el.preload = 'metadata';
        el.style.cssText = 'width:100%;height:auto;max-height:85vh;object-fit:contain;display:block;background:#0d0c0b;pointer-events:auto !important;cursor:default;margin:0 auto;';
      } else {
        // Ambient video in upper full stream
        el.crossOrigin = 'anonymous';
        el.autoplay = true;
        el.loop = true;
        el.muted = true;
        el.defaultMuted = true;
        el.volume = 0;
        el.setAttribute('autoplay', '');
        el.setAttribute('loop', '');
        el.setAttribute('muted', '');
        el.setAttribute('disablepictureinpicture', '');
        el.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;background:#111;cursor:default;pointer-events:none;';
        el.addEventListener('loadedmetadata', function() { el.play().catch(function(){}); });
        setTimeout(function() { el.play().catch(function(){}); }, 60);
      }
    } else if (type === 'audio') {
      var wrap = document.createElement('div');
      wrap.className = 'baro-audio-card';
      wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;min-height:180px;padding:36px 24px;background:#0d0c0b;border:1px solid rgba(255,255,255,0.12);gap:14px;box-sizing:border-box;pointer-events:auto;cursor:default;';
      var icon = document.createElement('div');
      icon.style.cssText = 'font-size:38px;color:#e67e22;';
      icon.textContent = '♪';
      var name = document.createElement('div');
      name.style.cssText = 'font-size:13.5px;font-weight:600;letter-spacing:0.04em;color:#e2e8f0;text-align:center;max-width:420px;word-break:break-word;';
      name.textContent = alt || 'Audio Recording';
      el = document.createElement('audio');
      el.src = src;
      el.controls = true;
      el.preload = 'metadata';
      el.setAttribute('controlsList', 'nodownload');
      el.style.cssText = 'width:100%;max-width:520px;margin-top:6px;pointer-events:auto;';
      wrap.appendChild(icon);
      wrap.appendChild(name);
      wrap.appendChild(el);
      return wrap;
    } else if (type === 'pdf') {
      var wrap = document.createElement('div');
      wrap.className = 'baro-pdf-card';
      wrap.style.cssText = 'display:flex;flex-direction:column;width:100%;background:#ffffff;border:1px solid var(--baro-border);box-sizing:border-box;pointer-events:auto;cursor:default;';
      var head = document.createElement('div');
      head.style.cssText = 'display:flex;align-items:center;gap:10px;padding:12px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:13px;font-weight:600;color:#334155;';
      head.innerHTML = `<span>📄</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${alt || 'Monograph Document (PDF)'}</span>`;
      var fr = document.createElement('iframe');
      fr.src = src + '#toolbar=0';
      fr.style.cssText = 'width:100%;height:680px;border:none;display:block;background:#fff;pointer-events:auto;';
      wrap.appendChild(head);
      wrap.appendChild(fr);
      return wrap;
    } else {
      // image / gif
      el = document.createElement('img');
      el.src = src;
      el.alt = alt || '';
      if (lazy) el.loading = 'lazy';
      // No-download: block contextmenu and drag
      el.addEventListener('contextmenu', function(e) { e.preventDefault(); });
      el.addEventListener('dragstart', function(e) { e.preventDefault(); });
      el.style.pointerEvents = 'auto';
    }
    // For video: also block contextmenu
    if (el && (type === 'video')) {
      el.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    }
    return el;
  }

  // 2. Full-Width Intermediate Image Stream (Không chữ mô tả, khoảng cách dính với nhau)
  function buildFullStreamTrack(rec, images) {
    if (!fullStreamTrackEl) return;
    fullStreamTrackEl.innerHTML = "";

    images.forEach(function (imgSrc, i) {
      var itemEl = document.createElement("div");
      itemEl.className = "baro-full-stream-item";
      itemEl.setAttribute("data-img-idx", i);

      var type = detectMediaType(imgSrc);
      if (type === 'image' || type === 'gif') {
        itemEl.setAttribute("title", "Click to enlarge fullsize");
        var mediaEl = createMediaEl(imgSrc, (rec.title || "Project plate") + " — " + (i + 1), true, false);
        itemEl.appendChild(mediaEl);
        (function (idx) {
          itemEl.addEventListener("click", function () { openLightbox(idx); });
        })(i);
      } else {
        // video/audio/pdf in full stream track
        var mediaEl = createMediaEl(imgSrc, (rec.title || "Project") + " — " + (i + 1), false, false);
        itemEl.appendChild(mediaEl);
      }

      fullStreamTrackEl.appendChild(itemEl);
    });
  }

  // 3. Dossier & Asymmetrical Gallery (Chữ mô tả nhỏ lại, uncropped)
  function buildDossierAndGallery(rec, images) {
    var titleEl = document.getElementById("baroDossierTitle");
    var narrativeEl = document.getElementById("baroDossierNarrative");
    var metaTable = document.getElementById("baroMetaTable");
    var extLink = document.getElementById("baroExtLink");
    var streamEl = document.getElementById("baroGalleryStream");

    if (titleEl) titleEl.textContent = rec.title || "Untitled Project";

    if (narrativeEl) {
      narrativeEl.textContent = rec.description || rec.desc || "";
    }

    if (metaTable) {
      metaTable.innerHTML = "";
      var rows = [];

      // 1. Dynamic metadata rows from Admin Basic Info (customizable labels & values)
      var bi = Array.isArray(rec.basicInfo) ? rec.basicInfo : (Array.isArray(rec.metadata) ? rec.metadata : []);
      if (bi.length > 0) {
        bi.forEach(function (item) {
          if (!item) return;
          var label = String(item.label || item.key || "").trim();
          var val = String(item.value != null ? item.value : "").trim();
          if (label && val) {
            rows.push({ label: label, val: val });
          }
        });
      }

      // Fallback if basicInfo is empty
      if (rows.length === 0) {
        rows = [
          { label: "Category", val: rec.category || rec.cat || "Architecture & Urban" },
          { label: "Year", val: rec.year || rec.date || "2024" },
          { label: "Organization", val: rec.organization || rec.org || "Baropholio" },
          { label: "Typology", val: rec.typology || rec.category || "Ecological Settlement" },
          { label: "Location", val: rec.location || "Ho Chi Minh City, Vietnam" },
          { label: "Recognition", val: rec.award || rec.details || "" }
        ];
      }

      rows.forEach(function (r) {
        if (!r.val) return;
        var rowEl = document.createElement("div");
        rowEl.className = "baro-meta-row";
        rowEl.innerHTML = `
          <span class="baro-meta-key">${r.label}</span>
          <span class="baro-meta-val">${r.val}</span>
        `;
        metaTable.appendChild(rowEl);
      });

      // 2. Dynamic Hashtags at the end of the table
      var tagsList = [];
      if (Array.isArray(rec.collections) && rec.collections.length > 0) {
        tagsList = rec.collections;
      } else if (rec.category || rec.cat) {
        tagsList = [rec.category || rec.cat];
      }

      function toHashtag(str) {
        if (!str) return "";
        var noAccent = String(str)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "D");
        var clean = noAccent.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        return clean ? ("#" + clean) : "";
      }

      var hashtags = [];
      tagsList.forEach(function (t) {
        var h = toHashtag(t);
        if (h && hashtags.indexOf(h) === -1) {
          hashtags.push(h);
        }
      });

      if (hashtags.length > 0) {
        var hashtagRow = document.createElement("div");
        hashtagRow.className = "baro-meta-row baro-meta-hashtags-row";
        hashtagRow.style.marginTop = "6px";
        hashtagRow.innerHTML = `
          <span class="baro-meta-key">Tags</span>
          <span class="baro-meta-val baro-meta-hashtags" style="display:flex; flex-wrap:wrap; gap:8px;">
            ${hashtags.map(function (ht) {
              return `<span class="baro-hashtag" style="color:var(--baro-accent, #e67e22); font-weight:600; letter-spacing:0.02em;">${ht}</span>`;
            }).join("")}
          </span>
        `;
        metaTable.appendChild(hashtagRow);
      }
    }

    if (extLink) {
      if (rec.link) {
        extLink.href = rec.link;
        extLink.style.display = "inline-flex";
      } else {
        extLink.style.display = "none";
      }
    }

    if (streamEl) {
      streamEl.innerHTML = "";

      var imgCount = images.length;
      var curIdx = 0;

      // Asymmetric moodboard collage layout — no overlap, full frame visibility
      // Cycle through varied layout patterns for organic magazine spread feel
      var layoutCycle = [
        'full-width',      // 1 img: hero full bleed
        'split-uneven-1',  // 2 imgs: landscape 60% left + portrait 40% right
        'offset-right',    // 1 img: 54% right-offset
        'triple-col',      // 3 imgs: equal squares
        'split-uneven-2',  // 2 imgs: portrait 40% left + landscape 60% right
        'panoramic',       // 1 img: 88% wide centered
        'offset-left',     // 1 img: 54% left-offset
        'full-width'       // 1 img: full bleed
      ];
      var layoutStep = 0;

      while (curIdx < imgCount) {
        var layout = layoutCycle[layoutStep % layoutCycle.length];
        layoutStep++;

        // How many images this pattern needs
        var need = (layout === 'split-uneven-1' || layout === 'split-uneven-2') ? 2
                 : (layout === 'triple-col') ? 3
                 : 1;

        // Adapt if not enough images remain
        var remaining = imgCount - curIdx;
        if (remaining < need) {
          if (remaining === 2) { layout = 'split-uneven-1'; need = 2; }
          else { layout = 'full-width'; need = 1; }
        }

        var row = document.createElement('div');
        row.className = 'baro-plate-row ' + layout;

        for (var k = 0; k < need; k++) {
          row.appendChild(createBaroPlateItem(images[curIdx + k], curIdx + k, rec));
        }

        streamEl.appendChild(row);
        curIdx += need;
      }
    }
  }

  function createBaroPlateItem(src, index, rec) {
    var item = document.createElement("div");
    item.className = "baro-plate-item";

    var type = detectMediaType(src);
    // In dossier gallery (below narrative script), media files are fully interactive
    var mediaEl = createMediaEl(src, (rec.title || "Project plate") + " — " + (index + 1), true, true);
    item.appendChild(mediaEl);

    // Only images/gif open lightbox; video/audio/pdf are inline interactive
    if (type === 'image' || type === 'gif') {
      item.setAttribute("title", "Click to enlarge fullsize uncropped");
      item.addEventListener("click", function () { openLightbox(index); });
    } else {
      item.classList.add("is-interactive-media");
      item.style.cursor = "default";
      item.style.pointerEvents = "auto";
    }

    return item;
  }

  // 4. Lightbox Controls
  function openLightbox(index) {
    if (!currentImages || currentImages.length === 0) return;
    lightboxOpen = true;
    lightboxImgIdx = (index + currentImages.length) % currentImages.length;

    updateLightboxContent();

    if (lightboxEl) {
      lightboxEl.classList.add("is-open");
    }
  }

  function closeLightbox() {
    lightboxOpen = false;
    if (lightboxEl) {
      lightboxEl.classList.remove("is-open");
    }
  }

  function nextLightboxImage() {
    if (!currentImages || currentImages.length <= 1) return;
    lightboxImgIdx = (lightboxImgIdx + 1) % currentImages.length;
    updateLightboxContent();
  }

  function prevLightboxImage() {
    if (!currentImages || currentImages.length <= 1) return;
    lightboxImgIdx = (lightboxImgIdx - 1 + currentImages.length) % currentImages.length;
    updateLightboxContent();
  }

  function updateLightboxContent() {
    if (!lightboxImgEl || !currentImages || currentImages.length === 0) return;

    var imgSrc = currentImages[lightboxImgIdx];
    var type = detectMediaType(imgSrc);

    // For non-image types: close lightbox and let inline element handle display
    if (type === 'video' || type === 'audio' || type === 'pdf') {
      closeLightbox();
      return;
    }

    lightboxImgEl.style.opacity = "0.3";

    var preloader = new Image();
    preloader.src = imgSrc;
    preloader.onload = function () {
      lightboxImgEl.src = imgSrc;
      lightboxImgEl.style.opacity = "1";
    };

    if (lightboxCounterEl) {
      var curStr = (lightboxImgIdx + 1 < 10 ? "0" : "") + (lightboxImgIdx + 1);
      var totStr = (currentImages.length < 10 ? "0" : "") + currentImages.length;
      lightboxCounterEl.textContent = "PLATE " + curStr + " / " + totStr;
    }

    if (lightboxScriptEl) {
      var rec = currentRecord || {};
      var scriptText = "";

      if (rec.scripts && rec.scripts[lightboxImgIdx]) {
        scriptText = rec.scripts[lightboxImgIdx];
      } else if (rec.captions && rec.captions[lightboxImgIdx]) {
        scriptText = rec.captions[lightboxImgIdx];
      } else if (rec.media && rec.media[lightboxImgIdx] && (rec.media[lightboxImgIdx].caption || rec.media[lightboxImgIdx].title)) {
        scriptText = rec.media[lightboxImgIdx].caption || rec.media[lightboxImgIdx].title;
      }

      lightboxScriptEl.textContent = scriptText;
    }
  }

  // Open Showcase
  function openShowcase(projectRef) {
    var recs = getRecords();
    if (!recs || recs.length === 0) return;

    if (typeof projectRef === "object" && projectRef !== null) {
      var foundIdx = -1;
      for (var i = 0; i < recs.length; i++) {
        var r = recs[i];
        if (r === projectRef ||
            (r.id != null && projectRef.id != null && String(r.id) === String(projectRef.id)) ||
            (r.slug && projectRef.slug && r.slug === projectRef.slug) ||
            (r.title && projectRef.title && r.title.toLowerCase() === projectRef.title.toLowerCase())) {
          foundIdx = i;
          break;
        }
      }
      currentProjectIdx = foundIdx !== -1 ? foundIdx : 0;
      currentRecord = recs[currentProjectIdx] || projectRef;
    } else if (typeof projectRef === "string") {
      var sIdx = -1;
      for (var j = 0; j < recs.length; j++) {
        var rj = recs[j];
        if ((rj.slug && rj.slug === projectRef) ||
            (String(rj.id) === projectRef) ||
            (rj.title && rj.title.toLowerCase() === projectRef.toLowerCase())) {
          sIdx = j;
          break;
        }
      }
      currentProjectIdx = sIdx !== -1 ? sIdx : 0;
      currentRecord = recs[currentProjectIdx];
    } else if (typeof projectRef === "number") {
      currentProjectIdx = (projectRef + recs.length) % recs.length;
      currentRecord = recs[currentProjectIdx];
    } else {
      currentProjectIdx = 0;
      currentRecord = recs[0];
    }

    if (!currentRecord) return;

    currentImages = [];
    if (currentRecord.gallery && Array.isArray(currentRecord.gallery) && currentRecord.gallery.length > 0) {
      currentImages = currentRecord.gallery.slice();
    } else if (currentRecord.images && Array.isArray(currentRecord.images) && currentRecord.images.length > 0) {
      currentImages = currentRecord.images.slice();
    } else if (currentRecord.image) {
      currentImages = [currentRecord.image];
    }
    if (currentImages.length === 0 && currentRecord.media && Array.isArray(currentRecord.media) && currentRecord.media.length > 0) {
      currentImages = currentRecord.media.map(function(m) {
        if (!m) return "";
        if (typeof m === "string") return m;
        return m.url || m.src || (m.dataUrl && !m.dataUrl.startsWith("data:") ? m.dataUrl : "");
      }).filter(Boolean);
    }
    if (currentRecord.video && currentImages.indexOf(currentRecord.video) === -1) {
      currentImages.unshift(currentRecord.video);
    }

    // Fallback if images array is still empty
    if (currentImages.length === 0) {
      currentImages = [
        "02.Project/02_Baropholio brand_240401/Baropholio brand (1).jpg",
        "02.Project/02_Baropholio brand_240401/Baropholio brand (3).jpg"
      ];
    }

    initBaroDOM();

    if (typeof window.closeMenu === "function") window.closeMenu();
    if (typeof window.closeAbout === "function") window.closeAbout();
    if (typeof window.closeBaroProjectDeck === "function") window.closeBaroProjectDeck();
    if (document.body.classList.contains("gridview") && typeof window.toggleGrid === "function") {
      window.toggleGrid(false);
    }

    var badgeText = document.getElementById("baroTopBadgeText");
    var topBadgeEl = document.getElementById("baroTopBadge");
    if (topBadgeEl) topBadgeEl.classList.remove("is-scrolling");
    if (badgeText) {
      var curNum = (currentProjectIdx + 1 < 10 ? "0" : "") + (currentProjectIdx + 1);
      var totNum = (recs.length < 10 ? "0" : "") + recs.length;
      badgeText.textContent = "PROJECT " + curNum + " / " + totNum;
    }

    // 1. HW-6890 Ambient Hero
    if (heroTitleEl) {
      heroTitleEl.textContent = currentRecord.title || "Untitled Project";
    }
    startHeroSlideshow(currentImages);

    // 2. Build dossier info + moodboard gallery (removed full stream track)
    buildDossierAndGallery(currentRecord, currentImages);

    var prevIdx = (currentProjectIdx - 1 + recs.length) % recs.length;
    var nextIdx = (currentProjectIdx + 1) % recs.length;
    var prevTitleEl = document.getElementById("baroPrevProjTitle");
    var nextTitleEl = document.getElementById("baroNextProjTitle");
    if (prevTitleEl) prevTitleEl.textContent = recs[prevIdx].title || "Previous";
    if (nextTitleEl) nextTitleEl.textContent = recs[nextIdx].title || "Next";

    isOpen = true;
    document.body.classList.add("baro-showcase-open");
    showcaseEl.classList.add("is-active");
    showcaseEl.style.display = "block";
    showcaseEl.style.opacity = "1";
    showcaseEl.style.visibility = "visible";
    showcaseEl.style.pointerEvents = "auto";
    showcaseEl.scrollTop = 0;
  }

  // Close Showcase
  function closeShowcase() {
    if (!isOpen) return;
    isOpen = false;

    closeLightbox();
    stopHeroSlideshow();

    document.body.classList.remove("baro-showcase-open");
    if (showcaseEl) {
      showcaseEl.classList.remove("is-active");
    }

    var dot = document.getElementById("dot");
    if (dot) dot.classList.remove("wide");

    var eng = window.baroSphereEngine || window.gnSphereEngine;
    if (eng && typeof eng.closeHeroCard === "function") {
      eng.closeHeroCard();
    }

    var isProjectPage = window.location.pathname.indexOf('project.html') !== -1 || window.location.pathname.indexOf('/work/') !== -1;
    if (isProjectPage && !document.getElementById("gnSphereCanvas")) {
      var isFile = window.location.protocol === 'file:';
      window.location.href = isFile ? 'work.html' : '/work';
    }
  }

  // Live BroadcastChannel synchronization for Showcase
  try {
    var bc = new BroadcastChannel('baropholio_cms_sync');
    bc.onmessage = function () {
      var overlay = document.getElementById("baroShowcaseOverlay");
      if (overlay && overlay.classList.contains("active") && currentRecord) {
        setTimeout(function() {
          var recs = getRecords();
          if (recs && recs[currentProjectIdx]) {
            currentRecord = recs[currentProjectIdx];
            var images = currentRecord.gallery || [currentRecord.image || ""];
            buildDossierAndGallery(currentRecord, images);
          }
        }, 250);
      }
    };
  } catch (e) {}

  window.BaroProjectShowcase = {
    open: openShowcase,
    close: closeShowcase,
    openLightbox: openLightbox,
    closeLightbox: closeLightbox
  };

  window.openBaroProjectShowcase = openShowcase;
  window.closeBaroProjectShowcase = closeShowcase;

  if (!window.openBook) window.openBook = openShowcase;
  if (!window.closeBook) window.closeBook = closeShowcase;
  window.openLightbox = openShowcase;
  window.closeLightbox = closeShowcase;

})(window, document);
