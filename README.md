# LUZ cinematic rebuild

A standalone HTML, CSS and JavaScript website for LUZ, a video editing and film production studio. The repository is ready to deploy as a static site from its root directory. Three.js, GSAP, fonts, the camera model and visual assets are bundled locally.

## Features

- Responsive cinematic layout with an interactive Three.js camera
- GSAP reveals and editing-inspired opening intro
- Realistic CC0 textured rangefinder camera with Draco loading
- Motion pause, reduced-motion support, WebGL fallback and offscreen suspension
- Filterable visual concept gallery with accessible dialogs
- Service accordions and original-site video player with external fallback
- Validated enquiry form handing off to WhatsApp; no data is stored automatically
- Verified LUZ phone, email, social and address links

## Run locally

Serve the repository root through a local HTTP server so ES modules and the 3D assets load correctly:

    python -m http.server 8080

Then open http://localhost:8080.

## Deploy

Deploy the repository root on Vercel, Netlify, GitHub Pages or any static host. The entry point is index.html.

## Structure

- index.html — page markup and LUZ content
- style.css, editorial.css — site styling
- intro.css, intro.js — opening editing sequence
- app.js — UI interactions, gallery, accordions and enquiry handoff
- scene.js — Three.js camera and CGI scene
- assets/ — Three.js, GSAP, fonts, camera GLB, Draco files and visuals

## Credits and licensing

The realistic camera is Camera 01 by Rajil Jose Macatangay from Poly Haven and is distributed under CC0. See assets/CAMERA-CREDITS.txt. Three.js is MIT licensed and GSAP is bundled locally with its license notice. Existing LUZ imagery and brand content remain the property of their respective owners.

Business information and imagery originate from https://luz.co.in/. Artwork is presented as visual concepts, not fabricated client projects. No backend email service is configured.
