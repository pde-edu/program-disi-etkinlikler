
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
        tr: "Turizm Haftası",
        en: "Tourism Week"
    },

    shortDesc: {
    tr: "15-22 Nisan Turizm Haftası kapsamında, Nagihan KARAKAYA, Sılanur OKUR, Merve GÜLER ve Beyzanur KARABURÇ tarafından Alanya/Antalya’da bulunan Kestel İlkokulu’nda gerçekleştirilen etkinliklerde öğrencilerin turizm bilinci, kültürel miras farkındalığı ve yerinde öğrenme deneyimleri desteklenmiştir.",
    
    en: "Within the scope of Tourism Week (15–22 April), activities carried out at Kestel Primary School in Alanya/Antalya by Nagihan KARAKAYA, Sılanur OKUR, Merve GÜLER, and Beyzanur KARABURÇ aimed to improve students’ tourism awareness, cultural heritage understanding, and place-based learning experiences."
},  

   longDesc: {
    tr: `
Bu çalışma; Alanya Alaaddin Keykubat Üniversitesi (ALKÜ) Sınıf Öğretmenliği Eğitimi Ana Bilim Dalı 3. sınıf öğrencilerinden oluşan Nagihan KARAKAYA, Sılanur OKUR, Merve GÜLER ve Beyzanur KARABURÇ tarafından, tamamen gönüllülük esasına dayalı bir liderlikle yürütülmüştür.

Etkinliğimiz, 15-22 Nisan Turizm Haftası kapsamında, Antalya’nın Alanya ilçesinde yer alan Kestel İlkokulu’nda, 2. sınıf düzeyindeki öğrencilerle gerçekleştirilmiştir. Temel amacımız, erken çocukluk dönemindeki öğrencilere turizm bilincini aşılamak, kültürel mirasımızı tanıtmak ve bunu yaparken aktif öğrenme yöntemlerini kullanmaktır.

Okul seçimi sürecinde, daha önceden de birlikte etkinlikler yürüttüğümüz Kestel İlkokulu tercih edilmiştir. Görüşmelerimiz ve resmi izin süreçlerimiz oldukça olumlu seyretmiş, okul yönetimi ve sınıf öğretmenimizle kurulan güçlü iletişim sayesinde okul seçiminde ve koordinasyonda herhangi bir sıkıntı yaşanmamıştır.

Turizm Haftası’nı seçmemizdeki en büyük etken, yaşadığımız bölgenin bir turizm kenti olmasıydı. Öğrencilerimize “Yerli Turistler” diyerek etkinliğimize başladık. Onlara fotoğraf makineleri hazırladık ve gördükleri yerlerin hayali fotoğraflarını çekmelerini istedik. Somut ve soyut kültürel miras unsurlarını oyunla birleştirmek, birer öğretmen adayı olarak bizleri fazlasıyla heyecanlandırdı.

Ders danışman öğretmenimizin yönlendirdiği okul, almamız gereken sorumluluğu bize sağlayamadığı için ve okulun ulaşımı da bize zor olduğu için yeni bir okul seçtik. Bu okulla daha önceden topluluğumuzla yürüttüğümüz etkinlikler olduğundan dolayı okula aşinaydık. Ancak izin sürecimiz okul değiştirdiğimiz için aksadı. Bu durum 23 Nisan kutlamalarında gözlemci olarak rol almamıza sebep oldu. Belirli gün ve haftalar kutlamasında herhangi bir sorun yaşamadık.

Çocukların gezi etkinliğinden keyif alabilecek olması bizim temel amacımızdı. Sonunda da öğrencilerimizden güzel geri dönüşler aldık. Dolayısıyla amacımıza ulaştık.

23 Nisan’da gözlemci olacağımızdan dolayı hazırlık sürecinde sadece provaları izleme şansımız oldu. 23 Nisan günü çocukların heyecanına ortak olduk. Sergiledikleri oyunları büyük bir keyifle izledik. Anı olarak fotoğraf ve video çekindik.

Kale gezisinden önce Alanya Belediyesi’nden öğrencilerimizi Alanya Kalesi’ne geziye götüreceğimize dair gerekli izinler alındı. Bu süreçte dilekçeler tarafımızca hazırlandı ve okul yönetimi gerekli mercilere başvuruda bulundu. Ardından öğrencilere veli izin belgeleri dağıtıldı. Gezi günü okulun ayarladığı servislerle iki şube olarak gezimize başladık. Öğrencilerimiz birer turist, bizler ise birer rehberdik.

Gezi kapsamında sırasıyla İç Kale, Bedesten, Kültür Evi, Herbaryum ve Süleymaniye Camii ziyaret edildi. Yapılan anlatımlar sırasında öğrencilerin merak duygularının arttığı gözlemlendi. Hazırladığımız fotoğraf makineleriyle öğrenciler ziyaret ettikleri alanların hayali fotoğraflarını çekerek anılarını zihinlerine kazıdılar.

Öğrencilerin bilişsel motivasyonlarının gezi boyunca oldukça yüksek olduğu gözlemlendi. 2. sınıf düzeyinde soyut kalabilecek tarihi ve kültürel kavramlar, yerinde öğrenme yöntemiyle somutlaştırıldı. Herbaryum ziyaretinde öğrenciler farklı bitki ve hayvan türlerini dikkatle inceleyerek biyolojik çeşitliliğe karşı merak geliştirdiler. Süleymaniye Camii, Bedesten, Kültür Evi ve İç Kale gezilerinde öğrenciler dikkatle dinlediler ve çeşitli sorular sorarak yeni bilgileri anlamlandırmaya çalıştılar.

Öğrenciler yalnızca pasif birer dinleyici olmadılar; görerek, dokunarak ve mekanın atmosferini hissederek öğrenme sürecine aktif şekilde katıldılar. Bu durumun akademik bilgilerin kalıcılığını artırdığı düşünülmektedir.

Yolculuk esnasında öğrencilerle birlikte şarkılar söylendi. Hazırlanan fotoğraf makineleri öğrencilerin boyunlarına asıldı ve “Bugün sizler birer yerli turistsiniz.” denilerek öğrencilerin motivasyonu artırıldı. İlgi çekici bir gezi rotası oluşturuldu ve Kale’de piknik yapıldı. Öğrencilerin piknik alanından ayrılmak istememeleri etkinlikten ne kadar keyif aldıklarının göstergesi oldu.

Gezi sonrasında sınıfa dönülerek değerlendirme etkinlikleri gerçekleştirildi. Bu süreçte Altı Şapka Tekniği kullanıldı ve öğrenciler etkinlik hakkındaki düşüncelerini paylaştılar. Ayrıca öğrencilere dondurma ikram edildi ve yüz boyama etkinlikleri yapıldı. Öğrencilerin bu etkinliklerden büyük keyif aldığı gözlemlendi.

Kestel İlkokulu’nun atmosferi hem 23 Nisan etkinlikleri hem de gezi süreci için oldukça uygundu. Okul yönetimi ulaşım, izin süreçleri, ücretsiz giriş desteği ve kahvaltı organizasyonu gibi birçok konuda destek sağladı. Öğretmenlerin ve okul yönetiminin tüm gün boyunca sürece eşlik etmesi de önemli bir destek unsuru oldu.

Etkinliğin amacına ulaştığı düşünülmektedir. Özellikle İç Kale ve Bedesten ziyaretleri öğrencilerin tarihî miras kavramını somutlaştırmalarını sağlarken, Herbaryum sayesinde Alanya’nın doğası ve bitki örtüsü hakkında farkındalık kazandıkları gözlemlendi. Kültür Evi ise geçmiş yaşam kültürünü doğrudan gözlemlemelerine fırsat sundu.

Etkinlik tekrar gerçekleştirilecek olursa, sınıf sayısının bire düşürülmesinin daha verimli olacağı düşünülmektedir. Ayrıca zaman açısından daha geniş bir planlama yapılabilirse Kızılkule ve Tersane gibi yeni durakların da gezi rotasına eklenebileceği öngörülmektedir.

Bu süreç sayesinde öğrencilerin çevrelerini pasif birer izleyici olarak değil, aktif birer araştırmacı olarak görmeleri desteklenmiştir. Öğrencilerin detaylara dikkat etme, neden-sonuç ilişkisi kurma, geçmiş ile günümüz arasında bağlantı kurma ve kültürel değerlere karşı duyarlılık geliştirme becerileri ön plana çıkmıştır.

Gezi süreci aynı zamanda öğrencilerin sosyal uyum, arkadaşlık ilişkileri, öz kontrol, sorumluluk alma ve açık alanda güvenli hareket etme becerilerini de desteklemiştir. Her ne kadar öğrenci sayısının fazla olması nedeniyle zaman zaman sınıf hakimiyeti konusunda zorluk yaşansa da süreç genel olarak başarılı bir şekilde yönetilmiştir.

Etkinlik sonunda hem okul yönetiminden hem sınıf öğretmenlerinden hem de öğrencilerden alınan olumlu geri bildirimler, çalışmanın başarılı olduğunu göstermiştir. Bu süreç, hem öğrenciler hem de öğretmen adayları açısından unutulmaz ve öğretici bir deneyim olmuştur.
    `,
    en: `
This project was carried out voluntarily by Nagihan KARAKAYA, Sılanur OKUR, Merve GÜLER, and Beyzanur KARABURÇ, who are third-year students in the Department of Primary School Teaching at Alanya Alaaddin Keykubat University (ALKÜ).

The activity was organized within the scope of Tourism Week (15–22 April) with second-grade students at Kestel Primary School in Alanya, Antalya. The main aim of the project was to help young students develop tourism awareness, recognize cultural heritage, and experience active learning methods.

During the school selection process, Kestel Primary School was preferred because our group had previously carried out activities there. Communication with the school administration and classroom teacher was very positive, and no problems were experienced during the permission or coordination processes.

One of the biggest motivations for choosing Tourism Week was the fact that the region where we live is an important tourism city. We introduced the students as “Local Tourists” and prepared paper cameras for them. Students were asked to take imaginary photographs of the places they visited. Combining tangible and intangible cultural heritage elements with games and active participation was very exciting for us as teacher candidates.

Initially, another school recommended by our academic advisor was considered; however, due to transportation difficulties and limited opportunities for responsibility-taking, we changed our school preference. Since we were already familiar with Kestel Primary School through previous community projects, the adaptation process was easy. However, the school change caused delays in permission procedures, which resulted in our participation in the 23 April celebrations only as observers.

Our main goal was for the children to enjoy the educational trip, and the positive feedback we received from the students showed that we successfully achieved this goal.

Because we participated in the 23 April celebrations as observers, we only had the opportunity to watch the rehearsal process. On the day of the celebration, we shared the students’ excitement, enjoyed watching their performances, and took photos and videos as memories.

Before the castle trip, official permissions were obtained from the Alanya Municipality for student entrance and transportation. Petition documents were prepared by our group, and the school administration completed the official applications. Parent permission forms were then distributed to students. On the day of the trip, transportation arranged by the school allowed us to begin the tour with two classrooms. Students became tourists, while we acted as tour guides.

During the trip, students visited İç Kale, Bedesten, Kültür Evi, Herbaryum, and Süleymaniye Mosque. As explanations were provided throughout the trip, students’ curiosity visibly increased. Using the cameras we prepared, students took imaginary photographs and created meaningful memories connected to the places they visited.

Students’ cognitive motivation remained very high throughout the trip. Historical and cultural concepts that might otherwise remain abstract for second-grade students were concretized through place-based learning experiences. During the Herbarium visit, students carefully examined different plant and animal species and developed curiosity about biodiversity. While visiting Süleymaniye Mosque, Bedesten, Kültür Evi, and İç Kale, students listened attentively and asked various questions to better understand the information presented.

Students were not passive listeners during the process. Instead, they actively participated by observing, touching, and experiencing the atmosphere of the historical places. This active participation contributed to the permanence of their learning.

During the journey, songs were sung together with the students. The cameras prepared for them were hung around their necks, and they were encouraged with the statement, “Today, you are local tourists.” An engaging travel route was created, and a picnic was organized at the castle. Students’ unwillingness to leave the picnic area showed how much they enjoyed the experience.

After the trip, evaluation activities were conducted in the classroom. During this stage, the Six Thinking Hats Technique was used, and students shared their opinions about the activity. Ice cream was also distributed, and face-painting activities were organized. Students were observed to enjoy these activities greatly.

The atmosphere of Kestel Primary School was highly suitable for both the 23 April celebrations and the educational trip. The school administration supported the process by organizing transportation, permission procedures, free entrance arrangements, and breakfast supplies. The support of teachers and administrators throughout the day contributed greatly to the success of the event.

It is believed that the activity successfully achieved its goals. Visits to İç Kale and Bedesten helped students concretize the concept of historical heritage, while the Herbarium increased their awareness of Alanya’s nature and plant diversity. Kültür Evi provided students with the opportunity to directly observe elements of past daily life and culture.

If the trip were to be repeated, it is believed that organizing the activity with only one classroom would make classroom management easier. In addition, if more time were available, locations such as Kızılkule and the Shipyard could also be added to the route.

Throughout the process, students were encouraged to view their surroundings not as passive observers but as active researchers. Their abilities to notice details, establish cause-and-effect relationships, connect past and present, and develop sensitivity toward cultural values became more visible.

The trip also contributed to students’ social adaptation, friendships, self-control, responsibility-taking, and safe movement in open environments. Although managing a large number of students occasionally created difficulties in maintaining classroom authority, the process was generally carried out successfully.

At the end of the project, the positive feedback received from the school administration, classroom teachers, and students demonstrated that the activity was successful. Overall, the process became an unforgettable and highly educational experience for both the students and the teacher candidates.
    `
},  

    images: [
        "assets/images/etkinlik3.1.png",
        "assets/images/etkinlik3.2.png",
        "assets/images/etkinlik3.3.png",
        "assets/images/etkinlik3.4.png",
        "assets/images/etkinlik3.5.png",
    ],  

  coverImage: "assets/images/etkinlik3.1.png"
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
        tr: "18 Mart Çanakkale Zaferi, Müzeler Haftası",
        en: "18 March Çanakkale Victory, Museums Week"  
    },

    shortDesc: {
    tr: "Songül Karademir, Elif Nisa Kestek ve İbrahim Halil Akkuş tarafından Nezihat Abdullah Doğan İlkokulu’nda gerçekleştirilen 18 Mart Çanakkale Zaferi ve Müzeler Haftası etkinlikleri.",
    en: "18 March Çanakkale Victory and Museum Week activities carried out at Nezihat Abdullah Doğan Primary School by Songül Karademir, Elif Nisa Kestek, and İbrahim Halil Akkuş."
},
    longDesc: {
    tr: `
Okul seçiminde herhangi bir sorun yaşanmadı. Belirlediğimiz okul destekleyici ve etkinliklere açık bir okuldu. Çocuklara kendilerine ait bir müze oluşturtmak; müzelerin ve tarihi eserlerin önemini empati kurarak benimsemelerini sağlamak, her birine kendini ifade etme fırsatı sunmak ve düşüncelerinin önemli olduğunu hissettirmek açısından bizleri motive etti.

İlk olarak 18 Mart Çanakkale Zaferi etkinliklerinde, Çanakkale mücadelesi ve askerlerimizin yaşadığı zorlukları anlatmak amacıyla öğrencilere askerlerin yemek listesini hazırladık ve bir köşeye dönemi yansıtan temsili eşyalar yerleştirdik. Üzüm hoşafı ve ekmek dağıtarak öğrencilerin bir öğünü deneyimlemelerini sağladık. Böylece öğrencilerin empati kurmaları, zorlu mücadeleyi anlamaları ve vatan sevgisini kavramaları amaçlandı.

Müzeler Haftası kapsamında ise öğrencilerden kendilerine ve ailelerine ait önemli, geçmişi olan eşyalar getirmeleri istendi. Daha sonra sınıfta bir müze köşesi oluşturuldu. Öğrencilere eserin adı, sahibi ve kısa hikâyesinin yazılı olduğu kartlar dağıtıldı. Öğrenciler kartları doldurduktan sonra sırayla eşyalarının hikâyelerini anlatarak sınıf müzesini oluşturdular. Sınıf müzesinin adı ise “Vızıltı 44” tekniği kullanılarak belirlendi. Dörder kişilik gruplar belirlenen sürede isim önerileri sundu ve demokratik oylama sonucunda müzenin adı seçildi.

Müze gezisi öncesinde öğrencilere müzelerin ne olduğu, müzelerde nasıl davranılması gerektiği ve dikkat edilmesi gereken kurallar sunum yöntemiyle anlatıldı. Ayrıca öğrencilerin yakalarına hazırladığımız müze rozetleri takıldı. Müze gezisi sırasında öğrenciler rehberi dikkatle dinleyerek eserler hakkında bilgi edindiler.

Öğrencilerin bilişsel ve duyuşsal motivasyonlarının oldukça yüksek olduğu gözlemlendi. Öğrenciler sorulan sorulara dikkatle cevap verdiler ve etkinliklere aktif katılım sağladılar. Duyuşsal açıdan heyecanlı ve istekli oldukları görüldü. Öğrencilerin dikkatini çekmek ve motivasyonlarını artırmak amacıyla etkinlikler onların gelişim düzeylerine uygun şekilde hazırlandı. Müze gezisi öncesinde sınıflarının adının yazdığı rozetlerin takılmasıyla aidiyet duyguları desteklendi ve ekip olarak bir keşfe çıkıldığı hissi oluşturuldu.

Okulun oldukça kalabalık olması zaman zaman bazı zorluklar oluştursa da okul yönetimi ihtiyaç duyulan her konuda destek sağladı. Etkinliklerin amacına ulaştığı düşünülmektedir. Özellikle öğrencilerin sınıfta oluşturulan müze köşesini özenle korumaları ve müze gezisinde aynı duyarlılığı göstermeleri sürecin olumlu etkilerini ortaya koymuştur.

Etkinlikler sonrasında öğrencilerden olumlu dönütler alındı. Öğrenciler etkinlikleri çok sevdiklerini, eğlendiklerini ve yeni bilgiler öğrendiklerini ifade ettiler. Bir sonraki etkinlikte öğrencilerin sınıf müzesine yeni eşyalar getirerek köşeyi geliştirmeye devam etmeleri, müzenin önemini kavradıklarının göstergesi oldu.

Eğitimde Program Dışı Etkinlikler dersi kapsamında gerçekleştirilen bu süreç sayesinde sınıf yönetimi, zaman yönetimi, etkinlik planlama ve öğrencilerin bilişsel-duyuşsal düzeylerine uygun etkinlik hazırlama konularında uygulamalı deneyim kazanıldı. Yapılan etkinliklerin öğrencilerin iletişim becerilerini, özgüvenlerini, empati kurma ve kendini ifade etme becerilerini geliştirdiği gözlemlendi. Süreç boyunca öğrencilerin etkinliklere istekli ve aktif katılım göstermesi, etkinliklerin başarılı ve amacına uygun şekilde gerçekleştirildiğini göstermiştir.
    `,
    en: `
There were no major problems during the school selection process. The school we selected was supportive and open to educational activities. Encouraging children to create their own classroom museum helped them better understand the importance of museums and historical artifacts through empathy, while also giving each student the opportunity to express themselves and feel that their ideas were valuable.

As part of the 18 March Çanakkale Victory activities, we prepared a symbolic military meal menu and created a special corner with items representing the period in order to help students understand the hardships experienced by soldiers during the Çanakkale War. Students were served grape compote and bread so they could experience a symbolic wartime meal. The aim was to help them empathize with the soldiers, understand the challenges of war, and develop a sense of patriotism.

During Museum Week, students were asked to bring meaningful items belonging to themselves or their families that had a historical or emotional story. A classroom museum corner was then created. Students were given cards containing the name of the item, the owner, and a short story about it. After filling out the cards, each student introduced their object and shared its story with the class. The name of the classroom museum was chosen using the “Buzz 44” technique, where groups of four students suggested names and voted democratically for the final choice.

Before the museum visit, students were informed about what museums are, how to behave in museums, and the rules that should be followed during the visit. Museum badges prepared by our team were attached to the students’ clothes to strengthen their sense of belonging and teamwork. During the museum trip, students listened carefully to the guide and learned about the exhibited artifacts.

It was observed that students’ cognitive and emotional motivation levels were very high throughout the activities. Students answered questions attentively and participated actively in all activities. Emotionally, they were enthusiastic, excited, and eager to learn. Activities were carefully designed according to students’ developmental levels to maintain their attention and motivation.

Although the school environment was quite crowded at times, the administration provided all necessary support. It was observed that the students carefully protected the classroom museum corner and showed the same sensitivity during the museum trip, demonstrating that the activities achieved their intended goals.

Positive feedback was received from the students after the activities. They expressed that they enjoyed the activities, had fun, and learned many new things. During later visits, students continued bringing additional objects to expand the classroom museum, which showed that they understood the importance and purpose of the project.

Through these activities carried out within the scope of the “Out-of-School Activities in Education” course, practical experience was gained in classroom management, time management, activity planning, and preparing activities appropriate to students’ cognitive and emotional development levels. The activities also contributed to the development of students’ communication skills, self-confidence, empathy, and self-expression abilities. The active and enthusiastic participation of students throughout the process demonstrated that the activities were successful and effectively achieved their goals.
    `
},
    images: [
        "assets/images/etkinlik6.1.png",
        "assets/images/etkinlik6.2.png",
        "assets/images/etkinlik6.3.png",
        "assets/images/etkinlik6.4.png",
        "assets/images/etkinlik6.5.png",
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
      tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
      en: "April 23rd National Sovereignty and Children's Day"
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
        tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
        en: "April 23rd National Sovereignty and Children's Day"
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
        tr: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
        en: "April 23rd National Sovereignty and Children's Day"
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
Bu çalışma, Eğitimde Program Dışı Etkinlikler dersi kapsamında Dr. Öğr. Üyesi Sibel Dal hocamızın yönlendirmesiyle İnönü İlkokulu’nda grubumuz tarafından gerçekleştirilmiştir. Etkinliğe grup üyeleri gönüllü olarak katılım sağlamıştır. Seçilen ilkokulun müziğe, oyunlara ve yarışmalara olan ilgisi ile dinamik yapısı, etkinliklerin planlanması ve yürütülmesi sürecinde önemli bir motivasyon kaynağı olmuştur.

Gerçekleştirilen etkinliklerden ilki “Yağ Satarım Bal Satarım” oyunudur. Bu etkinlikte oyun alanının hazırlanması, yarışmacı öğrencilerin belirlenmesi, öğrencilerin hizalanması ve hakemlik süreçlerinde aktif rol alınmıştır. Etkinlik yaklaşık üç hafta boyunca haftada bir gün prova yapılarak hazırlanmıştır. Öğrencilerin oyun sürecine yoğun ilgi gösterdiği ve kurallara uyma konusunda istekli davrandıkları gözlemlenmiştir.

Bir diğer etkinlik ise “Tohumlar Fidana” isimli koro çalışmasıdır. Bu etkinlikte grup üyeleri aktif görev almış; Gökhan Deniz yönlendirici rol üstlenirken Mehmet, Muhammed ve Renas yardımcı rolünde yer almıştır. Koro çalışması, 19 Mayıs Atatürk’ü Anma, Gençlik ve Spor Bayramı kapsamında okulda gösteri olarak sunulmuştur. Öğrenciler şarkı çalışmalarına büyük bir heyecanla katılmış ve canlı gitar eşliğinde yapılan provalar motivasyonlarını artırmıştır.

Gerçekleştirilen tüm etkinliklerde 2. sınıf öğrencilerinin bilişsel ve duyuşsal katılım düzeylerinin oldukça yüksek olduğu gözlemlenmiştir. Program dışı etkinliklerin öğrencilerin yalnızca fiziksel ve sanatsal becerilerini değil; aynı zamanda dikkat, odaklanma ve iş birliği becerilerini de geliştirdiği görülmüştür. Süreç boyunca öğrenciler etkinliklere yoğun ilgi göstermiş ve etkinliklerle güçlü bir duygusal bağ kurmuştur.

Öğrencilerin motivasyonunu artırmak amacıyla dinamik ve eğlenceli yöntemler kullanılmıştır. “Yağ Satarım Bal Satarım” oyununda çocukların doğal ilgisi adil bir yönetim anlayışı ve uygun alan düzenlemesiyle desteklenmiştir. “Tohumlar Fidana” koro çalışmasında ise etkinliğin açık havada ve canlı gitar eşliğinde gerçekleştirileceğinin belirtilmesi öğrencilerin heyecanını artırmış ve çalışmalara daha büyük bir istekle katılmalarını sağlamıştır.

Okul atmosferinin ve öğretmenlerin yaklaşımının etkinlikler için oldukça uygun olduğu görülmüştür. Öğretmenler sürecin başından itibaren destekleyici bir tutum sergilemiş, aileler de etkinliklere katkı sağlayarak sürecin kolaylaşmasına yardımcı olmuştur. Özellikle koro çalışması için gerekli enstrümanların temin edilmesinde velilerin desteği önemli bir katkı sağlamıştır.

Etkinliklerin belirlenen amaçlara büyük ölçüde ulaştığı değerlendirilmiştir. “Yağ Satarım Bal Satarım” oyunu sayesinde öğrencilerin kurallara uyma, sıra bekleme ve iş birliği becerilerinde gelişim gözlemlenmiştir. Koro çalışması ise öğrencilerin ritim duygularını, özgüvenlerini ve topluluk önünde performans sergileme becerilerini desteklemiştir. Öğrencilerin süreç boyunca gösterdiği yüksek motivasyon ile öğretmen ve velilerin desteği, etkinliklerin verimli bir şekilde tamamlanmasını sağlamıştır.

Etkinliklerin tekrar gerçekleştirilmesi durumunda, koro çalışmasına farklı ritim aletlerinin eklenmesi ve canlı enstrüman çeşitliliğinin artırılması planlanmaktadır. Ayrıca açık hava etkinliklerinde hava koşullarının daha ayrıntılı düşünülmesi gerektiği fark edilmiştir. Özellikle hakemlik yapılan süreçlerde ve öğrencilerin açık alanda uzun süre bulunduğu etkinliklerde şapka, güneş kremi ve gölgelik alan gibi koruyucu önlemlerin önceden planlanmasının önemli olduğu değerlendirilmiştir.

Öğrencilerden alınan geri bildirimler oldukça olumlu olmuştur. Süreç boyunca öğrencilerin mutluluğu, enerjileri ve etkinliklerin devam etmesini istemeleri etkinliklerin başarısını gösteren en önemli dönütlerden biri olmuştur.

Bu deneyim sayesinde çocukların yüksek içsel motivasyonlarının canlı müzik, oyun ve açık hava etkinlikleriyle desteklendiğinde öğrenme sürecinin çok daha etkili hâle geldiği görülmüştür. Aynı zamanda okul, öğretmen ve veli iş birliğinin etkinliklerin başarısındaki önemi daha yakından deneyimlenmiştir. Açık alan etkinliklerinde saha yönetimi, hava koşulları ve güvenlik önlemlerinin planlanmasının ne kadar önemli olduğu da uygulamalı olarak öğrenilmiştir.

Süreç sonunda, çocukların mevcut enerjilerini ve isteklerini doğru şekilde yönlendirebilmenin etkinliklerin verimini artırdığı gözlemlenmiştir. Yapılan çalışmaların hem öğrenciler hem de grup üyeleri açısından öğretici, eğlenceli ve unutulmaz bir deneyim olduğu değerlendirilmiştir.
    `,

    en: `
This study was carried out by our group at İnönü Primary School under the guidance of Dr. Lecturer Sibel Dal within the scope of the Out-of-School Activities in Education course. All group members participated voluntarily in the activities. The school’s dynamic structure and students’ interest in music, games, and competitions became an important source of motivation throughout the planning and implementation process.

The first activity organized was the traditional game “Yağ Satarım Bal Satarım.” During this activity, active roles were taken in preparing the play area, selecting participants, organizing students, and refereeing the game. The activity was prepared through weekly rehearsals over a period of approximately three weeks. It was observed that students showed great interest in the game and willingly followed the rules.

Another activity was the choir performance titled “Tohumlar Fidana.” Group members actively participated in this process; Gökhan Deniz acted as the leader while Mehmet, Muhammed, and Renas took supporting roles. The choir performance was presented as part of the 19 May Commemoration of Atatürk, Youth and Sports Day celebrations at the school. Students participated enthusiastically in the rehearsals, and practicing with live guitar accompaniment significantly increased their motivation.

It was observed that the cognitive and emotional participation levels of the 2nd grade students were very high throughout all activities. These out-of-school activities contributed not only to students’ physical and artistic development but also to their attention, concentration, and cooperation skills. Students showed strong interest and developed a positive emotional connection with the activities.

Dynamic and enjoyable methods were used to increase student motivation. In the “Yağ Satarım Bal Satarım” game, children’s natural interest was maintained through fair management and proper organization of the activity area. During the “Tohumlar Fidana” choir rehearsals, students were informed that the performance would take place outdoors with live guitar accompaniment, which greatly increased their excitement and willingness to participate.

The school atmosphere and teachers’ attitudes were highly supportive throughout the process. Teachers provided support from the very beginning, while parents also contributed by helping provide the necessary instruments and materials for the choir performance.

The activities were evaluated as highly successful in achieving their intended objectives. Through the “Yağ Satarım Bal Satarım” game, students improved their ability to follow rules, wait their turn, and cooperate with others. The choir activity supported students’ sense of rhythm, self-confidence, and ability to perform in front of an audience. The high motivation of the students together with the support of teachers and parents contributed greatly to the successful completion of the activities.

If the activities were to be organized again, the group would like to increase the variety of live instruments and include additional rhythm instruments in the choir performance. It was also realized that outdoor activities require more detailed planning regarding weather conditions. Protective measures such as hats, sunscreen, and shaded areas should be considered in advance, especially during long outdoor activities and refereeing processes.

The feedback received from students was highly positive. Students’ happiness, energy, and desire for the activities to continue were among the clearest indicators of the success of the process.

This experience demonstrated that supporting children’s natural motivation through live music, games, and outdoor activities makes the learning process much more effective. It also highlighted the importance of cooperation among schools, teachers, and parents in ensuring successful educational activities. In addition, the importance of field management, weather conditions, and safety precautions in outdoor activities was learned through direct experience.

At the end of the process, it was observed that properly directing students’ existing energy and enthusiasm significantly increased the effectiveness of the activities. The entire process was considered an educational, enjoyable, and unforgettable experience for both the students and the group members.
    `
},  

    images: [
        "assets/images/bayram10.1.png",
        "assets/images/bayram10.2.png",
        "assets/images/bayram10.3.png",
        "assets/images/bayram10.4.png",
        "assets/images/bayram10.5.png",
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
    tr:
        "Etkinlik sürecinde okul seçimi aşamasında herhangi bir ciddi sorun yaşanmamıştır. Nimet Alaattinoğlu İlkokulu’nun ulaşım açısından uygun olması, yönetim ve sınıf öğretmenlerinin iş birliğine açık ve destekleyici tutumları ile program dışı etkinliklere olumlu yaklaşımı bu okulu tercih etmemizde belirleyici olmuştur. " +

        "Seçilen etkinlik olan Antalya Akvaryum gezisi, öğrencilerin sınıf dışı öğrenme ortamlarında doğrudan gözlem yaparak öğrenme fırsatı bulması, öğrenmenin kalıcı ve etkili hale gelmesi ve çevre bilinci kazandırması açısından bizi motive etmiştir. Özellikle deniz yaşamı üzerinden ekosistemlerin önemi, çevrenin korunması ve canlıların doğal yaşam alanlarının tanınması gibi konularla ilişkilendirilebilmesi etkinliğin tercih edilmesinde etkili olmuştur. Ayrıca öğrencilerin merak duygusunu artırması ve aktif katılım sağlayabilecekleri bir öğrenme ortamı sunması da önemli bir motivasyon kaynağı olmuştur. " +

        "Etkinlik sürecinde hem planlama hem de uygulama aşamalarında aktif görev alınmıştır. Gezi öncesinde öğrencilerle hazırlık çalışmaları yapılmış, gezi kuralları açıklanmış ve soru-cevap yöntemiyle öğrencilerin bilişsel süreçleri harekete geçirilerek etkinliğe hazırbulunuşlukları artırılmıştır. Öğrencilerin dikkat, algı ve anlamlandırma becerileri desteklenmiş, aynı zamanda motivasyonları yükseltilmiştir. " +

        "Hazırlık aşamasında öğrencilerin yaratıcılığını ve düşünme becerilerini geliştirmek amacıyla akvaryum tasarlama etkinliği yapılmış, “Hayalimdeki Balık” çizim çalışması ve “Ben bir balık olsaydım…” konulu yazma etkinliği uygulanmıştır. Bu çalışmalarla öğrencilerin kendilerini ifade etme, empati kurma ve yaratıcı düşünme becerileri desteklenmiştir. " +

        "Çevre bilincini geliştirmek amacıyla iki kavanoz (temiz ve kirli su) kullanılarak su kirliliği somut şekilde gösterilmiş, öğrencilerin gözlem yapmaları sağlanmıştır. “Hangi suda yaşamak isterdiniz?” sorusu ile neden-sonuç ilişkisi kurmaları ve eleştirel düşünmeleri desteklenmiştir. " +

        "Akvaryum gezisi sırasında öğrencilere görev ve gözlem kartları dağıtılmış, en çok beğendikleri balıkları incelemeleri istenmiştir. Öğrencilerin aktif gözlem yapmaları, merak ettikleri konular üzerine sorular sormaları ve öğrenmeyi deneyimlemeleri sağlanmıştır. Gezi sonrasında ise istasyon tekniği kullanılarak öğrenmeler pekiştirilmiş, öğrencilerin hem bireysel hem de grup çalışmalarıyla iş birliği ve iletişim becerileri desteklenmiştir. " +

        "Öğrencilerin etkinlik sürecine yönelik bilişsel ve duyuşsal motivasyonlarının oldukça yüksek olduğu gözlemlenmiştir. Öğrenciler yeni bilgileri öğrenmeye istekli olmuş, dikkatle gözlem yapmış ve sorular sorarak sürece aktif katılım göstermiştir. Duyuşsal olarak ise heyecanlı, mutlu ve istekli oldukları; özellikle akvaryum gezisi sürecinde bu motivasyonun arttığı görülmüştür. " +

        "Motivasyonu artırmak için görsel materyaller, soru-cevap etkinlikleri, yaratıcı çizim ve yazma çalışmaları ile istasyon tekniği kullanılmıştır. Bu yöntemler öğrencilerin derse ilgisini artırmış, öğrenmeyi daha eğlenceli ve kalıcı hale getirmiştir. " +

        "Etkinlik süreci öğrenciler açısından çevre bilinci, gözlem yapma, sorgulama, yaratıcı düşünme ve empati kurma becerilerinin gelişmesine katkı sağlamıştır. Bizim açımızdan ise planlama, sınıf yönetimi, farklı öğretim yöntemlerini uygulama ve öğrenciyle etkili iletişim kurma becerilerimizi geliştirme fırsatı sunmuştur. Ayrıca grup çalışması ve görev dağılımı konusunda bazı eksiklerimizin olduğu fark edilerek bu alanlarda gelişim gerektiği görülmüştür. " +

        "Genel olarak etkinliğin amaçlarına ulaşıldığı düşünülmektedir. Öğrencilerin etkinliklere aktif katılım göstermesi, olumlu geri dönütler vermesi ve öğrenme sürecine istekli şekilde dahil olmaları bunun göstergesi olmuştur. Etkinlik sonrasında öğrenciler çizim ve yazma çalışmalarını keyifli bulduklarını ifade etmişlerdir.",

    en:
        "No serious problems were encountered during the school selection process. The accessibility of Nimet Alaattinoğlu Primary School, the cooperative and supportive attitudes of the administration and classroom teachers, and the school’s positive approach toward extracurricular activities were the main reasons for choosing this school. " +

        "The selected activity, the Antalya Aquarium trip, motivated us because it provided students with the opportunity to learn through direct observation in an out-of-class learning environment, increased the permanence and effectiveness of learning, and helped develop environmental awareness. In particular, the activity could be associated with topics such as marine life, the importance of ecosystems, environmental protection, and recognizing the natural habitats of living creatures. In addition, increasing students’ curiosity and providing an active learning environment were also important motivating factors. " +

        "During the activity process, active roles were taken both in the planning and implementation stages. Before the trip, preparation activities were carried out with the students, the rules of the trip were explained, and students’ cognitive processes were activated through question-and-answer activities to increase their readiness for the activity. Their attention, perception, and comprehension skills were supported while their motivation was also increased. " +

        "In the preparation stage, an aquarium design activity, a drawing activity titled “The Fish of My Dreams,” and a writing activity called “If I Were a Fish…” were conducted to improve students’ creativity and thinking skills. Through these activities, students’ self-expression, empathy, and creative thinking skills were supported. " +

        "To develop environmental awareness, water pollution was demonstrated concretely using two jars filled with clean and dirty water, allowing students to make observations. With the question “In which water would you prefer to live?”, students were encouraged to establish cause-and-effect relationships and think critically. " +

        "During the aquarium trip, students were given task and observation cards and asked to examine the fish they liked most. Students were encouraged to make active observations, ask questions about topics they were curious about, and learn through experience. After the trip, learning was reinforced using the station technique, and students’ cooperation and communication skills were supported through both individual and group work. " +

        "It was observed that students’ cognitive and emotional motivation toward the activity process was quite high. Students were eager to learn new information, carefully observed their surroundings, and actively participated by asking questions. Emotionally, they were excited, happy, and enthusiastic, and this motivation increased especially during the aquarium trip. " +

        "To increase motivation, visual materials, question-and-answer activities, creative drawing and writing tasks, and the station technique were used. These methods increased students’ interest in the lesson and made learning more enjoyable and permanent. " +

        "The activity process contributed to the development of students’ environmental awareness, observation, questioning, creative thinking, and empathy skills. From our perspective, it provided an opportunity to improve our planning, classroom management, application of different teaching methods, and effective communication with students. In addition, we realized that we had some shortcomings in group work and task distribution, and that improvement in these areas was necessary. " +

        "Overall, it is believed that the activity achieved its goals. Students’ active participation, positive feedback, and willingness to engage in the learning process were indicators of this success. After the activity, students stated that they enjoyed the drawing and writing activities very much."
},
    images: [
        "assets/images/odoo2.1.png",
        "assets/images/odoo2.2.png",
        "assets/images/odoo2.3.png",
        "assets/images/odoo2.4.png",
        "assets/images/odoo2.5.png",
        "assets/images/odoo2.6.png",
    ],
    coverImage: "assets/images/odoo2.1.png"
},
odoo3: {
    category: "gallery3",
    title: {
      tr: "Geleneksel Çocuk Oyunları Etkinliği",
      en: "Traditional Children's Games Activity"
    },
    shortDesc: {
    tr: "Muhammed Delil Taş tarafından Mahmutlar İlkokulu’nda gerçekleştirilen Geleneksel Çocuk Oyunları etkinlikleri.",
    
    en: "Traditional Children's Games activities organized by Muhammed Delil Taş at Mahmutlar Primary School."
},
    longDesc: {
    tr:
        "“Eğitimde Program Dışı Etkinlikler” dersi kapsamında, 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kutlamaları için Mahmutlar İlkokulu’nda gönüllü öğrencilerle kapsamlı ve çok yönlü bir program hayata geçirilmiştir. Okulun merkezi konumu ve geniş bahçe imkanları, fiziksel aktivite gerektiren bu organizasyon için oldukça uygun bir zemin hazırlamış; okul idaresiyle kurulan hızlı iletişim ve yönetim tarafından sağlanan ses sistemi ile alan düzenleme destekleri sürecin verimliliğini üst düzeye çıkarmıştır. " +

        "Program, çocukların ritim duygusunu geliştirecek kitlesel bir dans etkinliği ile kültürel bağlarını güçlendirecek geleneksel çocuk oyunları istasyonlarından oluşacak şekilde tasarlanmıştır. Uygulama aşamasında okul bahçesinde kurulan bu istasyonlarda çocuklarla birlikte Deve-Cüce, Sıcak-Soğuk, Gece-Gündüz, Meyve Sepeti ve Heykel Oyunu gibi geleneksel oyunlar bizzat yürütülmüş; dans etkinliğinde ise belirlenen koreografi üzerinde tüm sınıfların katılımıyla ritmik çalışmalar ve koordinasyon sağlanmıştır. " +

        "Geleneksel çocuk oyunlarının basit malzemelerle büyük bir neşe kaynağı yaratması ve çocukları dijital ortamdan uzaklaştırarak somut fiziksel etkileşimlere yönlendirmesi, bu etkinliğin seçilmesindeki en temel motivasyon kaynağı olmuştur. Etkinlik süresince özellikle Meyve Sepeti ve Heykel Oyunu gibi hızlı tepki ve yüksek odaklanma gerektiren bölümlerde öğrencilerin bilişsel dikkatlerinin oldukça yüksek olduğu gözlemlenmiştir. Bayram coşkusuyla birleşen bu aktiviteler çocukları duyuşsal olarak da son derece mutlu etmiştir. " +

        "Süreç boyunca öğrenci motivasyonunu üst seviyede tutabilmek adına oyunlar anlatılırken enerjik bir dil kullanılmış, her oyunun sonunda alkışlarla destek sağlanmış ve dans provaları eğlenceli bir yarışma havasına dönüştürülerek dinamizm korunmuştur. Oyunlar aracılığıyla öğrencilerin dikkat, hız ve grup içi koordinasyon becerileri desteklenirken; özellikle Heykel Oyunu çocukların sabır duygusunu, Sıcak-Soğuk Oyunu ise iş birliği yapma ve yönerge takip etme becerilerini ön plana çıkarmıştır. " +

        "Etkinlik sürecinde ve sonrasında öğrencilerden alınan dönütler çalışmanın başarısını destekler nitelikte olmuştur. Öğrenciler en çok “Meyve Sepeti” ve “Deve-Cüce” oyunlarında eğlendiklerini belirtmiş ve bu oyunları teneffüslerde de oynamak istediklerini ifade etmişlerdir. Bu deneyim, uygulayıcılar açısından farklı yaş gruplarına aynı anda hitap edebilme becerisi kazandırmış ve kurallı oyunların çocuk gelişimindeki birleştirici gücünü somut şekilde göstermiştir. " +

        "Süreç sonunda gerçekleştirilen öz değerlendirmede ise kalabalık gruplarda komut verme ve dikkat toplama teknikleri üzerine daha fazla pratik yapılması gerektiği fark edilmiştir. Aynı etkinlik tekrarlandığı takdirde oyun sayısının artırılması ve her oyun için ayrılan sürenin daha hassas planlanması gerektiği düşünülmüştür. Genel olarak değerlendirildiğinde planlanan tüm faaliyetlerin sorunsuz şekilde tamamlanması, çocukların geleneksel oyunları öğrenirken dans eşliğinde bayram ruhunu doyasıya yaşamaları ve etkinliklere aktif katılım göstermeleri, etkinliğin hedeflenen amaçlara başarıyla ulaştığını göstermektedir.",

    en:
        "Within the scope of the “Extracurricular Activities in Education” course, a comprehensive and multidimensional program was organized with volunteer students at Mahmutlar Primary School for the April 23 National Sovereignty and Children’s Day celebrations. The school’s central location and spacious garden area provided a highly suitable environment for this physically active organization. In addition, the fast communication established with the school administration and the support provided in terms of sound systems and area arrangements maximized the efficiency of the process. " +

        "The program was designed to include a large-scale dance activity aimed at improving children’s sense of rhythm, along with traditional children’s game stations intended to strengthen their cultural connections. During the implementation process, traditional games such as Giant-Dwarf, Hot-Cold, Day-Night, Fruit Basket, and Statue Game were actively carried out with the students at stations set up in the school garden. In the dance activity, rhythmic exercises and coordination studies were conducted with the participation of all classes according to the planned choreography. " +

        "The fact that traditional children’s games can create great joy with simple materials and move children away from digital environments into direct physical interaction was the main motivation behind choosing this activity. Throughout the event, students’ cognitive attention levels were observed to be especially high during games such as Fruit Basket and Statue Game, which required quick reactions and strong concentration. Combined with the excitement of the national holiday, these activities also made the students emotionally very happy. " +

        "In order to keep student motivation at a high level throughout the process, the games were explained with energetic language, each activity was supported with applause at the end, and dance rehearsals were turned into a fun competition atmosphere to maintain dynamism. Through these games, students’ attention, speed, and group coordination skills were supported, while the Statue Game highlighted patience and the Hot-Cold Game improved cooperation and the ability to follow instructions. " +

        "The feedback received from students during and after the activity clearly demonstrated the success of the program. Students stated that they enjoyed the “Fruit Basket” and “Giant-Dwarf” games the most and expressed their desire to continue playing these games during breaks. This experience helped the practitioners gain the ability to address different age groups simultaneously and concretely demonstrated the unifying power of rule-based games in child development. " +

        "At the end of the process, self-evaluation revealed that more practice was needed in giving commands and gathering attention in crowded groups. If the same activity were to be repeated, it was suggested that the number of games could be increased and the time allocated for each game could be planned more carefully. Overall, the successful completion of all planned activities, the students’ enjoyment of the holiday spirit through dance and traditional games, and their active participation demonstrated that the activity successfully achieved all of its intended objectives."
},
    images: [
      "assets/images/odoo3.1.png",
      "assets/images/odoo3.2.png",
      "assets/images/odoo3.3.png",
        "assets/images/odoo3.4.png",
        "assets/images/odoo3.5.png",
    ],
    coverImage: "assets/images/odoo3.1.png"

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
