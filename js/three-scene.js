let scene, camera, renderer, controls;
let particles = [];
let isInitialized = false;
let scrollY = 0;
let targetScrollY = 0;
let mouse = { x: 0, y: 0 };
let targetMouse = { x: 0, y: 0 };

// Add global state variables for advanced interactions
let magneticEffect = { active: false, intensity: 0, position: { x: 0, y: 0 } };
let heroInteractionParams = null;
let scrollState = { position: 0, direction: 'down', velocity: 0 };
let sectionInView = null;
let particlePulseActive = false;
let particlePulseOrigin = { x: 0, y: 0, z: 0 };
let particlePulseTime = 0;

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
        
        // Add scroll event listener
        window.addEventListener('scroll', onScroll, false);
        
        // Add mouse move event listener with more detailed tracking
        window.addEventListener('mousemove', onMouseMove, false);
        
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
            },
            // Add mouse sensitivity - different for each particle
            mouseSensitivity: {
                x: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
                y: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
            },
            // Add scroll sensitivity
            scrollSensitivity: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
            // Random parallax depth factor
            parallaxFactor: Math.random() * 0.5 + 0.5
        });
    }
    
    // Add subtle lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(5, 5, 20);
    scene.add(pointLight);

    // Make global functions available to main.js
    window.pulseParticles = pulseParticles;
    window.setHeroInteraction = setHeroInteraction;
}

// Create a pulse effect that ripples through particles when a section comes into view
function pulseParticles(sectionId) {
    particlePulseActive = true;
    particlePulseTime = 0;
    
    // Set pulse origin based on section
    switch(sectionId) {
        case 'about':
            particlePulseOrigin = { x: -20, y: 0, z: 0 };
            break;
        case 'services':
            particlePulseOrigin = { x: 20, y: 0, z: 0 };
            break;
        case 'projects':
            particlePulseOrigin = { x: 0, y: -20, z: 0 };
            break;
        case 'testimonials':
            particlePulseOrigin = { x: 0, y: 20, z: 0 };
            break;
        case 'contact':
            particlePulseOrigin = { x: 0, y: 0, z: -30 };
            break;
        default:
            particlePulseOrigin = { x: 0, y: 0, z: 0 };
    }
    
    // Reset pulse after 3 seconds
    setTimeout(() => {
        particlePulseActive = false;
    }, 3000);
}

// Handle hero section interaction effect
function setHeroInteraction(params) {
    heroInteractionParams = params;
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

// Update mouse effect handler - now considers both regular mouse and magnetic effects
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Sync with global magnetic effect state
    if (window.magneticEffect) {
        magneticEffect = window.magneticEffect;
    }
}

// Handle scroll events with enhanced tracking
function onScroll() {
    // Get current scroll position
    targetScrollY = window.scrollY;
    
    // Sync with global scroll state
    if (window.scrollState) {
        scrollState = window.scrollState;
    }
    
    // Sync with section visibility state
    if (window.sectionInView) {
        sectionInView = window.sectionInView;
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    if (!isInitialized) return;
    
    const time = Date.now() * 0.001;
    
    // Smooth transitions for mouse and scroll
    mouse.x += (targetMouse.x - mouse.x) * 0.05;
    mouse.y += (targetMouse.y - mouse.y) * 0.05;
    scrollY += (targetScrollY - scrollY) * 0.1;
    
    // Update pulse effect time if active
    if (particlePulseActive) {
        particlePulseTime += 0.016; // Roughly 60fps
    }
    
    // Animate floating elements with enhanced cursor, magnetic and scroll influence
    particles.forEach(particle => {
        // Base animation - gentle floating motion
        let posX = particle.initialPosition.x + Math.sin(time * particle.moveSpeed.x) * 2;
        let posY = particle.initialPosition.y + Math.cos(time * particle.moveSpeed.y) * 2;
        let posZ = particle.initialPosition.z + Math.sin(time * particle.moveSpeed.z) * 1;
        
        // Add cursor influence - particles move subtly with cursor
        posX += mouse.x * 5 * particle.mouseSensitivity.x;
        posY += mouse.y * 5 * particle.mouseSensitivity.y;
        
        // Add magnetic effect when hovering interactive elements
        if (magneticEffect.active) {
            const mx = magneticEffect.position.x;
            const my = magneticEffect.position.y;
            const distanceFromMouse = Math.sqrt(
                Math.pow(particle.mesh.position.x - (mx * 20), 2) +
                Math.pow(particle.mesh.position.y - (my * 20), 2)
            );
            
            // Particles are attracted to or repelled from the cursor
            const gravitationalPull = 15 / (distanceFromMouse + 1) * magneticEffect.intensity;
            const directionX = (mx * 20 - particle.mesh.position.x);
            const directionY = (my * 20 - particle.mesh.position.y);
            
            // Apply a force based on distance and direction
            posX += directionX * gravitationalPull * 0.01;
            posY += directionY * gravitationalPull * 0.01;
        }
        
        // Add enhanced hero interaction effect
        if (heroInteractionParams) {
            posX += heroInteractionParams.x * particle.mouseSensitivity.x * heroInteractionParams.intensity;
            posY += heroInteractionParams.y * particle.mouseSensitivity.y * heroInteractionParams.intensity;
        }
        
        // Add scroll influence with direction awareness - creates parallax effect
        posY += (scrollY * 0.01) * particle.scrollSensitivity;
        
        // Add scroll velocity effect - particles react to how fast user scrolls
        if (scrollState.velocity > 5) {
            const scrollForce = scrollState.velocity * 0.005;
            const scrollDirection = scrollState.direction === 'down' ? -1 : 1;
            posY += scrollForce * scrollDirection * particle.scrollSensitivity;
        }
        
        // Add section transition pulse effect
        if (particlePulseActive) {
            const distanceToPulse = Math.sqrt(
                Math.pow(particle.initialPosition.x - particlePulseOrigin.x, 2) +
                Math.pow(particle.initialPosition.y - particlePulseOrigin.y, 2) +
                Math.pow(particle.initialPosition.z - particlePulseOrigin.z, 2)
            );
            
            // Create a ripple effect that moves outward
            const pulseDistance = particlePulseTime * 15; // Speed of pulse
            const pulseMagnitude = 2; // Size of pulse
            const pulseWidth = 10; // Width of pulse wave
            
            if (Math.abs(distanceToPulse - pulseDistance) < pulseWidth) {
                const pulseFactor = 1 - (Math.abs(distanceToPulse - pulseDistance) / pulseWidth);
                const pulseDirection = {
                    x: (particle.initialPosition.x - particlePulseOrigin.x) / (distanceToPulse || 1),
                    y: (particle.initialPosition.y - particlePulseOrigin.y) / (distanceToPulse || 1),
                    z: (particle.initialPosition.z - particlePulseOrigin.z) / (distanceToPulse || 1)
                };
                
                posX += pulseDirection.x * pulseFactor * pulseMagnitude;
                posY += pulseDirection.y * pulseFactor * pulseMagnitude;
                posZ += pulseDirection.z * pulseFactor * pulseMagnitude;
            }
        }
        
        // Apply position with subtle smoothing
        particle.mesh.position.x = posX;
        particle.mesh.position.y = posY;
        particle.mesh.position.z = posZ;
        
        // Enhanced rotation animation with mouse influence
        particle.mesh.rotation.x += particle.rotationSpeed.x + (mouse.y * 0.001);
        particle.mesh.rotation.y += particle.rotationSpeed.y + (mouse.x * 0.001);
        particle.mesh.rotation.z += particle.rotationSpeed.z;
        
        // Enhanced scale effect based on mouse proximity to create depth effect
        const mouseDistance = Math.sqrt(
            Math.pow(mouse.x * window.innerWidth / 2 - (posX * 50), 2) + 
            Math.pow(mouse.y * window.innerHeight / 2 - (posY * 50), 2)
        ) / 500;
        
        // Subtle scale effect on mouse proximity with scroll influence
        let targetScale = particle.mesh.scale.x;
        
        // Base scale effect from mouse proximity
        targetScale = particle.mesh.scale.x + (1 - Math.min(mouseDistance, 1)) * 0.1 * particle.parallaxFactor;
        
        // Add magnetic effect on scale
        if (magneticEffect.active) {
            const distanceToMagneticCenter = Math.sqrt(
                Math.pow(particle.mesh.position.x - (magneticEffect.position.x * 20), 2) +
                Math.pow(particle.mesh.position.y - (magneticEffect.position.y * 20), 2)
            );
            const magneticScale = 0.2 * Math.max(0, 1 - (distanceToMagneticCenter / 30));
            targetScale += magneticScale;
        }
        
        // Add pulse scale effect
        if (particlePulseActive) {
            const distanceToPulse = Math.sqrt(
                Math.pow(particle.initialPosition.x - particlePulseOrigin.x, 2) +
                Math.pow(particle.initialPosition.y - particlePulseOrigin.y, 2) +
                Math.pow(particle.initialPosition.z - particlePulseOrigin.z, 2)
            );
            const pulseDistance = particlePulseTime * 15;
            const pulseWidth = 10;
            
            if (Math.abs(distanceToPulse - pulseDistance) < pulseWidth) {
                const pulseFactor = 1 - (Math.abs(distanceToPulse - pulseDistance) / pulseWidth);
                targetScale += pulseFactor * 0.3;
            }
        }
        
        // Apply scale with smoothing
        const scale = particle.mesh.scale.x;
        particle.mesh.scale.set(
            scale + (targetScale - scale) * 0.05,
            scale + (targetScale - scale) * 0.05, 
            scale + (targetScale - scale) * 0.05
        );
    });
    
    // More responsive camera based on interactions
    if (camera) {
        // Base subtle mouse following
        let targetCameraX = mouse.x * 2;
        let targetCameraY = mouse.y * 2;
        
        // Add hero interaction effect to camera
        if (heroInteractionParams) {
            targetCameraX += heroInteractionParams.x * 1.5;
            targetCameraY += heroInteractionParams.y * 1.5;
        }
        
        // Add scroll influence to camera
        if (scrollState.velocity > 5) {
            const scrollDirection = scrollState.direction === 'down' ? -1 : 1;
            targetCameraY += scrollDirection * (scrollState.velocity * 0.01);
        }
        
        // Apply camera position with smoothing
        camera.position.x += (targetCameraX - camera.position.x) * 0.02;
        camera.position.y += (targetCameraY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
    }
    
    // Update controls and render
    controls.update();
    renderer.render(scene, camera);
}

// Initialize scene on DOM loaded
document.addEventListener('DOMContentLoaded', init);

// Reinitialize if needed from main.js
window.reinitThreeScene = init;