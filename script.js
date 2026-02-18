// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Download resume function
function downloadResume() {
    // Google Drive direct download link
    const resumeUrl = 'https://drive.google.com/uc?export=download&id=1WXandYq1pdPyuG2K8wVVmJx81hbVnvvU';
    window.open(resumeUrl, '_blank');
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add stagger effect
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all skill and project cards
document.addEventListener('DOMContentLoaded', () => {
    // Observe skill cards with stagger effect
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-content');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - (scrolled / 600);
        }
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .project-link');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add cursor glow effect
    const createGlowEffect = () => {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);

        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    };

    // Uncomment to enable cursor glow effect
    // createGlowEffect();

    // Add dynamic gradient animation to gradient text
    const gradientTexts = document.querySelectorAll('.gradient-text');
    gradientTexts.forEach(text => {
        text.addEventListener('mouseenter', () => {
            text.style.animationDuration = '1.5s';
        });
        text.addEventListener('mouseleave', () => {
            text.style.animationDuration = '3s';
        });
    });

    // Add tag hover effect
    const tags = document.querySelectorAll('.tag, .tech-tag');
    tags.forEach(tag => {
        tag.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        tag.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Social link interactions
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.05) rotate(5deg)';
        });
        link.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        });
    });

    // Hide scroll indicator after scrolling
    window.addEventListener('scroll', () => {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            if (window.pageYOffset > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        }
    });

    // Add skill card counter animation on hover
    const skillCards2 = document.querySelectorAll('.skill-card');
    skillCards2.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const icon = this.querySelector('.skill-icon svg');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        card.addEventListener('mouseleave', function () {
            const icon = this.querySelector('.skill-icon svg');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Preload animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn, .project-link {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .cursor-glow {
        position: fixed;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
        transition: opacity 0.3s ease;
    }
    
    .skill-icon svg {
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(style);
