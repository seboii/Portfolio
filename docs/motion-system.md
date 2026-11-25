# Hareket sistemi

Bu belge `App.tsx`, `useAmbientMotion.ts`, `useCinematicMotion.ts`, `useResearchScroll.ts`, `useOperationsScroll.ts` ve ilgili SVG/CSS katmanlarının mevcut davranışını açıklar. Tarayıcı testleri ve ölçümler [QA raporunda](./qa-report.md) ayrı kaydedilir; aşağıdaki kaynak incelemesi bir tarayıcı testi sonucu değildir.

## Otomatik canlı hareket

Sistem ağı ve dört ana proje görseli, kaydırma gerektirmeyen dekoratif hareket döngülerine sahiptir. GSAP ve MotionPathPlugin paketleri kendi SVG yollarında ilerletir; düğüm halkaları, mesajlar, imleç ve tarama çizgisi sahneye göre hareket eder. Araştırma örümceği yalnız kaydırma konumunu izler. Kaydırma tarayıcının native kaydırmasıdır. Lenis, ScrollSmoother ve WebGL kullanılmaz.

| Sahne | Canlı hareket | Sınır |
| --- | --- | --- |
| Ağ / açılış ve kapanış | Paketler, iç düğüm katmanlarında hafif salınım, merkez halkası | Başlık ve bağlantılar hareket etmez |
| Operasyon | Rota paketleri, istasyon halkaları ve bölgesel ışık | Üç açıklama katmanı kaydırmayla seçilir; canlı hareket ayrı hedeflerde sürer |
| İş birliği | Peer paketleri, paylaşılan alanda imleç, mesaj katmanları ve halka | İletişim ve ortak çalışma bağlamını gösterir |
| Badhabinot | Tarama çizgisi ve üç takip halkası | Mevcut 17 poz işaret noktası çoğaltılmaz; öğrenilmiş görü katmanı gelecek çalışma olarak kalır |
| Lojistik asistanı | Yalnız uygulanan üç temel düğümde halka ve aralarındaki paketler | Kesikli AI kapsam düğümleri ve planlanan yollar canlı döngüye katılmaz |

`svg[data-ambient-scene]` sahne türünü belirtir. Döngüler `.ambient-*` çocuklarını ve eşleşen `data-ambient-path` / `data-ambient-packet` işaretlerini hedefler. Kaydırma zaman çizgilerinin `.network-node` ve diğer hedefleri ayrı tutulur; operasyonun `data-operation-layer` grupları yalnız CSS opacity geçişiyle görünür; üst grupların mevcut SVG yerleşimi korunur. Bu katman ana sayfada ve dört ana projenin detay görsellerinde çalışır. Önceki çalışmaların ve `ArchitectureMap` şemalarının tümü için döngü kurulmaz.

Canlı katmanda beş tür vardır: network, operations, collaboration, pose ve intelligence. Ana sayfada açılış/kapanış ağıyla altı canlı SVG bulunur; araştırma SVG'si bu katmana katılmaz.

Bir sahne en az %1 oranında görünürken ve belge görünürken döngüsü oynar. Ekran dışında veya sekme gizliyken zaman çizgisi bulunduğu konumda durur; geri görünür olduğunda devam eder. `IntersectionObserver` olmayan ortamda pasif scroll/resize dinleyicileri SVG sınırlarını kontrol eder. Bu görünürlük kontrolü her animasyon karesinde React state güncellemez. Mobil görünümde canlı döngüler kullanılabilir; masaüstü pin koşullarına bağlı değildir.

Sistemlerin canlı animasyonları otomatik etkinleşir; header, açılış ve footer'da oynat/duraklat veya hareket tercihi düğmesi bulunmaz. Mobil menünün açılması hareket bağlamını kapatmaz. Ekran dışı ve gizli sekme beklemesi yalnız kaynak kullanımı içindir; sahne yeniden görünür olduğunda kendiliğinden devam eder.

## İlk yükleme ve JavaScript olmadan erişim

HTML kabuğu ilk yüklemeden `data-motion="full"` taşır; `App` da bu durumu uygular. JavaScript ile kurulan canlı katman, ilk görünürlük bildirimiyle kendiliğinden oynar. İşletim sisteminin `prefers-reduced-motion` tercihi ve önceki sürümün `portfolio-motion` depolama değeri okunmaz; eski kaydedilmiş `reduce` seçimi hareketi durdurmaz. Görünüm boyutu canlı döngüleri devre dışı bırakmaz. Mühendislik seçiminde 300 ms'lik küçük yer değiştirme kullanılabilir.

SSR/prerender HTML tüm temel metinleri, SVG'leri, kaynakları, özellik listelerini ve gerçek bağlantıları içerir. JavaScript kapalıyken hook ve gözlemciler kurulmaz; SVG'ler statik görünür. Noscript stilleri menü ve e-posta kopyalama düğmelerini gizler; alternatif gezinme ve mühendislikte bütün katmanların açıklama/link listesi görünürdür. Dil, rota, kaynak, anchor ve mailto bağlantıları; detay sayfasındaki native `<details>` mimari akışı çalışmayı sürdürür.

## Kaydırmaya bağlı anlatım

`useCinematicMotion` ana sayfanın dekoratif SVG katmanlarını kaydırma konumuna bağlar. Bu zaman çizgileri döngü yapmaz; ileri/geri ilerleme kaydırmayı izler. `scrub` değerleri görselin konumu yakalamasını yumuşatır.

Bu katman görünüm en az **1100 px genişlik ve 650 px yükseklik** olduğunda kurulur. `gsap.matchMedia()` boyut koşulları değişince bağlamı yeniden değerlendirir. `data-cinematic-desktop="true"` yalnız bu bağlamda eklenir; CSS anlatım sütununa `175svh` alan verir. İş birliği, Badhabinot ve lojistik asistanı olmak üzere üç proje görseli `pin: visual` ve `pinSpacing: false` ile sabitlenir. Operasyon bu GSAP builder/pin döngüsüne katılmaz; native sticky ve bağımsız başlık ölçümü kullanır. Başlangıç header yüksekliği + 20 px, bitiş bölümün alt sınırına bağlıdır. Tablet, mobil veya kısa görünümde pin kurulmaz; görseller native belge akışında kalırken canlı döngüler devam eder.

| Sahne | Kaydırma ilerlemesi |
| --- | --- |
| Açılış | Dış ağ düğümlerinin derinlik hareketi ve yörüngenin küçük dönüşü |
| Operasyon | Kaynakları birleştir → Riski görünür kıl → Değişikliği ilet; gerçek HTML başlığı ilgili okuma çizgisine geldiğinde değişir |
| İş birliği | Katılımcı/peer → mesaj → paylaşılan alan → anotasyon/imleç → iletişim açıklaması |
| Badhabinot | Takip çerçevesi → 17 nokta/kemikler → tarama/iz → analiz/geçmiş |
| Lojistik asistanı | Temel düğümler ve çizgi → ayrı kesikli kapsam → mimari şeridi |
| Kariyer ve kapanış | Kariyer çizgisinin açılması, kapanış ağının merkezde toplanması |

Ana başlıklar, açıklamalar, bağlantılar ve özellik listeleri opacity animasyonuyla gizlenmez. Çizim yardımcısı kesikli yolları atlar. AI kapsam çizgisinin görünürlüğünün değişmesi planlanan modüllerin çalıştığı anlamına gelmez; görünür olgunluk açıklamaları kalır. Ana sayfanın pin zaman çizgileri detay sayfalarında kullanılmaz.

## Üç adımlı operasyon haritası

`OperationsChapter` başlıkları bir kez gösterir: Kaynakları birleştir, Riski görünür kıl, Değişikliği ilet. Kaynak işaretleri/rotalar, risk halkası/koridoru ve bildirim işaretleri sırasıyla `data-operation-layer="0|1|2"` gruplarındadır. Bölümün `data-operation-active` değeri seçili grubu 380 ms opacity geçişiyle açar; geometriyi veya ambient hedeflerinin transform'unu değiştirmez. Eski KPI/risk/bildirim metin panelleri ve teknik şerit kaldırıldı. API/worker, Hangfire, EF Core/PostgreSQL, risk kuralları, Redis pub/sub ve SignalR katkıları Katkım bölümünde açıklanır; dört temel teknoloji yanında listelenir.

Dünya silueti Natural Earth 110m kara geometrisinin Natural Earth I projeksiyonudur. Tek clipPath, 7,5 birim aralıklı 4,5 birim yeşil kare nokta deseni taşır. Altı durağın koordinatları sabittir; projeksiyon ve kıyı değerleri SSR ile istemci arasında deterministik kalır. Kaynak ve lisans notu [map-attribution.txt](../public/map-attribution.txt) içindedir. Aynı harita detay sayfasında da kullanılır.

`useOperationsScroll` üç gerçek `h4` başlığın belge konumlarını ölçer. Masaüstü okuma çizgisi header + kalan görünümün %25'inin 96–200 px arasında sınırlanmış değeridir. 768 px altında ve en az 650 px yüksekliğinde kompakt sticky haritanın ölçülen yüksekliği + header + 48 px kullanılır; çizgi ekranın altından en az 64 px uzakta kalır. Seçili adım ilgili başlık bu çizgiyi geçtiğinde değişir; aynı metin okunurken sabit kalır, ters kaydırma önceki adıma döner. Harita masaüstünde metnin yanında, mobilde kompakt olarak üstünde durur; 650 px altındaki kısa görünümde normal akışa döner.

01–02–03 bağlantıları doğrudan `h4` kimliklerine gider. Hook, `--operations-reading-offset` değerini global scroll-padding ile birlikte tam aynı okuma çizgisine hizalar. Kaydırma olayları tek bekleyen frame içinde birleştirilir; yalnız etkin adım değişince React state yazılır, boşta frame döngüsü yoktur. Resize/pageshow/hashchange, font ve ResizeObserver değişiklikleri ölçümü yeniler. Cleanup dinleyicileri, gözlemciyi ve bekleyen frame'i kaldırır; önceki inline offset değerini ve priority'sini geri yükler. JavaScript olmadan ilk harita katmanı ve üç açıklama görünür; anchor bağlantıları çalışır.

[Operasyon kontrolü](screenshots/operations-scroll-checks.json) gerçek hook üzerinde 24 senaryo ve 1258 doğrulamadır. Bu bir kaynak/olay simülasyonudur; browser sticky yerleşimi, native kaydırma, CSS crossfade veya GSAP render testi değildir.
## Kaydırmalı araştırma örümceği

`ResearchTopology`, `data-scroll-scene="research"` taşır. Daha doğal, düzensiz radyal iplikler ve kıvrımlı halkalar deterministik SVG geometrisidir. Dört `data-research-node` durağı 01–04 metinlerine karşılık gelir. Tek `data-research-spider` ilk HTML çıktısında 01'de durur; üç açık `data-research-path` yalnız ardışık durakları aynı görünür iplik parçaları üzerinden bağlar. Yollar geri dönüş döngüsü oluşturmaz. Geometri ve iki ondalıklı koordinatlar etkin metin değiştiğinde yeniden şekillenmez.

`ResearchSection`, tüm görünüm genişliklerinde `useResearchScroll` kullanır. Okuma çizgisi header yüksekliğine, kalan görünüm yüksekliğinin %30'unun 96–220 px arasında sınırlandırılmış değerinin eklenmesidir. Örümcek okuma aralığında ilgili numarada bekler. Sonraki başlığın yaklaşma bandı başlıklar arası mesafenin %55'idir; 160–380 px arasında seçilir ve önceki durakta en az 100 px okuma aralığı bırakacak şekilde daraltılabilir. Kaydırma yalnız hedefi belirler; örümcek bu hedefe toplam iplik mesafesi üzerinden kısa, hız sınırlandırılmış bir yürüyüşle yetişir. Böylece wheel, dokunma ve PageDown hareketi birden büyük konum değişikliği istediğinde bütün yolu tek karede atlamaz. Konum `getPointAtLength` ile görünür iplik üzerinde kalır; XY arasında kestirme interpolasyon yapılmaz.

Her karenin zaman farkı en fazla 32 ms kabul edilir. Hız kalan mesafeye göre 480–780 SVG birimi/sn arasında sınırlandırılır; hedefe yaklaşırken yavaşlar, keskin köşelerde ve ters yön değişiminde dönüşe zaman bırakır. Gövde açısı en kısa açı farkıyla yumuşatılır; geri kaydırmada örümcek ters yöne döner. Sekiz bacak ayrı kalça/diz/ayak yollarıdır: çapraz gruplar sırayla basar ve kaldırılır, adım fazı gerçekten alınan mesafeden hesaplanır. Gövdede çok küçük ağırlık aktarımı vardır. Hedefe ulaşıldığında nötr bacak pozu korunur ve yeni animation frame planlanmaz; otomatik tur veya sürekli araştırma döngüsü yoktur. Kaydırma durunca yalnız başlamış kısa takip tamamlanır. İlk derin yükleme doğrudan doğru okuma konumunda açılır. Kaynak metinleri ve bağlantıları sürekli görünürdür.

Araştırma SVG'sinde ambient sahne/paket/yol işaretleri bulunmaz; `useAmbientMotion` bu görseli keşfedemez. İlk yükleme, resize, pageshow, hashchange, font ve yerleşim değişikliklerinde durak eşikleri ölçülür. Pasif scroll olayları tek bekleyen animation frame içinde birleştirilir; takip yalnız hedef yakalanana kadar sürer. `data-research-target` kaydırma hedefini, `data-research-position` gerçekten çizilen konumu ayrı gösterir. `ResizeObserver` bölüm ve body boyutlarını izler. Cleanup bekleyen frame'i, gözlemciyi ve dinleyicileri kaldırır; SVG gövde transform'u, bacak yolları ve inceleme niteliklerini geri alır. Font callback'i yalnız bağlam hâlâ yaşıyorsa çalışır. Araştırma görseli en az 768 px genişlik ve 650 px yükseklikte sticky kalır; dar/stacked veya kısa görünümde normal akışa döner. Araştırma path/circle öğelerinde CSS geçişi yoktur. Mühendislik seçim düğmeleri açıklamayı, araçları ve gerçek proje bağlantılarını değiştirir.

## Temizlik ve bakım

Her iki GSAP hook'u `useGSAP` scope'u ve `revertOnUpdate: true` kullanır. Locale değiştiğinde eski zaman çizgileri ve inline stiller geri alınır. Canlı katmanın scope'u ana `<main>`; kaydırma katmanının scope'u ana sayfa sarmalayıcısıdır. Canlı cleanup gözlemciyi, `visibilitychange` ve varsa fallback scroll/resize dinleyicilerini kaldırır; döngüleri durdurur ve `data-ambient-state` işaretlerini siler. Kaydırma cleanup'ı `media.revert()` ile pin, ScrollTrigger ve stilleri kaldırır; masaüstü işaretini siler. Native rota/dil bağlantıları yeni sayfa yükler. Araştırmanın ve operasyonun bağımsız ölçüm/scroll bağlamları kendi cleanup işlemlerinde kaldırılır.

Fontlar hazır olduğunda ScrollTrigger ölçümleri yenilenir. Gecikmiş `document.fonts.ready` callback'i yalnız kaydırma bağlamı hâlâ yaşıyorsa `refresh()` çağırır.

Görsellerin altında tekrarlanan kavramsal/sentetik veya ürün ekranı olmadığına dair sunum notları kaldırılmıştır. Kaynak URL'leri, yayıncılar, proje durumları ve uygulanan/planlanan mimari lejantları korunur. Bu değişiklik yeni bir proje özelliği veya başarı ölçümü eklemez; kaynak kapsamı bakım belgelerinde izlenir.

Yeni hareket eklerken dekoratif canlı hedefleri kaydırma hedeflerinden ayrı tutun; paket ve yol işaretlerini aynı SVG içinde eşleştirin. Planlanan kapsamı canlı akışa katmayın. SSR ve JavaScript kapalı görünümde eksiksiz statik durum sağlayın. Araştırmada dört durakta bekleme, üç geçiş, aynı konumda hareketsizlik, geri kaydırma ve doğrudan anchor yüklemesini tarayıcıda inceleyin. Diğer sahnelerde görünürlük/sekme davranışını; ayrıca boyut, font, dil/rota ve cleanup değişikliklerini kontrol edip gerçek sonuçları QA raporuna yazın. `scripts/verify.mjs` bu davranışların tamamını simüle etmez; HTML'de hareket kontrolü ve kaldırılmış sunum notları bulunmadığını, ambient katman ayrımını, organik ağ geometrisini, dört durağı ve açık yolların uçlarını, kaynakları, olgunluk ayrımını ve içerik/mahremiyet sınırlarını denetler.
