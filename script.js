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

  // Smooth scrolling for page anchors (accounting for fixed header)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const header = document.querySelector('.site-header');
          const headerHeight = header ? header.offsetHeight : 0;
          const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
          window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
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
    const featureItems = document.querySelectorAll('.feature-list .feature-item');

    const slideData = [
      { title: 'Parameters & Stability', sub: '1 / 5' },
      { title: 'Digital Tank Logbook', sub: '2 / 5' },
      { title: 'Smart AI Analyses & Advice', sub: '3 / 5' },
      { title: 'Smart Task Scheduler', sub: '4 / 5' },
      { title: '24/7 AI Marine Expert', sub: '5 / 5' }
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
        const isActive = i === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Synchronize feature items active state
      featureItems.forEach((item) => {
        const target = parseInt(item.dataset.slide, 10);
        item.classList.toggle('is-active', target === currentIndex);
      });

      if (captionEl && slideData[currentIndex]) {
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
    featureItems.forEach((item, index) => {
      item.style.cursor = 'pointer';
      item.title = 'Click to view screenshot';
      item.addEventListener('click', () => {
        const targetSlide = item.dataset.slide !== undefined
          ? parseInt(item.dataset.slide, 10)
          : index;

        if (!isNaN(targetSlide)) {
          const dir = targetSlide >= currentIndex ? 'next' : 'prev';
          goToSlide(targetSlide, dir);
        }
      });
    });

    // Fullscreen Screenshot Lightbox Controller
    const lightbox = document.getElementById('screenshot-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');
    const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
    const lightboxNextBtn = document.getElementById('lightbox-next-btn');

    const screenshotData = [
      {
        src: 'assets/screenshots/feature-dashboard.jpg',
        alt: 'Coralist Parameters & Stability Dashboard Preview',
        title: '1 / 5 — Parameters & Stability: Master Your Reef Tank'
      },
      {
        src: 'assets/screenshots/feature-logbook.jpg',
        alt: 'Coralist Digital Tank Logbook Preview',
        title: '2 / 5 — Digital Tank Logbook: Easy & Quick Logbook'
      },
      {
        src: 'assets/screenshots/feature-analyses.jpg',
        alt: 'Coralist Smart AI Analyses & Advice Preview',
        title: '3 / 5 — Smart AI Analyses & Advice: Expert Diagnostics'
      },
      {
        src: 'assets/screenshots/feature-tasks.jpg',
        alt: 'Coralist Smart Task Scheduler Preview',
        title: '4 / 5 — Smart Task Scheduler: Never Miss a Dose'
      },
      {
        src: 'assets/screenshots/feature-assistant.jpg',
        alt: 'Coralist 24/7 AI Marine Expert Preview',
        title: '5 / 5 — 24/7 AI Marine Expert: Specialized Reef Intelligence'
      }
    ];

    function updateLightboxContent(index) {
      if (!lightboxImg || !screenshotData[index]) return;
      lightboxImg.src = screenshotData[index].src;
      lightboxImg.alt = screenshotData[index].alt;
      if (lightboxCaption) {
        lightboxCaption.textContent = screenshotData[index].title;
      }
    }

    function openLightbox(index) {
      if (!lightbox) return;
      const targetIdx = index !== undefined ? index : currentIndex;
      updateLightboxContent(targetIdx);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Clicking directly on gallery slide images opens enlarged view
    slides.forEach((slide, idx) => {
      slide.style.cursor = 'pointer';
      slide.addEventListener('click', (e) => {
        // Only trigger if click wasn't on overlay navigation buttons
        if (!e.target.closest('.overlay-nav-btn')) {
          openLightbox(idx);
        }
      });
    });

    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', closeLightbox);
    }

    if (lightboxBackdrop) {
      lightboxBackdrop.addEventListener('click', closeLightbox);
    }

    if (lightboxPrevBtn) {
      lightboxPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prevIdx = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIdx, 'prev');
        updateLightboxContent(prevIdx);
      });
    }

    if (lightboxNextBtn) {
      lightboxNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextIdx = (currentIndex + 1) % slides.length;
        goToSlide(nextIdx, 'next');
        updateLightboxContent(nextIdx);
      });
    }

    // Keyboard navigation when Lightbox is active
    document.addEventListener('keydown', (e) => {
      if (!lightbox || !lightbox.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIdx, 'prev');
        updateLightboxContent(prevIdx);
      } else if (e.key === 'ArrowRight') {
        const nextIdx = (currentIndex + 1) % slides.length;
        goToSlide(nextIdx, 'next');
        updateLightboxContent(nextIdx);
      }
    });

    // Support opening screenshot directly from any feature card link
    document.querySelectorAll('[data-open-screenshot]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const slideIdx = parseInt(btn.dataset.openScreenshot, 10);
        if (!isNaN(slideIdx)) {
          goToSlide(slideIdx);
          openLightbox(slideIdx);
        }
      });
    });

    // Support expanding FAQ step images into Lightbox
    document.querySelectorAll('.workflow-step-card').forEach((card, index) => {
      const img = card.querySelector('img');
      const heading = card.querySelector('h4');
      const title = heading ? heading.textContent : `Step ${index + 1}`;
      if (img) {
        img.title = 'Click to enlarge image';
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          if (lightbox && lightboxImg) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            if (lightboxCaption) {
              lightboxCaption.textContent = `Water Test Walkthrough — ${title}`;
            }
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
          }
        });
      }
    });
  }
});
