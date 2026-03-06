let scene, camera, renderer, brainGroup;
let mouseX = 0,
  mouseY = 0;
let targetRotation = null;

window.rotateBrainTo = function (part) {
  const rotations = {
    frontal1: { y: 0.2, x: 0.4 },
    frontal2: { y: -0.2, x: 0.4 },
    occipital: { y: Math.PI, x: 0.2 },
    temporal: { y: Math.PI / 2, x: -0.3 },
    parietal: { y: -Math.PI / 2, x: 0.3 },
  };

  targetRotation = rotations[part] || null;
};

function initBrain() {
  const container = document.getElementById("canvas-container");
  if (!container) return;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 15, 40);

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
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

  // Load 3D model
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
      console.error("Error loading model:", error);
    },
  );

  document.addEventListener("mousemove", onMouseMove);
  window.addEventListener("resize", onWindowResize);

  animate();
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
    let dy = targetRotation.y - brainGroup.rotation.y;

    dy = Math.atan2(Math.sin(dy), Math.cos(dy));

    brainGroup.rotation.y += dy * 0.05;
    brainGroup.rotation.x += (targetRotation.x - brainGroup.rotation.x) * 0.05;
  } else {
    brainGroup.rotation.y += 0.001;

    brainGroup.rotation.y += (mouseX * 0.2 - brainGroup.rotation.y) * 0.03;
    brainGroup.rotation.x += (mouseY * 0.2 - brainGroup.rotation.x) * 0.03;
  }

  renderer.render(scene, camera);
}

window.addEventListener("load", initBrain);
