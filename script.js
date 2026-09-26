/**
 * Coralist Website - Shared Navigation & Gallery Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation drawer toggle
  const toggleBtn = document.querySelector('.mobile-toggle-btn');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      const isOpen = navLinks.classList.contains('mobile-open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when clicking any link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // Smooth scrolling for page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Interactive App Screenshot Gallery
  const galleryContainer = document.querySelector('.gallery-container');
  if (galleryContainer) {
    const slides = galleryContainer.querySelectorAll('.gallery-slide');
    const dots = galleryContainer.querySelectorAll('.indicator-dot');
    const prevBtn = galleryContainer.querySelector('.prev-btn');
    const nextBtn = galleryContainer.querySelector('.next-btn');
    const captionEl = document.getElementById('gallery-caption');

    const slideData = [
      { title: 'Main Dashboard', sub: '1 / 5' },
      { title: 'Digital Tank Logbook', sub: '2 / 5' },
      { title: 'AI Water Test Analysis', sub: '3 / 5' },
      { title: 'Task Scheduler', sub: '4 / 5' },
      { title: 'AI Marine Assistant', sub: '5 / 5' }
    ];

    let currentIndex = 0;

    function goToSlide(index, direction = 'next') {
      if (index === currentIndex) return;
      
      const oldIndex = currentIndex;
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        slide.classList.remove('active', 'slide-prev');
        if (i === currentIndex) {
          slide.classList.add('active');
        } else if (i === oldIndex && direction === 'prev') {
          slide.classList.add('slide-prev');
        }
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });

      if (captionEl) {
        captionEl.textContent = `${slideData[currentIndex].sub} — ${slideData[currentIndex].title}`;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(newIndex, 'prev');
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % slides.length;
        goToSlide(newIndex, 'next');
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const dir = i > currentIndex ? 'next' : 'prev';
        goToSlide(i, dir);
      });
    });

    // Touch swipe support
    let startX = 0;
    const frame = galleryContainer.querySelector('.gallery-frame');
    if (frame) {
      frame.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      frame.addEventListener('touchend', (e) => {
        const diffX = e.changedTouches[0].clientX - startX;
        if (Math.abs(diffX) > 35) {
          if (diffX < 0) {
            goToSlide((currentIndex + 1) % slides.length, 'next');
          } else {
            goToSlide((currentIndex - 1 + slides.length) % slides.length, 'prev');
          }
        }
      }, { passive: true });
    }

    // Connect feature bullet items to gallery slides
    const featureItems = document.querySelectorAll('.feature-list .feature-item');
    const featureMapping = [1, 0, 0, 2, 4]; // Logbook (1), Dials (0), Stability (0), Analysis (2), Assistant (4)
    featureItems.forEach((item, index) => {
      item.style.cursor = 'pointer';
      item.title = 'Click to view screenshot';
      item.addEventListener('click', () => {
        const targetSlide = featureMapping[index];
        if (targetSlide !== undefined) {
          const dir = targetSlide >= currentIndex ? 'next' : 'prev';
          goToSlide(targetSlide, dir);
          galleryContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }
});
