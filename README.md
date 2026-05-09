# Mission Mars 🚀

A highly immersive, Awwwards-winning style 3D web experience built with Next.js, React Three Fiber, and GSAP. This project simulates a futuristic cinematic journey to Mars, featuring procedural generation, raw Web Audio, and advanced post-processing lens effects.

## ✨ Features

- **Cinematic 3D Scroll Journey**: Camera movements and 3D scenes are seamlessly choreographed to the user's scroll position using `GSAP ScrollTrigger` and `Lenis` smooth scrolling.
- **Hyper-Realistic Mars**: A dynamic Mars planet utilizing authentic NASA 1K texture maps (Color & Normal) and a custom GLSL shader to calculate a realistic atmospheric Fresnel edge glow.
- **Procedural Stealth Spaceship**: A high-performance, low-poly cyberpunk spacecraft built entirely from native Three.js geometries, featuring glowing cyan neon trims and dual flickering hyper-thrusters.
- **Interactive Web Audio API**: No external `.mp3` files! Features a custom `AudioEngine` that procedurally generates a deep space ambient drone, thruster hums, and sweeping "woosh" transition sounds in real-time.
- **Advanced Post-Processing**: Includes cinematic Depth of Field (DoF) for bokeh blurs, Chromatic Aberration for raw sci-fi lens fringing, Bloom for neon glows, and Vignetting.
- **Cinematic Preloader**: A custom entry sequence that locks scrolling, simulates instrument calibration, and executes a massive 2.5-second cinematic zoom-in before handing control to the user.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **3D Rendering**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- **Post-Processing**: `@react-three/postprocessing`
- **Animations**: [GSAP](https://gsap.com/) (ScrollTrigger) & [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scroll**: [Lenis](https://lenis.studiofreight.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)

## 🚀 Getting Started

Follow these steps to run the cinematic experience locally on your machine.

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   cd try2web
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
   *(Note: The port may be `3001` or higher if `3000` is already in use).*

## 📁 Project Structure

\`\`\`text
src/
├── app/
│   ├── globals.css        # Tailwind configuration and custom CSS variables
│   ├── layout.tsx         # Next.js root layout (loads custom fonts & Lenis)
│   └── page.tsx           # Main entry point (dynamically imports Canvas to avoid SSR issues)
├── components/
│   ├── canvas/
│   │   ├── CanvasScene.tsx      # Core R3F Canvas, GSAP Timelines, and Post-processing
│   │   └── models/
│   │       ├── Mars.tsx         # Mars model with NASA textures and GLSL shader
│   │       └── Spaceship.tsx    # Procedural stealth spacecraft
│   ├── sections/                # HTML overlay sections (Hero, Timeline, Stats, CTA)
│   ├── ui/
│   │   ├── OverlayUI.tsx        # Top navigation and Sound Toggle
│   │   └── Preloader.tsx        # Cinematic loading screen
│   └── utils/
│       ├── AudioEngine.ts       # Procedural Web Audio synthesizer
│       └── SmoothScroll.tsx     # Lenis smooth scroll provider
\`\`\`

## 💡 Important Notes
- **React 19 Compatibility**: To ensure stability with Next.js 15+ and React 19, this project avoids outdated wrappers from `@react-three/drei` (like `<Float>` or `<PerspectiveCamera>`) and opts for native Three.js meshes and standard `<Canvas>` camera configuration.
- **Audio Autoplay**: Modern browsers block audio context until user interaction. The `AudioEngine` is automatically initialized when the user clicks the "ENTER MISSION" button on the preloader.
