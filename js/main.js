/* main.js — viewer, thumbnails, persistence, UI helpers */

/* NAVBAR SHADOW */
var nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* FADE-IN */
var fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  fadeEls.forEach(function (el) {
    obs.observe(el);
  });
}

/* SIMPLE TOAST */
function showToast(id, msg) {
  var t = document.getElementById(id);
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function () {
    t.classList.remove('show');
  }, 3500);
}

/* FORM VALIDATION */
function wireFormValidation(formId) {
  var form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    form.querySelectorAll('[required]').forEach(function (f) {
      var err = document.getElementById(f.id + 'Error');
      if (!f.value.trim()) {
        if (err) err.classList.add('show');
        f.style.borderColor = '#c0392b';
        valid = false;
      } else {
        if (err) err.classList.remove('show');
        f.style.borderColor = '';
      }
    });

    var email = form.querySelector('input[type="email"]');
    if (
      email &&
      email.value.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
    ) {
      var er = document.getElementById(email.id + 'Error');
      if (er) {
        er.textContent = 'Please enter a valid email.';
        er.classList.add('show');
      }
      email.style.borderColor = '#c0392b';
      valid = false;
    }

    if (valid) {
      if (formId === 'downloadForm') {
        /* ── Read the selected wallpaper from localStorage ── */
        var wpData = null;
        try {
          var raw = localStorage.getItem('selectedWallpaper');
          if (raw) wpData = JSON.parse(raw);
        } catch (ex) {}

        /* ── Also accept URL params as fallback ── */
        var params = new URLSearchParams(window.location.search);
        var imgSrc   = (wpData && wpData.src)   ? wpData.src   : (params.get('img')   ? decodeURIComponent(params.get('img'))   : '');
        var imgTitle = (wpData && wpData.title) ? wpData.title : (params.get('title') ? decodeURIComponent(params.get('title')) : 'Qatar_Airways_Wallpaper');

        if (!imgSrc) {
          showToast('downloadToast', 'No wallpaper selected — please go back and choose one.');
          return;
        }

        /* ── Build a clean filename from the wallpaper title ── */
        var ext      = imgSrc.split('.').pop().split('?')[0].toLowerCase() || 'jpg';
        var filename = imgTitle
          .replace(/[^a-z0-9\s\-]/gi, '')
          .trim()
          .replace(/\s+/g, '_') + '.' + ext;

        /* ── Direct <a download> — works on file:// and http:// alike ── */
        var anchor    = document.createElement('a');
        anchor.href     = imgSrc;
        anchor.download = filename;
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        showToast('downloadToast', '✓ Download started! Enjoy your wallpaper.');
        form.reset();
      }

      if (formId === 'feedbackForm') {
        showToast('feedbackToast', 'Thank you! Your feedback has been submitted.');
        form.reset();
      }
    }
  });

  form.querySelectorAll('[required]').forEach(function (f) {
    f.addEventListener('input', function () {
      var er = document.getElementById(this.id + 'Error');
      if (er) er.classList.remove('show');
      this.style.borderColor = '';
    });
  });
}

wireFormValidation('downloadForm');
wireFormValidation('feedbackForm');

/* ─── Wallpaper catalog ─────────────────────────────────────── */
var wallpaperSets = {

  b737max: [
    { src: 'images/b737max/Over The City.avif',               title: 'Boeing 737 MAX — Over The City',            aircraft: 'Boeing 737 MAX', resolution: '1920×1080', description: 'A Qatar Airways 737 MAX climbs out over a sprawling cityscape, showcasing the aircraft\'s raked wingtips against the urban skyline.' },
    { src: 'images/b737max/At The Parking Spot.webp',         title: 'Boeing 737 MAX — At The Parking Spot',      aircraft: 'Boeing 737 MAX', resolution: '1920×1080', description: 'The 737 MAX sits at its parking stand at Hamad International Airport, engines winding down after completing its mission.' },
    { src: 'images/b737max/On Final.jpg',                     title: 'Boeing 737 MAX — Landing Edition',          aircraft: 'Boeing 737 MAX', resolution: '1920×1080', description: 'Gear down and flaps extended, a Qatar Airways 737 MAX glides in on final approach with perfect precision.' },
    { src: 'images/b737max/Takeoff.webp',                     title: 'Boeing 737 MAX — Takeoff',                  aircraft: 'Boeing 737 MAX', resolution: '1920×1080', description: 'The LEAP-1B engines roar as a Qatar Airways 737 MAX rotates off the runway, beginning another journey in the iconic maroon livery.' },
    { src: 'images/b737max/In The Air.jpg',                   title: 'Boeing 737 MAX — In The Air',               aircraft: 'Boeing 737 MAX', resolution: '1920×1080', description: 'Cruising at altitude, the 737 MAX cuts through clear skies, its fuel-efficient airframe delivering comfort on short to medium-haul routes.' },
    { src: 'images/b737max/Rolling On To The Runway.jpg',     title: 'Boeing 737 MAX — Rolling On To The Runway', aircraft: 'Boeing 737 MAX', resolution: '1920×1080', description: 'A Qatar Airways 737 MAX lines up on the runway, the aircraft poised and ready for another departure from Hamad International.' }
  ],

  a350: [
    { src: 'images/a350/Beautiful Colours.jpg',   title: 'Airbus A350 — Beautiful Colours',  aircraft: 'Airbus A350', resolution: '1920×1080', description: 'The Qatar Airways A350 catches golden light on approach, its carbon-fibre fuselage gleaming in a stunning display of colour and form.' },
    { src: 'images/a350/Stunning Takeoff.jpeg',   title: 'Airbus A350 — Stunning Takeoff',   aircraft: 'Airbus A350', resolution: '1920×1080', description: 'The A350 lifts off the runway with grace, its swept wings flexing under the power of twin Rolls-Royce Trent XWB engines.' },
    { src: 'images/a350/Touchdown.jpeg',          title: 'Airbus A350 — Landing Edition',    aircraft: 'Airbus A350', resolution: '1920×1080', description: 'Smoke puffs from the main gear as a Qatar Airways A350 touches down, completing a long-haul journey in characteristic style.' },
    { src: 'images/a350/Majestic Taxiing.jpg',    title: 'Airbus A350 — Majestic Taxiing',   aircraft: 'Airbus A350', resolution: '1920×1080', description: 'The flagship widebody taxis to its gate at Hamad International, its sharklet wingtips cutting an unmistakable silhouette.' },
    { src: 'images/a350/Attention Seeker.jpg',    title: 'Airbus A350 — Attention Seeker',   aircraft: 'Airbus A350', resolution: '1920×1080', description: 'Framed perfectly against a dramatic sky, the A350 commands attention with the bold Qatar Airways maroon and white livery.' },
    { src: 'images/a350/Looking Fly.jpg',         title: 'Airbus A350 — Looking Fly',        aircraft: 'Airbus A350', resolution: '1920×1080', description: 'A ground-level perspective of the A350 that highlights its elegantly curved nose and the iconic Oryx logo in full glory.' }
  ],

  a330: [
    { src: 'images/a330/bold look.jpg',           title: 'Airbus A330 — The Bold Look',      aircraft: 'Airbus A330', resolution: '1920×1080', description: 'A head-on shot of the Qatar Airways A330 that puts its wide fuselage and twin CFM engines front and centre in bold fashion.' },
    { src: 'images/a330/in the ice.jpg',          title: 'Airbus A330 — In The Ice',         aircraft: 'Airbus A330', resolution: '1920×1080', description: 'The A330 sits surrounded by a wintry, icy landscape, the maroon livery contrasting vividly against the frost-covered ground.' },
    { src: 'images/a330/Stunning Approach.jpeg',  title: 'Airbus A330 — Stunning Approach',  aircraft: 'Airbus A330', resolution: '1920×1080', description: 'Gear down on a stunning final approach, this A330 wallpaper captures the aircraft in its element on a long-haul international route.' },
    { src: 'images/a330/vintage.jpg',             title: 'Airbus A330 — Vintage',            aircraft: 'Airbus A330', resolution: '1920×1080', description: 'A classic archival shot of the Qatar Airways A330, evoking the timeless appeal of one of Airbus\'s most trusted widebody jets.' },
    { src: 'images/a330/pushback.jpg',            title: 'Airbus A330 — Pushback',           aircraft: 'Airbus A330', resolution: '1920×1080', description: 'The tug pushes the A330 back from its gate at Hamad International as the crew prepares for another international departure.' },
    { src: 'images/a330/on final.jpg',            title: 'Airbus A330 — On Final',           aircraft: 'Airbus A330', resolution: '1920×1080', description: 'Fully configured for landing, this Qatar Airways A330 descends gracefully on final, minutes away from touchdown.' }
  ],

  a380: [
    { src: 'images/a380/At Dawn.jpeg',            title: 'Airbus A380 — Dawn Edition',       aircraft: 'Airbus A380', resolution: '1920×1080', description: 'The world\'s largest passenger aircraft catches the first light of dawn, its double-deck silhouette unmistakable on the tarmac.' },
    { src: 'images/a380/Sky Surfing.jpg',         title: 'Airbus A380 — Cruising Edition',   aircraft: 'Airbus A380', resolution: '1920×1080', description: 'The A380 cruises serenely above the clouds, a gentle giant carrying hundreds of passengers in comfort across the globe.' },
    { src: 'images/a380/On Final.jpg',            title: 'Airbus A380 — Landing Edition',    aircraft: 'Airbus A380', resolution: '1920×1080', description: 'All four engines humming, the massive A380 descends on final approach — a breathtaking sight at any airport.' },
    { src: 'images/a380/During Taxi.jpg',         title: 'Airbus A380 — During Taxi',        aircraft: 'Airbus A380', resolution: '1920×1080', description: 'The A380 taxis with authority along the taxiway, its enormous wingspan commanding respect from every aircraft around it.' },
    { src: 'images/a380/Terminal Vibes.jpeg',     title: 'Airbus A380 — Terminal Vibes',     aircraft: 'Airbus A380', resolution: '1920×1080', description: 'Parked at its dedicated A380 gate, the superjumbo fills the terminal view, a monument to large-scale aviation.' },
    { src: 'images/a380/At The Gate.jpg',         title: 'Airbus A380 — At The Gate',        aircraft: 'Airbus A380', resolution: '1920×1080', description: 'Connected to the jetbridge and ready to board, the Qatar Airways A380 awaits its passengers for a flagship long-haul service.' }
  ],

  a320: [
    { src: 'images/a320/During Taxi.jpeg',        title: 'Airbus A320 Family — During Taxi', aircraft: 'Airbus A320 Family', resolution: '1920×1080', description: 'A Qatar Airways A320 Family aircraft taxis to the runway, its slim fuselage and winglets carrying passengers on a short-haul mission.' },
    { src: 'images/a320/A320 Army.jpg',           title: 'Airbus A320 Family — Army',        aircraft: 'Airbus A320 Family', resolution: '1920×1080', description: 'A striking line-up of Qatar Airways A320 Family jets on the apron, demonstrating the backbone of the airline\'s regional fleet.' },
    { src: 'images/a320/Boarding.jpeg',           title: 'Airbus A320 Family — Boarding',    aircraft: 'Airbus A320 Family', resolution: '1920×1080', description: 'Passengers board a Qatar Airways A320 via the jetbridge, the aircraft gleaming under the Qatar sun ahead of departure.' },
    { src: 'images/a320/A320 Elegance.jpg',       title: 'Airbus A320 Family — Elegance',    aircraft: 'Airbus A320 Family', resolution: '1920×1080', description: 'The clean lines and sharp livery of the A320neo are on full display in this elegant portrait of Qatar Airways\' narrow-body fleet.' },
    { src: 'images/a320/A320 Takeoff.jpg',        title: 'Airbus A320 Family — Takeoff',     aircraft: 'Airbus A320 Family', resolution: '1920×1080', description: 'The CFM LEAP engines spool up as a Qatar Airways A320 rotates off the runway, climbing out on another short-haul service.' },
    { src: 'images/a320/On Final.jpeg',           title: 'Airbus A320 Family — On Final',    aircraft: 'Airbus A320 Family', resolution: '1920×1080', description: 'Slats and flaps fully extended, the A320 Family is configured for landing — a familiar sight at airports across the Middle East and beyond.' }
  ],

  b777: [
    { src: 'images/b777/Over The Ocean.jpg',               title: 'Boeing 777 — Over The Ocean',            aircraft: 'Boeing 777', resolution: '1920×1080', description: 'A Qatar Airways 777 soars over a vast ocean expanse, its twin GE90 engines powering one of the longest routes in aviation.' },
    { src: 'images/b777/Soaring Over The City.jpg',        title: 'Boeing 777 — Cruising Edition',          aircraft: 'Boeing 777', resolution: '1920×1080', description: 'Banking over a glittering city below, the 777 shows off its impressive wingspan and iconic Qatar Airways livery from above.' },
    { src: 'images/b777/On Final.jpg',                     title: 'Boeing 777 — Landing Edition',           aircraft: 'Boeing 777', resolution: '1920×1080', description: 'Gear extended and engines spooling down, the workhorse 777 makes a characteristically smooth arrival at its destination.' },
    { src: 'images/b777/Barcelona Special Takeoff.jpg',    title: 'Boeing 777 — Barcelona Special Takeoff', aircraft: 'Boeing 777', resolution: '1920×1080', description: 'A dramatic takeoff roll captured at Barcelona El Prat, the 777 accelerating hard as it departs for Doha in style.' },
    { src: 'images/b777/During The Day.jpeg',              title: 'Boeing 777 — During The Day',            aircraft: 'Boeing 777', resolution: '1920×1080', description: 'Caught in brilliant daylight, this shot of the Qatar Airways 777 highlights every detail of its striking white and maroon livery.' },
    { src: 'images/b777/Special Livery.jpeg',              title: 'Boeing 777 — Special Livery',            aircraft: 'Boeing 777', resolution: '1920×1080', description: 'One of Qatar Airways\' special livery 777s on display, a rare collector\'s wallpaper for any true aviation enthusiast.' }
  ],

  b787: [
    { src: 'images/b787/In The Mountains.jpg',             title: 'Boeing 787 Dreamliner — In The Mountains',        aircraft: 'Boeing 787 Dreamliner', resolution: '1920×1080', description: 'The Qatar Airways 787 Dreamliner passes over a dramatic mountain range, its composite airframe at home in any environment.' },
    { src: 'images/b787/Look Above You.jpeg',              title: 'Boeing 787 Dreamliner — Look Above You',          aircraft: 'Boeing 787 Dreamliner', resolution: '1920×1080', description: 'A rare upward-angle view of the 787 passing overhead, revealing the full span of its swept wings and distinctive engine nacelles.' },
    { src: 'images/b787/Touchdown.jpeg',                   title: 'Boeing 787 Dreamliner — Landing Edition',         aircraft: 'Boeing 787 Dreamliner', resolution: '1920×1080', description: 'The Dreamliner touches down with its signature gentle bounce, the composite gear absorbing the landing with ease.' },
    { src: 'images/b787/Like A Dream.jpg',                 title: 'Boeing 787 Dreamliner — Like A Dream',            aircraft: 'Boeing 787 Dreamliner', resolution: '1920×1080', description: 'Lit beautifully in soft golden light, the 787 Dreamliner lives up to its name in this atmospheric and cinematic wallpaper.' },
    { src: 'images/b787/On Final.jpg',                     title: 'Boeing 787 Dreamliner — On Final',                aircraft: 'Boeing 787 Dreamliner', resolution: '1920×1080', description: 'The Dreamliner descends on final approach, its large curved windows hinting at the elevated passenger experience inside.' },
    { src: 'images/b787/Soaring Over The Clouds.jpg',      title: 'Boeing 787 Dreamliner — Soaring Over The Clouds', aircraft: 'Boeing 787 Dreamliner', resolution: '1920×1080', description: 'Above the cloud layer and cruising at altitude, the 787 Dreamliner glides effortlessly through the sky in Qatar Airways colours.' }
  ]

};

/* ─── Set main wallpaper + update right-panel info ──────────── */
function setMainWallpaper(src, meta) {
  var main = document.getElementById('mainWallpaperImg');
  if (!main) return;
  main.src = src;

  if (!meta) return;

  if (meta.title) {
    var t = document.getElementById('wallpaperTitle');
    if (t) t.textContent = meta.title;
  }

  if (meta.aircraft) {
    var a = document.getElementById('aircraftName');
    if (a) a.textContent = meta.aircraft;

    var bc = document.getElementById('breadcrumbAircraft');
    if (bc) bc.textContent = meta.aircraft;
  }

  if (meta.resolution) {
    var r = document.getElementById('wallpaperRes');
    if (r) r.textContent = meta.resolution;
  }

  if (meta.description) {
    var d = document.getElementById('wallpaperDesc');
    if (d) d.textContent = meta.description;
  }
}

/* ─── Persist selection ──────────────────────────────────────── */
function setMainWallpaperAndPersist(src, meta) {
  setMainWallpaper(src, meta);
  try {
    localStorage.setItem(
      'selectedWallpaper',
      JSON.stringify({
        src: src,
        title: meta.title || '',
        aircraft: meta.aircraft || '',
        resolution: meta.resolution || '1920×1080',
        description: meta.description || ''
      })
    );
  } catch (e) {
    console.warn('persist failed', e);
  }
}

/* ─── Thumbnail click handler ────────────────────────────────── */
function attachThumbnailHandlers() {
  var containers = [
    document.getElementById('thumbStrip'),
    document.getElementById('thumbGallery')
  ].filter(Boolean);

  containers.forEach(function (container) {
    container.addEventListener('click', function (ev) {
      var thumb = ev.target.closest('.thumb-item, .thumb-gallery-item');
      if (!thumb) return;

      setMainWallpaperAndPersist(thumb.dataset.fullsrc, {
        title:      thumb.dataset.title,
        aircraft:   thumb.dataset.aircraft,
        resolution: thumb.dataset.resolution
      });

      /* Update active state only within the clicked container */
      container.querySelectorAll('.active').forEach(function (el) {
        el.classList.remove('active');
      });
      thumb.classList.add('active');

      /* Mirror active state in the other container too */
      containers.forEach(function (other) {
        if (other === container) return;
        other.querySelectorAll('.active').forEach(function (el) { el.classList.remove('active'); });
        var mirror = other.querySelector('[data-fullsrc="' + thumb.dataset.fullsrc + '"]');
        if (mirror) mirror.classList.add('active');
      });
    });
  });
}

/* ─── Build thumbnails — GUARD prevents double-building ─────── */
function buildThumbnails(type) {
  var strip   = document.getElementById('thumbStrip');
  var gallery = document.getElementById('thumbGallery');
  if (!strip && !gallery) return;

  /* ★ Guard: bail if already populated */
  if (strip   && strip.childElementCount   > 0) return;
  if (gallery && gallery.childElementCount > 0) return;

  var set = wallpaperSets[type];
  if (!set) return;

  /* Always show exactly 4 thumbnails */
  set.slice(0, 4).forEach(function (item, idx) {

    /* ── Strip thumbnail (below main image) ── */
    if (strip) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'thumb-item';
      btn.dataset.fullsrc   = item.src;
      btn.dataset.title     = item.title;
      btn.dataset.aircraft  = item.aircraft;
      btn.dataset.resolution = item.resolution;
      btn.setAttribute('aria-label', 'Select wallpaper ' + (idx + 1));

      var img = document.createElement('img');
      img.src     = item.src;
      img.alt     = item.title;
      img.loading = 'lazy';
      btn.appendChild(img);
      strip.appendChild(btn);
    }

    /* ── Gallery thumbnail (below both columns) ── */
    if (gallery) {
      var g = document.createElement('div');
      g.className = 'thumb-gallery-item';
      g.dataset.fullsrc   = item.src;
      g.dataset.title     = item.title;
      g.dataset.aircraft  = item.aircraft;
      g.dataset.resolution = item.resolution;

      var gi = document.createElement('img');
      gi.src     = item.src;
      gi.alt     = item.title;
      gi.loading = 'lazy';
      g.appendChild(gi);
      gallery.appendChild(g);
    }
  });
}

/* ─── More wallpapers grid ───────────────────────────────────── */
function populateMoreWallpapers(type) {
  var moreGrid = document.getElementById('moreWallpapersGrid');
  if (!moreGrid) return;
  if (!wallpaperSets[type]) return;
  if (moreGrid.childElementCount > 0) return; /* guard */

  var set = wallpaperSets[type];
  var max = Math.min(3, set.length);

  for (var i = 0; i < max; i++) {
    var item = set[i];

    var col = document.createElement('div');
    col.className = 'col-md-4';

    var anchor = document.createElement('a');
    anchor.href =
      'aircraft.html?type='        + encodeURIComponent(type) +
      '&img='                      + encodeURIComponent(item.src) +
      '&title='                    + encodeURIComponent(item.title       || '') +
      '&aircraft='                 + encodeURIComponent(item.aircraft    || '') +
      '&resolution='               + encodeURIComponent(item.resolution  || '1920×1080') +
      '&description='              + encodeURIComponent(item.description || '');
    anchor.className = 'more-wallpaper-link';

    var card = document.createElement('div');
    card.className = 'more-wallpaper-card';
    /* Enforce identical card height so all 3 cards line up */
    card.style.cssText = 'display:flex;flex-direction:column;height:280px;overflow:hidden;border-radius:8px;border:1px solid #e6e6e6;background:#fff;';

    var img = document.createElement('img');
    img.src       = item.src;
    img.alt       = item.title || '';
    img.className = 'more-wallpaper-img';
    img.loading   = 'lazy';
    /* Fixed image area — same height every card */
    img.style.cssText = 'width:100%;height:180px;object-fit:cover;flex-shrink:0;display:block;';

    var textWrap = document.createElement('div');
    textWrap.style.cssText = 'padding:10px 12px;flex:1;display:flex;flex-direction:column;justify-content:center;overflow:hidden;';

    var h4 = document.createElement('h4');
    h4.textContent = item.title    || '';
    h4.className   = 'more-wallpaper-title';
    /* Clamp to 2 lines max so long titles don't grow the card */
    h4.style.cssText = 'font-size:0.95rem;font-weight:600;margin:0 0 4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;';

    var sub = document.createElement('p');
    sub.textContent = item.aircraft || '';
    sub.className   = 'more-wallpaper-sub';
    sub.style.cssText = 'font-size:0.82rem;color:#6b6b6b;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';

    textWrap.appendChild(h4);
    textWrap.appendChild(sub);
    card.appendChild(img);
    card.appendChild(textWrap);
    anchor.appendChild(card);
    col.appendChild(anchor);
    moreGrid.appendChild(col);
  }
}

/* ─── Initialize on DOM ready ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  var params  = new URLSearchParams(window.location.search);
  var type    = params.get('type');
  var img     = params.get('img');
  var variant = params.get('variant'); /* 1-based index from gallery page links */

  if (type && wallpaperSets[type]) {
    buildThumbnails(type);         /* build once — guard prevents duplicates */
    populateMoreWallpapers(type);
    /* thumbnails are static previews only — no click handlers attached */

    /* If no specific image was passed, use variant (1-based) or default to first */
    if (!img) {
      var idx = variant ? (parseInt(variant, 10) - 1) : 0;
      var set = wallpaperSets[type];
      if (set && idx >= 0 && idx < set.length) {
        var item = set[idx];
        setMainWallpaperAndPersist(item.src, {
          title:       item.title,
          aircraft:    item.aircraft,
          resolution:  item.resolution,
          description: item.description
        });
        /* Highlight the matching thumbnail */
        var thumbs = document.querySelectorAll('#thumbStrip .thumb-item');
        if (thumbs[idx]) thumbs[idx].classList.add('active');
        var galleryThumbs = document.querySelectorAll('#thumbGallery .thumb-gallery-item');
        if (galleryThumbs[idx]) galleryThumbs[idx].classList.add('active');
      }
    }
  }

  /* If a specific image was passed via URL params */
  if (img) {
    try { img = decodeURIComponent(img); } catch (e) {}
    var meta = {
      title:       params.get('title')       ? decodeURIComponent(params.get('title'))       : '',
      aircraft:    params.get('aircraft')    ? decodeURIComponent(params.get('aircraft'))    :
                   params.get('type')        ? decodeURIComponent(params.get('type'))         : '',
      resolution:  params.get('resolution')  ? decodeURIComponent(params.get('resolution'))  : '1920×1080',
      description: params.get('description') ? decodeURIComponent(params.get('description')) : ''
    };
    setMainWallpaperAndPersist(img, meta);
  }

  /* Download button — navigate after short delay */
  var downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function (ev) {
      ev.preventDefault();
      var href = this.getAttribute('href') || 'download.html';
      setTimeout(function () { window.location.href = href; }, 50);
    });
  }
});