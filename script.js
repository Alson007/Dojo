/**
 * 🥋 Dojo Tiaray - Script Principal (Version Finale)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* 🎥 1. VIDEO BACKGROUND */
    const videoBg = document.querySelector('.video-bg');
    const heroVideos = videoBg?.querySelectorAll('.hero-video');
    let videoSwitchInterval = null;

    if (videoBg && heroVideos && heroVideos.length > 1) {
        let currentVideoIndex = 0;
        const SWITCH_DELAY = 15000;
        
        heroVideos[0].classList.add('active');
        heroVideos[0].play().catch(() => heroVideos[0].poster = 'img/dojo-poster.jpg');
        
        const switchVideo = () => {
            heroVideos[currentVideoIndex].classList.remove('active');
            heroVideos[currentVideoIndex].pause();
            currentVideoIndex = (currentVideoIndex + 1) % heroVideos.length;
            const next = heroVideos[currentVideoIndex];
            next.classList.add('active');
            next.currentTime = 0;
            next.play().catch(e => console.warn('🎥 Vidéo bloquée:', e));
        };
        
        videoSwitchInterval = setInterval(switchVideo, SWITCH_DELAY);
        
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                heroVideos[currentVideoIndex]?.play();
                if (!entry.isIntersecting) heroVideos[currentVideoIndex]?.pause();
            });
        }, { threshold: 0.1 }).observe(videoBg);
    }

    /* 🎯 2. SCROLL ANIMATIONS */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
        setTimeout(() => animatedElements.forEach(el => observer.observe(el)), 100);
    }

    /* 📏 3. NAVBAR & PROGRESS BAR */
    const navbar = document.querySelector('.navbar');
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.prepend(progressBar);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                navbar?.classList.toggle('scrolled', window.scrollY > 50);
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (window.scrollY / docHeight) * 100;
                progressBar.style.width = `${scrollPercent}%`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    /* 🍔 4. MENU MOBILE */
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.getElementById('nav-list');
    
    if (menuToggle && navList) {
        const toggleMenu = (forceState) => {
            const isOpen = forceState !== undefined ? forceState : !navList.classList.contains('open');
            navList.classList.toggle('open', isOpen);
            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
        
        document.addEventListener('click', (e) => {
            if (navList.classList.contains('open') && !e.target.closest('.navbar')) toggleMenu(false);
        });

        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });
    }

    /* 🎬 5. SMOOTH SCROLL */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
            }
        });
    });

    /* 🖼️ 6. LIGHTBOX GALERIE */
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = '<img src="" alt="">';
        Object.assign(lightbox.style, {
            position: 'fixed', inset: '0', background: 'rgba(11,17,32,0.95)',
            zIndex: '1000', display: 'none', alignItems: 'center', justifyContent: 'center'
        });
        document.body.appendChild(lightbox);
        const lightboxImg = lightbox.querySelector('img');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (!img) return;
                lightboxImg.src = img.src;
                lightbox.style.display = 'flex';
            });
        });
        lightbox.addEventListener('click', () => lightbox.style.display = 'none');
    }

    /* 🔤 7. ANIMATIONS TITRES SPÉCIFIQUES */

    // 🎯 TARIFS (3D Métallique)
    const tarifsTitle = document.querySelector('.tarifs-header .animated-title');
    if (tarifsTitle) {
        tarifsTitle.style.opacity = '0';
        tarifsTitle.style.transform = 'translateY(30px) scale(0.95)';
        tarifsTitle.style.filter = 'blur(5px)';
        
        setTimeout(() => {
            tarifsTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease, filter 0.7s ease';
            tarifsTitle.style.opacity = '1';
            tarifsTitle.style.transform = 'translateY(0) scale(1)';
            tarifsTitle.style.filter = 'blur(0)';
        }, 300);

        const tarifsHeader = tarifsTitle.closest('.tarifs-header');
        if (tarifsHeader) {
            tarifsHeader.addEventListener('mousemove', (e) => {
                const rect = tarifsHeader.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                tarifsTitle.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.03)`;
                tarifsTitle.style.textShadow = `0 0 30px rgba(59, 130, 246, ${0.4})`;
            });
            tarifsHeader.addEventListener('mouseleave', () => {
                tarifsTitle.style.transition = 'transform 0.5s ease';
                tarifsTitle.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
                tarifsTitle.style.textShadow = 'none';
            });
        }
    }

    // 🌟 ÉQUIPE (Flottement + Lueur gérée par CSS)
    const equipeTitle = document.querySelector('.equipe-header .animated-title');
    if (equipeTitle) {
        equipeTitle.style.opacity = '0';
        equipeTitle.style.transform = 'translateY(30px) scale(0.95)';
        equipeTitle.style.filter = 'blur(5px)';

        setTimeout(() => {
            equipeTitle.style.transition = 'opacity 1s ease, transform 1s ease, filter 0.8s ease';
            equipeTitle.style.opacity = '1';
            equipeTitle.style.transform = 'translateY(0) scale(1)';
            equipeTitle.style.filter = 'none';
        }, 300);

        const equipeHeader = equipeTitle.closest('.equipe-header');
        if (equipeHeader) {
            let floatPhase = 0;
            const breathe = () => {
                floatPhase += 0.015;
                equipeTitle.style.transform = `translateY(${Math.sin(floatPhase) * 3}px)`;
                requestAnimationFrame(breathe);
            };
            requestAnimationFrame(breathe);
        }
    }

    // 🖼️ GALERIE (Typewriter + Cyan)
    const galerieTitle = document.querySelector('.galerie-header .animated-title');
    if (galerieTitle) {
        const originalText = galerieTitle.textContent;
        galerieTitle.textContent = '';
        galerieTitle.style.opacity = '1';
        let charIndex = 0;
        const typeSpeed = 60;

        const typeWriter = () => {
            if (charIndex < originalText.length) {
                galerieTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, typeSpeed + Math.random() * 40);
            } else {
                galerieTitle.style.textShadow = 'none';
            }
        };
        setTimeout(typeWriter, 400);
    }

    // 📬 CONTACT (Pulse Bleu - NET)
    const contactTitle = document.querySelector('.contact-header .animated-title');
    if (contactTitle) {
        contactTitle.style.opacity = '0';
        contactTitle.style.transform = 'scale(0.95)';
        contactTitle.style.filter = 'blur(5px)';
        
        setTimeout(() => {
            contactTitle.style.transition = 'opacity 1s ease, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.8s ease';
            contactTitle.style.opacity = '1';
            contactTitle.style.transform = 'scale(1)';
            contactTitle.style.filter = 'none';
        }, 200);
        
        const contactHeader = contactTitle.closest('.contact-header');
        if (contactHeader) {
            contactHeader.addEventListener('mouseenter', () => {
                contactTitle.style.transition = 'transform 0.3s ease, text-shadow 0.3s ease';
                contactTitle.style.transform = 'scale(1.03)';
                contactTitle.style.textShadow = '0 0 40px rgba(59, 130, 246, 0.7), 0 4px 25px rgba(0,0,0,0.9)';
            });
            contactHeader.addEventListener('mouseleave', () => {
                contactTitle.style.transition = 'transform 0.5s ease, text-shadow 0.4s ease';
                contactTitle.style.transform = 'scale(1)';
                contactTitle.style.textShadow = '0 0 20px rgba(59, 130, 246, 0.4)';
            });
        }
    }

    /* 🌓 8. TOGGLE MODE SOMBRE / CLAIR */
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    const getPreferredTheme = () => {
        const stored = localStorage.getItem('dojo-theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('dojo-theme', theme);
        if (themeIcon) themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    };

    const currentTheme = getPreferredTheme();
    setTheme(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('dojo-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    /* 🧹 CLEANUP */
    window.addEventListener('beforeunload', () => {
        if (videoSwitchInterval) clearInterval(videoSwitchInterval);
    });
});