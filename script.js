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
    const dots = galleryContainer.querySelectorAll('.pagination-dot, .indicator-dot');
    const prevBtn = galleryContainer.querySelector('.prev-btn');
    const nextBtn = galleryContainer.querySelector('.next-btn');
    const captionEl = document.getElementById('gallery-caption');
    const featureItems = document.querySelectorAll('.feature-tab-card, .feature-list .feature-item');

    const slideData = [
      { title: 'Parameters & Stability', sub: '1 / 3' },
      { title: 'Digital Tank Logbook', sub: '2 / 3' },
      { title: 'Smart AI Analyses & Advice', sub: '3 / 3' }
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

      // Synchronize feature cards active state
      featureItems.forEach((item) => {
        const target = parseInt(item.dataset.slide, 10);
        const isActive = target === currentIndex;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
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

    // Connect feature cards to gallery slides
    featureItems.forEach((item, index) => {
      item.style.cursor = 'pointer';
      item.title = 'Click to view screenshot';
      const switchSlide = () => {
        const targetSlide = item.dataset.slide !== undefined
          ? parseInt(item.dataset.slide, 10)
          : index;

        if (!isNaN(targetSlide)) {
          const dir = targetSlide >= currentIndex ? 'next' : 'prev';
          goToSlide(targetSlide, dir);
        }
      };

      item.addEventListener('click', switchSlide);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          switchSlide();
        }
      });
    });

    // Support switching screenshots directly from feature cards
    document.querySelectorAll('[data-open-screenshot]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        let slideIdx = parseInt(btn.dataset.openScreenshot, 10);
        if (!isNaN(slideIdx)) {
          slideIdx = slideIdx % slides.length;
          const dir = slideIdx >= currentIndex ? 'next' : 'prev';
          goToSlide(slideIdx, dir);
          galleryContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  // Walkthrough Lightbox Controller (Strictly navigates active FAQ Walkthrough screenshots)
  const lightbox = document.getElementById('screenshot-lightbox');
  if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');
    const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
    const lightboxNextBtn = document.getElementById('lightbox-next-btn');

    const walkthroughs = {
      'setup': [
        {
          src: 'assets/screenshots/setup-step-1-click-log.jpg',
          alt: 'Step 1: Click on Logbook in the bottom navigation',
          title: 'App Setup — Step 1 of 8: Click on Logbook'
        },
        {
          src: 'assets/screenshots/setup-step-2-fish-icon.jpg',
          alt: 'Step 2: Click on the Fish Icon to add your livestock',
          title: 'App Setup — Step 2 of 8: Select Fish Icon'
        },
        {
          src: 'assets/screenshots/setup-step-3-add-livestock.jpg',
          alt: 'Step 3: Click on Add Livestock',
          title: 'App Setup — Step 3 of 8: Click on Add Livestock'
        },
        {
          src: 'assets/screenshots/setup-step-4-livestock-details.jpg',
          alt: 'Step 4: Fill the details of the livestock being added',
          title: 'App Setup — Step 4 of 8: Fill Livestock Details'
        },
        {
          src: 'assets/screenshots/setup-step-5-doser-icon.jpg',
          alt: 'Step 5: Click on the Doser icon in the Log pane and click on Add Dosing',
          title: 'App Setup — Step 5 of 8: Select Doser Icon & Add Dosing'
        },
        {
          src: 'assets/screenshots/setup-step-6-dosing-details.jpg',
          alt: 'Step 6: Add the details of the dosing solution',
          title: 'App Setup — Step 6 of 8: Add Dosing Details'
        },
        {
          src: 'assets/screenshots/setup-step-7-hardware-add.jpg',
          alt: 'Step 7: Click on Hardware then click on Add Hardware',
          title: 'App Setup — Step 7 of 8: Click Hardware & Add Hardware'
        },
        {
          src: 'assets/screenshots/setup-step-8-device-details.jpg',
          alt: 'Step 8: Add the details of your devices',
          title: 'App Setup — Step 8 of 8: Add Device Details'
        }
      ],
      'water-test': [
        {
          src: 'assets/screenshots/step-1-add-record.jpg',
          alt: 'Step 1: Click on the plus button to add a new record',
          title: 'Water Test Walkthrough — Step 1 of 5: Click the + Button'
        },
        {
          src: 'assets/screenshots/step-2-select-water-test.jpg',
          alt: 'Step 2: Select Water test from the category dropdown',
          title: 'Water Test Walkthrough — Step 2 of 5: Select "Water test"'
        },
        {
          src: 'assets/screenshots/step-3-enter-parameters.jpg',
          alt: 'Step 3: Enter water parameters and tap Add',
          title: 'Water Test Walkthrough — Step 3 of 5: Add Parameters & Submit'
        },
        {
          src: 'assets/screenshots/step-4-ai-agent-analyzing.jpg',
          alt: 'Step 4: AI Agent analyzes parameters against tank history and livestock',
          title: 'Water Test Walkthrough — Step 4 of 5: AI Agent Analyzes Your Tank'
        },
        {
          src: 'assets/screenshots/step-5-ai-advice-report.jpg',
          alt: 'Step 5: Receive personalized analyses and dosing advice',
          title: 'Water Test Walkthrough — Step 5 of 5: Receive Analyses & Advice'
        }
      ]
    };

    let activeWalkthroughKey = 'setup';
    let currentStepIdx = 0;

    function updateStepLightbox(index) {
      const activeList = walkthroughs[activeWalkthroughKey] || walkthroughs['setup'];
      currentStepIdx = (index + activeList.length) % activeList.length;
      const step = activeList[currentStepIdx];
      if (lightboxImg && step) {
        lightboxImg.src = step.src;
        lightboxImg.alt = step.alt;
      }
      if (lightboxCaption && step) {
        lightboxCaption.textContent = step.title;
      }
    }

    function openStepLightbox(walkthroughKey, index) {
      activeWalkthroughKey = walkthroughKey;
      updateStepLightbox(index);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeStepLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Attach click listener to each FAQ walkthrough step card, isolated by walkthrough group
    document.querySelectorAll('.faq-workflow-steps').forEach((container) => {
      const walkthroughKey = container.dataset.walkthrough || 'setup';
      container.querySelectorAll('.workflow-step-card').forEach((card, index) => {
        const img = card.querySelector('img');
        if (img) {
          img.title = 'Click to view step full size';
          img.addEventListener('click', (e) => {
            e.stopPropagation();
            openStepLightbox(walkthroughKey, index);
          });
        }
      });
    });

    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', closeStepLightbox);
    }

    if (lightboxBackdrop) {
      lightboxBackdrop.addEventListener('click', closeStepLightbox);
    }

    if (lightboxPrevBtn) {
      lightboxPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateStepLightbox(currentStepIdx - 1);
      });
    }

    if (lightboxNextBtn) {
      lightboxNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateStepLightbox(currentStepIdx + 1);
      });
    }

    // Keyboard navigation strictly across the active walkthrough steps
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeStepLightbox();
      } else if (e.key === 'ArrowLeft') {
        updateStepLightbox(currentStepIdx - 1);
      } else if (e.key === 'ArrowRight') {
        updateStepLightbox(currentStepIdx + 1);
      }
    });
  }

  // Live Favicon Dark Mode Synchronization
  if (window.matchMedia) {
    const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const updateDynamicFavicon = (e) => {
      const isDark = e.matches;
      document.querySelectorAll('link[rel="icon"]').forEach((link) => {
        if (link.type === 'image/png') {
          link.href = isDark ? 'assets/favicon-dark-32x32.png?v=4' : 'assets/favicon-32x32.png?v=4';
        }
      });
    };

    try {
      darkModeMedia.addEventListener('change', updateDynamicFavicon);
    } catch {
      darkModeMedia.addListener(updateDynamicFavicon);
    }
  }
});
