
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
},

    images: [
      "assets/images/etkinlik2.1.png",
      "assets/images/etkinlik2.2.png",
      "assets/images/etkinlik2.3.png",
        "assets/images/etkinlik2.4.png",
        "assets/images/etkinlik2.5.png",
    ],

    coverImage: "assets/images/etkinlik2.5.png"
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
    tr: "Halime Cemre Keleş, Selenay Deniz, Gülten Çapar, Gizem Düldül, Furkan Saygılı ve Dilan Oktay tarafından Hayate Hanım İlkokulu - Alanya Belediyesi Trafik Eğitim Merkezi’nde Trafik ve İlk Yardım Haftası kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities organized by Halime Cemre Keleş, Selenay Deniz, Gülten Çapar, Gizem Düldül, Furkan Saygılı, and Dilan Oktay at Hayate Hanım Primary School - Alanya Municipality Traffic Education Center within the scope of Traffic and First Aid Week."
},

    longDesc: {
    tr:
        "Eğitimde Program Dışı Etkinlikler dersi kapsamında grup olarak Halime Cemre Keleş, Selenay Deniz, Gülten Çapar, Gizem Düldül, Furkan Saygılı ve Dilan Oktay ile birlikte Hayate Hanım İlkokulu bünyesinde çeşitli etkinlikler gerçekleştirdik. Bu süreçte Aslan Uslu öğretmenimizin 4. sınıf öğrencileriyle birlikte çalışarak etkinlikleri uygulama fırsatı bulduk. Öğrenciler etkinliklere gönüllü olarak katılmış, süreç boyunca oldukça istekli, aktif ve ilgili bir şekilde yer almışlardır. " +

        "Trafik güvenliği etkinliği kapsamında okul seçiminde büyük bir sorun yaşamadık. Okulun fiziksel ortamı, öğrenci profili ve etkinlik için uygun alanlara sahip olması süreci kolaylaştırdı. Okul yönetimi gerekli izinler ve planlamalar konusunda destek sağladı. Öğretmenler ve idareciler iş birliği içinde çalışarak etkinliğin daha düzenli ve verimli ilerlemesine katkıda bulundu. " +

        "Etkinliği seçmemizdeki en önemli motivasyon, öğrencilerin günlük yaşamda karşılaştıkları trafik kuralları konusunda bilinç kazanmalarını sağlamaktı. Küçük yaşta trafik farkındalığı oluşturmanın ileriki yaşamlarında daha dikkatli ve sorumlu bireyler yetişmesine katkı sağlayacağını düşündük. Drama, oyunlaştırma ve uygulamalı öğrenme yöntemlerinin kullanılması da etkinliği tercih etmemizde etkili oldu. " +

        "Etkinlik sürecinde drama hazırlıkları, rol dağılımları, sunumlar, gezi organizasyonu, emniyet kemeri simülatörü etkinliği ve öğrenci yönlendirmeleri gibi görevler üstlendik. Trafik ışığı oyunu, trafik levhalarının incelenmesi, drama çalışmaları ve Trafik Eğitim Parkı gezisi ile öğrencilerin öğrenmeleri desteklendi. " +

        "Öğrencilerin bilişsel ve duyuşsal motivasyonlarının oldukça yüksek olduğu gözlemlendi. Drama ve oyunlaştırılmış etkinlikler öğrencilerin dikkatini çekti ve aktif katılımı artırdı. Trafik polisi, sürücü ve yaya rolleri öğrencilerin empati kurmasına ve kuralların önemini anlamasına yardımcı oldu. " +

        "Motivasyonu artırmak için oyunlaştırma teknikleri, görsel materyaller, trafik dedektifi rozetleri, slogan çalışmaları ve soru-cevap etkinlikleri kullanıldı. Öğrencilerin etkinliklere aktif katılımı sürekli desteklendi. " +

        "Trafik Eğitim Parkı’nın fiziksel ve kurumsal ortamı etkinlik için uygun olup, gerekli materyal ve planlama desteği sağlandı. Güvenli ve destekleyici ortam sayesinde öğrenciler sürece aktif şekilde katılım gösterdi. " +

        "Etkinliğin amaçlarına büyük ölçüde ulaşıldığı düşünülmektedir. Öğrencilerin trafik kurallarına yönelik bilgi düzeylerinde artış olduğu, özellikle yaya geçidi kullanımı, emniyet kemeri ve trafik ışıkları konularında bilinç geliştirdikleri gözlemlendi. Ayrıca iş birliği, iletişim ve sorumluluk alma becerilerinde gelişim görüldü. " +

        "Etkinlik tekrar edilecek olursa zamanlama daha iyi planlanabilir, drama çalışmalarına daha fazla süre ayrılabilir ve bireysel katılımı artıracak uygulamalar eklenebilir. Gezi süresinin uzatılması da uygulamalı öğrenmeyi güçlendirebilir. " +

        "Öğrenciler etkinliklerin eğlenceli geçtiğini ifade etmiş, özellikle drama ve trafik parkı gezisinden etkilendiklerini belirtmişlerdir. Bazı öğrenciler trafik kurallarına günlük yaşamlarında daha fazla dikkat edeceklerini söylemiştir. " +

        "Bu süreç, öğrencilerin yaparak ve yaşayarak öğrenme ile bilgiyi daha kalıcı edindiğini göstermiştir. Aynı zamanda etkinlik planlama, sınıf yönetimi ve iletişim becerilerinin gelişmesine katkı sağlamıştır. " +

        "Zaman yönetimi konusunda geliştirilmesi gereken noktalar olduğu, özellikle uygulamalı etkinliklerde sürenin daha dengeli planlanması gerektiği fark edilmiştir. " +

        "Genel olarak etkinlik sürecinin başarılı olduğu, öğrencilerin aktif katılım gösterdiği ve trafik güvenliği konusunda farkındalık kazandıkları sonucuna ulaşılmıştır.",

    en:
        "Within the scope of the Educational Out-of-Class Activities course, our group consisting of Halime Cemre Keleş, Selenay Deniz, Gülten Çapar, Gizem Düldül, Furkan Saygılı and Dilan Oktay carried out various activities at Hayate Hanım Primary School. During this process, we had the opportunity to implement the activities by working with 4th grade students under the guidance of our teacher Aslan Uslu. Students participated voluntarily and were highly motivated, active, and engaged throughout the process. " +

        "We did not encounter any significant problems during the school selection process for the traffic safety activity. The school’s physical environment, student profile, and suitable activity areas facilitated the process. The school administration supported us with necessary permissions and planning. Teachers and administrators worked collaboratively, ensuring a more organized and efficient implementation. " +

        "The main motivation for choosing this activity was to raise students’ awareness of traffic rules they encounter in daily life. We believed that early awareness of traffic safety would contribute to raising more responsible individuals in later life. The use of drama, gamification, and hands-on learning methods also played an important role in our choice. " +

        "During the process, we took part in drama preparation, role distribution, presentations, trip organization, seatbelt simulator activity, and student guidance tasks. Activities such as traffic light games, traffic sign analysis, drama exercises, and the Traffic Education Park visit supported students’ learning. " +

        "Students’ cognitive and affective motivation was observed to be very high. Drama and gamified activities attracted students’ attention and increased active participation. Role-playing as police officers, drivers, and pedestrians helped students develop empathy and understand the importance of rules. " +

        "To increase motivation, we used gamification techniques, visual materials, traffic detective badges, slogan activities, and question-answer sessions. Students were continuously encouraged to participate actively. " +

        "The Traffic Education Park provided a suitable physical and institutional environment, with necessary materials and planning support. Thanks to the safe and supportive environment, students actively participated in the activities. " +

        "The objectives of the activity were largely achieved. Students showed improvement in their knowledge of traffic rules, especially regarding pedestrian crossings, seatbelt use, and traffic lights. In addition, improvements were observed in cooperation, communication, and responsibility-taking skills. " +

        "If the activity were to be repeated, better time management could be implemented, more time could be allocated to drama activities, and additional individual participation tasks could be included. Extending the visit duration could also enhance experiential learning. " +

        "Students reported that the activities were enjoyable and were especially impressed by the drama and Traffic Park visit. Some students stated that they would pay more attention to traffic rules in their daily lives. " +

        "This experience showed that students learn more permanently through learning by doing and experiencing. It also contributed to the development of skills in activity planning, classroom management, and communication. " +

        "It was observed that time management needs improvement, especially in balancing time during practical activities. " +

        "Overall, the activity process was successful, students participated actively, and they gained awareness of traffic safety."
},

    images: [
        "assets/images/etkinlik7.1.png",
        "assets/images/etkinlik7.2.png",
        "assets/images/etkinlik7.3.png",
        "assets/images/etkinlik7.4.png",
        "assets/images/etkinlik7.5.png",
        "assets/images/etkinlik7.6.png",
        "assets/images/etkinlik7.7.png",
    ],      

    coverImage: "assets/images/etkinlik7.1.png"
  }, 


      etkinlik8: {
    id: "etkinlik8",
    category: "gallery1",

    title: {
        tr: "İstiklal Marşı'nın Kabulü ve Mehmet Akif Ersoy'u Anma Günü",
        en: "National Anthem Acceptance and Mehmet Akif Ersoy Commemoration Day"
    },  

   shortDesc: {
    tr: "Melisa Karataş, Lokman Ernez ve Kenan Bozkurt tarafından Kemal Şuberi İlkokulu’nda 12 Mart İstiklal Marşı’nın Kabulü ve Mehmet Akif Ersoy’u Anma Günü ile 18 Mart Çanakkale Zaferi ve Şehitleri Anma Günü kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities organized by Melisa Karataş, Lokman Ernez, and Kenan Bozkurt at Kemal Şuberi Primary School within the scope of March 12 Independence March Adoption and Mehmet Akif Ersoy Commemoration Day and March 18 Çanakkale Victory and Martyrs' Commemoration Day."
    },  
    longDesc: {
        tr: "Bu etkinlikte öğrenciler İstiklal Marşı'nın tarihini öğrendi, Mehmet Akif Ersoy'un hayatını inceledi ve şiir dinletisi gerçekleştirdi.",
        en: "In this event, students learned about the history of the National Anthem, explored the life of Mehmet Akif Ersoy, and held a poetry recital."
    },
    images: [
        "assets/images/etkinlik8.1.png",
        "assets/images/etkinlik8.2.png",
        "assets/images/etkinlik8.3.png",
        "assets/images/etkinlik8.4.png",
        "assets/images/etkinlik8.5.png",
        "assets/images/etkinlik8.6.png",
    ],  
    coverImage: "assets/images/etkinlik8.1.png"
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
    ],  
    coverImage: "assets/images/bayram2.3.png"
  },

bayram3: {
    category: "gallery2",
    title: {
        tr: "23 Nisan", 
        en: "April 23rd"
    },  
    shortDesc: {
    tr: "Melisa Karataş, Lokman Ernez ve Kenan Bozkurt tarafından Kemal Şuberi İlkokulu’nda 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities organized by Melisa Karataş, Lokman Ernez, and Kenan Bozkurt at Kemal Şuberi Primary School within the scope of April 23rd National Sovereignty and Children's Day."
},
    longDesc: {
        tr: "Okul etkinlikleri ile kutlandı.",
        en: "Celebrated with school activities."
    },
    images: [
        "assets/images/bayram3.1.png",
        
    ],  
    coverImage: "assets/images/bayram3.1.png"
  },

bayram4: {
    category: "gallery2",
    title: {
        tr: "23 Nisan", 
        en: "April 23rd"
    },  
 shortDesc: {
    tr: "Halime Cemre Keleş, Selenay Deniz, Gülten Çapar, Gizem Düldül, Furkan Saygılı ve Dilan Oktay tarafından Hayate Hanım İlkokulu’nda 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities organized by Halime Cemre Keleş, Selenay Deniz, Gülten Çapar, Gizem Düldül, Furkan Saygılı, and Dilan Oktay at Hayate Hanım Primary School within the scope of April 23rd National Sovereignty and Children's Day."
},
longDesc: {
    tr:
        "Gerçekleştirdiğimiz 23 Nisan etkinliği kapsamında okul seçimi sürecinde önemli bir sorun yaşamadık. Etkinliği uygulayacağımız sınıf ortamı öğrencilerin rahat hareket edebileceği ve etkinlikleri kolaylıkla yapabileceği bir yapıya sahipti. Okul yönetimi de süreç boyunca bize destek oldu. Sınıfın hazırlanması, gerekli materyallerin sağlanması ve etkinlik planlaması konusunda yardımcı oldular. Öğretmenlerin iş birliği içerisinde olması da etkinliğin daha düzenli ilerlemesini sağladı. " +

        "Bu etkinliği seçmemizdeki en önemli nedenlerden biri, öğrencilerin 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı’nın anlam ve önemini eğlenerek öğrenmelerini istememizdi. Çocukların hem milli bayram bilinci kazanmalarını hem de arkadaşlarıyla birlikte keyifli vakit geçirmelerini amaçladık. Ayrıca etkinliklerin oyun, drama, ritim çalışmaları ve halk oyunları gibi öğrencilerin aktif katılım gösterebileceği uygulamalardan oluşması bizi bu etkinliği seçmeye motive etti. " +

        "Etkinlik sürecinde sınıf süsleme çalışmaları, ritim oyunu, eğlence kesesi etkinliği, sessiz sinema oyunu ve halk oyunu etkinliklerinde görev aldık. Öncelikle sınıfı 23 Nisan ruhuna uygun şekilde bayraklar ve balonlarla süsledik. Daha sonra ritim etkinlikleriyle öğrencilerin dikkat ve dinleme becerilerini destekledik. Eğlence kesesi etkinliğinde öğrencilerin kendilerini özgürce ifade etmelerine fırsat verdik. Sessiz sinema oyununda öğrenciler beden diliyle anlatım yaptı, halk oyunu etkinliğinde ise kültürel değerlerimizi eğlenceli bir şekilde öğrencilere aktarmaya çalıştık. Etkinlik sonunda öğrenciler küçük bir gösteri yaparak öğrendiklerini sergilediler. " +

        "Öğrencilerin etkinliklere karşı bilişsel ve duyuşsal motivasyonlarının oldukça yüksek olduğunu gözlemledik. Özellikle oyun temelli etkinlikler öğrencilerin dikkatini çekti ve derse aktif katılım göstermelerini sağladı. Öğrenciler etkinlik boyunca heyecanlı, mutlu ve öğrenmeye istekliydi. Grup çalışmalarında birlikte hareket etmeleri onların sosyal iletişimlerini güçlendirdi ve özgüven kazanmalarına katkı sağladı. " +

        "Öğrenci motivasyonunu artırmak için sınıf ortamını görsel olarak düzenledik, müzik kullandık ve etkinlikleri eğlenceli hale getirmeye çalıştık. Her öğrencinin etkinlik sürecinde aktif rol almasına dikkat ettik. Ayrıca öğrencilerin duygu ve düşüncelerini rahatça ifade edebilmeleri için soru-cevap etkinliklerine yer verdik ve süreç boyunca onları destekledik. " +

        "Okul atmosferi etkinlik için oldukça uygundu. Okul yönetimi bize materyal desteği sağladı ve etkinlik sürecinin planlanmasında yardımcı oldu. Sınıf ortamının uygun olması öğrencilerin etkinliklere rahat katılmasını sağladı. Öğretmenlerin öğrencilere rehberlik etmesi ve olumlu iletişim kurması da süreci olumlu etkiledi. " +

        "Etkinliğin amaçlarına büyük ölçüde ulaştığını düşünüyoruz. Öğrenciler 23 Nisan’ın anlam ve önemini daha iyi kavradılar ve milli bayramlara yönelik farkındalık kazandılar. Bunun yanında öğrencilerin iletişim kurma, iş birliği yapma, kendilerini ifade etme ve grup içinde sorumluluk alma becerilerinin geliştiğini gözlemledik. Özellikle halk oyunları ve ritim etkinlikleri öğrencilerin kültürel farkındalıklarını artırdı. " +

        "Aynı etkinliği tekrar yapacak olsaydık, öğrencilere bireysel katılım sağlayabilecek daha fazla etkinlik planlayabilirdik. Özellikle halk oyunları ve ritim etkinliklerine daha fazla süre ayırmanın öğrenciler açısından daha verimli olacağını düşünüyoruz. Bunun yanında farklı görsel materyaller ve küçük yarışmalar eklenerek öğrencilerin ilgisi daha da artırılabilirdi. " +

        "Etkinlik sürecinde ve sonrasında öğrencilerden oldukça olumlu dönütler aldık. Öğrenciler özellikle sessiz sinema oyunu, eğlence kesesi etkinliği ve halk oyunlarını çok sevdiklerini söylediler. Etkinliklerin eğlenceli geçtiğini ifade etmeleri onların derse karşı olumlu tutum geliştirdiklerini gösterdi. Bazı öğrencilerin etkinlik sonrasında öğrendikleri halk oyunu figürlerini tekrar etmek istemeleri de öğrenmenin kalıcı olduğunu gösterdi. " +

        "Bu deneyim bize öğrencilerin eğlenerek öğrendiklerinde derse karşı daha motive olduklarını ve öğrenmelerinin daha kalıcı hale geldiğini gösterdi. Aynı zamanda etkinlik planlama, grup yönetimi ve öğrencilerle etkili iletişim kurma konusunda önemli deneyimler kazandık. Öğrencilerin aktif katılımının öğrenme sürecini olumlu etkilediğini daha iyi fark ettik. " +

        "Kendimizde geliştirmemiz gerektiğini düşündüğümüz yönlerden biri zaman yönetimi oldu. Bazı etkinliklerde öğrencilerin ilgisi çok yüksek olduğu için süre planlamasında küçük aksaklıklar yaşadık. Ayrıca daha fazla öğrenciye bireysel söz hakkı verilmesinin süreci daha etkili hale getirebileceğini düşündük. " +

        "Bu etkinliklerin öğrencilerin iletişim becerilerini, özgüvenlerini, iş birliği yapma becerilerini, ritim duygularını ve kendilerini ifade etme yönlerini ön plana çıkardığını düşünüyoruz. Özellikle grup etkinliklerinde öğrencilerin birbirlerine destek olmaları sosyal gelişimleri açısından olumlu sonuçlar ortaya çıkardı. Drama, oyun ve halk oyunları etkinlikleri öğrencilerin hem eğlenmelerini hem de kültürel değerleri öğrenmelerini sağladı. " +

        "Genel olarak değerlendirdiğimizde etkinlik sürecinde başarılı olduğumuzu düşünüyoruz. Öğrencilerin etkinliklere aktif katılım göstermesi, etkinliklerden keyif almaları ve süreç sonunda olumlu geri bildirimlerde bulunmaları etkinliğin amacına ulaştığını gösterdi. Eğlenceli, öğretici ve öğrenci merkezli bir öğrenme ortamı oluşturabilmiş olmamız etkinliğin en başarılı yönlerinden biri oldu. " +

        "Ayrıca etkinlik sonunda öğrencilerin öğrendiklerini günlük yaşamla ilişkilendirebildikleri ve kendilerini daha rahat ifade ettikleri görüldü. Bu durum etkinliklerin amacına ulaştığını ve sürecin verimli geçtiğini göstermektedir.",

    en:
        "We did not encounter any significant problems during the school selection process for the April 23rd activities we carried out. The classroom environment where we implemented the activities was suitable for students to move comfortably and easily participate in activities. The school administration also supported us throughout the process. They assisted with classroom preparation, provision of materials, and activity planning. The cooperation among teachers ensured a more organized implementation process. " +

        "One of the main reasons for choosing this activity was our aim to help students learn the meaning and importance of April 23rd National Sovereignty and Children's Day in an enjoyable way. We aimed for students to gain national holiday awareness and spend enjoyable time with their friends. Additionally, the fact that the activities included games, drama, rhythm work, and folk dances motivated us to choose this program. " +

        "During the process, we took part in classroom decoration activities, rhythm games, activity bag games, silent cinema, and folk dance activities. First, we decorated the classroom with flags and balloons suitable for the spirit of April 23rd. Then we supported students’ attention and listening skills through rhythm activities. In the activity bag session, we gave students the opportunity to express themselves freely. In the silent cinema game, students used body language for expression, and in the folk dance activity, we aimed to introduce cultural values in an enjoyable way. At the end of the activities, students presented a small performance showcasing what they learned. " +

        "We observed that students’ cognitive and affective motivation towards the activities was very high. Especially game-based activities attracted students’ attention and increased their active participation. Students were excited, happy, and eager to learn throughout the process. Group work improved their social communication and contributed to their self-confidence. " +

        "To increase student motivation, we visually arranged the classroom, used music, and tried to make activities more enjoyable. We ensured that every student had an active role. We also included question-answer activities to help students express their thoughts and feelings comfortably. " +

        "The school atmosphere was highly suitable for the activities. The administration provided material support and assisted in planning the process. The appropriate classroom environment allowed students to participate comfortably. Teachers’ guidance and positive communication also had a positive impact on the process. " +

        "We believe the objectives of the activity were largely achieved. Students gained a better understanding of April 23rd and developed awareness of national holidays. We also observed improvements in communication, cooperation, self-expression, and responsibility-taking skills. Folk dances and rhythm activities especially increased cultural awareness. " +

        "If we were to repeat the same activity, we would plan more activities allowing individual student participation. We also believe allocating more time to folk dance and rhythm activities would be more efficient. Additionally, adding visual materials and small competitions could further increase student engagement. " +

        "We received very positive feedback from students during and after the activities. They especially said they enjoyed silent cinema, activity bag games, and folk dances. Their positive statements showed that they developed a favorable attitude toward learning. Some students even wanted to repeat the folk dance figures they learned, which shows that learning was permanent. " +

        "This experience showed us that students become more motivated and learn more permanently when they enjoy the learning process. We also gained important experience in activity planning, group management, and effective communication with students. We realized that active student participation positively affects learning. " +

        "One area we need to improve is time management. In some activities, small disruptions occurred due to high student interest. We also think giving more individual speaking opportunities would make the process more effective. " +

        "We believe these activities improved students’ communication skills, self-confidence, cooperation abilities, rhythm sense, and self-expression skills. Especially in group activities, students supporting each other led to positive social development outcomes. Drama, games, and folk dance activities allowed students to both enjoy themselves and learn cultural values. " +

        "Overall, we consider the process successful. Students’ active participation, enjoyment, and positive feedback show that the objectives were achieved. Creating an enjoyable, educational, and student-centered learning environment was one of the most successful aspects of the activity. " +

        "Finally, students were able to relate what they learned to daily life and express themselves more comfortably, which shows the effectiveness of the activities."
},
    images: [
        "assets/images/bayram4.1.png",
    ],  
    coverImage: "assets/images/bayram4.1.png"
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