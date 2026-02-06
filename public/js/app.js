

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initTheme();
    initAnimations();
    initNavigation();
});

function initCursor() {
    // Only init cursor on non-touch devices (coarse pointer usually means touch)
    if (window.matchMedia("(pointer: coarse)").matches) {
        return;
    }

    const cursor = document.querySelector('.cursor');
    // Add class to body to indicate custom cursor is active (CSS will hide default cursor based on this)
    document.body.classList.add('custom-cursor-active');

    // Create follower if not exists
    let follower = document.querySelector('.cursor-follower');
    if (!follower) {
        follower = document.createElement('div');
        follower.classList.add('cursor-follower');
        document.body.appendChild(follower);
    }

    // Use gsap.quickSetter for better performance
    const setCursorX = gsap.quickSetter(cursor, "x", "px");
    const setCursorY = gsap.quickSetter(cursor, "y", "px");
    const setFollowerX = gsap.quickSetter(follower, "x", "px");
    const setFollowerY = gsap.quickSetter(follower, "y", "px");

    document.addEventListener('mousemove', (e) => {
        // Instant update for main dot - using set directly avoids object creation overhead
        setCursorX(e.clientX);
        setCursorY(e.clientY);

        // Smooth follow for the liquid circle
        gsap.to(follower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.6, // Slightly smoother/slower for liquid feel
            ease: "power2.out",
            overwrite: "auto" // Prevent conflict
        });
    });

    // Handle interactive elements
    const hoverables = document.querySelectorAll('a, button, .hover-target');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('active');
            cursor.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('active');
            cursor.classList.remove('hovered');
        });
    });

    // Ensure cursor is visible when moving mouse
    document.addEventListener('mouseover', () => {
        cursor.style.opacity = 1;
        follower.style.opacity = 1;
    });
}

// Moods Palette
const moods = [
    { bg: '#FF3300', text: '#FFFFFF', secondary: '#FFCCCC', accent: '#FFFFFF' }, // Neon Orange
    { bg: '#CCFF00', text: '#000000', secondary: '#445500', accent: '#000000' }, // Neon Lime
    { bg: '#00D1FF', text: '#000000', secondary: '#004455', accent: '#000000' }, // Cyan
    { bg: '#FF69B4', text: '#FFFFFF', secondary: '#FFEEF5', accent: '#FFFFFF' }, // Hot Pink
    { bg: '#F5F5DC', text: '#3B3B3B', secondary: '#6B6B6B', accent: '#3B3B3B' }, // Beige/Classic
    { bg: '#B19CD9', text: '#FFFFFF', secondary: '#E6E6FA', accent: '#FFFFFF' }, // Pastel Purple
    { bg: '#1A1A1A', text: '#FFFFFF', secondary: '#888888', accent: '#FFFFFF' }, // Dark Mode
];

let clickCount = 0;

function initTheme() {
    // Default to light or saved? User wants white reset every 3rd, so maybe start white.
    // We'll stick to CSS default (White) initially.
    // If we wanted to persist:
    // const saved = localStorage.getItem('themeState'); ...
    // But "random" implies ephemeral fun. Let's start clean.
}

window.toggleTheme = function () {
    clickCount++;
    const root = document.documentElement;

    // Every 3rd click -> White (Reset)
    if (clickCount % 3 === 0) {
        setTheme({ bg: '#ffffff', text: '#000000', secondary: '#555555', accent: '#000000', cursor: '#FF3300' });
        root.setAttribute('data-theme', 'light');
        return;
    }

    // Random Mood
    const randomMood = moods[Math.floor(Math.random() * moods.length)];

    // Ensure we don't pick the same random color twice in a row if possible (optional logic, skipping for simplicity)

    setTheme(randomMood);
    root.setAttribute('data-theme', 'custom');
}

function setTheme(mood) {
    const root = document.documentElement;
    root.style.setProperty('--bg-color', mood.bg);
    root.style.setProperty('--text-color', mood.text);
    root.style.setProperty('--secondary-text', mood.secondary);
    root.style.setProperty('--accent-color', mood.accent);
    root.style.setProperty('--border-color', mood.secondary); // Use secondary for border match

    // Logic for cursor color based on text
    if (mood.cursor) {
        root.style.setProperty('--cursor-color', mood.cursor);
    } else {
        root.style.setProperty('--cursor-color', mood.text);
    }
}

function initNavigation() {
    // ScrollToPlugin used here via standard scrollIntoView for simplicity, 
    // but we can enhance with GSAP ScrollTo if needed.

    // Highlight active section on scroll
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-bottom-nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjustment for offset
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });

        mobileLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Animate content blocks as they enter view
    const sections = document.querySelectorAll('.content-section');

    sections.forEach(section => {
        gsap.from(section.children, {
            scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        });
    });
}
