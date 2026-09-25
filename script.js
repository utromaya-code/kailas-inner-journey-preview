const programToggle = document.querySelector('#expand-program');
const programDays = [...document.querySelectorAll('.day')];
function updateProgramToggle() {
  const allOpen = programDays.every(day => day.open);
  programToggle.setAttribute('aria-expanded', String(allOpen));
  programToggle.innerHTML = allOpen ? 'Свернуть все дни <span aria-hidden="true">−</span>' : 'Развернуть все дни <span aria-hidden="true">＋</span>';
}
programToggle.addEventListener('click', () => {
  const shouldOpen = !programDays.every(day => day.open);
  programDays.forEach(day => { day.open = shouldOpen; });
  updateProgramToggle();
});
programDays.forEach(day => day.addEventListener('toggle', updateProgramToggle));

function openLinkedDay() {
  const linked = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (linked?.classList.contains('day')) linked.open = true;
}
window.addEventListener('hashchange', openLinkedDay);
openLinkedDay();

const contactDialog = document.querySelector('#contact-dialog');
const contactClose = contactDialog?.querySelector('[data-contact-close]');
for (const link of document.querySelectorAll('[data-contact-open]')) {
  link.addEventListener('click', (event) => {
    if (!contactDialog?.showModal) return;
    event.preventDefault();
    contactDialog.showModal();
    contactClose?.focus();
  });
}
contactClose?.addEventListener('click', () => contactDialog.close());
contactDialog?.addEventListener('click', (event) => {
  if (event.target === contactDialog) contactDialog.close();
});
contactDialog?.querySelectorAll('.contact-options a').forEach(link => {
  link.addEventListener('click', () => contactDialog.close());
});

const mobileContact = document.querySelector('.mobile-contact-cta');
if (mobileContact && 'IntersectionObserver' in window) {
  let heroVisible = true;
  let priceVisible = false;
  let footerVisible = false;
  const updateSticky = () => mobileContact.classList.toggle('is-visible', !heroVisible && !priceVisible && !footerVisible);
  const hero = document.querySelector('.hero');
  const price = document.querySelector('#price');
  const footer = document.querySelector('.footer');
  if (hero) new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    updateSticky();
  }).observe(hero);
  if (price) new IntersectionObserver(([entry]) => {
    priceVisible = entry.isIntersecting;
    updateSticky();
  }).observe(price);
  if (footer) new IntersectionObserver(([entry]) => {
    footerVisible = entry.isIntersecting;
    updateSticky();
  }).observe(footer);
}

const galleryDialog = document.querySelector('#gallery-lightbox');
const galleryFigures = [...document.querySelectorAll('.gallery figure')];
const galleryImage = galleryDialog?.querySelector('img');
let galleryIndex = 0;
let galleryOpener = null;
function showGalleryImage(index) {
  galleryIndex = (index + galleryFigures.length) % galleryFigures.length;
  const source = galleryFigures[galleryIndex].querySelector('img');
  galleryImage.src = source.currentSrc || source.src;
  galleryImage.alt = source.alt;
}
if (galleryDialog?.showModal && galleryFigures.length) {
  galleryFigures.forEach((figure, index) => {
    const image = figure.querySelector('img');
    figure.tabIndex = 0;
    figure.setAttribute('role', 'button');
    figure.setAttribute('aria-label', `Открыть фото: ${image.alt}`);
    const open = () => {
      galleryOpener = figure;
      showGalleryImage(index);
      galleryDialog.showModal();
      galleryDialog.querySelector('.gallery-lightbox-close').focus();
    };
    figure.addEventListener('click', open);
    figure.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
  galleryDialog.querySelector('.gallery-lightbox-close').addEventListener('click', () => galleryDialog.close());
  galleryDialog.querySelector('.gallery-lightbox-prev').addEventListener('click', () => showGalleryImage(galleryIndex - 1));
  galleryDialog.querySelector('.gallery-lightbox-next').addEventListener('click', () => showGalleryImage(galleryIndex + 1));
  galleryDialog.addEventListener('click', (event) => {
    if (event.target === galleryDialog) galleryDialog.close();
  });
  galleryDialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showGalleryImage(galleryIndex - 1);
    if (event.key === 'ArrowRight') showGalleryImage(galleryIndex + 1);
  });
  galleryDialog.addEventListener('close', () => galleryOpener?.focus());
}
