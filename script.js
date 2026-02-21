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


/* =========================
   OTOMATİK SCROLL
========================= */
function autoScrollGallery() {

    const galleries = document.querySelectorAll(".auto-scroll");

    galleries.forEach(gallery => {

        setInterval(() => {

            if (autoScrollPaused) return;

            gallery.scrollLeft += 1;

            if (gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth) {
                gallery.scrollLeft = 0;
            }

        }, 20);
    });
}

document.addEventListener("DOMContentLoaded", autoScrollGallery);