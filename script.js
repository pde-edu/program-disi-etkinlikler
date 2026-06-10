
let currentLang = "tr";
/* =========================
   DİL DEĞİŞTİRME
========================= */
function setLanguage(lang) {

   currentLang = lang;
localStorage.setItem("selectedLang", lang);

/* Aktif buton efekti */

const trBtn = document.getElementById("tr-btn");
const enBtn = document.getElementById("en-btn");

trBtn?.classList.remove("active");
enBtn?.classList.remove("active");

if(lang === "tr"){
    trBtn?.classList.add("active");
}else{
    enBtn?.classList.add("active");
}

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

   

    const modal = document.getElementById("imageModal");

    if (modal) {

        modal.classList.remove("show");

        modal.addEventListener("click", function (e) {

            if (e.target === modal) {
                closeImageModal();
            }

        });
    }

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

        if (titleEl) {
            titleEl.innerText = event.title[currentLang];
        }

        if (textEl) {
            textEl.innerText = event.longDesc[currentLang];
        }

        if (gallery) {

            gallery.innerHTML = "";

            event.images.forEach(imgSrc => {

                const img = document.createElement("img");

                img.src = imgSrc;

                img.style.width = "250px";

                img.style.margin = "10px";

                img.style.cursor = "pointer";

                img.onclick = function () {
                    openImageModal(imgSrc);
                };

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
      tr: "18 Mart Çanakkale Zaferi Anma Etkinliği",
      en: "March 18 Çanakkale Victory Commemoration Event"
    },

    subtitle: {
      tr: "18 Mart",
      en: "March 18"
    },

   shortDesc: {
    tr: "Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç ve Mustafa Kemal Çelik tarafından Alantur Ayhan Şahenk İlkokulu’nda 18 Mart Çanakkale Zaferi kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities organized by Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç, and Mustafa Kemal Çelik at Alantur Ayhan Şahenk Primary School within the scope of March 18 Çanakkale Victory."
},
longDesc: {
    tr: `
"Eğitimde Program Dışı Etkinlikler" dersi kapsamında Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç ve Mustafa Kemal Çelik’ten oluşan grup tarafından Alanya Alantur Ayhan Şahenk İlkokulu’nda 18 Mart Çanakkale Zaferi ve Şehitleri Anma Günü kapsamında kapsamlı bir anma programı gerçekleştirilmiştir. Etkinlik, 1., 2., 3. ve 4. sınıf öğrencilerinin katılımıyla yürütülmüş; öğrencilerde milli tarih bilinci, vatan sevgisi ve aidiyet duygusunun geliştirilmesi amaçlanmıştır.

Hazırlık sürecinde okul yönetimiyle etkili bir iş birliği kurulmuş ve gerekli resmi izinler eksiksiz şekilde tamamlanmıştır. Program kapsamında okul genelinde Çanakkale temalı pano hazırlanmış, sembolik mermi maketi tasarlanmış ve öğrencilerin hatıra fotoğrafı çekebileceği özel bir fotoğraf köşesi oluşturulmuştur. Fotoğraf köşesinde kullanılan gelincik çiçekleri, 2. sınıf öğrencileriyle birlikte boyanarak öğrencilerin etkinliğe aktif katılım göstermeleri sağlanmıştır.

Etkinlik öncesinde 4. sınıf öğrencilerine Çanakkale Zaferi’nin tarihî önemi ve dönemin koşulları hakkında bilgilendirme yapılmıştır. Ardından öğrencilerden, görev başındaki jandarma personeline hitaben duygu ve düşüncelerini ifade eden mektuplar yazmaları istenmiştir. Böylece öğrencilerin milli değerler konusunda farkındalık kazanmaları ve empati becerilerinin desteklenmesi amaçlanmıştır.

Etkinlik günü gerçekleştirilen ana programın ardından dört öğrenci ile birlikte yerel jandarma karakolu ziyaret edilerek öğrencilerin hazırladığı mektuplar jandarma personeline teslim edilmiştir. Bu ziyaret sayesinde öğrenciler hem güvenlik güçlerinin görevlerini yakından tanıma fırsatı bulmuş hem de yazdıkları mektupların gerçek sahiplerine ulaştırılmasının mutluluğunu yaşamıştır.

Okula dönüşte, Çanakkale Cephesi’nde görev yapan askerlerin yaşadığı zorlukları somutlaştırmak amacıyla tüm öğrencilere hoşaf ve kuru ekmek ikram edilmiştir. Bu uygulama sayesinde öğrencilerin dönemin yaşam koşullarını daha iyi anlamaları ve tarihî olaylarla duygusal bağ kurmaları desteklenmiştir.

Etkinlik kapsamında okulu ziyaret eden jandarma personeli öğrencilerle bir araya gelmiş, sınıfları ziyaret ederek öğrencilerin sorularını yanıtlamıştır. Öğrencilerin güvenlik güçlerinin görevleri hakkında merak ettikleri konulara yönelik sorular sormaları ve birebir iletişim kurmaları, etkinliğin dikkat çekici bölümlerinden biri olmuştur.

Süreç boyunca öğrencilerin bilişsel ve duyuşsal motivasyonlarının oldukça yüksek olduğu gözlemlenmiştir. Özellikle cephe şartlarını deneyimlemeye yönelik uygulamalar ve jandarma personeliyle gerçekleştirilen etkileşimler öğrencilerin ilgisini artırmış, öğrenme sürecine aktif katılım sağlamalarına katkı sunmuştur.

Okul yönetiminin ve öğretmenlerin destekleyici yaklaşımı sayesinde etkinlik güvenli, planlı ve verimli bir şekilde yürütülmüştür. Öğrenciler etkinlik sonunda benzer anma programlarının ve eğitim gezilerinin tekrar düzenlenmesini istediklerini ifade ederek olumlu geri bildirimlerde bulunmuşlardır.

Bu deneyim, öğretmen adaylarına okul ortamında resmi süreçleri yürütme, etkinlik planlama, ekip çalışması ve zaman yönetimi konularında önemli deneyimler kazandırmıştır. Ayrıca yaparak ve yaşayarak öğrenme yaklaşımının öğrenciler üzerindeki etkileri gözlemlenmiş; tarihî ve millî değerlerin uygulamalı etkinlikler yoluyla daha kalıcı şekilde öğrenilebildiği görülmüştür.
    `,

    en: `
Within the scope of the "Out-of-School Activities in Education" course, a comprehensive commemoration program was organized at Alanya Alantur Ayhan Şahenk Primary School by Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç, and Mustafa Kemal Çelik. The event was conducted with the participation of 1st, 2nd, 3rd, and 4th grade students as part of the March 18 Çanakkale Victory and Martyrs' Remembrance Day activities. The primary aim was to strengthen students' awareness of national history, patriotism, and sense of belonging.

During the preparation phase, effective cooperation was established with the school administration, and all necessary official procedures were completed successfully. As part of the program, a Çanakkale-themed bulletin board, a symbolic artillery shell model, and a special photo corner were prepared. The poppy flowers used in the photo corner were painted together with 2nd grade students, encouraging active student participation and collaboration.

Before the event, 4th grade students were informed about the historical significance of the Çanakkale Victory and the conditions experienced during the war. Afterwards, students wrote letters expressing their thoughts and feelings to local gendarmerie personnel. This activity aimed to increase students’ awareness of national values and develop their empathy skills.

Following the main ceremony on the event day, four students visited the local gendarmerie station together with the project team and personally delivered the letters they had prepared. This visit allowed students to learn more about the duties of security personnel while experiencing the satisfaction of sharing their messages directly.

Upon returning to the school, students were served grape compote and dry bread, representing a typical wartime military meal. This activity helped students better understand the living conditions of soldiers during the Çanakkale Campaign and establish an emotional connection with historical events.

As part of the program, gendarmerie officers visited the school and met with students in their classrooms. They answered students’ questions about their duties and daily responsibilities, creating an interactive and meaningful learning experience.

Throughout the event, students demonstrated high levels of cognitive and emotional engagement. The opportunity to experience symbolic wartime conditions and interact directly with gendarmerie personnel significantly increased their interest and participation.

Thanks to the supportive attitude of the school administration and teachers, the event was carried out safely, efficiently, and successfully. Students expressed that they greatly enjoyed the activities and would like similar commemorative programs and educational visits to be organized in the future.

This experience provided valuable opportunities for the teacher candidates to develop skills in planning educational activities, managing official procedures, teamwork, and time management. It also demonstrated the effectiveness of experiential learning in helping students develop a deeper understanding of historical events and national values.
    `
},
    images: [
      "assets/images/etkinlik1.1.png",
      "assets/images/etkinlik1.2.png",
       "assets/images/etkinlik1.3.png",
        "assets/images/etkinlik1.4.png",
        "assets/images/etkinlik1.5.png",
        "assets/images/etkinlik1.6.png",
        "assets/images/etkinlik1.7.png",
        "assets/images/etkinlik1.8.png",
    ],

    coverImage: "assets/images/etkinlik1.1.png"
  },


  etkinlik2: {
    id: "etkinlik2",
    category: "gallery1",

    title: {
      tr: "Dünya Sağlık Haftası ve Kermes Etkinliği",
      en: "World Health Week and Fair Activities"
    },

    subtitle: {
      tr: "7-13 Nisan",
      en: "April 7-13"
    },

    shortDesc: {
      tr: "Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç ve Mustafa Kemal Çelik tarafından Alantur Ayhan Şahenk İlkokulu’nda Dünya Sağlık Haftası kapsamında gerçekleştirilen etkinlikler.",
      en: "Activities carried out by Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç and Mustafa Kemal Çelik at Alantur Ayhan Şahenk Primary School within the scope of World Health Week."
    },

   longDesc: {
    tr: `
"Eğitimde Program Dışı Etkinlikler" dersi kapsamında Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç ve Mustafa Kemal Çelik’ten oluşan grup tarafından Alanya Alantur Ayhan Şahenk İlkokulu 4. sınıf öğrencilerine yönelik Dünya Sağlık Haftası kapsamında kapsamlı bir etkinlik gerçekleştirilmiştir. Etkinlik, öğrencilerin sağlık okuryazarlığı becerilerini geliştirmek, bilinçli tüketici olmalarını desteklemek ve sağlıklı yaşam alışkanlıkları kazanmalarına katkı sağlamak amacıyla planlanmıştır.

Etkinliğin planlanma sürecinde “Geleceğin sağlıklı nesilleri, bugünün çocuklarıyla inşa edilir.” anlayışı temel alınmıştır. Okul yönetiminin desteğiyle Dünya Sağlık Haftası etkinlikleri okulda düzenlenen kermes uygulamalarıyla birleştirilmiş ve öğrencilerin teorik bilgileri günlük yaşamla ilişkilendirmelerine olanak sağlayan uygulamalı bir öğrenme ortamı oluşturulmuştur.

Etkinlik kapsamında Fen Bilimleri dersinin kazanımlarından yararlanılarak sağlık okuryazarlığı, besin etiketi okuma, gıda güvenliği ve sağlıklı beslenme konularına odaklanılmıştır. Kermeste satışa sunulan ürünlerin yanına içerik bilgileri ve saklama koşullarını içeren bilgilendirme kartları hazırlanmış, böylece öğrencilerin öğrendikleri bilgileri gerçek ürünler üzerinde inceleyerek pekiştirmeleri amaçlanmıştır.

Öğrencilere ürün etiketlerinin nasıl okunacağı, içerik listelerinin nasıl değerlendirileceği, yeme bozukluklarının etkileri ve gıdaların doğru saklanma yöntemleri hakkında interaktif sunumlar gerçekleştirilmiştir. Sunum sürecinde öğrencilerin sorular sormalarına ve fikirlerini paylaşmalarına fırsat verilmiş, böylece öğrenme sürecine aktif katılımları desteklenmiştir.

Kermes günü öğrencilerden öğrendikleri bilgiler doğrultusunda kendilerine ait dengeli ve sağlıklı bir tabak oluşturmaları istenmiştir. Hazırlanan tabaklar dikkatle incelenmiş ve sağlıklı beslenme ilkelerine en uygun tabağı hazırlayan öğrenci başarı sertifikası ile ödüllendirilmiştir. Bu uygulama öğrencilerin teorik bilgileri pratiğe dönüştürmelerine katkı sağlamıştır.

Etkinlik boyunca Vızıltı 33 tekniği ve Pazar Yeri tekniği kullanılarak öğrencilerin fikir alışverişinde bulunmaları sağlanmıştır. Bu yöntemler sayesinde öğrencilerin iletişim kurma, düşüncelerini ifade etme ve iş birliği içerisinde çalışma becerileri desteklenmiştir. Ayrıca sembolik ödüllendirme uygulamalarının öğrencilerin motivasyonlarını artırdığı ve etkinliklere olan ilgilerini güçlendirdiği gözlemlenmiştir.

Süreç boyunca öğrencilerin bilişsel ve duyuşsal motivasyonlarının oldukça yüksek olduğu görülmüştür. Öğrenciler ürün etiketlerini incelemekten, sağlıklı besinleri ayırt etmekten ve kendi tabaklarını oluşturmaktan büyük heyecan duymuştur. Günlük yaşamlarında kullanabilecekleri yeni bilgiler öğrenmeleri etkinliğe yönelik ilgilerini artırmıştır.

Etkinlik sonunda öğrenciler, ürün etiketlerini okuyabilmenin ve sağlıklı besin seçimleri yapabilmenin günlük yaşamlarında kendilerine önemli katkılar sağlayacağını ifade etmişlerdir. Öğrencilerden alınan olumlu geri bildirimler etkinliğin amacına ulaştığını göstermiştir.

Bu deneyim, öğretmen adaylarına akademik bir konunun sosyal ve uygulamalı etkinliklerle desteklendiğinde daha kalıcı öğrenmelere dönüştürülebileceğini göstermiştir. Aynı zamanda etkinlik planlama, uygulama yönetimi, öğrenci motivasyonunu artırma ve farklı öğretim tekniklerini kullanma konularında önemli deneyimler kazandırmıştır. Sürecin sonunda etkinliğin hedeflerine başarılı bir şekilde ulaştığı değerlendirilmiştir.
    `,

    en: `
Within the scope of the "Out-of-School Activities in Education" course, Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç, and Mustafa Kemal Çelik organized a comprehensive World Health Week activity for 4th-grade students at Alanya Alantur Ayhan Şahenk Primary School. The event was designed to improve students’ health literacy, support conscious consumer behavior, and encourage healthy lifestyle habits.

The activity was planned based on the philosophy that “Healthy generations of the future are built through today’s children.” With the support of the school administration, World Health Week activities were integrated with a school fair, creating an applied learning environment where students could connect theoretical knowledge with real-life experiences.

The program focused on health literacy, nutrition label reading, food safety, and healthy eating habits by utilizing learning outcomes from the Science curriculum. Information cards containing ingredient lists and storage conditions were prepared and displayed next to products offered at the fair, allowing students to examine real products and apply their knowledge in practice.

Interactive presentations were conducted on topics such as reading food labels, interpreting ingredient lists, eating disorders, and proper food storage methods. Students were encouraged to ask questions and share their opinions throughout the presentations, promoting active participation in the learning process.

On the day of the fair, students were asked to create their own balanced and healthy meal plates based on the information they had learned. The prepared plates were carefully evaluated, and the student who designed the most balanced plate received a certificate of achievement. This activity helped students transform theoretical knowledge into practical skills.

Throughout the process, the Buzz 33 technique and Marketplace technique were used to encourage discussion and idea sharing among students. These methods supported communication skills, self-expression, collaboration, and active participation. It was also observed that symbolic rewards positively influenced students’ motivation and increased their engagement in the activities.

Students demonstrated high levels of both cognitive and emotional motivation throughout the event. They were enthusiastic about examining food labels, identifying healthy food choices, and creating their own meal plates. Learning practical information that could be applied in daily life further increased their interest and participation.

At the end of the activity, students stated that learning how to read food labels and make healthy nutritional choices would be highly beneficial in their daily lives. The positive feedback received from students indicated that the objectives of the activity had been successfully achieved.

This experience demonstrated to the teacher candidates how academic subjects can become more meaningful and permanent when supported by social and hands-on activities. It also provided valuable experience in activity planning, implementation, student motivation, and the effective use of various teaching techniques. Overall, the activity was considered successful in achieving its educational goals.
    `
},

    images: [
    "assets/images/etkinlik2.1.png",
    "assets/images/etkinlik2.2.png",
    "assets/images/etkinlik2.3.png",
    "assets/images/etkinlik2.4.png",
    "assets/images/etkinlik2.5.png",
    "assets/images/etkinlik2.6.png",
    "assets/images/etkinlik2.7.png",
    "assets/images/etkinlik2.8.png",
    ],

    coverImage: "assets/images/etkinlik2.1.png"
  },
  etkinlik3: {
    id: "etkinlik3",
    category: "gallery1",

    title: { 
        tr: "Müze Haftası: Syedra Antik Kenti Gezisi",
        en: "Museum Week: Syedra Ancient City Tour"
    },

    shortDesc: {
    tr: "Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç ve Mustafa Kemal Çelik tarafından Alantur Ayhan Şahenk İlkokulu’nda Müze Haftası kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities carried out by Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç and Mustafa Kemal Çelik at Alantur Ayhan Şahenk Primary School within the scope of Museum Week."
},  

   longDesc: {
    tr: `
"Eğitimde Program Dışı Etkinlikler" dersi kapsamında; Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç ve Mustafa Kemal Çelik’ten oluşan grubumuzla Alanya Alantur Ayhan Şahenk İlkokulu’nda 4. sınıf öğrencilerine yönelik Müzeler Haftası kapsamında anlamlı bir etkinlik gerçekleştirdik. Etkinliğin temel amacı, öğrencilerin müze kavramını yalnızca kapalı mekânlarla sınırlı bir yapı olarak değil, tarihî ve kültürel mirasın bulunduğu her alanı kapsayan bir öğrenme ortamı olarak görmelerini sağlamaktı.

Bu doğrultuda öğrencilerle birlikte Syedra Antik Kenti’ne açık hava müze gezisi düzenlendi. Gezi öncesinde öğrencilerimize antik kentin tarihî önemi hakkında bilgilendirici bir sunum yapıldı ve gezi sırasında uyulması gereken kurallar hatırlatıldı. Tarihî yapıların geçmişteki görünümlerini daha iyi anlayabilmeleri amacıyla çeşitli rekonstrüksiyon görselleri hazırlanarak öğrencilerle paylaşıldı. Böylece öğrencilerin gezi öncesinde ön bilgi oluşturmaları ve tarihî mekânları daha bilinçli incelemeleri hedeflendi.

Gezi boyunca öğrenciler sütunlu caddeler, sarnıçlar ve antik yapı kalıntıları arasında rehberlik edilerek yönlendirildi. Dönemin sosyal yaşamı, mimarisi ve kültürel özellikleri hakkında bilgiler verilirken öğrencilerin aktif katılım göstermelerini sağlamak amacıyla çeşitli sorular yöneltildi. Etkileşimli bir öğrenme ortamı oluşturularak öğrencilerin merak duyguları canlı tutuldu ve tarihî çevreyi keşfetmeleri desteklendi.

Etkinlik sonrasında "Benim Cümlelerimle Tarih" adlı değerlendirme çalışması gerçekleştirildi. Bu etkinlik kapsamında öğrenciler gezide edindikleri bilgileri ve izlenimleri kendi ifadeleriyle arkadaşlarına anlatarak paylaşma fırsatı buldu. Böylece öğrencilerin gözlem yapma, yorumlama, iletişim kurma ve bilgiyi yeniden yapılandırma becerileri desteklendi.

Süreç boyunca öğrencilerin hem bilişsel hem de duyuşsal motivasyonlarının oldukça yüksek olduğu gözlemlendi. Tarihî yapıları yerinde incelemek, geçmiş yaşam biçimleri hakkında bilgi edinmek ve açık havada öğrenme deneyimi yaşamak öğrencilerin ilgisini büyük ölçüde artırdı. Öğrenciler akranlarıyla bilgi paylaşımında bulunurken aktif ve istekli bir tutum sergilediler.

Gezi sonrasında öğrenciler etkinliği hayatlarında unutamayacakları bir deneyim olarak tanımladılar ve benzer tarihî mekân gezilerinin tekrar düzenlenmesini istediklerini ifade ettiler. Alınan olumlu geri bildirimler etkinliğin amaçlarına ulaştığını ve öğrenciler üzerinde kalıcı bir etki bıraktığını göstermiştir.

Bu süreç, biz öğretmen adaylarına öğrenmenin yalnızca sınıf ortamıyla sınırlı olmadığını, tarihî ve kültürel mekânların da güçlü öğrenme alanları sunduğunu deneyimleme fırsatı verdi. Aynı zamanda gezi planlama, öğrenci yönetimi, okul dışı öğrenme ortamlarını etkili kullanma ve yaparak yaşayarak öğrenme yaklaşımını uygulama konularında önemli mesleki deneyimler kazanmamıza katkı sağladı.
    `,
    en: `
As part of the "Out-of-School Activities in Education" course, our group consisting of Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç, and Mustafa Kemal Çelik organized a meaningful Museum Week activity for 4th-grade students at Alanya Alantur Ayhan Şahenk Primary School. The main objective of the event was to help students understand that museums are not limited to enclosed buildings but also include historical and cultural heritage sites that serve as valuable learning environments.

For this purpose, an open-air museum trip was organized to the Ancient City of Syedra. Before the trip, students attended an informative presentation about the historical significance of the ancient city and were reminded of the rules to be followed during the visit. Reconstruction visuals of historical structures were prepared and shared with the students to help them imagine how the buildings looked in the past. This preparation aimed to provide background knowledge and enhance students’ understanding of the site.

During the excursion, students explored the ancient streets, cisterns, and architectural remains of Syedra while receiving information about the social life, architecture, and cultural characteristics of the period. Interactive questions were asked throughout the trip to encourage participation and maintain students’ curiosity. This approach helped create an engaging learning environment where students actively explored the historical setting.

Following the trip, a reflection activity called "History in My Own Words" was conducted. Students shared their observations and experiences with their classmates using their own expressions. This activity supported the development of observation, interpretation, communication, and knowledge-construction skills.

Throughout the process, students demonstrated high levels of both cognitive and emotional motivation. Examining historical structures firsthand, learning about past civilizations, and experiencing outdoor learning significantly increased their interest and engagement. Students enthusiastically shared information with their peers and actively participated in discussions.

After the activity, many students described the trip as an unforgettable experience and expressed a strong desire to participate in similar historical and cultural excursions in the future. The positive feedback received indicated that the objectives of the activity were successfully achieved and that the experience left a lasting impact on the students.

This process provided us, as prospective teachers, with the opportunity to experience how learning can extend beyond classroom walls and take place effectively in historical and cultural environments. It also contributed significantly to our professional development by improving our skills in educational trip planning, student management, the use of out-of-school learning environments, and experiential learning practices.
    `
},

    images: [
        "assets/images/etkinlik3.1.png",
        "assets/images/etkinlik3.2.png",
        "assets/images/etkinlik3.3.png",
        "assets/images/etkinlik3.4.png",
        "assets/images/etkinlik3.5.png",
        "assets/images/etkinlik3.6.png",
    ],  

  coverImage: "assets/images/etkinlik3.2.png"
},
etkinlik4: {
    id: "etkinlik4",
    category: "gallery1",   

    title: {

        tr: "Müzeler Haftası",
        en: "Museums Week"
    }, 

    shortDesc: {
    tr: "Meryem DOLU, Sevilay ERDOĞAN, Eda YAVUZ ve Sude Nur ÖZTÜRK tarafından Mahmutlar Kılıçarslan İlkokulu ve Köy Yaşam Merkezi’nde Müzeler Haftası kapsamında gerçekleştirilen etkinlikler.",
    
    en: "Activities organized by Meryem DOLU, Sevilay ERDOĞAN, Eda YAVUZ, and Sude Nur ÖZTÜRK at Mahmutlar Kılıçarslan Primary School and Village Life Center within the scope of Museum Week."
},

longDesc: {
    tr: `
Mahmutlar Kılıçarslan İlkokulu ve Köy Yaşam Merkezi’nde gerçekleştirilen “Mazi Müzesi” etkinliği, Alanya Alaaddin Keykubat Üniversitesi Eğitim Fakültesi Temel Eğitim Bölümü Sınıf Eğitimi Anabilim Dalı 3. sınıf öğrencileri Meryem Dolu, Sevilay Erdoğan, Eda Yavuz ve Sude Nur Öztürk tarafından Eğitimde Program Dışı Etkinlikler dersi kapsamında planlanmıştır. 18–24 Mayıs Müzeler Haftası çerçevesinde gerçekleştirilen etkinlikte 3. ve 4. sınıf öğrencileri gönüllülük esasına dayalı olarak aktif görev almıştır.

“Mazi Müzesi” temasıyla planlanan etkinlikte öğrencilerin yalnızca müze ziyaretçisi olmaları değil; aynı zamanda müze kurucusu, eser sahibi ve küratör rolünü deneyimlemeleri amaçlanmıştır. Okulun tercih edilmesinde, yaparak yaşayarak öğrenmeyi destekleyen eğitim anlayışı, etkinliklere açık yapısı ve öğrencilerle yakın çalışmaya imkân tanıyan ortamı etkili olmuştur. İlk olarak yalnızca 4. sınıflarla planlanan etkinlik, öğrenci sayısının az olması nedeniyle okul yönetiminin önerisiyle 3. sınıf öğrencilerinin de katılımıyla genişletilmiştir.

Etkinlik süreci sergi gününden bir hafta önce başlamıştır. İlk aşamada öğrencilere Müzeler Haftası’nın anlamı ve kurulacak müzenin içeriği hakkında bilgi verilmiş, ön algı testi uygulanmış ve “müze” kavramını anlamlandırmalarını desteklemek amacıyla kavram haritası hazırlanmıştır. Ayrıca müze kurallarını içeren canlandırma etkinlikleri gerçekleştirilmiş ve öğrencilerin öğrenmeye yönelik merak duygularının artırılması hedeflenmiştir.

Ders sonunda öğrencilere müze sergisinin ayrıntılarını içeren veli bilgilendirme metinleri ve davetiyeler dağıtılmıştır. Bunun yanında okul içerisinde etkinliği duyuran afişler hazırlanarak öğrencilerin yaklaşan etkinliği sürekli hatırlamaları ve sürece yönelik heyecan geliştirmeleri amaçlanmıştır.

Müzenin kurulacağı hafta sergi alanı titizlikle hazırlanmış ve süslenmiştir. Öğrenciler evlerinden getirdikleri tarihî ve aile yadigârı eşyaları, hazırladıkları eser künyeleriyle birlikte sergi alanına yerleştirmiştir. Süreç boyunca öğrencilerin etkinliğe yoğun ilgi gösterdiği, müzenin kurulmasına yönelik büyük heyecan duydukları ve süsleme çalışmalarına gönüllü olarak katıldıkları gözlemlenmiştir.

Sergi günü ilk olarak 4. sınıf öğrencileri sergi alanında görev almıştır. Öğrenciler getirdikleri eserleri velilerine tanıtarak eşyaların hikâyelerini anlatmış ve ziyaretçilere rehberlik yapmıştır. Daha sonra aynı süreç 3. sınıf öğrencileriyle devam ettirilmiştir. Böylece öğrenciler yalnızca sergi izleyicisi değil, aynı zamanda geçmişi temsil eden eserlerin anlatıcısı ve küratörü olma deneyimi yaşamıştır.

Etkinlik sonunda öğrencilere son algı testi uygulanmış ve süreç değerlendirilmiştir. Öğrenciler gerçekleştirdikleri çalışmalarla ilgili düşüncelerini ve öğrendiklerini öğrenme günlüklerine yansıtmıştır. Ön ve son algı testleri ile öğrenme günlükleri aracılığıyla öğrencilerin bilgi, duygu ve deneyimlerinde meydana gelen değişimlerin değerlendirilmesi amaçlanmıştır.

Etkinlik sürecinde okul müdürü ve sınıf öğretmenleri önemli ölçüde destek sağlamış ve planlama ile uygulama aşamalarında iş birliği içerisinde hareket edilmiştir. Öğrenciler ilk kez böyle bir Müzeler Haftası etkinliği gerçekleştirdiklerini ve bu deneyimden büyük heyecan duyduklarını ifade etmiştir. Daha önce müze ziyaretinde bulunmuş olsalar da kendi müzelerini kurup küratör rolü üstlenmenin onlar için unutulmaz bir deneyim olduğu belirtilmiştir.

Veliler de etkinliğe olumlu geri bildirimlerde bulunmuştur. Sergi sürecini bir zaman yolculuğu olarak tanımlayan veliler, çocuklarının geçmişle bağ kurduklarını, kültürel mirasa yönelik farkındalık geliştirdiklerini ve etkinlikten büyük keyif aldıklarını ifade etmiştir.

Gerçekleştirilen çalışma ile öğrencilerin müze kavramını tanımaları, kültürel miras ve tarih bilinci kazanmaları, geçmişten günümüze aktarılan eşyaların değerini fark etmeleri ve aktif öğrenme sürecine katılmaları amaçlanmıştır. Bunun yanında araştırma yapma, gözlem yapma, iletişim kurma, sorumluluk alma ve iş birliği becerilerinin geliştirilmesi hedeflenmiştir.

Öğrencilerin hem bilişsel hem de duyuşsal motivasyonlarının oldukça yüksek olduğu gözlemlenmiştir. Tarihî eserlerin hikâyelerini araştırmaları ve eser künyeleri hazırlamaları bilişsel motivasyonlarını artırırken; kendi eşyalarını sergileyecek olmaları, küratör rolü üstlenmeleri ve ailelerinin sergiyi ziyaret edecek olması duyuşsal motivasyonlarını güçlendirmiştir.

Etkinliğin büyük ölçüde amaçlarına ulaştığı değerlendirilmiştir. Öğrencilerin müze kavramını daha yakından tanıdığı, kültürel mirasa ilişkin farkındalık geliştirdiği ve iletişim kurma, sorumluluk alma, sunum yapma ile kendini ifade etme becerilerinde gelişim gösterdiği gözlemlenmiştir.

Grup üyeleri, aynı etkinliği yeniden gerçekleştirme fırsatı bulmaları hâlinde süreci daha uzun bir zamana yaymayı, öğrencilerin eser araştırmalarına daha fazla süre ayırmalarını sağlamayı ve sergiyi dijital materyallerle zenginleştirmeyi planladıklarını ifade etmiştir. Bu deneyimin kendilerine yalnızca etkinlik planlama ve organizasyon becerisi kazandırmadığı; aynı zamanda zaman yönetimi, büyük grupları yönlendirme ve okul-aile iş birliğinin önemini deneyimleme fırsatı sunduğu belirtilmiştir.

Mahmutlar Kılıçarslan İlkokulu ve Köy Yaşam Merkezi’nde gerçekleştirilen bu anlamlı Müzeler Haftası etkinliği, öğrencilerin geçmişle bağ kurduğu, öğrenmeyi yaşayarak deneyimlediği ve kültürel değerlerin gelecek kuşaklara aktarılmasına katkı sunan unutulmaz bir eğitim deneyimi olarak hafızalarda yer etmiştir.
    `,
    
    en: `
The “Mazi Museum” activity carried out at Mahmutlar Kılıçarslan Primary School and Village Life Center was organized by Alanya Alaaddin Keykubat University Faculty of Education, Department of Primary Education, third-year students Meryem Dolu, Sevilay Erdoğan, Eda Yavuz, and Sude Nur Öztürk within the scope of the Out-of-School Activities in Education course. The event was held during Museum Week between May 18–24, and 3rd and 4th grade students actively participated on a voluntary basis.

The activity was planned under the theme of “Mazi Museum” with the aim of enabling students not only to become museum visitors but also to experience the roles of museum founders, artifact owners, and curators. The school was chosen because of its educational approach supporting experiential learning, its openness to educational activities, and its suitable environment for close interaction with students. Although the activity was initially planned only for 4th grade students, 3rd grade students were later included upon the suggestion of the school administration due to the limited number of participants.

The preparation process began one week before the exhibition day. In the first stage, students were informed about the meaning of Museum Week and the content of the museum to be created. A preliminary perception test was conducted, and a concept map was prepared to support students’ understanding of the concept of “museum.” In addition, role-play activities about museum rules were organized to strengthen students’ curiosity and readiness for learning.

At the end of the lesson, invitation letters and parent information forms containing details about the exhibition were distributed to students. Posters announcing the event were also displayed around the school to help students remain excited and aware of the upcoming museum activity.

During the week of the exhibition, the exhibition area was carefully prepared and decorated. Students placed historical and family heirloom objects brought from their homes into the exhibition area together with artifact labels they had prepared. Throughout the process, students showed great interest and excitement toward building the museum and willingly participated in decoration activities.

On the exhibition day, 4th grade students first took part in presenting the exhibition area. Students introduced their artifacts to their parents, explained the stories behind the objects, and guided visitors through the exhibition. Afterwards, the same process continued with the participation of 3rd grade students. In this way, students experienced being not only visitors but also narrators and curators representing the past.

At the end of the activity, a final perception test was conducted to evaluate the process. Students reflected their thoughts and learning experiences in learning journals. Through the comparison of pre- and post-perception tests together with learning journals, it was aimed to evaluate the changes in students’ knowledge, emotions, and experiences.

During the activity process, the school principal and classroom teachers provided significant support and cooperated closely in both the planning and implementation stages. Students stated that it was the first time they had participated in such a Museum Week activity and expressed great excitement about the experience. Although many of them had previously visited museums, they emphasized that creating and managing their own museum was a unique and unforgettable experience.

Parents also provided highly positive feedback about the activity. They described the exhibition process as a journey through time and stated that their children developed a connection with the past, increased their awareness of cultural heritage, and greatly enjoyed the activity.

The activity aimed to help students understand the concept of museums, gain awareness about cultural heritage and history, recognize the value of objects transferred from past to present, and participate actively in the learning process. In addition, the development of research, observation, communication, responsibility-taking, and cooperation skills was also targeted.

It was observed that students’ cognitive and emotional motivation levels were quite high throughout the process. Researching the stories of historical objects and preparing artifact labels increased their cognitive motivation, while displaying their own belongings, taking on the role of curator, and having their families visit the exhibition strengthened their emotional motivation.

The activity was evaluated as largely successful in achieving its objectives. Students became more familiar with the concept of museums, developed awareness about cultural heritage, and improved their communication, responsibility-taking, presentation, and self-expression skills.

Group members stated that if they had the opportunity to organize the same activity again, they would extend the duration of the process, allow students more time for artifact research, and enrich the exhibition with digital materials. They also emphasized that this experience provided them not only with event planning and organizational skills but also with opportunities to improve time management, large-group coordination, and school-family cooperation skills.

This meaningful Museum Week activity carried out at Mahmutlar Kılıçarslan Primary School and Village Life Center remained in memory as an unforgettable educational experience where students connected with the past, learned through direct experience, and contributed to the transfer of cultural values to future generations.
    `
},


    images: [
        "assets/images/etkinlik4.1.png",
        "assets/images/etkinlik4.2.png",
        "assets/images/etkinlik4.3.png",
        "assets/images/etkinlik4.4.png",
        "assets/images/etkinlik4.5.png",
        "assets/images/etkinlik4.6.png",
        "assets/images/etkinlik4.7.png",
        "assets/images/etkinlik4.8.png",
        "assets/images/etkinlik4.9.png",
        "assets/images/etkinlik4.10.png",
        "assets/images/etkinlik4.11.png",
        "assets/images/etkinlik4.12.png",
        "assets/images/etkinlik4.13.png",
    ],

    coverImage: "assets/images/etkinlik4.7.png"
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
  tr: `
Etkinliğin Tanıtımı

Alanya Alaaddin Keykubat Üniversitesi Eğitim Fakültesi Eğitimde Program Dışı Etkinlikler dersi kapsamında; Sema Aslan, İsmahan Şahin, Sıla Çetintaş ve Yusuf Samet Bulut’tan oluşan çalışma grubumuzla Alanya’da bulunan Kestel Akdeniz İlkokulu’nda Trafik ve İlk Yardım Haftası kapsamında “Trafik Güvenliği ve İlk Yardım” konulu bir etkinlik gerçekleştirdik. Çalışmalarımız 1., 2., 3. ve 4. sınıf öğrencilerini kapsayacak şekilde planlanmış ve her sınıfta bir ders saati boyunca uygulanmıştır.

Bu konunun seçilmesindeki temel amaç; öğrencilerde erken yaşlardan itibaren trafik bilinci oluşturmak, güvenli davranış alışkanlıkları kazandırmak ve acil durumlarda yapılması gerekenler konusunda farkındalık geliştirmektir. Aynı zamanda öğrencilerin trafik levhalarını tanımaları, ilk yardım çantasındaki temel malzemeleri öğrenmeleri ve günlük yaşamda karşılaşabilecekleri durumlara karşı bilinçli bireyler olarak yetişmelerine katkı sağlamak hedeflenmiştir.

Hazırlık Süreci

Etkinliğin planlama sürecinde tüm grup üyeleri aktif görev almıştır. Öncelikle öğrencilerin yaş düzeylerine uygun kazanımlar belirlenmiş ve ders içeriği bu doğrultuda hazırlanmıştır. Etkinliklerin öğrencilerin aktif katılımını desteklemesi amacıyla anlatım yönteminin yanı sıra gösterip yaptırma, soru-cevap ve grup çalışması gibi uygulamalara yer verilmiştir.

Hazırlık aşamasında ilk yardım çantasında bulunması gereken sargı bezi, yara bandı, makas ve antiseptik solüsyon gibi materyaller temin edilmiştir. Bunun yanında öğrencilerin motivasyonunu artırmak amacıyla “Küçük Trafik Dedektörü Katılım Sertifikası” hazırlanmış, trafik levhalarına ilişkin görseller düzenlenmiş ve öğrenmelerin değerlendirilmesi amacıyla kısa bir bilgi testi oluşturulmuştur. Tüm materyaller grup üyelerinin ortak çalışmasıyla hazırlanmış ve etkinlik günü için gerekli planlamalar tamamlanmıştır.

Uygulama Günü

Etkinlik günü öğrencilerle birlikte trafik güvenliği ve ilk yardım konularında etkileşimli çalışmalar gerçekleştirilmiştir. Derse “Trafik nedir?” sorusuyla başlanmış ve öğrencilerin mevcut bilgileri ortaya çıkarılmıştır. Daha sonra trafiğin yalnızca araçlardan oluşmadığı; yayaların, bisiklet kullanıcılarının, hayvanların ve trafik kurallarının da sistemin önemli parçaları olduğu öğrencilere açıklanmıştır.

İlk yardım bölümünde öğrencilerle birlikte ilk yardım çantası incelenmiş, çantada bulunan malzemeler tanıtılmış ve kullanım amaçları açıklanmıştır. Ayrıca acil durumlarda 112 Acil Çağrı Merkezi’nin doğru şekilde aranmasının önemi üzerinde durulmuştur. Öğrencilere sakin kalmanın ve doğru bilgi vermenin hayati önem taşıdığı örnek durumlar üzerinden anlatılmıştır.

Etkinliğin devamında öğrenciler küçük gruplara ayrılmış ve her gruba farklı trafik levhaları verilmiştir. Öğrenciler levhaların anlamlarını inceleyerek arkadaşlarıyla paylaşmış, böylece öğrenme sürecine aktif olarak katılmışlardır. Ders sonunda öğrencilerle birlikte trafik kurallarına uyacaklarına dair ortak bir söz verilmiş ve etkinlik coşkulu bir şekilde tamamlanmıştır.

Gözlemlerimiz

Etkinlik süreci boyunca okul yönetimi ve sınıf öğretmenlerinin oldukça destekleyici bir yaklaşım sergiledikleri gözlemlenmiştir. Okulun olumlu ve iş birliğine açık atmosferi etkinliğin verimli bir şekilde yürütülmesine katkı sağlamıştır.

Öğrencilerin trafik güvenliği ve ilk yardım konularına karşı oldukça ilgili oldukları görülmüştür. Özellikle ilk yardım çantasında bulunan materyalleri yakından inceleme fırsatı bulmaları ve trafik levhalarıyla ilgili grup çalışmalarına katılmaları onların dikkat ve motivasyonlarını artırmıştır. Soru-cevap etkinliklerinde öğrencilerin yoğun katılım göstermeleri öğrenmeye karşı istekli olduklarını ortaya koymuştur.

Çocuklardan Aldığımız Dönütler

Etkinlik sonunda öğrencilerden olumlu geri bildirimler alınmıştır. Öğrenciler trafik levhalarını öğrenmekten ve ilk yardım çantasını incelemekten keyif aldıklarını ifade etmişlerdir. Katılım sertifikalarının kendilerini mutlu ettiğini ve etkinliğe karşı ilgilerini artırdığını belirtmişlerdir.

Uygulanan kısa değerlendirme çalışmasında öğrencilerin büyük çoğunluğunun doğru cevaplar vermesi, etkinlik sırasında edinilen bilgilerin kalıcı hâle geldiğini göstermiştir. Öğrencilerin günlük yaşamlarında trafik kurallarına daha fazla dikkat edeceklerini ifade etmeleri etkinliğin amacına ulaştığının önemli göstergelerinden biri olmuştur.

Bu Deneyimin Bize Kazandırdıkları

Gerçekleştirdiğimiz bu etkinlik, öğretmenlik mesleğinin yalnızca akademik bilgi aktarmaktan ibaret olmadığını, öğrencilerin yaşam becerileri kazanmalarına katkı sağlayan çalışmaların da eğitim sürecinin önemli bir parçası olduğunu göstermiştir.

Bu süreç boyunca etkinlik planlama, materyal hazırlama, zaman yönetimi, sınıf yönetimi ve öğrenciyle etkili iletişim kurma konularında önemli deneyimler kazanılmıştır. Ayrıca öğrencilerin aktif katılım gösterdiği uygulamaların öğrenmeyi daha etkili ve kalıcı hâle getirdiği görülmüştür.

Genel olarak değerlendirildiğinde, Trafik ve İlk Yardım Haftası kapsamında gerçekleştirilen bu etkinliğin öğrencilerin trafik bilinci ve ilk yardım farkındalıklarının gelişimine katkı sağladığı düşünülmektedir. Etkinlik hem öğrenciler hem de öğretmen adayları açısından öğretici, verimli ve mesleki gelişimi destekleyen önemli bir deneyim olarak değerlendirilmiştir.
`,
  en: `
Introduction to the Activity

Within the scope of the Out-of-School Activities in Education course at Alanya Alaaddin Keykubat University Faculty of Education, our project group consisting of Sema Aslan, İsmahan Şahin, Sıla Çetintaş, and Yusuf Samet Bulut organized a “Traffic Safety and First Aid” activity at Kestel Akdeniz Primary School in Alanya as part of Traffic and First Aid Week. The activity was conducted with 1st, 2nd, 3rd, and 4th grade students and implemented during a class period for each group.

The primary aim of the activity was to help students develop traffic awareness from an early age, gain safe behavior habits, and increase their awareness of appropriate actions during emergencies. It also aimed to teach students about traffic signs, introduce the basic materials found in a first aid kit, and contribute to raising responsible and conscious individuals.

Preparation Process

All group members actively participated in the planning process. First, age-appropriate learning outcomes were determined and the content was designed accordingly. To ensure active participation, various methods such as demonstration, question-and-answer activities, and group work were included in the program.

During the preparation stage, materials commonly found in a first aid kit, such as bandages, adhesive bandages, scissors, and antiseptic solutions, were gathered. In addition, a “Little Traffic Detective Certificate of Participation” was designed to increase student motivation. Visual materials related to traffic signs and a short assessment test were also prepared collaboratively by the group.

Implementation Day

The activity began with the question, “What is traffic?” allowing students to share their prior knowledge. Students were informed that traffic does not only involve vehicles, but also pedestrians, cyclists, animals, and traffic regulations.

During the first aid section, students examined a first aid kit and learned about the purpose of each item. The importance of correctly contacting emergency services through the 112 Emergency Call Center was emphasized, and examples were provided to explain the importance of remaining calm and giving accurate information in emergency situations.

Later, students were divided into small groups and given different traffic signs to analyze. They discussed the meanings of these signs and shared their findings with classmates, actively participating in the learning process. At the end of the lesson, students collectively pledged to follow traffic rules and the activity concluded in an enthusiastic atmosphere.

Our Observations

Throughout the activity, the school administration and classroom teachers were highly supportive. The cooperative and positive school environment contributed significantly to the successful implementation of the program.

Students showed strong interest in both traffic safety and first aid topics. Examining real first aid materials and participating in traffic sign activities increased their engagement and motivation. Their active participation in discussions demonstrated a genuine willingness to learn.

Feedback from Students

Students provided very positive feedback after the activity. They stated that learning about traffic signs and exploring the contents of a first aid kit was both enjoyable and informative. They also mentioned that receiving participation certificates made them feel valued and increased their enthusiasm.

The results of the short assessment activity showed that most students had successfully understood and retained the information presented. Many students expressed that they would pay greater attention to traffic rules in their daily lives, indicating that the objectives of the activity had been achieved.

What This Experience Taught Us

This experience demonstrated that teaching is not limited to delivering academic knowledge but also involves helping students develop essential life skills. Throughout the process, we gained valuable experience in activity planning, material preparation, time management, classroom management, and effective communication with students.

We also observed that learning becomes more meaningful and lasting when students actively participate in the process. Overall, the Traffic and First Aid Week activity contributed to students’ awareness of traffic safety and first aid while providing us, as teacher candidates, with a highly valuable professional learning experience.
`
},   

    images: [
       "assets/images/etkinlik5.1.png",
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
        tr: "Dünya Sağlık Haftası ",
        en: "World Health Week"  
    },

    shortDesc: {
    tr: "Samet Söyler, Enes Polat, Berat Arslan, Mert Çetintaş ve Ziyettin Devrîş tarafından Kızılcaşehir İlkokulu’nda Dünya Sağlık Haftası kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities organized by Samet Söyler, Enes Polat, Berat Arslan, Mert Çetintaş, and Ziyettin Devrîş at Kızılcaşehir Primary School within the scope of World Health Week."
},
    longDesc: {
  tr: `
Eğitimde Program Dışı Etkinlikler dersi kapsamında, Dr. Öğr. Üyesi Sibel Dal danışmanlığında Samet Söyler, Enes Polat, Berat Arslan, Mert Çetintaş ve Ziyettin Devriş’ten oluşan çalışma grubumuz tarafından Kızılcaşehir İlkokulunda Dünya Sağlık Haftası (7-14 Nisan) dolayısıyla çeşitli etkinlikler planlanmış ve uygulanmıştır. Gerçekleştirilen çalışmalar anaokulu ile birinci, ikinci, üçüncü ve dördüncü sınıf öğrencilerini kapsayacak şekilde okul genelinde düzenlenmiştir.

Dünya Sağlık Haftası’nın seçilmesindeki temel amaç; öğrencilerde sağlıklı yaşam alışkanlıklarının geliştirilmesine katkı sağlamak, dengeli beslenme ve kişisel hijyen konularında farkındalık oluşturmak ve bu kazanımları eğlenerek öğrenme anlayışıyla desteklemektir. Bu doğrultuda hazırlanan etkinliklerde öğrencilerin bilişsel, duyuşsal ve psikomotor gelişimlerini destekleyen uygulamalara yer verilmiştir.

Etkinliklerin planlanmasında öğrencilerin yaş özellikleri, ilgi alanları ve gelişim düzeyleri dikkate alınmış; hem öğretici hem de eğlenceli bir program hazırlanmasına özen gösterilmiştir. Aynı zamanda geleneksel çocuk oyunlarının yaşatılması ve öğrencilerin sosyal etkileşimlerinin artırılması da hedeflenen önemli kazanımlar arasında yer almıştır.

Hazırlık sürecinde grup üyeleri arasında görev paylaşımı yapılarak sistemli bir çalışma yürütülmüştür. Bazı grup üyeleri Dünya Sağlık Haftası’nın içeriğine uygun sunum materyalleri hazırlarken, diğer üyeler oyunlarda kullanılacak araç gereçlerin temini ve etkinlik alanlarının düzenlenmesi görevlerini üstlenmiştir. Ayrıca katılım belgeleri ve madalyaların hazırlanması, yarışma kurallarının belirlenmesi ve etkinlik akış planının oluşturulması da çalışma grubu tarafından gerçekleştirilmiştir.

Bu süreçte okul yönetimi ve öğretmenlerle sürekli iletişim hâlinde olunmuş, etkinliklerin uygulanacağı alanlar birlikte belirlenmiştir. Okul idaresinin sağladığı destek sayesinde gerekli materyaller temin edilmiş ve öğrencilerin güvenliği göz önünde bulundurularak etkinlik ortamı hazırlanmıştır. Okulun olumlu yaklaşımı ve iş birliğine açık tutumu planlanan çalışmaların sorunsuz şekilde yürütülmesine önemli katkı sağlamıştır.

Hazırlık aşamasında özellikle öğrencilerin etkinliklere aktif katılımını sağlayacak uygulamalara ağırlık verilmiştir. Sağlıklı yaşam ve dengeli beslenme konulu sunumun yanı sıra süt içme yarışması, yumurta taşıma yarışı, mendil kapmaca, çuval yarışı ve sandalye kapmaca gibi etkinlikler planlanmıştır. Böylece öğrencilerin hem öğrenmeleri hem de keyifli vakit geçirmeleri amaçlanmıştır.

Etkinlik günü, öğrencilerin dikkatini konuya çekmek amacıyla Dünya Sağlık Haftası’nın anlam ve önemini açıklayan kısa bir sunumla başlamıştır. Sunum sırasında kişisel hijyen, dengeli beslenme, düzenli uyku ve fiziksel aktivitenin insan sağlığı üzerindeki olumlu etkileri öğrencilere yaş seviyelerine uygun örneklerle anlatılmıştır. Öğrencilerin sorularına yer verilerek onların sürece aktif katılımları desteklenmiştir.

Bilgilendirme bölümünün ardından eğitsel oyunlara geçilmiştir. Anaokulu öğrencileri için düzenlenen süt içme yarışması büyük ilgi görmüş, öğrencilerin sağlıklı beslenmeye yönelik olumlu tutum geliştirmelerine katkı sağlamıştır. Yumurta taşıma yarışı öğrencilerin dikkat ve koordinasyon becerilerini desteklerken, mendil kapmaca ve çuval yarışı gibi geleneksel çocuk oyunları öğrencilerin fiziksel gelişimlerini desteklemiştir. Sandalye kapmaca etkinliği ise öğrencilerin dikkat, hız ve refleks becerilerini kullanmalarına olanak sağlamıştır.

Etkinliklerin tamamı boyunca öğrencilerin büyük bir heyecan ve istekle sürece katıldıkları gözlemlenmiştir. Yarışmalar sırasında öğrenciler arasında sağlıklı bir rekabet ortamı oluşmuş, aynı zamanda arkadaşlarını destekleme ve takım ruhuyla hareket etme davranışları ön plana çıkmıştır.

Programın sonunda katılım belgeleri tüm öğrencilere takdim edilmiş, dereceye giren öğrencilere ise madalyaları verilmiştir. Bu ödüllendirme süreci öğrencilerin motivasyonunu artırmış ve etkinliklerin onlar açısından unutulmaz bir deneyim hâline gelmesini sağlamıştır.

Etkinlik süreci boyunca okul yönetimi, öğretmenler ve öğrencilerle etkili bir iletişim kurulmuştur. Okulun sıcak ve samimi atmosferi, öğrencilerin etkinliklere gönüllü olarak katılmalarını kolaylaştırmıştır. Özellikle öğretmenlerin öğrencileri motive edici yaklaşımları etkinliklerin verimliliğini artırmıştır.

Öğrencilerin bilişsel ve duyuşsal motivasyonlarının oldukça yüksek olduğu gözlemlenmiştir. Sağlıklı yaşam konusunda yapılan sunum sonrasında öğrencilerin konu hakkında daha bilinçli ifadeler kullandıkları, oyunlar sırasında ise iş birliği, paylaşma ve yardımlaşma davranışlarını sergiledikleri görülmüştür.

Süreç içerisinde ciddi bir problem yaşanmamış olmakla birlikte, kalabalık öğrenci gruplarında zaman yönetiminin etkinliklerin akışını doğrudan etkilediği deneyimlenmiştir. İlerleyen süreçlerde benzer çalışmalar yapılacak olursa oyun sürelerinin daha ayrıntılı planlanmasının etkinliğin verimini artıracağı düşünülmektedir.

Etkinlik sonrasında öğrencilerden oldukça olumlu geri bildirimler alınmıştır. Öğrencilerin büyük çoğunluğu oyunların çok eğlenceli geçtiğini ifade etmiş ve benzer etkinliklerin tekrar düzenlenmesini istediklerini belirtmiştir. Özellikle madalyalar ve katılım belgeleri öğrenciler üzerinde kalıcı ve olumlu bir etki bırakmıştır.

Sunum sonrasında öğrencilerin sağlıklı beslenme alışkanlıkları hakkında daha bilinçli konuşmaları ve günlük yaşamlarında daha fazla süt tüketmek, hijyen kurallarına dikkat etmek gibi davranışlardan bahsetmeleri etkinliğin amacına ulaştığını göstermiştir.

Gerçekleştirdiğimiz bu çalışma, öğretmenlik mesleğinin yalnızca sınıf içerisinde ders anlatmaktan ibaret olmadığını; öğrencilerin sosyal ve duygusal gelişimlerini destekleyen etkinliklerin de eğitim sürecinin önemli bir parçası olduğunu göstermiştir.

Bu süreç sayesinde planlama, ekip çalışması, zaman yönetimi, iletişim kurma ve organizasyon becerilerimizi geliştirme fırsatı bulduk. Aynı zamanda farklı yaş gruplarındaki öğrencilerle etkili iletişim kurmanın, onların ilgi ve ihtiyaçlarını dikkate almanın öğretmenlik mesleği açısından ne kadar önemli olduğunu deneyimledik.

Genel olarak değerlendirildiğinde, Dünya Sağlık Haftası kapsamında gerçekleştirilen etkinliklerin hem öğrenciler hem de biz öğretmen adayları açısından oldukça verimli geçtiği, eğlenerek öğrenme anlayışını desteklediği ve mesleki gelişimimize önemli katkılar sağladığı düşünülmektedir.
  `,
  en: `
As part of the Out-of-School Activities in Education course, various activities were planned and implemented at Kızılcaşehir Primary School during World Health Week (April 7–14) by our project group consisting of Samet Söyler, Enes Polat, Berat Arslan, Mert Çetintaş, and Ziyettin Devriş under the supervision of Dr. Lecturer Sibel Dal. The activities were organized school-wide and included kindergarten as well as first, second, third, and fourth-grade students.

The primary purpose of selecting World Health Week was to contribute to the development of healthy lifestyle habits among students, raise awareness about balanced nutrition and personal hygiene, and support these achievements through enjoyable learning experiences. Accordingly, activities were designed to support students’ cognitive, affective, and psychomotor development.

While planning the activities, students’ age characteristics, interests, and developmental levels were taken into consideration. Great care was taken to prepare a program that was both educational and entertaining. Preserving traditional children's games and increasing students’ social interaction were also among the important objectives of the project.

During the preparation process, responsibilities were distributed among group members to ensure a systematic workflow. Some members prepared presentation materials related to World Health Week, while others were responsible for obtaining materials for the games and organizing activity areas. Participation certificates, medals, competition rules, and the overall activity schedule were also prepared by our group.

Throughout the process, continuous communication was maintained with the school administration and teachers, and the activity areas were determined collaboratively. Thanks to the support provided by the school administration, necessary materials were supplied and the activity environment was prepared with student safety in mind. The school’s positive attitude and willingness to cooperate contributed significantly to the smooth implementation of the planned activities.

Special emphasis was placed on practices that would ensure active student participation. In addition to presentations on healthy living and balanced nutrition, activities such as a milk-drinking competition, egg-and-spoon race, handkerchief-catching game, sack race, and musical chairs were planned. In this way, students were encouraged to learn while having fun.

On the day of the event, activities began with a brief presentation explaining the meaning and importance of World Health Week. Topics such as personal hygiene, balanced nutrition, regular sleep, and the positive effects of physical activity on health were explained using age-appropriate examples. Students were encouraged to participate actively by asking questions and sharing their thoughts.

Following the presentation, educational games were carried out. The milk-drinking competition organized for kindergarten students attracted great interest and helped promote positive attitudes toward healthy nutrition. The egg-and-spoon race supported students’ attention and coordination skills, while traditional games such as handkerchief-catching and sack racing contributed to their physical development. The musical chairs activity provided opportunities for students to use their attention, speed, and reflexes.

Throughout all activities, students participated with great enthusiasm and willingness. Healthy competition emerged during the games, while behaviors such as supporting friends and acting with team spirit came to the forefront.

At the end of the program, participation certificates were presented to all students, and medals were awarded to those who achieved top results. This reward system increased students’ motivation and helped make the activities a memorable experience.

Throughout the implementation process, effective communication was established with the school administration, teachers, and students. The warm and friendly atmosphere of the school encouraged students to participate voluntarily. In particular, the motivating attitudes of the teachers increased the overall effectiveness of the activities.

It was observed that students’ cognitive and affective motivation levels were quite high. Following the presentation on healthy living, students demonstrated greater awareness of the topic, while during the games they displayed cooperation, sharing, and helping behaviors.

Although no major problems were encountered during the process, it was observed that time management directly affected the flow of activities when working with large groups of students. For future implementations, more detailed planning of game durations may further improve efficiency.

Very positive feedback was received from students after the activities. Most students stated that the games were very enjoyable and expressed their desire for similar events to be organized again. The medals and participation certificates left a particularly positive and lasting impression on them.

The fact that students talked more consciously about healthy eating habits after the presentation and mentioned behaviors such as drinking more milk and paying closer attention to hygiene rules demonstrated that the activities successfully achieved their objectives.

This experience showed us that the teaching profession is not limited to classroom instruction alone; activities that support students’ social and emotional development are also an essential part of the educational process.

Through this experience, we had the opportunity to improve our planning, teamwork, time management, communication, and organizational skills. We also experienced firsthand how important it is for teachers to communicate effectively with students of different age groups and to consider their interests and needs.

Overall, it is believed that the activities carried out during World Health Week were highly productive for both the students and us as prospective teachers, supported the concept of learning through enjoyment, and made significant contributions to our professional development.
  `
},
    images: [
        "assets/images/etkinlik6.1.png",
        "assets/images/etkinlik6.2.png",
        "assets/images/etkinlik6.3.png",
        "assets/images/etkinlik6.4.png",
        "assets/images/etkinlik6.5.png",
        "assets/images/etkinlik6.6.png",
    ],
    coverImage: "assets/images/etkinlik6.1.png"
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
    tr: `
Eğitimde Program Dışı Etkinlikler dersi kapsamında grup olarak; Halime Cemre Keleş, Selenay Deniz, Gülten Çapar, Gizem Düldül, Furkan Saygılı ve Dilan Oktay ile birlikte Hayate Hanım İlkokulu bünyesinde çeşitli etkinlikler gerçekleştirdik. Bu süreçte, Aslan Uslu öğretmenimizin 4. sınıf öğrencileriyle birlikte çalışarak etkinlikleri uygulama fırsatı bulduk. Öğrenciler etkinliklere gönüllü olarak katılmış, süreç boyunca oldukça istekli, aktif ve ilgili bir şekilde yer almışlardır.

1–8 Mayıs Trafik ve İlk Yardım Haftası kapsamında düzenlediğimiz etkinliklerimizi Alanya Belediyesi Trafik Eğitim Merkezi bünyesinde uyguladık. Bu etkinlik, 4. sınıf Trafik Güvenliği dersi kapsamında öğrencilerin trafik kurallarını yalnızca teorik olarak öğrenmelerini değil, aynı zamanda günlük yaşamla ilişkilendirerek uygulamalı biçimde deneyimlemelerini sağlamak amacıyla planlanmıştır. Etkinlik sürecinde öğrencilerin trafik bilinci kazanmaları, güvenli davranış geliştirmeleri ve trafik kurallarının bireysel ve toplumsal yaşam açısından önemini fark etmeleri hedeflenmiştir. Drama, oyunlaştırma, gözlem ve gezi-gözlem gibi öğrenci merkezli yöntemler kullanılarak öğrencilerin aktif katılım göstermeleri desteklenmiştir.

Etkinliğin uygulanacağı okulun seçilme sürecinde öğrencilerin yaş düzeyine uygun öğrenme ortamına sahip olması, ulaşım açısından uygun konumda bulunması ve uygulamalı etkinliklerin gerçekleştirilebilmesine elverişli fiziki imkânlar sunması dikkate alınmıştır. Ayrıca okul yönetiminin iş birliğine açık olması, sosyal etkinliklere destek vermesi ve öğrencilerin aktif öğrenme süreçlerine katılımını önemsemesi seçim sürecinde etkili olmuştur. Bunun yanında okulun Alanya Trafik Çocuk Eğitim Parkı ile gerçekleştirilecek gezi etkinliği için uygun planlama imkânı sunması da tercih edilme nedenleri arasında yer almıştır.

Etkinlik süreci önceden ayrıntılı biçimde planlanmıştır. İlk aşamada öğrencilerin dikkatini çekmek ve konuya hazırbulunuşluklarını artırmak amacıyla “Trafik Işığı Oyunu” uygulanmıştır. Daha sonra öğrencilerle birlikte trafik kuralları üzerine beyin fırtınası yapılmış ve “Trafikte en önemli kural ……” cümlesi tamamlatılarak öğrencilerin ön bilgileri ortaya çıkarılmıştır. Sürecin devamında “Bir Anlık Dikkatsizlik” adlı drama etkinliği uygulanmış, öğrenciler farklı roller üstlenerek trafik ortamında karşılaşılabilecek durumları canlandırmıştır. Drama etkinliği sayesinde öğrenciler hem empati kurma fırsatı bulmuş hem de doğru ve yanlış davranışları yaşayarak öğrenmiştir.

Etkinlik kapsamında öğrencilerle birlikte trafik levhası boyama çalışmaları yapılmış, trafik kurallarını içeren afişler hazırlanmış ve gezi kuralları hakkında bilgilendirme çalışmaları gerçekleştirilmiştir. Ayrıca Alanya Trafik Çocuk Eğitim Parkı gezisi ile öğrencilerin öğrendikleri bilgileri gerçek yaşam ortamında gözlemlemeleri sağlanmıştır. Gezi sırasında öğrenciler küçük gruplara ayrılarak trafik levhalarını incelemiş, rehber anlatımlarını dinlemiş ve trafik güvenliği ile ilgili gözlemlerini paylaşmıştır. Emniyet kemeri simülatörü uygulamasıyla öğrenciler trafik güvenliğinin önemini somut şekilde deneyimleme fırsatı bulmuştur.

Süreç boyunca okul yönetimi gerekli bürokratik işlemlerin yürütülmesinde, ulaşım planlamasında ve etkinliklerin düzenlenmesinde destek sağlamıştır. Öğrencilerin etkinliklere karşı oldukça istekli ve motive oldukları gözlemlenmiş, özellikle drama etkinliği ve trafik eğitim parkı gezisi öğrencilerin derse aktif katılımını artırmıştır. Öğrenciler etkinlik sürecinde hem eğlenmiş hem de trafik kurallarının yaşam güvenliği açısından taşıdığı önemi fark ederek kalıcı öğrenmeler gerçekleştirmiştir.

Gerçekleştirdiğimiz trafik güvenliği etkinliği kapsamında okul seçiminde büyük bir sorun yaşamadık. Etkinliğin uygulanacağı okulun fiziksel ortamı, öğrenci profili ve etkinlik için uygun alanlara sahip olması seçim sürecimizi kolaylaştırdı. Okul yönetimi etkinlik sürecine olumlu yaklaştı, gerekli izinler ve planlamalar konusunda destek sağladı. Ayrıca öğretmenler ve idareciler süreç boyunca iş birliği içerisinde hareket ederek etkinliğin daha düzenli ve verimli ilerlemesine katkıda bulundu.

Trafik güvenliği etkinliğinin seçilmesindeki en önemli motivasyon kaynaklarımızdan biri, öğrencilerin günlük yaşamlarında sürekli karşılaştıkları trafik kuralları konusunda bilinç kazanmalarının büyük önem taşımasıdır. Özellikle küçük yaş gruplarında trafik farkındalığının erken dönemde oluşturulmasının, ileriki yaşamlarında daha dikkatli ve sorumluluk sahibi bireyler yetişmesine katkı sağlayacağını düşündük. Bunun yanında etkinliğin drama, oyunlaştırma ve uygulamalı öğrenme gibi eğlenceli yöntemlerle desteklenmesi de etkinliği tercih etmemizde etkili olmuştur.

Etkinlik sürecinde farklı görevlerde aktif olarak yer aldık. Drama etkinliklerinin planlanması, öğrencilerin rol dağılımlarının yapılması, sunumların hazırlanması, gezi organizasyonu, emniyet kemeri simülatöründe görev alma ve öğrencilerin etkinlik sürecindeki yönlendirmeleri gibi görevler üstlendik. Etkinlik genel olarak trafik kurallarının öğrencilere eğlenceli ve uygulamalı yöntemlerle öğretilmesini amaçlamıştır. Süreçte trafik ışığı oyunu oynattık, drama çalışmaları gerçekleştirdik, trafik levhalarını inceledik ve Trafik Eğitim Parkı gezisi düzenledik. Böylece öğrencilerin öğrendiklerini günlük yaşamla ilişkilendirmeleri sağlanmıştır.

Öğrencilerin etkinliğe karşı hem bilişsel hem de duyuşsal motivasyonlarının oldukça yüksek olduğunu gözlemledik. Özellikle drama etkinlikleri ve oyunlaştırılmış uygulamalar öğrencilerin dikkatini çekmiş, derse aktif katılım göstermelerini sağlamıştır. Öğrenciler etkinlik boyunca meraklı, heyecanlı ve öğrenmeye istekli davranmışlardır. Trafik polisi, sürücü ve yaya rollerini canlandırmaları onların empati kurmalarına ve kuralların önemini daha iyi anlamalarına yardımcı olmuştur.

Öğrenci motivasyonunu artırmak amacıyla çeşitli çalışmalar yaptık. Oyunlaştırma teknikleri kullandık, öğrencilerin aktif katılım gösterebileceği drama etkinlikleri hazırladık ve dersi görsellerle destekledik. Ayrıca öğrencilere trafik dedektifi rozeti verilmesi, slogan çalışmaları yapılması ve gezi etkinliği düzenlenmesi öğrencilerin derse olan ilgisini artırdı. Öğrencilerin fikirlerini özgürce ifade edebilmeleri için soru-cevap etkinliklerine de yer verdik.

Trafik Eğitim Parkı'nın atmosferi etkinliğin uygulanması açısından oldukça uygun oldu. Trafik Eğitim Parkı yönetimi gerekli materyallerin hazırlanması, gezi planlaması ve sınıf ortamının düzenlenmesi konusunda destek sağladı. Ayrıca öğretmenlerin iş birliği içerisinde olması öğrencilerin etkinlik sürecine daha rahat uyum sağlamasına yardımcı oldu. Güvenli ve destekleyici ortam sayesinde öğrenciler etkinliklere aktif şekilde katılmıştır.

Gerçekleştirdiğimiz etkinliğin amaçlarına büyük ölçüde ulaştığını düşünmekteyiz. Öğrencilerin trafik kurallarına yönelik bilgi düzeylerinde artış olduğu; özellikle yaya geçidi kullanımı, emniyet kemeri takmanın önemi ve trafik ışıklarına uyma konularında bilinç geliştirdiklerini gözlemledik. Bunun yanında öğrencilerin grup çalışmaları sayesinde iş birliği yapma, iletişim kurma ve sorumluluk alma becerileri de gelişmiştir.

Aynı etkinlik tekrar yapılacak olsaydı, uygulama öğrencilerin daha uygun ve boş zamanlarında gerçekleştirilebilirdi. Ders saatleriyle çakıştığı için zamanlama konusunda bazı sıkıntılar yaşadık. Bu nedenle etkinlik yeniden düzenlenecek olursa drama çalışmalarına daha fazla süre ayırabilir ve öğrencilerin bireysel katılımını artıracak farklı uygulamalara yer verebilirdik. Ayrıca gezi süresinin biraz daha uzun tutulması, öğrencilerin uygulamalı öğrenmelerine daha fazla katkı sağlayabilirdi.

Etkinlik sürecinde ve sonrasında öğrencilerden olumlu dönütler aldık. Öğrenciler etkinliklerin eğlenceli geçtiğini ifade etti; özellikle drama etkinlikleri ve trafik parkı gezisinden çok etkilendiklerini belirttiler. Bazı öğrenciler günlük yaşamlarında artık trafik kurallarına daha fazla dikkat edeceklerini söyledi. Bu durum bize etkinliğin kalıcı öğrenmeler oluşturduğunu gösterdi.

Bu deneyim, öğrencilerin yaparak ve yaşayarak öğrendiklerinde bilgileri daha kalıcı şekilde öğrendiklerini göstermiştir. Aynı zamanda etkinlik planlama, sınıf yönetimi ve öğrencilerle etkili iletişim kurma konularında önemli deneyimler kazanmamıza katkı sağlamıştır. Süreç boyunca öğrencilerin aktif katılımının öğrenme üzerinde ne kadar etkili olduğu daha iyi anlaşılmıştır.

Kendimizi geliştirmemiz gerektiğini düşündüğümüz yönlerden biri zaman yönetimi olmuştur. Özellikle uygulamalı etkinliklerde süreyi daha dengeli kullanmanın etkinliğin verimliliğini artıracağını fark ettik.

Bu etkinlikler öğrencilerin iletişim kurma, problem çözme, empati yapma, sorumluluk alma ve grup içinde iş birliği yapma gibi yönlerini ön plana çıkarmıştır. Özellikle drama etkinlikleri öğrencilerin kendilerini ifade etme becerilerini geliştirmiş ve özgüven kazanmalarına katkı sağlamıştır.

Genel olarak değerlendirildiğinde etkinlik sürecinde başarılı olduğumuzu düşünüyoruz. Öğrencilerin etkinliklere aktif katılım göstermesi, olumlu geri bildirimlerde bulunması ve trafik kuralları konusunda farkındalık kazanmaları etkinliğin amacına ulaştığını göstermektedir. Hem eğitici hem de eğlenceli bir öğrenme ortamı oluşturulmuş olması, etkinliğin başarısını destekleyen önemli unsurlardan biri olmuştur.
    `,
    en: `
As part of the Out-of-School Activities in Education course, our group consisting of Halime Cemre Keleş, Selenay Deniz, Gülten Çapar, Gizem Düldül, Furkan Saygılı, and Dilan Oktay carried out various activities at Hayate Hanım Primary School. During this process, we had the opportunity to implement the activities together with the 4th-grade students of our mentor teacher, Aslan Uslu. The students participated voluntarily and remained highly enthusiastic, active, and engaged throughout the entire process.

The activities organized within the scope of Traffic and First Aid Week, celebrated between May 1–8, were conducted at the Alanya Municipality Traffic Education Center. The activity was planned not only to help students learn traffic rules theoretically but also to enable them to experience and apply these rules in connection with daily life. The main objectives were to help students develop traffic awareness, gain safe behavior habits, and recognize the importance of traffic rules for both individual and social life. Student-centered methods such as drama, gamification, observation, and field trips were used to encourage active participation.

In selecting the school where the activities would be implemented, factors such as providing a learning environment appropriate for the students’ age level, being conveniently located, and offering suitable physical facilities for practical activities were taken into consideration. In addition, the school administration’s openness to cooperation, support for social activities, and emphasis on active student participation played an important role in the selection process. Another reason for choosing the school was its suitability for organizing the field trip to the Alanya Traffic Children’s Education Park.

The activity process was planned in detail beforehand. In the first stage, the “Traffic Light Game” was implemented to attract students’ attention and increase their readiness for the topic. Afterwards, a brainstorming session about traffic rules was conducted, and students were asked to complete the sentence, “The most important rule in traffic is …,” allowing us to reveal their prior knowledge. In the next stage, a drama activity titled “A Moment of Carelessness” was carried out, where students took on different roles and acted out situations that might occur in traffic. Through this drama activity, students had the opportunity to develop empathy and learn correct and incorrect behaviors through experience.

As part of the activities, students participated in traffic sign painting activities, prepared posters about traffic rules, and received information about field trip regulations. In addition, a visit to the Alanya Traffic Children’s Education Park allowed students to observe the knowledge they had learned in a real-life setting. During the trip, students were divided into small groups to examine traffic signs, listen to guides, and share their observations regarding traffic safety. Through the seatbelt simulator activity, students had the opportunity to experience the importance of traffic safety in a concrete way.

Throughout the process, the school administration supported us in carrying out the necessary bureaucratic procedures, transportation planning, and organization of the activities. It was observed that students were highly motivated and eager to participate. In particular, the drama activity and the visit to the Traffic Education Park increased students’ active participation in the learning process. Students both enjoyed themselves and achieved lasting learning outcomes by recognizing the importance of traffic rules for life safety.

We did not encounter any major problems in the school selection process. The physical environment of the school, the student profile, and the availability of suitable areas for the activities made the process easier. The school administration approached the project positively and provided support regarding permissions and planning. Teachers and administrators also cooperated throughout the process, contributing to the smooth and efficient implementation of the activities.

One of our greatest sources of motivation for choosing the topic of traffic safety was the importance of helping students gain awareness of traffic rules that they encounter in their daily lives. We believed that creating traffic awareness at an early age would contribute to raising more careful and responsible individuals in the future. Furthermore, the use of enjoyable methods such as drama, gamification, and experiential learning played a significant role in our decision to choose this activity.

Throughout the process, we actively took on different responsibilities. These included planning drama activities, assigning roles to students, preparing presentations, organizing the field trip, assisting with the seatbelt simulator, and guiding students during the activities. The overall aim of the project was to teach traffic rules through enjoyable and practical methods. We conducted the Traffic Light Game, organized drama activities, examined traffic signs, and arranged a visit to the Traffic Education Park. In this way, students were encouraged to connect what they learned with their daily lives.

We observed that students’ cognitive and emotional motivation levels were very high. Drama activities and gamified practices especially attracted their attention and encouraged active participation. Throughout the activities, students displayed curiosity, excitement, and a willingness to learn. Acting as traffic police officers, drivers, and pedestrians helped them develop empathy and better understand the importance of traffic rules.

To increase student motivation, we carried out various activities. We used gamification techniques, prepared drama activities that encouraged active participation, and supported lessons with visual materials. Additionally, traffic detective badges, slogan activities, and the educational trip increased students’ interest in the subject. Question-and-answer activities were also included to provide students with opportunities to express their ideas freely.

The atmosphere of the Traffic Education Park was highly suitable for implementing the activities. The administration of the park provided support regarding the preparation of materials, trip planning, and organization of the learning environment. The cooperation of teachers also helped students adapt more easily to the activities. Thanks to the safe and supportive environment, students actively participated throughout the process.

We believe that the activity largely achieved its intended objectives. We observed an increase in students’ knowledge of traffic rules, particularly regarding the use of pedestrian crossings, the importance of wearing seatbelts, and obeying traffic lights. In addition, group activities contributed to the development of cooperation, communication, and responsibility skills.

If we were to implement the same activity again, we would schedule it during times that are more convenient for students. Since it overlapped with lesson hours, we experienced some difficulties regarding timing. Therefore, if the activity were repeated, we would allocate more time to drama activities and include additional practices that would increase individual student participation. Extending the duration of the field trip could also contribute further to experiential learning.

We received positive feedback from students during and after the activity process. Students stated that the activities were enjoyable and that they were particularly impressed by the drama activities and the visit to the Traffic Education Park. Some students mentioned that they would pay more attention to traffic rules in their daily lives. This showed us that the activities resulted in lasting learning outcomes.

This experience demonstrated that students learn more permanently when they learn by doing and experiencing. It also provided us with valuable experience in activity planning, classroom management, and effective communication with students. Throughout the process, we gained a better understanding of how active participation positively affects learning.

One of the areas in which we believe we need further improvement is time management. We realized that using time more efficiently during practical activities would increase the overall effectiveness of the learning process.

These activities highlighted students’ communication, problem-solving, empathy, responsibility, and teamwork skills. In particular, the drama activities contributed to the development of self-expression skills and increased students’ self-confidence.

Overall, we believe that the activity process was successful. Students’ active participation, positive feedback, and increased awareness of traffic rules demonstrate that the activities achieved their objectives. Creating a learning environment that was both educational and enjoyable was one of the most important factors contributing to the success of the project.
`
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
    tr: "Melisa Karataş, Lokman Ernez ve Kenan Bozkurt tarafından Kemal Şuberi İlkokulu’nda 12 Mart İstiklal Marşı'nın Kabulü ve Mehmet Akif Ersoy'u Anma Günü kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities organized by Melisa Karataş, Lokman Ernez, and Kenan Bozkurt at Kemal Şuberi Primary School within the scope of the 12 March National Anthem Acceptance and Mehmet Akif Ersoy Commemoration Day."
},
longDesc: {
  tr: `
Eğitimde Program Dışı Etkinlikler dersi kapsamında Melisa Karataş, Lokman Ernez ve Kenan Bozkurt’tan oluşan grubumuzla Antalya’nın Alanya ilçesinde bulunan Kemal Şuberi İlkokulu’nda 4. sınıf öğrencileriyle 12 Mart İstiklal Marşı’nın Kabulü ve Mehmet Akif Ersoy’u Anma Günü kapsamında çeşitli etkinlikler gerçekleştirdik.

Bu özel günü seçmemizdeki temel amaç; öğrencilerde milli bilinç oluşturmak, İstiklal Marşı’nın anlam ve önemini kavratmak, Mehmet Akif Ersoy’u tanıtmak ve öğrencilerin etkinliklere aktif katılım sağlayarak öğrenmelerini desteklemekti. Program dışı etkinliklerin öğrencilerin yalnızca akademik gelişimlerine değil, aynı zamanda sosyal, duygusal ve değer gelişimlerine de katkı sağladığı düşüncesinden hareket ederek süreci planladık.

Hazırlık Süreci

Etkinlik sürecimiz, okul yönetimi ve öğretmenlerle gerçekleştirdiğimiz görüşmelerle başladı. Okul yönetimi ve öğretmenler sürece oldukça olumlu yaklaştılar ve etkinliklerin planlanması için gerekli desteği sağladılar. Okul seçimi konusunda herhangi bir güçlük yaşanmadı ve ilk görüşmeden itibaren iş birliği içerisinde çalışma fırsatı bulduk.

Etkinliklerin öğrencilerin yaş düzeyine uygun olması için sınıf öğretmenimizden destek aldık. Başlangıçta hazırladığımız programın öğrencilerin dikkat süreleri açısından uzun olabileceği yönünde geri bildirim aldığımız için etkinlikleri yeniden düzenledik ve daha etkili hale getirdik. Hazırlık sürecinde görev paylaşımı yaparak koro çalışmaları, oratoryo metinleri, bayrak hareketleri ve pano tasarımları üzerinde çalıştık. Ayrıca okulun farklı alanlarında provalar gerçekleştirerek öğrencilerin etkinliklere hazırlanmasını sağladık.

Uygulama Günü

12 Mart etkinlikleri kapsamında öğrencilerle birlikte “Ayyıldızlı Bayrağım” adlı koro çalışmasını ve bayrak hareketlerini hazırladık. Bunun yanında “İstiklal Marşı Oratoryosu” etkinliğini gerçekleştirerek öğrencilerin rol alma, seslendirme ve etkili ifade becerilerini kullanmalarına fırsat sunduk. Öğrenciler yalnızca izleyici olarak değil, etkinliklerin doğrudan bir parçası olarak sürece katıldılar.

Ayrıca günün anlam ve önemini yansıtan pano çalışmalarıyla okul ortamının zenginleştirilmesine katkı sağladık.

Gözlemlerimiz

Süreç boyunca okul atmosferinin oldukça destekleyici olduğunu gözlemledik. Okul yönetimi ve öğretmenler prova alanları sağlayarak ve yönlendirmelerde bulunarak çalışmalarımıza önemli katkılar sundular. Öğrencilerin etkinliklere karşı hem bilişsel hem de duyuşsal motivasyonlarının yüksek olduğu dikkat çekti.

Özellikle koro ve oratoryo çalışmalarında öğrencilerin iş birliği yapma, grup uyumu sağlama ve sorumluluk alma becerilerinin geliştiği gözlemlendi. Yapılan düzenlemeler sayesinde öğrencilerin etkinlik boyunca ilgilerini korudukları görüldü.

Çocuklardan Aldığımız Dönütler

Öğrenciler etkinliklerde aktif rol almaktan büyük mutluluk duyduklarını ifade ettiler. Koro çalışmalarında birlikte hareket etmekten keyif aldıklarını, oratoryo etkinliğinde ise sahnede yer almanın kendilerini heyecanlandırdığını belirttiler.

Etkinlik sonrasında öğrencilerin İstiklal Marşı’nın anlamı ve Mehmet Akif Ersoy’un Türk milletine kazandırdığı değerler hakkında daha bilinçli yorumlar yapabildikleri gözlemlendi. Bu durum öğrenmelerin kalıcı hâle geldiğine dair önemli bir gösterge oldu.

Bu Deneyimin Bize Kazandırdıkları

Bu süreç, program dışı etkinliklerin eğitim sürecindeki önemini daha yakından görmemizi sağladı. Öğrencilerin aktif katılım gösterdiği etkinliklerin öğrenmeyi daha anlamlı ve kalıcı hâle getirdiğini deneyimledik. Aynı zamanda etkinlik planlama, uygulama ve değerlendirme süreçlerinde zaman yönetimi, görev paylaşımı ve öğrenci seviyesine uygun materyal seçimi konularında kendimizi geliştirme fırsatı bulduk.

Genel olarak süreç hem öğrenciler hem de bizler için verimli ve öğretici geçti. Bu deneyim, gelecekteki öğretmenlik yaşamımızda kullanabileceğimiz önemli kazanımlar elde etmemizi sağladı.
  `,
  en: `
Within the scope of the “Non-Curricular Activities in Education” course, our group consisting of Melisa Karataş, Lokman Ernez, and Kenan Bozkurt carried out various activities with 4th grade students at Kemal Şuberi Primary School in the Alanya district of Antalya, on the occasion of the 12 March Commemoration of the Acceptance of the Turkish National Anthem and Mehmet Akif Ersoy Memorial Day.

The main purpose of selecting this special day was to foster national awareness among students, help them understand the meaning and importance of the National Anthem, introduce Mehmet Akif Ersoy, and support student learning through active participation in activities. Based on the idea that non-curricular activities contribute not only to academic development but also to students’ social, emotional, and value-based development, the process was planned accordingly.

Preparation Process

The process began with meetings with the school administration and teachers. They approached the activities positively and provided the necessary support for planning. No difficulties were encountered in selecting the school, and cooperation was established from the first meeting.

To ensure that the activities were appropriate for students’ age levels, we received support from the classroom teacher. After feedback indicated that the initial program might be too long for students’ attention span, we revised and improved it. During preparation, we worked on choir pieces, oratory scripts, flag movements, and poster designs. We also conducted rehearsals in different areas of the school to prepare students for the activities.

Implementation Day

On 12 March, we prepared the “Ayyıldızlı Bayrağım” choir performance and flag movements with students. Additionally, we carried out the “National Anthem Oratory” activity, allowing students to take roles, perform, and express themselves effectively. Students were not only spectators but active participants in the activities.

We also contributed to enriching the school environment through themed posters reflecting the meaning and importance of the day.

Observations

Throughout the process, we observed a highly supportive school environment. The administration and teachers provided rehearsal spaces and guidance, contributing significantly to our work. Students showed high levels of cognitive and affective motivation.

In particular, choir and oratory activities helped students develop cooperation, group cohesion, and responsibility skills. Adjustments made during the process helped maintain students’ attention throughout the activities.

Feedback from Students

Students expressed great happiness in taking active roles in the activities. They enjoyed working together in the choir and felt excited about performing on stage in the oratory activity.

After the event, it was observed that students developed a better understanding of the meaning of the National Anthem and the values Mehmet Akif Ersoy brought to the Turkish nation. This indicated meaningful and lasting learning.

What This Experience Gave Us

This process helped us better understand the importance of non-curricular activities in education. We experienced how active student participation makes learning more meaningful and permanent. We also improved our skills in planning, implementation, time management, teamwork, and selecting appropriate materials for student levels.

Overall, the process was productive and educational for both students and us. It provided valuable professional experience for our future teaching careers.
  `
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
        tr: "18 Mart Çanakkale Zaferi ve Şehitleri Anma Günü",
        en: "March 18 Çanakkale Victory and Martyrs Commemoration Day"
    },
    shortDesc: {
         tr: "Melisa Karataş, Lokman Ernez ve Kenan Bozkurt tarafından Kemal Şuberi İlkokulu’nda 18 Mart Çanakkale Zaferi ve Şehitleri Anma Günü kapsamında gerçekleştirilen etkinlikler.",
         en: "Activities organized by Melisa Karataş, Lokman Ernez, and Kenan Bozkurt at Kemal Şuberi Primary School within the scope of March 18 Çanakkale Victory and Martyrs Commemoration Day."
    
},
   longDesc: {
  tr: `
Etkinliğin Tanıtımı
Eğitimde Program Dışı Etkinlikler dersi kapsamında Melisa Karataş, Lokman Ernez ve Kenan Bozkurt’tan oluşan grubumuzla Antalya’nın Alanya ilçesinde bulunan Kemal Şuberi İlkokulu’nda 18 Mart Çanakkale Zaferi ve Şehitleri Anma Günü kapsamında çeşitli etkinlikler gerçekleştirdik.

Bu özel günü seçmemizdeki temel amaç; öğrencilerde tarih bilinci oluşturmak, Çanakkale Zaferi’nin önemini kavratmak, şehitlerimizin fedakârlıklarını anlamalarını sağlamak ve öğrencilerin etkinliklere aktif katılım göstererek öğrenmelerini desteklemekti.

Hazırlık Süreci
12 Mart etkinliklerinde gerçekleştirilen çalışmaların okul öğretmenleri tarafından beğenilmesi üzerine, okul yönetimi ve öğretmenler tarafından 18 Mart programına da katkı sunmamız istendi. Bu doğrultuda etkinlik planlamalarına dahil olduk ve öğrencilerle yapılacak çalışmaları hazırladık.

Hazırlık sürecinde görev paylaşımı yaparak koro çalışmaları ve pano tasarımları üzerinde çalıştık. Öğrencilerin yaş düzeylerine uygun içerikler belirleyerek etkinliklerin hem öğretici hem de dikkat çekici olmasına özen gösterdik.

Uygulama Günü
18 Mart etkinlikleri kapsamında öğrencilerle birlikte “Gazi Diyor Çanakkale Geçilmez” adlı şarkının koro çalışmasını gerçekleştirdik. Şarkıya eşlik eden çalışmalarla öğrencilerin Çanakkale ruhunu hissederek öğrenmelerini desteklemeyi amaçladık.

Bunun yanında günün anlam ve önemini yansıtan pano çalışmalarının hazırlanmasına katkı sağladık. Öğrenciler etkinliklerde aktif görev alarak sürece büyük bir istekle katıldılar.

Gözlemlerimiz
Süreç boyunca okul yönetimi ve öğretmenlerin desteğini hissettik. Öğrencilerin etkinliklere karşı oldukça ilgili ve istekli oldukları gözlemlendi. Özellikle koro çalışmalarında öğrencilerin birlikte hareket etme, iş birliği yapma ve sorumluluk alma becerilerinin geliştiği dikkat çekti.

Etkinliklerin öğrencilerin tarihî olaylara karşı farkındalık geliştirmelerine katkı sağladığı ve Çanakkale Zaferi’nin anlamını daha iyi kavramalarına yardımcı olduğu gözlemlendi.

Çocuklardan Aldığımız Dönütler
Öğrenciler etkinliklere katılmaktan mutluluk duyduklarını ve Çanakkale Zaferi hakkında yeni bilgiler öğrendiklerini ifade ettiler. Koro çalışmalarında görev almak ve arkadaşlarıyla birlikte sahneye çıkmak öğrenciler için heyecan verici bir deneyim oldu.

Etkinlik sonrasında öğrencilerin Çanakkale Zaferi’nin tarihimiz açısından önemini ve şehitlerimizin fedakârlıklarını daha bilinçli bir şekilde ifade edebildikleri görüldü.

Bu Deneyimin Bize Kazandırdıkları
Bu süreç, program dışı etkinliklerin öğrencilerin milli ve manevi değerleri içselleştirmelerinde önemli bir rol oynadığını göstermiştir. Öğrencilerin aktif katılım sağladığı etkinliklerin öğrenmeyi daha kalıcı hâle getirdiğini gözlemledik.

Ayrıca etkinlik planlama, organizasyon, iletişim ve uygulama becerilerimizi geliştirme fırsatı bulduk. Bu deneyim, öğretmenlik mesleğinin yalnızca akademik öğretimden ibaret olmadığını; öğrencilerin sosyal, duygusal ve değer gelişimlerini destekleyen etkinliklerin de eğitimin önemli bir parçası olduğunu anlamamıza katkı sağladı.
  `,
  en: `
Activity Introduction
Within the scope of the “Out-of-School Activities in Education” course, our group consisting of Melisa Karataş, Lokman Ernez, and Kenan Bozkurt carried out various activities at Kemal Şuberi Primary School in Alanya, Antalya, for the 18 March Çanakkale Victory and Martyrs’ Memorial Day.

The main purpose of choosing this special day was to develop students’ historical awareness, help them understand the importance of the Çanakkale Victory, make them comprehend the sacrifices of our martyrs, and support their learning through active participation in activities.

Preparation Process
Following the appreciation of the activities conducted in the 12 March program by the school teachers, the school administration and teachers requested our contribution to the 18 March program as well. Accordingly, we joined the planning process and prepared activities to be carried out with the students.

During the preparation process, we distributed tasks and worked on choir practices and board designs. We selected content appropriate for students’ age levels and ensured that the activities were both instructive and engaging.

Implementation Day
Within the scope of the 18 March activities, we conducted the choir practice of the song “Gazi Diyor Çanakkale Geçilmez” with the students. Through accompanying activities, we aimed to help students feel the spirit of Çanakkale while learning.

In addition, we contributed to preparing boards reflecting the meaning and importance of the day. Students actively participated in the activities with great enthusiasm.

Observations
Throughout the process, we felt the strong support of the school administration and teachers. It was observed that students were highly interested and willing to participate in the activities. Especially in choir practices, students developed skills in cooperation, teamwork, and taking responsibility.

It was also observed that the activities helped students develop awareness of historical events and better understand the meaning of the Çanakkale Victory.

Feedback from Students
Students expressed that they were happy to take part in the activities and learned new information about the Çanakkale Victory. Participating in choir work and performing on stage with their friends was an exciting experience for them.

After the activities, it was observed that students could express the importance of the Çanakkale Victory and the sacrifices of our martyrs more consciously.

What This Experience Gave Us
This process showed that out-of-school activities play an important role in helping students internalize national and moral values. We observed that active participation makes learning more permanent.

We also had the opportunity to improve our planning, organization, communication, and implementation skills. This experience helped us understand that teaching is not only about academic instruction, but also about supporting students’ social, emotional, and value-based development through meaningful activities.
  `
},
    images: [
        "assets/images/etkinlik8.6.png",

    ],  
    coverImage: "assets/images/etkinlik8.6.png"
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
  tr: `
Giriş ve Etkinlik Süreci

Bizler, Alanya Alaaddin Keykubat Üniversitesi Sınıf Öğretmenliği bölümü öğretmen adayları olarak, Program Dışı Etkinlikler dersi kapsamında kültürel mirasımızı tanıtmak amacıyla Fatma Özmüftüoğlu İlkokulu'nda öğrenim gören 22 kişilik 3. sınıf öğrenci grubuyla gönüllülük esasına dayalı bir alan gezisi gerçekleştirdik.

Okul seçimi sürecinde, okul yönetiminin program dışı etkinliklere olan vizyoner yaklaşımı ve öğrencilerin gezi-gözlem yoluyla öğrenmeye olan istekli profili etkili oldu. Etkinliğimizin temel amacı, öğrencilerin yakın çevrelerinde yer alan tarihi mekanları tanımaları, koruma bilinci geliştirmeleri ve tarihi sadece kitaplardan değil, yerinde yaşayarak öğrenmelerini sağlamaktı.

Planlama ve Uygulama Süreci

Etkinliğimiz, öğrencilerin ilgisini çekmek amacıyla sınıfta gizemli bir atmosfer yaratılıp Alanya Kalesi'ndeki yapılarla (sarnıç, cami, dokuma tezgâhı vb.) ilgili bilmeceler sorulmasıyla başladı. Öğrencilere "Alanya Tarih Kâşifi" pasaportları, yaka kartları ve gruplarını temsil eden renkli bileklikler dağıtılarak güdülenme sağlandı.

Alanya Kalesi'nde; Ömürlü Kemal Atlı Kültür Evi, Sarnıç, Herbaryum, Süleymaniye Camii ve Bedesten olmak üzere beş farklı istasyon belirlendi. Akran öğretimi tekniğiyle her grup kendi istasyonunun uzmanı olarak edindiği bilgileri diğer arkadaşlarına aktardı. Gezinin ardından Kültür Evi'nde görülen dokuma tezgahından ilham alınarak taşınabilir çerçevelerle "Geçmişin İlmekleri - Kilim Dokuma Atölyesi" gerçekleştirildi. Süreç, yaratıcı yazma çalışması ve öz değerlendirme formlarının doldurulmasıyla son buldu. Okul yönetimi ve öğretmenlerin ulaşım, izin belgeleri ve saha organizasyonu konusundaki destekleri sayesinde etkinlik kusursuz bir şekilde tamamlandı. Öğrencilere verilen "Tarih Kâşifi" rolü, süreç boyunca motivasyonlarının ve katılımlarının en üst düzeyde kalmasını sağladı.

Değerlendirme ve Deneyim Paylaşımı

Gerçekleştirilen bu sınıf dışı eğitim etkinliği, okul yönetimi ve sınıf öğretmeninin sürece son derece sıcak bakması, yasal izinler ile ulaşım organizasyonu konularında sağladıkları büyük kolaylıklar sayesinde tamamen sorunsuz bir şekilde hayata geçirilmiştir. Yenilikçi eğitim yaklaşımlarına açık olan okulun idari süreçleri hızla çözmesi ve öğretmenlerin rehberlik desteği, çalışmanın başarısında önemli bir rol oynamıştır.

Projenin seçilmesindeki en büyük motivasyon kaynağı ise 3. sınıf Hayat Bilgisi dersinde yer alan "Yakın çevresinde yer alan tarihi, doğal ve turistik yerlerin özelliklerini tanıtır" kazanımını somutlaştırabilme fırsatı olmuştur. Öğrencilerin sarnıçlardaki yankıyı bizzat duyması, herbaryumdaki doğa mirasına tanıklık etmesi ve en önemlisi kilim dokuma atölyesi aracılığıyla kültürü kendi elleriyle üreterek içselleştirmesi fikri, çalışma grubuna büyük bir ilham vermiştir.

Bu doğrultuda grup üyeleriyle birlikte gezi öncesi saha keşfi yapılmış; "Kaşif Pasaportları", bilmeceler ve dokuma tezgâhları gibi materyaller ortaklaşa hazırlanmıştır. Gezi esnasında ise istasyon liderliği, akran öğretimi kolaylaştırıcılığı ve kilim dokuma atölyesinde öğrencilere birebir rehberlik etme görevleri başarıyla üstlenilmiştir.

Etkinlik boyunca öğrencilerin hem bilişsel hem de duyuşsal motivasyonları en üst seviyede seyretmiştir. Bu motivasyonu canlı tutmak adına çocuklara geleneksel birer öğrenci gibi değil, birer "Tarih Kâşifi" olarak yaklaşılmıştır. Gezi öncesinde bilmecelerle merak duygusu uyandırılmış, ziyaret edilen her mekânda çocukların pasaportlarına onay mührü basılmış ve gruplara ayrılan öğrencilere akran öğretimi sorumluluğu verilmiştir.

Gelecekte bu etkinlik tekrarlanacak olursa, Herbaryum istasyonunda öğrencilerin bitkileri daha yakından inceleyebilmesi için sürece büyüteç veya basit mikroskopların eklenmesi düşünülmektedir. Ayrıca açık alanda yönerge verme tekniklerinin daha da geliştirilmesi gerektiği bir öz eleştiri ve gelişim alanı olarak not edilmiştir.

Tüm bu süreç, çalışma grubuna sınıf dışı eğitim ortamlarında kalabalık bir grubu yönetme, zamanı etkili kullanma ve dış mekânın dikkat dağıtıcı unsurlarına karşı kriz yönetimi becerilerini kazandırmıştır. Etkinlik ise çocukların merak duygularını, akran öğretimi sayesinde iş birliği becerilerini ve kilim dokuma yoluyla ince motor becerilerini ön plana çıkarmıştır.

Öğrencilerden süreç boyunca ve sonrasında son derece heyecanlı ve anlamlı dönütler alınmıştır. Çocukların; eskiden su bulmanın ne kadar zor olduğunu fark ettiklerini söylemeleri, kendi dokudukları kilimleri odalarına asacaklarını belirtmeleri ve tarih dedektifi olmanın eğlencesinden bahsetmeleri, gezi sonrasındaki yaratıcı yazma formlarında tarihe dair kurdukları empatiyle birleşerek etkinliğin amacına ulaştığını net bir şekilde ortaya koymuştur.

Sonuç olarak tüm öğrencilerin pasaportlarını eksiksiz doldurması, her birinin farklı renklerde ama ortak bir hikâyeyi anlatan kilim parçaları dokuması ve gün sonunda tarihi koruma bilincini kendi cümleleriyle ifade edebilmeleri, projenin kesin bir başarıya ulaştığını göstermektedir. Bu çalışma ile sadece bir gezi yapılmamış; çocukların zihninde Alanya'nın tarihine dair kalıcı ve derin bir anı inşa edilmiştir.
  `,
  en: `
Introduction and Activity Process

As pre-service primary school teachers from Alanya Alaaddin Keykubat University, we organized a voluntary field trip with a group of 22 third-grade students from Fatma Özmüftüoğlu Primary School within the scope of the Out-of-School Activities course in order to introduce and promote our cultural heritage.

The school's visionary approach toward extracurricular activities and the students' willingness to learn through observation and exploration played a significant role in the school selection process. The main objective of the activity was to help students recognize historical sites in their immediate environment, develop awareness about cultural preservation, and learn history through direct experience rather than solely from textbooks.

Planning and Implementation Process

The activity began with the creation of a mysterious classroom atmosphere where students were asked riddles about structures located in Alanya Castle, such as cisterns, mosques, and weaving looms. Students were provided with “Alanya History Explorer” passports, name tags, and colorful wristbands representing their groups in order to increase motivation.

Five different stations were established within Alanya Castle: Ömürlü Kemal Atlı Culture House, the Cistern, Herbarium, Süleymaniye Mosque, and Bedesten. Using the peer-teaching method, each group became the expert of its assigned station and shared the acquired knowledge with other students. Following the visit, students participated in the “Threads of the Past – Kilim Weaving Workshop,” inspired by the weaving loom displayed in the Culture House. The process concluded with creative writing activities and self-evaluation forms. Thanks to the support of the school administration and teachers regarding transportation, permissions, and field organization, the activity was completed successfully. Assigning students the role of “History Explorers” ensured high levels of motivation and participation throughout the process.

Evaluation and Reflection

This outdoor learning activity was implemented smoothly thanks to the supportive attitude of the school administration and classroom teacher, as well as the assistance provided regarding legal permissions and transportation arrangements. The school's openness to innovative educational approaches and the guidance of teachers played a key role in the success of the project.

The greatest source of motivation behind the project was the opportunity to concretize the third-grade Life Studies learning outcome: “Identifies the characteristics of historical, natural, and touristic places in the immediate environment.” Allowing students to hear the echo inside cisterns, witness the natural heritage preserved in the herbarium, and most importantly internalize culture through the kilim weaving workshop provided strong inspiration for the project team.

Prior to the trip, a site exploration was conducted and materials such as Explorer Passports, riddles, and weaving frames were collaboratively prepared. During the trip, group members successfully undertook responsibilities including station leadership, peer-teaching facilitation, and individual guidance during the weaving workshop.

Students demonstrated exceptionally high cognitive and emotional motivation throughout the activity. To maintain this enthusiasm, they were approached not merely as students but as “History Explorers.” Curiosity was stimulated through riddles before the trip, passports were stamped at every station, and peer-teaching responsibilities were assigned to group members.

If the activity were to be repeated in the future, magnifying glasses or simple microscopes could be incorporated into the Herbarium station to allow students to examine plants more closely. Additionally, improving instruction-giving techniques in outdoor environments was identified as an area for future professional development.

This process provided valuable experience in managing large groups in outdoor learning environments, using time effectively, and handling distractions in open spaces. The activity highlighted students’ curiosity, collaboration skills through peer teaching, and fine motor skills through weaving activities.

Students provided highly enthusiastic and meaningful feedback throughout and after the project. Their comments about realizing how difficult it was to obtain water in the past, planning to display their woven kilims in their rooms, and enjoying the role of history detectives clearly demonstrated the success of the activity. Their creative writing pieces further revealed empathy toward historical life and cultural heritage.

In conclusion, the fact that all students completed their explorer passports, created unique pieces of a shared kilim story, and were able to express their understanding of historical preservation in their own words demonstrates that the project successfully achieved its objectives. More than a simple field trip, this experience created a lasting and meaningful memory of Alanya’s history in the minds of the students.
  `
},
    images: [
        "assets/images/etkinlik10.1.png",
        "assets/images/etkinlik10.2.png",
        "assets/images/etkinlik10.3.png",
        "assets/images/etkinlik10.4.png",
        "assets/images/etkinlik10.5.png",
        "assets/images/etkinlik10.6.png",
        "assets/images/etkinlik10.7.png",
        "assets/images/etkinlik10.8.png",
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


    etkinlik12: {
    id: "etkinlik12",
    category: "gallery1",
    title: {
        tr: "Yağ Satarım Bal Satarım Yarışması-okullar arası yarışma",
        en: "Yağ Satarım Bal Satarım Competition - Inter-school Competition"
    },
    shortDesc: {
  tr: "İnönü İlkokulu 2. sınıf öğrencileriyle ‘Yağ Satarım Bal Satarım’ geleneksel çocuk oyunu etkinliği gerçekleştirildi. Gökhan Deniz, İrem Gündüz, Mehmet Abdullah Aslan, Muhammed Peker ve Yusuf Renas Gündoğdu tarafından yürütülmüştür.",
  en: "A traditional children's game activity ‘Yağ Satarım Bal Satarım’ was conducted with 2nd grade students at İnönü Primary School. The activity was carried out by Gökhan Deniz, İrem Gündüz, Mehmet Abdullah Aslan, Muhammed Peker, and Yusuf Renas Gündoğdu."
},
   longDesc: {
  tr: `
Bu çalışma, Eğitimde Program Dışı Etkinlikler dersi kapsamında Dr. Öğr. Üyesi Sibel Dal hocamızın yönlendirmesiyle İnönü İlkokuluna yönlendirmesiyle grubumuz tarafından gerçekleştirilmiştir. Etkinliğimize grup üyelerimiz gönüllü olarak katılım sağlamıştır. Seçtiğimiz ilkokulun müziğe ve yarışmalara olan ilgisi ile dinamik yapısı, bu etkinlikleri yürütmede bizi oldukça motive etti.

Yağ Satarım Bal Satarım Oyunu: Bu etkinlikte aktif rol aldık. Oyun alanının çizilmesi, yarışmacı öğrencilerin belirlenmesi, hizalanması ve hakemlik görevini yerine getirdik. Etkinliğimizi yaklaşık 10 hafta boyunca, haftada bir gün prova yaparak gerçekleştirdik.
  `,
  en: `
This study was carried out within the scope of the “Out-of-School Activities in Education” course under the guidance of Assist. Prof. Dr. Sibel Dal at İnönü Primary School by our group. Our group members participated voluntarily in the activity. The dynamic structure of the selected school and its strong interest in music and competitions motivated us significantly during the implementation process.

“Yağ Satarım Bal Satarım” Game: We took an active role in this activity. We were responsible for drawing the game area, selecting and lining up participating students, and acting as referees. The activity was conducted over approximately 10 weeks, with practice sessions held once a week.
  `
},
    images: [
        "assets/images/etkinlik12.1.png",
        "assets/images/etkinlik12.2.png",
        "assets/images/etkinlik12.3.png",
    ],
    coverImage: "assets/images/etkinlik12.1.png"
    },  

etkinlik13: {
    id: "etkinlik13",
    category: "gallery1",
    title: {
      tr: "Dünya Oyun Günü- Geleneksel Çocuk Oyunları Etkinliği",
      en: "World Games Day - Traditional Children's Games Activity"
    },
    shortDesc: {
    tr: "Muhammed Delil Taş tarafından Mahmutlar İlkokulu’nda gerçekleştirilen Geleneksel Çocuk Oyunları etkinlikleri.",
    
    en: "Traditional Children's Games activities organized by Muhammed Delil Taş at Mahmutlar Primary School."
},
    longDesc: {
  tr: `
Etkinliğin Tanıtımı
Eğitimde Program Dışı Etkinlikler dersi kapsamında, Mahmutlar İlkokulunda 29 Nisan - 28 Mayıs Dünya Oyun Günü dolayısıyla Sınıf İçi ve Bahçe Oyunları Öğretimi ve Uygulamaları gerçekleştirilmiştir. Bu etkinlikler, 29 Nisan 2026 tarihinden itibaren başlayarak 5 haftalık bir sürece yayılmış ve 2/G sınıfı öğrencileriyle yürütülmüştür.

Dünya Oyun Günü kapsamındaki bu çalışmaların seçilmesindeki temel amaç, gün boyu akademik derslerle yorulan öğrencilerin eğlenmesi, rahatlaması ve günün yorgunluğunu atmasıdır. Günümüz eğitim anlayışında oyun, yalnızca bir boş zaman aktivitesi değil; çocukların zihinsel esneklik, beden kontrolü ve sosyal uyum becerilerini geliştirdikleri en önemli öğrenme aracıdır. Bu doğrultuda hazırlanan etkinliklerde öğrencilerin bilişsel, duyuşsal ve psikomotor (temel hareket becerileri, mekân farkındalığı, yönergelere uyma) gelişimlerini destekleyen oyunlara yer verilmiştir.

Etkinliklerin planlanmasında öğrencilerin yaş özellikleri ve sınıf dinamikleri dikkate alınmış, hem öğretici hem de eğlenceli bir program hazırlanmasına özen gösterilmiştir. Aynı zamanda sınıf içi kurallara uyma, takım ruhu oluşturma ve yönergeleri dikkatle dinleme becerilerinin artırılması da hedeflenen önemli kazanımlar arasında yer almıştır.

Hazırlık Süreci
Etkinliklerin planlama aşamasında sistemli bir çalışma süreci oluşturulmuş ve oyun takvimi haftalara bölünerek organize edilmiştir. Hazırlık sürecinde, öğrencilerin enerjilerini en verimli şekilde kullanabilmeleri adına oyun saatleri özellikle günün son iki ders saatine planlanmıştır. Her hafta farklı çocuk oyunları seçilmiş; oyunların bilişsel ve duyuşsal öğrenme çıktıları (BEO, SDÖB, HB, TÜR, MAT) önceden belirlenmiştir. Sürecin sonunda öğrencilerden geri bildirim alabilmek amacıyla görsel ve yazılı unsurlar barındıran "2. Sınıf Oyun Değerlendirme Formu" özel olarak tasarlanmıştır.

Bu süreçte okul yönetimi ve özellikle değerli sınıf öğretmenimiz İlyas Hoca ile sürekli iletişim hâlinde olunmuş, oyunların uygulanacağı sınıf ve bahçe alanları koordineli bir şekilde kullanılmıştır. Mahmutlar İlkokulu idaresinin sağladığı güvenli ortam ve öğretmenin rehberliği, planlanan çalışmaların sorunsuz bir şekilde yürütülmesine önemli katkı sağlamıştır.

Hazırlık aşamasında hem sınıf içi hem de açık hava etkinlikleri dengeli bir şekilde dağıtılmış; Gece ve Gündüz, Deve ve Cüce, Sıcak ve Soğuk, Bom Oyunu, Meyve Sepeti, Yeşil Işık Kırmızı Işık ve Kulaktan Kulağa gibi etkileşimli oyunlar programa dâhil edilmiştir.

Uygulama Günü
Etkinlik süreci, 29 Nisan 2026 tarihinde "Gece & Gündüz" oyunu ile başlamıştır. Oyun öncesinde kurallar ve komutlar öğrencilere açık bir şekilde aktarılmış; sürecin kimi anlarında yönlendirici bir rehber rolü üstlenilirken, kimi zaman da oyunlara doğrudan dâhil olunarak öğrencilere eşlik edilmiştir.

Bilgilendirme ve kural aktarımı bölümlerinin ardından hemen uygulamalara geçilmiştir. Sınıf içi etkinliklerde "Deve ve Cüce" ile hızlanan komutlar eşliğinde tatlı bir rekabet yaşanırken, "Sıcak ve Soğuk" oyununda tek bir ritimde ebeye ipucu verilmesi sınıfın takım ruhunu güçlendirmiştir. "Öğretmen Diyor Ki" etkinliğinde ise liderlik görevi bir süre sonra öğrencilere devredilerek onların sorumluluk alma bilinçleri desteklenmiştir. Bahçe etkinliği olan "Yeşil Işık Kırmızı Işık" oyununda ise öğrenciler açık havanın verdiği rahatlıkla enerjilerini atmış ve denge kurma becerilerini eğlenerek test etmişlerdir.

Etkinliklerin tamamı boyunca öğrencilerin büyük bir heyecan ve istekle sürece katıldıkları gözlemlenmiştir. Ritmik sayma becerisini geliştiren "Bom Oyunu"nda sayılar büyüdükçe artan tatlı stres ve "Meyve Sepeti"nde boş sandalye kapmaya çalışırken oluşan coşku, oyunların ne kadar ilgi çekici olduğunu ortaya koymuştur. "Kulaktan Kulağa" oyunuyla ise gün sonu yorgunluğu kahkahalar eşliğinde atılmıştır.

Gözlemlerimiz
Etkinlik süreci boyunca sınıf öğretmeni İlyas Hoca ve öğrencilerle son derece uyumlu ve etkili bir iletişim kurulmuştur. Okulun destekleyici atmosferi, çocukların oyunlara aktif ve çekinmeden katılmalarını sağlamıştır. Süreç içerisinde öğrencilerin sadece oyun oynamakla kalmadığı; aynı zamanda kurallara uyma, yanıldığında oyundan çıkmayı saygıyla kabul etme ve kendini frenleme (dürtü kontrolü) becerilerini de başarıyla sergiledikleri gözlemlenmiştir.

Öğrencilerin oyunlara karşı motivasyonlarının oldukça yüksek olduğu, komutlara karşı dikkatlerini hızla toparladıkları ve takım arkadaşlarına destek oldukları görülmüştür. Örneğin "Sıcak ve Soğuk" oyununda nesneyi bulan ebenin sevincine tüm sınıfın alkışlarla ortak olması önemli bir gözlemdi. Süreç boyunca herhangi bir problem yaşanmamış, aksine öğrenci grubunun enerjisi ve neşesi dersin verimini maksimum seviyeye çıkarmıştır.

Çocuklardan Aldığımız Dönütler
5 haftalık oyun öğretimi sürecinin sonunda, öğrencilere dağıtılan "2. Sınıf Oyun Değerlendirme Formu" aracılığıyla çok kıymetli dönütler alınmıştır. Öğrenciler, öğretilen 8 oyunu görsel bir ölçek üzerinden değerlendirerek öz değerlendirme yapma ve tercih bildirme şansı bulmuşlardır.

Öğrenciler kendi favori oyunlarını belirlerken ve formun arka yüzüne bu oyunları neden sevdiklerini yazarken büyük bir heves göstermişlerdir. Örneğin, bazı öğrenciler "Kulaktan Kulağa" oyununda kelimelerin birbirine karışmasını çok eğlenceli bulduklarını yazılı olarak ifade etmişlerdir. Bu uygulama, öğrencilere fikirlerinin önemsendiğini hissettirmiş ve hangi oyun türlerinin sınıf dinamiğine daha uygun olduğunu açıkça göstermiştir.

Bu Deneyimin Bize Kazandırdıkları
Gerçekleştirdiğimiz bu 5 haftalık süreç, öğretmenlik mesleğinin yalnızca akademik ders aktarımından ibaret olmadığını, oyunun çocuk dünyasındaki en güçlü iletişim dili olduğunu bizlere bir kez daha göstermiştir.

Bu süreç sayesinde sınıf yönetimi, kural aktarımı, akran zorbalığını önleyerek takım ruhu oluşturma ve zaman yönetimi becerilerimizi geliştirme fırsatı bulduk. Aynı zamanda etkinlikleri uyguladıktan sonra ölçme-değerlendirme araçları (Oyun Değerlendirme Formu) kullanarak süreci bilimsel ve pedagojik bir çerçevede analiz etmenin önemini kavradık.

Genel olarak değerlendirildiğinde, Dünya Oyun Günü kapsamında gerçekleştirilen etkinliklerin hem öğrenciler açısından hem de sınıf içi dinamikleri yönetme tecrübesi edinen biz öğretmen adayları açısından son derece verimli geçtiği ve mesleki gelişimimize büyük katkılar sunduğu değerlendirilmektedir. Desteklerini esirgemeyen sınıf öğretmenimiz İlyas Hoca'ya, Mahmutlar İlkokulu İdaresi'ne ve oyunlara neşe katan 2/G sınıfı öğrencilerine teşekkürlerimizi sunarız.
  `,
  en: `
Activity Introduction
Within the scope of the “Out-of-School Activities in Education” course, class games instruction and implementation activities were carried out at Mahmutlar Primary School for World Play Day between 29 April and 28 May. These activities were conducted over a 5-week period starting from 29 April 2026 with the 2/G class.

The main purpose of these activities was to help students relax, have fun, and relieve academic fatigue from daily lessons. In modern education, play is not only a leisure activity but also one of the most important learning tools that develop children’s cognitive flexibility, motor control, and social adaptation skills. Accordingly, the activities included games supporting cognitive, affective, and psychomotor development.

The activities were designed considering students’ age levels and class dynamics, ensuring both educational and enjoyable experiences. Another important objective was to improve classroom rule compliance, teamwork, and attentive listening to instructions.

Preparation Process
A systematic planning process was established, and the game schedule was organized on a weekly basis. Game sessions were planned for the last two class hours of the day so that students could use their energy effectively. Different games were selected each week, and their learning outcomes (BEO, SDÖB, HB, TÜR, MAT) were predefined. A “2nd Grade Game Evaluation Form” was designed to collect student feedback at the end of the process.

Continuous communication was maintained with the school administration and especially the class teacher, İlyas Hoca. Classroom and outdoor spaces were used in coordination. The supportive environment provided by Mahmutlar Primary School and the teacher contributed significantly to the smooth execution of the activities.

Both indoor and outdoor games such as Day & Night, Camel and Dwarf, Hot and Cold, Boom Game, Fruit Basket, Red Light Green Light, and Telephone Game were included.

Implementation Day
The process began on 29 April 2026 with the “Day & Night” game. Rules and instructions were clearly explained before each activity. At times a guiding role was taken, while at other times active participation was included.

After instruction, activities were implemented directly. In “Camel and Dwarf,” students experienced friendly competition; in “Hot and Cold,” teamwork was strengthened; in “Teacher Says,” leadership was gradually transferred to students. In “Red Light Green Light,” students enjoyed outdoor movement and balance control activities.

Throughout the activities, students participated with great enthusiasm. The “Boom Game” improved rhythm and counting skills, while “Fruit Basket” created excitement through quick reactions. The “Telephone Game” ended the day with laughter and enjoyment.

Observations
A strong and effective communication was established with the class teacher and students. The school environment supported active participation. Students demonstrated rule compliance, self-control, and respect for game rules. No major problems were encountered, and the energetic atmosphere increased the efficiency of the activities.

Student Feedback
At the end of the 5-week process, valuable feedback was collected through the “2nd Grade Game Evaluation Form.” Students evaluated the 8 games visually and expressed their preferences and reasons. Many students especially enjoyed the “Telephone Game” due to its humorous distortions.

This process made students feel that their opinions were valued and helped identify which games best fit the class dynamics.

What This Experience Gave Us
This 5-week process once again showed that teaching is not limited to academic instruction and that play is the most powerful communication language of children.

We improved our skills in classroom management, rule enforcement, teamwork development, and time management. Using evaluation tools such as the Game Evaluation Form also helped us analyze the process within a pedagogical framework.

Overall, the activities conducted for World Play Day were highly productive for both students and teacher candidates, contributing significantly to our professional development.
  `
},
    images: [
    "assets/images/etkinlik13.1.png",
    "assets/images/etkinlik13.2.png",
    "assets/images/etkinlik13.3.png",
    "assets/images/etkinlik13.4.png",
    "assets/images/etkinlik13.5.png",
    "assets/images/etkinlik13.6.png",
    "assets/images/etkinlik13.7.png",
    "assets/images/etkinlik13.8.png",
    "assets/images/etkinlik13.9.png"
    ],
    coverImage: "assets/images/etkinlik13.2.png"
  },

  etkinlik14: {
    id: "etkinlik14",
    category: "gallery1", 
    title: {
      tr: "18 Mart Çanakkale Zaferi ve Şehitleri Anma Günü",
      en: "March 18th Çanakkale Victory and Martyrs' Remembrance Day"
    },
    shortDesc: {
  tr: "Songül Karademir, Elif Nisa Kestek ve İbrahim Halil Akkuş tarafından Nezihat Abdullah Doğan İlkokulunda 18 Mart Çanakkale Zaferi ve Şehitleri Anma Günü kapsamında 3. sınıf öğrencileriyle çeşitli anma etkinlikleri gerçekleştirildi.",
  en: "Various commemorative activities were carried out by Songül Karademir, Elif Nisa Kestek, and İbrahim Halil Akkuş with 3rd grade students at Nezihat Abdullah Doğan Primary School as part of the March 18 Çanakkale Victory and Martyrs' Memorial Day."
},

longDesc: {
tr: `
Etkinliğin Tanıtımı

Eğitimde Program Dışı Etkinlikler dersi kapsamında, Dr. Öğr. Üyesi Sibel Dal danışmanlığında Songül Karademir, Elif Nisa Kestek ve İbrahim Halil Akkuş'tan oluşan çalışma grubumuz tarafından Antalya ili Alanya ilçesinde bulunan Nezihat Abdullah Doğan İlkokulunda 18 Mart Çanakkale Zaferi ve Şehitleri Anma Günü kapsamında çeşitli etkinlikler düzenlenmiştir. Çalışmalar 3. sınıf öğrencileriyle yürütülmüştür. 18 Mart Çanakkale Zaferi ve Şehitleri Anma Günü, öğrencilerin millî tarih bilinci kazanmaları, vatan sevgisi ve fedakârlık gibi değerleri tanımaları, geçmiş ile günümüz arasında güçlü bir bağ kurabilmeleri açısından büyük öneme sahip bir belirli gün ve haftadır. Bu haftanın seçilmesindeki amaç, öğrencilerin millî ve manevi değerlere yönelik farkındalıklarını artırmak, tarih bilincini geliştirmek ve Çanakkale ruhunun, vatan sevgisinin ve bağımsızlık mücadelesinin önemini kavramalarını sağlamaktır. Etkinlikler öğrencilerin bilişsel, duyuşsal ve psikomotor becerilerini geliştirmeye yönelik planlanmış, öğrencilerin yaş ve gelişim düzeyleri dikkate alınmıştır.

Hazırlık Süreci

Etkinliklerin planlama aşamasında grup üyeleri arasında görev paylaşımı yapılarak sistematik bir çalışma süreci oluşturulmuştur. Bu süreçte okul müdürü ve sınıf öğretmeni ile sürekli iletişim hâlinde olunmuş, okul yönetimi gerekli desteği sağlamıştır. 18 Mart Çanakkale Zaferi ve Şehitleri Anma Günü kapsamında öğrencilerle birlikte pano hazırlığı, savaş dönemini yansıtan tematik bir köşenin oluşturulması, dönemin askerî yemek listesinin şövale üzerinde sergilenmesi, üzüm hoşafı ve ekmek dağıtımı ile Çanakkale'nin önemini içeren açıklamaların yapılması etkinlikleri planlanmıştır. Gerekli etkinlik materyalleri hazırlanmış, tarih ve zaman planlaması yapılmıştır.

Uygulama Süreci

İlkokul Hayat Bilgisi dersi öğretim programında yer alan millî gün, hafta ve tarihî değerlerin önemiyle ilgili öğrenme çıktıları kapsamında okul bünyesinde kapsamlı bir 18 Mart Çanakkale Zaferi ve Şehitleri Anma Günü projesi hayata geçirilmiştir. Bu projenin temel hareket noktasını öğrencilerin tarihî olayları empati yoluyla içselleştirmelerini sağlamak ve millî bilinç düzeylerini artırmak oluşturmuştur.

Sürecin ilk aşamasında öğrencilerin aktif katılımıyla günün anlam ve önemini içeren açıklayıcı metinler ile görsel materyallerden oluşan tematik pano çalışmaları gerçekleştirilmiş, eş zamanlı olarak tören provaları yakından gözlemlenerek hazırlıklar tamamlanmıştır. Dönemin sosyo-tarihsel atmosferini somutlaştırmak amacıyla okul bahçesinde sembolik bir askerî çadır kurularak tematik bir Çanakkale köşesi oluşturulmuştur. Bu alana yerleştirilen şövale üzerinde askerlerin cephedeki zorlu şartlarını ve beslenme durumunu yansıtan tarihî askerî yemek listesi sunulmuştur.

Anma gününde millî bilinci ve empati duygusunu geliştirmek amacıyla dönemin asker karavanasını simgeleyen üzüm hoşafı ve ekmek dağıtımı yapılmış, böylece öğrencilere duyusal ve deneyimsel bir öğrenme ortamı sunulmuştur. Resmî tören sırasında ise öğretmenlerin katılımıyla “Çanakkale Geçilmez” temalı pankart açılarak canlandırma etkinlikleri gerçekleştirilmiştir. Bu uygulama, somut işlemler dönemindeki öğrencilerin soyut tarih bilincini daha anlaşılır ve somut bir şekilde kavramalarına katkı sağlamıştır.

Gözlemlerimiz

Uygulama süreci boyunca okul yönetimi, öğretmenler ve öğrenciler arasında etkili bir iletişim kurulmuştur. Süreç boyunca öğrencilerin millî ve tarihî konulara yönelik bilişsel ve duyuşsal hazırbulunuşluk düzeylerinin yüksek olduğu gözlemlenmiştir. Yapılan etkinliklerin ardından öğrencilerin millî bilinç, tarihî empati ve ortak tarih bilinciyle ilgili kazanımlarını çeşitli ifadelerle ortaya koydukları görülmüştür.

Tematik çadır kurulumu, askerî yemek listesinin sergilenmesi, üzüm hoşafı ve ekmek dağıtımı ile canlandırma etkinlikleri sırasında öğrencilerin paylaşım, yardımlaşma ve iş birliği davranışlarını sergiledikleri gözlemlenmiştir. Uygulama sürecinde planlanan büyük çadır parçalarındaki eksiklik nedeniyle materyal kaynaklı bir problem yaşanmış, ancak bu durum kısa sürede çözülerek yerine sembolik bir küçük maket çadır kullanılmıştır.

Çocuklardan Aldığımız Dönütler

Etkinlik sonrasında yapılan değerlendirmelerde somutlaştırma çalışmalarının öğrenciler üzerinde güçlü bir akademik ve duyuşsal etki bıraktığı görülmüştür. Özellikle dönemin asker karavanasını simgeleyen üzüm hoşafı ve ekmek ikramı, öğrencilerin cephede yaşanan zorlukları daha iyi anlamalarına yardımcı olmuştur. Bu uygulamanın tarihsel empati becerilerinin gelişimine katkı sağladığı gözlemlenmiştir.

Ayrıca alanda sergilenen küçük maket çadır ve şövale üzerindeki tarihî askerî yemek listesi öğrencilerin yoğun ilgisini çekmiş, tarihî bilgilerin daha somut ve kalıcı hâle gelmesine katkı sağlamıştır.

Bu Deneyimin Bize Kazandırdıkları

Bu uygulama, teorik pedagojik bilgilerin sahadaki uygulamalarla bütünleştirilmesi açısından mesleki gelişimimize önemli katkılar sağlamıştır. Özellikle somut işlemler dönemindeki öğrencilere soyut ve tarihî kavramları aktarırken yaparak yaşayarak öğrenme yaklaşımının ve duyusal materyallerin öğretimin kalıcılığı üzerindeki etkisini deneyimleme fırsatı sunmuştur.

Ayrıca kalabalık öğrenci gruplarında zaman yönetimi, organizasyon, materyal kullanımı ve lojistik planlamanın önemini yakından gözlemledik. Bu süreç; okul yönetimi ve öğretmenlerle iş birliği içinde çalışabilme, öğrenci seviyesine uygun etkinlikler planlayabilme ve öğrenme çıktılarının bilişsel ve duyuşsal boyutlarını değerlendirebilme açısından öğretmenlik mesleğine yönelik önemli kazanımlar elde etmemizi sağlamıştır.
 `,

  en: `
Introduction to the Activity

Within the scope of the Out-of-School Activities in Education course, our project group consisting of Songül Karademir, Elif Nisa Kestek, and İbrahim Halil Akkuş, under the supervision of Assist. Prof. Dr. Sibel Dal, organized various activities at Nezihat Abdullah Doğan Primary School in Alanya, Antalya, as part of the March 18 Çanakkale Victory and Martyrs’ Memorial Day. The activities were carried out with 3rd-grade students. This special commemorative day was chosen because it plays an important role in helping students develop national historical awareness, understand the values of patriotism and sacrifice, and build connections between the past and the present. The activities were designed to enhance students’ cognitive, affective, and psychomotor skills while taking their age and developmental characteristics into consideration.

Preparation Process

A systematic planning process was carried out through task sharing among the group members. Throughout the preparation stage, continuous communication was maintained with the school principal and classroom teacher, and the school administration provided the necessary support. The planned activities included preparing bulletin boards with students, creating a thematic corner reflecting the wartime atmosphere, displaying a historical military meal list on an easel, distributing grape compote and bread, and presenting information about the significance of the Çanakkale Victory. Required materials were prepared, and a detailed schedule was created.

Implementation Process

In line with the learning outcomes related to national days, historical values, and social awareness in the primary school Life Science curriculum, a comprehensive March 18 Çanakkale Victory and Martyrs’ Memorial Day project was implemented. The primary objective of the project was to help students internalize historical events through empathy and strengthen their sense of national consciousness.

The process began with students actively participating in the preparation of thematic bulletin boards containing explanatory texts and visual materials about the significance of the day. At the same time, ceremony rehearsals were observed and supported. To concretize the historical atmosphere of the period, a symbolic military tent was set up in the schoolyard, creating a thematic Çanakkale corner. An easel displaying the historical military food menu was placed in this area to illustrate the difficult living and nutritional conditions experienced by soldiers during the war.

On the commemoration day, grape compote and bread, symbolizing the soldiers’ wartime meals, were distributed to students to create a sensory and experiential learning environment. During the official ceremony, teachers participated in dramatization activities while displaying a banner with the message “Çanakkale Is Impassable.” These practices enabled students in the concrete operational stage to better understand and visualize abstract historical concepts.

Our Observations

Throughout the implementation process, effective communication was established among the school administration, teachers, and students. Students demonstrated high levels of cognitive and emotional engagement with historical and national topics. Following the activities, students were able to express ideas related to national consciousness, historical empathy, and collective memory in meaningful ways.

During the thematic tent activities, military meal display, food distribution, and dramatization activities, students consistently demonstrated cooperation, sharing, and social support behaviors. A minor logistical problem occurred due to missing parts of the planned large tent; however, this issue was quickly resolved by replacing it with a symbolic miniature tent.

Feedback from Students

Evaluations conducted after the activities revealed that the concrete and experiential learning experiences had a strong academic and emotional impact on students. In particular, the distribution of grape compote and bread helped students better understand the hardships faced by soldiers during wartime and contributed to the development of historical empathy.

The symbolic tent and the historical military menu display attracted significant interest from students and helped transform abstract historical information into more meaningful and memorable learning experiences.

What This Experience Taught Us

This project made valuable contributions to our professional development by allowing us to transform theoretical pedagogical knowledge into practical educational experiences. It provided firsthand experience in teaching abstract historical concepts to children in the concrete operational stage through experiential learning and sensory-based materials.

Additionally, we gained important experience in time management, organization, logistics, and working with large groups of students. The process enhanced our ability to collaborate with school administrators and teachers, design activities appropriate for students’ developmental levels, and evaluate learning outcomes from both cognitive and affective perspectives. Overall, it was a meaningful experience that strengthened our professional competencies as future teachers.
`
},     images: [
        "assets/images/etkinlik14.1.png",
        "assets/images/etkinlik14.2.png",
        "assets/images/etkinlik14.3.png",
        "assets/images/etkinlik14.4.png",
        "assets/images/etkinlik14.5.png",
        "assets/images/etkinlik14.6.png",
    ],
    coverImage: "assets/images/etkinlik14.1.png"
    },
    
    etkinlik15: {
    id: "etkinlik15",
    category: "gallery1",
    title: {
        tr: "Müzeler Haftası- Müze Gezisi",
        en: "Museum Week - Museum Visit"
    },
    shortDesc: {
  tr: "Songül Karademir, Elif Nisa Kestek ve İbrahim Halil Akkuş tarafından Nezihat Abdullah Doğan İlkokulunda Müzeler Haftasıkapsamında  öğrencilerle  sınıf içi Müze oluşturma ve gezi etkinlikleri gerçekleştirildi.",
  en: "Classroom museum creation and visit activities were organized by Songül Karademir, Elif Nisa Kestek, and İbrahim Halil Akkuş with students at Nezihat Abdullah Doğan Primary School as part of Museum Week."
}, 
    longDesc: {
    tr: `
    Etkinliğin Tanıtımı:

Eğitimde Program Dışı Etkinlikler dersi kapsamında, Dr. Öğr. Üyesi Sibel Dal danışmanlığında Songül Karademir, Elif Nisa Kestek, İbrahim Halil Akkuş ' tan oluşan çalışma grubumuz tarafından Antalya ili Alanya ilçesi Nezihat Abdullah Doğan İlkokulunda Müzeler Haftası (18-24 Mayıs) kapsamında çeşitli etkinlikler uygulanmıştır. Çalışmalar 3. Sınıf öğrencileriyle yürütülmüştür. Müzeler Haftası, öğrencilerin kültürel miras bilinci kazanmaları, tarihî ve sanatsal değerleri tanımaları ve geçmiş ile günümüz arasında bağ kurabilmeleri açısından önemli bir belirli gün ve haftadır. 

Bu haftanın seçilmesindeki amaç, öğrencilerin millî ve evrensel kültürel değerlere yönelik farkındalıklarını artırmak, tarih bilincini geliştirmek ve kültürel mirasın korunmasının önemini kavramalarını sağlamaktır. Etkinlikler öğrencilerin bilişsel, duyuşsal ve psikomotor becerilerini geliştirmeye yönelik planlanmıştır. Etkinliklerin planlanmasında öğrencilerin yaş ve gelişim düzeyleri, ilgi alanları dikkate alınmıştır.

  Hazırlık Süreci: 

Etkinliklerin planlama aşamasında grup üyeleri arasında görev paylaşımı yapılarak sistematik bir çalışma süreci oluşturulmuştur. Bu süreçte okul müdürü ve sınıf öğretmeni ile sürekli iletişim halinde olunmuş, okul yönetimi gerekli desteği sağlamıştır. Müzeler Haftası kapsamında teorik sunum, sınıf müzesinin oluşturulması ve müze gezisi etkinlikleri planlanmıştır. Gerekli etkinlik materyalleri hazırlanmış, tarih ve zaman planlaması yapılmıştır.

  Uygulama Süreci:
 
Müzeler Haftası projesi Hayat Bilgisi dersi HB.3.4.1. (Yakın çevresindeki tarihî mekân ve doğal güzelliklerin korunmasının önemini fark edebilme) öğrenme çıktısıyla doğrudan ilişkilendirilmiştir. Bu kapsamda öğrencilerden ailelerine veya kendilerine ait geçmişi olan, değer verdikleri birer eşya getirmeleri istenmiştir. 

Sınıfa alınan ahşap bir raf ile müze köşesi oluşturulmuş; müzenin ismini belirlemek amacıyla çağdaş bir yöntem olan “Vızıltı 44” tekniğinden yararlanılmıştır. Dörder kişilik grupların kısıtlı sürede ürettiği fikirler tahtaya yazılarak demokratik bir oylamayla müzenin ismi seçilmiştir. Ardından öğrencilere; eserin adı, sahibi ve kısa hikayesinin yazılacağı kartlar dağıtılmış, öğrenciler bu kartları tamamladıktan sonra sırayla eşyalarının hikayesini sınıfa anlatarak rafa yerleştirmiştir. Cuma günü gerçekleştirilecek gezi öncesinde müze kurallarını içeren interaktif bir sunum yapılmıştır. 

Gezi günü öğrencilerin yakasına özel tasarlanan müze rozetleri takılmıştır. Bu uygulama öğrencilerin somut işlemler dönemi özelliklerine uygun olarak öğrenme deneyimini nesnelleştirmelerini sağlamış, kendilerine verilen 'kâşif' rolünü içselleştirmelerine yardımcı olmuş ve süreç içinde otokontrol mekanizmalarını destekleyerek etkili bir sınıf yönetimi aracı olmuştur. Süreç rehber eşliğinde Alanya Müzesi ziyareti ile tamamlanmıştır.

   Gözlemlerimiz:

Uygulama süreci boyunca okul yönetimi, branş öğretmenleri ve öğrenci grubu arasında çok yönlü ve işlevsel bir iletişim ekosistemi inşa edilmiştir. Süreç analizinde, hedef kitlenin bilişsel ve duyuşsal hazırbulunuşluk düzeyleri ile öğrenme motivasyonlarının üst düzeyde olduğu gözlemlenmiştir. Müzeler Haftası bağlamında gerçekleştirilen kavramsal sunumların ardından öğrencilerin; somut olmayan kültürel miras, tarihi eserlerin korunması ve kolektif hafıza unsurlarına dair edindikleri kazanımları, üst düzey bilişsel becerilere uygun ve bilinçli ifadelerle yansıttıkları (öğrenme kanıtları bağlamında) tespit edilmiştir. Sınıf içi müze tasarımı, eser fişi/etiketi hazırlama ve canlandırma temelli işbirlikçi öğrenme faaliyetleri esnasında ise akran etkileşimi, paylaşım, empati ve sosyal yardımlaşma davranışlarının istikrarlı bir şekilde sergilendiği raporlanmıştır. 

Uygulama boyunca öğretim sürecini sekteye uğratacak bir aksaklık yaşanmamış olmakla birlikte; heterojen ve yoğun öğrenci mevcuduna sahip gruplarda, zaman yönetiminin etkinliklerin pedagojik akış hızı ve derinliği üzerinde doğrudan belirleyici bir değişken olduğu deneyimlenmiştir. İlerleyen dönemlerde kültürel miras bilincini geliştirmeye yönelik yapılandırılacak benzer mikro veya makro ölçekli eğitsel tasarımlarda; grup rotasyonlarının ve aktivite sürelerinin kronometrik bir hassasiyetle planlanmasının, öğrencilerin edineceği pedagojik kazanımları ve kalıcı öğrenme çıktılarını üst düzeye çıkaracağı düşünülmektedir.

   Çocuklardan Aldığımız Dönütler:

Uygulama nihayetinde, hedef kitleyi oluşturan öğrenci grubundan oldukça yüksek düzeyde nitelikli ve olumlu geri bildirimler elde edilmiştir. Öğrencilerin büyük bir çoğunluğu, sınıf bünyesinde somut bir müze alanı kurma sürecinin ve ardından gerçekleştirilen müze gezisinin (saha ziyaretinin) son derece güdüleyici olduğunu ifade ederek, benzer kültürel miras etkinliklerinin periyodik olarak tekrarlanması yönünde talepte bulunmuşlardır. 

Kendi sınıf müzelerini inşa etme deneyiminin, gerçek bir müze ziyaretiyle taçlandırılması, soyut tarih kavramlarını somutlaştırarak öğrenciler üzerinde kalıcı, sahiplenici ve olumlu bir iz bırakmıştır. Sınıf müzesi kurulumu, nesne odaklı çalışmalar ve müze gezisi sürecinin ardından öğrencilerin; tarihsel zaman, kültürel süreklilik ve somut miras ögeleri hakkında analitik ve bilinçli bir söylem geliştirdikleri tespit edilmiştir. Öğrencilerin günlük yaşantılarında tarihi yapılara karşı daha duyarlı olma, müze ziyaret kültürünü benimseme ve geçmişe ait eserleri koruma sorumluluğuna dair farkındalık düzeyini yansıtan ifadeler kullanmaları, gerçekleştirilen eğitsel tasarımın mikro sistem düzeyinde davranışsal ve duyuşsal amaçlarına ulaştığını somut bir şekilde ortaya koymaktadır.

   Bu Deneyimin Bize Kazandırdıkları:

Gerçekleştirilen bu çalışma; çağdaş sınıf öğretmeninin yalnızca müfredat aktaran bir figür olmadığını, aksine öğrenme ortamlarını okul dışına taşıyan ve somut deneyim alanları üreten bir "öğrenme mimarı" olması gerektiğini tescillemiştir. Tasarlanan bu süreç, öğretmen adayları olarak bizlerin geleneksel sınıf sınırlarının dışına çıkmasını sağlamış; okul dışı ortamlarda pedagojik süreç yönetimi, kurumlar arası iş birliği mekanizmaları geliştirme ve disiplinler arası materyal tasarımı gibi dinamik yetkinlikleri edinmemizi sağlamıştır. Farklı hazırbulunuşluk düzeylerine sahip çocukların kültürel keşif anlarındaki merak eğilimlerini yerinde gözlemlemek, öğretim süreçlerinde öğrenci merkezli yaklaşımın ve esnek pedagojik reflekslerin mesleki başarıdaki rolünü kavramamızı sağlamıştır. Özetle, Müzeler Haftası bağlamında hayat bulan sınıf müzesi inşası ve ardından yürütülen kurumsal saha ziyareti, teorik bilginin pratik alandaki karşılığını somutlaştıran çift taraflı bir öğrenme ekosistemi yaratmıştır. Sürecin, ilkokul öğrencilerinde tarihsel farkındalık tohumları ekerken, biz geleceğin öğretmenlerinin mesleki öz yeterlilik algısını ve saha tecrübesini de üst aşamaya taşıyan dönüştürücü bir deneyim olduğu düşünülmektedir.
`,

  en: `

Introduction of the Activity:

As part of the Out-of-School Educational Activities course, our working group consisting of Songül Karademir, Elif Nisa Kestek, and İbrahim Halil Akkuş, under the supervision of Dr. Sibel Dal, carried out various activities within the scope of Museums Week (May 18–24) at Nezihat Abdullah Doğan Primary School in Alanya, Antalya. The activities were conducted with 3rd-grade students.

Museums Week is an important commemorative week that helps students develop awareness of cultural heritage, recognize historical and artistic values, and establish connections between the past and the present. The purpose of selecting this special week was to increase students’ awareness of national and universal cultural values, enhance their historical consciousness, and help them understand the importance of preserving cultural heritage. The activities were designed to support students’ cognitive, affective, and psychomotor development while taking into consideration their age, developmental characteristics, and interests.


Preparation Process:

During the planning phase, responsibilities were distributed among group members, creating a systematic working process. Continuous communication was maintained with the school principal and classroom teacher, and the school administration provided the necessary support. Within the scope of Museums Week, a theoretical presentation, the creation of a classroom museum, and a museum visit were planned. Required materials were prepared, and the schedule and timeline were organized accordingly.


Implementation Process:

The Museums Week project was directly associated with the Life Studies curriculum outcome HB.3.4.1: “Recognizing the importance of protecting historical places and natural beauties in one’s immediate environment.”

Within this framework, students were asked to bring an item belonging either to themselves or their families that held personal significance and a connection to the past. A classroom museum corner was created using a wooden shelf brought into the classroom. To determine the museum’s name, the contemporary “Buzz 44” technique was employed. Ideas generated by groups of four students within a limited time were written on the board, and the museum’s name was selected through a democratic voting process.

Students were then given cards on which they recorded the name of the artifact, its owner, and a brief story about it. After completing the cards, students took turns sharing the stories of their objects with the class and placing them on the museum shelf.

Before the museum visit scheduled for Friday, an interactive presentation about museum rules was conducted. On the day of the visit, students wore specially designed museum badges. This practice, appropriate for the characteristics of children in the concrete operational stage, enabled students to concretize their learning experiences, internalize their assigned role as “explorers,” and support self-regulation throughout the process, making it an effective classroom management tool.

The project concluded with a guided visit to the Alanya Museum.


Our Observations:

Throughout the implementation process, a multidimensional and functional communication ecosystem was established among the school administration, subject teachers, and students. Analysis of the process revealed that students demonstrated high levels of cognitive and affective readiness as well as strong learning motivation.

Following the conceptual presentations conducted within the scope of Museums Week, students were observed expressing their newly acquired understanding of intangible cultural heritage, the preservation of historical artifacts, and elements of collective memory through conscious and advanced-level statements, serving as evidence of learning.

During collaborative learning activities such as designing the classroom museum, preparing artifact labels, and role-playing exercises, students consistently demonstrated peer interaction, sharing, empathy, and social cooperation skills.

Although no significant disruptions occurred throughout the implementation, it was observed that time management became a determining factor affecting both the pace and depth of pedagogical activities in large and heterogeneous student groups. For future educational designs aimed at developing cultural heritage awareness, it is believed that planning group rotations and activity durations with greater precision will maximize both pedagogical gains and long-term learning outcomes.


Feedback Received from Students:

At the conclusion of the project, highly positive and meaningful feedback was obtained from the students. Most students stated that both establishing a tangible museum space within their classroom and participating in the museum visit were highly motivating experiences. Many expressed a desire for similar cultural heritage activities to be organized regularly.

The opportunity to create their own classroom museum and subsequently visit a real museum helped students transform abstract historical concepts into concrete experiences, leaving a lasting and positive impression. Following the classroom museum activities, object-based learning experiences, and museum visit, students demonstrated increased awareness and developed more analytical perspectives regarding historical time, cultural continuity, and tangible heritage elements.

Students’ statements reflecting greater sensitivity toward historical structures, a willingness to adopt museum-visiting habits, and an increased sense of responsibility for preserving artifacts from the past indicate that the educational design successfully achieved its behavioral and affective objectives at the micro level.


What This Experience Contributed to Us:

This project demonstrated that the contemporary classroom teacher should not be viewed merely as a transmitter of curriculum content but rather as a “learning architect” who extends learning environments beyond classroom walls and creates meaningful experiential opportunities.

The process encouraged us, as prospective teachers, to move beyond traditional classroom boundaries and gain competencies in managing educational processes in out-of-school settings, developing inter-institutional collaborations, and designing interdisciplinary materials.

Observing the curiosity and exploratory behaviors of children with diverse levels of readiness helped us better understand the importance of student-centered approaches and flexible pedagogical responses in achieving educational success.

In summary, the creation of the classroom museum and the subsequent institutional museum visit established a two-way learning ecosystem that concretized the practical application of theoretical knowledge. While the project planted the seeds of historical awareness in primary school students, it also enhanced our professional self-efficacy and field experience as future teachers. We believe that this experience was transformative, benefiting both the students and us as teacher candidates.
`
}, 
        images: [
            "assets/images/etkinlik15.1.png",
            "assets/images/etkinlik15.2.png",
            "assets/images/etkinlik15.3.png",
            "assets/images/etkinlik15.4.png",
            "assets/images/etkinlik15.5.png",
            "assets/images/etkinlik15.6.png",
            "assets/images/etkinlik15.7.png",
            "assets/images/etkinlik15.8.png",
            "assets/images/etkinlik15.9.png",
            "assets/images/etkinlik15.10.png"
        ],
        coverImage: "assets/images/etkinlik15.1.png"
    },








        bayram1: {
    category: "gallery2",
    title: {
      tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
      en: "April 23rd National Sovereignty and Children's Day"
    },
shortDesc: {
  tr: `Sema ASLAN, Sıla ÇETİNTAŞ, İsmahan ŞAHİN ve Yusuf Samet BULUT tarafından 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında gerçekleştirilen eğitsel ve sosyal etkinlikler.`,

  en: `Educational and social activities organized by Sema ASLAN, Sıla ÇETİNTAŞ, İsmahan ŞAHİN, and Yusuf Samet BULUT within the scope of April 23 National Sovereignty and Children’s Day celebrations.`
},
    longDesc: {
  tr: `
Etkinliğin Tanıtımı

Eğitimde Program Dışı Etkinlikler dersi kapsamında, Dr. Öğr. Üyesi Sibel Dal danışmanlığında Sıla Çetintaş, Sema Aslan, İsmahan Şahin ve Yusuf Samet Bulut’tan oluşan çalışma grubumuz tarafından Kestel Akdeniz İlkokulunda 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında bir etkinlik gerçekleştirilmiştir. Çalışmalarımız üçüncü sınıf öğrencileriyle yürütülmüş olup öğrencilerin bayramın anlam ve önemini yaşayarak öğrenmeleri, sosyal becerilerini geliştirmeleri ve 23 Nisan coşkusunu birlikte paylaşmaları amaçlanmıştır.

23 Nisan Ulusal Egemenlik ve Çocuk Bayramı’nın öğrenciler açısından önemli bir değer taşıdığı düşüncesiyle bu etkinlik planlanmıştır. Sürecin temel amacı, öğrencilerin milli bayram bilinci kazanmalarına katkı sağlamak, kendilerini ifade etmelerine fırsat vermek ve birlikte çalışma becerilerini desteklemektir.

Hazırlık Süreci

Etkinliğin hazırlık süreci sekiz hafta boyunca devam etmiştir. Bu süre içerisinde her hafta düzenli olarak okula gidilerek öğrencilerin tören günü sergileyecekleri dans gösterisi için çalışmalar yapılmıştır. Öğrencilere dans figürleri öğretilmiş, provalar gerçekleştirilmiş ve gösterinin düzenli bir şekilde ilerlemesi için gerekli hazırlıklar yapılmıştır. Hazırlık sürecinde öğrencilerle yakından ilgilenilmiş ve onların etkinliğe aktif katılım göstermeleri için çeşitli çalışmalar yürütülmüştür.

Özellikle başlangıçta çekingen davranan bazı öğrencilerin etkinliklere katılma konusunda tereddüt yaşadıkları görülmüştür. Ancak süreç ilerledikçe öğrencilerle kurulan olumlu iletişim sayesinde bu öğrencilerin etkinliklere daha istekli katıldıkları ve kendilerini daha rahat ifade etmeye başladıkları gözlemlenmiştir. Okul yönetimi ve sınıf öğretmenleri süreç boyunca gerekli desteği sağlamış, etkinliğin planlanan şekilde ilerlemesine katkıda bulunmuştur.

Uygulama Günü

23 Nisan kutlama programı günü öğrenciler oldukça heyecanlı ve mutluydu. Haftalar boyunca hazırlanan dans gösterisi öğrenciler tarafından başarıyla sergilenmiştir. Programın yürütülmesinde grup üyelerimiz farklı görevler üstlenmiştir. Sıla Çetintaş ve Yusuf Samet Bulut törenin sunuculuğunu gerçekleştirirken, Sema Aslan ve İsmahan Şahin öğrencilerin hazırlık süreçlerinde ve gösteri sırasında onlara eşlik ederek destek olmuştur.

Gösteri sırasında öğrencilerin heyecanlarına rağmen başarılı bir performans sergilemeleri dikkat çekmiştir. Özellikle hazırlık sürecinde çekingen davranan öğrencilerin sahnede kendilerine güvenerek yer almaları bizleri oldukça mutlu etmiştir.

Gözlemlerimiz

Etkinlik sürecinde öğrencilerin büyük bir heyecan ve istekle çalışmalara katıldıkları görülmüştür. Düzenli yapılan provalar sayesinde öğrenciler arasında iş birliği ve dayanışmanın geliştiği gözlemlenmiştir. Özellikle başlangıçta geri planda kalmayı tercih eden bazı öğrencilerin zamanla daha aktif rol almaları ve etkinliklere gönüllü katılım göstermeleri dikkat çekmiştir.

Okul yönetimi ve öğretmenlerle kurulan olumlu iletişim sürecin daha verimli ilerlemesine katkı sağlamıştır. Öğrencilerin etkinliklere yönelik olumlu tutumları da yapılan çalışmaların amacına ulaştığını göstermiştir.

Çocuklardan Aldığımız Dönütler

Etkinlik sonrasında öğrencilerden olumlu geri bildirimler alınmıştır. Öğrenciler dans gösterisine hazırlanma sürecinden keyif aldıklarını ve tören gününde sahneye çıkmanın kendilerini mutlu ettiğini ifade etmişlerdir. Bazı öğrenciler başlangıçta heyecanlandıklarını ancak çalışmalar ilerledikçe kendilerine daha fazla güvenmeye başladıklarını belirtmişlerdir.

Öğrencilerin gösteri sonrasında yaşadıkları mutluluk ve gurur duygusu etkinliğin onlar üzerinde olumlu bir etki bıraktığını göstermiştir.

Bu Deneyimin Bize Kazandırdıkları

Bu etkinlik süreci, öğretmenlik mesleğinin yalnızca sınıf içinde ders anlatmaktan ibaret olmadığını, öğrencilerin sosyal ve duygusal gelişimlerini destekleyen çalışmaların da eğitimin önemli bir parçası olduğunu göstermiştir. Süreç boyunca etkinlik planlama, öğrenciyle iletişim kurma, organizasyon yürütme ve topluluk önünde konuşma gibi alanlarda deneyim kazanılmıştır.

En önemli kazanımlarımızdan biri ise öğrencilerin gelişimlerine doğrudan tanıklık etmek olmuştur. Özellikle çekingen öğrencilerin zamanla daha özgüvenli hâle gelmeleri ve etkinliklere aktif katılım göstermeleri, öğretmen adayları olarak bizlere rehberliğin ve desteğin ne kadar önemli olduğunu göstermiştir. Bu deneyim, gelecekteki meslek hayatımız için değerli bir uygulama fırsatı sunmuştur.
`,
  en: `
Introduction to the Activity

Within the scope of the Out-of-School Activities in Education course, an activity was organized at Kestel Akdeniz Primary School under the supervision of Assist. Prof. Dr. Sibel Dal by our working group consisting of Sıla Çetintaş, Sema Aslan, İsmahan Şahin, and Yusuf Samet Bulut as part of the April 23 National Sovereignty and Children's Day celebrations. The activities were carried out with third-grade students and aimed to help them experience the meaning and importance of the holiday, develop their social skills, and share the excitement of April 23 together.

The activity was planned with the belief that April 23 National Sovereignty and Children's Day holds great value for students. The main goal was to contribute to students’ awareness of national holidays, provide opportunities for self-expression, and support their ability to work together.

Preparation Process

The preparation process continued for eight weeks. During this period, we visited the school regularly each week and worked on the dance performance that students would present on the celebration day. Dance movements were taught, rehearsals were conducted, and necessary preparations were made to ensure the performance progressed smoothly.

Throughout the preparation period, students were closely supported and encouraged to participate actively. Some students were initially hesitant to take part in the activities; however, as the process continued, positive communication helped them become more willing to participate and express themselves comfortably. The school administration and classroom teachers provided support throughout the process and contributed to the successful implementation of the activity.

Implementation Day

On the day of the April 23 celebration program, students were very excited and happy. The dance performance that had been prepared for weeks was successfully presented by the students. Group members assumed different responsibilities during the program. Sıla Çetintaş and Yusuf Samet Bulut served as presenters, while Sema Aslan and İsmahan Şahin supported students during the preparation process and throughout the performance.

Despite their excitement, students delivered a successful performance. It was especially rewarding to see students who had been shy during the preparation stage confidently taking part on stage.

Our Observations

Throughout the activity process, students participated with great enthusiasm and willingness. Regular rehearsals helped strengthen cooperation and solidarity among students. It was particularly noticeable that some students who initially preferred to remain in the background gradually became more active and volunteered to participate.

Positive communication with the school administration and teachers contributed significantly to the effectiveness of the process. Students’ positive attitudes toward the activities demonstrated that the objectives of the project had been achieved.

Feedback from Students

Students provided positive feedback after the event. They stated that they enjoyed preparing for the dance performance and felt happy to perform on the celebration day. Some students mentioned that they were nervous at first but became more confident as the rehearsals progressed.

The happiness and pride students experienced after the performance indicated that the activity had a positive impact on them.

What This Experience Taught Us

This experience showed us that teaching is not limited to classroom instruction and that activities supporting students’ social and emotional development are also an important part of education. Throughout the process, we gained experience in activity planning, communication with students, organization management, and public speaking.

One of the most valuable outcomes was witnessing students’ development firsthand. Seeing shy students gradually become more confident and actively participate demonstrated the importance of guidance and support for future teachers. This experience provided a valuable practical opportunity that will contribute to our future professional lives.
`
},
    images: [
      
    "assets/images/bayram1.2.png",
    "assets/images/bayram1.1.png",
    "assets/images/bayram1.3.png",
    "assets/images/bayram1.4.png",
    "assets/images/bayram1.5.png",
    "assets/images/bayram1.6.png",
    "assets/images/bayram1.7.png",
    "assets/images/bayram1.8.png",
      
    ],
    coverImage: "assets/images/bayram1.3.png"
  },
    
bayram2: {
    category: "gallery2",
    title: {
        tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
        en: "April 23rd National Sovereignty and Children's Day"
    },  
    shortDesc: {
    tr: "Samet Söyler, Enes Polat, Berat Arslan, Mert Çetintaş ve Ziyettin Devrîş tarafından Kızılcaşehir İlkokulu’nda 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities organized by Samet Söyler, Enes Polat, Berat Arslan, Mert Çetintaş, and Ziyettin Devrîş at Kızılcaşehir Primary School within the scope of April 23rd National Sovereignty and Children's Day."
},
 longDesc: {
  tr: `
Eğitimde Program Dışı Etkinlikler dersi kapsamında, Dr. Öğr. Üyesi Sibel Dal danışmanlığında Samet Söyler, Enes Polat, Berat Arslan, Mert Çetintaş ve Ziyettin Devriş’ten oluşan çalışma grubumuz tarafından Kızılcaşehir İlkokulunda 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında çeşitli etkinlikler planlanmış ve uygulanmıştır. Gerçekleştirilen çalışmalar anaokulu ile birinci, ikinci, üçüncü ve dördüncü sınıf öğrencilerini kapsayacak şekilde okul genelinde düzenlenmiş olup öğrencilerin bayram coşkusunu birlikte yaşamaları hedeflenmiştir.

23 Nisan Ulusal Egemenlik ve Çocuk Bayramı, Türkiye Büyük Millet Meclisinin açılışını simgelemesi ve Gazi Mustafa Kemal Atatürk tarafından dünya çocuklarına armağan edilen ilk ve tek çocuk bayramı olması bakımından büyük bir anlam taşımaktadır. Bu özel günün etkinlik konusu olarak seçilmesindeki temel amaç, öğrencilerde millî birlik ve beraberlik bilinci oluşturmak, tarihî ve kültürel değerlerimize karşı farkındalık kazandırmak ve onların sosyal yönlerini geliştirecek etkinliklerle okul yaşamını zenginleştirmektir.

Hazırlanan program sayesinde öğrencilerin kendilerini ifade edebilmeleri, sorumluluk almaları, arkadaşlarıyla iş birliği yapmaları ve topluluk önünde bulunma becerilerini geliştirmeleri amaçlanmıştır. Aynı zamanda geleneksel çocuk oyunları aracılığıyla öğrencilerin fiziksel gelişimlerini desteklemek ve eğlenerek öğrenmelerine katkı sağlamak da etkinliğin temel hedefleri arasında yer almıştır.

Etkinliklerin planlanması aşamasında çalışma grubumuz arasında görev paylaşımı yapılarak düzenli bir çalışma programı oluşturulmuştur. Grup üyelerinin bir kısmı sınıf ve okul ortamının süslenmesinde görev alırken, diğer üyeler gösterilerin planlanması, kullanılacak materyallerin hazırlanması ve oyun alanlarının düzenlenmesi süreçlerinde aktif rol üstlenmiştir. Ayrıca etkinliklerin akış planı hazırlanmış, görev dağılımları netleştirilmiş ve uygulama günü yaşanabilecek aksaklıkların önüne geçebilmek adına gerekli planlamalar yapılmıştır.

Hazırlık süreci boyunca okul yönetimi ve öğretmenlerle sürekli iletişim hâlinde olunmuş, etkinliklerin gerçekleştirileceği alanlar birlikte belirlenmiştir. Okul idaresinin ve öğretmenlerin destekleyici yaklaşımı sayesinde sınıfların süslenmesi, gösteri alanlarının hazırlanması ve öğrencilerin etkinliklere katılımının organize edilmesi sorunsuz bir şekilde gerçekleştirilmiştir.

Bu süreçte öğrenciler de hazırlık çalışmalarına dâhil edilmiş, sınıfların Türk bayrakları, balonlar ve çeşitli süsleme materyalleriyle donatılmasına katkı sağlamışlardır. Böylece öğrencilerin sorumluluk alma, birlikte çalışma ve ortak bir amaç doğrultusunda hareket etme becerileri desteklenmiştir.

Etkinlik günü öğrencilerin yoğun bir heyecan ve mutluluk içerisinde okul bahçesinde ve sınıflarda toplandıkları gözlemlenmiştir. Program, 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı’nın anlam ve önemine ilişkin yapılan kısa bir konuşmayla başlamış, ardından öğrenciler tarafından hazırlanan şiirler okunmuş ve çeşitli şarkılar seslendirilmiştir. Öğrencilerin sergiledikleri gösteriler hem arkadaşları hem de öğretmenleri tarafından büyük bir ilgiyle takip edilmiştir.

Kutlama programının devamında öğrencilerin fiziksel ve sosyal gelişimlerini desteklemek amacıyla çeşitli oyun ve yarışmalar düzenlenmiştir. Halat çekme yarışması, balon patlatmaca etkinliği ve geleneksel çocuk oyunları öğrencilerin büyük bir istek ve heyecanla katıldıkları etkinlikler arasında yer almıştır. Oyunlar sırasında öğrencilerin takım ruhu içerisinde hareket ettikleri, birbirlerini destekledikleri ve kurallara uygun davranmaya özen gösterdikleri dikkat çekmiştir.

Program boyunca öğrencilerin aktif katılım göstermeleri ve etkinliklerden büyük keyif almaları, planlanan hedeflere ulaşıldığını ortaya koymuştur. Etkinliklerin sonunda öğrencilerle birlikte günün değerlendirilmesi yapılmış ve onların duygu ve düşüncelerini paylaşmalarına fırsat verilmiştir.

Etkinlik süreci boyunca okul yönetimi, öğretmenler ve öğrencilerle oldukça sağlıklı bir iletişim kurulmuştur. Okulun sıcak ve samimi atmosferi, öğrencilerin etkinliklere gönüllü olarak katılım göstermelerine olumlu katkı sağlamıştır. Özellikle öğretmenlerin öğrencilere rehberlik eden ve motive eden tutumları etkinliklerin verimli geçmesinde önemli rol oynamıştır.

Öğrencilerin etkinliklere karşı son derece istekli oldukları ve hazırlık sürecinden itibaren büyük bir heyecan duydukları gözlemlenmiştir. Gösteriler sırasında topluluk önünde konuşma konusunda çekingen olan bazı öğrencilerin bile arkadaşlarının desteğiyle kendilerini ifade etmeye çalışmaları dikkat çekici olmuştur. Oyun etkinliklerinde ise öğrencilerin paylaşma, yardımlaşma ve iş birliği becerilerini doğal bir şekilde sergiledikleri görülmüştür.

Etkinlik sonrasında öğrencilerden oldukça olumlu geri bildirimler alınmıştır. Öğrenciler özellikle oyun etkinliklerinden ve arkadaşlarıyla birlikte gerçekleştirdikleri kutlamalardan büyük mutluluk duyduklarını ifade etmişlerdir. Birçok öğrenci bu tür etkinliklerin daha sık düzenlenmesini istediğini belirtmiş ve 23 Nisan kutlamalarının bu şekilde çok daha eğlenceli geçtiğini dile getirmiştir.

Bu etkinlik, öğretmenlik mesleğinin yalnızca ders anlatmaktan ibaret olmadığını, öğrencilerin sosyal, kültürel ve duygusal gelişimlerini destekleyen çalışmaların da eğitim sürecinin ayrılmaz bir parçası olduğunu göstermiştir. Süreç boyunca planlama, ekip çalışması, iletişim kurma, organizasyon becerileri ve zaman yönetimi konularında önemli deneyimler kazanılmıştır.

Genel olarak değerlendirildiğinde, 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında gerçekleştirilen etkinliklerin planlanan amaçlara ulaştığı düşünülmektedir. Öğrencilerin millî bayram bilinci kazanmalarına, sosyal ilişkilerini güçlendirmelerine ve eğlenerek öğrenmelerine katkı sağlayan bu etkinlikler, aynı zamanda biz öğretmen adayları için de önemli bir mesleki deneyim olmuştur.
  `,
  en: `
Within the scope of the Out-of-School Activities in Education course and under the supervision of Assist. Prof. Sibel Dal, our group consisting of Samet Söyler, Enes Polat, Berat Arslan, Mert Çetintaş, and Ziyettin Devriş planned and implemented various activities at Kızılcaşehir Primary School as part of the April 23 National Sovereignty and Children's Day celebrations. The activities were organized across the entire school and included kindergarten as well as first, second, third, and fourth grade students.

April 23 National Sovereignty and Children's Day holds special significance as it commemorates the opening of the Grand National Assembly of Türkiye and is the first and only children's holiday in the world dedicated to children by Mustafa Kemal Atatürk. The main purpose of selecting this theme was to foster national unity and solidarity, raise awareness of historical and cultural values, and enrich school life through activities that support students’ social development.

The program aimed to help students express themselves, take responsibility, cooperate with their peers, and improve their confidence in public settings. Supporting students’ physical development through traditional children's games and encouraging learning through enjoyment were also among the primary objectives.

During the planning phase, responsibilities were distributed among group members to ensure an organized process. Some members focused on decorating classrooms and school areas, while others prepared materials, organized performance activities, and arranged game areas. Detailed activity schedules and task distributions were also prepared to ensure smooth implementation.

Throughout the preparation process, continuous communication was maintained with school administrators and teachers. Thanks to their support, classroom decorations, activity areas, and student participation were organized successfully and efficiently.

Students actively participated in the preparation process by decorating classrooms with Turkish flags, balloons, and various decorative materials. This helped develop their sense of responsibility, cooperation, and teamwork.

On the day of the event, students gathered in classrooms and the schoolyard with great excitement and enthusiasm. The program began with a brief speech highlighting the significance of April 23, followed by poetry recitations and songs performed by students. Their performances attracted significant attention from both teachers and fellow students.

Various games and competitions were organized to support students’ physical and social development. Tug-of-war, balloon-popping activities, and traditional children's games were among the most popular events. Students demonstrated strong teamwork, supported one another, and followed the rules throughout the activities.

The high level of participation and enjoyment observed during the program indicated that the planned objectives had been achieved. At the end of the event, students were given opportunities to share their thoughts and feelings about the celebrations.

Throughout the process, effective communication was maintained with school administrators, teachers, and students. The warm and welcoming school atmosphere encouraged voluntary participation. Teachers’ supportive and motivating attitudes also played an important role in the success of the activities.

Students showed great enthusiasm from the preparation stage onward. Even students who were initially shy about speaking in front of others attempted to express themselves with the support of their classmates. During the games, students naturally demonstrated cooperation, sharing, and teamwork skills.

Very positive feedback was received after the event. Students stated that they especially enjoyed the games and celebrations with their friends. Many expressed a desire for similar activities to be organized more frequently and emphasized that the April 23 celebrations were much more enjoyable in this format.

This experience demonstrated that teaching involves much more than classroom instruction; it also includes supporting students’ social, cultural, and emotional development. Throughout the process, we gained valuable experience in planning, teamwork, communication, organization, and time management.

Overall, the activities carried out within the scope of April 23 National Sovereignty and Children's Day successfully achieved their objectives. The event contributed to students’ awareness of national holidays, strengthened their social relationships, and provided meaningful learning experiences through enjoyable activities. It also served as an important professional experience for us as future teachers.
  `
},
    images: [
        "assets/images/bayram2.1.png",
        "assets/images/bayram2.2.png",
        "assets/images/bayram2.3.png",
        "assets/images/bayram2.4.png",
        "assets/images/bayram2.5.png",
        "assets/images/bayram2.6.png",
    ],  
    coverImage: "assets/images/bayram2.5.png"
  },

bayram3: {
    category: "gallery2",
    title: {
        tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı", 
        en: "April 23rd National Sovereignty and Children's Day"
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
        tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı", 
        en: "April 23rd National Sovereignty and Children's Day"
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
        tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
        en: "April 23rd National Sovereignty and Children's Day"
    },  
    shortDesc: {
    tr: "Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç ve Mustafa Kemal Çelik tarafından Alantur Ayhan Şahenk İlkokulu’nda 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında gerçekleştirilen etkinlikler.",
    en: "Activities organized by Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç, and Mustafa Kemal Çelik at Alantur Ayhan Şahenk Primary School within the scope of April 23 National Sovereignty and Children's Day."
    },
   longDesc: {
    tr: `
"Eğitimde Program Dışı Etkinlikler" dersi kapsamında; Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç ve Mustafa Kemal Çelik’ten oluşan grubumuzla Alanya Alantur Ayhan Şahenk İlkokulu’nda 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı etkinliklerine aktif destek sağladık. Amacımız, öğrencilerin bayram coşkusunu daha yoğun yaşamalarını sağlamak ve okul ortamını bu özel günün anlamına uygun şekilde hazırlamaktı.

Etkinlik süreci kapsamında okul yönetimi ve öğretmenlerle iş birliği içerisinde çalışarak sınıfların ve ortak kullanım alanlarının süslenmesine katkıda bulunduk. Öğrencilerle birlikte bayraklar, afişler ve çeşitli görsel materyaller hazırlayarak okulun bayram atmosferine uygun şekilde düzenlenmesini sağladık. Bu çalışmalar sırasında öğrencilerin yaratıcılıklarını ortaya koymalarına fırsat verildi ve sürece aktif katılımları desteklendi.

Ayrıca okul içerisinde tematik panolar ve fotoğraf köşeleri tasarlayarak öğrencilerin bayram gününde unutulmaz anılar biriktirebilecekleri alanlar oluşturduk. Hazırlanan bu alanlar hem öğrencilerin hem de velilerin yoğun ilgisini çekti ve gün boyunca etkinliklerin önemli bir parçası oldu.

Bayram töreni öncesinde gerçekleştirilen prova çalışmalarına da katılarak öğrencilerin hazırlık süreçlerini yakından takip ettik. Provalar sırasında öğrencilerin heyecanlarına ortak olduk, ihtiyaç duydukları konularda destek sağladık ve tören günü için motivasyonlarını artırmaya çalıştık.

Etkinlik sürecinde öğrencilerin milli bayramlara karşı duydukları heyecan, bağlılık ve sorumluluk duygusu dikkat çekiciydi. Özellikle sınıf süsleme çalışmalarında öğrencilerin yaratıcı fikirler ortaya koymaları ve gönüllü olarak görev almaları sürece olan ilgilerinin yüksek olduğunu gösterdi.

Bayram günü öğrencilerin yüzlerindeki mutluluk, hazırlanan ortamdan duydukları memnuniyet ve tören boyunca sergiledikleri coşku etkinliğin en değerli kazanımları arasında yer aldı. Veliler ve öğretmenler tarafından alınan olumlu geri bildirimler de gerçekleştirilen çalışmaların amacına ulaştığını göstermiştir.

Bu deneyim sayesinde okul ortamında gerçekleştirilen resmi kutlamaların planlama ve uygulama süreçlerini yakından gözlemleme fırsatı bulduk. Aynı zamanda ekip çalışması, organizasyon yönetimi ve okul paydaşlarıyla iş birliği içerisinde çalışma konularında önemli deneyimler kazandık.

Genel olarak etkinliğin öğrencilerin bayram bilincini güçlendirdiği, okul iklimine olumlu katkı sağladığı ve 23 Nisan ruhunun öğrenciler tarafından coşkuyla yaşanmasına destek olduğu değerlendirilmektedir.
    `,
    en: `
As part of the "Out-of-School Activities in Education" course, our group consisting of Erva Gül Orçin, Gamze Gül Işık, Esma Atalay, Volkan Tunç, and Mustafa Kemal Çelik actively supported the 23 April National Sovereignty and Children's Day celebrations at Alanya Alantur Ayhan Şahenk Primary School. Our main goal was to help students experience the excitement of this special day more deeply and to prepare the school environment in accordance with the spirit of the celebration.

Throughout the process, we collaborated closely with the school administration and teachers to decorate classrooms and common areas. Together with the students, we prepared flags, posters, and various visual materials to create a festive atmosphere throughout the school. These activities encouraged students to express their creativity and actively participate in the preparation process.

In addition, we designed thematic display boards and photo corners where students could create memorable moments during the celebrations. These specially prepared areas attracted considerable attention from both students and parents and became an important part of the event throughout the day.

We also participated in the rehearsal process before the ceremony, closely following the students’ preparations. During rehearsals, we shared their excitement, provided support whenever needed, and helped increase their motivation for the celebration day.

Throughout the activities, students demonstrated a strong sense of enthusiasm, responsibility, and appreciation for national holidays. Their willingness to contribute to classroom decorations and their creative ideas reflected their high level of engagement in the process.

On the day of the celebration, the happiness on the students’ faces, their appreciation of the prepared environment, and the enthusiasm they displayed during the ceremony were among the most valuable outcomes of the event. Positive feedback received from teachers and parents further confirmed the success of the activities.

This experience allowed us to observe the planning and implementation stages of an official school celebration firsthand. It also helped us develop important skills related to teamwork, event organization, and collaboration with various school stakeholders.

Overall, the event contributed positively to students’ awareness of national holidays, enriched the school climate, and supported students in experiencing the spirit of 23 April with great joy and enthusiasm.
    `
},  
    images: [
        "assets/images/bayram5.1.png",
        "assets/images/bayram5.2.png",
        "assets/images/bayram5.3.png",
        "assets/images/bayram5.4.png",
        "assets/images/bayram5.5.png",
        "assets/images/bayram5.6.png",
        "assets/images/bayram5.7.png",
        "assets/images/bayram5.8.png",
        "assets/images/bayram5.9.png",
        "assets/images/bayram5.10.png",
        "assets/images/bayram5.11.png",
    ],  
    coverImage: "assets/images/bayram5.1.png"
  },
  
bayram6: {
    category: "gallery2",
    title: {    
        tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
        en: "April 23rd National Sovereignty and Children's Day"
    },
    shortDesc: {
    tr: "Helen YÜCEDAĞ, Seda KURTAY, Edanur KOLUMAN, Rojin AKMAN ve Arzu AKKUŞ tarafından Fatma Özmüftüoğlu İlkokulu’nda 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında gerçekleştirilen etkinlikler.",
    
    en: "Activities organized by Helen YÜCEDAĞ, Seda KURTAY, Edanur KOLUMAN, Rojin AKMAN, and Arzu AKKUŞ at Fatma Özmüftüoğlu Primary School within the scope of April 23 National Sovereignty and Children's Day."
},
  longDesc: {
  tr: `
Etkinliklerin planlanmasında ve yürütülmesinde aktif rol aldık. 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında 3. sınıfların (5 şube) dans gösterilerini üstlendik ve hangi gösterilerin yapılacağını şube öğretmenleri ile birlikte belirledik. Yaklaşık bir ay (4 hafta) boyunca devam eden prova sürecinde haftanın üç günü öğrencilerle düzenli çalışmalar gerçekleştirdik. Grup arkadaşlarımızın tamamının farklı görevler üstlendiği bu süreç, iş birliği içerisinde yürütüldü.

Provalar sırasında öğrencilerin motivasyonlarını artırmak amacıyla hem eğlenceli hem de gösterilerle bağlantılı çeşitli oyunlar oynattık. Bu uygulamalar sayesinde öğrenciler prova sürecine daha istekli ve coşkulu bir şekilde katıldılar. Gösteri sırasında kullanılmak üzere, öğrencilerin etkinlik sonunda bir araya getirerek tamamlayacakları puzzle şeklindeki pankartları özenle hazırladık. Ayrıca öğrenciler için hatıra niteliği taşıyan, bayram coşkusunu yansıtan renkli ve yazılı bir 23 Nisan panosu tasarladık.

23 Nisan günü öğrencilerin sergiledikleri gösterileri büyük bir heyecanla izledik. Gösteri sırasında sahneye çıkarak öğrencilerin motivasyonlarını artırmaya ve onlara destek olmaya devam ettik. Bu süreçte öğretmen adayı olarak öğrencilerle etkileşimli çalışmanın, prova süreçlerini yönetmenin ve grup organizasyonu sağlamanın önemini deneyimleme fırsatı bulduk.

Etkinlik süresince öğrencilerin davranışlarını gözlemledik ve farklı durumlarda çocuklara nasıl yaklaşılması gerektiği konusunda önemli deneyimler kazandık. Karşılaşılabilecek problemlere yönelik çözüm yolları geliştirme konusunda öğretmen adayı arkadaşlarımızla birlikte değerlendirmeler yaptık. Ayrıca öğretmenlerin kendi zümreleriyle olan iletişimlerini ve iş birliği süreçlerini yakından gözlemleme fırsatı elde ettik.

Ulusal Egemenlik ve Çocuk Bayramı gibi anlamlı bir günde görev almak ve haftalar boyunca hazırlıklarını yaptığımız gösterilerin başarıyla sergilendiğini görmek bizler için son derece değerli bir deneyim oldu. Bu süreç hem mesleki gelişimimize katkı sağladı hem de öğretmenlik mesleğine dair farkındalığımızı artırdı. Bu deneyimi yaşamamıza fırsat sunduğu için değerli hocamız Dr. Öğr. Üyesi Sibel DAL’a teşekkür ederiz.
  `,
  en: `
We took an active role in both the planning and implementation of the activities. Within the scope of the April 23 National Sovereignty and Children’s Day celebrations, we were responsible for the dance performances of the 3rd-grade classes (five sections) and selected the performances together with the classroom teachers. Throughout a one-month (four-week) preparation period, we conducted rehearsals with students three days a week. The process was carried out collaboratively, with each group member undertaking different responsibilities.

During rehearsals, we organized enjoyable games related to the performances in order to increase students’ motivation. These activities helped students participate in rehearsals with greater enthusiasm and excitement. We also carefully prepared puzzle-shaped banners that students would assemble together at the end of the performance. In addition, we designed a colorful April 23 display board that reflected the spirit of the celebration and served as a memorable keepsake for the students.

On April 23, we proudly watched the students perform the routines they had practiced for weeks. During the performances, we joined them on stage to provide encouragement and support. As pre-service teachers, this process allowed us to gain valuable experience in managing rehearsals, organizing group activities, and interacting effectively with students.

Throughout the activity, we observed students’ behaviors closely and gained important insights into how to approach children in different situations. Together with our fellow teacher candidates, we discussed potential challenges and developed solutions for possible problems. We also had the opportunity to closely observe communication and collaboration among teachers within their professional teams.

Taking part in such a meaningful national celebration and witnessing the successful outcome of the performances we had prepared over several weeks was an unforgettable experience for us. This process contributed significantly to our professional development and strengthened our understanding of the teaching profession. We would like to express our sincere gratitude to our instructor, Assist. Prof. Dr. Sibel Dal, for providing us with this valuable experience.
  `
},
    images: [
        "assets/images/bayram6.1.png",
        "assets/images/bayram6.2.png",
        "assets/images/bayram6.3.png",
        "assets/images/bayram6.4.png",
        "assets/images/bayram6.5.png",
        "assets/images/bayram6.6.png",
    ],  
    coverImage: "assets/images/bayram6.6.png"
  },

bayram7: { 
    category: "gallery2",
    title: {
        tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı", 
        en: "April 23rd National Sovereignty and Children's Day"
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
        tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
        en: "April 23rd National Sovereignty and Children's Day"
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
        "assets/images/bayram8.1.png",
        "assets/images/bayram8.2.png",
        
    ],  
    coverImage: "assets/images/bayram8.1.png"
  },

bayram9: {
    category: "gallery2",
    title: {
        tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
        en: "April 23rd National Sovereignty and Children's Day"
    },  
   shortDesc: {
    tr: "Fatma Erdoğan, Fatma Aydın, Hazal Kulaz ve Zeynep Su Sağlamer tarafından Bilgi Bulut İlkokulu’nda gerçekleştirilen 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı etkinlikleri.",
    en: "23 April National Sovereignty and Children’s Day activities carried out at Bilgi Bulut Primary School by Fatma Erdoğan, Fatma Aydın, Hazal Kulaz, and Zeynep Su Sağlamer."
},
    longDesc: {
    tr: `
23 Nisan Ulusal Egemenlik ve Çocuk Bayramı hazırlıklarına gözlemci olarak katılan ekibimiz, okul süslemelerinde ve koreografilerden birinin hazırlığında da aktif rol alarak bayram coşkusuna ortak oldu. Süreç boyunca öğrencilerin prova çalışmalarına eşlik edilmiş, etkinlik alanlarının düzenlenmesine destek verilmiş ve bayram atmosferinin oluşturulmasına katkı sağlanmıştır. Öğrencilerin heyecanı ve motivasyonu yakından gözlemlenmiş, öğretmenlerin organizasyon sürecindeki iş birliği ve yönlendirmeleri deneyimlenmiştir. Bu süreç, öğretmen adayları olarak okul içi etkinlik planlama, gözlem yapma ve öğrenci etkileşimini daha yakından tanıma fırsatı sunmuştur.
    `,
    en: `
Our team participated in the preparations for the April 23 National Sovereignty and Children’s Day celebrations as observers and also took an active role in school decorations and the preparation of one of the choreographies, sharing the excitement of the celebration. Throughout the process, the team accompanied students during rehearsals, supported the arrangement of activity areas, and contributed to creating the festive atmosphere. The enthusiasm and motivation of the students were closely observed, while the cooperation and guidance of the teachers during the organization process were experienced firsthand. This process provided us, as pre-service teachers, with the opportunity to better understand school event planning, observation practices, and student interaction.
    `
},
    images: [
        "assets/images/bayram9.1.png",
        "assets/images/bayram9.2.png",
        "assets/images/bayram9.3.png",
    ],  
    coverImage: "assets/images/bayram9.1.png"
  },    

bayram10: {
    category: "gallery2",
    title: {
        tr: "19 Mayıs Atatürk’ü Anma, Gençlik ve Spor Bayramı",
        en: "19 May Commemoration of Atatürk, Youth and Sports Day"
    },      
   shortDesc: {
    tr: "Gökhan Deniz, İrem Gündüz, Mehmet Abdullah Aslan, Muhammed Peker ve Yusuf Renas Gündoğdu tarafından, 19 Mayıs Atatürk’ü Anma, Gençlik ve Spor Bayramı kapsamında İnönü İlkokulu’nda geleneksel oyun ve koro etkinlikleri gerçekleştirilmiştir.",
    
    en: "Traditional games and choir activities were organized at İnönü Primary School by Gökhan Deniz, İrem Gündüz, Mehmet Abdullah Aslan, Muhammed Peker, and Yusuf Renas Gündoğdu as part of the 19 May Commemoration of Atatürk, Youth and Sports Day celebrations."
},
   longDesc: {
  tr: `
Bu çalışma, Eğitimde Program Dışı Etkinlikler dersi kapsamında Dr. Öğr. Üyesi Sibel Dal hocamızın yönlendirmesiyle İnönü İlkokuluna yönlendirmesiyle grubumuz tarafından gerçekleştirilmiştir. Etkinliğimize grup üyelerimiz gönüllü olarak katılım sağlamıştır. Seçtiğimiz ilkokulun müziğe ve yarışmalara olan ilgisi ile dinamik yapısı, bu etkinlikleri yürütmede bizi oldukça motive etti.

Tohumlar Fidana Koro Çalışması: Bu etkinlikte aktif rol aldık. Gökhan Deniz bu etkinlikte yönlendirici, Mehmet, Muhammed ve Renas ise yardımcı rolündeydi. Bu etkinliğimizi 19 Mayıs Atatürk’ü Anma, Gençlik ve Spor Bayramında okulda gösteri olarak sunduk.

Gerçekleştirilen tüm etkinliklerde, 2. Sınıf öğrencilerinin sürece olan bilişsel ve duyuşsal katılım düzeylerinin oldukça yüksek olduğu ve etkinlikleri büyük bir ilgiyle karşıladıkları gözlemlenmiştir.

Uygulanan program dışı etkinlikler, öğrencilerin sadece fiziksel ve sanatsal becerilerini geliştirmekte kalmamış; hem zihinsel (bilişsel) odaklanmalarını maksimuma çıkarmış hem de sürece dair güçlü ve olumlu bir duyuşsal bağ kurmalarını sağlamıştır.

Etkinlikler genelinde öğrencilerin motivasyonu ve isteği zaten oldukça yüksekti; grubumuz da bu heyecanı dinamik yöntemlerle destekledi. Yağ satarım bal satarım oyununda çocukların doğal ilgisini adil bir yönetim ve alan düzenlemesiyle canlı tutarken, Tohumlar Fidana koro çalışmasında ise çocuklara şarkıyı dışarıda, ayakta ve canlı gitar eşliğinde çalacağımızı söyleyerek motivasyonlarını zirveye çıkardık; bu enstrüman ve açık hava vaadi, öğrencilerin çalışmalara çok daha büyük bir heyecan ve istekle sarılmasını sağladı.

Okul atmosferi ve öğretmenlerin yaklaşımı etkinlikler için gayet uygundu; öğretmenler sürecin başından itibaren bize oldukça destek oldular. Bu olumlu ortama aileler de katılım sağlayarak sürecin kolaylaşmasına yardımcı oldular ve koro çalışması için ihtiyaç duyduğumuz enstrüman gibi araç gereçlerin temininde destek verdiler.

Etkinlikler belirlenen tüm amaçlara başarıyla ulaşmıştır. Yağ satarım bal satarım oyunuyla çocukların kurallara uyma ve iş birliği becerileri gelişmiştir. Öğrencilerin süreç boyunca gösterdiği yüksek isteklilik ve veliler ile öğretmenlerin enstrüman temini gibi konularda sağladığı tam destek, tüm hedeflerimize verimli bir şekilde ulaşmamızı sağladı.

Aynı etkinliği tekrar yapacak olsak, koro çalışmasındaki canlı enstrüman çeşitliliğini artırarak sürece farklı ritim aletleri eklerdik. Ayrıca açık alandaki hava şartlarını göz önünde bulundurarak, yağ satarım bal satarım oyununda özellikle sabit kalıp süreci yönettiğimiz hakemlik zamanlarında ve çocukların koşu esnasında güneşten etkilenmemesi adına şapka ve güneş kremi gibi koruyucu önlemler kesinlikle önceden planlardık. Son olarak, ailelerin ve okulun bu desteğini arkamıza almışken hazırlık süresini biraz daha geniş tutup etkinliği daha büyük bir çocuk şenliğine dönüştürmek isterdik.

Öğrencilerden süreç boyunca ve sonrasında çocukların gözlerindeki o mutluluk, enerjileri ve etkinliği hiç bitirmek istememeleri bizim için en net ve güzel dönüt oldu.

Bu deneyim bize, çocukların yüksek içsel motivasyonunu canlı müzik ve açık hava gibi dinamik unsurlarla desteklenmenin süreci ne kadar verimli kıldığını öğretti. Ayrıca okul, öğretmen ve veli iş birliğinin etkinliklerin başarısındaki büyük rolünü görürken, açık saha uygulamalarında hava şartlarına ve saha yönetimine dair pratik önlemler almanın önemini yaşayarak tecrübe ettik.

Bu deneyim bize, çocuklarla çalışırken sadece ders içeriğini değil, dışarıdaki hava durumunu ve saha şartlarını da hesaba katmamız gerektiğini gösterdi. Çocuklarla iletişimimiz ve etkinlikleri yürütme tarzımız gayet iyiydi ama açık havada, özellikle hakemlik yaparken güneş altında kalacağımızı tam olarak öngöremedik. İlerisi için kendimizde geliştirmemiz gereken yön; etkinlik planlarken şapka, güneş kremi veya gölge alan gibi pratik saha ihtiyaçlarını en baştan düşünmek ve hazırlıklı olmak olduğunu fark ettik.

Çocukların halihazırdaki yüksek enerjisini ve isteğini, onları sıkmadan doğru bir şekilde yönlendirmeyi başardık.
  `,
  
  en: `
This study was carried out within the scope of the “Out-of-School Activities in Education” course under the guidance of Assist. Prof. Dr. Sibel Dal at İnönü Primary School by our group. Our group members participated voluntarily in the activity. The dynamic structure of the selected school and its strong interest in music and competitions significantly motivated us during the implementation process.

“Tohumlar Fidana” Choir Activity: We took an active role in this activity. Gökhan Deniz acted as the instructor, while Mehmet, Muhammed, and Renas took supporting roles. This activity was performed as a stage presentation at the school during the 19 May Commemoration of Atatürk, Youth and Sports Day.

In all activities, it was observed that 2nd grade students showed a high level of cognitive and affective engagement and participated with great interest.

The activities not only improved students’ physical and artistic skills but also increased their cognitive focus and strengthened their emotional connection to the process.

Student motivation was already high; our group further enhanced this enthusiasm through dynamic methods. In the “Yağ satarım bal satarım” game, students’ natural interest was maintained through fair management and proper field organization, while in the “Tohumlar Fidana” choir activity, students were told that the song would be performed outdoors, standing, and with live guitar accompaniment, which significantly increased their motivation.

The school environment and teachers’ approach were highly supportive; teachers assisted us throughout the process. Parents also contributed by supporting the process and providing instruments needed for the choir activity.

The activities successfully achieved all intended objectives. Students developed rule-following and cooperation skills. Strong willingness from students and full support from parents and teachers ensured successful outcomes.

If we were to repeat the activity, we would increase the diversity of live instruments and include additional rhythm instruments. We would also plan protective measures such as hats and sunscreen for outdoor conditions, especially during refereeing and physical activity. Finally, with strong school and family support, we would extend the preparation period and turn the activity into a larger children’s festival.

The students’ happiness, energy, and reluctance to end the activities were the clearest feedback for us.

This experience taught us how effectively children’s intrinsic motivation can be supported through dynamic elements such as live music and outdoor settings. It also highlighted the importance of school, teacher, and parent collaboration in the success of such activities, as well as the need to consider environmental and field conditions in outdoor implementations.

This experience also showed us that when working with children, we must consider not only lesson content but also external factors such as weather and field conditions. Although our communication and implementation were successful, we did not fully anticipate sun exposure during refereeing in outdoor settings. For future improvement, we realized that practical preparations such as hats, sunscreen, and shaded areas should be planned in advance.

We successfully guided children’s high energy and motivation in a structured and positive way.
  `
}, 

    images: [
        "assets/images/bayram10.1.png",
        "assets/images/bayram10.2.png",
        "assets/images/bayram10.6.png",
    ],  
    coverImage: "assets/images/bayram10.1.png"
  },

bayram11: {
    category: "gallery2",
    title: {    
        tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
        en: "April 23rd National Sovereignty and Children's Day "
    },  
   shortDesc: {
    tr: "Gökhan Deniz, İrem Gündüz, Mehmet Abdullah Aslan, Muhammed Peker ve Yusuf Renas Gündoğdu tarafından, 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında İnönü İlkokulu’nda Türk Halk Dansları gösteri çalışmaları gerçekleştirilmiştir.",
    
    en: "Turkish Folk Dance performance rehearsals were organized at İnönü Primary School by Gökhan Deniz, İrem Gündüz, Mehmet Abdullah Aslan, Muhammed Peker, and Yusuf Renas Gündoğdu as part of the 23 April National Sovereignty and Children’s Day celebrations."
},
    longDesc: {
    tr: `
Bu çalışma, Eğitimde Program Dışı Etkinlikler dersi kapsamında Dr. Öğr. Üyesi Sibel Dal hocamızın yönlendirmesiyle İnönü İlkokulu’nda grubumuz tarafından gerçekleştirilmiştir. Etkinliğe grup üyeleri gönüllü olarak katılım sağlamıştır. Seçilen ilkokulun müziğe, yarışmalara ve etkinliklere olan ilgisi ile dinamik yapısı, etkinliklerin planlanması ve yürütülmesi sürecinde önemli bir motivasyon kaynağı olmuştur.

23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında gerçekleştirilen etkinlikte, İrem Gündüz’ün önderliğinde 2. sınıf öğrencilerine Türk Halk Dansları çalıştırılmıştır. Gösteri provaları yaklaşık bir aylık süreçte haftada bir gün düzenli olarak gerçekleştirilmiş, gerekli durumlarda hafta içindeki diğer günlerde de ek çalışmalar yapılmıştır. Diğer grup üyeleri ise süreçte gözlemci ve yardımcı roller üstlenmiştir.

Etkinlik sürecinde 2. sınıf öğrencilerinin bilişsel ve duyuşsal katılım düzeylerinin oldukça yüksek olduğu gözlemlenmiştir. Öğrenciler etkinliklere büyük bir ilgiyle yaklaşmış, süreç boyunca istekli ve aktif bir katılım göstermiştir. Gerçekleştirilen program dışı etkinliklerin öğrencilerin yalnızca fiziksel ve sanatsal becerilerini geliştirmediği; aynı zamanda dikkat, odaklanma ve ritim becerilerini de desteklediği görülmüştür. Bunun yanında öğrencilerin etkinlik sürecine karşı güçlü ve olumlu bir duygusal bağ geliştirdikleri gözlemlenmiştir.

Öğrencilerin motivasyonunu artırmak amacıyla süreç boyunca eğlenceli ve dinamik yöntemler kullanılmıştır. 23 Nisan provalarında bayram coşkusu eğlenceli bir atmosfere dönüştürülmüş, öğrencilerin hem eğlenmeleri hem de disiplinli bir şekilde prova yapmaları desteklenmiştir. Bu yaklaşım öğrencilerin etkinliklere olan ilgisini artırmış ve provaların daha verimli ilerlemesini sağlamıştır.

Okul atmosferinin ve öğretmenlerin yaklaşımının etkinlikler için oldukça uygun olduğu görülmüştür. Öğretmenler sürecin başından itibaren destekleyici bir tutum sergilemiş, aileler de etkinliklere katkı sağlayarak sürecin kolaylaşmasına yardımcı olmuştur. Öğretmen, veli ve grup üyeleri arasındaki güçlü iletişim ve iş birliği etkinliklerin başarılı bir şekilde yürütülmesini desteklemiştir.

Gerçekleştirilen etkinliklerin belirlenen amaçlara başarıyla ulaştığı değerlendirilmiştir. 23 Nisan gösteri çalışmaları sayesinde öğrencilerin koordinasyon becerileri, ritim duyguları ve sahne performansları gelişmiştir. Bayram coşkusunun öğrenciler tarafından sahneye başarılı bir şekilde taşındığı gözlemlenmiştir. Öğrencilerin süreç boyunca gösterdiği yüksek motivasyon ve etkinliklere duydukları ilgi, hedeflenen kazanımların elde edilmesini sağlamıştır.

Öğrencilerden alınan geri bildirimler oldukça olumlu olmuştur. Süreç boyunca çocukların mutluluğu, enerjileri ve etkinliklerin devam etmesini istemeleri etkinliklerin başarısını gösteren en önemli dönütlerden biri olmuştur.

Bu deneyim sayesinde okul, öğretmen ve veli iş birliğinin etkinliklerin başarısındaki büyük rolü daha yakından görülmüştür. Ayrıca açık alan uygulamalarında saha yönetimi, hava koşulları ve organizasyon süreçlerinin planlanmasının önemine dair uygulamalı deneyim kazanılmıştır.

Süreç sonunda çocukların mevcut enerjilerini ve isteklerini doğru şekilde yönlendirebilmenin etkinliklerin verimini artırdığı gözlemlenmiştir. Yapılan çalışmaların hem öğrenciler hem de grup üyeleri açısından öğretici, eğlenceli ve unutulmaz bir deneyim olduğu değerlendirilmiştir.
    `,

    en: `
This study was carried out by our group at İnönü Primary School under the guidance of Dr. Lecturer Sibel Dal within the scope of the Out-of-School Activities in Education course. Group members participated in the activities voluntarily. The school’s dynamic structure and students’ interest in music, competitions, and activities became an important source of motivation throughout the planning and implementation process.

As part of the 23 April National Sovereignty and Children’s Day celebrations, Turkish Folk Dance rehearsals were organized for 2nd grade students under the leadership of İrem Gündüz. Rehearsals were carried out regularly once a week for approximately one month, and additional practices were organized on weekdays when necessary. Other group members took part in the process as observers and assistants.

Throughout the activity process, it was observed that the cognitive and emotional participation levels of the 2nd grade students were very high. Students showed great interest in the activities and participated actively and enthusiastically throughout the process. These out-of-school activities contributed not only to students’ physical and artistic development but also to their attention, concentration, and rhythm skills. In addition, students developed a strong and positive emotional connection with the activities.

Fun and dynamic methods were used throughout the process to increase student motivation. During the 23 April rehearsals, the excitement of the national celebration was transformed into an enjoyable atmosphere, allowing students to have fun while also rehearsing in a disciplined way. This approach increased students’ interest in the activities and made the rehearsals more productive.

The school atmosphere and teachers’ attitudes were highly suitable for the activities. Teachers provided support from the beginning of the process, while parents also contributed to the activities and helped facilitate the process. Strong communication and cooperation among teachers, parents, and group members supported the successful implementation of the activities.

The activities were evaluated as successful in achieving their intended objectives. Through the 23 April performance rehearsals, students improved their coordination skills, sense of rhythm, and stage performance abilities. It was observed that students successfully reflected the excitement and spirit of the national celebration on stage. Their high motivation and strong interest throughout the process contributed greatly to achieving the targeted outcomes.

The feedback received from students was highly positive. Students’ happiness, energy, and unwillingness for the activities to end were among the clearest indicators of the success of the process.

This experience highlighted the significant role of cooperation among schools, teachers, and parents in the success of educational activities. In addition, practical experience was gained regarding field management, weather conditions, and organizational planning in outdoor activities.

At the end of the process, it was observed that properly guiding students’ existing energy and enthusiasm increased the effectiveness of the activities. The entire process was considered an educational, enjoyable, and unforgettable experience for both the students and the group members.
    `
},  
    images: [
        "assets/images/bayram11.1.png",
        "assets/images/bayram11.2.png",
        "assets/images/bayram11.3.png",
        "assets/images/bayram11.4.png",
    ],  
    coverImage: "assets/images/bayram11.3.png"
  },

bayram12: {
    category: "gallery2",
    title: {   
        tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
        en: "April 23rd National Sovereignty and Children's Day"
    },  
   shortDesc: {
    tr: "Meryem Dolu, Sevilay Erdoğan, Eda Yavuz ve Sude Nur Öztürk tarafından Mahmutlar Kılıçarslan İlkokulu ve Köy Yaşam Merkezi’nde 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında Dünya Çocukları temalı eğitsel oyunlar ve bayram etkinlikleri gerçekleştirildi.",
    
    en: "Educational games and Children of the World themed activities were organized at Mahmutlar Kılıçarslan Primary School and Village Life Center by Meryem Dolu, Sevilay Erdoğan, Eda Yavuz, and Sude Nur Öztürk within the scope of the April 23 National Sovereignty and Children’s Day celebrations."
},
   longDesc: {
    tr: `
23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında Mahmutlar Kılıçarslan İlkokulu ve Köy Yaşam Merkezi’nde gerçekleştirilen etkinlikler, öğrenciler, öğretmenler ve veliler için unutulmaz bir bayram atmosferi oluşturmuştur. Alanya Alaaddin Keykubat Üniversitesi Eğitim Fakültesi Temel Eğitim Bölümü Sınıf Eğitimi Anabilim Dalı 3. sınıf öğrencileri Meryem Dolu, Sevilay Erdoğan, Eda Yavuz ve Sude Nur Öztürk, etkinlik sürecinde aktif rol alarak öğrencilerle birebir ilgilenmiş ve bayram coşkusunun daha güçlü hissedilmesine katkı sağlamıştır.

Etkinlik hazırlıkları bayram gününden haftalar önce başlamıştır. Üniversite öğrencileri belirli aralıklarla okulu ziyaret ederek 3. ve 4. sınıf öğrencileriyle kaynaşmış, birlikte oyunlar oynayarak öğrencilerle güçlü bir iletişim kurmuştur. Özellikle “Molekül” ve “Kale-Prens” oyunlarının öğretildiği prova süreçlerinde öğrencilerin oldukça heyecanlı, enerjik ve istekli oldukları gözlemlenmiştir. Öğrenciler oyunlar aracılığıyla takım ruhu geliştirmiş, iş birliği kurmuş ve eğlenerek öğrenme sürecine aktif katılım sağlamıştır.

23 Nisan günü okul, “Dünya Çocukları” konseptiyle rengârenk bir festival alanına dönüşmüştür. Öğrenciler farklı ülkelere ait kıyafetlerle etkinliğe katılmış, kültürel çeşitliliği yansıtan görüntüler oluşturmuştur. Üniversite öğrencileri tarafından her çocuğa temsil ettiği ülkenin bayrağı dağıtılmış ve öğrenciler ellerindeki bayraklarla dünya çocuklarının kardeşliğini simgeleyen anlamlı bir atmosfer oluşturmuştur.

Program günün anlam ve önemine ilişkin konuşmalarla başlamış, ardından öğrenciler kırmızı halıda yürüyerek büyük alkış toplamıştır. Çocukların kendilerini özgüvenli ve özel hissettikleri gözlemlenmiştir. Veliler öğrencilerini gururla izlerken, öğrencilerin sahne deneyimi sayesinde kendilerini ifade etme becerilerinin desteklendiği görülmüştür.

Etkinliğin ilerleyen aşamalarında gerçekleştirilen maskot gösterileri öğrencilerin eğlenceli vakit geçirmesini sağlamıştır. Ardından öğrencilere yemek, dondurma, patlamış mısır ve çeşitli hediyeler dağıtılmıştır. Gün boyunca öğrencilerin oldukça mutlu ve heyecanlı oldukları gözlemlenmiştir.

Etkinlik kapsamında gerçekleştirilen “Molekül” ve “Kale-Prens” oyunları öğrencilerin yoğun ilgisiyle karşılanmıştır. Molekül oyununda öğrenciler müzik eşliğinde hareket ederek verilen yönergelere uygun şekilde gruplar oluşturmuştur. Bu süreçte dikkat becerileri, hızlı düşünme yetileri ve grup hâlinde hareket etme becerileri desteklenmiştir. Öğrencilerin birbirlerini oyuna dahil etmeye çalışmaları dayanışma ve arkadaşlık duygularını güçlendirmiştir.

Kale-Prens oyununda ise öğrenciler takım hâlinde hareket ederek strateji geliştirmiş ve arkadaşlarını korumaya çalışmıştır. Oyun sırasında öğrencilerin sürekli iletişim kurduğu, birbirlerini desteklediği ve iş birliği içerisinde hareket ettiği gözlemlenmiştir. Çocukların oyunlara yoğun ilgi göstermesi nedeniyle etkinlik alanında sık sık kahkahalar ve tezahüratlar yükselmiştir. Bazı öğrenciler oyunların tekrar oynanmasını istemiş ve gönüllü olarak etkinliklere katılım göstermeye devam etmiştir.

Etkinlik sonunda gerçekleştirilen kapanış programıyla birlikte öğrenciler hem eğlenmiş hem de 23 Nisan’ın birlik, kardeşlik ve çocuklara verilen değeri simgeleyen anlamını yaşayarak öğrenme fırsatı bulmuştur. Gerçekleştirilen etkinliklerin öğrencilerin sosyal iletişim becerilerini, iş birliği duygularını, özgüvenlerini ve kültürel farkındalıklarını desteklediği gözlemlenmiştir.

Bu süreç, grup üyelerine etkinlik planlama, büyük grupları yönetme, öğrencilerle etkili iletişim kurma ve okul-aile iş birliğinin önemini deneyimleme fırsatı sunmuştur. Öğrencilerden, velilerden ve okul yönetiminden alınan olumlu geri bildirimler doğrultusunda etkinliğin amaçlarına başarılı bir şekilde ulaştığı değerlendirilmiştir.
    `,
    
    en: `
The activities organized within the scope of the 23 April National Sovereignty and Children’s Day at Mahmutlar Kılıçarslan Primary School and Village Life Center created an unforgettable celebration atmosphere for students, teachers, and parents. Third-year students from the Department of Primary Education at Alanya Alaaddin Keykubat University Faculty of Education — Meryem Dolu, Sevilay Erdoğan, Eda Yavuz, and Sude Nur Öztürk — actively participated in the process, worked closely with the students, and contributed to strengthening the excitement and joy of the celebration.

The preparation process for the event started weeks before the celebration day. The university students visited the school regularly, spent time with the 3rd and 4th grade students, and built strong communication through games and interactive activities. During the rehearsals of the “Molecule” and “Castle-Prince” games, students were observed to be highly energetic, enthusiastic, and eager to participate. Through these games, students improved their teamwork skills, cooperation abilities, and active participation in the learning process.

On April 23rd, the school turned into a colorful festival area with the theme of “Children of the World.” Students attended the event wearing costumes representing different countries, creating a vibrant atmosphere reflecting cultural diversity. University students distributed flags representing each child’s assigned country, symbolizing unity, friendship, and solidarity among children around the world.

The program began with speeches emphasizing the importance and meaning of the day. Afterwards, students walked on a red carpet and received great applause. It was observed that the children felt confident and special during this moment. Parents proudly watched their children, while students had the opportunity to improve their self-expression and stage confidence.

Later in the program, mascot performances added excitement and entertainment to the celebration. Students were also offered food, ice cream, popcorn, and various gifts throughout the day. It was clearly observed that the children were happy, excited, and highly engaged during the activities.

The “Molecule” and “Castle-Prince” games attracted great interest from the students. In the Molecule game, students moved with music and quickly formed groups according to the instructions given. Through this activity, their attention skills, quick thinking abilities, and teamwork skills were supported. Students’ efforts to include each other in the games strengthened their sense of friendship and cooperation.

In the Castle-Prince game, students worked together as teams, developed strategies, and tried to protect their teammates. Throughout the game, students constantly communicated, supported one another, and cooperated actively. Due to the students’ enthusiasm, the event area was frequently filled with laughter and cheering. Some students expressed that they wanted to replay the games and voluntarily continued participating in the activities.

At the end of the event, the closing ceremony allowed students to both enjoy themselves and experience the true meaning of April 23rd, symbolizing unity, friendship, and the value given to children. The activities were observed to contribute positively to students’ social communication skills, cooperation abilities, self-confidence, and cultural awareness.

This process also provided valuable experience for the group members in event planning, classroom and group management, effective communication with students, and understanding the importance of school-family cooperation. Based on the positive feedback received from students, parents, and the school administration, the event was considered highly successful in achieving its intended goals.
    `
}, 
    images: [
        "assets/images/bayram12.1.png",
        "assets/images/bayram12.2.png",
        "assets/images/bayram12.3.png",
        "assets/images/bayram12.4.png",
        "assets/images/bayram12.5.png",
        "assets/images/bayram12.6.png",
        "assets/images/bayram12.7.png",
        "assets/images/bayram12.8.png",
        "assets/images/bayram12.9.png",
        "assets/images/bayram12.10.png",
        "assets/images/bayram12.11.png",
        "assets/images/bayram12.12.png",
        "assets/images/bayram12.13.png",
        "assets/images/bayram12.14.png",
        
    ],  
    coverImage: "assets/images/bayram12.1.png"
  },

bayram13: {
    category: "gallery2",
    title: {
        tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
        en: "April 23rd National Sovereignty and Children's Day"
    },  
   shortDesc: {
    tr: "Muhammed Delil Taş tarafından, Mahmutlar İlkokulunda 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında bayram etkinlikleri gerçekleştirildi.",
    en: "Muhammed Delil Taş organized National Sovereignty and Children’s Day activities at Mahmutlar Primary School as part of the April 23rd celebrations."
},  
longDesc: {
  tr: `
Etkinliğin Tanıtımı

Eğitimde Program Dışı Etkinlikler dersi kapsamında, 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı coşkusunu öğrencilerimizle paylaşmak amacıyla okul genelinde kapsamlı bir çalışma gerçekleştirdik. Sınıf öğretmenlerimizle yürüttüğümüz bu süreçte, özellikle 1. ve 2. sınıf düzeyindeki öğrencilerle (2/A, 2/E, 2/F ve 2/G şubeleri) bir araya gelerek çeşitli dans ve ritim koreografileri üzerine odaklandık. Temel amacımız, Gazi Mustafa Kemal Atatürk’ün çocuklara armağan ettiği bu anlamlı günde, öğrencilerin bayram sevincini doyasıya yaşamalarını sağlamak ve sahne sanatları aracılığıyla özgüvenlerini desteklemekti.

Hazırlık Süreci

Etkinliklerin uygulama gününde sorunsuz ve etkili bir şekilde sergilenebilmesi için hazırlık sürecine haftalar öncesinden başladık. 18 Mart, 25 Mart, 1 Nisan, 8 Nisan ve 15 Nisan tarihlerinde, her biri birer saat süren düzenli prova çalışmaları gerçekleştirdik. Bu provalarda şube öğretmenleriyle iş birliği içinde çalışarak, öğrencilere "Edalı Modalı" adlı eserin dans koreografisini öğrettik. Sürecin teknik boyutunda da aktif rol alarak, çocukların sahnedeki dizilimlerinin estetik bir şekilde ayarlanması ve müzik/ses sistemlerinin eksiksiz çalışması için gerekli düzenlemelere destek oldum. Hazırlık aşamasında öğretmenlerimizle uyum içinde çalışmak, sürecin en verimli kısımlarından biriydi.

Uygulama Günü

Büyük bir heyecanla beklenen 23 Nisan günü geldiğinde, okul bahçesi tam bir şenlik alanına dönüşmüştü. Öğrencilerimiz "Edalı Modalı" gösterisinin yanı sıra, İzmir Marşı eşliğinde hazırlanan koreografiyi ve modern ritim dans gösterilerini büyük bir coşkuyla sergilediler. Etkinlik boyunca sahada aktif bir gözlemci olarak yer aldım. Sadece kendi sorumlu olduğum sınıfların değil, törene katılan tüm sınıf düzeylerinin sergiledikleri performansları kapsamlı bir şekilde takip ettim.

Gözlemlerimiz

Tören sırasındaki en çarpıcı gözlemim, haftalarca süren disiplinli provaların çocukların sahne hakimiyetine ne denli olumlu yansıdığıydı. Öğrencilerin kalabalık bir izleyici kitlesi önünde sergiledikleri performans kalitesi ve kitle yönetimi oldukça başarılıydı. Okul idaresinin ve öğretmenlerin sağladığı güven verici atmosfer, çocukların hata yapma endişesi taşımadan, sadece ana odaklanarak özgürce dans etmelerine olanak tanıdı. Süreç boyunca okulda son derece enerjik, iş birlikçi ve coşkulu bir atmosfer hakimdi.

Çocuklardan Aldığımız Dönütler

Gösteri sonrasında çocukların gözlerindeki mutluluk ve yaşadıkları gurur, sürecin en güzel yansımasıydı. Haftalar süren provaların ardından sahnede alkışlanmak, öğrencilerde güçlü bir başarma duygusu yarattı. Birçok öğrenci gösteri bitiminde heyecanla yanımıza gelerek dans etmeyi ne kadar sevdiklerini dile getirdi. Kendi aralarında performanslarını değerlendirirken sergiledikleri tatlı heyecan, bu tür etkinliklerin onların aidiyet duygusunu ve arkadaşlık bağlarını ne kadar güçlendirdiğini bizlere gösterdi.

Bu Deneyimin Bize Kazandırdıkları

Bu süreç, eğitimde sadece sınıf içi akademik faaliyetlerin değil, program dışı etkinliklerin de ne kadar kritik bir öneme sahip olduğunu bir kez daha kanıtladı. Kalabalık öğrenci gruplarıyla prova yönetimi yapabilme, sahne organizasyonunda görev alma ve teknik sistemleri (ses/müzik) sürece uygun şekilde entegre edebilme konularında önemli pratik beceriler kazandım. Tüm bunların ötesinde, çocukların bayram heyecanına ortak olmanın ve onların sosyal gelişimlerine doğrudan katkıda bulunmanın, mesleki motivasyonumu ve eğitim süreçlerine olan inancımı çok daha güçlü bir noktaya taşıdığını söyleyebilirim.

Sonuç ve Genel Değerlendirme

Genel olarak değerlendirildiğinde, 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında Mahmutlar İlkokulu'nda gerçekleştirdiğimiz dans ve koreografi etkinliklerinin planlanan hedeflere başarıyla ulaştığı görülmektedir. Öğrencilerin sahne sanatları aracılığıyla kendilerini ifade etmelerine, özgüven kazanmalarına ve bayram coşkusunu paylaşmalarına olanak tanıyan bu süreç, öğretmenlik mesleğine dair vizyonumu genişleten çok kıymetli bir deneyim olmuştur. Gerçekleştirdiğimiz bu çalışmalar sayesinde, gelecekteki meslek hayatımda benzer organizasyonları çok daha donanımlı ve planlı bir şekilde yönetebileceğime olan inancım artmıştır. Süreç boyunca tecrübeleriyle bana her adımda rehberlik eden değerli sınıf öğretmenimiz İlyas Hoca’ya ve etkinliklerimizi okul ortamında güvenle hayata geçirmemize olanak tanıyan Mahmutlar İlkokulu İdaresi'ne teşekkürlerimi sunarım. Tabii ki en büyük teşekkür, bitmek bilmeyen enerjileri ve kocaman gülümsemeleriyle bu süreci benim için unutulmaz kılan harika öğrencilerimize aittir. Bu etkinlik, hem çocuklar hem de benim için kalıcı ve değerli kazanımlarla sonuçlanmıştır.
  `,
  en: `
Event Introduction

Within the scope of the “Out-of-School Activities in Education” course, we carried out a comprehensive study across the school in order to share the excitement of April 23 National Sovereignty and Children’s Day with our students. In collaboration with classroom teachers, we worked especially with 1st and 2nd grade students (2/A, 2/E, 2/F, and 2/G classes), focusing on various dance and rhythm choreographies. Our main goal was to ensure that students fully experience the joy of this meaningful day gifted to children by Mustafa Kemal Atatürk and to support their self-confidence through performing arts.

Preparation Process

In order to ensure that the activities could be performed smoothly and effectively on the event day, we started the preparation process weeks in advance. On March 18, March 25, April 1, April 8, and April 15, we conducted regular one-hour rehearsal sessions. During these rehearsals, we worked in collaboration with class teachers and taught students the choreography of the piece titled “Edalı Modalı.” I also actively contributed to technical arrangements such as stage formation and ensuring that music and sound systems worked properly. Working in harmony with teachers was one of the most efficient aspects of the process.

Implementation Day

When the long-awaited April 23 arrived, the schoolyard turned into a festive celebration area. Our students performed the choreography prepared for “Edalı Modalı,” the Izmir March, and modern rhythm dances with great enthusiasm. Throughout the event, I took an active observational role. I closely monitored not only my assigned classes but also all performances across grade levels.

Observations

The most striking observation during the ceremony was how positively weeks of disciplined rehearsals reflected on the students’ stage performance. Their quality of performance and crowd management in front of a large audience were highly successful. The supportive atmosphere created by the school administration and teachers allowed students to perform freely without fear of making mistakes. The overall environment throughout the process was energetic, collaborative, and highly enthusiastic.

Feedback from Students

After the performance, the happiness and pride in the students’ eyes were the most meaningful reflection of the process. Performing on stage after weeks of rehearsals created a strong sense of achievement. Many students came to us excitedly after the event, expressing how much they enjoyed dancing. Their discussions about their performances showed how such activities strengthen their sense of belonging and friendship bonds.

What This Experience Gave Us

This process once again demonstrated the critical importance of extracurricular activities in education, beyond classroom-based academic learning. I gained valuable practical skills in managing large student groups during rehearsals, organizing stage performances, and integrating technical systems (sound/music) into educational activities. More importantly, sharing children’s excitement and contributing directly to their social development significantly strengthened my professional motivation and belief in education.

Conclusion and Overall Evaluation

Overall, it can be concluded that the dance and choreography activities conducted at Mahmutlar Primary School for April 23 National Sovereignty and Children’s Day successfully achieved their intended objectives. This process, which enabled students to express themselves through performing arts, gain self-confidence, and share the spirit of the celebration, has been a highly valuable experience that broadened my perspective on the teaching profession. Through this work, I have become more confident that I will be able to manage similar events in a more structured and professional way in my future career. I sincerely thank our classroom teacher İlyas Hoca, who guided me throughout the process, and the administration of Mahmutlar Primary School for enabling us to safely implement these activities. Above all, my deepest gratitude goes to the wonderful students whose endless energy and smiles made this process unforgettable. This activity resulted in lasting and meaningful gains for both the children and myself.
  `
},    images: [
        "assets/images/bayram13.1.png",
        "assets/images/bayram13.2.png",
        "assets/images/bayram13.3.png",
        "assets/images/bayram13.4.png",
        "assets/images/bayram13.5.png",
        "assets/images/bayram13.6.png",
    ],  
    coverImage: "assets/images/bayram13.1.png"
  },

  bayram14: {
    category: "gallery2",
    title: {
        tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
        en: "April 23rd National Sovereignty and Children's Day"
    },

    shortDesc: {
  tr: "Songül Karademir, Elif Nisa Kestek ve İbrahim Halil Akkuş tarafından Nezihat Abdullah Doğan İlkokulunda 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında 3. sınıf öğrencileriyle çeşitli etkinlikler gerçekleştirildi.",
  en: "Various activities were carried out with 3rd-grade students at Nezihat Abdullah Doğan Primary School by Songül Karademir, Elif Nisa Kestek, and İbrahim Halil Akkuş as part of the April 23 National Sovereignty and Children's Day celebrations."
},
    longDesc: {
    tr: `
    Hazırlık Süreci:
23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında Songül Karademir, Elif Nisa Kestek, İbrahim Halil Akkuş’tan oluşan grubumuzla Antalya ili Alanya ilçesi Nezihat Abdullah Doğan İlkokulu 3. Sınıflarla etkinlikler yaptık. Etkinliğin hazırlık aşamasında, resmi tören programında yer alacak gösteri ve koreografilerin profesyonel bir düzeyde yürütülmesi amacıyla dışarıdan bir eğitmen istihdam edilmiştir. Bu süreçte eğitmen rehberliğinde gerçekleştirilen çalışmalar ve provalar takip edilmiştir. Yapılan provaları gözlemleme fırsatı, çocukların ritim, koordinasyon ve sahne duruşu gibi becerilerinin gelişimini izleme açısından önemli pedagojik veriler sunmuştur. Hazırlık dönemi, koordinasyonun sağlanması ve öğrencilerin sürece hazırlanması odaklı yürütülmüştür.
Uygulama Süreci:
Uygulama aşaması, resmî tören günü ve töreni takip eden günler olmak üzere planlı bir akışla gerçekleştirilmiştir:
23 Nisan Tören Günü: Bayram gününde resmi kutlama programı icra edilmiştir. Öğrencilerin tören alanındaki katılım düzeyleri gözlemlenmiş, programın tamamlanmasının ardından öğrenciler bayram coşkusuyla evlerine uğurlanmıştır.
Tören Sonrası Günler (Geleneksel Oyunlar uygulaması): Kutlamaları takip eden eğitim-öğretim günlerinde, bayram havasını okul ortamında sürdürmek ve öğrencilerin akran etkileşimini güçlendirmek amacıyla okul bahçesinde eğlenceli etkinlikler düzenlenmiştir. Bu kapsamda öğrencilere kültürel mirasımızın önemli birer parçası olan geleneksel çocuk oyunları oynatılmıştır. Süreçte özellikle “Mendil Kapmaca” ve “Yağ Satarım, Bal Satarım” oyunlarına yer verilerek öğrencilerin fiziksel, sosyal ve duygusal gelişimleri oyun temelli etkinliklerle desteklenmiştir.
Gözlemlerimiz:
Hazırlık sürecinde okul idaresinin destekleyici yaklaşımı ve dış kaynaklı uzman desteğiyle provalar başarıyla takip edilmiştir. Uygulama gününde okul bahçesinin küçük, öğrenci mevcudunun ise kalabalık olması gibi çevresel faktörler, kutlamaların verimliliğini ve aktif katılımı sınırlamış olsa da sonraki günlerde yürütülen oyun temelli uygulamalar bu açığı kapatmıştır. Özellikle Mendil Kapmaca gibi grup dinamiklerini ön plana çıkaran geleneksel oyunlar, çocukların bayram coşkusunu okul ortamında akranlarıyla birlikte deneyimlemelerine ve sürecin pedagojik açıdan olumlu bir çıktıya ulaşmasına zemin hazırlamıştır.
Çocuklardan Aldığımız Dönütler:
Kutlamaları takip eden günlerde okul bahçesinde düzenlenen geleneksel çocuk oyunları uygulaması, öğrenciler tarafından büyük bir sevinç ve yüksek bir motivasyonla karşılanmıştır. Çocuklar, bu oyunlar sayesinde okul ortamında akranlarıyla birlikte çok keyifli ve nitelikli zaman geçirdiklerini ifade etmişlerdir. Özellikle “Mendil Kapmaca” oyununa karşı yoğun bir ilgi gösteren öğrenciler, bu oyunu oynarken çok eğlendiklerini, arkadaşlarıyla birlikte takım ruhunu ve tatlı bir rekabeti deneyimlemekten büyük keyif aldıklarını heyecanla dile getirmişlerdir. Hem “Mendil Kapmaca” hem de “Yağ Satarım, Bal Satarım” gibi oyunlar sayesinde sınıf içi bağlarını güçlendiren çocukların, oyun temelli bu etkinlikler neticesinde okula yönelik aidiyet duygularının, neşelerinin ve enerjilerinin en üst düzeye ulaştığı somut bir şekilde gözlemlenmiştir.
Bu Deneyimin Bize Kazandırdıkları:
23 Nisan kutlama programının hazırlık, provalar ve tören anı dahil olmak üzere her aşamasını yakından gözlemlemek, büyük çaplı okul organizasyonlarının yönetimi ve dinamikleri hakkında profesyonel bir vizyon edinmemizi sağlamıştır. Bu süreç, öğretmenlik mesleğinde dinamik şartlara uygun esnek eylem planları ve alternatif pedagojik çözümler üretebilme becerimizi üst düzeye çıkarmıştır. Töreni takip eden günlerde okul bahçesinde uygulanan "Mendil Kapmaca" ve "Yağ Satarım, Bal Satarım" gibi geleneksel oyunlar ise oyun temelli öğrenmenin çocukların neşesi ve akran bağlılığı üzerindeki bütünleştirici gücünü somut bir şekilde ortaya koymuştur. Hazırlık sürecinde okul idaresinin destekleyici tutumuyla yürütülen bu geniş kapsamlı deneyim, öğrenci gözlem kabiliyetimizi güçlendirirken, gelecekteki eğitim-öğretim planlamalarımızda çocuk merkezli aktivitelere ve oyun temelli stratejilere yer vermenin önemini kalıcı bir mesleki kazanım olarak pekiştirmiştir.
Sonuç ve Genel Değerlendirme: 
23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kutlama programı; hazırlık aşamasından tören uygulamasına ve ardından yürütülen geleneksel çocuk oyunları sürecine kadar öğretmenlik mesleğinin çok boyutlu yapısını somutlaştıran nitelikli bir deneyim olmuştur. Hazırlık sürecinde dış kaynaklı uzman desteğiyle yürütülen provalar ve bu süreçte okul idaresinin sergilediği son derece destekleyici tutum, kurumsal iş birliğinin ve eş güdümlü çalışmanın önemini ortaya koymuştur. Geniş bir katılım ortamında gerçekleştirilen 23 Nisan resmî tören süreci, büyük ölçekli okul organizasyonlarının yönetimsel ve operasyonel boyutlarını sahada gözlemleme fırsatı sunmuştur. Töreni takip eden günlerde eğitim-öğretim ortamına dahil edilen "Mendil Kapmaca" ve "Yağ Satarım, Bal Satarım" gibi geleneksel çocuk oyunları ise sürecin pedagojik verimliliğini üst düzeye çıkarmıştır. Özellikle çocukların büyük bir coşku ve odaklanmayla katıldığı Mendil Kapmaca oyunu, oyun temelli öğrenmenin öğrencilerin okula aidiyet, motivasyon ve akran etkileşimi üzerindeki yapılandırıcı gücünü kanıtlamıştır. Sonuç olarak bu süreç, planlı organizasyonların takibi, öğrenci odaklı gözlem kabiliyetinin geliştirilmesi ve çocuk merkezli serbest zaman etkinliklerinin dinamik yapısının fark edilmesi açısından gelecekteki öğretmenlik uygulamalarımıza yön verecek çok değerli ve kalıcı mesleki kazanımlarla başarıyla tamamlanmıştır.
 `,
  en: `Preparation Process:
Within the scope of the April 23 National Sovereignty and Children’s Day, our group consisting of Songül Karademir, Elif Nisa Kestek, and İbrahim Halil Akkuş carried out activities with 3rd-grade students at Nezihat Abdullah Doğan Primary School in Alanya, Antalya. In the preparation phase of the event, an external instructor was hired to ensure that the performances and choreographies included in the official ceremony program were executed at a professional level. The rehearsals conducted under the guidance of the instructor were closely monitored. Observing these rehearsals provided important pedagogical insights into the development of students’ skills such as rhythm, coordination, and stage presence. The preparation period focused on ensuring coordination and preparing students for the process.
Implementation Process:

The implementation phase was carried out with a planned flow, including the official ceremony day and the days following the ceremony:  
April 23 Ceremony Day: On the day of the celebration, an official program was executed. The level of student participation in the ceremony area was observed, and after the completion of the program, students were sent home with the excitement of the celebration.
Days Following the Ceremony (Traditional Games Implementation): In the following educational days after the celebrations, fun activities were organized in the schoolyard to maintain the festive atmosphere and strengthen peer interaction among students. Within this scope, traditional children’s games, which are an important part of our cultural heritage, were played with the students. The process particularly included games such as “Mendil Kapmaca” and “Yağ Satarım, Bal Satarım,” supporting students’ physical, social, and emotional development through game-based activities.
Observations:
During the preparation process, the supportive approach of the school administration and the external expert support allowed for successful monitoring of rehearsals. Environmental factors such as a small schoolyard and a large student population on the implementation day limited the efficiency of the celebrations and active participation; however, the game-based applications carried out in the following days filled this gap. Traditional games that highlighted group dynamics, especially “Mendil Kapmaca,” provided a foundation for children to
experience the excitement of the celebration in the school environment with their peers and contributed to achieving a positive pedagogical outcome from the process.
Feedback from Students:
The traditional children’s games implemented in the schoolyard in the days following the celebrations were met with great joy and high motivation by the students. The children expressed that they had a very enjoyable and quality time in the school environment with their peers through these games. Particularly, students showed intense interest in the “Mendil Kapmaca” game, expressing with excitement that they had a lot of fun playing this game and enjoyed experiencing team spirit and friendly competition with their friends. Both “Mendil Kapmaca” and “Yağ Satarım, Bal Satarım” games strengthened class bonds, and it was observed that students’ sense of belonging to the school, their joy, and energy reached its peak as a result of these game-based activities.
What This Experience Gave Us:
Closely observing every stage of the April 23 celebration program, including preparation, rehearsals, and the moment of the ceremony itself, provided us with a professional vision regarding the management
and dynamics of large-scale school organizations. This process significantly enhanced our ability to produce flexible action plans and alternative pedagogical solutions suitable for dynamic conditions in the teaching profession. The traditional games such as “Mendil Kapmaca” and “Yağ Satarım, Bal Satarım” implemented in the schoolyard in the days following the ceremony concretely demonstrated the integrative power of game-based learning on students’ joy and peer bonding. This extensive experience, conducted with the supportive attitude of the school administration during the preparation process, strengthened our student observation skills and reinforced the importance of including child-centered activities and game-based strategies in our future educational planning as a lasting professional gain.
Conclusion and Overall Evaluation:
The April 23 National Sovereignty and Children’s Day celebration program was a qualified experience that concretized the multidimensional nature of the teaching profession, from the preparation phase to the implementation of the ceremony and the subsequent traditional children’s games process. The rehearsals conducted with external expert support during the preparation phase and the highly supportive attitude of the school administration highlighted the importance of institutional collaboration and coordinated work. The official ceremony process, carried out in an environment with wide participation, provided an opportunity to observe the managerial and operational aspects of large-scale school organizations in the field. The traditional children’s games such as “Mendil Kapmaca” and “Yağ Satarım, Bal Satarım” included in the educational environment in the days following the ceremony maximized the pedagogical efficiency of the process. Particularly, the “Mendil Kapmaca” game, which students participated in with great enthusiasm and focus, proved the constructive power of game-based learning on students
’ sense of belonging, motivation, and peer interaction. As a result, this process was successfully completed with very valuable and lasting professional gains that will guide our future teaching practices in terms of following planned organizations, developing student-focused observation skills, and recognizing the dynamic nature of child-centered leisure activities.
  `
},    images: [
        "assets/images/bayram14.1.png",
        "assets/images/bayram14.2.png",
        "assets/images/bayram14.3.png",
        "assets/images/bayram14.4.png",
      
    ],  
    coverImage: "assets/images/bayram14.1.png"
  },




odoo1: {
    category: "gallery3",
    title: {
      tr: "Adalet Kulübü - Değerler Eğitimi",
      en: "Justice Club - Values Education"
    },
    shortDesc: {
    tr: "Fatma Erdoğan, Fatma Aydın, Hazal Kulaz ve Zeynep Su Sağlamer tarafından Bilgi Bulut İlkokulu’nda “Adalet Kulübü” kapsamında gerçekleştirilen değerler eğitimi etkinlikleri.",
    en: "Values education activities carried out within the scope of the “Justice Club” at Bilgi Bulut Primary School by Fatma Erdoğan, Fatma Aydın, Hazal Kulaz, and Zeynep Su Sağlamer."
},
   longDesc: {
    tr:
        "Okul seçim sürecimiz oldukça sorunsuz ve verimli geçti. Bilgi Bulut İlkokulu’nu tercih etmemizdeki en büyük etken, okulun aktif etkinlik kültürü ve idari birimin iş birliğine açık tutumuydu. Okul atmosferi, öğrenci merkezli bir yaklaşıma sahip olduğu için oldukça uygundu. Okul müdürünün son derece donanımlı olması, tüm öğrencilerin gelişim süreçlerine hakimiyeti ve bizlere sağladığı rehberlik, uygulama sürecindeki olası aksaklıkların oluşmadan önlenmesini sağladı. Okul müdürü ve öğretmenler, resmi izinlerin alınmasından gezi lojistiğine kadar her aşamada sorularımızı yanıtlayarak bize destek oldular. " +

        "Bu süreçte etkinliği gerçekleştirdiğimiz sınıfın öğretmeni, aktif öğretmenlik tecrübesi kazanmamız için büyük bir özveri gösterdi. Attığımız her adımda sunduğu yapıcı eleştiriler ve değerli geri bildirimlerle mesleki gelişimimize katkı sağladı. Yeri geldiğinde sınıfını bize emanet ederek, etkinliklerimiz dışında da teorik bilgilerin gerçek bir sınıf ortamında nasıl pratiğe dökülebileceğini yaşayarak öğrenmemizi sağladı. " +

        "Adalet ve hak gibi soyut kavramların yalnızca anlatım yoluyla değil, yerinde gözlem ve yaşantı temelli öğrenme ile kalıcı hale gelebileceği düşüncesi bizi bu etkinliği seçmede motive etti. Çocukların adliye atmosferini deneyimlemesi ve bir hakime doğrudan soru sorabilmesi, teorik bilgiyi hayatın içine taşıma fırsatı sundu. " +

        "Adalet Kulübü çalışmaları kapsamında planlanan tüm aşamalarda aktif rol aldık. Süreç; sınıfta hikâye anlatımıyla ön bilgi oluşturma, merak edilen soruların not alınması, adliye gezisi, Hakim Hanım ile söyleşi, duruşma salonunda drama çalışması ve yaratıcı yazma etkinliğini kapsamaktaydı. Ayrıca 23 Nisan hazırlıkları sürecinde gözlemci olarak bulunup süslemelere ve bazı provalara destek verdik. " +

        "Etkinlik sürecinde öğrenci motivasyonunu canlı tutmak amacıyla “Winnie the Pooh” gibi çocukların dünyasına hitap eden karakterler üzerinden giriş yapıldı. Gezi öncesinde öğrencilere sorumluluk verilerek sorular hazırlatıldı; kurallar broşürü ve etkinlik kâğıtlarıyla öğrencilerin kendilerini birer “genç araştırmacı” gibi hissetmeleri sağlandı. Hakim Hanım’a çiçek takdim etmeleri ise öğrencilerin sürecin bir parçası olduklarını hissetmelerine katkı sağladı. " +

        "Bunun sonucunda öğrencilerin bilişsel düzeyde konuya oldukça hakim ve sorgulayıcı oldukları gözlemlendi. Duyuşsal olarak ise adliyeye ilk adımı attıkları andan itibaren büyük bir heyecan ve merak içerisinde oldukları görüldü. Özellikle Hakim Hanım’ın sıcak yaklaşımı ve öğrencilere verdiği hediyeler, onların sürece olan bağlılığını ve öğrenme isteğini üst seviyeye çıkardı. " +

        "Bu deneyim bizlere yalnızca sınıf içi ders anlatımını değil, okul dışı bir organizasyonun nasıl yönetileceğini de öğretti. Milli Eğitim Bakanlığı ve Adalet Bakanlığı gibi resmi kurumlarla yürütülen bürokratik süreçler, bir gezinin güvenli ve öğretici şekilde planlanması ve özel günlerde okul iklimine katkı sağlama süreçleri doğrudan deneyimlenmiş oldu. " +

        "Elde edilen verim ve öğrencilerden alınan dönütler oldukça olumlu olduğu için planlamada önemli bir eksiklik hissedilmemiştir. Aynı etkinlik tekrar gerçekleştirilecek olsa yine aynı titizlikle uygulanmasının tercih edileceği düşünülmektedir. " +

        "Kendimizi başarılı buluyoruz çünkü çocukların zihninde “Adalet” kavramına dair kalıcı ve olumlu bir iz bırakıldığı gözlemlenmiştir. Öğrencilerin etkinlik sonrasında da adalet, eşitlik ve hak kavramları üzerine düşünmeye devam etmeleri ve küçük yaş grubunda olmalarına rağmen bu kavramları kendi yaşamlarından örneklerle sorgulamaları, etkinliğin amacına ulaştığını göstermektedir. Böylece hem bizim hem de öğrencilerimiz için unutulmaz bir farkındalık ve deneyim süreci tamamlanmıştır.",

    en:
        "Our school selection process was very smooth and productive. The biggest reason for choosing Bilgi Bulut Primary School was its active event culture and the cooperative attitude of the administrative staff. The school atmosphere was highly suitable because it followed a student-centered approach. The school principal’s competence, awareness of students’ developmental processes, and guidance provided to us helped prevent possible problems before they even occurred. The principal and teachers supported us at every stage, from obtaining official permissions to organizing the trip logistics. " +

        "During this process, the classroom teacher of the class where we carried out the activity showed great dedication in helping us gain active teaching experience. Through constructive criticism and valuable feedback, the teacher contributed significantly to our professional development. At times, the teacher entrusted the classroom to us, allowing us to experience how theoretical knowledge could be transformed into practice in a real classroom environment. " +

        "The idea that abstract concepts such as justice and rights could become permanent not only through explanation but also through observation and experiential learning motivated us to choose this activity. Allowing children to experience the courthouse atmosphere and ask questions directly to a judge provided an opportunity to bring theoretical knowledge into real life. " +

        "We took active roles in all stages planned within the scope of the Justice Club activities. The process included creating prior knowledge through storytelling in the classroom, writing down students’ questions, a courthouse visit, an interview with a judge, a drama activity in the courtroom, and a creative writing activity. In addition, we participated as observers during the April 23 preparations and supported the decorations and some rehearsals. " +

        "In order to keep student motivation high, an introduction was made using characters such as “Winnie the Pooh,” which appealed to children’s interests. Before the trip, students were given responsibilities and asked to prepare questions. Rule brochures and activity sheets helped them feel like “young researchers.” Presenting flowers to the judge also made students feel like an important part of the process. " +

        "As a result, students were observed to be cognitively knowledgeable and highly inquisitive about the topic. Emotionally, they were excited and curious from the moment they entered the courthouse. The judge’s warm attitude and the gifts given to students significantly increased their engagement and willingness to learn. " +

        "This experience taught us not only how to teach in a classroom but also how to manage an out-of-school organization. We directly experienced the bureaucratic processes carried out with official institutions such as the Ministry of National Education and the Ministry of Justice, as well as how to organize a safe and educational trip and contribute to the school climate during special occasions. " +

        "Since the efficiency of the activity and the feedback received from students were highly positive, no major shortcomings were felt in the planning process. If the same activity were to be repeated, it would again be carried out with the same level of care and attention. " +

        "We consider ourselves successful because we believe we left a lasting and positive impression of the concept of “Justice” in the minds of children. The fact that students continued to think about justice, equality, and rights even after the activity, and questioned these concepts using examples from their own lives despite their young age, demonstrated that the activity achieved its goals. Thus, an unforgettable process of awareness and experience was completed for both us and our students."
},
    images: [
      "assets/images/odoo1.1.png",
      "assets/images/odoo1.2.png",
      "assets/images/odoo1.3.png",
      "assets/images/odoo1.4.png",
      "assets/images/odoo1.5.png",
      "assets/images/odoo1.6.png",
      "assets/images/odoo1.7.png",
    ],
    coverImage: "assets/images/odoo1.1.png"

  },

odoo2: {
    category: "gallery3",
    title: {
        tr: "Akvaryum Etkinliği",
        en: "Aquarium Activity"
    },
    shortDesc: {
    tr: "Ceyda ÇOLAK, Beyza YAŞASIN, Dilara GÜLOĞLU ve Yusuf Emin GÜL tarafından Nimet Alaattinoğlu İlkokulu’nda gerçekleştirilen Akvaryum Etkinliği.",
    
    en: "Aquarium Activity organized by Ceyda ÇOLAK, Beyza YAŞASIN, Dilara GÜLOĞLU, and Yusuf Emin GÜL at Nimet Alaattinoğlu Primary School."
},
   longDesc: {
tr: `
Eğitimde Program Dışı Etkinlikler dersi kapsamında, öğrencilerin sınıf dışı öğrenme yaşantıları kazanmalarını desteklemek amacıyla Nimet Alaattinoğlu İlkokulu öğrencilerine yönelik Antalya Akvaryum gezisi planlanmış ve uygulanmıştır. Okulun ulaşım açısından kolay erişilebilir olması, okul yönetimi ve sınıf öğretmenlerinin iş birliğine açık ve destekleyici yaklaşımları bu okulun tercih edilmesinde etkili olmuştur.

Antalya Akvaryum gezisinin temel amacı, öğrencilerin teorik bilgilerini gerçek yaşam deneyimleriyle ilişkilendirmelerini sağlamak, sınıf dışı öğrenme ortamlarında doğrudan gözlem yapmalarına fırsat tanımak ve çevre bilinci kazanmalarına katkıda bulunmaktır. Deniz canlılarının yaşam alanlarının incelenmesi, farklı ekosistemlerin tanınması ve doğal yaşamın korunmasının öneminin gözlemlenebilmesi etkinliğin eğitimsel değerini artırmıştır. Ayrıca öğrencilerin merak duygularını harekete geçiren ve aktif katılımlarını destekleyen bir öğrenme ortamı sunulmuştur.

Etkinliğin planlama aşamasında öğrencilerin yaş özellikleri, ilgi alanları ve gelişim düzeyleri dikkate alınarak sistemli bir hazırlık süreci yürütülmüştür. Gezi öncesinde öğrencilerin konuya yönelik hazır bulunuşluklarını artırmak amacıyla çeşitli etkinlikler gerçekleştirilmiştir. İlk olarak gezi sırasında uyulması gereken kurallar açıklanmış, güvenlik konusunda dikkat edilmesi gereken hususlar üzerinde durulmuştur. Ardından soru-cevap yöntemi kullanılarak öğrencilerin mevcut bilgileri ortaya çıkarılmış ve gezi sırasında karşılaşabilecekleri canlılar hakkında düşünmeleri sağlanmıştır.

Hazırlık sürecinde öğrencilerin yaratıcılıklarını geliştirmek ve konuya olan ilgilerini artırmak amacıyla “Hayalimdeki Balık” isimli çizim etkinliği uygulanmıştır. Öğrenciler kendi hayal dünyalarından yola çıkarak farklı özelliklere sahip balıklar tasarlamış ve bu tasarımlar sınıf ortamında oluşturulan akvaryum modelinde sergilenmiştir. Karton kutular kullanılarak hazırlanan akvaryum modeli öğrencilerin ilgisini çekmiş ve onları etkinliğe karşı daha motive hâle getirmiştir.

Bunun yanı sıra öğrencilerin empati kurma ve kendilerini yazılı olarak ifade etme becerilerini geliştirmek amacıyla “Ben bir balık olsaydım…” konulu yazma etkinliği gerçekleştirilmiştir. Öğrenciler bir balığın gözünden çevreyi nasıl gördüklerini ve nasıl bir yaşam sürmek istediklerini anlatan metinler yazmışlardır. Bu etkinlik sayesinde öğrenciler hem hayal güçlerini kullanma hem de duygu ve düşüncelerini etkili bir şekilde ifade etme fırsatı bulmuşlardır.

Çevre bilincinin geliştirilmesine yönelik olarak temiz ve kirli su bulunan iki ayrı kavanoz kullanılarak su kirliliği etkinliği uygulanmıştır. Öğrencilere yöneltilen sorular aracılığıyla çevre kirliliğinin canlı yaşamı üzerindeki etkileri hakkında düşünmeleri sağlanmış, çevre sorunlarının nedenleri ve sonuçları üzerinde durulmuştur. Böylece öğrencilerin gözlem yapma, neden-sonuç ilişkisi kurma, sorgulama ve eleştirel düşünme becerilerinin gelişimine katkı sağlanmıştır.

Antalya Akvaryum gezisi 28 Nisan tarihinde gerçekleştirilmiştir. Gezi günü öğrenciler büyük bir heyecan ve merak içerisinde etkinlik alanına gelmişlerdir. Gezi başlamadan önce güvenlik kuralları tekrar hatırlatılmış, öğrencilerin gezi süresince nasıl davranmaları gerektiği açıklanmış ve etkinliğin amacı yeniden vurgulanmıştır.

Akvaryum gezisi sırasında öğrencilerin pasif izleyici konumunda kalmamaları amacıyla her öğrenciye görev ve gözlem kartları dağıtılmıştır. Bu kartlarda öğrencilerin dikkatlerini belirli noktalara yönlendirecek sorular yer almıştır. Öğrencilerden gördükleri canlıları incelemeleri, özelliklerini gözlemlemeleri ve dikkatlerini çeken ayrıntıları not etmeleri istenmiştir. Bu uygulama sayesinde öğrenciler öğrenme sürecine aktif olarak katılmışlardır.

Gezi boyunca öğrenciler farklı balık türlerini, deniz canlılarını ve su altı ekosistemlerini yakından inceleme fırsatı bulmuşlardır. Öğrencilerin birçok canlı hakkında merak ettikleri soruları sordukları, gözlemlerini arkadaşlarıyla paylaştıkları ve gördükleri canlılar arasında karşılaştırmalar yaptıkları gözlemlenmiştir. Bu durum öğrenmenin kalıcılığını artırmış ve öğrencilerin keşfetme isteğini desteklemiştir.

Gezi sonrasında edinilen bilgilerin pekiştirilmesi amacıyla istasyon tekniği kullanılarak çeşitli çalışmalar gerçekleştirilmiştir. Çevre kirliliği, doğal yaşamın korunması ve canlılara zarar vermeme bilinci ile ilişkilendirilen etkinliklerde öğrenciler küçük gruplar hâlinde çalışmışlardır. Her istasyonda farklı görevler yerine getiren öğrenciler hem bireysel hem de grup çalışmalarına katılmış, iş birliği yapma ve ortak ürün ortaya koyma deneyimi yaşamışlardır.

Etkinlik süreci boyunca öğrencilerin hem bilişsel hem de duyuşsal açıdan yüksek düzeyde motivasyona sahip oldukları gözlemlenmiştir. Özellikle akvaryum gezisi sırasında öğrencilerin heyecanlarının ve öğrenmeye yönelik ilgilerinin belirgin şekilde arttığı görülmüştür. Hazırlık aşamasında gerçekleştirilen çizim, yazma ve çevre bilinci etkinliklerinin de öğrencilerin gezi sürecine daha bilinçli ve ilgili katılmalarında etkili olduğu düşünülmektedir.

Etkinlik boyunca herhangi bir ciddi problem yaşanmamış, öğrencilerin kurallara büyük ölçüde uydukları ve etkinliklere aktif katılım gösterdikleri görülmüştür. Öğretmenlerin rehberliği ve öğrencilerin olumlu tutumları etkinliğin planlandığı şekilde yürütülmesine katkı sağlamıştır.

Etkinlik sonunda öğrencilerden oldukça olumlu geri bildirimler alınmıştır. Öğrencilerin büyük çoğunluğu akvaryum gezisini çok eğlenceli ve öğretici bulduklarını ifade etmiş, özellikle daha önce görmedikleri canlıları yakından inceleme fırsatı bulmalarının kendilerini mutlu ettiğini belirtmişlerdir. Görev kartlarıyla gözlem yapmanın dikkatlerini artırdığını ve geziyi daha anlamlı hâle getirdiğini ifade etmişlerdir.

Bu deneyim, öğretmenlik mesleğinin yalnızca sınıf içerisinde bilgi aktarmaktan ibaret olmadığını, öğrencilerin sosyal, duygusal ve çevresel farkındalıklarını geliştiren öğrenme yaşantıları oluşturmanın da öğretmenin temel sorumluluklarından biri olduğunu göstermiştir. Süreç boyunca etkinlik planlama, organizasyon yapma, zaman yönetimi, sınıf yönetimi ve öğrenciyle etkili iletişim kurma konularında önemli deneyimler kazanılmıştır.

Genel olarak değerlendirildiğinde Antalya Akvaryum gezisinin amaçlarına büyük ölçüde ulaştığı, öğrencilerin çevre bilinci, gözlem yapma, sorgulama, araştırma ve iş birliği becerilerinin gelişimine katkı sağladığı düşünülmektedir. Etkinlik hem öğrenciler hem de öğretmen adayları açısından unutulmaz, öğretici ve mesleki gelişimi destekleyici bir deneyim olarak değerlendirilmiştir.
`,

en: `
Within the scope of the Out-of-School Activities in Education course, a field trip to Antalya Aquarium was planned and implemented for the students of Nimet Alaattinoğlu Primary School in order to support learning experiences outside the classroom. The school's accessibility, along with the supportive and cooperative attitudes of the administration and classroom teachers, played an important role in its selection.

The main purpose of the Antalya Aquarium trip was to help students connect theoretical knowledge with real-life experiences, provide opportunities for direct observation in out-of-class learning environments, and contribute to the development of environmental awareness. Observing marine habitats, exploring different ecosystems, and understanding the importance of protecting natural life increased the educational value of the activity. The trip also provided an engaging learning environment that encouraged curiosity, research, and active participation.

During the planning phase, students' age characteristics, interests, and developmental levels were taken into consideration. Various preparatory activities were organized to increase students’ readiness before the trip. First, safety rules and behavioral expectations were explained. Then, through question-and-answer activities, students’ prior knowledge was revealed and they were encouraged to think about the marine creatures they would encounter.

To increase creativity and interest in the topic, students participated in a drawing activity called “The Fish of My Dreams.” They designed imaginative fish with unique characteristics and displayed them in a classroom aquarium model made from cardboard boxes. This activity enhanced creativity, visual expression, and design skills.

In addition, a writing activity titled “If I Were a Fish…” was conducted to improve empathy and written expression skills. Students wrote texts describing how they would see the world and live their lives if they were a fish. This activity allowed them to use their imagination while expressing their thoughts and feelings effectively.

To raise environmental awareness, a water pollution activity was carried out using jars filled with clean and polluted water. Through guided questions, students reflected on the effects of environmental pollution on living organisms and discussed its causes and consequences. This activity supported observation, critical thinking, inquiry, and cause-and-effect reasoning skills.

The Antalya Aquarium trip took place on April 28. Students arrived at the venue with great excitement and curiosity. Before the tour began, safety rules were reviewed and the purpose of the trip was emphasized once again.

To ensure active participation, each student received an observation and task card containing guiding questions. Students were asked to examine marine creatures, observe their characteristics, and record interesting details. As a result, they became active participants in the learning process rather than passive observers.

Throughout the visit, students closely examined various fish species, marine animals, and underwater ecosystems. They asked questions, shared observations with classmates, and compared different species. These experiences strengthened learning retention and encouraged exploration.

After the trip, station-based activities were conducted to reinforce learning. Students worked in small groups on tasks related to environmental pollution, protecting natural habitats, and respecting living creatures. Through these activities, they experienced both individual and collaborative learning while developing teamwork skills.

Throughout the process, students demonstrated high levels of both cognitive and emotional motivation. Their enthusiasm and interest increased significantly during the aquarium visit. The preparatory drawing, writing, and environmental awareness activities also helped students participate more consciously and effectively.

No significant problems occurred during the activity. Students generally followed the rules and participated actively. The guidance provided by teachers and the positive attitudes of students contributed greatly to the successful implementation of the trip.

Students provided very positive feedback after the activity. Most described the aquarium trip as both educational and enjoyable. They especially appreciated the opportunity to closely observe marine creatures they had never seen before. Many students stated that the observation cards helped them pay closer attention and made the experience more meaningful.

This experience demonstrated that teaching is not limited to classroom instruction; it also involves creating learning experiences that foster students’ social, emotional, and environmental awareness. Throughout the process, valuable experience was gained in planning, organization, time management, classroom management, and effective communication with students.

Overall, the Antalya Aquarium trip successfully achieved its objectives. It contributed to the development of environmental awareness, observation, inquiry, research, and collaboration skills. The activity was considered an unforgettable, educational, and professionally enriching experience for both students and teacher candidates.
`
},

    images: [
        "assets/images/odoo2.1.png",
        "assets/images/odoo2.2.png",
        "assets/images/odoo2.3.png",
        "assets/images/odoo2.4.png",
        "assets/images/odoo2.5.png",
        "assets/images/odoo2.6.png",
        "assets/images/odoo2.7.png",
        "assets/images/odoo2.8.png",
        "assets/images/odoo2.9.png",
        "assets/images/odoo2.10.png",
        "assets/images/odoo2.11.png",
        "assets/images/odoo2.12.png",
    ],
    coverImage: "assets/images/odoo2.1.png"
},
 
};
 
renderAllGalleries();

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

  if (loader) {

    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);

  }

});

const fadeElements = document.querySelectorAll(".fade-up");

fadeElements.forEach(el => observer.observe(el));

window.addEventListener("scroll", () => {
  const header = document.querySelector("header");

  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
