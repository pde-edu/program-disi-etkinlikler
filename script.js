/* =========================
   DİL DEĞİŞTİRME
========================= */
function setLanguage(lang) {

    const sections = ["about", "hero", "gallery1", "gallery2"];

    sections.forEach(section => {

        const tr = document.getElementById(section + "-tr");
        const en = document.getElementById(section + "-en");

        if (lang === "tr") {
            if (tr) tr.style.display = "block";
            if (en) en.style.display = "none";
        } else {
            if (tr) tr.style.display = "none";
            if (en) en.style.display = "block";
        }
    });
}


/* =========================
   SAĞ-SOL BUTON SCROLL
========================= */

let autoScrollPaused = false;
let pauseTimeout;

function scrollGallery(button, direction) {

    const wrapper = button.closest(".scroll-wrapper");
    if (!wrapper) return;

    const gallery = wrapper.querySelector(".horizontal-scroll");
    if (!gallery) return;

    gallery.scrollBy({
        left: direction * 320,
        behavior: "smooth"
    });

    // Otomatik scroll'u geçici durdur
    autoScrollPaused = true;

    clearTimeout(pauseTimeout);
    pauseTimeout = setTimeout(() => {
        autoScrollPaused = false;
    }, 3000); // 3 saniye sonra tekrar otomatik başlar
}


/* =========================
   MODAL
========================= */
function openModal(card) {
    const img = card.querySelector("img").src;
    document.getElementById("modalImage").src = img;
    document.getElementById("imageModal").style.display = "block";
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}


function autoScrollGallery() {
    const galleries = document.querySelectorAll(".auto-scroll");
    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    galleries.forEach(gallery => {
        if (isMobile) return; // mobilde otomatik scroll kapalı

        let scrollAmount = 0;

        setInterval(() => {
            if (autoScrollPaused) return;

            scrollAmount += 2; // 2px adım
            if (scrollAmount >= gallery.scrollWidth - gallery.clientWidth) {
                scrollAmount = 0;
            }

            gallery.scrollTo({ left: scrollAmount });
        }, 20);
    });
}

document.addEventListener("DOMContentLoaded", autoScrollGallery);

document.querySelectorAll(".auto-scroll").forEach(gallery => {
    gallery.addEventListener("mouseenter", () => autoScrollPaused = true);
    gallery.addEventListener("mouseleave", () => autoScrollPaused = false);
});
let selectedEventId = null;

function openModal(card, eventId, shortDesc) {

    selectedEventId = eventId;

    const img = card.querySelector("img").src;

    document.getElementById("modalImage").src = img;
    document.getElementById("modalDescription").innerText = shortDesc;

    document.getElementById("imageModal").style.display = "block";
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

function goToDetailPage() {
    if(selectedEventId){
        window.location.href = `detail-${selectedEventId}.html`;
    }
}