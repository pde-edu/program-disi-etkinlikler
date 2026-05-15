
let currentLang = "tr";
/* =========================
   DİL DEĞİŞTİRME
========================= */
function setLanguage(lang) {

    currentLang = lang;
    localStorage.setItem("selectedLang", lang);

    renderAllGalleries();

    const sections = ["about", "hero", "gallery1", "gallery2", "gallery3"];
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
renderAllGalleries();
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
      <img src="${event.coverImage}">
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

  image.style.cursor = "pointer";

  image.onclick = function () {
    openImageModal(img);
  };

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
      "assets/images/placeholder.jpg",
      "assets/images/placeholder.jpg"
    ],

    coverImage: "https://picsum.photos/300/200"
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
      tr: "Samet Söyler, Enes Polat, Berat Arslan, Mert Çetintaş ve Ziyettin Devrîş tarafından Kızılcaşehir İlkokulu’nda Dünya Sağlık Haftası kapsamında gerçekleştirilen etkinlikler.",
      en: "Activities carried out by Samet Söyler, Enes Polat, Berat Arslan, Mert Çetintaş and Ziyettin Devrîş at Kızılcaşehir Primary School within the scope of World Health Week."
    },

    longDesc: {
  tr: `Dünya Sağlık Haftası kapsamında gerçekleştirdiğimiz etkinlikler bizim açımızdan oldukça
verimli ve öğretici bir süreç olmuştur. Bu süreçte öğrencilerde sağlıklı yaşam, hijyen ve
dengeli beslenme konusunda farkındalık oluşturmayı amaçladık. Gerçekleştirdiğimiz
sunum etkinliği sayesinde öğrencilerin konuya karşı ilgilerinin arttığını ve sağlık bilinci
konusunda önemli kazanımlar elde ettiklerini gözlemledik.
Etkinlik sürecinde düzenlediğimiz süt içme yarışması, yumurta taşıma yarışması, mendil
kapmaca, çuval yarışı ve sandalye kapmaca gibi oyunlar öğrencilerin hem eğlenmesini hem
de sosyal becerilerini geliştirmesini sağlamıştır. Özellikle öğrencilerin oyunlara büyük bir
heyecan ve motivasyonla katılması bizleri oldukça mutlu etmiştir.
Etkinlikler boyunca öğrencilerin takım çalışması, paylaşma, iş birliği ve rekabet
duygularını olumlu şekilde geliştirdikleri gözlemlenmiştir. Süreç sonunda gerçekleştirilen
ödül töreni, madalya ve katılım belgeleri ise öğrencilerin etkinliklere olan ilgisini artırmış
ve onlar için unutulmaz bir anı niteliği taşımıştır.
Genel olarak değerlendirdiğimizde Dünya Sağlık Haftası etkinlikleri hem öğrenciler hem
de bizim için eğitici, eğlenceli ve unutulmaz bir deneyim olmuştur. Bu süreç bize
öğrencilerle etkili iletişim kurmanın ve eğlenerek öğrenmenin ne kadar önemli olduğunu
göstermiştir.`,

  en: `World Health Week activities were a highly productive and educational process for us. In this process, we aimed to raise awareness among students about healthy living, hygiene, and balanced nutrition. Through the presentation activity, we observed that students’ interest in the topic increased and they gained important awareness regarding health literacy.
During the activity process, games such as milk-drinking competition, egg carrying race, handkerchief capture, sack race, and musical chairs helped students both enjoy themselves and improve their social skills. The high excitement and motivation of students during the games made us very happy.
Throughout the activities, it was observed that students developed positive skills in teamwork, sharing, cooperation, and healthy competition. At the end of the process, the award ceremony, medals, and participation certificates increased students’ interest and became an unforgettable memory for them.
Overall, World Health Week activities were an educational, enjoyable, and memorable experience for both students and us. This process showed us how important effective communication with students and learning through enjoyment is.`
}

    images: [
      "assets/images/etkinlik2.1.png",
      "assets/images/etkinlik2.2.png",
      "assets/images/etkinlik2.3.png",
    ],

    coverImage: "assets/images/etkinlik2.1.png"
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
        "assets/images/placeholder.jpg",
        "assets/images/placeholder.jpg"
    ],  

  coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg",
        "assets/images/placeholder.jpg"
    ],

    coverImage: "assets/images/placeholder.jpg"
  }, 
  
    etkinlik5: {
    id: "etkinlik5",
    category: "gallery1",       

    title: {
        tr: "Trafik ve İlk Yardım Haftası",
        en: "Traffic and First Aid Week"
    },  

    shortDesc: {
  tr: `Sema ASLAN, Sıla ÇETİNTAŞ, İsmahan ŞAHİN ve Yusuf Samet BULUT tarafından Trafik ve İlk Yardım Haftası kapsamında gerçekleştirilen bilinçlendirme ve eğitim etkinlikleri.`,

  en: `Awareness and educational activities organized by Sema ASLAN, Sıla ÇETİNTAŞ, İsmahan ŞAHİN, and Yusuf Samet BULUT within the scope of Traffic and First Aid Week.`
},
   longDesc: {
  tr: `Eğitimde Program Dışı Etkinlikler dersi kapsamında, Kestel Akdeniz İlkokulu’nda Trafik ve İlk Yardım Haftası etkinlikleri gerçekleştirdik. Grup üyeleri olarak Yusuf, Sema, Sıla ve İsmahan gönüllü şekilde etkinliklerde görev aldık. Çalışmalarımızı ilkokul 1, 2, 3 ve 4. sınıf öğrencileriyle yürüttük.

Etkinliklerimizi planlarken öğrencilerin hem eğlenerek öğrenmesini hem de günlük yaşamlarında kullanabilecekleri bilgiler edinmesini amaçladık. Trafik kuralları, trafik levhaları ve temel ilk yardım bilgileri üzerine öğrencilerin seviyesine uygun sunumlar hazırladık.

Etkinlik sürecinde öğrencilerle soru-cevap çalışmaları yaptık, örnek durumlar üzerinden açıklamalar gerçekleştirdik ve onların aktif katılım göstermelerini sağladık. Öğrencilerin etkinliklere karşı ilgisi oldukça yüksekti. Özellikle uygulamalı anlatımlar, trafik levhalarını tanıma çalışmaları ve eğlenceli etkinlikler öğrencilerin dikkatini çekti.

Süreç sonunda yaptığımız kısa değerlendirme etkinliklerinde öğrencilerin birçok bilgiyi doğru şekilde öğrendiğini gözlemledik. Etkinlik sonunda öğrencilere sertifikalar dağıtarak onların motivasyonunu artırmaya çalıştık.

Okul yönetimi ve öğretmenler etkinlik sürecinde bizlere destek sağlayarak uygun bir çalışma ortamı oluşturdu. Bu süreç bize ekip çalışmasının, planlamanın ve çocuklarla etkili iletişim kurmanın önemini gösterdi. Aynı zamanda öğrencilerin özgüven, iletişim ve sorumluluk alma becerilerinin gelişimine katkı sağladığını düşündüğümüz verimli bir deneyim oldu.`,

  en: `Within the scope of the Extracurricular Educational Activities course, we organized Traffic and First Aid Week activities at Kestel Akdeniz Primary School. As group members, Yusuf, Sema, Sıla, and İsmahan voluntarily took part in the activities. We carried out our work with 1st, 2nd, 3rd, and 4th grade primary school students.

While planning the activities, we aimed for students to both enjoy learning and gain knowledge they could use in daily life. We prepared presentations suitable for their age levels about traffic rules, traffic signs, and basic first aid knowledge.

During the activities, we conducted question-and-answer sessions with students, explained sample situations, and encouraged active participation. The students showed great interest in the activities. Especially the practical explanations, traffic sign recognition activities, and fun exercises attracted their attention.

At the end of the process, we observed through short evaluation activities that students had learned many concepts correctly. We also distributed certificates to increase their motivation.

The school administration and teachers supported us throughout the process and provided a suitable working environment. This experience showed us the importance of teamwork, planning, and effective communication with children. At the same time, it became a productive experience that we believe contributed to students’ self-confidence, communication, and responsibility skills.`
},   

    images: [
        "assets/images/etkinlik5.2.png",
        "assets/images/etkinlik5.3.png",
        "assets/images/etkinlik5.4.png",
        "assets/images/etkinlik5.5.png",
        "assets/images/etkinlik5.6.png",
    ],      

    coverImage: "assets/images/etkinlik5.1.png"
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
        "assets/images/placeholder.jpg",
        "assets/images/placeholder.jpg"
    ],
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg",
        "assets/images/placeholder.jpg"
    ],      

    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg",
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg",
        "assets/images/placeholder.jpg" 
    ],
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg",
        "assets/images/placeholder.jpg"
    ],
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg",   
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
    },


bayram1: {
    category: "gallery2",
    title: {
      tr: "23 Nisan",
      en: "April 23rd"
    },
shortDesc: {
  tr: `Sema ASLAN, Sıla ÇETİNTAŞ, İsmahan ŞAHİN ve Yusuf Samet BULUT tarafından 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında gerçekleştirilen eğitsel ve sosyal etkinlikler.`,

  en: `Educational and social activities organized by Sema ASLAN, Sıla ÇETİNTAŞ, İsmahan ŞAHİN, and Yusuf Samet BULUT within the scope of April 23 National Sovereignty and Children’s Day celebrations.`
},
    longDesc: {
  tr: `23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında Kestel Akdeniz İlkokulu’nda düzenlenen etkinliklerde aktif görev aldık. Grup üyeleri olarak tören hazırlık sürecinden etkinlik gününe kadar öğrencilerle birlikte çalıştık.

Etkinlik sürecinde özellikle 3. sınıf öğrencilerinin hazırladığı “Colors” gösterisinin prova çalışmalarında görev aldık. Öğrencilerle birebir ilgilenerek koreografilerin hazırlanmasına yardımcı olduk ve onların sahne heyecanlarını azaltmaya çalıştık.

Tören günü Yusuf ve Sıla sunuculuk görevini üstlenirken, Sema ve İsmahan öğrencilerle birlikte sahne performansında yer aldı.

Bayram süreci boyunca öğrencilerin heyecanı ve mutluluğu dikkat çekiciydi. Çocukların özgüven kazanmasına katkı sağlamak ve bayram coşkusunu birlikte yaşamak bizim için oldukça değerli bir deneyim oldu. Etkinlik sonunda öğrencilerin sahnedeki mutluluğu ve aktif katılımı çalışmalarımızın amacına ulaştığını gösterdi.`,

  en: `We actively took part in the activities organized at Kestel Akdeniz Primary School within the scope of the April 23 National Sovereignty and Children’s Day celebrations. As group members, we worked together with students from the preparation stage of the ceremony until the day of the event.

During the process, we especially participated in the rehearsal practices of the “Colors” performance prepared by the 3rd grade students. We worked closely with the students, helped them prepare their choreography, and tried to reduce their stage anxiety.

On the ceremony day, Yusuf and Sıla took on the role of presenters, while Sema and İsmahan participated in the stage performance together with the students.

Throughout the celebration process, the excitement and happiness of the students were remarkable. Contributing to children’s self-confidence and sharing the joy of the holiday together became a very valuable experience for us. At the end of the event, the students’ happiness on stage and their active participation showed that our work had achieved its purpose.`
},
    images: [
      
      "assets/images/bayram1.2.png",
      "assets/images/bayram1.1.png",
      "assets/images/bayram1.3.png",
    ],
    coverImage: "assets/images/bayram1.3.png"
  },
    
bayram2: {
    category: "gallery2",
    title: {
        tr: "23 Nisan",
        en: "April 23rd"
    },  
    shortDesc: {
    tr: "Samet Söyler, Enes Polat, Berat Arslan, Mert Çetintaş ve Ziyettin Devrîş tarafından Kızılcaşehir İlkokulu’nda 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities organized by Samet Söyler, Enes Polat, Berat Arslan, Mert Çetintaş, and Ziyettin Devrîş at Kızılcaşehir Primary School within the scope of April 23rd National Sovereignty and Children's Day."
},
    longDesc: {
    tr:
        "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında gerçekleştirdiğimiz etkinlikler öğrenciler açısından oldukça coşkulu, eğlenceli ve anlamlı bir süreç olmuştur. " +
        "Bu süreçte öğrencilerin milli bayram bilinci kazanmalarını, kendilerini ifade etmelerini ve sosyal etkinliklere aktif katılım sağlamalarını amaçladık. " +
        "Etkinlik hazırlıkları kapsamında öğrencilerle birlikte sınıf süsleme çalışmaları gerçekleştirdik. " +
        "Bu çalışmalar sayesinde öğrenciler iş birliği içerisinde hareket etmiş ve bayram heyecanını hep birlikte yaşamıştır. " +
        "Gösteriler sırasında öğrencilerin şiirler, şarkılar ve çeşitli etkinliklerle kendilerini özgüvenli bir şekilde ifade etmeleri bizleri oldukça mutlu etmiştir. " +
        "Gösterilerin ardından düzenlenen geleneksel çocuk oyunları öğrencilerin etkinliklere daha aktif katılım göstermelerini sağlamıştır. " +
        "Halat çekme, balon patlatmaca, sandalye kapmaca ve diğer oyunlar sayesinde öğrenciler hem eğlenmiş hem de arkadaşlarıyla güzel vakit geçirme fırsatı bulmuştur. " +
        "Genel olarak değerlendirdiğimizde 23 Nisan etkinlikleri öğrencilerin sosyal gelişimlerine katkı sağlayan, birlik ve beraberlik duygusunu güçlendiren çok değerli bir deneyim olmuştur. " +
        "Bizler de bu süreçte çocukların mutluluğuna ortak olmuş ve öğretmenlik mesleğinin sosyal yönünü daha yakından deneyimleme fırsatı bulmuş olduk.",
    en:
        "The activities organized within the scope of April 23rd National Sovereignty and Children's Day were a very exciting, enjoyable, and meaningful process for students. " +
        "In this process, we aimed for students to gain awareness of national holidays, express themselves, and actively participate in social activities. " +
        "During the preparation phase, we carried out classroom decoration activities with students. " +
        "Thanks to these activities, students acted collaboratively and experienced the excitement of the celebration together. " +
        "During the performances, students expressed themselves confidently through poems, songs, and various activities, which made us very happy. " +
        "After the performances, traditional children's games were organized, allowing students to participate more actively. " +
        "Games such as tug of war, balloon popping, and musical chairs allowed students to have fun and spend quality time with their friends. " +
        "Overall, these activities were a valuable experience that contributed to students' social development and strengthened unity and togetherness. " +
        "We also had the opportunity to share the children's happiness and experience the social aspect of teaching more closely."
},
    images: [
        "assets/images/bayram2.1.png",
        "assets/images/bayram2.2.png",
        "assets/images/bayram2.3.png",
        "assets/images/bayram2.4.png",
        "assets/images/bayram2.5.png",
    ],  
    coverImage: "assets/images/bayram2.1.png"
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
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
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
      "assets/images/placeholder.jpg"
    ],
    coverImage: "assets/images/placeholder.jpg"

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
        "assets/images/placeholder.jpg"
    ],  
    coverImage: "assets/images/placeholder.jpg"
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
        "assets/images/placeholder.jpg"
    ],
    coverImage: "assets/images/placeholder.jpg"
},
};


function renderAllGalleries() {

  const groups = {
    tr: {
      gallery1: "gallery1-tr-container",
      gallery2: "gallery2-tr-container",
      gallery3: "gallery3-tr-container"
    },
    en: {
      gallery1: "gallery1-en-container",
      gallery2: "gallery2-en-container",
      gallery3: "gallery3-en-container"
    }
  };

  // 🔹 Önce tüm container'ları temizle (güvenli)
  Object.values(groups.tr).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });

  Object.values(groups.en).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });

  Object.keys(events).forEach(id => {

    const event = events[id];

    const containerId = groups[currentLang][event.category];

    const container = document.getElementById(containerId);

    // 🔴 GÜVENLİK KALKANI (EN ÖNEMLİ SATIR)
    if (!container) {
      console.warn("Container bulunamadı:", containerId);
      return;
    }

    const card = document.createElement("div");
    card.className = "card";

    card.onclick = () => openModal(card, id);

    card.innerHTML = `
      <img src="${event.coverImage}">
      <div class="overlay">
        ${event.title[currentLang]}
      </div>
    `;

    container.appendChild(card);
  });
}

function openImageModal(src) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage"); // FIX

  modalImg.src = src;
  modal.classList.add("show"); // FIX (display değil class kullan)
  modal.style.display = "flex";
}

function closeImageModal() {
  document.getElementById("imageModal").classList.remove("show");}
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.15
});

document.querySelectorAll("section").forEach(section => {
  section.classList.add("fade-up");
  observer.observe(section);
});
document.addEventListener("DOMContentLoaded", () => {

  const loader = document.getElementById("loader");

  // 🔥 GÜVENLİK: loader var mı kontrol et
  if (!loader) return;

  loader.style.opacity = "0";

  setTimeout(() => {
    loader.style.display = "none";
  }, 500);

});

const fadeElements = document.querySelectorAll(".fade-up");

fadeElements.forEach(el => observer.observe(el));