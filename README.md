# Luz cinematic rebuild

A standalone HTML, CSS and JavaScript website. Publish the `dist` directory on any static host. Third-party runtime dependencies (Three.js and GSAP) and fonts are bundled locally.

## Features

- Responsive cinematic layout with Three.js interactive cinema camera and GSAP reveals
- Motion pause, reduced-motion preference, offscreen rendering suspension and WebGL fallback
- Filterable visual concept gallery with native accessible dialogs
- Service accordions and original-site video player with external fallback
- Validated inquiry form handing off to WhatsApp; no data is stored or sent automatically
- Verified Luz phone, email, social and address links

## Content

Business information and imagery originate from https://luz.co.in/, reviewed 7 October 2026. Artwork is presented as visual concepts, not fabricated client projects. The source email was confirmed from the footer mailto link. No backend email service is configured. The source website and its domain are unchanged.

## Libraries

Three.js 0.160.1 (MIT), GSAP 3.12.5 (included license notices), Space Grotesk and Manrope (Google Fonts). Keep dependency license notices when redistributing. The existing Luz imagery remains the property of its respective owners.

## October 2026 reference redesign

The Pinterest reference informed the monochrome palette, editorial serif typography, metallic optical geometry and continuous scroll choreography. The CGI is original realtime Three.js geometry, not copied video. All pre-existing visible wording and action links are preserved. The camera remains in the opening scene; instanced metallic ribs move across section transitions. Local dependencies and reduced-motion fallbacks are retained.

## Camera and opening sequence

The procedural camera has been replaced with the CC0 Camera 01 textured rangefinder model by Rajil Jose Macatangay (Poly Haven). See `dist/assets/CAMERA-CREDITS.txt`. The original PBR maps remain bundled in an optimized GLB, loaded with the matching Three.js 0.160.1 GLTF/Draco loaders. A matching image preview is shown until loading succeeds or when WebGL is unavailable.

The 3.4-second editing-inspired opening runs once per browser session, with Skip intro, Escape dismissal and a Replay intro footer control. Reduced-motion visitors bypass it. It is a decorative editing sequence, not a simulated network-loading indicator; it never waits for the 3D download.
