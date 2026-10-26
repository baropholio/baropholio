/**
 * ==============================================================================
 *  3D WEBGL SPHERE ENGINE FOR BAROPHOLIO
 * 
 * 1. Intro sequence:
 *    - 13 tấm ảnh đại diện (ưu tiên thẻ Orange + bổ sung ảnh thật / thẻ trắng đen đại diện)
 *    - Vòng tròn tự động xoay 1/2 vòng ngược chiều kim đồng hồ (-180° / -Math.PI)
 *    - Xoáy xoắn ốc (spiral inward) thu dần bán kính vào tâm, xếp chồng lại đúng 1 ảnh tại tâm
 *    - Từ 1 ảnh ở tâm bung nở (explode / bloom) ra thành quả cầu 3D Fibonacci gồm 28-30 tấm
 * 2. Thẻ trắng đen (Black & White):
 *    - Nếu thiếu ảnh hoặc chưa đủ dự án: tự động sinh các tấm đồ họa kiến trúc trắng đen
 *      monochrome tối giản (Harvard GSD / Monograph style), đảm bảo không bao giờ bị trắng trơn
 * 3. Lăn chuột (Wheel):
 *    - Lăn chuột lên trên / xuống dưới -> tự xoay sang trái / phải theo tốc độ chuột
 * 4. Kéo chuột (Drag):
 *    - Nhấn giữ chuột kéo xoay tự do trong không gian 3 chiều với quán tính ma sát mượt mà
 * 5. Chuột di chuyển (Mouse Parallax / Tilt):
 *    - Khi di chuyển chuột trên màn hình, quả cầu uốn lượn hướng theo con trỏ chuột
 * 6. Kích thước & Tỷ lệ chuẩn xác:
 *    - Chiều cao thẻ ~104px (desktop), aspect ~0.72 (tỷ lệ 3:4 portrait)
 *    - Mọi thẻ luôn hướng mặt về phía người dùng (Billboard billboarding)
 * ==============================================================================
 */

(function (window, document) {
  "use strict";

  // Cấu hình thông số chuyển động và tỷ lệ chuẩn
  var CONFIG = {
    radiusX: 275,
    radiusY: 275,
    radiusZ: 275,
    planeSize: 104,          // Kích thước chiều cao thẻ trên desktop (rõ nét, đúng tỷ lệ)
    aspect: 0.72,            // Tỷ lệ thẻ 3:4 portrait
    dragSpeed: 0.0015,       // Độ nhạy khi kéo chuột xoay
    wheelSpeed: 0.00075,     // Tốc độ xoay trái/phải khi lăn chuột
    friction: 0.94,          // Ma sát quán tính mượt mà
    smoothing: 0.12,         // Làm mượt chuyển động
    autoSpeed: 0.00085,      // Tốc độ tự xoay nhẹ quanh trục nghiêng khi rảnh tay
    spinTilt: 23,            // Trục nghiêng 23 độ thẩm mỹ
    spinTiltDir: 0,
    expandHeightVh: 68,      // Chiều cao khi phóng to hero card (68% chiều cao màn hình)
    expandPush: 1.8,         // Đẩy tỏa các thẻ khác khi expand
    expandFade: 0.0,
    expandDuration: 0.75,
    mobileCircleScale: 0.75,
    logoOrbitRadius: 285,    // Bán kính vòng tròn 13 thẻ ảnh intro
    stackGap: 0.005,         // Độ lệch trục Z khi xếp chồng lại 1 ảnh
    explodeOvershoot: 0.12,  // Độ nảy khi bung ra quả cầu
    ringCount: 13,           // Vòng tròn intro: đúng 13 thẻ
    targetSphereCount: 28    // Quả cầu 3D: 28 thẻ Fibonacci
  };

  // Danh mục ảnh dự án thật có sẵn trong kho lưu trữ
  var VERIFIED_LOCAL_IMAGES = [
    "02.Project/02_/Screenshot 2025-03-24 175306.jpg",
    "02.Project/02_/Screenshot 2025-03-24 175343.jpg",
    "02.Project/02_/Screenshot 2025-03-24 175420.jpg",
    "02.Project/02_/Screenshot 2025-03-24 180357.jpg",
    "02.Project/02_/Screenshot 2025-03-24 180427.jpg",
    "02.Project/02_/Screenshot 2025-03-24 180450.jpg",
    "02.Project/02_/Screenshot 2025-03-24 180517.jpg",
    "02.Project/02_/Screenshot 2025-03-24 180550.jpg",
    "02.Project/02_/Screenshot 2025-03-24 180618.jpg",
    "02.Project/02_/Screenshot 2025-03-24 180645.jpg",
    "02.Project/02_/Screenshot 2025-03-24 180706.jpg",
    "02.Project/02_/Screenshot 2025-03-24 180908.jpg",
    "02.Project/02_/Screenshot 2025-03-24 181045.jpg",
    "02.Project/02_/Screenshot 2025-04-22 010726.jpg",
    "02.Project/02_/Screenshot 2025-04-22 010756.jpg",
    "02.Project/01_ha-tu_261025/1.jpg",
    "02.Project/01_ha-tu_261025/Baro Portfolio25.jpg",
    "02.Project/01_ha-tu_261025/mh.jpg"
  ];

  // Hệ thống âm thanh tương tác xúc giác nhẹ nhàng Web Audio API
  var AudioFX = (function () {
    var ctx = null;
    function getCtx() {
      if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
        try {
          ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {}
      }
      if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(function () {});
      }
      return ctx;
    }
    return {
      tick: function (rate) {
        try {
          var c = getCtx();
          if (!c) return;
          var osc = c.createOscillator();
          var gain = c.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(1200 * (rate || 1), c.currentTime);
          osc.frequency.exponentialRampToValueAtTime(320, c.currentTime + 0.016);
          gain.gain.setValueAtTime(0.03, c.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.016);
          osc.connect(gain);
          gain.connect(c.destination);
          osc.start();
          osc.stop(c.currentTime + 0.018);
        } catch (e) {}
      },
      click: function () {
        try {
          var c = getCtx();
          if (!c) return;
          var osc = c.createOscillator();
          var gain = c.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(440, c.currentTime);
          osc.frequency.exponentialRampToValueAtTime(140, c.currentTime + 0.03);
          gain.gain.setValueAtTime(0.05, c.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.03);
          osc.connect(gain);
          gain.connect(c.destination);
          osc.start();
          osc.stop(c.currentTime + 0.035);
        } catch (e) {}
      }
    };
  })();

  // Hệ thống Easing độc lập (hỗ trợ GSAP hoặc ticker tự động)
  var Easing = {
    power4Out: function (t) { return 1 - Math.pow(1 - t, 4); },
    power3Out: function (t) { return 1 - Math.pow(1 - t, 3); },
    power2InOut: function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; },
    power2In: function (t) { return t * t; },
    power1Out: function (t) { return 1 - (1 - t) * (1 - t); }
  };

  var activeTweens = [];
  function tweenProp(target, prop, toVal, duration, easeName, onComplete) {
    if (window.gsap && window.gsap.to) {
      var vars = { duration: duration, ease: easeName || "power4.out", overwrite: true };
      vars[prop] = toVal;
      if (onComplete) vars.onComplete = onComplete;
      window.gsap.to(target, vars);
      return;
    }
    var fromVal = target[prop] || 0;
    var startT = performance.now();
    var durMs = duration * 1000;
    var easeFn = Easing.power4Out;
    if (easeName === "power3.out") easeFn = Easing.power3Out;
    else if (easeName === "power2.inOut") easeFn = Easing.power2InOut;
    else if (easeName === "power2.in") easeFn = Easing.power2In;
    else if (easeName === "power1.out") easeFn = Easing.power1Out;

    activeTweens = activeTweens.filter(function (tw) {
      return !(tw.target === target && tw.prop === prop);
    });

    activeTweens.push({
      target: target,
      prop: prop,
      from: fromVal,
      to: toVal,
      start: startT,
      dur: durMs,
      ease: easeFn,
      onComplete: onComplete
    });
  }

  function updateTweens(now) {
    for (var i = activeTweens.length - 1; i >= 0; i--) {
      var tw = activeTweens[i];
      var p = Math.min(1, (now - tw.start) / tw.dur);
      var eased = tw.ease(p);
      tw.target[tw.prop] = tw.from + (tw.to - tw.from) * eased;
      if (p >= 1) {
        tw.target[tw.prop] = tw.to;
        activeTweens.splice(i, 1);
        if (tw.onComplete) tw.onComplete();
      }
    }
  }

  // Cover Texture UV Mapping: Cắt cúp ảnh giữ nguyên tỷ lệ không méo
  function applyCoverTexture(tex, w, h, targetAspect) {
    if (!w || !h || !tex) return;
    var curAspect = w / h;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    if (curAspect > targetAspect) {
      var rx = targetAspect / curAspect;
      tex.repeat.set(rx, 1);
      tex.offset.set((1 - rx) / 2, 0);
    } else {
      var ry = curAspect / targetAspect;
      tex.repeat.set(1, ry);
      tex.offset.set(0, (1 - ry) / 2);
    }
    tex.needsUpdate = true;
  }

  /**
   * Tạo Texture đồ họa kiến trúc Trắng Đen (Black & White Monochrome Plate)
   * Phong cách Harvard GSD Monograph: Tối giản, thanh lịch, sang trọng
   * Đảm bảo các thẻ không bao giờ bị trắng trơn lỗi hình
   */
  function createMonochromePlateTexture(record, index, total, isOrangeTag) {
    var canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 710;
    var ctx = canvas.getContext("2d");

    // Nền giấy kiến trúc trắng ngà cao cấp
    ctx.fillStyle = "#faf9f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Viền khung chỉ tóc hairline kép
    ctx.strokeStyle = "rgba(18, 18, 18, 0.85)";
    ctx.lineWidth = 1.8;
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

    ctx.strokeStyle = "rgba(18, 18, 18, 0.15)";
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Đường kẻ phân cách trên & dưới
    ctx.beginPath();
    ctx.moveTo(24, 82);
    ctx.lineTo(canvas.width - 24, 82);
    ctx.moveTo(24, canvas.height - 72);
    ctx.lineTo(canvas.width - 24, canvas.height - 72);
    ctx.stroke();

    // Tiêu đề danh mục Header
    var cat = (record.category || record.cat || "SPATIAL ARCHIVE").toUpperCase();
    if (isOrangeTag) {
      ctx.fillStyle = "#c46210";
      ctx.font = "700 13px 'Space Grotesk', -apple-system, sans-serif";
      ctx.fillText("● " + cat.slice(0, 24), 42, 58);
    } else {
      ctx.fillStyle = "#111111";
      ctx.font = "600 13px 'Space Grotesk', -apple-system, sans-serif";
      ctx.fillText(cat.slice(0, 24), 42, 58);
    }

    // Số thứ tự góc trên phải
    ctx.fillStyle = "rgba(18, 18, 18, 0.65)";
    ctx.font = "500 13px 'Space Grotesk', monospace";
    var num = (index + 1 < 10 ? "0" : "") + (index + 1);
    var tot = (total < 10 ? "0" : "") + total;
    ctx.textAlign = "right";
    ctx.fillText("PLATE " + num + " / " + tot, canvas.width - 42, 58);
    ctx.textAlign = "left";

    // Khung đồ họa trung tâm (Sơ đồ kỹ thuật trắng đen / Wireframe diagram)
    ctx.fillStyle = "#f0ede6";
    ctx.fillRect(42, 102, canvas.width - 84, 238);
    ctx.strokeStyle = "rgba(18, 18, 18, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(42, 102, canvas.width - 84, 238);

    // Vẽ mô hình phối cảnh trục đo Axonometric Wireframe Box hoặc La bàn quy hoạch
    var cx = canvas.width / 2;
    var cy = 221;
    var shapeType = index % 3;

    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1.4;

    if (shapeType === 0) {
      // Khối lập phương axonometric
      var sz = 46;
      ctx.beginPath();
      // Mặt trước
      ctx.strokeRect(cx - sz, cy - sz / 2, sz * 1.3, sz * 1.3);
      // Mặt trên nghiêng
      ctx.moveTo(cx - sz, cy - sz / 2);
      ctx.lineTo(cx - sz + 24, cy - sz / 2 - 24);
      ctx.lineTo(cx - sz + sz * 1.3 + 24, cy - sz / 2 - 24);
      ctx.lineTo(cx - sz + sz * 1.3, cy - sz / 2);
      // Cạnh bên
      ctx.moveTo(cx - sz + sz * 1.3 + 24, cy - sz / 2 - 24);
      ctx.lineTo(cx - sz + sz * 1.3 + 24, cy - sz / 2 + sz * 1.3 - 24);
      ctx.lineTo(cx - sz + sz * 1.3, cy - sz / 2 + sz * 1.3);
      ctx.stroke();

      // Đường gióng nét đứt
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = "rgba(18, 18, 18, 0.4)";
      ctx.beginPath();
      ctx.moveTo(cx - sz, cy - sz / 2 + sz * 1.3);
      ctx.lineTo(cx - sz + 24, cy - sz / 2 + sz * 1.3 - 24);
      ctx.lineTo(cx - sz + 24, cy - sz / 2 - 24);
      ctx.moveTo(cx - sz + 24, cy - sz / 2 + sz * 1.3 - 24);
      ctx.lineTo(cx - sz + sz * 1.3 + 24, cy - sz / 2 + sz * 1.3 - 24);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (shapeType === 1) {
      // Vòng tròn quy hoạch đồng tâm & Hệ trục tọa độ
      ctx.beginPath();
      ctx.arc(cx, cy, 58, 0, Math.PI * 2);
      ctx.arc(cx, cy, 34, 0, Math.PI * 2);
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.moveTo(cx - 74, cy);
      ctx.lineTo(cx + 74, cy);
      ctx.moveTo(cx, cy - 74);
      ctx.lineTo(cx, cy + 74);
      ctx.stroke();
    } else {
      // Đường phân tích địa hình đường đồng mức (Topographic contours)
      ctx.beginPath();
      for (var r = 16; r <= 64; r += 16) {
        ctx.ellipse(cx, cy, r * 1.2, r * 0.75, Math.PI / 8, 0, Math.PI * 2);
      }
      ctx.stroke();
    }

    // Tên dự án (Typography Grotesk đậm nét)
    ctx.fillStyle = "#0d0c0b";
    ctx.font = "700 23px 'Space Grotesk', -apple-system, sans-serif";
    var title = record.title || "Archive Project";
    var words = title.split(" ");
    var line = "";
    var curY = 380;
    for (var w = 0; w < words.length; w++) {
      var testLine = line + words[w] + " ";
      if (ctx.measureText(testLine).width > canvas.width - 88 && w > 0) {
        ctx.fillText(line, 42, curY);
        line = words[w] + " ";
        curY += 30;
        if (curY > 520) break;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 42, curY);

    // Mô tả vắn tắt 2 dòng
    ctx.fillStyle = "rgba(18, 18, 18, 0.65)";
    ctx.font = "400 13px 'Space Grotesk', -apple-system, sans-serif";
    var desc = record.description || record.desc || "Spatial monograph investigation in architecture & urban typography.";
    var descWords = desc.replace(/\\n/g, " ").split(" ");
    var descLine = "";
    var descY = curY + 36;
    for (var d = 0; d < descWords.length; d++) {
      var testD = descLine + descWords[d] + " ";
      if (ctx.measureText(testD).width > canvas.width - 88) {
        ctx.fillText(descLine, 42, descY);
        descLine = descWords[d] + " ";
        descY += 20;
        if (descY > curY + 60) break;
      } else {
        descLine = testD;
      }
    }
    ctx.fillText(descLine, 42, descY);

    // Footer Metadata
    ctx.fillStyle = "rgba(18, 18, 18, 0.75)";
    ctx.font = "500 13px 'Space Grotesk', -apple-system, sans-serif";
    var org = record.organization || record.org || "Baropholio Spatial Design";
    ctx.fillText(org.slice(0, 30), 42, canvas.height - 40);

    ctx.textAlign = "right";
    var yr = record.year || record.date || "2026";
    ctx.fillText(yr, canvas.width - 42, canvas.height - 40);

    var texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Khởi tạo Lớp Engine
  function GNSphereEngine() {
    this.canvas = document.getElementById("gnSphereCanvas");
    if (!this.canvas) return;

    this.cursorPill = document.getElementById("gnCursorPill");
    this.cursorText = document.getElementById("gnPillText");
    this.introOverlay = document.getElementById("gnIntroOverlay");
    this.introCounter = document.getElementById("gnIntroCounter");
    this.projectSheet = document.getElementById("gnProjectSheet");
    this.sheetPreview = document.getElementById("gnSheetPreview");
    this.previewCat = document.getElementById("gnPreviewCat");
    this.previewTitle = document.getElementById("gnPreviewTitle");

    this.sheetExpanded = document.getElementById("gnSheetExpanded");
    this.expandedBadge = document.getElementById("gnExpandedBadge");
    this.expandedYear = document.getElementById("gnExpandedYear");
    this.expandedTitle = document.getElementById("gnExpandedTitle");
    this.expandedOrg = document.getElementById("gnExpandedOrg");
    this.expandedDesc = document.getElementById("gnExpandedDesc");
    this.btnOpenMonograph = document.getElementById("gnBtnOpenMonograph");
    this.btnCloseHero = document.getElementById("gnBtnCloseHero");

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.sphereGroup = null;
    this.cardMeshes = [];
    this.cardItems = [];
    this.planeGeom = null;

    this.activeMode = "sphere"; // "sphere" hoặc "reel"
    this.isIntro = false;
    this.introSpinAngle = 0;     // Góc xoay 1/2 vòng ngược chiều kim đồng hồ
    this.spiralProgress = 0;     // Tiến trình xoắn ốc cuộn vào tâm
    this.explodeProgress = 0;    // Tiến trình bung nở thành quả cầu
    this.expandedIdx = -1;
    this.hoveredIdx = -1;

    // Vật lý quán tính & Ma sát xoay
    this.velX = 0;
    this.velY = 0;
    this.smoothVelX = 0;
    this.smoothVelY = 0;
    this.rotX = 0;
    this.rotY = 0;
    this.te = 0;
    this.tt = 0;
    this.isDragging = false;
    this.downX = 0;
    this.downY = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.dragDist = 0;
    this.sphereQuat = new THREE.Quaternion();
    this.invGroupQuat = new THREE.Quaternion();
    this.tiltedAxis = new THREE.Vector3();
    this.tempQuat = new THREE.Quaternion();
    this.mouseTiltQuat = new THREE.Quaternion();
    this.axisY = new THREE.Vector3(0, 1, 0);
    this.axisX = new THREE.Vector3(1, 0, 0);

    // Chuột di chuyển hướng theo (Mouse Parallax Tilt)
    this.targetMouseTiltX = 0;
    this.targetMouseTiltY = 0;
    this.curMouseTiltX = 0;
    this.curMouseTiltY = 0;

    // Raycasting
    this.raycaster = new THREE.Raycaster();
    this.mouseNdc = new THREE.Vector2(-999, -999);
    this.mouseClient = { x: -999, y: -999 };
    this.lastScrubTick = 0;

    this.boundTick = this.render.bind(this);
    this.init();
  }

  // Tìm nạp dữ liệu an toàn dưới mọi điều kiện tải
  function getSafeRecords(records) {
    if (records && Array.isArray(records) && records.length > 0) return records;
    if (window.RECORDS && Array.isArray(window.RECORDS) && window.RECORDS.length > 0) return window.RECORDS;
    if (typeof window.loadLiveRecords === "function") {
      try {
        var r = window.loadLiveRecords();
        if (r && Array.isArray(r) && r.length > 0) return r;
      } catch (e) {}
    }
    if (window.BAROPHOLIO_PROJECTS && Array.isArray(window.BAROPHOLIO_PROJECTS) && window.BAROPHOLIO_PROJECTS.length > 0) {
      return window.BAROPHOLIO_PROJECTS;
    }
    return [];
  }

  GNSphereEngine.prototype.init = function () {
    if (!this.canvas) return;

    var w = this.canvas.clientWidth || window.innerWidth;
    var h = this.canvas.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    this.camera.position.z = 12;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);

    // Trục tự xoay nghiêng 23 độ
    var radTilt = (CONFIG.spinTilt * Math.PI) / 180;
    var radTiltDir = (CONFIG.spinTiltDir * Math.PI) / 180;
    var s = Math.sin(radTilt);
    this.tiltedAxis.set(s * Math.cos(radTiltDir), Math.cos(radTilt), s * Math.sin(radTiltDir)).normalize();

    this.sphereGroup = new THREE.Group();
    this.scene.add(this.sphereGroup);

    this.planeGeom = new THREE.PlaneGeometry(1, 1);

    this.bindEvents();

    var records = getSafeRecords(window.RECORDS);
    this.rebuild(records);

    this.running = true;
    requestAnimationFrame(this.boundTick);
  };

  GNSphereEngine.prototype.pxToWorld = function (px) {
    var vFovRad = (this.camera.fov * Math.PI) / 360;
    var worldH = 2 * this.camera.position.z * Math.tan(vFovRad);
    var h = this.canvas.clientHeight || window.innerHeight || 1;
    return px * (worldH / h);
  };

  /**
   * Xây dựng danh sách chuẩn xác:
   * - Vòng tròn intro: đúng 13 thẻ đại diện (ưu tiên Orange + bù thẻ B&W đại diện)
   * - Quả cầu 3D: đủ 28 thẻ Fibonacci (bù thẻ B&W đại diện)
   */
  GNSphereEngine.prototype.prepareRecordsList = function (rawRecords) {
    rawRecords = getSafeRecords(rawRecords);

    // Kiểm tra thẻ Orange
    function isOrangeRecord(r) {
      var str = (r.category || r.cat || "") + " " + (r.title || "") + " " + (r.desc || r.description || "");
      return /orange/i.test(str);
    }

    var orangeList = [];
    var otherList = [];

    for (var i = 0; i < rawRecords.length; i++) {
      if (isOrangeRecord(rawRecords[i])) {
        orangeList.push(rawRecords[i]);
      } else {
        otherList.push(rawRecords[i]);
      }
    }

    // 1. Chuẩn bị 13 thẻ cho vòng tròn
    var ringRecords = [];
    for (var o = 0; o < orangeList.length && ringRecords.length < CONFIG.ringCount; o++) {
      ringRecords.push(orangeList[o]);
    }
    for (var u = 0; u < otherList.length && ringRecords.length < CONFIG.ringCount; u++) {
      ringRecords.push(otherList[u]);
    }
    // Nếu vẫn chưa đủ 13 thẻ, sinh thẻ trắng đen đại diện
    var synthRingIdx = 1;
    while (ringRecords.length < CONFIG.ringCount) {
      ringRecords.push({
        id: "synth-ring-" + synthRingIdx,
        title: "Spatial Monograph Study " + (synthRingIdx < 10 ? "0" : "") + synthRingIdx,
        category: "ORANGE ARCHIVE",
        cat: "ORANGE ARCHIVE",
        year: "2026",
        date: "2026",
        organization: "Baropholio Research",
        org: "Baropholio Research",
        description: "Monochrome architectural prototype and spatial typology study.",
        desc: "Monochrome architectural prototype and spatial typology study.",
        isSynthetic: true
      });
      synthRingIdx++;
    }

    // 2. Chuẩn bị toàn bộ 28 thẻ cho quả cầu
    var fullSphereRecords = ringRecords.slice();
    // Bổ sung các record còn lại chưa có trong ring
    for (var r = 0; r < otherList.length && fullSphereRecords.length < CONFIG.targetSphereCount; r++) {
      if (fullSphereRecords.indexOf(otherList[r]) === -1) {
        fullSphereRecords.push(otherList[r]);
      }
    }
    // Nếu tổng số vẫn chưa đủ 28 thẻ, sinh tiếp thẻ trắng đen đại diện
    var synthSphereIdx = 1;
    while (fullSphereRecords.length < CONFIG.targetSphereCount) {
      fullSphereRecords.push({
        id: "synth-sphere-" + synthSphereIdx,
        title: "Urban Topology Monograph " + (synthSphereIdx < 10 ? "0" : "") + synthSphereIdx,
        category: "MONOCHROME ARCHIVE",
        cat: "MONOCHROME ARCHIVE",
        year: "2026",
        date: "2026",
        organization: "Baropholio Spatial Lab",
        org: "Baropholio Spatial Lab",
        description: "Harvard GSD typological investigation exploring high-density urban voids and micro-architectures.",
        desc: "Harvard GSD typological investigation exploring high-density urban voids and micro-architectures.",
        isSynthetic: true
      });
      synthSphereIdx++;
    }

    return {
      ring: ringRecords,
      all: fullSphereRecords
    };
  };

  GNSphereEngine.prototype.rebuild = function (records) {
    var data = this.prepareRecordsList(records);
    var allList = data.all;
    var ringList = data.ring;

    while (this.sphereGroup.children.length > 0) {
      var obj = this.sphereGroup.children[0];
      this.sphereGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (obj.material.map) obj.material.map.dispose();
        obj.material.dispose();
      }
    }
    this.cardMeshes = [];
    this.cardItems = [];

    var N = allList.length;
    var w = this.canvas.clientWidth || window.innerWidth;
    var isMobile = w <= 640;
    var scale = w >= 1025 && w <= 1440 ? 0.88 : 1.0;
    var planeSizePx = isMobile ? 74 : CONFIG.planeSize * scale;
    var planeSizeWorld = this.pxToWorld(planeSizePx);

    // Bán kính quả cầu
    var radPx = CONFIG.radiusX * scale;
    if (isMobile) {
      radPx = Math.max(130, (w - 48) / 2 - planeSizePx / 2);
    }
    var radWorld = this.pxToWorld(radPx);

    var texLoader = new THREE.TextureLoader();

    for (var i = 0; i < N; i++) {
      var rec = allList[i];

      // Phân bố Fibonacci sphere
      var step = 2 / N;
      var y = i * step - 1 + step / 2;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var phi = i * Math.PI * (3 - Math.sqrt(5)); // Golden Angle
      var vx = Math.cos(phi) * r;
      var vz = Math.sin(phi) * r;

      var isRingItem = i < CONFIG.ringCount;
      var ringSlot = isRingItem ? i : -1;
      var isOrange = /orange/i.test((rec.category || rec.cat || "") + " " + (rec.title || ""));

      // Texture trắng đen kiến trúc sang trọng làm mặc định
      var plateTex = createMonochromePlateTexture(rec, i, N, isOrange);

      var mat = new THREE.MeshBasicMaterial({
        map: plateTex,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      var mesh = new THREE.Mesh(this.planeGeom, mat);

      var item = {
        index: i,
        record: rec,
        mesh: mesh,
        aspect: CONFIG.aspect,
        baseScale: new THREE.Vector3(planeSizeWorld * CONFIG.aspect, planeSizeWorld, 1),
        basePos: new THREE.Vector3(vx * radWorld, -y * radWorld, vz * radWorld),
        expand: 0,
        isRingItem: isRingItem,
        ringSlot: ringSlot,
        initialAngle: isRingItem ? -Math.PI / 2 + (2 * Math.PI / CONFIG.ringCount) * ringSlot : 0
      };

      mesh.scale.copy(item.baseScale);
      mesh.position.copy(item.basePos);

      // Tải hình ảnh thực tế nếu có đường dẫn hợp lệ
      var imageSrc = null;
      if (rec.image && !rec.isSynthetic) {
        // Nếu ảnh chỉ là đường dẫn tượng trưng project-01.jpg, ánh xạ sang ảnh thực có sẵn
        if (rec.image.indexOf("project-") !== -1) {
          imageSrc = VERIFIED_LOCAL_IMAGES[i % VERIFIED_LOCAL_IMAGES.length];
        } else {
          imageSrc = rec.image;
        }
      } else if (!rec.isSynthetic && i < VERIFIED_LOCAL_IMAGES.length) {
        imageSrc = VERIFIED_LOCAL_IMAGES[i];
      }

      if (imageSrc) {
        (function (tItem, tMat, src) {
          texLoader.load(
            src,
            function (tex) {
              tex.colorSpace = THREE.SRGBColorSpace;
              tMat.map = tex;
              tMat.needsUpdate = true;
              if (tex.image && tex.image.width && tex.image.height) {
                applyCoverTexture(tex, tex.image.width, tex.image.height, tItem.aspect);
              }
            },
            undefined,
            function () {
              // Khi ảnh tải lỗi, texture trắng đen tinh tế vẫn được giữ nguyên không bao giờ bị trắng trơn!
            }
          );
        })(item, mat, imageSrc);
      }

      this.sphereGroup.add(mesh);
      this.cardMeshes.push(mesh);
      this.cardItems.push(item);
    }
  };

  /**
   * HIỆU ỨNG INTRO CHOREOGRAPHY 1:1 THEO YÊU CẦU:
   * 1. 13 ảnh xếp thành vòng tròn (bộ đếm chạy 001 -> 100)
   * 2. Tự động xoay 1/2 vòng ngược chiều kim đồng hồ (-180° / -Math.PI)
   * 3. Xoáy xoắn ốc (spiral inward) thu dần bán kính vào tâm, xếp chồng lại đúng 1 ảnh tại tâm
   * 4. Từ 1 ảnh ở tâm bung nở (explode / bloom) ra thành quả cầu 3D Fibonacci
   */
  GNSphereEngine.prototype.startIntro = function () {
    if (this.isIntro || this.activeMode !== "sphere") return;
    if (!this.cardItems || this.cardItems.length === 0) {
      this.rebuild(getSafeRecords(window.RECORDS));
    }

    this.isIntro = true;
    this.introSpinAngle = 0;
    this.spiralProgress = 0;
    this.explodeProgress = 0;

    var self = this;
    if (this.introOverlay) this.introOverlay.classList.add("active");
    if (this.introCounter) this.introCounter.textContent = "001";

    var w = this.canvas.clientWidth || window.innerWidth;
    var isMobile = w <= 640;
    var orbitRadPx = CONFIG.logoOrbitRadius * (isMobile ? CONFIG.mobileCircleScale : 1);
    var orbitRadWorld = this.pxToWorld(orbitRadPx);

    // Giai đoạn 1: 13 ảnh sắp xếp thành vòng tròn, các thẻ ngoài vòng tròn ẩn ở tâm
    for (var i = 0; i < this.cardItems.length; i++) {
      var item = this.cardItems[i];
      if (item.isRingItem) {
        var ang = item.initialAngle;
        item.mesh.position.set(Math.cos(ang) * orbitRadWorld, Math.sin(ang) * orbitRadWorld, 0);
        item.mesh.material.opacity = 0;
        tweenProp(item.mesh.material, "opacity", 1, 0.75, "power3.out");
      } else {
        item.mesh.material.opacity = 0;
        item.mesh.position.set(0, 0, 0);
      }
    }

    // Bộ đếm số 001 -> 100
    var counterObj = { count: 1 };
    tweenProp(counterObj, "count", 100, 1.3, "power1.out");
    var counterTimer = setInterval(function () {
      var n = Math.round(counterObj.count);
      if (self.introCounter) {
        self.introCounter.textContent = (n < 10 ? "00" : n < 100 ? "0" : "") + n;
      }
      if (n >= 100) clearInterval(counterTimer);
    }, 32);

    // Giai đoạn 2: Tự động xoay 1/2 vòng ngược chiều kim đồng hồ (-180° = -Math.PI)
    setTimeout(function () {
      if (!self.isIntro) return;
      AudioFX.tick(0.95);
      tweenProp(self, "introSpinAngle", -Math.PI, 1.25, "power2.inOut");
    }, 1100);

    // Giai đoạn 3: Xoáy xoắn ốc (spiral inward) thu dần bán kính và xoay nhiều vòng, xếp chồng lại 1 ảnh tại tâm
    setTimeout(function () {
      if (!self.isIntro) return;
      if (self.introOverlay) self.introOverlay.classList.remove("active");

      tweenProp(self, "spiralProgress", 1, 1.45, "power2.inOut");
    }, 2500);

    // Giai đoạn 4: Từ 1 ảnh ở tâm bung ra thành quả cầu 3D Fibonacci
    setTimeout(function () {
      if (!self.isIntro) return;
      AudioFX.click();

      // Đưa toàn bộ các thẻ lên opacity 1 chuẩn bị bung nở
      for (var k = 0; k < self.cardItems.length; k++) {
        self.cardItems[k].mesh.material.opacity = 1;
      }

      tweenProp(self, "explodeProgress", 1, 1.1, "power3.out", function () {
        self.endIntro();
      });
    }, 4250);
  };

  GNSphereEngine.prototype.endIntro = function () {
    this.isIntro = false;
    this.introSpinAngle = 0;
    this.spiralProgress = 0;
    this.explodeProgress = 0;
    if (this.introOverlay) this.introOverlay.classList.remove("active");

    for (var i = 0; i < this.cardItems.length; i++) {
      var itm = this.cardItems[i];
      itm.mesh.position.copy(itm.basePos);
      itm.mesh.scale.copy(itm.baseScale);
      itm.mesh.material.opacity = 1;
    }
  };

  // Phóng to Hero Card khi click
  GNSphereEngine.prototype.expandCard = function (index) {
    if (index < 0 || index >= this.cardItems.length) return;
    this.expandedIdx = index;
    document.body.classList.add("has-expanded-card");
    AudioFX.click();

    var item = this.cardItems[index];
    tweenProp(item, "expand", 1, CONFIG.expandDuration, "power4.out");

    if (this.sheetPreview) this.sheetPreview.classList.remove("show");

    var rec = item.record;
    var cat = rec.category || rec.cat || "ARCHIVE PROJECT";
    var num = (index + 1 < 10 ? "0" : "") + (index + 1);
    var tot = (this.cardItems.length < 10 ? "0" : "") + this.cardItems.length;

    if (this.expandedBadge) this.expandedBadge.textContent = "PROJECT " + num + " / " + tot + " • " + cat;
    if (this.expandedYear) this.expandedYear.textContent = rec.year || rec.date || "2026";
    if (this.expandedTitle) this.expandedTitle.textContent = rec.title || "Untitled Project";
    if (this.expandedOrg) this.expandedOrg.textContent = rec.organization || rec.org || "Baropholio Spatial Archive";
    if (this.expandedDesc) this.expandedDesc.textContent = rec.description || rec.desc || "Spatial monograph exploration within the Baropholio architectural archive.";

    if (this.sheetExpanded) this.sheetExpanded.classList.add("show");
    this.updateCursorPill(true, "CLOSE", true);
  };

  GNSphereEngine.prototype.closeHeroCard = function () {
    if (this.expandedIdx === -1) return;
    AudioFX.click();
    var prevItem = this.cardItems[this.expandedIdx];
    this.expandedIdx = -1;
    document.body.classList.remove("has-expanded-card");

    if (this.sheetExpanded) this.sheetExpanded.classList.remove("show");

    if (prevItem) {
      tweenProp(prevItem, "expand", 0, 0.65, "power4.out");
    }
    this.updateCursorPill(false, "DRAG");
  };

  GNSphereEngine.prototype.updateCursorPill = function () {
    // Disabled per user request (bỏ hiển thị EXPAND và CLOSE khi chuột chạm vào)
  };

  GNSphereEngine.prototype.setMode = function (newMode) {
    this.activeMode = newMode;
    if (newMode === "reel") {
      this.closeHeroCard();
      this.updateCursorPill(false);
      if (this.sheetPreview) this.sheetPreview.classList.remove("show");
    }
  };

  // Lắng nghe tương tác người dùng: Drag, Wheel, Mouse Tilt, Click
  GNSphereEngine.prototype.bindEvents = function () {
    var self = this;

    // Window Resize
    window.addEventListener("resize", function () {
      if (!self.canvas || !self.renderer || !self.camera) return;
      var nw = self.canvas.clientWidth || window.innerWidth;
      var nh = self.canvas.clientHeight || window.innerHeight;
      self.camera.aspect = nw / nh;
      self.camera.updateProjectionMatrix();
      self.renderer.setSize(nw, nh, false);
      var records = getSafeRecords(window.RECORDS);
      self.rebuild(records);
    });

    // Pointer Down (Bắt đầu kéo chuột)
    this.canvas.addEventListener("pointerdown", function (e) {
      if (self.activeMode !== "sphere") return;
      if (self.isIntro) {
        self.endIntro();
        return;
      }
      self.isDragging = true;
      self.downX = e.clientX;
      self.downY = e.clientY;
      self.lastX = e.clientX;
      self.lastY = e.clientY;
      self.dragDist = 0;
      self.velX = 0;
      self.velY = 0;
      self.te = 0;
      self.tt = 0;
      try {
        self.canvas.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    // Pointer Move (Mouse Parallax Tilt + Kéo xoay quả cầu)
    window.addEventListener("pointermove", function (e) {
      self.mouseClient.x = e.clientX;
      self.mouseClient.y = e.clientY;

      // Cập nhật vị trí Cursor Pill
      if (self.cursorPill) {
        self.cursorPill.style.transform = "translate3d(" + e.clientX + "px, " + e.clientY + "px, 0) translate(-50%, -150%)";
      }

      // Parallax Tilt: Quả cầu uốn lượn hướng nhẹ theo vị trí con trỏ chuột
      var normX = e.clientX / (window.innerWidth || 1) - 0.5;
      var normY = e.clientY / (window.innerHeight || 1) - 0.5;
      self.targetMouseTiltX = -normY * 0.28; // Chuột lên thì ngước lên, chuột xuống chúc xuống
      self.targetMouseTiltY = normX * 0.36;  // Chuột sang phải thì nghiêng sang phải

      if (self.activeMode !== "sphere") return;

      var rect = self.canvas.getBoundingClientRect();
      self.mouseNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      self.mouseNdc.y = -(((e.clientY - rect.top) / rect.height) * 2) + 1;

      // Đang ấn giữ kéo chuột xoay quả cầu
      if (self.isDragging) {
        var dx = e.clientX - self.lastX;
        var dy = e.clientY - self.lastY;
        self.lastX = e.clientX;
        self.lastY = e.clientY;
        self.dragDist += Math.hypot(dx, dy);

        if (self.expandedIdx === -1) {
          self.te += dx * CONFIG.dragSpeed;
          self.tt += dy * CONFIG.dragSpeed;

          var now = performance.now();
          if (Math.hypot(dx, dy) > 2.5 && now - self.lastScrubTick > 75) {
            AudioFX.tick(0.9 + Math.random() * 0.2);
            self.lastScrubTick = now;
          }
        }
        return;
      }

      // Hover Raycasting khi rảnh tay
      if (!self.isDragging && self.expandedIdx === -1 && !self.isIntro) {
        self.raycaster.setFromCamera(self.mouseNdc, self.camera);
        var intersects = self.raycaster.intersectObjects(self.cardMeshes, false);

        if (intersects.length > 0) {
          var hitMesh = intersects[0].object;
          var foundItem = self.cardItems.find(function (it) {
            return it.mesh === hitMesh;
          });

          if (foundItem) {
            if (self.hoveredIdx !== foundItem.index) {
              self.hoveredIdx = foundItem.index;
              AudioFX.tick(1.15);

              var r = foundItem.record;
              if (self.previewCat) self.previewCat.textContent = r.category || r.cat || "ORANGE ARCHIVE";
              if (self.previewTitle) self.previewTitle.textContent = r.title || "Untitled Project";
              if (self.sheetPreview) self.sheetPreview.classList.add("show");
            }
            self.canvas.style.cursor = "pointer";
            self.updateCursorPill(true, "EXPAND", false);
            return;
          }
        }

        if (self.hoveredIdx !== -1) {
          self.hoveredIdx = -1;
          if (self.sheetPreview) self.sheetPreview.classList.remove("show");
        }
        self.canvas.style.cursor = "grab";
        self.updateCursorPill(false, "DRAG");
      }
    });

    // Pointer Up
    window.addEventListener("pointerup", function (e) {
      if (!self.isDragging) return;
      self.isDragging = false;

      // Nhấp chuột (click)
      if (self.dragDist < 8) {
        var rect = self.canvas.getBoundingClientRect();
        self.mouseNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        self.mouseNdc.y = -(((e.clientY - rect.top) / rect.height) * 2) + 1;
        self.raycaster.setFromCamera(self.mouseNdc, self.camera);
        var intersects = self.raycaster.intersectObjects(self.cardMeshes, false);

        if (self.expandedIdx !== -1) {
          if (intersects.length > 0 && intersects[0].object === self.cardItems[self.expandedIdx].mesh) {
            if (window.openBook) window.openBook(self.expandedIdx);
          } else {
            self.closeHeroCard();
          }
        } else {
          if (intersects.length > 0) {
            var hitMesh = intersects[0].object;
            var hitItem = self.cardItems.find(function (it) {
              return it.mesh === hitMesh;
            });
            if (hitItem) {
              self.expandCard(hitItem.index);
            }
          }
        }
      }
    });

    /**
     * TƯƠNG TÁC LĂN CHUỘT:
     * Lăn chuột lên trên / xuống dưới -> tự xoay sang trái / phải theo tốc độ lăn chuột
     */
    this.canvas.addEventListener(
      "wheel",
      function (e) {
        if (self.activeMode !== "sphere") return;
        e.preventDefault();
        if (self.expandedIdx === -1 && !self.isIntro) {
          // e.deltaY > 0 (lăn xuống) -> xoay sang phải
          // e.deltaY < 0 (lăn lên) -> xoay sang trái
          self.te += e.deltaY * CONFIG.wheelSpeed;
        }
      },
      { passive: false }
    );

    // Phím Escape đóng card phóng to
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && self.expandedIdx !== -1) {
        self.closeHeroCard();
      }
    });

    if (this.btnOpenMonograph) {
      this.btnOpenMonograph.addEventListener("click", function (e) {
        e.stopPropagation();
        if (self.expandedIdx !== -1 && window.openBook) {
          window.openBook(self.expandedIdx);
        }
      });
    }

    if (this.btnCloseHero) {
      this.btnCloseHero.addEventListener("click", function (e) {
        e.stopPropagation();
        self.closeHeroCard();
      });
    }
  };

  // Vòng lặp Render 60/120fps
  GNSphereEngine.prototype.render = function () {
    if (!this.running) return;
    requestAnimationFrame(this.boundTick);

    var now = performance.now();
    updateTweens(now);

    if (this.activeMode !== "sphere") {
      return;
    }

    // 1. Quán tính vật lý khi xoay (từ kéo chuột hoặc lăn chuột)
    if (!this.isDragging && this.expandedIdx === -1 && !this.isIntro) {
      this.rotX += this.te;
      this.rotY += this.tt;
      this.te *= CONFIG.friction;
      this.tt *= CONFIG.friction;
      this.smoothVelX += (this.rotX - this.smoothVelX) * CONFIG.smoothing;
      this.smoothVelY += (this.rotY - this.smoothVelY) * CONFIG.smoothing;

      var deltaX = this.smoothVelX - (this.lastSmoothX || 0);
      var deltaY = this.smoothVelY - (this.lastSmoothY || 0);
      this.lastSmoothX = this.smoothVelX;
      this.lastSmoothY = this.smoothVelY;

      this.tempQuat.setFromAxisAngle(this.axisY, deltaX);
      this.sphereQuat.premultiply(this.tempQuat);
      this.tempQuat.setFromAxisAngle(this.axisX, deltaY);
      this.sphereQuat.premultiply(this.tempQuat);

      // Tự động trôi nhẹ quanh trục nghiêng 23 độ khi rảnh tay
      this.tempQuat.setFromAxisAngle(this.tiltedAxis, CONFIG.autoSpeed);
      this.sphereQuat.premultiply(this.tempQuat);

      this.sphereQuat.normalize();
    } else if (this.isDragging) {
      this.rotX += this.te;
      this.rotY += this.tt;
      this.te = 0;
      this.tt = 0;
      this.smoothVelX += (this.rotX - this.smoothVelX) * CONFIG.smoothing;
      this.smoothVelY += (this.rotY - this.smoothVelY) * CONFIG.smoothing;

      var dX = this.smoothVelX - (this.lastSmoothX || 0);
      var dY = this.smoothVelY - (this.lastSmoothY || 0);
      this.lastSmoothX = this.smoothVelX;
      this.lastSmoothY = this.smoothVelY;

      this.tempQuat.setFromAxisAngle(this.axisY, dX);
      this.sphereQuat.premultiply(this.tempQuat);
      this.tempQuat.setFromAxisAngle(this.axisX, dY);
      this.sphereQuat.premultiply(this.tempQuat);

      this.sphereQuat.normalize();
    }

    // 2. Parallax: Quả cầu uốn lượn hướng theo con trỏ chuột
    this.curMouseTiltX += (this.targetMouseTiltX - this.curMouseTiltX) * 0.055;
    this.curMouseTiltY += (this.targetMouseTiltY - this.curMouseTiltY) * 0.055;
    this.mouseTiltQuat.setFromEuler(new THREE.Euler(this.curMouseTiltX, this.curMouseTiltY, 0, "YXZ"));

    // Kết hợp xoay quả cầu + nghiêng theo chuột
    this.sphereGroup.quaternion.copy(this.sphereQuat).premultiply(this.mouseTiltQuat);

    // 3. Billboarding: Mỗi thẻ tự động xoay ngược ma trận group để luôn phẳng với màn hình
    this.invGroupQuat.copy(this.sphereGroup.quaternion).invert();

    // 4. Xử lý diễn hoạt Intro (13 Ring -> 1/2 Turn CCW -> Spiral Collapse -> Explode)
    if (this.isIntro) {
      var w = this.canvas.clientWidth || window.innerWidth;
      var isMobile = w <= 640;
      var orbitRad = this.pxToWorld(CONFIG.logoOrbitRadius * (isMobile ? CONFIG.mobileCircleScale : 1));
      var stackGapWorld = this.pxToWorld(CONFIG.stackGap);

      for (var i = 0; i < this.cardItems.length; i++) {
        var it = this.cardItems[i];
        it.mesh.quaternion.copy(this.invGroupQuat);

        if (it.isRingItem) {
          var baseAng = it.initialAngle;
          var spinAng = this.introSpinAngle;

          // Xoáy xoắn ốc cuộn vào tâm
          var sp = this.spiralProgress;
          var curRadius = orbitRad * Math.pow(Math.max(0, 1 - sp), 1.35);
          var swirl = -Math.PI * 3.0 * sp; // Xoáy thêm 1.5 vòng vào tâm
          var finalAngle = baseAng + spinAng + swirl;

          var cx = Math.cos(finalAngle) * curRadius;
          var cy = Math.sin(finalAngle) * curRadius;
          var cz = (it.ringSlot * stackGapWorld) * sp;

          // Khi cuộn gần sát tâm, các thẻ từ số 1..12 ẩn dần sau thẻ số 0
          if (it.ringSlot > 0 && sp > 0.75) {
            it.mesh.material.opacity = Math.max(0, 1 - (sp - 0.75) * 4);
          } else {
            it.mesh.material.opacity = 1;
          }

          // Bung nở thành quả cầu
          if (this.explodeProgress > 0) {
            var ep = this.explodeProgress;
            var overshoot = 1 + CONFIG.explodeOvershoot * Math.sin(Math.PI * ep);
            var exX = it.basePos.x * ep * overshoot;
            var exY = it.basePos.y * ep * overshoot;
            var exZ = it.basePos.z * ep * overshoot;
            it.mesh.position.set(cx * (1 - ep) + exX, cy * (1 - ep) + exY, cz * (1 - ep) + exZ);
            it.mesh.material.opacity = 1;
          } else {
            it.mesh.position.set(cx, cy, cz);
          }
        } else {
          // Các thẻ ngoài 13 thẻ ring bung nở từ tâm ra quả cầu
          if (this.explodeProgress > 0) {
            var ep2 = this.explodeProgress;
            var overshoot2 = 1 + CONFIG.explodeOvershoot * Math.sin(Math.PI * ep2);
            it.mesh.position.set(it.basePos.x * ep2 * overshoot2, it.basePos.y * ep2 * overshoot2, it.basePos.z * ep2 * overshoot2);
            it.mesh.material.opacity = ep2;
          } else {
            it.mesh.position.set(0, 0, 0);
            it.mesh.material.opacity = 0;
          }
        }
      }
      this.renderer.render(this.scene, this.camera);
      return;
    }

    // 5. Hero Card Expansion & Radial Push Math (Khi nhấp mở rộng thẻ)
    var maxExpand = 0;
    for (var m = 0; m < this.cardItems.length; m++) {
      if (this.cardItems[m].expand > maxExpand) maxExpand = this.cardItems[m].expand;
    }

    var expandPush = 1 + (CONFIG.expandPush - 1) * maxExpand;
    var expandFade = 1 + (CONFIG.expandFade - 1) * maxExpand;

    var vFovRad = (this.camera.fov * Math.PI) / 360;
    var frustumH = 2 * this.camera.position.z * Math.tan(vFovRad);
    var heroH = (CONFIG.expandHeightVh / 100) * frustumH;
    var heroCenter = new THREE.Vector3(0, 0, 0).applyQuaternion(this.invGroupQuat);

    for (var j = 0; j < this.cardItems.length; j++) {
      var item = this.cardItems[j];
      item.mesh.quaternion.copy(this.invGroupQuat);

      var t = item.expand; // 0 -> 1
      var heroW = heroH * item.aspect;

      var scX = item.baseScale.x + (heroW - item.baseScale.x) * t;
      var scY = item.baseScale.y + (heroH - item.baseScale.y) * t;
      item.mesh.scale.set(scX, scY, 1);

      var push = t > 0.001 ? 1 : expandPush;
      var px = item.basePos.x * push;
      var py = item.basePos.y * push;
      var pz = item.basePos.z * push;

      item.mesh.position.set(px + (heroCenter.x - px) * t, py + (heroCenter.y - py) * t, pz + (heroCenter.z - pz) * t);

      if (t > 0.001) {
        item.mesh.material.opacity = 1;
        item.mesh.renderOrder = 10;
      } else {
        item.mesh.material.opacity = Math.max(0, expandFade);
        item.mesh.renderOrder = 0;
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  function initEngine() {
    if (window.gnSphereEngine) return;
    if (typeof THREE === "undefined") {
      setTimeout(initEngine, 40);
      return;
    }
    window.gnSphereEngine = new GNSphereEngine();
    if (document.body && document.body.classList.contains("revealed")) {
      window.gnSphereEngine.startIntro();
    }
  }

  // Khởi tạo ngay lập tức nếu DOM đã sẵn sàng hoặc gắn sự kiện
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEngine);
  } else {
    initEngine();
  }

})(window, document);
