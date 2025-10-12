// ===================================
// Ray's Wonderland - Main JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    initMobileMenu();

    // Category filter for home page
    initCategoryFilter();

    // Contact form handler
    initContactForm();

    // Image lightbox
    initImageLightbox();

    // Project navigation for projects page
    initProjectNavigation();
});

// ===================================
// Mobile Menu
// ===================================
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !hamburger.contains(event.target)) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }
}

// ===================================
// Category Filter (Home Page)
// ===================================
function initCategoryFilter() {
    const categoryLinks = document.querySelectorAll('.category-link');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (categoryLinks.length === 0 || galleryItems.length === 0) {
        return; // Not on home page
    }

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            categoryLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Get selected category
            const category = this.getAttribute('data-category');

            // Filter gallery items - hide/show the parent anchor tag to prevent gaps
            galleryItems.forEach(item => {
                const parentLink = item.closest('a');
                if (category === 'all') {
                    if (parentLink) {
                        parentLink.classList.remove('hidden');
                    } else {
                        item.classList.remove('hidden');
                    }
                } else {
                    if (item.getAttribute('data-category') === category) {
                        if (parentLink) {
                            parentLink.classList.remove('hidden');
                        } else {
                            item.classList.remove('hidden');
                        }
                    } else {
                        if (parentLink) {
                            parentLink.classList.add('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    }
                }
            });
        });
    });
}

// ===================================
// Contact Form Handler
// ===================================
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');

    if (!contactForm) {
        return; // Not on contact page
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        alert('Thank you for your message! I will get back to you soon.');

        // Reset form
        contactForm.reset();
    });
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// Image Lazy Loading (Optional Enhancement)
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// Image Lightbox
// ===================================
function initImageLightbox() {
    // Create lightbox HTML structure
    const lightboxHTML = `
        <div class="lightbox" id="imageLightbox">
            <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
            <button class="lightbox-prev" aria-label="Previous image">&lsaquo;</button>
            <button class="lightbox-next" aria-label="Next image">&rsaquo;</button>
            <img class="lightbox-content" id="lightboxImage" alt="Enlarged image">
        </div>
    `;

    // Add lightbox to body
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    let currentImages = [];
    let currentIndex = 0;

    // Get clickable images from specified sections only
    // Product Design, Illustration, Artwork, Architecture sections
    const clickableSelectors = [
        '.project-images img',      // Product Design & Illustration project images
        '.artwork-item img',         // Artwork section
        '.architecture-item img'     // Architecture section (Grasshopper Models & Heritage)
    ];

    const clickableImages = document.querySelectorAll(clickableSelectors.join(', '));

    // Add click event to each clickable image
    clickableImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            // Get all images in the same container
            const container = this.closest('.project-images, .artwork-grid, .architecture-grid');
            if (container) {
                currentImages = Array.from(container.querySelectorAll('img'));
            } else {
                currentImages = [this];
            }

            currentIndex = currentImages.indexOf(this);
            showImage(currentIndex);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Show image at specified index
    function showImage(index) {
        if (currentImages.length === 0) return;

        currentIndex = index;
        lightboxImage.src = currentImages[currentIndex].src;
        lightboxImage.alt = currentImages[currentIndex].alt;

        // Show/hide navigation buttons
        if (currentImages.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Previous image
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        showImage(currentIndex);
    }

    // Next image
    function showNextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        showImage(currentIndex);
    }

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);

    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showPrevImage();
    });

    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showNextImage();
    });

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });

    // Prevent image dragging
    lightboxImage.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });
}

// ===================================
// Project Navigation (Projects Page)
// ===================================
function initProjectNavigation() {
    const navButtons = document.querySelectorAll('.project-nav .nav-btn');
    const sections = document.querySelectorAll('.project-section');

    if (navButtons.length === 0 || sections.length === 0) {
        return; // Not on projects page
    }

    // Show all sections initially
    function showAllSections() {
        sections.forEach(section => {
            section.style.display = 'block';
        });
    }

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            const target = this.getAttribute('data-target');

            if (target === 'all') {
                // Show all sections and scroll to top
                showAllSections();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                // Show all sections first
                showAllSections();

                // Find and scroll to the target section
                const targetSection = document.getElementById(target);
                if (targetSection) {
                    const headerOffset = 100; // Offset for fixed header
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}
