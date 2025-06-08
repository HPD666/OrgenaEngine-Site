<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Orgena Studio</title>
  <style>
    /* CSS Variables for themes */
    :root {
      --bg-light: #f5f5f7;
      --bg-dark: #121212;
      --text-light: #222;
      --text-dark: #eee;
      --primary: #4a90e2;
      --accent: #e94e77;
      --border: #ddd;
      --border-dark: #333;
      --sidebar-width: 280px;
      --toolbar-height: 48px;
      --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    [data-theme='light'] {
      --bg: var(--bg-light);
      --text: var(--text-light);
      --border-color: var(--border);
      --input-bg: #fff;
      --input-text: #111;
      --button-bg: var(--primary);
      --button-text: #fff;
      --button-hover-bg: #357abd;
      --scrollbar-bg: #ccc;
    }
    [data-theme='dark'] {
      --bg: var(--bg-dark);
      --text: var(--text-dark);
      --border-color: var(--border-dark);
      --input-bg: #222;
      --input-text: #eee;
      --button-bg: #2463b1;
      --button-text: #ccc;
      --button-hover-bg: #357abd;
      --scrollbar-bg: #555;
    }
    /* Reset & base */
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0; padding: 0;
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-family);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      user-select: none;
    }
    /* Toolbar */
    header#toolbar {
      display: flex;
      align-items: center;
      height: var(--toolbar-height);
      padding: 0 1rem;
      background: var(--button-bg);
      color: var(--button-text);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      flex-shrink: 0;
    }
    #toolbar h1 {
      font-weight: 600;
      font-size: 1.25rem;
      flex-grow: 1;
      user-select: text;
    }
    .toolbar-btn {
      background: transparent;
      border: none;
      color: var(--button-text);
      cursor: pointer;
      font-size: 1.2rem;
      margin-left: 1rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: background-color 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .toolbar-btn:hover,
    .toolbar-btn:focus {
      background-color: var(--button-hover-bg);
      outline: none;
    }
    .toolbar-btn svg {
      width: 20px; height: 20px;
      fill: currentColor;
    }
    /* Main layout */
    #main {
      flex-grow: 1;
      display: flex;
      height: calc(100vh - var(--toolbar-height));
      overflow: hidden;
    }
    /* Sidebar styles */
    aside.sidebar {
      background: var(--input-bg);
      border-right: 1px solid var(--border-color);
      width: var(--sidebar-width);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    aside.sidebar h2 {
      margin: 0;
      padding: 1rem;
      font-weight: 600;
      font-size: 1.1rem;
      border-bottom: 1px solid var(--border-color);
      user-select: text;
    }
    .sidebar-content {
      flex-grow: 1;
      overflow-y: auto;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      user-select: text;
    }
    /* Scrollbar */
    .sidebar-content::-webkit-scrollbar {
      width: 8px;
    }
    .sidebar-content::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar-bg);
      border-radius: 4px;
    }
    ul.object-list, ul.asset-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    ul.object-list li, ul.asset-list li {
      padding: 0.3rem 0.5rem;
      border-radius: 3px;
      cursor: pointer;
      user-select: none;
    }
    ul.object-list li:hover,
    ul.asset-list li:hover,
    ul.object-list li.selected,
    ul.asset-list li.selected {
      background-color: var(--primary);
      color: var(--button-text);
      font-weight: 600;
    }
    /* Viewport */
    #viewport-container {
      flex-grow: 1;
      background: var(--bg);
      position: relative;
      display: flex;
      flex-direction: column;
    }
    #three-canvas {
      width: 100%;
      height: 100%;
      display: block;
      background: #1e1e1e;
      cursor: grab;
      flex-grow: 1;
    }
    /* Properties panel */
    #properties-panel {
      background: var(--input-bg);
      border-left: 1px solid var(--border-color);
      width: var(--sidebar-width);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    #properties-panel h2 {
      margin: 0;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      font-weight: 600;
      font-size: 1.1rem;
      user-select: text;
    }
    #properties-form {
      flex-grow: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      font-size: 0.9rem;
    }
    #properties-form label {
      font-weight: 600;
      margin-bottom: 0.25rem;
      display: block;
    }
    #properties-form input[type="text"],
    #properties-form input[type="color"] {
      width: 100%;
      padding: 0.3rem 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--input-bg);
      color: var(--input-text);
      font-size: 1rem;
      transition: border-color 0.3s ease;
      font-family: monospace;
    }
    #properties-form input[type="text"]:focus,
    #properties-form input[type="color"]:focus {
      border-color: var(--primary);
      outline: none;
    }
    /* Script editor panel */
    #script-editor {
      height: 250px;
      border-top: 1px solid var(--border-color);
    }
    /* Dark mode toggle container */
    #dark-mode-toggle {
      margin-left: auto;
    }
  </style>
</head>
<body>
  <header id="toolbar" role="banner" aria-label="Main Toolbar">
    <h1>Orgena Studio</h1>
    <button class="toolbar-btn" id="btn-new-object" aria-label="Create New Object" title="Create New Object">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6v-2z"/></svg>
    </button>
    <button class="toolbar-btn" id="btn-save-project" aria-label="Save Project" title="Save Project">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3H5c-1.1 0-2 .9-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4-10H6V5h10v4z"/></svg>
    </button>
    <button class="toolbar-btn" id="btn-load-project" aria-label="Load Project" title="Load Project">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
    </button>
    <button class="toolbar-btn" id="dark-mode-toggle" aria-label="Toggle Dark Mode" title="Toggle Dark Mode" aria-pressed="false">
      <svg id="icon-dark" viewBox="0 0 24 24" aria-hidden="true" style="display:none;">
        <path d="M12 3a9 9 0 0 0 0 18 9 9 0 0 1 0-18z"/>
      </svg>
      <svg id="icon-light" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4.5V2m0 20v-2.5m7.07-12.07l1.77-1.77M3.16 20.85l1.77-1.77m12.07 7.07H22m-20 0h2.5M16.5 12h2.5m-20 0h2.5m12.07-7.07l1.77 1.77M3.16 3.15l1.77 1.77"/>
      </svg>
    </button>
  </header>
  <div id="main" role="main">
    <aside class="sidebar" aria-label="Explorer Panel">
      <h2>Explorer</h2>
      <div class="sidebar-content" tabindex="0">
        <ul id="explorer-list" class="object-list" role="listbox" aria-multiselectable="false"></ul>
      </div>
    </aside>
    <section id="viewport-container" aria-label="3D Viewport" role="region">
      <canvas id="three-canvas" tabindex="0" aria-label="3D viewport"></canvas>
    </section>
    <aside id="properties-panel" class="sidebar" aria-label="Properties Panel">
      <h2>Properties</h2>
      <form id="properties-form" autocomplete="off" aria-live="polite">
        <label for="prop-name">Name</label>
        <input type="text" id="prop-name" name="name" aria-describedby="nameHelp" />
        <label for="prop-position">Position (x, y, z)</label>
        <input type="text" id="prop-position" name="position" placeholder="0.00, 0.00, 0.00" aria-describedby="positionHelp" pattern="^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$" />
        <label for="prop-color">Color</label>
        <input type="color" id="prop-color" name="color" aria-describedby="colorHelp" />
      </form>
      <div id="script-editor" role="region" aria-label="Script Editor"></div>
    </aside>
  </div>

  <!-- Load libraries -->
  <script src="https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.150.1/examples/js/controls/OrbitControls.min.js"></script>

  <!-- Monaco Editor loader -->
  <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.41.0/min/vs/loader.js"></script>

  <!-- Fengari Lua VM -->
  <script src="https://cdn.jsdelivr.net/npm/fengari-web@0.1.4/dist/fengari-web.min.js"></script>

  <script>
  (() => {
    // THEME MANAGEMENT
    const body = document.body;
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const iconDark = document.getElementById('icon-dark');
    const iconLight = document.getElementById('icon-light');

    function applyTheme(theme) {
      body.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        iconDark.style.display = 'inline';
        iconLight.style.display = 'none';
        toggleBtn.setAttribute('aria-pressed', 'true');
      } else {
        iconDark.style.display = 'none';
        iconLight.style.display = 'inline';
        toggleBtn.setAttribute('aria-pressed', 'false');
      }
      if(monacoEditor) {
        monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs-light');
      }
      localStorage.setItem('orgena-theme', theme);
    }
    toggleBtn.addEventListener('click', () => {
      const current = body.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
    const savedTheme = localStorage.getItem('orgena-theme') || 'light';
    applyTheme(savedTheme);

    // THREE.JS SETUP
    const container = document.getElementById("viewport-container");
    const canvas = document.getElementById("three-canvas");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5,10,7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Helpers
    scene.add(new THREE.GridHelper(20,20,0x444444,0x888888));
    scene.add(new THREE.AxesHelper(5));

    // Resize handling
    function onResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w/h;
      camera.updateProjectionMatrix();
      renderer.setSize(w,h);
      renderer.setPixelRatio(window.devicePixelRatio);
    }
    window.addEventListener('resize', onResize);
    onResize();

    camera.position.set(5,5,5);
    controls.target.set(0,1,0);
    controls.update();

    // OBJECT MANAGEMENT
    const explorerListEl = document.getElementById('explorer-list');
    const propertiesForm = document.getElementById('properties-form');
    const inputName = document.getElementById('prop-name');
    const inputPosition = document.getElementById('prop-position');
    const inputColor = document.getElementById('prop-color');
    const btnNewObject = document.getElementById('btn-new-object');
    const btnSaveProject = document.getElementById('btn-save-project');
    const btnLoadProject = document.getElementById('btn-load-project');
    const scriptEditorContainer = document.getElementById('script-editor');

    let monacoEditor = null;
    let selectedObjectId = null;
    let objectIdCounter = 0;
    const objects = {}; // id => { threeObj, name, script }

    // Generate unique IDs for objects
    function generateId() {
      return `obj_${++objectIdCounter}`;
    }

    // Create new 3D object - cube for now
    function createObject(type='cube', name='NewObject') {
      let mesh;
      if(type==='cube') {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshStandardMaterial({color: 0xff0000}));
      } else if(type==='sphere') {
        mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({color: 0x00ff00}));
      } else {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(0,1,0);
      mesh.name = name;

      const id = generateId();
      objects[id] = {
        id, name, threeObj: mesh,
        script: `-- Lua script for ${name}\nfunction update()\n  -- Your code here\nend`
      };
      scene.add(mesh);
      addObjectToExplorer(id);
      selectObject(id);
      renderScene();
      return id;
    }

    // Add object to Explorer panel
    function addObjectToExplorer(id) {
      const obj = objects[id];
      const li = document.createElement('li');
      li.textContent = obj.name;
      li.id = id;
      li.setAttribute('role','option');
      li.tabIndex = 0;
      li.classList.remove('selected');
      explorerListEl.appendChild(li);
      li.addEventListener('click', () => selectObject(id));
      li.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectObject(id);
        }
      });
    }

    // Refresh Explorer list UI
    function refreshExplorer() {
      explorerListEl.innerHTML = '';
      for(let id in objects) {
        addObjectToExplorer(id);
      }
    }

    // Select an object by ID
    function selectObject(id) {
      if(!objects[id]) return;
      selectedObjectId = id;
      for(let li of explorerListEl.children) {
        li.classList.toggle('selected', li.id === id);
        li.setAttribute('aria-selected', li.id === id ? 'true' : 'false');
      }
      const obj = objects[id];
      inputName.value = obj.name;
      inputPosition.value = obj.threeObj.position.toArray().map(n => n.toFixed(2)).join(', ');
      inputColor.value = '#' + obj.threeObj.material.color.getHexString();
      if(monacoEditor) {
        monacoEditor.setValue(obj.script);
      }
      renderScene();
    }

    // Update object properties from inputs
    function updateSelectedObject() {
      if(!selectedObjectId) return;
      const obj = objects[selectedObjectId];
      // Name
      obj.name = inputName.value.trim() || obj.name;
      obj.threeObj.name = obj.name;
      // Position
      const posStr = inputPosition.value.trim();
      const match = posStr.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
      if(match) {
        obj.threeObj.position.set(parseFloat(match[1]), parseFloat(match[3]), parseFloat(match[5]));
      }
      // Color
      try {
        obj.threeObj.material.color.set(inputColor.value);
      } catch(e) {
        // Invalid color input, ignore
      }
      // Update Explorer text
      for(let li of explorerListEl.children) {
        if(li.id === selectedObjectId) {
          li.textContent = obj.name;
        }
      }
      renderScene();
    }

    // Setup input events with debounce
    function debounce(func, wait=200) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }
    inputName.addEventListener('input', debounce(updateSelectedObject));
    inputPosition.addEventListener('input', debounce(updateSelectedObject));
    inputColor.addEventListener('input', debounce(updateSelectedObject));

    // MONACO EDITOR SETUP
    require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.41.0/min/vs' } });
    require(['vs/editor/editor.main'], () => {
      monacoEditor = monaco.editor.create(scriptEditorContainer, {
        value: '',
        language: 'lua',
        theme: body.getAttribute('data-theme') === 'dark' ? 'vs-dark' : 'vs-light',
        automaticLayout: true,
        fontSize: 14,
        fontFamily: "'Fira Code', monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        lineNumbers: 'on',
        roundedSelection: true,
        cursorStyle: 'line',
        cursorBlinking: 'blink',
        renderIndentGuides: true,
        tabSize: 2,
        insertSpaces: true,
        autoClosingBrackets: 'always',
        suggestOnTriggerCharacters: true,
      });
      monacoEditor.onDidChangeModelContent(() => {
        if(selectedObjectId) {
          objects[selectedObjectId].script = monacoEditor.getValue();
        }
      });
    });

    // RENDER LOOP
    function renderScene() {
      renderer.render(scene, camera);
    }
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      runLuaUpdates();
      renderScene();
    }

    // LUA VM via Fengari - simplified
    function runLuaUpdates() {
      if(!window.fengari) return;
      for(let id in objects) {
        const obj = objects[id];
        if(!obj.script) continue;
        try {
          const L = fengari.lauxlib.luaL_newstate();
          fengari.lualib.luaL_openlibs(L);
          fengari.lauxlib.luaL_loadstring(L, fengari.to_luastring(obj.script));
          fengari.lua.lua_pcall(L, 0, fengari.lua.LUA_MULTRET, 0);

          fengari.lua.lua_getglobal(L, "update");
          if(fengari.lua.lua_isfunction(L, -1)) {
            fengari.lua.lua_pcall(L, 0, 0, 0);
          }
        } catch(e) {
          console.warn("Lua error:", e);
        }
      }
    }

    // BUTTON EVENTS
    btnNewObject.addEventListener('click', () => {
      createObject('cube', 'Cube'+(objectIdCounter+1));
    });
    btnSaveProject.addEventListener('click', () => {
      const projectData = {
        objects: Object.values(objects).map(o => ({
          id: o.id,
          name: o.name,
          position: o.threeObj.position.toArray(),
          color: '#' + o.threeObj.material.color.getHexString(),
          script: o.script
        }))
      };
      localStorage.setItem('orgena-project', JSON.stringify(projectData));
      alert('Project saved locally.');
    });
    btnLoadProject.addEventListener('click', () => {
      const dataStr = localStorage.getItem('orgena-project');
      if(!dataStr) {
        alert('No saved project found.');
        return;
      }
      try {
        const data = JSON.parse(dataStr);
        // Clear existing objects
        for(let id in objects) {
          scene.remove(objects[id].threeObj);
        }
        Object.keys(objects).forEach(id => delete objects[id]);
        objectIdCounter = 0;
        explorerListEl.innerHTML = '';
        // Load new objects
        data.objects.forEach(objData => {
          const mesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshStandardMaterial());
          mesh.position.fromArray(objData.position);
          mesh.material.color.set(objData.color);
          mesh.name = objData.name;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          scene.add(mesh);

          objectIdCounter = Math.max(objectIdCounter, parseInt(objData.id.split('_')[1]));
          objects[objData.id] = {
            id: objData.id,
            name: objData.name,
            threeObj: mesh,
            script: objData.script
          };
        });
        refreshExplorer();
        // Select first object if any
        const firstId = Object.keys(objects)[0];
        if(firstId) selectObject(firstId);
        alert('Project loaded successfully.');
      } catch(e) {
        alert('Failed to load project: ' + e.message);
      }
    });

    // INIT: create one default object
    createObject('cube', 'Cube1');

    // Start animation loop
    animate();
  })();
  </script>
</body>
</html>
