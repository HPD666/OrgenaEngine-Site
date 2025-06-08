// Orgena Studio - Full Working JavaScript

(() => {
  const container = document.getElementById('viewport');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(5, 5, 10);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Lighting
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(3, 10, 10);
  scene.add(dirLight);

  // Controls
  const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.05;

  const transformControls = new THREE.TransformControls(camera, renderer.domElement);
  scene.add(transformControls);

  // Raycaster for picking
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Data
  const objects = [];
  let selectedObject = null;

  // UI Elements
  const btnAddObject = document.getElementById('btnAddObject');
  const primitiveType = document.getElementById('primitiveType');
  const objectList = document.getElementById('objectList');
  const btnUpdateProperties = document.getElementById('btnUpdateProperties');
  const btnSaveProject = document.getElementById('btnSaveProject');
  const btnLoadProject = document.getElementById('btnLoadProject');
  const btnToggleMode = document.getElementById('btnToggleMode');

  const propName = document.getElementById('propName');
  const propPosition = document.getElementById('propPosition');
  const propRotation = document.getElementById('propRotation');
  const propScale = document.getElementById('propScale');
  const propColor = document.getElementById('propColor');
  const propScript = document.getElementById('propScript');

  // Helpers
  function createPrimitive(type) {
    let geometry;
    switch (type) {
      case 'cube':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(0.5, 32, 32);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        break;
      case 'plane':
        geometry = new THREE.PlaneGeometry(1, 1);
        break;
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }
    const material = new THREE.MeshStandardMaterial({ color: 0x156289, emissive: 0x072534, flatShading: false });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `${type[0].toUpperCase() + type.slice(1)} ${objects.length + 1}`;
    mesh.userData.script = ''; // Empty script string
    return mesh;
  }

  function updateObjectList() {
    objectList.innerHTML = '';
    objects.forEach((obj, idx) => {
      const li = document.createElement('li');
      li.textContent = obj.name;
      li.tabIndex = 0;
      if (obj === selectedObject) {
        li.classList.add('selected');
      }
      li.addEventListener('click', () => selectObject(obj));
      objectList.appendChild(li);
    });
  }

  function selectObject(obj) {
    if (selectedObject === obj) return;
    selectedObject = obj;
    transformControls.attach(obj);
    updateObjectList();
    loadProperties(obj);
  }

  function deselectObject() {
    selectedObject = null;
    transformControls.detach();
    updateObjectList();
    clearProperties();
  }

  function loadProperties(obj) {
    if (!obj) return clearProperties();
    propName.value = obj.name;
    propPosition.value = `${obj.position.x.toFixed(2)}, ${obj.position.y.toFixed(2)}, ${obj.position.z.toFixed(2)}`;
    propRotation.value = `${THREE.MathUtils.radToDeg(obj.rotation.x).toFixed(1)}, ${THREE.MathUtils.radToDeg(obj.rotation.y).toFixed(1)}, ${THREE.MathUtils.radToDeg(obj.rotation.z).toFixed(1)}`;
    propScale.value = `${obj.scale.x.toFixed(2)}, ${obj.scale.y.toFixed(2)}, ${obj.scale.z.toFixed(2)}`;
    propColor.value = '#' + obj.material.color.getHexString();
    propScript.value = obj.userData.script || '';
  }

  function clearProperties() {
    propName.value = '';
    propPosition.value = '';
    propRotation.value = '';
    propScale.value = '';
    propColor.value = '#ffffff';
    propScript.value = '';
  }

  function updateProperties() {
    if (!selectedObject) return alert('No object selected');
    // Name
    selectedObject.name = propName.value.trim() || selectedObject.name;
    // Position
    const posVals = propPosition.value.split(',').map(v => parseFloat(v.trim()));
    if (posVals.length === 3 && posVals.every(v => !isNaN(v))) {
      selectedObject.position.set(...posVals);
    }
    // Rotation (degrees)
    const rotVals = propRotation.value.split(',').map(v => parseFloat(v.trim()));
    if (rotVals.length === 3 && rotVals.every(v => !isNaN(v))) {
      selectedObject.rotation.set(
        THREE.MathUtils.degToRad(rotVals[0]),
        THREE.MathUtils.degToRad(rotVals[1]),
        THREE.MathUtils.degToRad(rotVals[2])
      );
    }
    // Scale
    const scaleVals = propScale.value.split(',').map(v => parseFloat(v.trim()));
    if (scaleVals.length === 3 && scaleVals.every(v => !isNaN(v))) {
      selectedObject.scale.set(...scaleVals);
    }
    // Color
    if (/^#[0-9A-Fa-f]{6}$/.test(propColor.value)) {
      selectedObject.material.color.set(propColor.value);
    }
    // Script
    selectedObject.userData.script = propScript.value;

    updateObjectList();
  }

  function addObject() {
    const type = primitiveType.value;
    const newObj = createPrimitive(type);
    newObj.position.set(0, 0.5, 0);
    scene.add(newObj);
    objects.push(newObj);
    selectObject(newObj);
  }

  function saveProject() {
    const data = objects.map(obj => ({
      name: obj.name,
      type: obj.geometry.type.replace('BufferGeometry', '').toLowerCase() || 'unknown',
      position: obj.position.toArray(),
      rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
      scale: obj.scale.toArray(),
      color: '#' + obj.material.color.getHexString(),
      script: obj.userData.script || '',
    }));
    localStorage.setItem('orgenaStudioProject', JSON.stringify(data));
    alert('Project saved!');
  }

  function loadProject() {
    const dataRaw = localStorage.getItem('orgenaStudioProject');
    if (!dataRaw) return alert('No saved project found!');
    try {
      const data = JSON.parse(dataRaw);
      // Clear current objects
      objects.forEach(o => scene.remove(o));
      objects.length = 0;
      deselectObject();
      data.forEach(item => {
        const newObj = createPrimitive(item.type === 'box' ? 'cube' : item.type);
        newObj.name = item.name;
        newObj.position.fromArray(item.position);
        newObj.rotation.set(...item.rotation);
        newObj.scale.fromArray(item.scale);
        newObj.material.color.set(item.color);
        newObj.userData.script = item.script || '';
        scene.add(newObj);
        objects.push(newObj);
      });
      updateObjectList();
      alert('Project loaded!');
    } catch (e) {
      alert('Failed to load project: ' + e.message);
    }
  }

  // Dark/light mode toggle
  let darkMode = true;
  function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.style.background = darkMode ? '#121212' : '#f0f0f0';
    document.body.style.color = darkMode ? 'white' : 'black';
    document.getElementById('sidebar').style.background = darkMode ? '#222' : '#ddd';

    // Adjust renderer clear color
    renderer.setClearColor(darkMode ? 0x121212 : 0xf0f0f0, 1);
  }

  // Event listeners

  btnAddObject.addEventListener('click', addObject);
  btnUpdateProperties.addEventListener('click', updateProperties);
  btnSaveProject.addEventListener('click', saveProject);
  btnLoadProject.addEventListener('click', loadProject);
  btnToggleMode.addEventListener('click', toggleDarkMode);

  transformControls.addEventListener('dragging-changed', function(event) {
    orbitControls.enabled = !event.value;
  });

  // Keyboard shortcuts for transform mode
  window.addEventListener('keydown', (event) => {
    if (!selectedObject) return;
    switch (event.key.toLowerCase()) {
      case 'g': // move
        transformControls.setMode('translate');
        break;
      case 'r': // rotate
        transformControls.setMode('rotate');
        break;
      case 's': // scale
        transformControls.setMode('scale');
        break;
      case 'delete':
      case 'backspace':
        // Delete selected object
        scene.remove(selectedObject);
        const idx = objects.indexOf(selectedObject);
        if (idx !== -1) objects.splice(idx, 1);
        deselectObject();
        updateObjectList();
        break;
    }
  });

  // Resize handling
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Click to select objects
  renderer.domElement.addEventListener('pointerdown', (event) => {
    if (transformControls.dragging) return; // ignore if dragging transform

    // Calculate mouse pos normalized
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
      selectObject(intersects[0].object);
    } else {
      deselectObject();
    }
  });

  // Animate/render loop
  function animate() {
    requestAnimationFrame(animate);
    orbitControls.update();

    // Run user scripts attached to objects
    const time = performance.now() / 1000;
    objects.forEach(obj => {
      if (obj.userData.script && obj.userData.script.trim() !== '') {
        try {
          const fn = new Function('obj', 'time', obj.userData.script);
          fn(obj, time);
        } catch (e) {
          // silently fail or optionally show error
        }
      }
    });

    renderer.render(scene, camera);
  }

  animate();
  toggleDarkMode(); // set initial mode & colors
})();
