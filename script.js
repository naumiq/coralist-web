/**
 * Coralist Website - Shared Navigation & Gallery Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation drawer toggle
  const toggleBtn = document.querySelector('.mobile-toggle-btn');
  const navLinks = document.querySelector('.nav-links');

  function closeMobileNav() {
    if (navLinks && navLinks.classList.contains('mobile-open')) {
      navLinks.classList.remove('mobile-open');
      if (toggleBtn) {
        toggleBtn.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    }
  }

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('mobile-open');
      toggleBtn.classList.toggle('is-active', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when clicking any link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close mobile nav when tapping outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close mobile nav on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileNav();
      }
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
    const stabilityFrame = document.getElementById('stability-highlight-frame');
    const dialsFrame = document.getElementById('dials-highlight-frame');

    function hideHighlights() {
      if (stabilityFrame) stabilityFrame.classList.remove('visible');
      if (dialsFrame) dialsFrame.classList.remove('visible');
    }

    const slideData = [
      { title: 'Main Dashboard', sub: '1 / 5' },
      { title: 'Digital Tank Logbook', sub: '2 / 5' },
      { title: 'AI Water Test Analysis', sub: '3 / 5' },
      { title: 'Task Scheduler', sub: '4 / 5' },
      { title: 'AI Marine Assistant', sub: '5 / 5' }
    ];

    let currentIndex = 0;

    function goToSlide(index, direction = 'next') {
      hideHighlights();
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
        const isActive = i === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
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
    // Stability (0), Dashboard (0), Logbook (1), Analysis (2), Tasks (3), Assistant (4)
    const featureMapping = [0, 0, 1, 2, 3, 4];
    featureItems.forEach((item, index) => {
      item.style.cursor = 'pointer';
      item.title = 'Click to view screenshot';
      item.addEventListener('click', () => {
        const targetSlide = item.dataset.slide !== undefined
          ? parseInt(item.dataset.slide, 10)
          : featureMapping[index];
        const highlight = item.dataset.highlight;

        if (targetSlide !== undefined && !isNaN(targetSlide)) {
          const dir = targetSlide >= currentIndex ? 'next' : 'prev';
          goToSlide(targetSlide, dir);

          if (highlight === 'stability' && stabilityFrame) {
            hideHighlights();
            void stabilityFrame.offsetWidth;
            stabilityFrame.classList.add('visible');
          } else if (highlight === 'dials' && dialsFrame) {
            hideHighlights();
            void dialsFrame.offsetWidth;
            dialsFrame.classList.add('visible');
          } else {
            hideHighlights();
          }

          galleryContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }
});
