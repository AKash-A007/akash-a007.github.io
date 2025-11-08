// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
  initParticles();
  initTypingEffect();
  initScrollAnimations();
  initCounters();
  initSkillBars();
  initFormValidation();
});

// ==================== LOADING SCREEN ====================
window.addEventListener('load', () => {
  const loadingScreen = document.querySelector('.loading-screen');
  
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    document.body.style.overflow = 'visible';
  }, 2000);
});

// ==================== CUSTOM CURSOR ====================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  // Smooth cursor movement with easing
  const ease = 0.15;
  
  cursorX += (mouseX - cursorX) * ease;
  cursorY += (mouseY - cursorY) * ease;
  
  followerX += (mouseX - followerX) * (ease / 2);
  followerY += (mouseY - followerY) * (ease / 2);
  
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  
  requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-tag');

hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    cursorFollower.style.transform = 'translate(-50%, -50%) scale(3)';
  });
  
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorFollower.style.transform = 'translate(-50%, -50%) scale(2)';
  });
});

// ==================== THEME TOGGLE ====================
const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light-mode');
  toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
}

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  const isLight = body.classList.contains("light-mode");
  
  toggleBtn.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  
  // Reinitialize particles with new colors
  if (window.pJSDom && window.pJSDom[0]) {
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    initParticles();
  }
});

// ==================== MOBILE MENU ====================
const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');

mobileMenuBtn.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  mobileMenuBtn.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    navMenu.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
  }
});

// ==================== NAVBAR SCROLL EFFECT ====================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ==================== TYPING EFFECT ====================
function initTypingEffect() {
  const typingText = document.querySelector('.typing-text');
  if (!typingText) return;
  
  const roles = [
    'AI Engineer',
    'OpenBMC Contributor',
    'ROS2 Developer',
    'Robotics Enthusiast',
    'Open Source Advocate'
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before new word
    }
    
    setTimeout(type, typingSpeed);
  }
  
  setTimeout(type, 1000);
}

// ==================== PARTICLES.JS INITIALIZATION ====================
function initParticles() {
  const isLight = body.classList.contains('light-mode');
  
  particlesJS('particles-js', {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: isLight ? '#0099ff' : '#00d4ff'
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000'
        }
      },
      opacity: {
        value: 0.3,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: isLight ? '#0099ff' : '#00d4ff',
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'grab'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 0.5
          }
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        
        // Trigger counter animation when stats section is visible
        if (entry.target.classList.contains('stat-number')) {
          animateCounter(entry.target);
        }
        
        // Trigger skill bar animation
        if (entry.target.classList.contains('skill-progress')) {
          animateSkillBar(entry.target);
        }
      }
    });
  }, observerOptions);
  
  // Observe elements
  const animateElements = document.querySelectorAll(`
    .project-card,
    .skill-category,
    .timeline-item,
    .about-content,
    .contact-content,
    .stat-item,
    .highlight-item
  `);
  
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });
}

// ==================== COUNTER ANIMATION ====================
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !stat.classList.contains('counted')) {
          animateCounter(stat);
          stat.classList.add('counted');
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(stat);
  });
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;
  
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current) + '+';
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + '+';
    }
  };
  
  updateCounter();
}

// ==================== SKILL BAR ANIMATION ====================
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        animateSkillBar(entry.target);
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.5 });
  
  skillBars.forEach(bar => observer.observe(bar));
}

function animateSkillBar(bar) {
  const progress = bar.getAttribute('data-progress');
  setTimeout(() => {
    bar.style.width = progress + '%';
  }, 200);
}

// ==================== BACK TO TOP BUTTON ====================
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 500) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ==================== SMOOTH SCROLL FOR NAVIGATION ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ==================== FORM VALIDATION & SUBMISSION ====================
function initFormValidation() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.btn-submit');
    const originalContent = submitBtn.innerHTML;
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    
    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      // Show success message
      submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
      submitBtn.style.background = 'linear-gradient(135deg, #27c93f 0%, #1fa832 100%)';
      
      // Reset form
      form.reset();
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
        submitBtn.style.background = '';
      }, 3000);
      
      console.log('Form submitted:', formData);
    }, 2000);
  });
  
  // Add floating label effect
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
  });
}

// ==================== PROJECT CARD TILT EFFECT ====================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ==================== ACTIVE NAV LINK ====================
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ==================== EASTER EGG: KONAMI CODE ====================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join('') === konamiSequence.join('')) {
    triggerEasterEgg();
    konamiCode = [];
  }
});

function triggerEasterEgg() {
  // Add confetti or special animation
  document.body.style.animation = 'gradient 3s ease infinite';
  document.body.style.backgroundSize = '400% 400%';
  
  setTimeout(() => {
    document.body.style.animation = '';
    document.body.style.backgroundSize = '';
  }, 5000);
  
  console.log('🎉 You found the easter egg! 🎉');
}

// ==================== PARALLAX SCROLL EFFECT ====================
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.hero::before, .hero::after');
  
  parallaxElements.forEach((el, index) => {
    const speed = index === 0 ? 0.5 : 0.3;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// ==================== PRELOAD IMAGES ====================
function preloadImages() {
  const images = [
    'akash_photo_logo.jpg',
    'image.png',
    'ros2logo.png','OpenBMC_logo.png'
  ];
  
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

preloadImages();

// ==================== PERFORMANCE OPTIMIZATION ====================
// Debounce function for resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimize resize handler
const handleResize = debounce(() => {
  // Reinitialize animations or layouts if needed
  console.log('Window resized');
}, 250);

window.addEventListener('resize', handleResize);

// ==================== ACCESSIBILITY ====================
// Add keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// Add focus visible styles
const style = document.createElement('style');
style.textContent = `
  .keyboard-nav *:focus {
    outline: 2px solid var(--accent-primary) !important;
    outline-offset: 2px !important;
  }
`;
document.head.appendChild(style);

console.log('🚀 Portfolio loaded successfully!');