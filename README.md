# 인생네컷 • Life Four Cuts Studio 📸✨

Aesthetic Korean 4-Cut Photobooth Studio web application. Designed for mobile and desktop with zero AI-slop, rich interactive tactile photo controls, live camera support, custom gallery uploads, cute patterned frames, purikura stickers, and high-resolution photostrip downloads.

## 🎀 Features

- **Korean 4-Cut Photostrip (`인생네컷`)**: Authentic vertical 4-cut photobooth layout with metadata, date, barcode, and branding.
- **Dual Photo Addition**:
  - 📁 **Dari Galeri**: Upload any custom image for any of the 4 cuts.
  - 📷 **Kamera Langsung**: Live selfie camera with 3-second countdown and shutter flash.
- **Tactile Framing Controls**:
  - Touch/Mouse pan & drag to align faces precisely.
  - Zoom in/out via slider, pinch-to-zoom on mobile, or mouse wheel on desktop.
  - Quick reset position button.
- **8 Cute Patterned Strip Frames**:
  - 🎀 Pita Ribbon (Dotted Pink & Bow)
  - ☁️ Cloud Dream (Fluffy Blue Sky)
  - 🧸 Butter Plaid (Picnic Gingham Plaid)
  - 🍓 Strawberry Dot (Cute Berry Polka)
  - 🍵 Matcha Heart (Soft Sage Doodles)
  - ✨ Lilac Stars (Dreamy Constellation)
  - 🎞️ Vintage Film (Classic Sprocket Film)
  - 🌸 Pastel Soft (Clean Baby Pink)
- **Photo Filters & Purikura Stickers**: Soft glow, warm sunset, mono film, and interactive draggable emojis.
- **Audio & Haptics**: Built-in Web Audio API synthesizer for BGM, camera shutter, pop sounds, and soft taps.
- **1-Click High-Res PNG Download**: Exports the complete customized photostrip via 2x Retina Canvas.

## 🚀 Cara Deploy ke Vercel

Aplikasi ini adalah static web application (HTML5, CSS3, ES Modules).

1. Buka [Vercel Dashboard](https://vercel.com/new) dan import repository `Faridzzz24/A`.
2. Pada konfigurasi project di Vercel:
   - **Framework Preset**: Pilih **Other**
   - **Root Directory**: `./` (default)
   - **Build Command**: Biarkan kosong / nonaktifkan
   - **Output Directory**: Biarkan kosong / default
3. Klik tombol **Deploy**. Vercel akan langsung meng-host aplikasi secara otomatis.

## 💻 Local Development

Run with Node.js built-in server:

```bash
node server.js
```

Open `http://localhost:3000` in your browser.
