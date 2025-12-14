// Sticky Navbar Functionality
const stickyNavbar = document.getElementById('stickyNavbar');
const menuToggle = document.getElementById('menuToggle');
const navbarLinks = document.getElementById('navbarLinks');
const navLinks = document.querySelectorAll('.navbar-link');

// Add scrolled class on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    stickyNavbar.classList.add('scrolled');
  } else {
    stickyNavbar.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navbarLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navbarLinks.classList.remove('active');

    // Update active state
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!menuToggle.contains(e.target) && !navbarLinks.contains(e.target)) {
    menuToggle.classList.remove('active');
    navbarLinks.classList.remove('active');
  }
});
