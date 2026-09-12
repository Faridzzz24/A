import { sound } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
  const photostrip = document.getElementById('photostrip');
  const stripDateLabel = document.getElementById('stripDateLabel');
  const cameraFlash = document.getElementById('cameraFlash');
  const bgmBtn = document.getElementById('bgmBtn');
  const sfxBtn = document.getElementById('sfxBtn');
  const sfxIcon = document.getElementById('sfxIcon');
  const downloadBtn = document.getElementById('downloadBtn');
  const clearStickersBtn = document.getElementById('clearStickersBtn');

  // Photo Adjust Controls
  const cutSelectButtons = document.querySelectorAll('.cut-select-btn');
  const photoFileInput = document.getElementById('photoFileInput');
  const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
  const openCameraBtn = document.getElementById('openCameraBtn');
  const zoomSlider = document.getElementById('zoomSlider');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const zoomValLabel = document.getElementById('zoomValLabel');
  const resetPositionBtn = document.getElementById('resetPositionBtn');

  // Camera Modal Elements
  const cameraModal = document.getElementById('cameraModal');
  const closeCameraBtn = document.getElementById('closeCameraBtn');
  const cameraVideo = document.getElementById('cameraVideo');
  const cameraCountdown = document.getElementById('cameraCountdown');
  const cameraTargetLabel = document.getElementById('cameraTargetLabel');
  const takeSnapshotBtn = document.getElementById('takeSnapshotBtn');
  const cameraFallbackMsg = document.getElementById('cameraFallbackMsg');
  const fallbackUploadBtn = document.getElementById('fallbackUploadBtn');

  // Format date: YYYY.MM.DD
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  stripDateLabel.textContent = `${year}.${month}.${day}`;

  // =========================================================================
  // PHOTO STATE & CONFIGURATIONS
  // =========================================================================
  const photoConfigs = [
    { src: 'photo1.jpeg', scale: 1.0, panX: 0, panY: 0, alignX: 0.50, alignY: 0.20 },
    { src: 'photo2.jpeg', scale: 1.0, panX: 0, panY: 0, alignX: 0.70, alignY: 0.32 },
    { src: 'photo3.jpeg', scale: 1.0, panX: 0, panY: 0, alignX: 0.50, alignY: 0.25 },
    { src: 'photo4.jpeg', scale: 1.0, panX: 0, panY: 0, alignX: 0.50, alignY: 0.24 }
  ];

  let selectedCutIndex = 0;
  const photoItems = document.querySelectorAll('.strip-photo-item');

  function selectCut(idx) {
    selectedCutIndex = idx;
    cutSelectButtons.forEach((b, i) => b.classList.toggle('active', i === idx));
    photoItems.forEach((item, i) => item.classList.toggle('is-selected', i === idx));

    const cfg = photoConfigs[idx];
    zoomSlider.value = cfg.scale;
    zoomValLabel.textContent = `${cfg.scale.toFixed(1)}x`;

    if (cameraTargetLabel) {
      cameraTargetLabel.innerHTML = `Foto akan masuk ke: <strong>Cut ${idx + 1}</strong>`;
    }
  }

  function updatePhotoTransform(idx) {
    const item = document.querySelector(`.strip-photo-item[data-frame="${idx}"] .strip-img`);
    const cfg = photoConfigs[idx];
    if (item) {
      item.style.transform = `translate(${cfg.panX}px, ${cfg.panY}px) scale(${cfg.scale})`;
    }
    if (idx === selectedCutIndex) {
      zoomSlider.value = cfg.scale;
      zoomValLabel.textContent = `${cfg.scale.toFixed(1)}x`;
    }
  }

  // Initialize selection
  selectCut(0);

  // Cut buttons click
  cutSelectButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      sound.playPop(650 + idx * 50);
      selectCut(idx);
    });
  });

  // Upload Custom Photo from Gallery
  uploadPhotoBtn.addEventListener('click', () => {
    sound.playTap();
    photoFileInput.click();
  });

  photoFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      photoConfigs[selectedCutIndex].src = dataUrl;
      photoConfigs[selectedCutIndex].scale = 1.0;
      photoConfigs[selectedCutIndex].panX = 0;
      photoConfigs[selectedCutIndex].panY = 0;
      photoConfigs[selectedCutIndex].alignX = 0.5;
      photoConfigs[selectedCutIndex].alignY = 0.5;

      const imgEl = document.querySelector(`.strip-photo-item[data-frame="${selectedCutIndex}"] .strip-img`);
      if (imgEl) {
        imgEl.src = dataUrl;
        imgEl.style.objectPosition = 'center center';
        updatePhotoTransform(selectedCutIndex);
      }
      sound.playSuccess();
    };
    reader.readAsDataURL(file);
    photoFileInput.value = '';
  });

  // =========================================================================
  // LIVE CAMERA CAPTURE (WEBCAM / HP FRONT CAMERA)
  // =========================================================================
  let cameraStream = null;

  openCameraBtn.addEventListener('click', async () => {
    sound.playTap();
    cameraTargetLabel.innerHTML = `Foto akan masuk ke: <strong>Cut ${selectedCutIndex + 1}</strong>`;
    cameraModal.style.display = 'flex';
    cameraFallbackMsg.style.display = 'none';
    takeSnapshotBtn.style.display = 'inline-flex';
    takeSnapshotBtn.disabled = false;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      cameraFallbackMsg.style.display = 'flex';
      takeSnapshotBtn.style.display = 'none';
      return;
    }

    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      });
      cameraVideo.srcObject = cameraStream;
    } catch (err) {
      console.warn('Camera error or permission dismissed:', err);
      cameraFallbackMsg.style.display = 'flex';
      takeSnapshotBtn.style.display = 'none';
    }
  });

  function closeCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    cameraModal.style.display = 'none';
    cameraCountdown.style.display = 'none';
    cameraFallbackMsg.style.display = 'none';
    takeSnapshotBtn.disabled = false;
  }

  closeCameraBtn.addEventListener('click', () => {
    sound.playTap();
    closeCamera();
  });

  fallbackUploadBtn.addEventListener('click', () => {
    sound.playTap();
    closeCamera();
    photoFileInput.click();
  });

  takeSnapshotBtn.addEventListener('click', () => {
    sound.playChime(600);
    takeSnapshotBtn.disabled = true;
    cameraCountdown.style.display = 'flex';
    let count = 3;
    cameraCountdown.textContent = count;

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        sound.playPop(550 + count * 100);
        cameraCountdown.textContent = count;
      } else {
        clearInterval(timer);
        captureLivePhoto();
      }
    }, 700);
  });

  function captureLivePhoto() {
    sound.playShutter();
    cameraFlash.classList.add('flash-active');
    setTimeout(() => cameraFlash.classList.remove('flash-active'), 150);

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = cameraVideo.videoWidth || 640;
    offscreenCanvas.height = cameraVideo.videoHeight || 480;
    const offCtx = offscreenCanvas.getContext('2d');

    // Flip horizontally because video is mirrored
    offCtx.translate(offscreenCanvas.width, 0);
    offCtx.scale(-1, 1);
    offCtx.drawImage(cameraVideo, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

    const dataUrl = offscreenCanvas.toDataURL('image/jpeg', 0.95);

    photoConfigs[selectedCutIndex].src = dataUrl;
    photoConfigs[selectedCutIndex].scale = 1.0;
    photoConfigs[selectedCutIndex].panX = 0;
    photoConfigs[selectedCutIndex].panY = 0;
    photoConfigs[selectedCutIndex].alignX = 0.5;
    photoConfigs[selectedCutIndex].alignY = 0.5;

    const imgEl = document.querySelector(`.strip-photo-item[data-frame="${selectedCutIndex}"] .strip-img`);
    if (imgEl) {
      imgEl.src = dataUrl;
      imgEl.style.objectPosition = 'center center';
      updatePhotoTransform(selectedCutIndex);
    }

    closeCamera();
    sound.playSuccess();
  }

  // Zoom Controls
  zoomSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    photoConfigs[selectedCutIndex].scale = val;
    updatePhotoTransform(selectedCutIndex);
  });

  zoomInBtn.addEventListener('click', () => {
    sound.playTap();
    let current = photoConfigs[selectedCutIndex].scale;
    current = Math.min(3.0, current + 0.15);
    photoConfigs[selectedCutIndex].scale = current;
    updatePhotoTransform(selectedCutIndex);
  });

  zoomOutBtn.addEventListener('click', () => {
    sound.playTap();
    let current = photoConfigs[selectedCutIndex].scale;
    current = Math.max(0.8, current - 0.15);
    photoConfigs[selectedCutIndex].scale = current;
    updatePhotoTransform(selectedCutIndex);
  });

  resetPositionBtn.addEventListener('click', () => {
    sound.playPop(500);
    photoConfigs[selectedCutIndex].scale = 1.0;
    photoConfigs[selectedCutIndex].panX = 0;
    photoConfigs[selectedCutIndex].panY = 0;
    updatePhotoTransform(selectedCutIndex);
  });

  // =========================================================================
  // DIRECT TOUCH / MOUSE PAN & PINCH ZOOM ON PHOTO
  // =========================================================================
  photoItems.forEach((item, idx) => {
    let isPanning = false;
    let startX = 0, startY = 0;
    let initialPanX = 0, initialPanY = 0;
    let initialPinchDist = 0;
    let initialScale = 1.0;

    item.addEventListener('pointerdown', (e) => {
      if (e.target.classList.contains('dropped-sticker')) return;

      selectCut(idx);
      isPanning = true;
      item.classList.add('is-panning');
      item.setPointerCapture(e.pointerId);

      startX = e.clientX;
      startY = e.clientY;
      initialPanX = photoConfigs[idx].panX;
      initialPanY = photoConfigs[idx].panY;
      sound.vibrate(6);
    });

    item.addEventListener('pointermove', (e) => {
      if (!isPanning) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      photoConfigs[idx].panX = initialPanX + dx;
      photoConfigs[idx].panY = initialPanY + dy;
      updatePhotoTransform(idx);
    });

    const onPointerEnd = (e) => {
      if (!isPanning) return;
      isPanning = false;
      item.classList.remove('is-panning');
      try { item.releasePointerCapture(e.pointerId); } catch (err) {}
    };

    item.addEventListener('pointerup', onPointerEnd);
    item.addEventListener('pointercancel', onPointerEnd);

    // Mouse Wheel Zoom
    item.addEventListener('wheel', (e) => {
      e.preventDefault();
      selectCut(idx);
      let s = photoConfigs[idx].scale;
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      s = Math.min(3.0, Math.max(0.8, s + delta));
      photoConfigs[idx].scale = s;
      updatePhotoTransform(idx);
    }, { passive: false });

    // Touch Pinch-to-zoom on Mobile
    item.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialPinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialScale = photoConfigs[idx].scale;
      }
    });

    item.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialPinchDist > 0) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const ratio = dist / initialPinchDist;
        const newScale = Math.min(3.0, Math.max(0.8, initialScale * ratio));
        photoConfigs[idx].scale = newScale;
        updatePhotoTransform(idx);
      }
    });
  });

  // =========================================================================
  // TAB NAVIGATION
  // =========================================================================
  const tabButtons = document.querySelectorAll('.c-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playPop(700);
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const target = btn.dataset.tab;
      if (target === 'adjust') document.getElementById('paneAdjust').classList.add('active');
      if (target === 'frames') document.getElementById('paneFrames').classList.add('active');
      if (target === 'filters') document.getElementById('paneFilters').classList.add('active');
      if (target === 'stickers') document.getElementById('paneStickers').classList.add('active');
    });
  });

  // =========================================================================
  // FRAME THEMED SELECTION (BANYAK VARIAN & TIDAK POLOS)
  // =========================================================================
  const frameButtons = document.querySelectorAll('.color-swatch-btn');
  frameButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playPop(800);
      frameButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const frameClass = btn.dataset.frame;
      photostrip.className = photostrip.className
        .replace(/frame-\w+(-\w+)?/g, '')
        .trim();
      photostrip.classList.add(frameClass);
    });
  });

  // =========================================================================
  // FILTER SELECTION
  // =========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playPop(750);
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterClass = btn.dataset.filter;
      photostrip.className = photostrip.className
        .replace(/filter-\w+/g, '')
        .trim();
      photostrip.classList.add(filterClass);
    });
  });

  // =========================================================================
  // STICKER TRAY & PURIKURA DECORATION
  // =========================================================================
  const stickerChips = document.querySelectorAll('.sticker-chip');
  stickerChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const emoji = chip.dataset.sticker;
      addStickerToFrame(selectedCutIndex, emoji);
    });
  });

  function addStickerToFrame(frameIdx, emoji) {
    sound.playPop(900);
    const layer = document.getElementById(`layer${frameIdx}`);
    if (!layer) return;

    const sticker = document.createElement('div');
    sticker.className = 'dropped-sticker';
    sticker.textContent = emoji;

    const startX = 25 + Math.random() * 50;
    const startY = 25 + Math.random() * 50;
    sticker.style.left = `${startX}%`;
    sticker.style.top = `${startY}%`;

    makeStickerDraggable(sticker, layer);

    sticker.addEventListener('dblclick', () => {
      sound.playPop(400);
      sticker.remove();
    });

    layer.appendChild(sticker);
  }

  function makeStickerDraggable(el, container) {
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;

    const onPointerDown = (e) => {
      isDragging = true;
      el.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;

      const rect = el.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();

      initialLeft = rect.left - contRect.left;
      initialTop = rect.top - contRect.top;

      sound.vibrate(8);
      e.stopPropagation();
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      el.style.left = `${initialLeft + dx}px`;
      el.style.top = `${initialTop + dy}px`;
      e.stopPropagation();
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try { el.releasePointerCapture(e.pointerId); } catch (err) {}
      e.stopPropagation();
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
  }

  clearStickersBtn.addEventListener('click', () => {
    sound.playPop(500);
    document.querySelectorAll('.dropped-sticker').forEach(s => s.remove());
  });

  // =========================================================================
  // BGM & SFX TOGGLES
  // =========================================================================
  bgmBtn.addEventListener('click', () => {
    const isPlaying = sound.toggleBgm();
    bgmBtn.classList.toggle('active', isPlaying);
  });

  sfxBtn.addEventListener('click', () => {
    sound.isMuted = !sound.isMuted;
    sfxBtn.classList.toggle('active', !sound.isMuted);
    sfxIcon.textContent = sound.isMuted ? '🔇 Muted' : '🔊 Sound';
    if (!sound.isMuted) sound.playPop(700);
  });

  // =========================================================================
  // CANVAS EXPORT WITH CUTE THEMED PATTERNS, PAN, ZOOM, AND CUSTOM PHOTOS
  // =========================================================================
  downloadBtn.addEventListener('click', async () => {
    sound.playPop(850);
    downloadBtn.textContent = '⏳ Menyimpan...';

    try {
      await generateAndDownloadStrip();
      sound.playSuccess();
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      downloadBtn.innerHTML = '<span>💾 Simpan Photostrip</span>';
    }
  });

  async function generateAndDownloadStrip() {
    const canvas = document.getElementById('exportCanvas');
    const ctx = canvas.getContext('2d');

    const scale = 2;
    const width = 320 * scale;
    const photoWidth = 280 * scale;
    const photoHeight = 195 * scale;
    const gap = 12 * scale;
    const startY = 40 * scale;
    const height = startY + 4 * (photoHeight + gap) + 50 * scale;
    canvas.width = width;
    canvas.height = height;

    // Detect Frame Theme
    let themeType = 'ribbon';
    let bgColor = '#ffdce5';
    let borderColor = '#f472b6';
    let isDark = false;

    if (photostrip.classList.contains('frame-clouds')) {
      themeType = 'clouds';
      bgColor = '#dbeafe';
      borderColor = '#93c5fd';
    } else if (photostrip.classList.contains('frame-gingham')) {
      themeType = 'gingham';
      bgColor = '#fef3c7';
      borderColor = '#fde68a';
    } else if (photostrip.classList.contains('frame-strawberry')) {
      themeType = 'strawberry';
      bgColor = '#fff1f2';
      borderColor = '#f43f5e';
    } else if (photostrip.classList.contains('frame-matcha')) {
      themeType = 'matcha';
      bgColor = '#dcfce7';
      borderColor = '#86efac';
    } else if (photostrip.classList.contains('frame-lavender')) {
      themeType = 'lavender';
      bgColor = '#ede9fe';
      borderColor = '#c4b5fd';
    } else if (photostrip.classList.contains('frame-film')) {
      themeType = 'film';
      bgColor = '#18181b';
      borderColor = '#27272a';
      isDark = true;
    } else if (photostrip.classList.contains('frame-pink')) {
      themeType = 'pink';
      bgColor = '#ffd1dc';
      borderColor = '#fbcfe8';
    }

    // 1. Draw Strip Background
    ctx.fillStyle = bgColor;
    roundRect(ctx, 0, 0, width, height, 16 * scale);
    ctx.fill();

    // Draw cute pattern details on canvas
    if (themeType === 'gingham') {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      for (let x = 0; x < width; x += 18 * scale) {
        ctx.fillRect(x, 0, 9 * scale, height);
      }
      for (let y = 0; y < height; y += 18 * scale) {
        ctx.fillRect(0, y, width, 9 * scale);
      }
    } else if (themeType === 'strawberry' || themeType === 'ribbon') {
      ctx.fillStyle = themeType === 'strawberry' ? 'rgba(251, 113, 133, 0.4)' : 'rgba(244, 63, 94, 0.35)';
      for (let x = 8 * scale; x < width; x += 16 * scale) {
        for (let y = 8 * scale; y < height; y += 16 * scale) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (themeType === 'matcha') {
      ctx.fillStyle = 'rgba(22, 163, 74, 0.25)';
      for (let x = 9 * scale; x < width; x += 18 * scale) {
        for (let y = 9 * scale; y < height; y += 18 * scale) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Border stroke
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3 * scale;
    roundRect(ctx, 0, 0, width, height, 16 * scale);
    ctx.stroke();

    // 2. Draw Top Header Meta
    ctx.fillStyle = isDark ? '#ffffff' : '#475569';
    ctx.font = `bold ${10 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`•••  ${stripDateLabel.textContent}  MEMORIES`, width / 2, 26 * scale);

    // 3. Draw 4 Photos
    const startX = (width - photoWidth) / 2;

    for (let i = 0; i < 4; i++) {
      const y = startY + i * (photoHeight + gap);
      const cfg = photoConfigs[i];

      // Photo background / border
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, startX, y, photoWidth, photoHeight, 4 * scale);
      ctx.fill();

      // Load image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = cfg.src;
      await new Promise(res => { img.onload = res; img.onerror = res; });

      // Clip image to rounded box
      ctx.save();
      roundRect(ctx, startX, y, photoWidth, photoHeight, 4 * scale);
      ctx.clip();

      // Apply filter if needed
      if (photostrip.classList.contains('filter-mono')) {
        ctx.filter = 'grayscale(1) contrast(1.1)';
      } else if (photostrip.classList.contains('filter-warm')) {
        ctx.filter = 'sepia(0.25) brightness(1.05)';
      } else if (photostrip.classList.contains('filter-glow')) {
        ctx.filter = 'brightness(1.06) saturate(1.15)';
      }

      // Draw image with pan and zoom transforms
      drawTransformedImage(ctx, img, startX, y, photoWidth, photoHeight, cfg, scale);
      ctx.restore();

      // Draw stickers attached to this frame
      const layer = document.getElementById(`layer${i}`);
      const stickers = layer.querySelectorAll('.dropped-sticker');
      stickers.forEach(st => {
        const left = parseFloat(st.style.left) || 0;
        const top = parseFloat(st.style.top) || 0;
        const contRect = layer.getBoundingClientRect();
        
        const ratioX = photoWidth / contRect.width;
        const ratioY = photoHeight / contRect.height;
        
        const canvasStickerX = startX + left * ratioX;
        const canvasStickerY = y + top * ratioY + (20 * scale);

        ctx.font = `${28 * scale}px sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillText(st.textContent, canvasStickerX, canvasStickerY);
      });
    }

    // 4. Draw Footer Branding
    const footerY = startY + 4 * (photoHeight + gap) + (16 * scale);
    ctx.fillStyle = isDark ? '#ffffff' : '#18181b';
    ctx.font = `bold ${12 * scale}px "Outfit", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('LIFE FOUR CUTS', width / 2, footerY);

    ctx.font = `${10 * scale}px "Gaegu", cursive`;
    ctx.fillStyle = isDark ? '#d4d4d8' : '#71717a';
    ctx.fillText('Special Photo Booth Edition ♡', width / 2, footerY + (14 * scale));

    // 5. Trigger download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `life-four-cuts-${stripDateLabel.textContent}.png`;
    link.href = dataUrl;
    link.click();
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function drawTransformedImage(ctx, img, x, y, w, h, cfg, scaleFactor) {
    const nw = img.naturalWidth || img.width;
    const nh = img.naturalHeight || img.height;
    if (!nw || !nh) return;

    let sx = 0, sy = 0, sWidth = nw, sHeight = nh;
    const imgRatio = nw / nh;
    const targetRatio = w / h;

    if (imgRatio > targetRatio) {
      sWidth = nh * targetRatio;
      sx = (nw - sWidth) * cfg.alignX;
    } else {
      sHeight = nw / targetRatio;
      sy = (nh - sHeight) * cfg.alignY;
    }

    const centerX = x + w / 2;
    const centerY = y + h / 2;

    ctx.translate(centerX + cfg.panX * scaleFactor, centerY + cfg.panY * scaleFactor);
    ctx.scale(cfg.scale, cfg.scale);

    ctx.drawImage(img, sx, sy, sWidth, sHeight, -w / 2, -h / 2, w, h);
  }
});
