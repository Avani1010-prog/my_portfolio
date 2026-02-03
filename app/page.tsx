'use client';

import { useEffect, useRef, useState, CSSProperties } from 'react';

// Helper Component for "Decoding" Text Animation
const DecryptedText = ({ text, className, speed = 50, revealDelay = 0 }: { text: string, className?: string, speed?: number, revealDelay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isScrambling, setIsScrambling] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let iteration = 0;
    const characters = '01101010011'; // Binary pool for "Vector/Digital" feel

    // Start delay
    const startTimeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayedText(prev => {
          return text
            .split('')
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              // Return random binary/number
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join('');
        });

        if (iteration >= text.length) {
          clearInterval(interval);
          setIsScrambling(false);
        }

        // Resolve a fraction of a character per frame (slower resolve for effect)
        iteration += 1 / 3;
      }, speed);
    }, revealDelay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
    };
  }, [text, speed, revealDelay]);

  return <span className={className}>{displayedText}</span>;
}

export default function Home() {
  const skillsRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Binary Rain Animation - Enhanced with Orange Color
    const createBinaryRain = () => {
      const canvas = document.createElement('canvas');
      canvas.id = 'binary-rain-canvas';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '1';
      canvas.style.opacity = '0.6';

      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        heroSection.insertBefore(canvas, heroSection.firstChild);
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const binary = '01';
      // Responsive font size based on screen width
      const fontSize = window.innerWidth < 768 ? 14 : 20;
      const columns = canvas.width / fontSize;

      const drops: number[] = [];
      for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * canvas.height / fontSize;
      }

      function draw() {
        if (!ctx) return;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Orange color matching portfolio theme
        ctx.fillStyle = '#ff9500';
        ctx.font = fontSize + 'px "Press Start 2P", monospace';

        for (let i = 0; i < drops.length; i++) {
          const text = binary.charAt(Math.floor(Math.random() * binary.length));
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }

          drops[i]++;
        }
      }

      const interval = setInterval(draw, 40);

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      window.addEventListener('resize', handleResize);

      return () => {
        clearInterval(interval);
        window.removeEventListener('resize', handleResize);
        canvas.remove();
      };
    };

    const cleanup = createBinaryRain();

    // Smooth scroll to section
    const scrollToSection = (sectionId: string) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    // Make scrollToSection available globally
    (window as any).scrollToSection = scrollToSection;

    // Download resume function
    (window as any).downloadResume = () => {
      const resumeUrl = 'https://drive.google.com/uc?export=download&id=1WXandYq1pdPyuG2K8wVVmJx81hbVnvvU';
      window.open(resumeUrl, '_blank');
    };

    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe project cards for initial fade in
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card) => observer.observe(card));

    // Scroll Handler for Timeline, Parallax, and Vector BG
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const isMobile = window.innerWidth < 768;

      // Hero Parallax (disabled on mobile for better performance)
      const hero = document.querySelector('.hero-content') as HTMLElement;
      const scrollIndicator = document.querySelector('.scroll-indicator') as HTMLElement;

      if (hero && !isMobile) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = String(1 - (scrolled / 600));
      }

      if (scrollIndicator) {
        scrollIndicator.style.opacity = scrolled > 100 ? '0' : '1';
      }


      // Timeline Progress Logic
      if (skillsRef.current) {
        const skillsSection = skillsRef.current;
        const rect = skillsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // The line starts growing when the section top reaches the middle of the viewport
        const activationPoint = windowHeight / 2;

        // Calculate offset from the top of the section
        const lineStartOffset = 150;

        // Current position of the "activation point" relative to the section top
        let pixelsScrolledIntoSection = activationPoint - rect.top - lineStartOffset;

        // Clamp to 0
        pixelsScrolledIntoSection = Math.max(0, pixelsScrolledIntoSection);

        // Total height available for the line to grow
        const maxLineHeight = skillsSection.clientHeight - lineStartOffset - 100;

        // Percent for style height
        let progressPercent = (pixelsScrolledIntoSection / maxLineHeight) * 100;
        progressPercent = Math.min(100, Math.max(0, progressPercent));

        setScrollProgress(progressPercent);

        // Highlight active cards based on whether the "Line Tip" has reached them
        const cards = document.querySelectorAll('.skill-card');
        cards.forEach((card) => {
          const cardElement = card as HTMLElement;
          const cardRelativeTop = cardElement.offsetTop - lineStartOffset;

          // Trigger slightly *before* the exact pixel to make it feel responsive
          if (pixelsScrolledIntoSection > cardRelativeTop + 20) {
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <>
      {/* Hero Section: Binary Rain Background */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-name">
              <DecryptedText text="Avani Pandey" speed={60} revealDelay={500} />
            </h1>
            <p className="hero-title">
              <span className="bracket">[ </span>
              <DecryptedText
                text="Software Engineer"
                className="gradient-text"
                speed={30}
                revealDelay={1500}
              />
              <span className="bracket"> ]</span>
            </p>
          </div>

          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => (window as any).scrollToSection('projects')}>
              <span>View_Projects</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="btn btn-secondary" onClick={() => (window as any).downloadResume()}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 13V3M10 13L7 10M10 13L13 10M3 17H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Fetch_Resume()</span>
            </button>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Skills Section - Career Growth Bar (DSA Theme) */}
      <section id="skills" className="skills-section">
        <div className="skills-vector-bg"></div>
        <div className="container" ref={skillsRef}>
          <h2 className="section-title">The Algorithms of My Growth</h2>
          <div className="career-growth-bar">
            {/* The vertical timeline line */}
            <div className="growth-line" style={{ height: `${scrollProgress}%` }}></div>
          </div>

          <div
            className="skills-grid"
            style={{ '--scroll-progress': `${scrollProgress}%` } as CSSProperties}
          >

            {/* Level 1: Initialization (Basics) */}
            <div className="skill-card">
              <div className="checkpoint-dot">0</div>
              <div className="skill-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="8" fill="rgba(251, 191, 36, 0.1)" stroke="rgba(251, 191, 36, 0.3)" />
                  <path d="M12 14L20 10L28 14M12 26L20 30L28 26M10 19L20 24L30 19" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="skill-title">Level 0: Initialization</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '1.1rem' }}>Declaring variables and understanding the syntax.</p>
              <div className="skill-tags">
                {['C', 'C++', 'Python', 'JavaScript', 'TypeScript', 'SQL'].map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Level 2: Linear Data Structures (Frontend) */}
            <div className="skill-card">
              <div className="checkpoint-dot">1</div>
              <div className="skill-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="8" fill="rgba(217, 119, 6, 0.1)" stroke="rgba(217, 119, 6, 0.3)" />
                  <path d="M10 14L15 10L20 14M30 25L25 30L20 25M15 10V30M25 10V30" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="skill-title">Level 1: Linear Structures</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '1.1rem' }}>Building the interface sequentially, element by element.</p>
              <div className="skill-tags">
                {['React.js', 'Next.js', 'Redux', 'Tailwind CSS', 'HTML5/CSS3'].map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Level 3: Trees & Graphs (Backend/System Design) */}
            <div className="skill-card">
              <div className="checkpoint-dot">2</div>
              <div className="skill-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="8" fill="rgba(180, 83, 9, 0.1)" stroke="rgba(180, 83, 9, 0.3)" />
                  <circle cx="20" cy="12" r="3" stroke="#b45309" strokeWidth="2" />
                  <circle cx="12" cy="24" r="3" stroke="#b45309" strokeWidth="2" />
                  <circle cx="28" cy="24" r="3" stroke="#b45309" strokeWidth="2" />
                  <path d="M18 14L14 21M22 14L26 21" stroke="#b45309" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="skill-title">Level 2: Hierarchical Structures</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '1.1rem' }}>Managing complex relationships and server-side logic.</p>
              <div className="skill-tags">
                {['Node.js', 'Express.js', 'Microservices', 'RESTful APIs'].map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Level 4: Hashing & Storage (Databases) */}
            <div className="skill-card">
              <div className="checkpoint-dot">3</div>
              <div className="skill-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="8" fill="rgba(245, 158, 11, 0.1)" stroke="rgba(245, 158, 11, 0.3)" />
                  <path d="M12 12H28V28H12V12Z" stroke="#f59e0b" strokeWidth="2" />
                  <path d="M12 16H28M12 20H28M12 24H28" stroke="#f59e0b" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="skill-title">Level 3: Hashing & Storage</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '1.1rem' }}>Efficient retrieval and O(1) access times.</p>
              <div className="skill-tags">
                {['MongoDB', 'MySQL', 'Database Design', 'NoSQL'].map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Level 5: Dynamic Programming (Optimization/DevOps) */}
            <div className="skill-card">
              <div className="checkpoint-dot">4</div>
              <div className="skill-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="8" fill="rgba(252, 211, 77, 0.1)" stroke="rgba(252, 211, 77, 0.3)" />
                  <path d="M20 8L32 14V26L20 32L8 26V14L20 8Z" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="20" r="4" stroke="#fcd34d" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="skill-title">Level 4: Optimization (DP)</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '1.1rem' }}>Automating and optimizing the deployment pipeline.</p>
              <div className="skill-tags">
                {['Git', 'GitHub Actions', 'Docker', 'CI/CD', 'AWS'].map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <div className="projects-vector-bg"></div>
        <div className="container">
          <h2 className="section-title">Executed Algorithms</h2>
          <div className="projects-grid">
            {/* Streamify Project */}
            <div className="project-card">
              <span className="array-index">index: [0]</span>
              <div className="project-header">
                <h3 className="project-title">Streamify</h3>
                <span className="project-badge">O(log n) Latency</span>
              </div>
              <p className="project-subtitle">Real-Time Language Learning Chat Application</p>
              <p className="project-description">
                A real-time language-learning chat application featuring user onboarding, friend requests,
                real-time messaging, video calling using WebRTC, document sharing, theme customization,
                and notification support.
              </p>
              <div className="project-tech">
                {['React.js', 'WebRTC', 'Real-time', 'WebSocket'].map((tech) => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div className="project-links">
                <a href="https://streamify-frontend-q2hy.onrender.com/" target="_blank" rel="noopener noreferrer" className="project-link primary">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15 9.75V14.25C15 14.6478 14.842 15.0294 14.5607 15.3107C14.2794 15.592 13.8978 15.75 13.5 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V4.5C2.25 4.10218 2.40804 3.72064 2.68934 3.43934C2.97064 3.15804 3.35218 3 3.75 3H8.25M12 2.25H16.5M16.5 2.25V6.75M16.5 2.25L7.5 11.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Live Demo</span>
                </a>
                <a href="https://github.com/Avani1010-prog/Streamify-frontend" target="_blank" rel="noopener noreferrer" className="project-link secondary">
                  <span>Frontend</span>
                </a>
                <a href="https://github.com/Avani1010-prog/Streamify-backend" target="_blank" rel="noopener noreferrer" className="project-link secondary">
                  <span>Backend</span>
                </a>
              </div>
            </div>

            {/* Narad Project */}
            <div className="project-card">
              <span className="array-index">index: [1]</span>
              <div className="project-header">
                <h3 className="project-title">Narad</h3>
                <span className="project-badge">AI Insights</span>
              </div>
              <p className="project-subtitle">Real-Time News Verification System with AI</p>
              <p className="project-description">
                Built a Real-time News Verification System using Gemini AI, which analyzes breaking news
                content and verifies its authenticity using AI-driven evaluation.
              </p>
              <div className="project-tech">
                {['Gemini AI', 'Node.js', 'Real-time', 'AI Integration'].map((tech) => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div className="project-links">
                <a href="https://narad.net.in" target="_blank" rel="noopener noreferrer" className="project-link primary">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15 9.75V14.25C15 14.6478 14.842 15.0294 14.5607 15.3107C14.2794 15.592 13.8978 15.75 13.5 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V4.5C2.25 4.10218 2.40804 3.72064 2.68934 3.43934C2.97064 3.15804 3.35218 3 3.75 3H8.25M12 2.25H16.5M16.5 2.25V6.75M16.5 2.25L7.5 11.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Live Demo</span>
                </a>
                <a href="https://github.com/Avani1010-prog/Narad-frontend" target="_blank" rel="noopener noreferrer" className="project-link secondary">
                  <span>Frontend</span>
                </a>
                <a href="https://github.com/Avani1010-prog/Narad-backend" target="_blank" rel="noopener noreferrer" className="project-link secondary">
                  <span>Backend</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Socials -- Merging them as requested */}
      <footer className="footer">
        <div className="container">
          <div className="socials-container">

            {/* Social Map Bucket 1 */}
            <div className="social-item">
              <span className="key-label">key: "LinkedIn"</span>
              <a href="https://www.linkedin.com/in/avani-pandey-945651328/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <path d="M27.2634 0H4.73659C2.12195 0 0 2.12195 0 4.73659V27.2634C0 29.878 2.12195 32 4.73659 32H27.2634C29.878 32 32 29.878 32 27.2634V4.73659C32 2.12195 29.878 0 27.2634 0ZM10.2439 25.9512H5.70732V11.8049H10.2439V25.9512ZM7.97561 9.90244C6.4878 9.90244 5.29268 8.70732 5.29268 7.21951C5.29268 5.7317 6.4878 4.53659 7.97561 4.53659C9.46341 4.53659 10.6585 5.7317 10.6585 7.21951C10.6585 8.70732 9.46341 9.90244 7.97561 9.90244ZM26.7073 25.9512H22.1707V19.0244C22.1707 17.2195 22.1463 14.8976 19.6683 14.8976C17.1659 14.8976 16.7805 16.8537 16.7805 18.8829V25.9512H12.2439V11.8049H16.6146V13.9512H16.6829C17.2927 12.7805 18.8293 11.5366 21.1463 11.5366C25.7317 11.5366 26.7073 14.5366 26.7073 18.4146V25.9512Z" fill="currentColor" />
                </svg>
              </a>
              <span className="value-arrow">value → profile</span>
            </div>

            {/* Social Map Bucket 2 */}
            <div className="social-item">
              <span className="key-label">key: "GitHub"</span>
              <a href="https://github.com/Avani1010-prog" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M16 0C7.16 0 0 7.16 0 16C0 23.08 4.58 29.06 10.94 31.18C11.74 31.32 12.04 30.84 12.04 30.42C12.04 30.04 12.02 28.78 12.02 27.44C8 28.18 6.96 26.46 6.64 25.16C6.46 25.1 5.68 23.68 5 23.3C4.44 23 3.64 22.26 4.98 22.24C6.24 22.22 7.14 23.4 7.44 23.88C8.88 26.3 11.18 25.62 12.1 25.2C12.24 24.16 12.66 23.46 13.12 23.06C9.56 22.66 5.84 21.28 5.84 15.16C5.84 13.42 6.46 11.98 7.48 10.86C7.32 10.46 6.76 8.82 7.64 6.62C7.64 6.62 8.98 6.2 12.04 8.26C13.32 7.9 14.68 7.72 16.04 7.72C17.4 7.72 18.76 7.9 20.04 8.26C23.1 6.18 24.44 6.62 24.44 6.62C25.32 8.82 24.76 10.46 24.6 10.86C25.62 11.98 26.24 13.4 26.24 15.16C26.24 21.3 22.5 22.66 18.94 23.06C19.52 23.56 20.02 24.52 20.02 26.02C20.02 28.16 20 29.88 20 30.42C20 30.84 20.3 31.34 21.1 31.18C27.42 29.06 32 23.06 32 16C32 7.16 24.84 0 16 0Z" fill="currentColor" />
                </svg>
              </a>
              <span className="value-arrow">value → repos</span>
            </div>

            {/* Social Map Bucket 3 */}
            <div className="social-item">
              <span className="key-label">key: "Email"</span>
              <a href="mailto:avanipandey1010@gmail.com" className="social-link" aria-label="Email">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <path d="M28 6H4C2.9 6 2.01 6.9 2.01 8L2 24C2 25.1 2.9 26 4 26H28C29.1 26 30 25.1 30 24V8C30 6.9 29.1 6 28 6ZM28 10L16 17L4 10V8L16 15L28 8V10Z" fill="currentColor" />
                </svg>
              </a>
              <span className="value-arrow">value → inbox</span>
            </div>
          </div>
          <p className="footer-text">runtime: O(1) | space: O(1) | &copy; 2026 Avani Pandey</p>
        </div>
      </footer>
    </>
  );
}
