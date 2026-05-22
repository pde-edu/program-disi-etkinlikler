
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
      tr: "Müzeler Haftası,18 Mart Çanakkale Zaferi, Dünya Sağlık Haftası etkinlikleri",
      en: "Museums Week, March 18 Çanakkale Victory, World Health Week activities"
    },

    subtitle: {
      tr: "18-24 Mayıs| 7-13 Nisan | 18 Mart",
      en: "May 18-24 | April 7-13 | March 18"
    },

   shortDesc: {
    tr: "Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç ve Mustafa Kemal Çelik tarafından Alantur Ayhan Şahenk İlkokulu’nda 18 Mart Çanakkale Zaferi, Dünya Sağlık Haftası, 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı ile Müze Haftası kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities organized by Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç, and Mustafa Kemal Çelik at Alantur Ayhan Şahenk Primary School within the scope of March 18 Çanakkale Victory, World Health Week, April 23 National Sovereignty and Children's Day, and Museum Week."
},
longDesc: {
    tr:
        "Etkinliklerin gerçekleştirileceği okulun belirlenmesi ve seçim sürecinde herhangi bir aksaklık ya da olumsuzlukla karşılaşılmamıştır. Okul yönetimi ve öğretmen kadrosu, planlanan faaliyetlere son derece vizyoner ve olumlu bir yaklaşım sergilemiştir. Süreç boyunca organizasyon hazırlıkları, sınıfların aktif kullanımı, gerekli materyallerin temini ve resmi/yasal izinlerin zamanında alınması gibi idari konularda sağlanan güçlü destek, etkinliklerin güvenli ve konforlu bir atmosferde planlanıp hayata geçirilmesine zemin hazırlamıştır. " +

        "Uygulama takviminde yer alan özel gün ve haftaların seçimi, öğrencilerin bütüncül gelişim alanları göz önünde bulundurularak temellendirilmiştir. Bu doğrultuda; 18 Mart Çanakkale Zaferi ile 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı, çocuklarda milli tarih bilincini, vatan sevgisini ve aidiyet duygusunu en üst düzeyde uyandırmak adına ana motivasyon kaynağımız olarak takvime dahil edilmiştir. Okulda geleneksel olarak düzenlenen kermes organizasyonu, 4. sınıf Fen Bilimleri dersi öğrenme çıktılarıyla ilişkilendirilmiştir. “Geleceğin sağlıklı nesilleri bugünün çocukları ile inşa edilir” felsefesiyle Sağlık Haftası süreci kermes uygulamalarıyla birleştirilmiştir. Sınıf duvarlarının ötesine geçerek bir organizasyonun izin, dilekçe, lojistik ve yönetim süreçlerini bizzat deneyimlemek amacıyla Müze Haftası kapsamında açık hava odaklı bir inceleme gezisi plana eklenerek süreç tamamlanmıştır. " +

        "18 Mart Çanakkale Zaferi anma programı kapsamında okul genelinde bir pano ve özel fotoğraf köşesi tasarımı gerçekleştirilmiştir. Fotoğraf köşesinde simgesel olarak yer verilen gelincik çiçeklerinin boyama çalışmaları 2. sınıf öğrencilerine yaptırılarak kademeler arası iş birliği desteklenmiştir. 4. sınıf düzeyindeki öğrencilere ise günün tarihi arka planı hakkında bilgilendirme yapıldıktan sonra bölgede görev yapan jandarma personeline hitaben mektuplar yazdırılmıştır. " +

        "Okulda planlanan programın hemen ardından seçilen 4 öğrenciyle birlikte yerel jandarma karakolu bizzat ziyaret edilerek mektuplar elden teslim edilmiştir. Okula dönüşün ardından dönemin cephe şartlarını ve fedakarlıklarını somutlaştırmak adına tüm öğrencilere dönemin asker menüsü olan hoşaf ve kuru ekmek dağıtımı yapılmış; savaşın zorlukları aktarılmıştır. Bu esnada davetimiz üzerine okula gelen jandarma mensupları sınıfları ziyaret ederek öğrencilerin merak ettiği soruları yanıtlamıştır. " +

        "Dünya Sağlık Haftası kapsamında ilk aşamada öğrencilere; etiket okuma, sağlık okuryazarlığı, yeme bozuklukları ve gıda saklama koşulları üzerine interaktif bir sunum gerçekleştirilmiş ve süreç vızıltı tekniği kullanılarak harmanlanmıştır. İdari durumlar sebebiyle okul kermesinin sunumdan birkaç hafta sonra yapılması üzerine süreç yeni bir etkinlikle güncellenmiştir. Kermeste satışa sunulan her ürünün yanına yerleştirilmek üzere “içindekiler listesi” ve “ürün saklama koşulları” bilgilendirme kartları hazırlanmıştır. " +

        "Kermes gününde öğrencilerden bu bilgiler ışığında kendilerine dengeli bir tabak oluşturmaları istenmiş; hazırlanan tabaklar incelenerek birinci olan öğrenci başarı sertifikası ile ödüllendirilmiştir. Bu süreç sayesinde öğrencilerin sağlıklı beslenme, bilinçli tüketim ve günlük yaşam becerileri konusunda farkındalık kazanmaları amaçlanmıştır.",

    en:
        "No difficulties or negative situations were encountered during the determination and selection process of the school where the activities would be carried out. The school administration and teaching staff displayed a highly visionary and positive approach toward the planned activities. Throughout the process, the strong support provided in administrative matters such as organizational preparations, active use of classrooms, supply of necessary materials, and obtaining official/legal permissions on time created a safe and comfortable environment for planning and implementing the activities. " +

        "The selection of the special days and weeks included in the implementation schedule was based on students’ holistic development areas. In this context, March 18 Çanakkale Victory and April 23 National Sovereignty and Children’s Day were included in the schedule as the main motivation source to raise national historical awareness, patriotism, and a sense of belonging among children. The traditional school fair organization was associated with the 4th grade Science course learning outcomes. With the philosophy that “Healthy future generations are built by today’s children,” the Health Week process was combined with fair activities. In addition, an outdoor observation trip was included within the scope of Museum Week in order to allow students to personally experience organizational procedures such as permissions, petitions, logistics, and management processes beyond classroom walls. " +

        "Within the scope of the March 18 Çanakkale Victory commemoration program, a bulletin board and a special photo corner were designed throughout the school. Coloring activities of symbolic poppy flowers used in the photo corner were carried out by 2nd grade students, encouraging cooperation between grade levels. After informing 4th grade students about the historical background of the day, they were asked to write letters addressed to the gendarmerie personnel serving in the region. " +

        "Immediately after the planned school program, the local gendarmerie station was personally visited with four selected students, and the letters were hand-delivered. Upon returning to school, compote and dry bread, representing the soldiers’ wartime meals, were distributed to all students in order to concretize the harsh conditions and sacrifices of the front lines. During this process, invited gendarmerie personnel visited classrooms and answered students’ questions. " +

        "Within the scope of World Health Week, students first participated in an interactive presentation on label reading, health literacy, eating disorders, and food storage conditions, and the process was enriched through the buzz group technique. Since the school fair had to be organized several weeks after the presentation due to administrative circumstances, the process was updated with a new activity. Informational cards including “ingredient lists” and “product storage conditions” were prepared to be placed next to every product sold at the fair. " +

        "On the day of the fair, students were asked to create a balanced plate based on the information they had learned. The prepared plates were evaluated, and the first-place student was rewarded with a certificate of achievement. Through this process, students were encouraged to gain awareness about healthy nutrition, conscious consumption, and daily life skills."

    },

    images: [
      "assets/images/etkinlik1.1.png",
      "assets/images/etkinlik1.2.png",
       "assets/images/etkinlik1.3.png",
        "assets/images/etkinlik1.4.png",
        "assets/images/etkinlik1.5.png",
        "assets/images/etkinlik1.6.png",
        "assets/images/etkinlik1.7.png",
    ],

    coverImage: "assets/images/etkinlik1.5.png"
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
    tr: "Melisa Karataş, Lokman Ernez ve Kenan Bozkurt tarafından Kemal Şuberi İlkokulu’nda 12 Mart, 18 Mart ve 23 Nisan kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities organized by Melisa Karataş, Lokman Ernez, and Kenan Bozkurt at Kemal Şuberi Primary School within the scope of March 12, March 18, and April 23 commemorative events."
},
longDesc: {
    tr:
        "Eğitimde Program Dışı Etkinlikler dersi kapsamında grubumuz Melisa Karataş, Lokman Ernez ve Kenan Bozkurt’tan oluşmaktadır. Etkinliklerimiz Antalya’nın Alanya ilçesinde bulunan Kemal Şuberi İlkokulu’nda 4. sınıf öğrencileriyle gerçekleştirilmiştir. Program dışı etkinliklerin öğrencilerin yaşam becerilerini keşfetmeleri ve kendilerini tanımaları açısından önemli olduğu düşüncesinden hareketle; 12 Mart, 18 Mart ve 23 Nisan gibi milli gün ve haftalarda gönüllü ve istekli katılım gösteren öğrencilerle çeşitli etkinlikler düzenlenmiştir. " +

        "Etkinlik süreci, okul müdürü, müdür yardımcısı ve görevli öğretmenlerle yapılan verimli görüşmelerle başlamıştır. Okul yönetimi ve öğretmenler etkinliklerin planlanması konusunda destek sağlamış ve okul seçiminde herhangi bir sorun yaşanmamıştır. Etkinliklerin 4. sınıf seviyesine uygun şekilde hazırlanması için sınıf öğretmenlerinden destek alınmıştır. " +

        "Uygulama sürecinde öğrencilerle birlikte 12 Mart kapsamında “Ayyıldızlı Bayrağım” adlı koro çalışması, bayrak hareketleri ve “İstiklal Marşı Oratoryosu” hazırlanmıştır. Öğrencilerin dikkat süreleri dikkate alınarak etkinlik programı sadeleştirilmiş ve yaş seviyelerine uygun hale getirilmiştir. Provalar sırasında okulun farklı alanları kullanılmış, ayrıca günün anlam ve önemini yansıtan panolar hazırlanmıştır. " +

        "12 Mart etkinliklerinin başarılı bulunması üzerine okul öğretmenleri tarafından 18 Mart Çanakkale Zaferi etkinlikleri kapsamında da koro çalışmaları ve pano hazırlıkları yapılması istenmiştir. Bu süreçte “Gazi Diyor Çanakkale Geçilmez” adlı koro çalışması gerçekleştirilmiştir. 23 Nisan etkinliklerinde ise pano hazırlıkları yapılmış ve profesyonel eğiticilerin çalışmaları gözlemlenmiştir. " +

        "Etkinliklerin planlanmasındaki temel amaç öğrencilerde milli bilinç oluşturmak, vatan sevgisini geliştirmek, tarihi farkındalık kazandırmak ve öğrencilerin etkinliklere aktif katılım göstermelerini sağlamaktır. Bu doğrultuda öğrenciler yalnızca izleyici konumunda kalmamış; koro çalışmaları, oratoryolar, bayrak gösterileri ve pano etkinliklerinde aktif görev almışlardır. " +

        "Öğrencilerin etkinliklere karşı bilişsel ve duyuşsal motivasyonlarının oldukça yüksek olduğu gözlemlenmiştir. Özellikle seslendirme çalışmaları, koro etkinlikleri ve sahne uygulamaları öğrencilerin özgüvenlerini geliştirmiştir. Programın öğrencilerin dikkat sürelerine uygun şekilde düzenlenmesi, dikkat çekici görseller ve öğrencilere verilen sorumluluklar motivasyonu artırmıştır. " +

        "Okul atmosferi etkinliklerin uygulanması için oldukça uygun bir ortam sunmuştur. Rehberlik eden öğretmenler ve okul yönetimi prova alanları sağlayarak, yönlendirmelerde bulunarak ve yeni etkinlikler konusunda teşvik ederek sürece önemli katkılar sağlamıştır. " +

        "Yapılan etkinliklerin amaçlarına ulaştığı düşünülmektedir. Öğrencilerin milli ve manevi değerleri içselleştirdikleri, vatan sevgisi ve bağımsızlık bilinci geliştirdikleri gözlemlenmiştir. Ayrıca grup çalışmaları sayesinde iş birliği yapma, sorumluluk alma, duygu ve vurgu kullanarak etkili konuşma becerileri geliştirme gibi yönlerinin desteklendiği görülmüştür. " +

        "Etkinliklerin tekrar planlanması durumunda, öğrencilerin yaş ve dikkat seviyeleri dikkate alınarak sürelerin daha kısa ve öz tutulmasının daha verimli olacağı düşünülmektedir. Ayrıca koro ve oratoryo çalışmalarında kullanılan arka plan seslerinin daha dengeli ayarlanmasının süreci olumlu etkileyebileceği fark edilmiştir. " +

        "Genel olarak değerlendirildiğinde süreç başarılı bulunmuştur. Etkinlikler hem öğretmenlik mesleğinin planlama, uygulama ve değerlendirme aşamalarını deneyimleme fırsatı sunmuş hem de öğrenciler için unutulmaz ve aktif bir öğrenme ortamı oluşturmuştur.",

    en:
        "Within the scope of the Educational Out-of-Class Activities course, our group consisted of Melisa Karataş, Lokman Ernez, and Kenan Bozkurt. Our activities were carried out with 4th grade students at Kemal Şuberi Primary School in Alanya, Antalya. Based on the importance of extracurricular activities in helping students discover life skills and recognize themselves, various meaningful activities were organized during national commemorative days such as March 12, March 18, and April 23 with students who participated voluntarily and enthusiastically. " +

        "The process began with productive meetings with the school principal, vice principal, and teachers. The school administration and teachers supported the planning process, and no difficulties were experienced in school selection. Classroom teachers also provided guidance to ensure that the activities were appropriate for 4th grade students. " +

        "During the implementation process, students participated in a choir performance called “My Crescent-Starred Flag,” flag choreography activities, and the “National Anthem Oratorio” for March 12 commemorations. The program was simplified according to students’ attention spans and adjusted to their age level. Different areas of the school were used for rehearsals, and bulletin boards reflecting the meaning and importance of the day were prepared. " +

        "After the success of the March 12 activities, teachers requested additional choir and bulletin board activities for the March 18 Çanakkale Victory commemorations. During this process, a choir performance titled “Gazi Says Çanakkale Is Impassable” was prepared. For the April 23 activities, bulletin board preparations were carried out and professional instructors’ practices were observed. " +

        "The main purpose of the activities was to develop national awareness, strengthen patriotism, create historical consciousness, and encourage active student participation. Students did not remain passive listeners; instead, they actively took part in choir activities, oratorios, flag performances, and bulletin board preparations. " +

        "Students’ cognitive and emotional motivation toward the activities was observed to be very high. Voice performances, choir studies, and stage practices especially improved students’ self-confidence. Keeping the program suitable for students’ attention spans, using attractive visuals, and assigning responsibilities increased student motivation. " +

        "The school atmosphere provided a highly supportive environment for the implementation of the activities. Teachers and administrators contributed significantly by providing rehearsal spaces, offering guidance, and encouraging new activities. " +

        "It is believed that the activities achieved their objectives. Students internalized national and moral values, developed patriotism and awareness of independence, and strengthened skills such as cooperation, responsibility-taking, and expressive communication through group work. " +

        "If the activities were to be organized again, it is thought that shorter and more concise programs adapted to students’ age and attention levels would be more effective. Additionally, balancing the background sound levels during choir and oratorio performances could improve the process further. " +

        "Overall, the process was considered successful. The activities provided valuable experience in planning, implementation, and evaluation for the teaching profession while also creating an unforgettable and active learning environment for students."
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
    tr: "Helen Yücedağ, Seda Kurtay, Edanur Koluman, Rojin Akman ve Arzu Akkuş tarafından Fatma Özmüftüoğlu İlkokulu’nda Turizm Haftası kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities organized by Helen Yücedağ, Seda Kurtay, Edanur Koluman, Rojin Akman, and Arzu Akkuş at Fatma Özmüftüoğlu Primary School within the scope of Tourism Week."
},

   longDesc: {
    tr:
        "Gerçekleştirilen bu sınıf dışı eğitim etkinliği, okul yönetimi ve sınıf öğretmeninin sürece son derece sıcak bakması, yasal izinler ile ulaşım organizasyonu konularında sağladıkları büyük kolaylıklar sayesinde tamamen sorunsuz bir şekilde hayata geçirilmiştir. Yenilikçi eğitim yaklaşımlarına açık olan okulun idari süreçleri hızla çözmesi ve öğretmenlerin rehberlik desteği, çalışmanın başarısında önemli bir rol oynamıştır. Projenin seçilmesindeki en büyük motivasyon kaynağı ise 3. sınıf Hayat Bilgisi dersinde yer alan “Yakın çevresinde yer alan tarihi, doğal ve turistik yerlerin özelliklerini tanıtır” kazanımını somutlaştırabilme fırsatı olmuştur. Öğrencilerin sarnıçlardaki yankıyı bizzat duyması, herbaryumdaki doğa mirasına tanıklık etmesi ve en önemlisi kilim dokuma atölyesi aracılığıyla kültürü kendi elleriyle üreterek içselleştirmesi fikri, çalışma grubuna büyük bir ilham vermiştir. " +

        "Bu doğrultuda grup üyeleriyle birlikte gezi öncesi saha keşfi yapılmış; “Kaşif Pasaportları”, bilmeceler ve dokuma tezgâhları gibi materyaller ortaklaşa hazırlanmıştır. Gezi esnasında ise istasyon liderliği, akran öğretimi kolaylaştırıcılığı ve kilim dokuma atölyesinde öğrencilere birebir rehberlik etme görevleri başarıyla üstlenilmiştir. Etkinlik boyunca öğrencilerin hem bilişsel hem de duyuşsal motivasyonları en üst seviyede seyretmiştir. Bu motivasyonu canlı tutmak adına çocuklara geleneksel birer öğrenci gibi değil, birer “Tarih Kâşifi” olarak yaklaşılmıştır. Gezi öncesinde bilmecelerle merak duygusu uyandırılmış, ziyaret edilen her mekânda çocukların pasaportlarına onay mührü basılmış ve gruplara ayrılan öğrencilere akran öğretimi sorumluluğu verilmiştir. " +

        "Gelecekte bu etkinlik tekrarlanacak olursa, Herbaryum istasyonunda öğrencilerin bitkileri daha yakından inceleyebilmesi için sürece büyüteç veya basit mikroskopların eklenmesi düşünülmektedir. Ayrıca açık alanda yönerge verme tekniklerinin daha da geliştirilmesi gerektiği bir öz eleştiri ve gelişim alanı olarak not edilmiştir. " +

        "Tüm bu süreç, çalışma grubuna sınıf dışı eğitim ortamlarında kalabalık bir grubu yönetme, zamanı etkili kullanma ve dış mekânın dikkat dağıtıcı unsurlarına karşı kriz yönetimi becerilerini kazandırmıştır. Etkinlik ise çocukların merak duygularını, akran öğretimi sayesinde iş birliği becerilerini ve kilim dokuma yoluyla ince motor becerilerini ön plana çıkarmıştır. Öğrencilerden süreç boyunca ve sonrasında son derece heyecanlı ve anlamlı dönütler alınmıştır. Çocukların; eskiden su bulmanın ne kadar zor olduğunu fark ettiklerini söylemeleri, kendi dokudukları kilimleri odalarına asacaklarını belirtmeleri ve tarih dedektifi olmanın eğlencesinden bahsetmeleri, gezi sonrasındaki yaratıcı yazma formlarında tarihe dair kurdukları empatiyle birleşerek etkinliğin amacına ulaştığını net bir şekilde ortaya koymuştur. " +

        "Sonuç olarak tüm öğrencilerin pasaportlarını eksiksiz doldurması, her birinin farklı renklerde ama ortak bir hikâyeyi anlatan kilim parçaları dokuması ve gün sonunda tarihi koruma bilincini kendi cümleleriyle ifade edebilmeleri, projenin kesin bir başarıya ulaştığını göstermektedir. Bu çalışma ile sadece bir gezi yapılmamış; çocukların zihninde Alanya’nın tarihine dair kalıcı ve derin bir anı inşa edilmiştir.",

    en:
        "This out-of-class educational activity was carried out completely smoothly thanks to the highly supportive attitude of the school administration and classroom teacher, as well as the great convenience they provided regarding legal permissions and transportation organization. The school’s openness to innovative educational approaches, the rapid handling of administrative processes, and the guidance provided by teachers played an important role in the success of the study. The greatest source of motivation for selecting this project was the opportunity to concretize the 3rd grade Life Science learning outcome: “Recognizes the characteristics of historical, natural, and touristic places in the nearby environment.” The idea of students personally hearing the echoes in the cisterns, witnessing the natural heritage in the herbarium, and most importantly internalizing culture by producing it with their own hands through the carpet weaving workshop inspired the study group greatly. " +

        "In this direction, a field exploration was conducted before the trip together with the group members, and materials such as “Explorer Passports,” riddles, and weaving looms were collaboratively prepared. During the trip, responsibilities such as station leadership, peer teaching facilitation, and one-on-one guidance for students in the carpet weaving workshop were successfully undertaken. Throughout the activity, students’ cognitive and emotional motivation remained at the highest level. In order to maintain this motivation, children were approached not as traditional students but as “History Explorers.” Curiosity was stimulated through riddles before the trip, students’ passports were stamped at every visited location, and students divided into groups were given peer teaching responsibilities. " +

        "If this activity is repeated in the future, adding magnifying glasses or simple microscopes to the herbarium station is being considered so that students can examine plants more closely. In addition, improving instruction-giving techniques in outdoor environments was noted as an area for self-evaluation and development. " +

        "This entire process provided the study group with skills such as managing large groups in out-of-class educational settings, using time effectively, and handling distractions in outdoor environments through crisis management. The activity also highlighted children’s curiosity, cooperation skills through peer teaching, and fine motor skills through carpet weaving. Extremely enthusiastic and meaningful feedback was received from students during and after the process. Students stated that they realized how difficult it was to find water in the past, mentioned that they would hang the carpets they had woven in their rooms, and talked about the enjoyment of being a history detective. Combined with the empathy they demonstrated in their creative writing forms after the trip, these responses clearly showed that the activity achieved its purpose. " +

        "As a result, the fact that all students completed their passports fully, each student wove carpet pieces in different colors but telling a common story, and they were able to express awareness about protecting history in their own words at the end of the day demonstrated that the project achieved definite success. Through this study, not only was a trip organized, but also a lasting and deep memory about the history of Alanya was built in the minds of the children."
},
    images: [
        "assets/images/etkinlik10.1.png",
        "assets/images/etkinlik10.2.png",
        "assets/images/etkinlik10.3.png",
        "assets/images/etkinlik10.4.png",
        "assets/images/etkinlik10.5.png",
    ],
    coverImage: "assets/images/etkinlik10.1.png"
    },

    etkinlik11: {
    id: "etkinlik11",
    category: "gallery1",   

    title: {
        tr: "Dünya Sağlık Günü",
        en: "World Health Day"
    },  
    shortDesc: {
    tr: "İclal GENÇ, Rumeysa ŞEN ve Behican KARAL tarafından Atatürk İlkokulu’nda Dünya Sağlık Haftası kapsamında gerçekleştirilen etkinlikler.",
    
    en: "Activities organized by İclal GENÇ, Rumeysa ŞEN, and Behican KARAL at Atatürk Primary School within the scope of World Health Week."
},  
    longDesc: {
    tr:
        "Okul seçiminde, okul yönetiminin ve öğretmenlerin iş birliğine açık, destekleyici tutumlarını ve okulun ulaşılabilir konumunu önceliklendirdik. İki güne yayılan ve toplam 4 ders saatinden oluşan uygulamalı eğitim sürecimiz planlı ve verimli bir şekilde gerçekleştirilmiştir. " +

        "1. Gün: Hemşire Hilal ERDANA tarafından “Hijyen Eğitimi”, öğretmen adayı İclal GENÇ tarafından ise “Ağız ve Diş Sağlığı Eğitimi” verilmiştir. Öğrenciler hijyen kuralları, kişisel bakım ve ağız-diş sağlığının önemi hakkında bilgilendirilmiş; süreç boyunca soru-cevap etkinlikleriyle aktif katılım göstermişlerdir. " +

        "2. Gün: İclal GENÇ tarafından gerçekleştirilen “Beslenme Eğitimi”nin ardından öğrencilerle birlikte hazırlanan sağlıklı kahvaltı tabakları eşliğinde interaktif bir öğün etkinliği gerçekleştirilmiştir. Programın son bölümünde ise Fizyoterapist Mukaddes TEKİN, teorik egzersiz dersinin ardından okul bahçesinde uygulamalı fiziksel aktiviteler yaptırmıştır. Böylece öğrenciler sağlıklı yaşam alışkanlıklarını uygulamalı şekilde deneyimleme fırsatı bulmuşlardır. " +

        "Etkinlik süresince okul yönetimi ve sınıf öğretmeni, sınıf yönetimini ve içerik kontrolünü tamamen grubumuza bırakarak bizlere duydukları güveni ve desteklerini göstermişlerdir. Öğrencilerin bilişsel ve duyuşsal motivasyonlarının oldukça yüksek olduğu gözlemlenmiştir. Temizlik, spor ve beslenme konularına olan ilgileri sayesinde dersler soru-cevap etkinlikleri ve kişisel deneyim paylaşımlarıyla oldukça aktif ve verimli geçmiştir. " +

        "Uygulamalı eğitimler ve bahçe etkinlikleri sayesinde öğrencilerde sağlık bilincinin pekiştiği ve tüm öğrencilerin sürece aktif katılım sağladığı gözlemlenmiştir. Bu deneyim bizlere, dışarıdan gelen uzman desteğinin (hemşire, fizyoterapist vb.) öğrencilerin ilgisini çekmede ne kadar etkili olduğunu ve teorik bilginin uygulama ile birleştiğinde kalıcı öğrenme sağladığını göstermiştir. Genel olarak değerlendirildiğinde etkinliğin amaçlarına ulaştığı ve hem mesleki gelişimimiz hem de öğrencilerin farkındalık kazanması açısından başarılı bir süreç olduğu düşünülmektedir.",

    en:
        "In selecting the school, we prioritized the supportive and cooperative attitudes of the school administration and teachers, as well as the school’s accessible location. Our practice-based educational process, which lasted for two days and covered a total of four class hours, was carried out in a planned and productive manner. " +

        "Day 1: Nurse Hilal ERDANA provided “Hygiene Education,” while teacher candidate İclal GENÇ delivered “Oral and Dental Health Education.” Students were informed about hygiene rules, personal care, and the importance of oral and dental health, and they actively participated through question-and-answer activities throughout the process. " +

        "Day 2: Following the “Nutrition Education” conducted by İclal GENÇ, an interactive meal activity was organized with healthy breakfast plates prepared together with the students. In the final part of the program, Physiotherapist Mukaddes TEKİN conducted practical physical activities in the school garden after a theoretical exercise lesson. Thus, students had the opportunity to experience healthy lifestyle habits through hands-on activities. " +

        "Throughout the activity, the school administration and classroom teacher demonstrated their trust and support by leaving classroom management and content control entirely to our group. It was observed that students’ cognitive and emotional motivation levels were quite high. Due to their interest in hygiene, sports, and nutrition, the lessons became highly interactive and productive through question-and-answer activities and personal experience sharing. " +

        "Thanks to the practical lessons and outdoor activities, it was observed that students’ awareness of health was reinforced and that all students actively participated in the process. This experience showed us how effective the support of external experts such as nurses and physiotherapists can be in attracting students’ attention and how theoretical knowledge becomes permanent when combined with practice. Overall, it is believed that the activity achieved its goals and became a successful process both for our professional development and for increasing students’ awareness."
},
    images: [
        "assets/images/etkinlik11.1.png",   
        "assets/images/etkinlik11.2.png",
        "assets/images/etkinlik11.3.png",
        "assets/images/etkinlik11.4.png",
        "assets/images/etkinlik11.5.png",
    ],  
    coverImage: "assets/images/etkinlik11.1.png"
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
    tr:
        "Eğitimde Program Dışı Etkinlikler dersi kapsamında Melisa Karataş, Lokman Ernez ve Kenan Bozkurt’tan oluşan grup olarak 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı etkinlik sürecine katılım sağladık. Etkinliklerin planlanması ve yürütülmesi sürecinde gözlemci olarak rol aldık ve süreç boyunca yapılan çalışmaları yakından inceleme fırsatı bulduk. Ayrıca etkinlik kapsamında öğrencilerin milli bayram bilinci kazanmalarını desteklemek amacıyla pano hazırlama çalışmalarında görev aldık. Hazırlanan panoların öğrencilerin dikkatini çekmesi, bayramın anlam ve önemini yansıtması ve okul ortamına görsel katkı sağlaması amaçlandı. Süreç boyunca öğretmenlerin etkinlik planlama yöntemlerini, öğrencilerle iletişim biçimlerini ve etkinlik yönetim süreçlerini gözlemleme fırsatı elde ettik. Bu deneyim sayesinde program dışı etkinliklerin öğrencilerin sosyal gelişimleri, özgüvenleri ve milli değerleri öğrenmeleri üzerindeki olumlu etkilerini daha yakından görmüş olduk.",

    en:
        "Within the scope of the Educational Out-of-Class Activities course, our group consisting of Melisa Karataş, Lokman Ernez, and Kenan Bozkurt participated in the April 23 National Sovereignty and Children’s Day activities. During the planning and implementation process, we took part as observers and had the opportunity to closely examine the activities carried out throughout the process. In addition, we contributed to the preparation of bulletin boards aimed at helping students develop awareness of national holidays. The prepared boards were designed to attract students’ attention, reflect the meaning and importance of the holiday, and contribute visually to the school environment. Throughout the process, we observed teachers’ activity planning methods, communication with students, and activity management practices. This experience allowed us to better understand the positive effects of extracurricular activities on students’ social development, self-confidence, and understanding of national values."
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
    tr: "Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç ve Mustafa Kemal Çelik tarafından Alantur Ayhan Şahenk İlkokulu’nda 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities organized by Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç, and Mustafa Kemal Çelik at Alantur Ayhan Şahenk Primary School within the scope of April 23 National Sovereignty and Children's Day."
    },
    longDesc: {
    tr:
        "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı sürecinde doğrudan müdahil olunabilecek etkinlik alanı sınırlı kalsa da okul iklimine ve bayram coşkusuna aktif destek verilmiştir. Bu kapsamda öğrencilerin milli bayram atmosferini daha yoğun hissedebilmeleri amacıyla tematik pano ve fotoğraf köşeleri tasarlanmıştır. Hazırlanan görsellerde bayramın anlam ve önemini yansıtan öğelere yer verilmiş, okul ortamının görsel açıdan zenginleştirilmesi hedeflenmiştir. " +

        "Etkinlik sürecinde sınıflar öğrencilerle birlikte süslenmiş, öğrencilerin sürece aktif katılım göstermeleri desteklenmiştir. Bayraklar, balonlar ve çeşitli dekoratif materyaller kullanılarak sınıf ortamları 23 Nisan ruhuna uygun hale getirilmiştir. Öğrencilerin hazırlık sürecinde görev almaları sayesinde iş birliği yapma, sorumluluk alma ve ortak çalışma becerilerinin gelişimine katkı sağlanmıştır. " +

        "Ayrıca öğrencilerin resmi tören provalarına yakından eşlik edilmiş ve hazırlık süreci gözlemlenmiştir. Provalar sırasında öğrencilerin heyecanlı, istekli ve motive oldukları görülmüş; milli bayram bilincini yaşayarak öğrenmelerine katkı sağlayan bir süreç deneyimlenmiştir. Genel olarak değerlendirildiğinde, etkinlik sürecinin öğrencilerin sosyal gelişimlerine, aidiyet duygularına ve milli değerlere yönelik farkındalık kazanmalarına olumlu katkılar sunduğu düşünülmektedir.",

    en:
        "Although the opportunity for direct involvement in activities during the April 23 National Sovereignty and Children’s Day process was limited, active support was provided to the school atmosphere and holiday enthusiasm. In this context, thematic bulletin boards and photo corners were designed to help students feel the spirit of the national holiday more deeply. Visual materials reflecting the meaning and importance of the holiday were included, aiming to enrich the school environment visually. " +

        "During the process, classrooms were decorated together with the students, encouraging their active participation. Flags, balloons, and various decorative materials were used to create a classroom atmosphere suitable for the spirit of April 23. By taking part in the preparation process, students were able to improve their cooperation, responsibility-taking, and teamwork skills. " +

        "In addition, students’ official ceremony rehearsals were closely observed and supported throughout the preparation stage. During the rehearsals, students appeared enthusiastic, motivated, and eager to participate, experiencing a process that contributed to learning national awareness through active participation. Overall, it is believed that the process positively contributed to students’ social development, sense of belonging, and awareness of national values."
},  
    images: [
        "assets/images/bayram5.1.png",
        "assets/images/bayram5.2.png",
        "assets/images/bayram5.3.png",
        "assets/images/bayram5.4.png",
        "assets/images/bayram5.5.png",
        "assets/images/bayram5.6.png",
    ],  
    coverImage: "assets/images/bayram5.1.png"
  },
  
bayram6: {
    category: "gallery2",
    title: {    
        tr: "23 Nisan",
        en: "April 23rd"
    },
    shortDesc: {
    tr: "Helen YÜCEDAĞ, Seda KURTAY, Edanur KOLUMAN, Rojin AKMAN ve Arzu AKKUŞ tarafından Fatma Özmüftüoğlu İlkokulu’nda 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında gerçekleştirilen etkinlikler.",
    
    en: "Activities organized by Helen YÜCEDAĞ, Seda KURTAY, Edanur KOLUMAN, Rojin AKMAN, and Arzu AKKUŞ at Fatma Özmüftüoğlu Primary School within the scope of April 23 National Sovereignty and Children's Day."
},
    longDesc: {
    tr:
        "Etkinliklerin planlanmasında ve yürütülmesinde aktif rol aldık. 23 Nisan’da 3. sınıfların (5 şube) dans gösterilerini üstlendik ve hangi gösteriyi yapacaklarını şube öğretmenleri ile birlikte belirledik. Yaklaşık bir ay (4 hafta) boyunca süren tüm provaları bizler yaptırdık; grup arkadaşlarımızın hepsinin ayrıca görev üstlendiği, iş birliği içerisinde yürüttüğümüz bir süreç oldu. " +

        "Provalar esnasında çocukların motivasyonunu artırmak amacıyla onların da eğleneceği ve gösteri ile bağlantılı oyunlar oynattık. Bu durum çocukların provalarda daha coşkulu ve istekli olmalarını sağladı. Gösteri sırasında kullanılan ve çocukların etkinlik sonunda birleştirdiği puzzle şeklindeki pankartları özenle, öğrencilerin kolay kullanabileceği şekilde hazırladık. Bunun yanında bayram coşkusunu yansıtan, hatıra niteliği taşıyan renkli ve yazılı bir 23 Nisan panosu hazırladık. " +

        "23 Nisan günü öğrencileri büyük bir heyecanla izledik ve gösteri sırasında sahneye onlarla birlikte çıkarak motivasyonlarını artırıp destek olduk. Bir öğretmen adayı olarak öğrencilerle etkileşimli çalışarak prova sürecini nasıl yönetebileceğimizi deneyimleme fırsatı bulduk. Çocukların süreç içerisindeki davranışlarını gözlemledik ve bu süreçte öğrencilere nasıl yaklaşmamız gerektiğini görmüş olduk. " +

        "Süreç boyunca karşılaşılabilecek problemler ve bu problemlere nasıl çözüm geliştirilebileceği konusunda öğretmen adayı arkadaşlarımızla birlikte ortak kararlar aldık. Ayrıca bir öğretmenin zümreleriyle olan iletişimine de yakından şahit olduk. Ulusal Egemenlik ve Çocuk Bayramı’nda görev almak ve provalarını gerçekleştirdiğimiz gösterilerin sonucunu görmek bizim için çok güzel ve anlamlı bir deneyim oldu. Bu deneyimi yaşamamıza katkı sağlayan öğretmenimiz Dr. Öğr. Üyesi Sibel DAL’a teşekkür ederiz.",

    en:
        "We took an active role in the planning and implementation of the activities. During the April 23 celebrations, we were responsible for the dance performances of the 3rd grade classes (5 sections) and selected the performances together with the classroom teachers. We conducted all rehearsals for approximately one month (4 weeks), and the process was carried out collaboratively with all group members taking different responsibilities. " +

        "During the rehearsals, we organized games related to the performances in order to increase the children’s motivation and help them enjoy the process. This helped the students become more enthusiastic and eager during rehearsals. We carefully prepared puzzle-shaped banners used during the performance, which the children combined at the end of the show, in a way that was easy for them to use. In addition, we prepared a colorful April 23 bulletin board with meaningful writings that reflected the excitement and spirit of the holiday. " +

        "On April 23, we watched the students with great excitement and supported them by joining them on stage during the performance to increase their motivation. As prospective teachers, we gained experience in managing rehearsal processes through interactive work with students. We also had the opportunity to observe students’ behaviors throughout the process and learned how to approach children in different situations. " +

        "Throughout the process, we discussed possible problems and developed solutions together with our fellow teacher candidates. We also closely observed the communication between teachers and their colleagues. Taking part in the National Sovereignty and Children’s Day celebrations and witnessing the final result of the performances we rehearsed was a very meaningful and memorable experience for us. We would like to thank our instructor, Dr. Lecturer Sibel DAL, for giving us the opportunity to experience this valuable process."
},  
    images: [
        "assets/images/bayram6.1.png",
        "assets/images/bayram6.2.png",
        "assets/images/bayram6.3.png",
    ],  
    coverImage: "assets/images/bayram6.2.png"
  },

bayram7: { 
    category: "gallery2",
    title: {
        tr: "23 Nisan", 
        en: "April 23rd"
    },  
    shortDesc: {
    tr: "İclal GENÇ, Rumeysa ŞEN ve Behican KARAL tarafından Atatürk İlkokulu’nda 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında gerçekleştirilen etkinlikler.",
    
    en: "Activities organized by İclal GENÇ, Rumeysa ŞEN, and Behican KARAL at Atatürk Primary School within the scope of April 23 National Sovereignty and Children's Day."
},
    longDesc: {
    tr:
        "21 Nisan’da  3. sınıf öğrencileriyle birlikte sınıf süsleme etkinlikleri gerçekleştirilmiştir. Öğrencilerle iş birliği içerisinde çalışılarak sınıf ortamı etkinliğin temasına uygun şekilde hazırlanmış, öğrencilerin sürece aktif katılım göstermeleri desteklenmiştir. Yapılan süsleme çalışmaları sayesinde öğrencilerin hem sosyal etkileşimleri güçlenmiş hem de etkinliklere karşı motivasyonları artmıştır. " +

        "Öğrencilerin gösteriler öncesinde kostümlerini giymelerine yardımcı olunmuş, hazırlık sürecinde öğrencilerin heyecanlarına ortak olunmuştur. Gün boyunca etkinlikler gözlemlenmiş ve öğrencilerin bayram coşkusunu yaşayarak öğrenmeleri desteklenmiştir. " +

        "Bu süreçte öğrencilerin etkinliklere karşı oldukça istekli ve heyecanlı oldukları gözlemlenmiştir. Hem Dünya Sağlık Haftası hem de 23 Nisan etkinlikleri sayesinde öğrencilerin sosyal gelişimlerine katkı sağlanmış, okul ortamında birlik, beraberlik ve paylaşım duygularının güçlendiği düşünülmektedir.",

    en:
       "On April 21, classroom decoration activities were carried out together with 3rd grade students. The classroom environment was prepared in accordance with the theme of the activity through cooperative work with the students, and students were encouraged to participate actively in the process. Thanks to these decoration activities, both the students’ social interaction was strengthened and their motivation toward the activities increased."+
        "The activities were observed during the day, and students were encouraged to experience and learn the spirit of the national holiday actively. " +
        "Throughout this process, students were observed to be highly enthusiastic and motivated toward the activities. It is believed that both the World Health Week and April 23 activities contributed positively to students’ social development and strengthened the feelings of unity, togetherness, and sharing within the school environment."
},
    images: [
        "assets/images/bayram7.1.png",
        "assets/images/bayram7.2.png",
        "assets/images/bayram7.3.png",
        "assets/images/bayram7.4.png"
    ],  
    coverImage: "assets/images/bayram7.4.png"
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