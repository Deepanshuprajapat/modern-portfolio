/**
 * particles.js
 * Three.js-based 3D particle background with floating geometric shapes.
 * Creates an immersive deep-space particle field for the portfolio.
 */

(function () {
  'use strict';

  // #region agent log
  fetch('http://127.0.0.1:7281/ingest/6d8d1f55-e0d7-408e-ae7c-3e3914c17251',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ab1c7b'},body:JSON.stringify({sessionId:'ab1c7b',location:'particles.js:init',message:'particles init start',data:{threeDefined:typeof THREE!=='undefined',canvasFound:!!document.getElementById('bg-canvas')},timestamp:Date.now(),hypothesisId:'B',runId:'initial'})}).catch(()=>{});
  // #endregion

  // Wait for Three.js to be available
  if (typeof THREE === 'undefined') {
    // #region agent log
    fetch('http://127.0.0.1:7281/ingest/6d8d1f55-e0d7-408e-ae7c-3e3914c17251',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ab1c7b'},body:JSON.stringify({sessionId:'ab1c7b',location:'particles.js:three-missing',message:'THREE undefined - aborting',data:{},timestamp:Date.now(),hypothesisId:'B',runId:'initial'})}).catch(()=>{});
    // #endregion
    return;
  }

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) {
    // #region agent log
    fetch('http://127.0.0.1:7281/ingest/6d8d1f55-e0d7-408e-ae7c-3e3914c17251',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ab1c7b'},body:JSON.stringify({sessionId:'ab1c7b',location:'particles.js:canvas-missing',message:'bg-canvas not found - aborting',data:{},timestamp:Date.now(),hypothesisId:'B',runId:'initial'})}).catch(()=>{});
    // #endregion
    return;
  }

  /* -------- SCENE SETUP -------- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  /* -------- COLORS -------- */
  const COLORS = {
    cyan: 0x00d4ff,
    purple: 0x7c3aed,
    pink: 0xf472b6,
    emerald: 0x10b981,
    white: 0xffffff,
  };

  /* -------- PARTICLE FIELD -------- */
  const PARTICLE_COUNT = 1800;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);

  const colorPalette = [
    new THREE.Color(COLORS.cyan),
    new THREE.Color(COLORS.purple),
    new THREE.Color(COLORS.pink),
    new THREE.Color(COLORS.emerald),
    new THREE.Color(COLORS.white),
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Positions: spread in a cube
    positions[i * 3]     = (Math.random() - 0.5) * 280;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 180;

    // Random color from palette
    const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    // Random size
    sizes[i] = Math.random() * 1.5 + 0.3;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMat = new THREE.PointsMaterial({
    size: 0.6,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* -------- GEOMETRIC SHAPES -------- */
  function createShape(geometry, color, opacity = 0.12) {
    const mat = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity,
    });
    return new THREE.Mesh(geometry, mat);
  }

  // Icosahedron 1 (large, cyan)
  const ico1 = createShape(new THREE.IcosahedronGeometry(18, 1), COLORS.cyan, 0.06);
  ico1.position.set(-50, 20, -60);
  scene.add(ico1);

  // Icosahedron 2 (medium, purple)
  const ico2 = createShape(new THREE.IcosahedronGeometry(10, 1), COLORS.purple, 0.1);
  ico2.position.set(55, -25, -40);
  scene.add(ico2);

  // Octahedron (pink)
  const octa = createShape(new THREE.OctahedronGeometry(8, 0), COLORS.pink, 0.1);
  octa.position.set(30, 35, -50);
  scene.add(octa);

  // Torus (cyan)
  const torus = createShape(new THREE.TorusGeometry(12, 0.5, 8, 50), COLORS.cyan, 0.07);
  torus.position.set(-40, -30, -70);
  torus.rotation.x = Math.PI / 3;
  scene.add(torus);

  // Tetrahedron (emerald)
  const tetra = createShape(new THREE.TetrahedronGeometry(7, 0), COLORS.emerald, 0.12);
  tetra.position.set(60, 30, -30);
  scene.add(tetra);

  // Small dodecahedron
  const dodeca = createShape(new THREE.DodecahedronGeometry(5, 0), COLORS.purple, 0.1);
  dodeca.position.set(-60, -10, -20);
  scene.add(dodeca);

  // Ring torus 2
  const torus2 = createShape(new THREE.TorusGeometry(8, 0.4, 6, 40), COLORS.pink, 0.08);
  torus2.position.set(0, -40, -55);
  torus2.rotation.y = Math.PI / 4;
  scene.add(torus2);

  const shapes = [ico1, ico2, octa, torus, tetra, dodeca, torus2];

  /* -------- CONNECTING LINES (WebGL Lines) -------- */
  // Sparse mesh of lines between random particles for the "neural network" effect
  const LINE_COUNT = 120;
  const linePositions = new Float32Array(LINE_COUNT * 6);

  for (let i = 0; i < LINE_COUNT; i++) {
    const ai = Math.floor(Math.random() * PARTICLE_COUNT);
    const bi = Math.floor(Math.random() * PARTICLE_COUNT);
    linePositions[i * 6]     = positions[ai * 3];
    linePositions[i * 6 + 1] = positions[ai * 3 + 1];
    linePositions[i * 6 + 2] = positions[ai * 3 + 2];
    linePositions[i * 6 + 3] = positions[bi * 3];
    linePositions[i * 6 + 4] = positions[bi * 3 + 1];
    linePositions[i * 6 + 5] = positions[bi * 3 + 2];
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

  const lineMat = new THREE.LineBasicMaterial({
    color: COLORS.cyan,
    transparent: true,
    opacity: 0.04,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  /* -------- MOUSE PARALLAX -------- */
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* -------- ANIMATION LOOP -------- */
  let animId;
  const clock = new THREE.Clock();

  function animate() {
    animId = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth mouse follow
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    // Rotate particle field slowly
    particles.rotation.y = elapsed * 0.018;
    particles.rotation.x = elapsed * 0.008;

    // Camera parallax based on mouse
    camera.position.x += (mouse.x * 8 - camera.position.x) * 0.03;
    camera.position.y += (mouse.y * 5 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    // Animate geometric shapes
    ico1.rotation.x = elapsed * 0.12;
    ico1.rotation.y = elapsed * 0.08;

    ico2.rotation.x = elapsed * 0.08;
    ico2.rotation.y = -elapsed * 0.12;

    octa.rotation.x = -elapsed * 0.15;
    octa.rotation.z = elapsed * 0.1;

    torus.rotation.z = elapsed * 0.1;
    torus.rotation.x = Math.PI / 3 + Math.sin(elapsed * 0.5) * 0.2;

    tetra.rotation.x = elapsed * 0.18;
    tetra.rotation.y = elapsed * 0.12;

    dodeca.rotation.y = -elapsed * 0.1;
    dodeca.rotation.z = elapsed * 0.08;

    torus2.rotation.x = elapsed * 0.08;
    torus2.rotation.z = -elapsed * 0.06;

    // Floating motion for shapes
    ico1.position.y = 20 + Math.sin(elapsed * 0.4) * 5;
    ico2.position.y = -25 + Math.sin(elapsed * 0.5 + 1) * 4;
    octa.position.y = 35 + Math.sin(elapsed * 0.35 + 2) * 6;
    tetra.position.y = 30 + Math.sin(elapsed * 0.45 + 3) * 4;

    // Pulsing opacity for lines
    lineMat.opacity = 0.03 + Math.sin(elapsed * 0.5) * 0.015;

    renderer.render(scene, camera);
  }

  animate();

  // #region agent log
  fetch('http://127.0.0.1:7281/ingest/6d8d1f55-e0d7-408e-ae7c-3e3914c17251',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ab1c7b'},body:JSON.stringify({sessionId:'ab1c7b',location:'particles.js:animate-started',message:'Three.js scene running',data:{particleCount:PARTICLE_COUNT,shapeCount:shapes.length},timestamp:Date.now(),hypothesisId:'B',runId:'initial'})}).catch(()=>{});
  // #endregion

  /* -------- RESIZE HANDLER -------- */
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, 100);
  });

  /* -------- VISIBILITY (pause when tab hidden) -------- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animate();
    }
  });

})();
