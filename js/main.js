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