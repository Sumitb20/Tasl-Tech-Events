// Footer year (keeps current year)
const yearSpan = document.getElementById("year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Reveal animations (IntersectionObserver)
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Navbar shrink
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (!navbar) return;
  if (window.scrollY > 10) navbar.classList.add("navbar-scrolled");
  else navbar.classList.remove("navbar-scrolled");
});

// Cursor glow movement
const glow = document.querySelector(".cursor-glow");
if (glow) {
  window.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;
    glow.style.transform = `translate3d(${x - 130}px, ${y - 130}px, 0)`;
  });
}

// Popup modal for highlighted text
const modal = document.getElementById("info-modal");
const modalTitle = modal?.querySelector(".modal-title");
const modalBody = modal?.querySelector(".modal-body");
const modalClose = modal?.querySelector(".modal-close");
const modalBackdrop = modal?.querySelector(".modal-backdrop");

function openModal(title, body) {
  if (!modal || !modalTitle || !modalBody) return;
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modal.classList.add("open");
}
function closeModal() { if (!modal) return; modal.classList.remove("open"); }

document.querySelectorAll(".popup-trigger").forEach((el) => {
  el.addEventListener("click", () => {
    const title = el.getAttribute("data-title") || "More information";
    const body = el.getAttribute("data-body") || "";
    openModal(title, body);
  });
});
modalClose?.addEventListener("click", closeModal);
modalBackdrop?.addEventListener("click", closeModal);
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// BLOG tabs + filter + search
(function blogModule() {
  const tabs = document.querySelectorAll(".tabs .tab");
  const blogsBlock = document.getElementById("blogs");
  const researchBlock = document.getElementById("research");
  const filter = document.getElementById("ins-filter");
  const search = document.getElementById("ins-search");

  // simple tab switch
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const key = tab.dataset.tab;
    if (key === 'blogs') { blogsBlock.style.display = ''; researchBlock.style.display = 'none'; }
    else { blogsBlock.style.display = 'none'; researchBlock.style.display = ''; }
  }));

  function applyFilters() {
    const q = (search.value || '').trim().toLowerCase();
    const f = (filter.value || 'all');
    const posts = Array.from(document.querySelectorAll('#blogs .post-card'));
    posts.forEach(p => {
      const industry = p.dataset.industry || 'all';
      const title = p.querySelector('h3')?.innerText?.toLowerCase() || '';
      const body = p.querySelector('p')?.innerText?.toLowerCase() || '';
      const okIndustry = (f === 'all') || (industry === f);
      const okQuery = q === '' || title.includes(q) || body.includes(q);
      p.style.display = (okIndustry && okQuery) ? '' : 'none';
    });
  }

  filter?.addEventListener('change', applyFilters);
  search?.addEventListener('input', () => { debounce(applyFilters, 150)(); });

})();

// Demo contact form handler (frontend only)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // Minimal validation
    const name = this.querySelector('#name')?.value || '';
    const email = this.querySelector('#email')?.value || '';
    if (!name || !email) {
      alert('Please fill name and email before submitting.');
      return;
    }
    alert('Thanks! Your enquiry was submitted (demo). Connect a backend to persist leads.');
    this.reset();
  });
}

// small debounce helper
function debounce(fn, wait) {
  let t;
  return function () { clearTimeout(t); t = setTimeout(fn, wait); };
}

// Accessibility: close modal on focus out (optional)
document.addEventListener('focusin', (e) => {
  if (modal && modal.classList.contains('open') && !modal.contains(e.target)) {
    // keep open — we don't auto-close to avoid losing user input
  }
});
