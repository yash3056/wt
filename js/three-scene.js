let scene, camera, renderer, controls;
let particles = [];
let isInitialized = false;

function init() {
    // Initialize scene with a gradient background
    scene = new THREE.Scene();

    // Camera setup for a more immersive view
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 20);
    
    // Set up renderer with high quality settings
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Find the container element and append renderer
    const container = document.getElementById('room-model');
    if (container) {
        // Clear any existing canvas
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);
        
        // Style the container for fullscreen background
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '-1';
        
        // Create gradient background similar to Spafax
        createBackgroundGradient();
        
        // Add 3D elements
        createFloatingElements();
        
        // Setup camera controls with smooth movement
        setupControls();
        
        // Add window resize handler
        window.addEventListener('resize', onWindowResize, false);
        
        // Start animation loop
        animate();
        
        isInitialized = true;
    } else {
        console.error('Container element not found');
    }
}

function createBackgroundGradient() {
    // Create a gradient texture with black to dark gray
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2048;
    
    const context = canvas.getContext('2d');
    
    // Create gradient - using black color palette
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000000'); // Pure black at top
    gradient.addColorStop(0.5, '#0a0a0a'); // Very dark gray in middle
    gradient.addColorStop(1, '#121212'); // Slightly lighter dark gray at bottom
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // Create a background plane that fills the view
    const bgGeometry = new THREE.PlaneGeometry(2000, 2000);
    const bgMaterial = new THREE.MeshBasicMaterial({ map: texture, depthWrite: false });
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    
    // Position the background
    bgMesh.position.z = -100;
    bgMesh.renderOrder = -1000; // Render first
    
    scene.add(bgMesh);
    
    // Add subtle vignette effect
    addVignette();
}

function addVignette() {
    // Add a subtle vignette effect for depth
    const vignetteGeometry = new THREE.PlaneGeometry(2000, 2000);
    const vignetteMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
            uAspect: { value: window.innerWidth / window.innerHeight }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float uAspect;
            
            void main() {
                vec2 uv = vUv - 0.5;
                uv.x *= uAspect;
                
                float vig = 1.0 - length(uv) * 0.7;
                vig = smoothstep(0.0, 1.0, vig);
                
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0 - vig);
            }
        `
    });
    
    const vignetteMesh = new THREE.Mesh(vignetteGeometry, vignetteMaterial);
    vignetteMesh.position.z = -95;
    vignetteMesh.renderOrder = -999;
    scene.add(vignetteMesh);
}

function createFloatingElements() {
    // Create particles for black background
    const particleCount = 60;
    const particleGeometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.7, 16, 16),
        new THREE.TetrahedronGeometry(0.8),
        new THREE.OctahedronGeometry(0.7)
    ];
    
    // Materials with slight transparency - more subtle on black
    const particleMaterials = [
        new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.7 }), // Dark gray
        new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.5 }), // Medium dark gray
        new THREE.MeshBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.6 }), // Very dark gray
        new THREE.MeshBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.6 })  // Lighter gray
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = particleGeometries[Math.floor(Math.random() * particleGeometries.length)];
        const material = particleMaterials[Math.floor(Math.random() * particleMaterials.length)];
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Distribute particles in 3D space
        particle.position.x = (Math.random() - 0.5) * 80;
        particle.position.y = (Math.random() - 0.5) * 50;
        particle.position.z = (Math.random() - 0.5) * 40 - 10;
        
        // Random scale for variety
        const scale = Math.random() * 0.6 + 0.2;
        particle.scale.set(scale, scale, scale);
        
        // Random rotation
        particle.rotation.x = Math.random() * Math.PI;
        particle.rotation.y = Math.random() * Math.PI;
        particle.rotation.z = Math.random() * Math.PI;
        
        scene.add(particle);
        
        // Store for animation
        particles.push({
            mesh: particle,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.003,
                y: (Math.random() - 0.5) * 0.003,
                z: (Math.random() - 0.5) * 0.003
            },
            moveSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.005
            },
            initialPosition: {
                x: particle.position.x,
                y: particle.position.y,
                z: particle.position.z
            }
        });
    }
    
    // Add subtle lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(5, 5, 20);
    scene.add(pointLight);
}

function setupControls() {
    // Use OrbitControls for camera movement
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Disable zoom for background effect
    controls.enablePan = false;  // Disable panning for background effect
    controls.rotateSpeed = 0.07; // Slow down rotation for subtle movement
    controls.autoRotate = true;  // Auto-rotate for ambient movement
    controls.autoRotateSpeed = 0.1; // Very slow rotation
}

function onWindowResize() {
    // Update camera and renderer on window resize
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (!isInitialized) return;
    
    const time = Date.now() * 0.001;
    
    // Animate floating elements
    particles.forEach(particle => {
        // Gentle floating motion
        particle.mesh.position.x = particle.initialPosition.x + Math.sin(time * particle.moveSpeed.x) * 2;
        particle.mesh.position.y = particle.initialPosition.y + Math.cos(time * particle.moveSpeed.y) * 2;
        particle.mesh.position.z = particle.initialPosition.z + Math.sin(time * particle.moveSpeed.z) * 1;
        
        // Subtle rotation
        particle.mesh.rotation.x += particle.rotationSpeed.x;
        particle.mesh.rotation.y += particle.rotationSpeed.y;
        particle.mesh.rotation.z += particle.rotationSpeed.z;
    });
    
    // Mouse interaction - move particles slightly based on mouse position
    if (window.mouseX !== undefined && window.mouseY !== undefined) {
        particles.forEach(particle => {
            particle.mesh.position.x += (window.mouseX * 0.0005);
            particle.mesh.position.y += (window.mouseY * 0.0005);
        });
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// Track mouse movement for interactive effect
window.addEventListener('mousemove', (event) => {
    window.mouseX = (event.clientX - window.innerWidth / 2);
    window.mouseY = -(event.clientY - window.innerHeight / 2);
});

// Initialize scene on DOM loaded
document.addEventListener('DOMContentLoaded', init);

// Reinitialize if needed from main.js
window.reinitThreeScene = init;