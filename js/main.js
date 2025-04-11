document.addEventListener('DOMContentLoaded', () => {
    // Enhanced scroll animations with IntersectionObserver
    const animatedElements = document.querySelectorAll('.service-card, .collage-image, .testimonial');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger effect to services
                if (entry.target.classList.contains('service-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(el => {
        fadeInObserver.observe(el);
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // About section animations
    const aboutObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    // Animate stats with counting effect
    const statsNumbers = document.querySelectorAll('.stat-number');
    
    const animateStats = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = parseInt(target.textContent);
                let current = 0;
                const increment = Math.ceil(value / 40);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= value) {
                        target.textContent = value + (target.textContent.includes('+') ? '+' : '');
                        clearInterval(timer);
                    } else {
                        target.textContent = current + (target.textContent.includes('+') ? '+' : '');
                    }
                }, 30);
                observer.unobserve(target);
            }
        });
    };

    const statsObserver = new IntersectionObserver(animateStats, aboutObserverOptions);
    statsNumbers.forEach(stat => {
        // Store the original text to handle the plus sign
        const originalText = stat.textContent;
        const hasPlus = originalText.includes('+');
        const value = parseInt(originalText);
        
        // Start at 0
        stat.textContent = '0' + (hasPlus ? '+' : '');
        statsObserver.observe(stat);
    });

    // Image tilt effect for about images
    const aboutImages = document.querySelectorAll('.image-container');
    
    aboutImages.forEach(image => {
        image.addEventListener('mousemove', (e) => {
            const rect = image.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            // Calculate tilt angle
            const tiltX = (y - 0.5) * 10; // Vertical tilt
            const tiltY = (0.5 - x) * 10; // Horizontal tilt
            
            image.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px)`;
        });
        
        image.addEventListener('mouseleave', () => {
            image.style.transform = '';
        });
    });

    // Animate value cards on hover
    const valueItems = document.querySelectorAll('.value-item');
    
    valueItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.value-icon');
            icon.style.transform = 'scale(1.2) rotate(5deg)';
            icon.style.color = 'var(--primary-color)';
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.value-icon');
            icon.style.transform = '';
            icon.style.color = '';
        });
    });

    // Custom cursor effect for interactive elements (inspired by Studio Tom)
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
    });

    const interactiveElements = document.querySelectorAll('a, button, .service-card, .project-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-hover');
        });
    });

    // Enhanced service cards with detailed information
    const serviceItems = [
        {
            title: "Interior Design",
            icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="currentColor"/></svg>',
            description: "Creative solutions that balance aesthetics and functionality",
            details: "Our comprehensive interior design services transform spaces into personalized environments that reflect your unique style and meet your functional needs. We handle everything from conceptualization to final styling touches.",
            features: [
                "Custom space planning and layout optimization",
                "Color scheme and material selection",
                "Furniture and décor curation",
                "Lighting design and solutions"
            ]
        },
        {
            title: "Spatial Planning",
            icon: '<svg viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" fill="currentColor"/></svg>',
            description: "Optimizing your space for both beauty and practicality",
            details: "We analyze spatial relationships to create efficient floor plans that maximize functionality while maintaining aesthetic appeal. Our planning process ensures every square meter of your space serves a purpose.",
            features: [
                "Technical floor plan development",
                "Traffic flow optimization",
                "Spatial zoning for multi-functional areas",
                "Accessibility considerations and solutions"
            ]
        },
        {
            title: "Material Selection",
            icon: '<svg viewBox="0 0 100 100"><polygon points="50,20 80,80 20,80" fill="currentColor"/></svg>',
            description: "Curated selection of premium materials and finishes",
            details: "Our material selection process involves sourcing the perfect textures, finishes, and materials that align with your design vision while meeting practical requirements for durability and maintenance.",
            features: [
                "Custom material palettes and mood boards",
                "Sustainable and eco-friendly options",
                "Tactile sample presentation and comparison",
                "Finish scheduling and specification documentation"
            ]
        },
        {
            title: "3D Visualization",
            icon: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="40" ry="30" fill="currentColor"/></svg>',
            description: "Immersive previews of your future space",
            details: "Experience your design before implementation through our advanced 3D visualization services. These photorealistic renderings help you make informed decisions and refine the design to perfection.",
            features: [
                "Photorealistic 3D renderings",
                "Virtual walk-throughs of designed spaces",
                "Lighting simulation at different times of day",
                "Material and finish visualization"
            ]
        },
        {
            title: "Project Management",
            icon: '<svg viewBox="0 0 100 100"><rect x="20" y="20" width="28" height="28" fill="currentColor"/><rect x="52" y="20" width="28" height="28" fill="currentColor"/><rect x="20" y="52" width="28" height="28" fill="currentColor"/><rect x="52" y="52" width="28" height="28" fill="currentColor"/></svg>',
            description: "Seamless coordination from concept to completion",
            details: "Our project management services ensure your design vision is executed flawlessly. We coordinate all aspects of the project, from contractor selection to final installation, keeping everything on schedule and within budget.",
            features: [
                "Contractor selection and coordination",
                "Budget management and cost control",
                "Timeline development and milestone tracking",
                "Quality control and problem resolution"
            ]
        },
        {
            title: "Custom Furniture Design",
            icon: '<svg viewBox="0 0 100 100"><path d="M20,80 L20,50 L40,40 L60,40 L80,50 L80,80 Z" fill="currentColor"/><rect x="30" y="30" width="40" height="10" fill="currentColor"/></svg>',
            description: "Bespoke pieces designed exclusively for your space",
            details: "When standard furniture doesn't meet your unique requirements, our custom furniture design service creates one-of-a-kind pieces perfectly tailored to your space and style preferences.",
            features: [
                "Custom design concept development",
                "Material and finish selection",
                "Prototype review and refinement",
                "Production oversight and quality control"
            ]
        }
    ];

    // Populate services grid with enhanced service cards
    const servicesGrid = document.querySelector('.services-grid');
    
    // Clear any existing service cards
    servicesGrid.innerHTML = '';
    
    serviceItems.forEach((item, index) => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        
        // Create the service card HTML structure
        serviceCard.innerHTML = `
            <div class="service-icon" id="icon-${index + 1}">
                ${item.icon}
            </div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="service-details">
                <p>${item.details}</p>
                <ul class="service-features">
                    ${item.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            <button class="service-expand-btn">Learn More</button>
        `;
        
        servicesGrid.appendChild(serviceCard);
        
        // Add the expand/collapse functionality
        const expandBtn = serviceCard.querySelector('.service-expand-btn');
        const serviceDetails = serviceCard.querySelector('.service-details');
        
        // Initially hide the details
        serviceDetails.style.display = 'block';
        serviceDetails.style.maxHeight = '0';
        serviceDetails.style.opacity = '0';
        
        expandBtn.addEventListener('click', () => {
            const isExpanded = serviceDetails.classList.contains('expanded');
            
            if (isExpanded) {
                serviceDetails.classList.remove('expanded');
                serviceDetails.style.maxHeight = '0';
                serviceDetails.style.opacity = '0';
                expandBtn.textContent = 'Learn More';
                
                // Scroll to card top if it's offscreen after collapse
                setTimeout(() => {
                    const cardRect = serviceCard.getBoundingClientRect();
                    if (cardRect.top < 0) {
                        serviceCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            } else {
                serviceDetails.classList.add('expanded');
                serviceDetails.style.maxHeight = '500px';
                serviceDetails.style.opacity = '1';
                expandBtn.textContent = 'Show Less';
                
                // Ensure expanded content is visible
                setTimeout(() => {
                    const detailsBottom = serviceDetails.getBoundingClientRect().bottom;
                    const viewportHeight = window.innerHeight;
                    if (detailsBottom > viewportHeight) {
                        serviceDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }, 300);
            }
        });
    });

    // Set the service icon colors using the existing code pattern
    document.querySelectorAll('.service-icon').forEach((icon, index) => {
        icon.style.color = `hsl(30, ${20 + index * 10}%, ${60 + index * 5}%)`;
    });

    // Updated Projects data with detailed interior design projects
    const projectItems = [
        {
            title: 'Nordic Haven Residence',
            category: 'Residential',
            description: 'Scandinavian-inspired open concept living space with natural materials and neutral palette',
            client: 'Private Residence, Stockholm',
            year: '2024',
            color: '#e6c9a8',
            details: 'A complete home transformation featuring light oak flooring, custom built-ins, and a minimalist approach to create a serene living environment.'
        },
        {
            title: 'Urban Loft Revitalization',
            category: 'Residential',
            description: 'Industrial warehouse conversion with exposed elements and contemporary furnishings',
            client: 'Downtown Loft Development',
            year: '2023',
            color: '#d1bfa7',
            details: 'Preserving original brick walls and beams while introducing modern elements for a perfect balance of old and new in this 200m² space.'
        },
        {
            title: 'Serenity Spa Retreat',
            category: 'Commercial',
            description: 'Luxury wellness center with biophilic design principles and custom lighting solutions',
            client: 'Harmony Wellness Group',
            year: '2024',
            color: '#c4b095',
            details: 'A tranquil oasis featuring natural stone, living walls, and a bespoke water feature that creates an immersive sensory experience.'
        },
        {
            title: 'Artisan Café Design',
            category: 'Hospitality',
            description: 'Boutique coffee shop featuring local craftsmanship and sustainable materials',
            client: 'Maple & Bean Coffee Co.',
            year: '2023',
            color: '#e8e1d9',
            details: 'Custom furniture and fixtures crafted by local artisans, with an innovative layout that transforms from day to night service.'
        },
        {
            title: 'Modernist Family Home',
            category: 'Residential',
            description: 'Contemporary family residence with open plan and indoor-outdoor flow',
            client: 'Private Residence, Coastal Suburbs',
            year: '2024',
            color: '#d8cec0',
            details: 'Featuring floor-to-ceiling windows, custom millwork, and an integrated smart home system with a focus on energy efficiency.'
        },
        {
            title: 'Executive Office Suite',
            category: 'Commercial',
            description: 'High-end corporate headquarters with dynamic collaborative spaces',
            client: 'Vertex Innovation Group',
            year: '2023',
            color: '#c9bbaa',
            details: 'Balancing aesthetics and functionality with acoustic solutions, custom workstations, and flexible meeting areas for optimal productivity.'
        }
    ];

    // Populate projects grid with enhanced project cards
    const projectsGrid = document.querySelector('.projects-grid');
    projectItems.forEach(item => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.style.backgroundColor = item.color;
        
        projectItem.innerHTML = `
            <div class="project-meta">
                <span class="project-year">${item.year}</span>
                <span class="project-client">${item.client}</span>
            </div>
            <div class="project-overlay">
                <span class="project-category">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="project-details">
                    <p>${item.details}</p>
                </div>
            </div>
        `;
        
        // Random rotation for collage effect
        const rotation = (Math.random() * 3) - 1.5;
        projectItem.style.transform = `rotate(${rotation}deg)`;
        
        // Add hover effect
        projectItem.addEventListener('mouseenter', () => {
            projectItem.style.transform = 'rotate(0deg) scale(1.02)';
            projectItem.querySelector('.project-details').style.opacity = '1';
        });
        
        projectItem.addEventListener('mouseleave', () => {
            projectItem.style.transform = `rotate(${rotation}deg)`;
            projectItem.querySelector('.project-details').style.opacity = '0';
        });
        
        projectsGrid.appendChild(projectItem);
    });

    // Testimonials content
    const testimonials = [
        {
            text: "Studio Tom transformed our apartment into a masterpiece of design. Their creative approach and attention to detail exceeded our expectations.",
            author: "Sarah Johnson",
            role: "Homeowner"
        },
        {
            text: "Working with Studio Tom was an absolute delight. They understood our vision perfectly and delivered a space that reflects our brand and values.",
            author: "Michael Chen",
            role: "Business Owner"
        },
        {
            text: "The team at Studio Tom has an extraordinary ability to blend aesthetic appeal with functional design. Our office space is now both beautiful and practical.",
            author: "Emily Rodriguez",
            role: "Office Manager"
        }
    ];

    // Populate testimonials slider
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    testimonials.forEach(testimonial => {
        const testimonialDiv = document.createElement('div');
        testimonialDiv.className = 'testimonial';
        testimonialDiv.innerHTML = `
            <blockquote>${testimonial.text}</blockquote>
            <cite>
                <span class="author">${testimonial.author}</span>
                <span class="role">${testimonial.role}</span>
            </cite>
        `;
        testimonialsSlider.appendChild(testimonialDiv);
    });

    // Service icons - create paper-like shapes for service icons
    document.querySelectorAll('.service-icon').forEach((icon, index) => {
        // Create various geometric shapes for service icons
        const shapes = [
            '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="currentColor"/></svg>',
            '<svg viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" fill="currentColor"/></svg>',
            '<svg viewBox="0 0 100 100"><polygon points="50,20 80,80 20,80" fill="currentColor"/></svg>',
            '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="40" ry="30" fill="currentColor"/></svg>'
        ];
        
        icon.innerHTML = shapes[index % shapes.length];
        icon.style.color = `hsl(30, ${20 + index * 10}%, ${60 + index * 5}%)`;
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success message (in a real implementation, you would send the form data to a server)
            const formFields = contactForm.querySelectorAll('input, textarea');
            formFields.forEach(field => field.value = '');
            
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            successMessage.style.cssText = `
                background-color: var(--primary-color);
                color: var(--white);
                padding: 1rem;
                border-radius: 8px;
                text-align: center;
                margin-top: 1rem;
                opacity: 1;
                transition: opacity 0.5s ease;
            `;
            
            contactForm.appendChild(successMessage);
            
            setTimeout(() => {
                successMessage.style.opacity = '0';
                setTimeout(() => successMessage.remove(), 500);
            }, 3000);
        });
    }

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add paper texture overlay to the page
    const paperTexture = document.createElement('div');
    paperTexture.className = 'paper-texture';
    document.body.appendChild(paperTexture);

    // CTA Button event
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                window.scrollTo({
                    top: contactSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Highlight the form
                const form = document.querySelector('.contact-form');
                form.style.boxShadow = '0 0 0 3px var(--accent-color)';
                
                setTimeout(() => {
                    form.style.boxShadow = '';
                }, 2000);
            }
        });
    }
});