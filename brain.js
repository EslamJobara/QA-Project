let scene, camera, renderer, brainGroup, particles, connections;
let mouseX = 0, mouseY = 0;
let targetRotation = null;

window.rotateBrainTo = function(part) {
  const rotations = {
    frontal: { y: 0, x: 0.4 },
    occipital: { y: Math.PI, x: 0.2 },
    temporal: { y: Math.PI / 2, x: -0.3 },
    parietal: { y: -Math.PI / 2, x: 0.3 }
  };
  targetRotation = rotations[part] || null;
};

function initBrain() {
  const container = document.getElementById("canvas-container");
  if (!container) return; // Prevent errors if container isn't there

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 15, 40);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 14);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0x1a1a3a, 0.4));
  const light1 = new THREE.PointLight(0x00eaff, 1.5, 50);
  light1.position.set(12, 8, 10);
  scene.add(light1);
  const light2 = new THREE.PointLight(0xff00ff, 1.2, 50);
  light2.position.set(-12, -5, 8);
  scene.add(light2);
  const light3 = new THREE.PointLight(0x00ff88, 1, 50);
  light3.position.set(0, 10, -10);
  scene.add(light3);

  // Brain Group
  brainGroup = new THREE.Group();
  scene.add(brainGroup);

  // Load external 3D model
  const loader = new THREE.GLTFLoader();
  loader.load(
    "./scene.gltf",
    function (gltf) {
      const model = gltf.scene;
      model.scale.set(5.5, 5.5, 5.5);
      model.position.set(0, -2, 0);
      brainGroup.add(model);
    },
    undefined,
    function (error) {
      console.error("Error loading 3D model:", error);
    }
  );

  createConnections();

  document.addEventListener("mousemove", onMouseMove);
  window.addEventListener("resize", onWindowResize);

  animate();
}

function createConnections() {
  const connectionGroup = new THREE.Group();
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x1f3b8a,
    transparent: true,
    opacity: 0.25,
  });
  for (let i = 0; i < 30; i++) {
    const points = [];
    const theta1 = Math.random() * Math.PI * 2, phi1 = Math.random() * Math.PI;
    const theta2 = Math.random() * Math.PI * 2, phi2 = Math.random() * Math.PI;
    const radius = 3.3;
    const x1 = radius * Math.sin(phi1) * Math.cos(theta1) * 0.75;
    const y1 = radius * Math.sin(phi1) * Math.sin(theta1) * 1.15;
    const z1 = radius * Math.cos(phi1) * 0.92;
    const x2 = radius * Math.sin(phi2) * Math.cos(theta2) * 0.75;
    const y2 = radius * Math.sin(phi2) * Math.sin(theta2) * 1.15;
    const z2 = radius * Math.cos(phi2) * 0.92;
    points.push(new THREE.Vector3(x1, y1, z1));
    points.push(new THREE.Vector3(x2, y2, z2));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMaterial);
    connectionGroup.add(line);
  }
  connections = connectionGroup;
  brainGroup.add(connections);
}

function onMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  
  if (targetRotation) {
    // Smoothly interpolate to the target rotation
    let dy = targetRotation.y - brainGroup.rotation.y;
    // Normalize dy to the range [-PI, PI] to rotate the shortest path
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    
    brainGroup.rotation.y += dy * 0.05;
    brainGroup.rotation.x += (targetRotation.x - brainGroup.rotation.x) * 0.05;
  } else {
    // Default idle rotation
    brainGroup.rotation.y += 0.001;
    brainGroup.rotation.y += (mouseX * 0.2 - brainGroup.rotation.y) * 0.03;
    brainGroup.rotation.x += (mouseY * 0.2 - brainGroup.rotation.x) * 0.03;
  }

  if (connections) {
    connections.children.forEach((line, idx) => {
      line.material.opacity = 0.15 + Math.sin(Date.now() * 0.001 + idx) * 0.05;
    });
  }
  renderer.render(scene, camera);
}

window.addEventListener("load", initBrain);
