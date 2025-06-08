// orgena-studio.js

(() => {
  // === Setup Three.js basics ===
  const container = document.getElementById('viewport');
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(5, 5, 7);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x121212);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // === Controls ===
  const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.05;

  const transformControls = new THREE.TransformControls(camera, renderer.domElement);
  scene.add(transformControls);

  // === Helpers ===
  const gridHelper = new THREE.GridHelper(20, 20);
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // === Lights ===
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  // === DOM elements ===
  const objectListEl = document.getElementById('objectList');
  const propName = document.getElementById('propName');
  const propPosition = document.getElementById('propPosition');
  const propRotation = document.getElementById('propRotation');
  const propScale = document.getElementById('propScale');
  const propColor = document.getElementById('propColor');
  const propScript = document.getElementById('propScript');
  const btnAddObject = document.getElementById('btnAddObject');
  const btnUpdateProperties = document.getElementById('btnUpdateProperties');
  const btnSaveProject = document.getElementById('btnSaveProject');
  const btnLoadProject = document.getElementById('btnLoadProject');
  const primitiveTypeSelector = document.getElementById('primitiveType');
  const btnToggleMode = document.getElementById('btnToggleMode');

  // === Data storage ===
  const objects = {};
  let selectedObjectId = null;
  let objectIdCounter = 0;

  // === Generate unique ID ===
  function generateId() {
    objectIdCounter++;
    return `obj_${objectIdCounter}`;
  }

  // === Create primitives ===
  function createPrimitive(type, color = 0x999999) {
    let geometry;
    switch (type) {
      case 'cube':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(0.6, 32, 32);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 32);
        break;
      case 'plane':
        geometry = new THREE.PlaneGeometry(1.2, 1.2);
        break;
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  // === Add object ===
  function addObject(type) {
    const id = generateId();
    const mesh = createPrimitive(type, 0x999999);
    mesh.position.set(0, 0.6, 0);
    mesh.name = `${type.charAt(0).toUpperCase() + type.slice(1)} ${objectIdCounter}`;
    scene.add(mesh);

    objects[id] = {
      id,
      mesh,
      type,
      script: `-- Lua script for ${mesh.name}\nfunction update(dt)\n  -- dt: delta time\nend`
    };

    addObjectToExplorer(id);
    selectObject(id);
  }

  // === Add object to explorer UI ===
  function addObjectToExplorer(id) {
    const obj = objects[id];
    const li = document.createElement('li');
    li.textContent = obj.mesh.name;
    li.id = id;
    li.tabIndex = 0;
    li.setAttribute('role', 'option');
    li.addEventListener('click', () => selectObject(id));
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectObject(id);
      }
    });
    objectListEl.appendChild(li);
  }

  // === Refresh explorer UI ===
  function refreshExplorer() {
    objectListEl.innerHTML = '';
    Object.keys(objects).forEach(id => addObjectToExplorer(id));
  }

  // === Select object ===
  function selectObject(id) {
    if (!objects[id]) return;
    selectedObjectId = id;

    // Highlight selected
    for (let li of objectListEl.children) {
      li.classList.toggle('selected', li.id === id);
      li.setAttribute('aria-selected', li.id === id ? 'true' : 'false');
    }

    const obj = objects[id];
    propName.value = obj.mesh.name;
    propPosition.value = `${obj.mesh.position.x.toFixed(2)}, ${obj.mesh.position.y.toFixed(2)}, ${obj.mesh.position.z.toFixed(2)}`;
    propRotation.value = `${THREE.MathUtils.radToDeg(obj.mesh.rotation.x).toFixed(1)}, ${THREE.MathUtils.radToDeg(obj.mesh.rotation.y).toFixed(1)}, ${THREE.MathUtils.radToDeg(obj.mesh.rotation.z).toFixed(1)}`;
    propScale.value = `${obj.mesh.scale.x.toFixed(2)}, ${obj.mesh.scale.y.toFixed(2)}, ${obj.mesh.scale.z.toFixed(2)}`;
    propColor.value = "#" + obj.mesh.material.color.getHexString();
    propScript.value = obj.script;

    transformControls.attach(obj.mesh);
  }

  // === Update selected object properties ===
  function updateSelectedObject() {
    if (!selectedObjectId) return;
    const obj = objects[selectedObjectId];

    // Name
    const newName = propName.value.trim();
    if (newName) {
      obj.mesh.name = newName;
      for (let li of objectListEl.children) {
        if (li.id === selectedObjectId) li.textContent = newName;
      }
    }

    // Position
    const posParts = propPosition.value.split(',').map(s => parseFloat(s.trim()));
    if (posParts.length === 3 && posParts.every(n => !isNaN(n))) {
      obj.mesh.position.set(posParts[0], posParts[1], posParts[2]);
    }

    // Rotation (deg -> rad)
    const rotParts = propRotation.value.split(',').map(s => THREE.MathUtils.degToRad(parseFloat(s.trim())));
    if (rotParts.length === 3 && rotParts.every(n => !isNaN(n))) {
      obj.mesh.rotation.set(rotParts[0], rotParts[1], rotParts[2]);
    }

    // Scale
    const scaleParts = propScale.value.split(',').map(s => parseFloat(s.trim()));
    if (scaleParts.length === 3 && scaleParts.every(n => !isNaN(n))) {
      obj.mesh.scale.set(scaleParts[0], scaleParts[1], scaleParts[2]);
    }

    // Color
    try {
      obj.mesh.material.color.set(propColor.value);
    } catch { }

    // Script
    obj.script = propScript.value;
  }

  // === Save project ===
  function saveProject() {
    const data = {
      objects: Object.values(objects).map(obj => ({
        id: obj.id,
        name: obj.mesh.name,
        type: obj.type,
        position: obj.mesh.position.toArray(),
        rotation: [obj.mesh.rotation.x, obj.mesh.rotation.y, obj.mesh.rotation.z],
        scale: obj.mesh.scale.toArray(),
        color: "#" + obj.mesh.material.color.getHexString(),
        script: obj.script,
      })),
    };
    localStorage.setItem('orgena_project', JSON.stringify(data));
    alert('Project saved locally.');
  }

  // === Load project ===
  function loadProject() {
    const dataStr = localStorage.getItem('orgena_project');
    if (!dataStr) {
      alert('No saved project found.');
      return;
    }
    try {
      const data = JSON.parse(dataStr);

      // Clear scene and objects
      Object.values(objects).forEach(o => scene.remove(o.mesh));
      Object.keys(objects).forEach(k => delete objects[k]);
      objectIdCounter = 0;
      objectListEl.innerHTML = '';

      // Rebuild scene
      data.objects.forEach(objData => {
        const mesh = createPrimitive(objData.type, parseInt(objData.color.slice(1), 16));
        mesh.position.fromArray(objData.position);
        mesh.rotation.set(...objData.rotation);
        mesh.scale.fromArray(objData.scale);
        mesh.name = objData.name;
        scene.add(mesh);

        objects[objData.id] = {
          id: objData.id,
          mesh,
          type: objData.type,
          script: objData.script,
        };

        // Keep track of highest ID number
        const numId = parseInt(objData.id.split('_')[1]);
        if (numId > objectIdCounter) objectIdCounter = numId;
      });
      refreshExplorer();
      if (data.objects.length) selectObject(data.objects[0].id);

      alert('Project loaded.');
    } catch (e) {
      alert('Failed to load project: ' + e.message);
    }
  }

  // === Handle window resize ===
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // === Keyboard control for transform mode switching ===
  window.addEventListener('keydown', e => {
    if (!transformControls.object) return;
    switch (e.key.toLowerCase()) {
      case 'g': // translate
        transformControls.setMode('translate');
        break;
      case 'r': // rotate
        transformControls.setMode('rotate');
        break;
      case 's': // scale
        transformControls.setMode('scale');
        break;
      case 'escape': // deselect
        transformControls.detach();
        selectedObjectId = null;
        for (let li of objectListEl.children) {
          li.classList.remove('selected');
          li.setAttribute('aria-selected', 'false');
        }
        break;
    }
  });

  // Prevent orbitControls when dragging transformControls
  transformControls.addEventListener('dragging-changed', event => {
    orbitControls.enabled = !event.value;
  });

  // === Dark/Light mode toggle ===
  btnToggleMode.onclick = () => {
    document.body.classList.toggle('light');
    if (document.body.classList.contains('light')) {
      renderer.setClearColor(0xf0f0f0);
    } else {
      renderer.setClearColor(0x121212);
    }
  };

  // === Button events ===
  btnAddObject.onclick = () => {
    addObject(primitiveTypeSelector.value);
  };

  btnUpdateProperties.onclick = () => {
    updateSelectedObject();
  };

  btnSaveProject.onclick = () => {
    updateSelectedObject();
    saveProject();
  };

  btnLoadProject.onclick = () => {
    loadProject();
  };

  // === Animation loop ===
  function animate() {
    requestAnimationFrame(animate);
    orbitControls.update();
    transformControls.update();
    renderer.render(scene, camera);
  }
  animate();

  // === Initialize with one cube ===
  addObject('cube');

})();
