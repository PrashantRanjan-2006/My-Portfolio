/**
 * PRASHANT RANJAN - 3D PORTFOLIO RESUME
 * Interactive 3D Canvas, Card Tilt Physics, Sound Engine & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initThreeCanvas();
    init3DTilt();
    initPersonaSwitch();
    initThemeSwitch();
    initAudioEngine();
    initTypingEffect();
    initStatsCounters();
    initContactForm();
    initNavScroll();
});

/* ==========================================================================
   1. THREE.JS 3D BACKGROUND PARTICLE & WAVE SYSTEM
   ========================================================================== */
let threeScene, threeCamera, threeRenderer, particleSystem;
let targetParticleColor = 0x00f2fe;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initThreeCanvas() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    if (typeof THREE === 'undefined') {
        init2DFallbackCanvas(canvas);
        return;
    }

    try {
        threeScene = new THREE.Scene();
        threeCamera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 2500);
        threeCamera.position.z = 850;

        threeRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        threeRenderer.setSize(window.innerWidth, window.innerHeight);
        threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create 3D particle grid
        const particleCount = 2200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const scales = new Float32Array(particleCount);
        const originalY = new Float32Array(particleCount);

        let i = 0, j = 0;
        const spread = 2200;
        for (let ix = 0; ix < 50; ix++) {
            for (let iy = 0; iy < 44; iy++) {
                positions[i] = (ix * 48) - 1200; // x
                const yVal = Math.sin(ix * 0.3) * 60 + Math.cos(iy * 0.3) * 60 - 250;
                positions[i + 1] = yVal; // y
                originalY[j] = yVal;
                positions[i + 2] = (iy * 48) - 1000; // z
                scales[j] = 1;
                i += 3;
                j++;
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

        // Custom circular glowing particle sprite
        const canvasParticle = document.createElement('canvas');
        canvasParticle.width = 32;
        canvasParticle.height = 32;
        const ctx = canvasParticle.getContext('2d');
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(0, 242, 254, 0.8)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);

        const particleTexture = new THREE.CanvasTexture(canvasParticle);

        const material = new THREE.PointsMaterial({
            size: 14,
            map: particleTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            color: new THREE.Color(0x00f2fe)
        });

        particleSystem = new THREE.Points(geometry, material);
        threeScene.add(particleSystem);

        // Track mouse
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - windowHalfX) * 0.3;
            mouseY = (e.clientY - windowHalfY) * 0.3;
        });

        // Resize handler
        window.addEventListener('resize', onWindowResize);

        // Render loop
        let clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime() * 1.5;

            // Animate 3D particle positions (wave)
            const posAttr = geometry.attributes.position;
            const posArray = posAttr.array;
            let p = 0;
            for (let ix = 0; ix < 50; ix++) {
                for (let iy = 0; iy < 44; iy++) {
                    posArray[p + 1] = originalY[p / 3] + (Math.sin((ix + time * 1.2) * 0.3) * 45) + (Math.cos((iy + time) * 0.4) * 45);
                    p += 3;
                }
            }
            posAttr.needsUpdate = true;

            // Camera subtle tilt toward mouse
            threeCamera.position.x += (mouseX - threeCamera.position.x) * 0.04;
            threeCamera.position.y += (-mouseY - threeCamera.position.y) * 0.04;
            threeCamera.lookAt(0, -100, 0);

            // Responsive scroll parallax
            const scrollY = window.scrollY || window.pageYOffset;
            particleSystem.rotation.y = scrollY * 0.0003 + time * 0.04;

            // Smooth color transition
            material.color.lerp(new THREE.Color(targetParticleColor), 0.05);

            threeRenderer.render(threeScene, threeCamera);
        }
        animate();

    } catch (e) {
        console.warn("WebGL initialization failed, falling back to 2D canvas:", e);
        init2DFallbackCanvas(canvas);
    }
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    if (threeCamera && threeRenderer) {
        threeCamera.aspect = window.innerWidth / window.innerHeight;
        threeCamera.updateProjectionMatrix();
        threeRenderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// 2D Fallback starfield if Three.js or WebGL is unavailable
function init2DFallbackCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 150 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.2
    }));

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 242, 254, 0.7)';
        stars.forEach(s => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
            s.y -= s.speed;
            if (s.y < 0) s.y = canvas.height;
        });
        requestAnimationFrame(loop);
    }
    loop();
}

/* ==========================================================================
   2. VANILLA 3D CARD TILT & HOLOGRAPHIC GLARE ENGINE
   ========================================================================== */
function init3DTilt() {
    const cards = document.querySelectorAll('.card-3d');

    cards.forEach(card => {
        // Add glare overlay if not present
        if (!card.querySelector('.glare-overlay')) {
            const glare = document.createElement('div');
            glare.className = 'glare-overlay';
            card.appendChild(glare);
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = -((y - centerY) / centerY) * 12; // deg
            const rotateY = ((x - centerX) / centerX) * 12;  // deg

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseenter', () => {
            playAudio('hover');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

/* ==========================================================================
   3. 3D PERSONA SWITCHER (DEVELOPER ↔ CREATIVE DESIGNER)
   ========================================================================== */
function initPersonaSwitch() {
    const personaBtn = document.getElementById('persona-toggle');
    const avatarCard = document.getElementById('avatar-flip-card');
    const flipBtn = document.getElementById('manual-flip-trigger');
    const root = document.documentElement;

    let isCreative = false;

    function togglePersona(forceState) {
        if (typeof forceState === 'boolean') {
            isCreative = forceState;
        } else {
            isCreative = !isCreative;
        }

        playAudio('toggle');

        if (isCreative) {
            root.setAttribute('data-persona', 'creative');
            targetParticleColor = 0xc026d3;
            if (avatarCard) avatarCard.classList.add('flipped');
            if (personaBtn) {
                personaBtn.innerHTML = `<i class="fa-solid fa-palette"></i> <span>Mode: Creative</span>`;
            }
        } else {
            root.removeAttribute('data-persona');
            targetParticleColor = 0x00f2fe;
            if (avatarCard) avatarCard.classList.remove('flipped');
            if (personaBtn) {
                personaBtn.innerHTML = `<i class="fa-solid fa-code"></i> <span>Mode: Developer</span>`;
            }
        }
    }

    if (personaBtn) {
        personaBtn.addEventListener('click', () => togglePersona());
    }

    if (avatarCard) {
        avatarCard.addEventListener('click', () => {
            togglePersona();
        });
    }

    if (flipBtn) {
        flipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePersona();
        });
    }
}

/* ==========================================================================
   4. THEME SWITCHER (DARK / LIGHT)
   ========================================================================== */
function initThemeSwitch() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    const savedTheme = localStorage.getItem('prashant-theme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    }

    themeBtn.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        playAudio('click');
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
            localStorage.setItem('prashant-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
            localStorage.setItem('prashant-theme', 'light');
        }
    });
}

/* ==========================================================================
   5. WEB AUDIO SYNTHESIZER (FUTURISTIC SOUND FX)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioEngine() {
    const soundBtn = document.getElementById('sound-toggle');
    if (!soundBtn) return;

    soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            soundBtn.classList.add('sound-active');
            soundBtn.title = "Mute Sound Effects";
            playAudio('click');
        } else {
            soundBtn.classList.remove('sound-active');
            soundBtn.title = "Enable Sound Effects";
        }
    });

    // Ensure AudioContext starts on first user interaction
    const unlockAudio = () => {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        } else if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio, { once: true });
}

function playAudio(type) {
    if (!soundEnabled) return;

    try {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (!audioCtx || audioCtx.state === 'suspended') return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'hover') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(620, now);
            osc.frequency.exponentialRampToValueAtTime(840, now + 0.05);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'click') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'toggle') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        }
    } catch (err) {
        // Silent catch for audio sandbox restrictions
    }
}

/* ==========================================================================
   6. TYPING EFFECT ROTATOR
   ========================================================================== */
function initTypingEffect() {
    const typingEl = document.getElementById('typing-text');
    if (!typingEl) return;

    const phrases = [
        "Java Full-Stack Developer",
        "Creative Logo & UI Designer",
        "B.Tech CSE @ Galgotias '28",
        "Video Editor & Content Creator",
        "OOP & System Architecture"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 45;
        } else {
            typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2200; // Pause at end of phrase
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   7. INTERACTIVE STATS NUMBER COUNTERS
   ========================================================================== */
function initStatsCounters() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'), 10);
                    const suffix = stat.getAttribute('data-suffix') || '';
                    let count = 0;
                    const duration = 1500;
                    const stepTime = Math.abs(Math.floor(duration / target));

                    const timer = setInterval(() => {
                        count += 1;
                        stat.textContent = count + suffix;
                        if (count >= target) {
                            stat.textContent = target + suffix;
                            clearInterval(timer);
                        }
                    }, Math.max(stepTime, 25));
                });
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   8. CONTACT FORM & EMAIL MODAL
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const modal = document.getElementById('email-modal');
    const closeModal = document.getElementById('modal-close-btn');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            playAudio('click');

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Transmitting via EmailJS...`;
            submitBtn.disabled = true;

            const name = document.getElementById('form-name')?.value || '';
            const email = document.getElementById('form-email')?.value || '';
            const subject = document.getElementById('form-subject')?.value || '';
            const message = document.getElementById('form-message')?.value || '';

            const templateParams = {
                from_name: name,
                user_name: name,
                name: name,
                from_email: email,
                user_email: email,
                email: email,
                subject: subject,
                message: message,
                to_name: "Prashant Ranjan",
                to_email: "prashantranjan20192006@gmail.com"
            };

            const finishSend = () => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                form.reset();
                if (modal) modal.classList.add('active');
                playAudio('toggle');
            };

            // Attempt EmailJS if available
            if (typeof emailjs !== 'undefined' && emailjs.send) {
                const serviceId = localStorage.getItem('prashant_emailjs_service') || 'service_portfolio';
                const templateId = localStorage.getItem('prashant_emailjs_template') || 'template_portfolio';
                const publicKey = localStorage.getItem('prashant_emailjs_public_key');

                if (publicKey) {
                    emailjs.init(publicKey);
                    emailjs.send(serviceId, templateId, templateParams, publicKey)
                        .then(() => finishSend())
                        .catch(() => finishSend());
                    return;
                }
            }

            // Fallback timeout
            setTimeout(finishSend, 700);
        });
    }

    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            playAudio('click');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }
}

/* ==========================================================================
   9. NAVIGATION SCROLL & ACTIVE LINK HIGHLIGHTER
   ========================================================================== */
function initNavScroll() {
    const links = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            playAudio('click');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Attach click sound to all action buttons
    document.querySelectorAll('.btn-3d, .hud-btn, .social-cube, .project-btn').forEach(btn => {
        btn.addEventListener('click', () => playAudio('click'));
    });
}
