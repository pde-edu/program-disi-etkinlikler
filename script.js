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
    const sections = ["about", "hero", "gallery1", "gallery2", "gallery3", "contact"];
    

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
    document.getElementById("imageModal").classList.remove("show");
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
    const modal = document.getElementById("imageModal");

    document.getElementById("modalImage").src = img;

    if (events[eventId]) {
        document.getElementById("modalDescription").innerText =
            events[eventId].shortDesc[currentLang];
    }

    modal.classList.add("show");
}
document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("imageModal");
    if (modal) modal.classList.remove("show");

    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");
    const langParam = params.get("lang");

    if (langParam === "tr" || langParam === "en") {
        currentLang = langParam;
        localStorage.setItem("selectedLang", langParam);
    } else {
        const savedLang = localStorage.getItem("selectedLang");
        if (savedLang === "tr" || savedLang === "en") {
            currentLang = savedLang;
        }
    }
    loadDetailPage();
    setLanguage(currentLang);
    autoScrollGallery();

    document.querySelectorAll(".auto-scroll").forEach(gallery => {
        gallery.addEventListener("mouseenter", () => autoScrollPaused = true);
        gallery.addEventListener("mouseleave", () => autoScrollPaused = false);
    });

    if (eventId && events[eventId]) {

        const event = events[eventId];

        const titleEl = document.getElementById("detailTitle");
        const textEl = document.getElementById("detailText");
        const gallery = document.getElementById("detailGallery");

        if (titleEl) titleEl.innerText = event.title[currentLang];
        if (textEl) textEl.innerText = event.longDesc[currentLang];

        if (gallery) {
            gallery.innerHTML = ""; // 🔥 duplicate fix
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



function renderGallery() {
  const container = document.getElementById("gallery");
  if (!container) return;

  container.innerHTML = "";

  Object.keys(events).forEach(id => {
    const event = events[id];

    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => {
      window.location.href = `detail.html?id=${id}`;
    };

    card.innerHTML = `
      <img src="${event.cover}">
      <div class="overlay">
        ${event.title[currentLang]}
      </div>
    `;

    container.appendChild(card);
  });
}

function loadDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id || !events[id]) return;

  const event = events[id];

  document.getElementById("detailTitle").innerText = event.title[currentLang];
  document.getElementById("detailText").innerText = event.longDesc[currentLang];

  const gallery = document.getElementById("detailGallery");
  gallery.innerHTML = "";

  event.images.forEach(img => {
    const image = document.createElement("img");
    image.src = img;
    gallery.appendChild(image);
  });
}

/* =========================
   EVENTS
========================= */
const events = {
  etkinlik1: {
    id: "etkinlik1",

    category: "gallery1",

    title: {
      tr: "Müzeler Haftası",
      en: "Museums Week"
    },

    subtitle: {
      tr: "18-24 Mayıs",
      en: "May 18-24"
    },

    shortDesc: {
      tr: "Öğrenciler müzeler haftası kapsamında etkinlik yaptı.",
      en: "Students participated in Museums Week activities."
    },

    longDesc: {
      tr: "Bu etkinlikte öğrenciler müze kültürünü tanıdı, grup çalışmaları yaptı ve gözlem becerilerini geliştirdi.",
      en: "Students explored museum culture, worked in groups and developed observation skills."
    },

    images: [
      "assets/images/etkinlik1-1.jpg",
      "assets/images/etkinlik1-2.jpg"
    ],

    coverImage: "assets/images/etkinlik1-1.jpg"
  },


  etkinlik2: {
    id: "etkinlik2",
    category: "gallery1",

    title: {
      tr: "Dünya Sağlık Günü",
      en: "World Health Day"
    },

    subtitle: {
      tr: "7-13 Nisan",
      en: "April 7-13"
    },

    shortDesc: {
      tr: "Sağlıklı yaşam farkındalığı etkinliği yapıldı.",
      en: "Health awareness activities were conducted."
    },

    longDesc: {
      tr: "Öğrenciler sağlıklı yaşam, hijyen ve spor konularında etkinlikler gerçekleştirdi.",
      en: "Students engaged in activities about healthy living, hygiene, and sports."
    },

    images: [
      "assets/images/etkinlik2-1.jpg"
    ],

    coverImage: "assets/images/etkinlik2-1.jpg"
  },
  etkinlik3: {
    id: "etkinlik3",
    category: "gallery1",

    title: { 
        tr: "Orman Haftası",
        en: "Forest Week"
    },

    shortDesc: {
        tr: "Ormanların önemi hakkında etkinlik yapıldı.",
        en: "Activities about the importance of forests were held."
    },  

    longDesc: {
        tr: "Bu etkinlikte öğrenciler ormanların ekosistemdeki rolünü öğrendi, doğa yürüyüşleri yaptı ve ağaç dikti.",
        en: "In this activity, students learned about the role of forests in the ecosystem, went on nature walks, and planted trees."
    },  

    images: [
        "assets/images/etkinlik3-1.jpg",
        "assets/images/etkinlik3-2.jpg"
    ],  

  coverImage: "assets/images/etkinlik3-1.jpg"
},
etkinlik4: {
    id: "etkinlik4",
    category: "gallery1",   

    title: {

        tr: "Müzeler Haftası",
        en: "Museums Week"
    }, 

    shortDesc: {
        tr: "Öğrenciler müzeler haftası kapsamında etkinlik yaptı.",
        en: "Students participated in Museums Week activities."
    },

    longDesc: {
        tr: "Bu etkinlikte öğrenciler müze kültürünü tanıdı, grup çalışmaları yaptı ve gözlem becerilerini geliştirdi.",
        en: "Students explored museum culture, worked in groups and developed observation skills."
    },  

    images: [
        "assets/images/etkinlik4-1.jpg",
        "assets/images/etkinlik4-2.jpg"
    ],

    coverImage: "assets/images/etkinlik4-1.jpg"
  }, 
  
    etkinlik5: {
    id: "etkinlik5",
    category: "gallery1",       

    title: {
        tr: "Trafik ve İlk Yardım Haftası",
        en: "Traffic and First Aid Week"
    },  

    shortDesc: {
        tr: "Trafik ve ilk yardım konularında etkinlik yapıldı.",
        en: "Activities about traffic and first aid were conducted."
    },
    longDesc: { 
        tr: "Öğrenciler trafik kuralları, ilk yardım teknikleri ve acil durum yönetimi konularında etkinlikler gerçekleştirdi.",
        en: "Students engaged in activities about traffic rules, first aid techniques, and emergency management."
    },      

    images: [
        "assets/images/etkinlik5-1.jpg",
        "assets/images/etkinlik5-2.jpg"
    ],      

    coverImage: "assets/images/etkinlik5-1.jpg"
  }, 

     etkinlik6: {
    id: "etkinlik6",
    category: "gallery1",    

    title: {
        tr: "Müzeler Haftası",
        en: "Museums Week"  
    },

    shortDesc: {
        tr: "Öğrenciler müzeler haftası kapsamında etkinlik yaptı.",
        en: "Students participated in Museums Week activities."
    },
    longDesc: {
        tr: "Bu etkinlikte öğrenciler müze kültürünü tanıdı, grup çalışmaları yaptı ve gözlem becerilerini geliştirdi.",
        en: "Students explored museum culture, worked in groups and developed observation skills."
    },
    images: [
        "assets/images/etkinlik6-1.jpg",
        "assets/images/etkinlik6-2.jpg"
    ],
    coverImage: "assets/images/etkinlik6-1.jpg"
  }, 

     etkinlik7: {
    id: "etkinlik7",
    category: "gallery1",
    
    title: {
        tr: "Trafik ve İlk Yardım Haftası",
        en: "Traffic and First Aid Week"
    },  

    shortDesc: {
        tr: "Trafik ve ilk yardım konularında etkinlik yapıldı.",
        en: "Activities about traffic and first aid were conducted."
    },

    longDesc: {
        tr: "Öğrenciler trafik kuralları, ilk yardım teknikleri ve acil durum yönetimi konularında etkinlikler gerçekleştirdi.",
        en: "Students engaged in activities about traffic rules, first aid techniques, and emergency management."
    },

    images: [
        "assets/images/etkinlik7-1.jpg",
        "assets/images/etkinlik7-2.jpg"
    ],      

    coverImage: "assets/images/etkinlik7-1.jpg"
  }, 


      etkinlik8: {
    id: "etkinlik8",
    category: "gallery1",

    title: {
        tr: "İstiklal Marşı'nın Kabulü ve Mehmet Akif Ersoy'u Anma Günü",
        en: "National Anthem Acceptance and Mehmet Akif Ersoy Commemoration Day"
    },  

    shortDesc: {        
        tr: "İstiklal Marşı'nın kabulü ve Mehmet Akif Ersoy'u anma günü etkinliği yapıldı.",
        en: "An event was held to commemorate the acceptance of the National Anthem and Mehmet Akif Ersoy."
    },  
    longDesc: {
        tr: "Bu etkinlikte öğrenciler İstiklal Marşı'nın tarihini öğrendi, Mehmet Akif Ersoy'un hayatını inceledi ve şiir dinletisi gerçekleştirdi.",
        en: "In this event, students learned about the history of the National Anthem, explored the life of Mehmet Akif Ersoy, and held a poetry recital."
    },
    images: [
        "assets/images/etkinlik8-1.jpg",
        "assets/images/etkinlik8-2.jpg"
    ],  
    coverImage: "assets/images/etkinlik8-1.jpg"
    },   

    etkinlik9: {
    id: "etkinlik9",
    category: "gallery1",   

    title: {
        tr: "Şehitler Günü",
        en: "Martyrs' Day"
    },  

    shortDesc: {
        tr: "Şehitler günü etkinliği yapıldı.",
        en: "An event was held for Martyrs' Day."   
    },

    longDesc: {
        tr: "Bu etkinlikte öğrenciler şehitlerimizin hayatını öğrendi, anma töreni düzenledi ve şiir dinletisi gerçekleştirdi.",
        en: "In this event, students learned about the lives of our martyrs, organized a commemoration ceremony, and held a poetry recital."
    },  
    images: [
        "assets/images/etkinlik9-1.jpg",
        "assets/images/etkinlik9-2.jpg" 
    ],
    coverImage: "assets/images/etkinlik9-1.jpg"
  }, 
       
      etkinlik10: {
    id: "etkinlik10",
    category: "gallery1",

    title: {
        tr: "Turizm Haftası",
        en: "Tourism Week"
    },  
    shortDesc: {
        tr: "Turizm haftası etkinliği yapıldı.",
        en: "An event was held for Tourism Week."
    },

    longDesc: {     
        tr: "Bu etkinlikte öğrenciler turizmin önemini öğrendi, grup çalışmaları yaptı ve gezi düzenledi.",
        en: "In this event, students learned about the importance of tourism, worked in groups, and organized a trip."
    },
    images: [
        "assets/images/etkinlik10-1.jpg",
        "assets/images/etkinlik10-2.jpg"
    ],
    coverImage: "assets/images/etkinlik10-1.jpg"
    },

    etkinlik11: {
    id: "etkinlik11",
    category: "gallery1",   

    title: {
        tr: "Dünya Sağlık Günü",
        en: "World Health Day"
    },  
    shortDesc: {
        tr: "Sağlıklı yaşam farkındalığı etkinliği yapıldı.",
        en: "Health awareness activities were conducted."
    },  
    longDesc: {
        tr: "Öğrenciler sağlıklı yaşam, hijyen ve spor konularında etkinlikler gerçekleştirdi.",
        en: "Students engaged in activities about healthy living, hygiene, and sports." 
    },
    images: [
        "assets/images/etkinlik11-1.jpg",   
        "assets/images/etkinlik11-2.jpg"
    ],  
    coverImage: "assets/images/etkinlik11-1.jpg"
    },


bayram1: {
    category: "gallery2",
    title: {
      tr: "23 Nisan",
      en: "April 23rd"
    },
    shortDesc: {
      tr: "Ulusal Egemenlik ve Çocuk Bayramı",
      en: "National Sovereignty and Children's Day"
    },
    longDesc: {
      tr: "Okul etkinlikleri ile kutlandı.",
      en: "Celebrated with school activities."
    },
    images: [
      "assets/images/bayram1-1.jpg"
    ],
    coverImage: "assets/images/bayram1-1.jpg"
  },
    
bayram2: {
    category: "gallery2",
    title: {
        tr: "23 Nisan",
        en: "April 23rd"
    },  
    shortDesc: {
        tr: "Ulusal Egemenlik ve Çocuk Bayramı",
        en: "National Sovereignty and Children's Day"   
    },
    longDesc: {
        tr: "Okul etkinlikleri ile kutlandı.",
        en: "Celebrated with school activities."
    },
    images: [
        "assets/images/bayram2-1.jpg"
    ],  
    coverImage: "assets/images/bayram2-1.jpg"
  },

bayram3: {
    category: "gallery2",
    title: {
        tr: "23 Nisan", 
        en: "April 23rd"
    },  
    shortDesc: {    
        tr: "Ulusal Egemenlik ve Çocuk Bayramı",
        en: "National Sovereignty and Children's Day"
    },
    longDesc: {
        tr: "Okul etkinlikleri ile kutlandı.",
        en: "Celebrated with school activities."
    },
    images: [
        "assets/images/bayram3-1.jpg"
    ],  
    coverImage: "assets/images/bayram3-1.jpg"
  },

bayram4: {
    category: "gallery2",
    title: {
        tr: "23 Nisan", 
        en: "April 23rd"
    },  
    shortDesc: {
        tr: "Ulusal Egemenlik ve Çocuk Bayramı",
        en: "National Sovereignty and Children's Day"
    },
    longDesc: {
        tr: "Okul etkinlikleri ile kutlandı.",
        en: "Celebrated with school activities."
    },
    images: [
        "assets/images/bayram4-1.jpg"
    ],  
    coverImage: "assets/images/bayram4-1.jpg"
  },
bayram5: {  
    category: "gallery2",
    title: {
        tr: "23 Nisan",
        en: "April 23rd"
    },  
    shortDesc: {
        tr: "Ulusal Egemenlik ve Çocuk Bayramı",
        en: "National Sovereignty and Children's Day"
    },
    longDesc: {
        tr: "Okul etkinlikleri ile kutlandı.",
        en: "Celebrated with school activities."
    },  
    images: [
        "assets/images/bayram5-1.jpg"
    ],  
    coverImage: "assets/images/bayram5-1.jpg"
  },
  
bayram6: {
    category: "gallery2",
    title: {    
        tr: "23 Nisan",
        en: "April 23rd"
    },
    shortDesc: {
        tr: "Ulusal Egemenlik ve Çocuk Bayramı",
        en: "National Sovereignty and Children's Day"
    },
    longDesc: {
        tr: "Okul etkinlikleri ile kutlandı.",
        en: "Celebrated with school activities."
    },  
    images: [
        "assets/images/bayram6-1.jpg"
    ],  
    coverImage: "assets/images/bayram6-1.jpg"
  },

bayram7: { 
    category: "gallery2",
    title: {
        tr: "23 Nisan", 
        en: "April 23rd"
    },  
    shortDesc: {    
        tr: "Ulusal Egemenlik ve Çocuk Bayramı",
        en: "National Sovereignty and Children's Day"
    },
    longDesc: {
        tr: "Okul etkinlikleri ile kutlandı.",
        en: "Celebrated with school activities."
    },
    images: [
        "assets/images/bayram7-1.jpg"
    ],  
    coverImage: "assets/images/bayram7-1.jpg"
  },

bayram8: {
    category: "gallery2",
    title: {    
        tr: "23 Nisan",
        en: "April 23rd"
    },  
    shortDesc: {
        tr: "Ulusal Egemenlik ve Çocuk Bayramı",
        en: "National Sovereignty and Children's Day"
    },
    longDesc: {
        tr: "Okul etkinlikleri ile kutlandı.",
        en: "Celebrated with school activities."
    },  

    images: [
        "assets/images/bayram8-1.jpg"
    ],  
    coverImage: "assets/images/bayram8-1.jpg"
  },

bayram9: {
    category: "gallery2",
    title: {
        tr: "23 Nisan",
        en: "April 23rd"
    },  
    shortDesc: {
        tr: "Ulusal Egemenlik ve Çocuk Bayramı",
        en: "National Sovereignty and Children's Day"
    },
    longDesc: {
        tr: "Okul etkinlikleri ile kutlandı.",
        en: "Celebrated with school activities."
    },
    images: [
        "assets/images/bayram9-1.jpg"
    ],  
    coverImage: "assets/images/bayram9-1.jpg"
  },    

bayram10: {
    category: "gallery2",
    title: {
        tr: "23 Nisan",
        en: "April 23rd"
    },      
    shortDesc: {
        tr: "Ulusal Egemenlik ve Çocuk Bayramı",
        en: "National Sovereignty and Children's Day"
    },
    longDesc: {
        tr: "Okul etkinlikleri ile kutlandı.",
        en: "Celebrated with school activities."
    },  

    images: [
        "assets/images/bayram10-1.jpg"
    ],  
    coverImage: "assets/images/bayram10-1.jpg"
  },

bayram11: {
    category: "gallery2",
    title: {    
        tr: "23 Nisan",
        en: "April 23rd"
    },  
    shortDesc: {
        tr: "Ulusal Egemenlik ve Çocuk Bayramı",
        en: "National Sovereignty and Children's Day"
    },
    longDesc: {
        tr: "Okul etkinlikleri ile kutlandı.",
        en: "Celebrated with school activities."
    },  
    images: [
        "assets/images/bayram11-1.jpg"
    ],  
    coverImage: "assets/images/bayram11-1.jpg"
  },

bayram12: {
    category: "gallery2",
    title: {   
        tr: "23 Nisan",
        en: "April 23rd"
    },  
    shortDesc: {
        tr: "Ulusal Egemenlik ve Çocuk Bayramı",
        en: "National Sovereignty and Children's Day"
    },
    longDesc: {
        tr: "Okul etkinlikleri ile kutlandı.",
        en: "Celebrated with school activities."
    },  
    images: [
        "assets/images/bayram12-1.jpg"
    ],  
    coverImage: "assets/images/bayram12-1.jpg"
  },

bayram13: {
    category: "gallery2",
    title: {
        tr: "23 Nisan",
        en: "April 23rd"
    },
    shortDesc: {
        tr: "Ulusal Egemenlik ve Çocuk Bayramı",
        en: "National Sovereignty and Children's Day"
    },
    longDesc: {
        tr: "Okul etkinlikleri ile kutlandı.",
        en: "Celebrated with school activities."
    },  

    images: [
        "assets/images/bayram13-1.jpg"
    ],  
    coverImage: "assets/images/bayram13-1.jpg"
  },

bayram14: {
    category: "gallery2",
    title: {
        tr: "23 Nisan", 
        en: "April 23rd"
    },  
    shortDesc: {    
        tr: "Ulusal Egemenlik ve Çocuk Bayramı",
        en: "National Sovereignty and Children's Day"
    },
    longDesc: {
        tr: "Okul etkinlikleri ile kutlandı.",
        en: "Celebrated with school activities."
    },
    images: [
        "assets/images/bayram14-1.jpg"
    ],  
    coverImage: "assets/images/bayram14-1.jpg"
  },



odoo1: {
    category: "gallery3",
    title: {
      tr: "Değerler Eğitimi",
      en: "Values Education"
    },
    shortDesc: {
      tr: "Adalet temalı etkinlik",
      en: "Justice themed activity"
    },
    longDesc: {
      tr: "Öğrenciler adalet kavramını gezi vedrama ile öğrendi.",
      en: "Students learned justice through drama."
    },
    images: [
      "assets/images/odoo1-1.jpg"
    ],
    coverImage: "assets/images/odoo1-1.jpg"

  },

odoo2: {
    category: "gallery3",
    title: {
        tr: "Kale Gezisi ve Film İncelemesi Etkinliği",
        en: "Castle Visit and Movie Review Activity"
    },  
    shortDesc: {
        tr: "Kale gezisi ve film incelemesi etkinliği yapıldı.",
        en: "A castle visit and movie review activity was held."
    },
    longDesc: {
        tr: "Bu etkinlikte öğrenciler tarihi bir kaleyi gezdi, ardından kaleyle ilgili bir film izleyerek inceleme yaptı.",
        en: "In this activity, students toured a historical castle and then watched a related movie for review."
    },  
    images: [
        "assets/images/odoo2-1.jpg"
    ],  
    coverImage: "assets/images/odoo2-1.jpg"
 },

odoo3: {
    category: "gallery3",
    title: {
        tr: "Halk Oyunları Etkinliği",
        en: "Folk Games Activity"
    },
    shortDesc: {
        tr: "Halk oyunları ile etkinlik yapıldı.",
        en: "An activity was held with folk games."
    },
    longDesc: {
        tr: "Öğrenciler geleneksel halk oyunları ile tanıştı ve bu oyunlar üzerinden kültürel bilinç kazandı.",
        en: "Students were introduced to traditional folk games and gained cultural awareness through these activities."
    },
    images: [
        "assets/images/odoo3-1.jpg"
    ],
    coverImage: "assets/images/odoo3-1.jpg"
},
};
