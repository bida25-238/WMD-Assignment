/* ============================================================
   script.js — Qatar Airways Fleet Wallpapers
   Student: Letso Allen Maphorisa | BIDA25-238
   ============================================================ */

/* ── 1. NAVBAR SCROLL SHADOW ───────────────────────────────
   Listens to window scroll. When user scrolls past 50px,
   a CSS class is added to the navbar triggering a box-shadow.
   Demonstrates: DOM selection, event listener, classList
   ─────────────────────────────────────────────────────── */
var nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ── 2. SCROLL FADE-IN (IntersectionObserver) ──────────────
   Watches all .fade-up elements. When they enter the viewport,
   the class .visible is added, triggering the CSS transition.
   Demonstrates: querySelectorAll, IntersectionObserver, forEach
   ─────────────────────────────────────────────────────── */
var fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length > 0) {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(function (el) { observer.observe(el); });
}

/* ── 3. ACTIVE NAV LINK ─────────────────────────────────────
   Reads the current page filename from window.location and
   highlights the correct navigation link automatically.
   Demonstrates: window.location, string methods, setAttribute
   ─────────────────────────────────────────────────────── */
var currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.site-nav .nav-link').forEach(function (link) {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

/* ── 4. START BROWSING BUTTON FEEDBACK ─────────────────────
   Temporarily changes button text before navigating.
   Demonstrates: getElementById, preventDefault, textContent, setTimeout
   ─────────────────────────────────────────────────────── */
var startBtn = document.getElementById('startBrowsingBtn');
if (startBtn) {
  startBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var href = this.getAttribute('href');
    this.textContent = 'Loading...';
    this.style.opacity = '0.7';
    setTimeout(function () { window.location.href = href; }, 500);
  });
}

/* ── 5. WALLPAPER DOWNLOAD SIMULATION ──────────────────────
   Simulates download: changes button icon to checkmark briefly.
   Demonstrates: querySelectorAll, event listener, innerHTML, setTimeout
   ─────────────────────────────────────────────────────── */
document.querySelectorAll('.wp-overlay a, .btn-download-sim').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    var orig = this.innerHTML;
    this.innerHTML = '<i class="fa fa-check"></i> Done!';
    this.style.background = '#166534';
    this.style.borderColor = '#166534';
    var self = this;
    setTimeout(function () {
      self.innerHTML = orig;
      self.style.background = '';
      self.style.borderColor = '';
    }, 1800);
  });
});

/* ── 6. FEEDBACK FORM VALIDATION ───────────────────────────
   Checks required fields before submission. Shows inline error
   messages. On success, shows a toast notification.
   Demonstrates: getElementById, querySelectorAll, form event,
   DOM manipulation, conditional logic, setTimeout
   ─────────────────────────────────────────────────────── */
var feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
  feedbackForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    // Validate each required field
    feedbackForm.querySelectorAll('[required]').forEach(function (field) {
      var err = document.getElementById(field.id + 'Error');
      if (!field.value.trim()) {
        if (err) err.classList.add('show');
        field.style.borderColor = '#c0392b';
        valid = false;
      } else {
        if (err) err.classList.remove('show');
        field.style.borderColor = '';
      }
    });

    // Validate email format
    var emailField = document.getElementById('feedbackEmail');
    if (emailField && emailField.value.trim()) {
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value);
      var emailErr = document.getElementById('feedbackEmailError');
      if (!emailOk) {
        if (emailErr) { emailErr.textContent = 'Please enter a valid email address.'; emailErr.classList.add('show'); }
        emailField.style.borderColor = '#c0392b';
        valid = false;
      }
    }

    if (valid) {
      showToast('feedbackToast', 'Thank you! Your feedback has been submitted.');
      feedbackForm.reset();
    }
  });

  // Live clear errors on input
  feedbackForm.querySelectorAll('[required]').forEach(function (field) {
    field.addEventListener('input', function () {
      var err = document.getElementById(this.id + 'Error');
      if (err) err.classList.remove('show');
      this.style.borderColor = '';
    });
  });
}

/* ── 7. DOWNLOAD / CHECKOUT FORM VALIDATION ─────────────────
   Same pattern as feedback — validates name and email before
   simulating the confirm download action.
   ─────────────────────────────────────────────────────── */
var downloadForm = document.getElementById('downloadForm');
if (downloadForm) {
  downloadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    downloadForm.querySelectorAll('[required]').forEach(function (field) {
      var err = document.getElementById(field.id + 'Error');
      if (!field.value.trim()) {
        if (err) err.classList.add('show');
        field.style.borderColor = '#c0392b';
        valid = false;
      } else {
        if (err) err.classList.remove('show');
        field.style.borderColor = '';
      }
    });

    var dlEmail = document.getElementById('dlEmail');
    if (dlEmail && dlEmail.value.trim()) {
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dlEmail.value);
      if (!ok) {
        var err = document.getElementById('dlEmailError');
        if (err) { err.textContent = 'Please enter a valid email.'; err.classList.add('show'); }
        dlEmail.style.borderColor = '#c0392b';
        valid = false;
      }
    }

    if (valid) {
      showToast('downloadToast', 'Download confirmed! Check your email for the wallpaper link.');
      downloadForm.reset();
    }
  });

  downloadForm.querySelectorAll('[required]').forEach(function (field) {
    field.addEventListener('input', function () {
      var err = document.getElementById(this.id + 'Error');
      if (err) err.classList.remove('show');
      this.style.borderColor = '';
    });
  });
}

/* ── 8. FLEET GALLERY SEARCH FILTER ────────────────────────
   Filters aircraft category cards live as the user types.
   Demonstrates: querySelector, input event, loop, style manipulation
   ─────────────────────────────────────────────────────── */
var searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    var query = this.value.toLowerCase().trim();
    document.querySelectorAll('.aircraft-cat-card').forEach(function (card) {
      var name = card.getAttribute('data-name') || '';
      card.parentElement.style.display = name.toLowerCase().includes(query) ? '' : 'none';
    });
  });
}

/* ── 9. GALLERY MANUFACTURER FILTER ────────────────────────
   Filters cards by manufacturer (All / Airbus / Boeing).
   Demonstrates: getElementById, change event, dataset, forEach
   ─────────────────────────────────────────────────────── */
var filterSelect = document.getElementById('filterSelect');
if (filterSelect) {
  filterSelect.addEventListener('change', function () {
    var val = this.value.toLowerCase();
    document.querySelectorAll('.aircraft-cat-card').forEach(function (card) {
      var maker = (card.getAttribute('data-maker') || '').toLowerCase();
      card.parentElement.style.display = (val === 'all' || maker === val) ? '' : 'none';
    });
  });
}

/* ── HELPER: TOAST NOTIFICATION ────────────────────────────
   Shows a toast div for 3 seconds then hides it.
   ─────────────────────────────────────────────────────── */
function showToast(id, message) {
  var toast = document.getElementById(id);
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(function () { toast.classList.remove('show'); }, 3500);
}