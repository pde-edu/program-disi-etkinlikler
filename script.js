let currentLang = "tr";

const events = {

  etkinlik1: {
    title: {
      tr: "Etkinlik 1",
      en: "Activity 1"
    },
    shortDesc: {
      tr: "Bu etkinlikte öğrenciler iş birliği çalışması yaptı.",
      en: "Students practiced collaborative learning in this activity."
    },
    longDesc: {
      tr: "Bu etkinlik kapsamında öğrenciler grup çalışmaları yaparak problem çözme becerilerini geliştirdiler.",
      en: "In this activity, students improved their problem-solving skills through group work."
    },
    images: [
      "assets/images/etkinlik1-1.jpg",
      "assets/images/etkinlik1-2.jpg"
    ]
  }

};

/* =========================
   DİL DEĞİŞTİRME
========================= */
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("selectedLang", lang);
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
let selectedEventId = null;
function openModal(card, eventId) {

    selectedEventId = eventId;

    const img = card.querySelector("img").src;
    document.getElementById("modalImage").src = img;

    if(events[eventId]){
        document.getElementById("modalDescription").innerText = events[eventId].shortDesc[currentLang];
    } else {
        document.getElementById("modalDescription").innerText = "";
    }

    document.getElementById("imageModal").style.display = "block";
}
document.addEventListener("DOMContentLoaded", function(){

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  const langParam = params.get("lang");

  if(langParam === "tr" || langParam === "en"){
      currentLang = langParam;
      localStorage.setItem("selectedLang", langParam);
  } else {
      const savedLang = localStorage.getItem("selectedLang");
      if(savedLang === "tr" || savedLang === "en"){
          currentLang = savedLang;
      }
  }
  setLanguage(currentLang);
  /* Otomatik scroll başlat */
  autoScrollGallery();

  /* Hover ile scroll durdurma */
  document.querySelectorAll(".auto-scroll").forEach(gallery => {
      gallery.addEventListener("mouseenter", () => autoScrollPaused = true);
      gallery.addEventListener("mouseleave", () => autoScrollPaused = false);
  });
  
  if(eventId && events[eventId]){

    const event = events[eventId];

    const titleEl = document.getElementById("detailTitle");
    const textEl = document.getElementById("detailText");
    const gallery = document.getElementById("detailGallery");

    if(titleEl) titleEl.innerText = event.title[currentLang];
    if(textEl) textEl.innerText = event.longDesc[currentLang];

    if(gallery){
      event.images.forEach(imgSrc => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.style.width = "250px";
        img.style.margin = "10px";
        gallery.appendChild(img);
      });
    }
  }

});
function goToDetailPage() {
    if(selectedEventId){
        window.location.href = `detail.html?id=${selectedEventId}`;
    }
}