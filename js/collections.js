/* STACKLY — Collections Page JS */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.collection-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%'
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        delay: index % 2 * 0.15,
        ease: 'power3.out'
      });
    });
  }
});

/* Collections Interactivity Functions */

const FABRIC_DATA = [
  { title: "Obsidian Silk-Cotton (450 GSM)", code: "SPECIFICATION: FAB-450-JP", img: "assets/fabric-weave-1.webp" },
  { title: "Champagne Metallic Weave", code: "SPECIFICATION: FAB-320-GL", img: "assets/fabric-weave-2.webp" },
  { title: "Sculptural Shoulder Architecture", code: "SPECIFICATION: TAILOR-STR-99", img: "assets/fabric-weave-3.webp" },
  { title: "Thermal Velocity Lining", code: "SPECIFICATION: LIN-THERM-88", img: "assets/fabric-weave-4.webp" }
];

function switchFabricTab(index) {
  const items = document.querySelectorAll('.fabric-tab-item');
  items.forEach((item, idx) => {
    if (idx === index) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  const data = FABRIC_DATA[index];
  if (data) {
    const imgEl = document.getElementById('fabric-display-img');
    const titleEl = document.getElementById('fabric-display-title');
    const codeEl = document.getElementById('fabric-display-code');

    if (imgEl) {
      imgEl.style.opacity = '0';
      setTimeout(() => {
        imgEl.src = data.img;
        imgEl.style.opacity = '1';
      }, 200);
    }
    if (titleEl) titleEl.textContent = data.title;
    if (codeEl) codeEl.textContent = data.code;
  }
}

function selectStyleMatrix(cardEl, categoryName) {
  window.location.href = '404.html';
}
