// Custom Cursor Following
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor-follower');
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Theme Switcher
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', theme);
        
        // Add active state with animation
        document.querySelectorAll('.theme-btn').forEach(b => {
            b.classList.remove('active');
            b.style.transform = 'scale(1)';
        });
        btn.classList.add('active');
        btn.style.transform = 'scale(1.05)';
        
        // Animate theme card
        const themeCard = document.querySelector('.theme-card');
        themeCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeCard.style.transform = 'scale(1)';
        }, 200);
    });
});

// Enhanced Scroll Animations - Fixed Version
const scrollObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log('Animating:', entry.target.textContent); // Debug log
            entry.target.classList.add('animate');
        }
    });
}, scrollObserverOptions);

// Initialize scroll items and observe them
function initializeScrollAnimations() {
    const scrollItems = document.querySelectorAll('.scroll-item');
    console.log('Found scroll items:', scrollItems.length); // Debug log
    
    scrollItems.forEach((item, index) => {
        // Ensure initial state is set
        item.style.opacity = '0';
        item.style.transitionDelay = `${index * 0.15}s`;
        
        // Set initial transform based on class
        if (item.classList.contains('fade-in')) {
            item.style.transform = 'translateY(30px)';
        } else if (item.classList.contains('slide-left')) {
            item.style.transform = 'translateX(-100px)';
        } else if (item.classList.contains('scale-up')) {
            item.style.transform = 'scale(0.8)';
        } else if (item.classList.contains('rotate-in')) {
            item.style.transform = 'rotate(-10deg) translateY(30px)';
        }
        
        scrollObserver.observe(item);
    });
}

// Fallback: Direct scroll-based animation
let scrollAnimationTriggered = false;
function checkScrollAnimations() {
    const scrollSection = document.querySelector('.scroll-section');
    if (!scrollSection) return;
    
    const rect = scrollSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Trigger when section is 50% visible
    if (rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2 && !scrollAnimationTriggered) {
        scrollAnimationTriggered = true;
        console.log('Triggering fallback scroll animations'); // Debug log
        
        document.querySelectorAll('.scroll-item').forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
                console.log('Adding animate class to:', item.textContent); // Debug log
            }, index * 200);
        });
    }
}

// Enhanced scroll listener
window.addEventListener('scroll', checkScrollAnimations);

// Also observe other animated elements
document.querySelectorAll('.section-title').forEach(title => {
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.5 });
    
    // Set initial state
    title.style.opacity = '0';
    title.style.transform = 'translateY(30px)';
    title.style.transition = 'all 0.8s ease';
    
    titleObserver.observe(title);
});

// Morphing Button Click Effect
document.querySelector('.morphing-btn').addEventListener('click', () => {
    const btn = document.querySelector('.morphing-btn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = '';
    }, 150);
    
    // Scroll to next section (theme section is now first)
    document.querySelector('.theme-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

// Glass Card Tilt Effect
document.querySelector('.glass-card').addEventListener('mousemove', (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

document.querySelector('.glass-card').addEventListener('mouseleave', (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
});

// Grid Items Interactive Animation
document.querySelectorAll('.grid-item').forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
        // Create ripple effect on neighboring items
        const allItems = document.querySelectorAll('.grid-item');
        allItems.forEach((otherItem, otherIndex) => {
            const distance = Math.abs(index - otherIndex);
            if (distance <= 2 && distance > 0) {
                otherItem.style.transform = 'scale(1.05)';
                otherItem.style.filter = 'brightness(1.2)';
            }
        });
    });
    
    item.addEventListener('mouseleave', () => {
        const allItems = document.querySelectorAll('.grid-item');
        allItems.forEach(otherItem => {
            otherItem.style.transform = '';
            otherItem.style.filter = '';
        });
    });
});

// Parallax Effect for Floating Shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Typewriter Effect Restart on Scroll
const typewriterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'typing 3s steps(40, end), blink-caret 0.75s step-end infinite';
            }, 100);
        }
    });
});

typewriterObserver.observe(document.querySelector('.typewriter'));

// Dynamic Color Shifting for Hero Background
let colorShift = 0;
setInterval(() => {
    colorShift += 1;
    const hero = document.querySelector('.animated-bg');
    if (hero) {
        hero.style.filter = `hue-rotate(${colorShift}deg)`;
    }
}, 100);

// Cube Interaction
document.querySelector('.cube').addEventListener('mouseenter', () => {
    document.querySelector('.cube').style.animationPlayState = 'paused';
});

document.querySelector('.cube').addEventListener('mouseleave', () => {
    document.querySelector('.cube').style.animationPlayState = 'running';
});

// Filter Items Click Effects
document.querySelectorAll('.filter-item').forEach(item => {
    item.addEventListener('click', () => {
        // Add a temporary glow effect
        item.style.boxShadow = '0 0 30px var(--primary-color)';
        setTimeout(() => {
            item.style.boxShadow = '';
        }, 1000);
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Keyboard Navigation for Accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Throttle scroll events
let ticking = false;

function updateScrollEffects() {
    // Parallax and other scroll effects here
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

console.log('🎨 CSS Showcase loaded! Enjoy exploring modern CSS features.');

// ===== NEW AMAZING CSS FEATURES JAVASCRIPT ===== //

// 1. Container Queries - Resize Handle Functionality
const resizableContainer = document.querySelector('.resizable-container');
const resizeHandle = document.querySelector('.resize-handle');

if (resizeHandle && resizableContainer) {
    let isResizing = false;
    
    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'ew-resize';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const containerRect = resizableContainer.getBoundingClientRect();
        const newWidth = e.clientX - containerRect.left;
        
        if (newWidth >= 250 && newWidth <= 600) {
            resizableContainer.style.width = newWidth + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.body.style.cursor = 'default';
    });
}

// 2. Advanced Grid Layouts - Card Hover Effects
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Add ripple effect to other cards
        document.querySelectorAll('.card').forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.style.transform = 'scale(0.98)';
                otherCard.style.opacity = '0.8';
            }
        });
    });
    
    card.addEventListener('mouseleave', () => {
        document.querySelectorAll('.card').forEach(otherCard => {
            otherCard.style.transform = '';
            otherCard.style.opacity = '';
        });
    });
});

// 3. Scroll-Driven Animations - Progress Bar
function updateScrollProgress() {
    const scrollDrivenSection = document.querySelector('.scroll-driven-section');
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    if (!scrollDrivenSection || !progressBar) return;
    
    const sectionRect = scrollDrivenSection.getBoundingClientRect();
    const sectionHeight = scrollDrivenSection.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // Calculate progress based on section visibility
    let progress = 0;
    
    if (sectionRect.top <= 0 && sectionRect.bottom >= windowHeight) {
        // Section is fully visible and scrolling through it
        progress = Math.abs(sectionRect.top) / (sectionHeight - windowHeight);
    } else if (sectionRect.top > 0) {
        // Section hasn't entered yet
        progress = 0;
    } else {
        // Section has passed
        progress = 1;
    }
    
    progress = Math.max(0, Math.min(1, progress));
    progressBar.style.width = (progress * 100) + '%';
}

// Enhanced scroll listener with throttling
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateScrollProgress, 10);
});

// 4. Anchor Positioning - Enhanced Tooltip Interactions
const anchorTrigger = document.querySelector('.anchor-trigger');
const floatingTooltip = document.querySelector('.floating-tooltip');

if (anchorTrigger && floatingTooltip) {
    let tooltipTimeout;
    
    anchorTrigger.addEventListener('mouseenter', () => {
        clearTimeout(tooltipTimeout);
        floatingTooltip.style.opacity = '1';
        floatingTooltip.style.transform = 'translateX(-50%) translateY(-20px)';
    });
    
    anchorTrigger.addEventListener('mouseleave', () => {
        tooltipTimeout = setTimeout(() => {
            floatingTooltip.style.opacity = '0';
            floatingTooltip.style.transform = 'translateX(-50%) translateY(-10px)';
        }, 200);
    });
    
    floatingTooltip.addEventListener('mouseenter', () => {
        clearTimeout(tooltipTimeout);
    });
    
    floatingTooltip.addEventListener('mouseleave', () => {
        floatingTooltip.style.opacity = '0';
        floatingTooltip.style.transform = 'translateX(-50%) translateY(-10px)';
    });
}

// Connection Points Animation Control
document.querySelectorAll('.connection-point').forEach((point, index) => {
    point.addEventListener('mouseenter', () => {
        point.style.animationPlayState = 'paused';
        point.style.transform = 'scale(2)';
        point.style.boxShadow = `0 0 20px var(--accent-color)`;
    });
    
    point.addEventListener('mouseleave', () => {
        point.style.animationPlayState = 'running';
        point.style.transform = '';
        point.style.boxShadow = '';
    });
});

// 5. View Transitions - Image Gallery
const galleryItems = document.querySelectorAll('.gallery-item');
const expandedView = document.querySelector('.expanded-view');
const expandedPlaceholder = document.querySelector('.expanded-placeholder');
const closeBtn = document.querySelector('.close-btn');

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        galleryItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Get the image class from the clicked item
        const imageClass = item.querySelector('.image-placeholder').className.split(' ').find(cls => cls.startsWith('img-'));
        
        // Update expanded image
        expandedPlaceholder.className = `expanded-placeholder ${imageClass}`;
        
        // Show expanded view with animation
        expandedView.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add view transition effect
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                expandedView.classList.add('active');
            });
        }
    });
});

// Close expanded view
function closeExpandedView() {
    expandedView.classList.remove('active');
    document.body.style.overflow = '';
    
    if (document.startViewTransition) {
        document.startViewTransition(() => {
            expandedView.classList.remove('active');
        });
    }
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeExpandedView);
}

// Close on background click
expandedView.addEventListener('click', (e) => {
    if (e.target === expandedView) {
        closeExpandedView();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && expandedView.classList.contains('active')) {
        closeExpandedView();
    }
});

// Enhanced Theme Switching with New Sections
const originalThemeSwitcher = document.querySelectorAll('.theme-btn');
originalThemeSwitcher.forEach(btn => {
    btn.addEventListener('click', () => {
        // Animate new sections when theme changes
        const newSections = [
            '.container-queries-section',
            '.subgrid-section', 
            '.scroll-driven-section',
            '.anchor-positioning-section',
            '.view-transitions-section'
        ];
        
        newSections.forEach((selector, index) => {
            const section = document.querySelector(selector);
            if (section) {
                setTimeout(() => {
                    section.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        section.style.transform = 'scale(1)';
                    }, 100);
                }, index * 50);
            }
        });
    });
});

// Intersection Observer for New Sections
const newSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Special animations for specific sections
            if (entry.target.classList.contains('container-queries-section')) {
                const container = entry.target.querySelector('.resizable-container');
                if (container) {
                    container.style.animation = 'pulse 2s ease-in-out';
                }
            }
            
            if (entry.target.classList.contains('anchor-positioning-section')) {
                const points = entry.target.querySelectorAll('.connection-point');
                points.forEach((point, index) => {
                    setTimeout(() => {
                        point.style.opacity = '1';
                        point.style.transform = 'scale(1)';
                    }, index * 200);
                });
            }
        }
    });
}, { threshold: 0.2 });

// Observe new sections
document.querySelectorAll('.container-queries-section, .subgrid-section, .scroll-driven-section, .anchor-positioning-section, .view-transitions-section').forEach(section => {
    // Set initial state
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
    
    newSectionObserver.observe(section);
});

// Performance optimization for scroll-driven animations
let animationFrameId;
function optimizedScrollHandler() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    animationFrameId = requestAnimationFrame(() => {
        updateScrollProgress();
        
        // Update parallax layers
        const scrolled = window.pageYOffset;
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        
        parallaxLayers.forEach((layer, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrolled * speed;
            layer.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.02}deg)`;
        });
    });
}

window.addEventListener('scroll', optimizedScrollHandler);

// Initialize scroll progress on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing animations'); // Debug log
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Check if scroll section is already visible
    setTimeout(() => {
        checkScrollAnimations();
    }, 100);
    
    updateScrollProgress();
    
    // Add loading animation for new sections
    setTimeout(() => {
        document.querySelectorAll('.container-queries-section, .subgrid-section, .scroll-driven-section, .anchor-positioning-section, .view-transitions-section').forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);
});

// Add keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    if (expandedView.classList.contains('active')) {
        const currentActive = document.querySelector('.gallery-item.active');
        const allItems = Array.from(galleryItems);
        const currentIndex = allItems.indexOf(currentActive);
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            allItems[currentIndex - 1].click();
        } else if (e.key === 'ArrowRight' && currentIndex < allItems.length - 1) {
            allItems[currentIndex + 1].click();
        }
    }
});

console.log('🚀 5 New Amazing CSS Features Loaded!');
console.log('Features: Container Queries, Subgrid, Scroll-Driven Animations, Anchor Positioning, View Transitions');

// Test function to manually trigger scroll animations
function testScrollAnimations() {
    console.log('Testing scroll animations manually');
    const scrollItems = document.querySelectorAll('.scroll-item');
    
    // Reset animations first
    scrollItems.forEach(item => {
        item.classList.remove('animate');
        item.style.opacity = '0';
        
        // Reset transforms based on class
        if (item.classList.contains('fade-in')) {
            item.style.transform = 'translateY(30px)';
        } else if (item.classList.contains('slide-left')) {
            item.style.transform = 'translateX(-100px)';
        } else if (item.classList.contains('scale-up')) {
            item.style.transform = 'scale(0.8) translateY(20px)';
        } else if (item.classList.contains('rotate-in')) {
            item.style.transform = 'rotate(-15deg) translateY(30px)';
        }
    });
    
    // Trigger animations with delay
    setTimeout(() => {
        scrollItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
                console.log('Animating item:', item.textContent);
            }, index * 200);
        });
    }, 100);
}
// ===== 5 MORE INCREDIBLE CSS FEATURES JAVASCRIPT ===== //

// 1. CSS Houdini Paint API - Enhanced Interactions
document.querySelectorAll('.paint-item').forEach(item => {
    item.addEventListener('click', () => {
        // Create ripple effect on click
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(255,255,255,0.6)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'rippleExpand 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        const rect = item.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        ripple.style.left = (x - 10) + 'px';
        ripple.style.top = (y - 10) + 'px';
        
        item.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation keyframes dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleExpand {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(rippleStyle);

// 2. Logical Properties & Writing Modes - Interactive Demo
document.querySelectorAll('.writing-mode-card').forEach(card => {
    card.addEventListener('click', () => {
        // Cycle through different text orientations for vertical modes
        if (card.classList.contains('vertical-rl') || card.classList.contains('vertical-lr')) {
            const currentOrientation = getComputedStyle(card).textOrientation;
            if (currentOrientation === 'mixed') {
                card.style.textOrientation = 'upright';
            } else if (currentOrientation === 'upright') {
                card.style.textOrientation = 'sideways';
            } else {
                card.style.textOrientation = 'mixed';
            }
        }
        
        // Add visual feedback
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    });
});

// 3. CSS Masking - Dynamic Mask Switching
document.querySelectorAll('.mask-item').forEach((item, index) => {
    let currentMask = 0;
    const masks = [
        'linear-gradient(45deg, black 30%, transparent 70%)',
        'radial-gradient(circle at center, black 60%, transparent 70%)',
        'linear-gradient(90deg, black 20%, transparent 40%, transparent 60%, black 80%)',
        'conic-gradient(from 0deg, black 0deg 90deg, transparent 90deg 180deg, black 180deg 270deg, transparent 270deg 360deg)'
    ];
    
    item.addEventListener('click', () => {
        const maskContent = item.querySelector('.mask-content');
        currentMask = (currentMask + 1) % masks.length;
        
        maskContent.style.mask = masks[currentMask];
        maskContent.style.webkitMask = masks[currentMask];
        
        // Add rotation effect
        item.style.transform = 'rotateY(180deg)';
        setTimeout(() => {
            item.style.transform = '';
        }, 300);
    });
});

// 4. CSS Motion Path - Speed Controls
document.querySelectorAll('.motion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const speed = btn.getAttribute('data-speed');
        const pathContainer = document.querySelector('.path-container');
        
        // Remove existing speed classes
        pathContainer.classList.remove('speed-slow', 'speed-fast');
        
        // Add new speed class
        if (speed === 'slow') {
            pathContainer.classList.add('speed-slow');
        } else if (speed === 'fast') {
            pathContainer.classList.add('speed-fast');
        }
        
        // Update active button
        document.querySelectorAll('.motion-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Restart animations
        const movingElements = document.querySelectorAll('.moving-element');
        movingElements.forEach(element => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = '';
        });
    });
});

// Add pause/play functionality on hover
document.querySelector('.path-container').addEventListener('mouseenter', () => {
    document.querySelectorAll('.moving-element').forEach(element => {
        element.style.animationPlayState = 'paused';
    });
});

document.querySelector('.path-container').addEventListener('mouseleave', () => {
    document.querySelectorAll('.moving-element').forEach(element => {
        element.style.animationPlayState = 'running';
    });
});

// 5. CSS Color Functions - Interactive Color Mixing
const mixSlider = document.querySelector('.mix-slider');
const mixResult = document.querySelector('.mix-result');

if (mixSlider && mixResult) {
    mixSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        const color1Percentage = value;
        const color2Percentage = 100 - value;
        
        // Update the mix result
        if (CSS.supports('background', 'color-mix(in srgb, red, blue)')) {
            mixResult.style.background = `color-mix(in srgb, var(--primary-color) ${color1Percentage}%, var(--secondary-color) ${color2Percentage}%)`;
        } else {
            // Fallback for browsers without color-mix support
            mixResult.style.background = `linear-gradient(45deg, var(--primary-color) ${color1Percentage}%, var(--secondary-color) ${color2Percentage}%)`;
        }
        
        // Add scale effect
        mixResult.style.transform = 'scale(1.1)';
        setTimeout(() => {
            mixResult.style.transform = 'scale(1)';
        }, 200);
    });
}

// Color swatch interactions
document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        // Get the computed background color
        const bgColor = getComputedStyle(swatch).backgroundColor;
        
        // Create a temporary element to show the color value
        const colorInfo = document.createElement('div');
        colorInfo.textContent = bgColor;
        colorInfo.style.position = 'fixed';
        colorInfo.style.top = '50%';
        colorInfo.style.left = '50%';
        colorInfo.style.transform = 'translate(-50%, -50%)';
        colorInfo.style.background = 'rgba(0,0,0,0.8)';
        colorInfo.style.color = 'white';
        colorInfo.style.padding = '1rem 2rem';
        colorInfo.style.borderRadius = '10px';
        colorInfo.style.zIndex = '10000';
        colorInfo.style.fontSize = '1.2rem';
        colorInfo.style.fontFamily = 'monospace';
        
        document.body.appendChild(colorInfo);
        
        setTimeout(() => {
            colorInfo.remove();
        }, 2000);
        
        // Add pulse effect to clicked swatch
        swatch.style.animation = 'pulse 0.6s ease-out';
        setTimeout(() => {
            swatch.style.animation = '';
        }, 600);
    });
});

// Conic gradient interactions
document.querySelectorAll('.conic-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        if (item.classList.contains('spiral')) {
            item.style.animationDuration = '1s';
        }
    });
    
    item.addEventListener('mouseleave', () => {
        if (item.classList.contains('spiral')) {
            item.style.animationDuration = '4s';
        }
    });
    
    item.addEventListener('click', () => {
        // Create a full-screen version of the gradient
        const fullscreen = document.createElement('div');
        fullscreen.style.position = 'fixed';
        fullscreen.style.top = '0';
        fullscreen.style.left = '0';
        fullscreen.style.width = '100%';
        fullscreen.style.height = '100%';
        fullscreen.style.background = getComputedStyle(item).background;
        fullscreen.style.zIndex = '10000';
        fullscreen.style.cursor = 'pointer';
        fullscreen.style.display = 'flex';
        fullscreen.style.alignItems = 'center';
        fullscreen.style.justifyContent = 'center';
        
        const closeText = document.createElement('div');
        closeText.textContent = 'Click to close';
        closeText.style.color = 'white';
        closeText.style.fontSize = '2rem';
        closeText.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        closeText.style.background = 'rgba(0,0,0,0.5)';
        closeText.style.padding = '1rem 2rem';
        closeText.style.borderRadius = '10px';
        
        fullscreen.appendChild(closeText);
        document.body.appendChild(fullscreen);
        
        fullscreen.addEventListener('click', () => {
            fullscreen.remove();
        });
    });
});

// Enhanced Intersection Observer for New Sections
const newFeaturesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Special animations for specific sections
            if (entry.target.classList.contains('houdini-section')) {
                const paintItems = entry.target.querySelectorAll('.paint-item');
                paintItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, index * 200);
                });
            }
            
            if (entry.target.classList.contains('motion-path-section')) {
                const movingElements = entry.target.querySelectorAll('.moving-element');
                movingElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.style.opacity = '1';
                    }, index * 500);
                });
            }
            
            if (entry.target.classList.contains('color-functions-section')) {
                const colorCards = entry.target.querySelectorAll('.color-card');
                colorCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, index * 150);
                });
            }
        }
    });
}, { threshold: 0.2 });

// Observe new sections
document.querySelectorAll('.houdini-section, .logical-properties-section, .masking-section, .motion-path-section, .color-functions-section').forEach(section => {
    // Set initial state
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
    
    newFeaturesObserver.observe(section);
    
    // Set initial states for child elements
    if (section.classList.contains('houdini-section')) {
        section.querySelectorAll('.paint-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            item.style.transition = 'all 0.5s ease';
        });
    }
    
    if (section.classList.contains('motion-path-section')) {
        section.querySelectorAll('.moving-element').forEach(element => {
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.5s ease';
        });
    }
    
    if (section.classList.contains('color-functions-section')) {
        section.querySelectorAll('.color-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.9)';
            card.style.transition = 'all 0.6s ease';
        });
    }
});

// Keyboard shortcuts for new features
document.addEventListener('keydown', (e) => {
    // Press 'M' to toggle motion path animations
    if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.altKey) {
        const movingElements = document.querySelectorAll('.moving-element');
        const isPaused = getComputedStyle(movingElements[0]).animationPlayState === 'paused';
        
        movingElements.forEach(element => {
            element.style.animationPlayState = isPaused ? 'running' : 'paused';
        });
    }
    
    // Press 'C' to cycle through color themes faster
    if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.altKey) {
        const themeButtons = document.querySelectorAll('.theme-btn');
        const activeButton = document.querySelector('.theme-btn.active');
        const currentIndex = Array.from(themeButtons).indexOf(activeButton);
        const nextIndex = (currentIndex + 1) % themeButtons.length;
        
        themeButtons[nextIndex].click();
    }
});

console.log('🎨 5 More Incredible CSS Features Loaded!');
console.log('Features: Houdini Paint API, Logical Properties, CSS Masking, Motion Path, Advanced Color Functions');
console.log('Keyboard shortcuts: M = toggle motion, C = cycle themes');
// ===== FINAL 5 INCREDIBLE CSS FEATURES JAVASCRIPT ===== //

// 1. CSS @property & Custom Properties Animation
const triggerAnimationBtn = document.querySelector('.trigger-animation');
const animatedNumber = document.querySelector('.animated-number');

if (triggerAnimationBtn) {
    triggerAnimationBtn.addEventListener('click', () => {
        // Trigger gradient animation
        const gradientElement = document.querySelector('.gradient-animate');
        gradientElement.classList.toggle('animate');
        
        // Trigger color animation
        const colorElement = document.querySelector('.color-animate');
        colorElement.classList.toggle('animate');
        
        // Animate number from 0 to 100
        let currentNumber = 0;
        const targetNumber = 100;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        function animateNumber(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            currentNumber = Math.round(easeOutCubic * targetNumber);
            
            if (animatedNumber) {
                animatedNumber.textContent = currentNumber;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animateNumber);
            }
        }
        
        requestAnimationFrame(animateNumber);
        
        // Button feedback
        triggerAnimationBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            triggerAnimationBtn.style.transform = '';
        }, 150);
    });
}

// 2. CSS Cascade Layers & Advanced Selectors
document.querySelectorAll('.layer').forEach((layer, index) => {
    layer.addEventListener('click', () => {
        // Show layer information
        const layerName = layer.querySelector('h4').textContent;
        const layerInfo = document.createElement('div');
        layerInfo.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--glass-bg);
                backdrop-filter: blur(20px);
                border: 1px solid var(--glass-border);
                border-radius: 15px;
                padding: 2rem;
                z-index: 10000;
                text-align: center;
                max-width: 400px;
            ">
                <h3 style="margin: 0 0 1rem 0; color: var(--primary-color);">${layerName}</h3>
                <p style="margin: 0 0 1rem 0;">Layer priority: ${4 - index}</p>
                <p style="margin: 0 0 1.5rem 0; font-size: 0.9rem; opacity: 0.8;">
                    ${getLayerDescription(layerName)}
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    padding: 0.8rem 1.5rem;
                    background: var(--primary-color);
                    border: none;
                    border-radius: 25px;
                    color: white;
                    cursor: pointer;
                ">Close</button>
            </div>
        `;
        document.body.appendChild(layerInfo);
    });
});

function getLayerDescription(layerName) {
    const descriptions = {
        'Base Layer': 'Foundation styles with lowest priority',
        'Theme Layer': 'Theme-specific overrides',
        'Component Layer': 'Component-specific styles',
        'Utility Layer': 'Utility classes with highest priority'
    };
    return descriptions[layerName] || 'CSS Cascade Layer';
}

// Enhanced :has() selector demo
const hasCheckbox = document.getElementById('has-checkbox');
if (hasCheckbox) {
    hasCheckbox.addEventListener('change', () => {
        const childElement = document.querySelector('.child-element');
        if (hasCheckbox.checked) {
            childElement.textContent = 'Parent detected my checked state! 🎉';
        } else {
            childElement.textContent = 'I change when checkbox is checked!';
        }
    });
}

// 3. CSS Nesting & Modern Syntax - Enhanced Interactions
document.querySelectorAll('.nested-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255,255,255,0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        const rect = item.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        item.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.nested-dropdown').forEach(dropdown => {
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px)';
        dropdown.style.pointerEvents = 'none';
    });
});

// 4. CSS Trigonometric Functions & Math - SIMPLE WORKING VERSION
let currentMathFunction = 'sin';
let mathAnimationId;
let mathAngle = 0;
let isAnimating = false;

// Initialize math elements with click handlers
document.querySelectorAll('.math-element').forEach((element, index) => {
    element.addEventListener('click', () => {
        // Create a ripple effect
        element.style.transform = 'scale(1.5)';
        element.style.background = 'var(--primary-color)';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.background = 'var(--accent-color)';
        }, 300);
        
        // Show the mathematical symbol info
        const symbols = ['sin', 'cos', 'tan', 'π', '∞', '∑'];
        const descriptions = [
            'Sine function - oscillates between -1 and 1',
            'Cosine function - phase-shifted sine',
            'Tangent function - sine/cosine ratio',
            'Pi - mathematical constant ≈ 3.14159',
            'Infinity - unbounded quantity',
            'Summation - mathematical sum operator'
        ];
        
        showMathInfo(symbols[index], descriptions[index]);
    });
});

function showMathInfo(symbol, description) {
    const info = document.createElement('div');
    info.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 15px;
            padding: 2rem;
            z-index: 10000;
            text-align: center;
            max-width: 400px;
            animation: fadeIn 0.3s ease;
        ">
            <h3 style="margin: 0 0 1rem 0; color: var(--accent-color); font-size: 2rem;">${symbol}</h3>
            <p style="margin: 0 0 1.5rem 0; line-height: 1.5;">${description}</p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                padding: 0.8rem 1.5rem;
                background: var(--primary-color);
                border: none;
                border-radius: 25px;
                color: white;
                cursor: pointer;
            ">Close</button>
        </div>
    `;
    document.body.appendChild(info);
    
    setTimeout(() => {
        info.remove();
    }, 3000);
}

// Initialize math buttons - Fixed Version
function initializeMathButtons() {
    const mathButtons = document.querySelectorAll('.math-btn');
    console.log('Initializing math buttons:', mathButtons.length);
    
    mathButtons.forEach((btn, index) => {
        console.log(`Math button ${index}:`, btn.getAttribute('data-function'));
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Math button clicked:', btn.getAttribute('data-function'));
            
            currentMathFunction = btn.getAttribute('data-function');
            
            // Update active button
            mathButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update math visualization
            updateMathVisualization();
            
            // Visual feedback
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
            
            console.log('Current math function set to:', currentMathFunction);
        });
    });
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMathButtons);
} else {
    initializeMathButtons();
}

// SIMPLE WORKING ANIMATION FUNCTION
function startSimpleMathAnimation() {
    console.log('=== STARTING SIMPLE MATH ANIMATION ===');
    isAnimating = true;
    mathAngle = 0;
    
    const particles = document.querySelectorAll('.particle');
    const mathValue = document.getElementById('math-value');
    const functionIndicator = document.getElementById('function-indicator');
    
    console.log('Found elements:', {
        particles: particles.length,
        mathValue: !!mathValue,
        functionIndicator: !!functionIndicator
    });
    
    // Update displays
    const functionName = document.getElementById('function-name');
    
    if (functionIndicator) {
        functionIndicator.textContent = `${currentMathFunction}(x)`;
        functionIndicator.style.background = currentMathFunction === 'sin' ? 'blue' : 
                                           currentMathFunction === 'cos' ? 'green' : 'red';
    }
    
    if (functionName) {
        functionName.textContent = `${currentMathFunction}(x)`;
        functionName.style.color = currentMathFunction === 'sin' ? 'blue' : 
                                  currentMathFunction === 'cos' ? 'green' : 'red';
        functionName.style.fontWeight = 'bold';
        console.log('Updated function name to:', functionName.textContent);
    } else {
        console.log('Function name element not found!');
    }
    
    function simpleAnimate() {
        if (!isAnimating) return;
        
        mathAngle += 2;
        const time = mathAngle * 0.02;
        
        // Update value display
        let currentValue;
        let isExtreme = false;
        
        switch (currentMathFunction) {
            case 'sin':
                currentValue = Math.sin(time);
                break;
            case 'cos':
                currentValue = Math.cos(time);
                break;
            case 'tan':
                // Use same modified time as particles for consistency
                const tanDisplayTime = time % (Math.PI * 0.9);
                const rawTanValue = Math.tan(tanDisplayTime);
                
                if (Math.abs(rawTanValue) > 5) {
                    currentValue = Math.sign(rawTanValue) * 8;
                    isExtreme = true;
                } else {
                    currentValue = rawTanValue;
                    isExtreme = false;
                }
                break;
        }
        
        if (mathValue) {
            mathValue.textContent = currentValue.toFixed(2);
            
            // Special styling for extreme tan values
            if (currentMathFunction === 'tan' && isExtreme) {
                mathValue.style.fontSize = '2.5rem';
                mathValue.style.color = 'darkred';
                mathValue.style.fontWeight = 'bold';
            } else {
                mathValue.style.fontSize = '2rem';
                mathValue.style.color = currentMathFunction === 'sin' ? 'blue' : 
                                       currentMathFunction === 'cos' ? 'green' : 'red';
                mathValue.style.fontWeight = 'normal';
            }
        }
        
        // Move particles with VERY different patterns
        particles.forEach((particle, index) => {
            let yPos;
            
            switch (currentMathFunction) {
                case 'sin':
                    yPos = Math.sin(time + index * 0.5) * 40;
                    particle.style.background = 'blue';
                    break;
                case 'cos':
                    yPos = Math.cos(time + index * 0.3) * 50;
                    particle.style.background = 'green';
                    break;
                case 'tan':
                    // Make tan more predictable by using a modified approach
                    const tanTime = (time + index * 0.4) % (Math.PI * 0.9); // Avoid worst asymptotes
                    const tanVal = Math.tan(tanTime);
                    
                    // Create dramatic but controlled movement
                    if (Math.abs(tanVal) > 3) {
                        // Near asymptote - create dramatic jump effect
                        yPos = Math.sign(tanVal) * 75;
                        // Make particle bigger during jumps
                        particle.style.width = '20px';
                        particle.style.height = '20px';
                        particle.style.background = 'darkred';
                    } else {
                        // Normal range - scale the movement
                        yPos = tanVal * 30;
                        // Normal size
                        particle.style.width = '15px';
                        particle.style.height = '15px';
                        particle.style.background = 'red';
                    }
                    
                    // Ensure it stays within bounds
                    yPos = Math.max(-85, Math.min(85, yPos));
                    break;
                default:
                    yPos = 0;
            }
            
            particle.style.transform = `translateY(${yPos}px)`;
            console.log(`Particle ${index}: ${yPos.toFixed(1)}px`);
        });
        
        requestAnimationFrame(simpleAnimate);
    }
    
    simpleAnimate();
}

// Stop animation function
function stopMathAnimation() {
    console.log('Stopping math animation');
    isAnimating = false;
    if (mathAnimationId) {
        cancelAnimationFrame(mathAnimationId);
    }
}

// Start simple math animation
console.log('=== INITIALIZING SIMPLE MATH ANIMATION ===');

function initMathAnimation() {
    console.log('Initializing math animation...');
    setTimeout(() => {
        startSimpleMathAnimation();
    }, 1000);
}

// Start when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMathAnimation);
} else {
    initMathAnimation();
}

// 5. CSS Scroll Snap & Advanced Scrolling - Fixed Version
function initializeScrollSnap() {
    const snapContainer = document.querySelector('.snap-container');
    const indicators = document.querySelectorAll('.indicator');
    
    console.log('Initializing scroll snap:', { snapContainer, indicators: indicators.length });
    
    if (snapContainer && indicators.length > 0) {
        // Ensure container has proper dimensions
        snapContainer.style.width = '100%';
        snapContainer.style.overflowX = 'auto';
        
        // Update indicators based on scroll position
        function updateIndicators() {
            const scrollLeft = snapContainer.scrollLeft;
            const containerWidth = snapContainer.clientWidth;
            const itemWidth = 300 + 32; // item width + gap
            const currentIndex = Math.round(scrollLeft / itemWidth);
            
            console.log('Scroll position:', { scrollLeft, currentIndex });
            
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }
        
        snapContainer.addEventListener('scroll', updateIndicators);
        
        // Click indicators to scroll to specific items
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                console.log('Indicator clicked:', index);
                const itemWidth = 300 + 32; // item width + gap
                const targetScroll = index * itemWidth;
                
                snapContainer.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
                
                // Update indicators immediately
                indicators.forEach((ind, i) => {
                    ind.classList.toggle('active', i === index);
                });
            });
        });
        
        // Add touch/drag scrolling support
        let isScrolling = false;
        let startX = 0;
        let scrollStart = 0;
        
        snapContainer.addEventListener('mousedown', (e) => {
            isScrolling = true;
            startX = e.pageX - snapContainer.offsetLeft;
            scrollStart = snapContainer.scrollLeft;
            snapContainer.style.cursor = 'grabbing';
        });
        
        snapContainer.addEventListener('mouseleave', () => {
            isScrolling = false;
            snapContainer.style.cursor = 'grab';
        });
        
        snapContainer.addEventListener('mouseup', () => {
            isScrolling = false;
            snapContainer.style.cursor = 'grab';
        });
        
        snapContainer.addEventListener('mousemove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            const x = e.pageX - snapContainer.offsetLeft;
            const walk = (x - startX) * 2;
            snapContainer.scrollLeft = scrollStart - walk;
        });
        
        // Set initial cursor
        snapContainer.style.cursor = 'grab';
        
        // Initial indicator update
        updateIndicators();
    }
}

// Initialize scroll snap when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScrollSnap);
} else {
    initializeScrollSnap();
}

// Vertical snap container smooth scrolling - Fixed Version
function initializeVerticalSnap() {
    const verticalSnapContainer = document.querySelector('.vertical-snap-container');
    const verticalSnapItems = document.querySelectorAll('.vertical-snap-item');
    
    console.log('Initializing vertical snap:', { 
        container: verticalSnapContainer, 
        items: verticalSnapItems.length,
        containerHeight: verticalSnapContainer?.clientHeight,
        scrollHeight: verticalSnapContainer?.scrollHeight
    });
    
    if (verticalSnapContainer && verticalSnapItems.length > 0) {
        const itemHeight = 120; // Updated to match CSS
        
        verticalSnapItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                console.log('Vertical item clicked:', index);
                const targetScroll = index * itemHeight;
                
                verticalSnapContainer.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
                
                // Add visual feedback
                item.style.background = 'rgba(255,255,255,0.1)';
                setTimeout(() => {
                    item.style.background = '';
                }, 300);
            });
        });
        
        // Add scroll event listener for visual feedback
        verticalSnapContainer.addEventListener('scroll', () => {
            const scrollTop = verticalSnapContainer.scrollTop;
            const currentIndex = Math.round(scrollTop / itemHeight);
            
            console.log('Vertical scroll:', { scrollTop, currentIndex });
            
            verticalSnapItems.forEach((item, index) => {
                if (index === currentIndex) {
                    item.style.borderLeft = '4px solid var(--accent-color)';
                    item.style.background = 'rgba(255,255,255,0.05)';
                } else {
                    item.style.borderLeft = '';
                    item.style.background = '';
                }
            });
        });
        
        // Add wheel event for better scroll control
        verticalSnapContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const currentScroll = verticalSnapContainer.scrollTop;
            const direction = e.deltaY > 0 ? 1 : -1;
            const currentIndex = Math.round(currentScroll / itemHeight);
            const nextIndex = Math.max(0, Math.min(verticalSnapItems.length - 1, currentIndex + direction));
            
            verticalSnapContainer.scrollTo({
                top: nextIndex * itemHeight,
                behavior: 'smooth'
            });
        });
        
        // Initial state
        verticalSnapItems[0].style.borderLeft = '4px solid var(--accent-color)';
        verticalSnapItems[0].style.background = 'rgba(255,255,255,0.05)';
    }
}

// Initialize vertical snap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVerticalSnap);
} else {
    initializeVerticalSnap();
}

// Enhanced Intersection Observer for Final Sections
const finalFeaturesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Special animations for specific sections
            if (entry.target.classList.contains('custom-properties-section')) {
                setTimeout(() => {
                    const triggerBtn = entry.target.querySelector('.trigger-animation');
                    if (triggerBtn) {
                        triggerBtn.click(); // Auto-trigger animation on first view
                    }
                }, 1000);
            }
            
            if (entry.target.classList.contains('cascade-layers-section')) {
                const layers = entry.target.querySelectorAll('.layer');
                layers.forEach((layer, index) => {
                    setTimeout(() => {
                        layer.style.opacity = '1';
                        layer.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }
            
            if (entry.target.classList.contains('math-functions-section')) {
                // Start math animations when section becomes visible
                updateMathVisualization();
            }
        }
    });
}, { threshold: 0.2 });

// Observe final sections
document.querySelectorAll('.custom-properties-section, .cascade-layers-section, .nesting-section, .math-functions-section, .scroll-snap-section').forEach(section => {
    // Set initial state
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
    
    finalFeaturesObserver.observe(section);
    
    // Set initial states for child elements
    if (section.classList.contains('cascade-layers-section')) {
        section.querySelectorAll('.layer').forEach(layer => {
            layer.style.opacity = '0';
            layer.style.transform = 'translateY(20px)';
            layer.style.transition = 'all 0.6s ease';
        });
    }
});

// Global keyboard shortcuts for final features
document.addEventListener('keydown', (e) => {
    // Press 'P' to trigger property animations
    if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.altKey) {
        const triggerBtn = document.querySelector('.trigger-animation');
        if (triggerBtn) {
            triggerBtn.click();
        }
    }
    
    // Press 'S' to scroll to next snap item
    if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.altKey) {
        const container = document.querySelector('.snap-container');
        if (container) {
            const currentScroll = container.scrollLeft;
            const itemWidth = 300 + 32;
            const nextScroll = currentScroll + itemWidth;
            
            container.scrollTo({
                left: nextScroll,
                behavior: 'smooth'
            });
        }
    }
    
    // Press 'T' to cycle through trigonometric functions
    if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.altKey) {
        const mathButtons = document.querySelectorAll('.math-btn');
        const activeButton = document.querySelector('.math-btn.active');
        const currentIndex = Array.from(mathButtons).indexOf(activeButton);
        const nextIndex = (currentIndex + 1) % mathButtons.length;
        
        mathButtons[nextIndex].click();
    }
});

// Performance optimization: Pause animations when not visible
const performanceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const section = entry.target;
        
        if (entry.isIntersecting) {
            // Resume animations
            section.querySelectorAll('[style*="animation-play-state"]').forEach(el => {
                el.style.animationPlayState = 'running';
            });
        } else {
            // Pause animations to save performance
            section.querySelectorAll('[style*="animation"]').forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        }
    });
}, { threshold: 0.1 });

// Observe all sections for performance optimization
document.querySelectorAll('section').forEach(section => {
    performanceObserver.observe(section);
});

console.log('🚀 FINAL 5 Incredible CSS Features Loaded!');
console.log('Features: @property Animation, Cascade Layers, CSS Nesting, Math Functions, Scroll Snap');
console.log('Total Features: 22 AMAZING CSS CAPABILITIES!');
console.log('Keyboard shortcuts: P = properties, S = scroll snap, T = trig functions, M = motion, C = themes');
console.log('🎉 CSS SHOWCASE COMPLETE - You now have the ultimate modern CSS demonstration!');
// Test function for scroll snap
function testScrollSnap() {
    console.log('Testing scroll snap functionality');
    const snapContainer = document.querySelector('.snap-container');
    const indicators = document.querySelectorAll('.indicator');
    
    if (snapContainer) {
        console.log('Container found:', {
            scrollWidth: snapContainer.scrollWidth,
            clientWidth: snapContainer.clientWidth,
            scrollLeft: snapContainer.scrollLeft
        });
        
        // Test scroll to second item
        snapContainer.scrollTo({
            left: 332, // 300px + 32px gap
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            console.log('After scroll:', {
                scrollLeft: snapContainer.scrollLeft
            });
        }, 1000);
    } else {
        console.log('Snap container not found!');
    }
    
    console.log('Indicators found:', indicators.length);
    indicators.forEach((indicator, index) => {
        console.log(`Indicator ${index}:`, indicator);
    });
}
// Test function for vertical scroll snap
function testVerticalSnap() {
    console.log('Testing vertical scroll snap functionality');
    const verticalContainer = document.querySelector('.vertical-snap-container');
    const verticalItems = document.querySelectorAll('.vertical-snap-item');
    
    if (verticalContainer) {
        console.log('Vertical container found:', {
            scrollHeight: verticalContainer.scrollHeight,
            clientHeight: verticalContainer.clientHeight,
            scrollTop: verticalContainer.scrollTop,
            canScroll: verticalContainer.scrollHeight > verticalContainer.clientHeight
        });
        
        // Test scroll to third item
        verticalContainer.scrollTo({
            top: 240, // 120px * 2 (third item)
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            console.log('After vertical scroll:', {
                scrollTop: verticalContainer.scrollTop
            });
        }, 1000);
    } else {
        console.log('Vertical snap container not found!');
    }
    
    console.log('Vertical items found:', verticalItems.length);
}
// Test function for math demonstrations
function testMathFunctions() {
    console.log('Testing math functions');
    const functions = ['sin', 'cos', 'tan'];
    let currentIndex = 0;
    
    function cycleFunctions() {
        const btn = document.querySelector(`[data-function="${functions[currentIndex]}"]`);
        if (btn) {
            btn.click();
            console.log(`Switched to ${functions[currentIndex]} function`);
        }
        
        currentIndex = (currentIndex + 1) % functions.length;
        
        if (currentIndex !== 0) {
            setTimeout(cycleFunctions, 2000);
        }
    }
    
    cycleFunctions();
}
// SIMPLE test function for math buttons
function testMathButton(functionName) {
    console.log('=== SWITCHING TO:', functionName.toUpperCase(), '===');
    
    // Stop current animation
    stopMathAnimation();
    
    // Update function
    currentMathFunction = functionName;
    
    // Update active button
    document.querySelectorAll('.math-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-function') === functionName) {
            btn.classList.add('active');
        }
    });
    
    // Immediately update function name display
    const functionNameElement = document.getElementById('function-name');
    const functionIndicator = document.getElementById('function-indicator');
    
    if (functionNameElement) {
        functionNameElement.textContent = `${functionName}(x)`;
        functionNameElement.style.color = functionName === 'sin' ? 'blue' : 
                                         functionName === 'cos' ? 'green' : 'red';
        console.log('Immediately updated function name to:', functionNameElement.textContent);
    }
    
    if (functionIndicator) {
        functionIndicator.textContent = `${functionName}(x)`;
        functionIndicator.style.background = functionName === 'sin' ? 'blue' : 
                                           functionName === 'cos' ? 'green' : 'red';
    }
    
    // Start new animation
    setTimeout(() => {
        startSimpleMathAnimation();
    }, 100);
}

// Add click handlers directly to buttons as backup
function addDirectMathHandlers() {
    const sinBtn = document.querySelector('[data-function="sin"]');
    const cosBtn = document.querySelector('[data-function="cos"]');
    const tanBtn = document.querySelector('[data-function="tan"]');
    
    if (sinBtn) {
        sinBtn.onclick = () => testMathButton('sin');
        console.log('Added direct handler to sin button');
    }
    if (cosBtn) {
        cosBtn.onclick = () => testMathButton('cos');
        console.log('Added direct handler to cos button');
    }
    if (tanBtn) {
        tanBtn.onclick = () => testMathButton('tan');
        console.log('Added direct handler to tan button');
    }
}

// Call both initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeMathButtons();
        addDirectMathHandlers();
    });
} else {
    initializeMathButtons();
    addDirectMathHandlers();
}
// Force start animation function - SIMPLE VERSION
function forceStartAnimation() {
    console.log('=== FORCE STARTING SIMPLE ANIMATION ===');
    
    stopMathAnimation();
    
    // Test particles immediately
    const particles = document.querySelectorAll('.particle');
    console.log('Testing particles:', particles.length);
    
    particles.forEach((particle, index) => {
        const testY = index * 20 - 40; // Spread them out
        particle.style.transform = `translateY(${testY}px)`;
        particle.style.background = 'orange';
        particle.style.width = '15px';
        particle.style.height = '15px';
        console.log(`Particle ${index}: moved to ${testY}px`);
    });
    
    // Start real animation after test
    setTimeout(() => {
        startSimpleMathAnimation();
    }, 2000);
}
// Debug function to check function name element
function checkFunctionNameElement() {
    const functionName = document.getElementById('function-name');
    const functionIndicator = document.getElementById('function-indicator');
    
    console.log('=== CHECKING FUNCTION NAME ELEMENTS ===');
    console.log('function-name element:', functionName);
    console.log('function-indicator element:', functionIndicator);
    
    if (functionName) {
        console.log('Current function-name text:', functionName.textContent);
        console.log('Current function-name color:', functionName.style.color);
    } else {
        console.log('ERROR: function-name element not found!');
        console.log('Available elements with IDs:');
        document.querySelectorAll('[id]').forEach(el => {
            console.log('- ID:', el.id, 'Element:', el.tagName);
        });
    }
    
    if (functionIndicator) {
        console.log('Current function-indicator text:', functionIndicator.textContent);
    }
}
// ===== 5 MORE INCREDIBLE CSS FEATURES JAVASCRIPT (FINAL ULTIMATE SET) ===== //

// 1. CSS Backdrop Filters & Advanced Blur Effects
document.querySelectorAll('.backdrop-card').forEach(card => {
    card.addEventListener('click', () => {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255,255,255,0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        
        card.style.position = 'relative';
        card.appendChild(ripple);
        
        // Animate backdrop filter intensity
        const currentFilter = getComputedStyle(card).backdropFilter;
        card.style.backdropFilter = currentFilter + ' brightness(120%)';
        
        setTimeout(() => {
            ripple.remove();
            card.style.backdropFilter = currentFilter;
        }, 600);
    });
});

// 2. CSS Advanced 3D Transforms
let currentTransform = { x: 0, y: 0, z: 0, scale: 1 };

document.querySelectorAll('.transform-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const transform = btn.getAttribute('data-transform');
        const cube = document.querySelector('.floating-cube');
        
        switch (transform) {
            case 'rotateX':
                currentTransform.x += 90;
                break;
            case 'rotateY':
                currentTransform.y += 90;
                break;
            case 'rotateZ':
                currentTransform.z += 90;
                break;
            case 'scale':
                currentTransform.scale = currentTransform.scale === 1 ? 1.5 : 1;
                break;
            case 'reset':
                currentTransform = { x: 0, y: 0, z: 0, scale: 1 };
                break;
        }
        
        cube.style.transform = `
            rotateX(${currentTransform.x}deg) 
            rotateY(${currentTransform.y}deg) 
            rotateZ(${currentTransform.z}deg) 
            scale(${currentTransform.scale})
        `;
        
        // Visual feedback
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
        
        console.log('Transform applied:', transform, currentTransform);
    });
});

// 3. CSS Grid Template Areas
document.querySelectorAll('.layout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const layout = btn.getAttribute('data-layout');
        const grid = document.querySelector('.responsive-grid');
        
        // Remove existing layout classes
        grid.classList.remove('desktop-layout', 'tablet-layout', 'mobile-layout');
        
        // Add new layout class
        grid.classList.add(`${layout}-layout`);
        
        // Update active button
        document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Animate grid transition
        grid.style.transform = 'scale(0.95)';
        setTimeout(() => {
            grid.style.transform = 'scale(1)';
        }, 200);
        
        console.log('Layout changed to:', layout);
    });
});

// Grid area hover effects
document.querySelectorAll('.grid-area').forEach(area => {
    area.addEventListener('mouseenter', () => {
        // Highlight related areas
        const areaName = area.classList[1]; // Get the area name (header, sidebar, etc.)
        area.style.zIndex = '10';
        area.style.transform = 'scale(1.05)';
    });
    
    area.addEventListener('mouseleave', () => {
        area.style.zIndex = '';
        area.style.transform = '';
    });
});

// 4. CSS Custom Animations Library
document.querySelectorAll('.animation-item').forEach(item => {
    item.addEventListener('click', () => {
        // Remove any existing playing class
        item.classList.remove('playing');
        
        // Force reflow
        item.offsetHeight;
        
        // Add playing class to trigger animation
        item.classList.add('playing');
        
        // Remove playing class after animation completes
        setTimeout(() => {
            item.classList.remove('playing');
        }, 2000);
    });
});

// Animation control functions
function playAllAnimations() {
    console.log('Playing all animations');
    document.querySelectorAll('.animation-item').forEach((item, index) => {
        setTimeout(() => {
            item.click();
        }, index * 200);
    });
}

function pauseAllAnimations() {
    console.log('Pausing all animations');
    document.querySelectorAll('.animation-item').forEach(item => {
        item.classList.remove('playing');
        item.style.animationPlayState = 'paused';
    });
}

function resetAllAnimations() {
    console.log('Resetting all animations');
    document.querySelectorAll('.animation-item').forEach(item => {
        item.classList.remove('playing');
        item.style.animationPlayState = 'running';
        item.style.transform = '';
    });
}

// 5. Advanced Flexbox Patterns
document.querySelectorAll('.pattern-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const pattern = btn.getAttribute('data-pattern');
        const container = document.querySelector('.flexbox-container');
        
        // Remove existing pattern classes
        container.classList.remove('holy-grail-pattern', 'card-layout-pattern', 'media-object-pattern', 'sticky-footer-pattern');
        
        // Clear existing content
        container.innerHTML = '';
        
        // Add new pattern class and content
        container.classList.add(`${pattern}-pattern`);
        
        // Generate content based on pattern
        switch (pattern) {
            case 'holy-grail':
                container.innerHTML = `
                    <div class="flex-header">Header</div>
                    <div class="flex-body">
                        <div class="flex-sidebar">Sidebar</div>
                        <div class="flex-main">Main Content Area</div>
                        <div class="flex-aside">Aside</div>
                    </div>
                    <div class="flex-footer">Footer</div>
                `;
                break;
                
            case 'card-layout':
                container.innerHTML = `
                    <div class="flex-card">Card 1</div>
                    <div class="flex-card">Card 2</div>
                    <div class="flex-card">Card 3</div>
                    <div class="flex-card">Card 4</div>
                    <div class="flex-card">Card 5</div>
                    <div class="flex-card">Card 6</div>
                `;
                break;
                
            case 'media-object':
                container.innerHTML = `
                    <div class="media-image"></div>
                    <div class="media-content">
                        <h3>Media Object Pattern</h3>
                        <p>This is a classic media object pattern with an image on the left and content on the right. The image maintains its size while the content area flexes to fill the remaining space.</p>
                    </div>
                `;
                break;
                
            case 'sticky-footer':
                container.innerHTML = `
                    <div class="flex-header">Header</div>
                    <div class="flex-main">Main Content (Footer sticks to bottom)</div>
                    <div class="flex-footer">Sticky Footer</div>
                `;
                break;
        }
        
        // Update active button
        document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Animate transition
        container.style.opacity = '0';
        setTimeout(() => {
            container.style.opacity = '1';
        }, 100);
        
        console.log('Flexbox pattern changed to:', pattern);
    });
});

// Enhanced Intersection Observer for New Sections
const ultimateFeaturesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Special animations for specific sections
            if (entry.target.classList.contains('backdrop-filters-section')) {
                const shapes = entry.target.querySelectorAll('.bg-shape');
                shapes.forEach((shape, index) => {
                    setTimeout(() => {
                        shape.style.opacity = '1';
                        shape.style.transform = 'scale(1)';
                    }, index * 200);
                });
            }
            
            if (entry.target.classList.contains('advanced-transforms-section')) {
                const cube = entry.target.querySelector('.floating-cube');
                if (cube) {
                    cube.style.animationPlayState = 'running';
                }
            }
            
            if (entry.target.classList.contains('custom-animations-section')) {
                setTimeout(() => {
                    playAllAnimations();
                }, 1000);
            }
        }
    });
}, { threshold: 0.2 });

// Observe new ultimate sections
document.querySelectorAll('.backdrop-filters-section, .advanced-transforms-section, .grid-areas-section, .custom-animations-section, .flexbox-patterns-section').forEach(section => {
    // Set initial state
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
    
    ultimateFeaturesObserver.observe(section);
    
    // Set initial states for child elements
    if (section.classList.contains('backdrop-filters-section')) {
        section.querySelectorAll('.bg-shape').forEach(shape => {
            shape.style.opacity = '0';
            shape.style.transform = 'scale(0.8)';
            shape.style.transition = 'all 0.5s ease';
        });
    }
});

// Global keyboard shortcuts for new features
document.addEventListener('keydown', (e) => {
    // Press 'B' to cycle backdrop filters
    if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.altKey) {
        const cards = document.querySelectorAll('.backdrop-card');
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        randomCard.click();
    }
    
    // Press 'R' to rotate cube
    if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.altKey) {
        const rotateBtn = document.querySelector('[data-transform="rotateY"]');
        if (rotateBtn) rotateBtn.click();
    }
    
    // Press 'A' to play all animations
    if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.altKey) {
        playAllAnimations();
    }
    
    // Press 'L' to cycle layouts
    if (e.key.toLowerCase() === 'l' && !e.ctrlKey && !e.altKey) {
        const layoutButtons = document.querySelectorAll('.layout-btn');
        const activeButton = document.querySelector('.layout-btn.active');
        const currentIndex = Array.from(layoutButtons).indexOf(activeButton);
        const nextIndex = (currentIndex + 1) % layoutButtons.length;
        
        layoutButtons[nextIndex].click();
    }
    
    // Press 'F' to cycle flexbox patterns
    if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.altKey) {
        const patternButtons = document.querySelectorAll('.pattern-btn');
        const activeButton = document.querySelector('.pattern-btn.active');
        const currentIndex = Array.from(patternButtons).indexOf(activeButton);
        const nextIndex = (currentIndex + 1) % patternButtons.length;
        
        patternButtons[nextIndex].click();
    }
});

// Performance monitoring for new features
let performanceMetrics = {
    animationsPlayed: 0,
    transformsApplied: 0,
    layoutSwitches: 0,
    backdropEffects: 0
};

// Track feature usage
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('animation-item')) {
        performanceMetrics.animationsPlayed++;
    } else if (e.target.classList.contains('transform-btn')) {
        performanceMetrics.transformsApplied++;
    } else if (e.target.classList.contains('layout-btn')) {
        performanceMetrics.layoutSwitches++;
    } else if (e.target.classList.contains('backdrop-card')) {
        performanceMetrics.backdropEffects++;
    }
    
    // Log metrics every 10 interactions
    const totalInteractions = Object.values(performanceMetrics).reduce((a, b) => a + b, 0);
    if (totalInteractions % 10 === 0 && totalInteractions > 0) {
        console.log('🎯 Feature Usage Metrics:', performanceMetrics);
    }
});

console.log('🚀 FINAL 5 Ultimate CSS Features Loaded!');
console.log('Features: Backdrop Filters, Advanced 3D Transforms, Grid Template Areas, Custom Animations, Advanced Flexbox');
console.log('Total Features: 27 INCREDIBLE CSS CAPABILITIES!');
console.log('Keyboard shortcuts: B = backdrop, R = rotate, A = animations, L = layouts, F = flexbox, + all previous shortcuts');
console.log('🎉 ULTIMATE CSS SHOWCASE COMPLETE - The most comprehensive modern CSS demonstration ever created!');