function isDocumentScrollable() {
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = window.innerHeight;

  if ((clientHeight / scrollHeight) >= 0.90) {
    return false;
  }

  return scrollHeight > clientHeight + 20;
}

function updateScrollIndicator() {
  const indicators = document.querySelectorAll('.scroll-indicator');
  const scrollable = isDocumentScrollable();
  const scrolled = window.scrollY > 40;

  indicators.forEach(indicator => {
    if (scrollable) {
      indicator.style.display = 'flex';
      indicator.style.opacity = scrolled ? '0' : '0.6';
    } else {
      indicator.style.display = 'none';
    }
  });
}

function onWindowScroll() {
  if (!isDocumentScrollable()) {
    document.querySelectorAll('.scroll-indicator').forEach(ind => ind.style.display = 'none');
    return;
  }
  const scrolled = window.scrollY > 40;
  document.querySelectorAll('.scroll-indicator').forEach(ind => {
    if (ind.style.display !== 'none') {
      ind.style.opacity = scrolled ? '0' : '0.6';
    }
  });
}

const VALID_PAGES = ['home', 'project', 'about', 'contact'];

function showPage(pageId, btnElement) {
  if (!VALID_PAGES.includes(pageId)) pageId = 'home';

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.add('active');

  let activeBtn = btnElement;
  if (!activeBtn) {
    const navLinks = document.querySelectorAll('.nav-link');
    activeBtn = navLinks[VALID_PAGES.indexOf(pageId)] || navLinks[0];
  }
  if (activeBtn) activeBtn.classList.add('active');

  if (location.hash.replace('#', '') !== pageId) {
    history.pushState({ page: pageId }, '', '#' + pageId);
  }

  window.scrollTo(0, 0);

  setTimeout(() => {
    updateScrollIndicator();
  }, 50);
}

function routeFromHash() {
  const hash = location.hash.replace('#', '');
  showPage(VALID_PAGES.includes(hash) ? hash : 'home');
}
document.addEventListener('DOMContentLoaded', routeFromHash);
window.addEventListener('popstate', routeFromHash);

function toggleDocModal(show, modalId) {
  const modal = document.getElementById(modalId || 'docModal');
  if (modal) {
    modal.style.display = show ? 'block' : 'none';
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

function toggleCookiePolicyModal(show) {
  const modal = document.getElementById('cookiePolicyModal');
  if (modal) {
    modal.style.display = show ? 'block' : 'none';
    document.body.style.overflow = show ? 'hidden' : '';
  }
}

function checkCookieConsent() {
  const consent = localStorage.getItem('cookie_consent');
  if (!consent) {
    setTimeout(() => {
      const banner = document.getElementById('cookieConsentBanner');
      if (banner) banner.style.display = 'block';
    }, 1500);
  }
}

function acceptCookies() {
  localStorage.setItem('cookie_consent', 'accepted');
  const banner = document.getElementById('cookieConsentBanner');
  if (banner) banner.style.display = 'none';
}

function denyCookies() {
  localStorage.setItem('cookie_consent', 'denied');
  const banner = document.getElementById('cookieConsentBanner');
  if (banner) banner.style.display = 'none';
}

emailjs.init({ publicKey: 'NtcEzquyod-S_wNtp' });

const EMAILJS_SERVICE_ID = 'service_6owwois';
const EMAILJS_TEMPLATE_ID = 'template_xka8ozt';
const CONTACT_EMAIL = 'iankipngetich123@gmail.com';

let lastSubmitAt = 0;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function submitForm() {
  const hp = document.getElementById('f-hp');
  if (hp && hp.value.trim() !== '') {
    return;
  }

  const now = Date.now();
  if (now - lastSubmitAt < 15000) {
    showAlert('Please wait a few seconds before sending another message.', 'RATE_LIMITED');
    return;
  }

  const fname = document.getElementById('f-fname').value.trim().slice(0, 80);
  const lname = document.getElementById('f-lname').value.trim().slice(0, 80);
  const sal = document.getElementById('f-sal').value.trim();
  const email = document.getElementById('f-email').value.trim().slice(0, 120);
  const company = document.getElementById('f-company').value.trim().slice(0, 120);
  const mobile = document.getElementById('f-mobile').value.trim().slice(0, 30);
  const msg = document.getElementById('f-msg').value.trim().slice(0, 4000);

  if (!fname || !email || !msg) {
    showAlert('Please fill in Name, Email and Message Payload.', 'INPUT_REQUIRED');
    return;
  }
  if (!EMAIL_PATTERN.test(email)) {
    showAlert('Please enter a valid email address.', 'INVALID_EMAIL');
    return;
  }

  if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
    showAlert('EmailJS is not fully configured yet — Service ID / Template ID are missing.', 'CONFIG_INCOMPLETE');
    return;
  }

  const submitBtn = document.querySelector('.form-submit');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    submitBtn.innerHTML = '<i class="ti ti-loader-2 spin-anim"></i> TRANSMITTING...';
  }

  const templateParams = {
    salutation: sal,
    first_name: fname,
    last_name: lname,
    from_name: `${sal} ${fname} ${lname}`.trim(),
    from_email: email,
    reply_to: email,
    company: company || 'N/A',
    mobile: mobile || 'N/A',
    message: msg,
    to_email: CONTACT_EMAIL
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams).then(
    () => {
      lastSubmitAt = Date.now();
      const successDiv = document.getElementById('success-msg');
      if (successDiv) {
        successDiv.style.display = 'block';
        setTimeout(() => { successDiv.style.display = 'none'; }, 6000);
      }
      ['f-fname', 'f-lname', 'f-sal', 'f-email', 'f-company', 'f-mobile', 'f-msg', 'f-hp'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { if (el.tagName === 'SELECT') el.selectedIndex = 0; else el.value = ''; }
      });
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.innerHTML = originalBtnHtml;
      }
    },
    (err) => {
      showAlert('Transmission failed — the message could not be sent. Please try again shortly.', 'TRANSMIT_ERROR');
      console.error('EmailJS error:', err);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  );
}

function showAlert(message, title) {
  const overlay = document.getElementById('hudAlertOverlay');
  const titleEl = document.getElementById('hudAlertTitle');
  const msgEl = document.getElementById('hudAlertMsg');
  if (titleEl) titleEl.textContent = title || 'SYSTEM_NOTICE';
  if (msgEl) msgEl.textContent = message;
  if (overlay) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}
function closeAlert() {
  const overlay = document.getElementById('hudAlertOverlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

const mediaGalleries = {
  mpesa: {
    title: 'M-Pesa Forensic Audit',
    assets: [
      { label: '[ UI_PREVIEW_01 ]', desc: 'Main desktop dashboard interface — tactical HUD layout.', img: 'assets/1.png' },
      { label: '[ METRIC_CHART_02 ]', desc: 'Risk visualization — radar sonar chart and category breakdowns.', img: 'assets/2.png' },
      { label: '[ LOG_STREAM_03 ]', desc: 'Live transaction ledger reconstruction and log stream.', img: 'assets/3.png' },
      { label: '[ AML_FLAGS_04 ]', desc: 'AML pattern detection panel — structuring & rapid transit flags.', img: 'assets/4.png' },
      { label: '[ REPORT_EXPORT_05 ]', desc: 'Compiled forensic report export and credit decision summary.', img: 'assets/5.png' },
      { label: '[ MEDIA_06 ]', desc: 'Additional forensic audit interface capture.', img: 'assets/6.png' },
      { label: '[ MEDIA_07 ]', desc: 'Additional forensic audit interface capture.', img: 'assets/7.png' }
    ]
  },
  cosyspec: {
    title: 'CosySpecBot // Telegram AI',
    assets: [
      { label: '[ BOT_LOGO ]', desc: 'CosySpecBot brand mark / logo.', img: 'assets/cosyspec-logo.png' },
      { label: '[ CHAT_PREVIEW ]', desc: 'Live in-chat conversation preview on Telegram.', img: 'assets/cosyspec-chat.png' }
    ]
  }
};
let currentGallery = 'mpesa';
let currentMediaIndex = 0;
function renderMedia() {
  const gallery = mediaGalleries[currentGallery];
  const assets = gallery.assets;
  const asset = assets[currentMediaIndex];
  const labelEl = document.getElementById('mediaLabel');
  const descEl = document.getElementById('mediaDesc');
  if (labelEl) labelEl.textContent = asset.label;
  if (descEl) descEl.textContent = asset.desc;
  document.getElementById('mediaCount').textContent = `${currentMediaIndex + 1} / ${assets.length}`;
  document.getElementById('mediaModalTitle').textContent = `Project Media — Asset ${currentMediaIndex + 1}`;
  const subEl = document.getElementById('mediaModalSub');
  if (subEl) subEl.textContent = `${gallery.title} // Media Overlay Viewer`;
  const imgEl = document.getElementById('mediaImage');
  const iconEl = document.getElementById('mediaIcon');
  if (imgEl) {
    imgEl.src = asset.img;
    imgEl.style.display = 'block';
  }
  if (iconEl) iconEl.style.display = 'none';
}
function openMediaModal(idx, galleryKey) {
  currentGallery = (galleryKey && mediaGalleries[galleryKey]) ? galleryKey : 'mpesa';
  currentMediaIndex = idx;
  renderMedia();
  const modal = document.getElementById('mediaModal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}
function toggleMediaModal(show) {
  const modal = document.getElementById('mediaModal');
  if (modal) {
    modal.style.display = show ? 'block' : 'none';
    document.body.style.overflow = show ? 'hidden' : '';
  }
}
function navMedia(dir) {
  const assets = mediaGalleries[currentGallery].assets;
  currentMediaIndex = (currentMediaIndex + dir + assets.length) % assets.length;
  renderMedia();
}

function toggleAboutPhotoModal(show) {
  const modal = document.getElementById('aboutPhotoModal');
  if (modal) {
    modal.style.display = show ? 'block' : 'none';
    document.body.style.overflow = show ? 'hidden' : '';
  }
}

window.addEventListener('scroll', onWindowScroll);
window.addEventListener('resize', () => {
  updateScrollIndicator();
});

window.addEventListener('click', (e) => {
  const docModal = document.getElementById('docModal');
  if (e.target === docModal) toggleDocModal(false, 'docModal');

  const docModalCosyspec = document.getElementById('docModalCosyspec');
  if (e.target === docModalCosyspec) toggleDocModal(false, 'docModalCosyspec');

  const mediaModal = document.getElementById('mediaModal');
  if (e.target === mediaModal) toggleMediaModal(false);

  const aboutPhotoModal = document.getElementById('aboutPhotoModal');
  if (e.target === aboutPhotoModal) toggleAboutPhotoModal(false);

  const cookiePolicyModal = document.getElementById('cookiePolicyModal');
  if (e.target === cookiePolicyModal) toggleCookiePolicyModal(false);

  const hudAlertOverlay = document.getElementById('hudAlertOverlay');
  if (e.target === hudAlertOverlay) closeAlert();
});

window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  toggleDocModal(false, 'docModal');
  toggleDocModal(false, 'docModalCosyspec');
  toggleMediaModal(false);
  toggleAboutPhotoModal(false);
  toggleCookiePolicyModal(false);
  closeAlert();
});

document.addEventListener('DOMContentLoaded', () => {
  updateScrollIndicator();
  checkCookieConsent();
});
