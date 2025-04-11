let scene, camera, renderer, controls;
let paperElements = [];

function init() {
    // Initialize scene with a light background to match the paper aesthetic
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f2ed); // Paper color

    // Use a more artistic camera angle
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(4, 2, 4);
    
    // Set up renderer with paper-like quality
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('room-model').appendChild(renderer.domElement);

    // Add subtle lighting for paper look
    setupLighting();

    // Create artistic room design
    createArtisticRoom();

    // Add floating paper elements for the collage effect
    addPaperElements();

    // Setup camera controls
    setupControls();

    // Add window resize handler
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();
}

function setupLighting() {
    // Ambient light for general illumination - warmer tone
    const ambientLight = new THREE.AmbientLight(0xf5e5d5, 0.6);
    scene.add(ambientLight);

    // Main directional light with warm tone
    const mainLight = new THREE.DirectionalLight(0xfff0e0, 0.8);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 30;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    scene.add(mainLight);

    // Accent light for the artistic touch
    const accentLight = new THREE.PointLight(0xe6c9a8, 0.6);
    accentLight.position.set(-3, 2, -3);
    scene.add(accentLight);
}

function createArtisticRoom() {
    // Create more artistic materials with paper-like textures
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xe5d3b3,
        roughness: 0.9,
        metalness: 0.1
    });

    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf5f2ed,
        roughness: 0.95,
        metalness: 0.05
    });

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls with artistic angles
    createWall(-5, 2, 0, Math.PI / 2, wallMaterial); // Left wall
    createWall(5, 2, 0, -Math.PI / 2, wallMaterial); // Right wall
    createWall(0, 2, -5, 0, wallMaterial); // Back wall

    // Add stylized furniture
    addStylizedFurniture();
}

function createWall(x, y, z, rotation, material) {
    const wallGeometry = new THREE.PlaneGeometry(10, 4);
    const wall = new THREE.Mesh(wallGeometry, material);
    wall.position.set(x, y, z);
    wall.rotation.y = rotation;
    wall.receiveShadow = true;
    scene.add(wall);
}

function addStylizedFurniture() {
    // Use colors from Studio Tom palette
    const primaryMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3d3b39, // Dark brown
        roughness: 0.7,
        metalness: 0.1
    });
    
    const accentMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xe6c9a8, // Accent beige
        roughness: 0.5,
        metalness: 0.2
    });

    // Create a stylized sofa that looks like it's made of paper cutouts
    const sofa = createSofa(primaryMaterial, accentMaterial);
    sofa.position.set(0, 0.5, -3);
    scene.add(sofa);

    // Add a stylized coffee table
    const table = createTable(accentMaterial);
    table.position.set(0, 0.3, -1.5);
    scene.add(table);

    // Add decorative elements
    addDecorativeElements();
}

function createSofa(primaryMaterial, accentMaterial) {
    const sofaGroup = new THREE.Group();

    // Main body with rounded edges for paper-like feel
    const bodyGeometry = new THREE.BoxGeometry(3, 0.6, 1);
    const body = new THREE.Mesh(bodyGeometry, primaryMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    sofaGroup.add(body);

    // Backrest with slight tilt
    const backGeometry = new THREE.BoxGeometry(3, 1, 0.3);
    const back = new THREE.Mesh(backGeometry, primaryMaterial);
    back.position.set(0, 0.5, -0.5);
    back.rotation.x = Math.PI * 0.05;
    back.castShadow = true;
    back.receiveShadow = true;
    sofaGroup.add(back);

    // Cushions with accent color
    const cushionGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.8);
    const cushionPositions = [-0.9, 0, 0.9];
    
    cushionPositions.forEach(xPos => {
        const cushion = new THREE.Mesh(cushionGeometry, accentMaterial);
        cushion.position.set(xPos, 0.4, 0);
        cushion.castShadow = true;
        cushion.receiveShadow = true;
        sofaGroup.add(cushion);
    });

    return sofaGroup;
}

function createTable(material) {
    const tableGroup = new THREE.Group();

    // Table top with paper-like appearance (thin)
    const topGeometry = new THREE.CylinderGeometry(1, 1, 0.05, 32);
    const top = new THREE.Mesh(topGeometry, material);
    top.position.y = 0.4;
    top.castShadow = true;
    tableGroup.add(top);

    // Single central leg with artistic angle
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 12);
    const leg = new THREE.Mesh(legGeometry, material);
    leg.position.y = 0;
    leg.castShadow = true;
    tableGroup.add(leg);

    return tableGroup;
}

function addDecorativeElements() {
    // Add a vase with artistic form
    const vaseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xd1bfa7, // Studio Tom color
        roughness: 0.3,
        metalness: 0.5
    });
    
    const vaseBaseGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.4, 16);
    const vaseBase = new THREE.Mesh(vaseBaseGeometry, vaseMaterial);
    vaseBase.position.set(0, 0.6, -1.5);
    vaseBase.castShadow = true;
    scene.add(vaseBase);
    
    // Create a stylized plant (abstract form)
    const stemMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8e7b65,
        roughness: 0.9,
        metalness: 0.1
    });
    
    const leafMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xc4b095,
        roughness: 0.8,
        metalness: 0.1
    });
    
    // Add abstract plant stems
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const stemGeometry = new THREE.BoxGeometry(0.05, 0.8 + Math.random() * 0.4, 0.05);
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        
        stem.position.set(
            0 + Math.sin(angle) * 0.05,
            1 + Math.random() * 0.2,
            -1.5 + Math.cos(angle) * 0.05
        );
        
        // Random slight tilt
        stem.rotation.x = (Math.random() - 0.5) * 0.2;
        stem.rotation.z = (Math.random() - 0.5) * 0.4;
        stem.castShadow = true;
        scene.add(stem);
        
        // Add a leaf to each stem
        const leafGeometry = new THREE.PlaneGeometry(0.2 + Math.random() * 0.3, 0.2 + Math.random() * 0.3);
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        
        leaf.position.set(
            stem.position.x + (Math.random() - 0.5) * 0.3,
            stem.position.y + 0.2 + Math.random() * 0.3,
            stem.position.z + (Math.random() - 0.5) * 0.3
        );
        
        // Random rotation for leaves
        leaf.rotation.x = Math.random() * Math.PI;
        leaf.rotation.y = Math.random() * Math.PI;
        leaf.rotation.z = Math.random() * Math.PI;
        leaf.castShadow = true;
        scene.add(leaf);
    }
}

function addPaperElements() {
    // Create floating paper-like elements for the collage effect
    const paperColors = [
        0xe6c9a8, // Studio Tom accent color
        0xd1bfa7, // Lighter accent
        0xf5f2ed, // Paper color
        0xc4b095  // Darker accent
    ];
    
    // Various paper shapes
    const paperGeometries = [
        new THREE.PlaneGeometry(1, 1.5),   // Rectangle
        new THREE.CircleGeometry(0.7, 32),  // Circle
        new THREE.PlaneGeometry(1.2, 1.2)   // Square
    ];
    
    // Create several floating paper elements
    for (let i = 0; i < 7; i++) {
        const paperMaterial = new THREE.MeshStandardMaterial({
            color: paperColors[Math.floor(Math.random() * paperColors.length)],
            roughness: 0.9,
            metalness: 0.1,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });
        
        const geometry = paperGeometries[Math.floor(Math.random() * paperGeometries.length)];
        const paper = new THREE.Mesh(geometry, paperMaterial);
        
        // Position papers throughout the scene
        paper.position.set(
            (Math.random() - 0.5) * 8,
            Math.random() * 4 + 1,
            (Math.random() - 0.5) * 8
        );
        
        // Random rotation
        paper.rotation.x = Math.random() * Math.PI;
        paper.rotation.y = Math.random() * Math.PI;
        paper.rotation.z = Math.random() * Math.PI;
        
        paper.castShadow = true;
        scene.add(paper);
        
        // Store for animation
        paperElements.push({
            mesh: paper,
            initialY: paper.position.y,
            floatSpeed: 0.2 + Math.random() * 0.3,
            rotateSpeed: (Math.random() - 0.5) * 0.01
        });
    }
}

function setupControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.target.set(0, 1, -2);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Animate floating paper elements
    const time = Date.now() * 0.001;
    
    paperElements.forEach(element => {
        // Gentle floating motion
        element.mesh.position.y = element.initialY + Math.sin(time * element.floatSpeed) * 0.2;
        
        // Subtle rotation
        element.mesh.rotation.x += element.rotateSpeed;
        element.mesh.rotation.y += element.rotateSpeed * 0.7;
    });
    
    controls.update();
    renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', init);