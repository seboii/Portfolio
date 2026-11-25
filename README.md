# Shakhobiddin Shamshiev — Engineering in Motion

Türkçe, İngilizce ve Rusça mühendislik portfolyosu. Türkçe görünümde isim Şehabettin Şamşiev; İngilizce ve Rusçada Shakhobiddin Shamshiev olarak gösterilir. React 19, Vite 8, TypeScript, Tailwind CSS v4, pnpm lockfile'ı ve Figma Make entegrasyonu korunur. GSAP 3.15.0 ve `@gsap/react` 2.1.2, kaydırmaya bağlı SVG anlatımı ile sayfa dururken çalışan sinyal, katman ve tarama animasyonlarını sağlar. Kaydırma native'dir; CMS, form servisi, Lenis veya WebGL kullanılmaz. Google Analytics 4 ölçüm kimliği `.figma/make/site.json` içindeki `analytics.googleAnalyticsId` alanında tanımlıdır; Google etiketi bütün dil, proje ve 404 sayfalarının ortak HTML başlığına bir kez eklenir.

Portfolyonun yayın adresi [sshakho.com](https://sshakho.com/). Sektörel bağlam için kullanılan yayınlar [araştırma kaynaklarında](docs/research-sources.md) listelenir.

## Yerelde çalıştırma

Toolchain `.mise.toml` içinde Node 22 ve pnpm 10.34.3 olarak tanımlıdır. Proje dizininde:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Geliştirme adresi http://localhost:8443/. Farklı bir port için PORT ortam değişkenini kullanın. Figma Make önizlemesi de aynı Vite sunucusunu kullanır.

```sh
pnpm typecheck
pnpm build
pnpm verify
pnpm check:format
pnpm preview --port 4180
```

Üretim önizlemesi [localhost:4180](http://localhost:4180/) adresindedir. TypeScript için pnpm typecheck, statik çıktıyı kontrol etmek için build sonrasında pnpm verify çalıştırılır.

## GitHub Pages

GitHub Actions varsayılan daldaki değişiklikleri derler, kontrol eder ve dist/ klasörünü yayımlar. Build, statik dosyaları ve sayfa bağlantılarını Pages adresine göre oluşturur. github.io önizlemesi indekslemeye kapalıdır. sshakho.com etkin yayın alan adı olduğunda build indekslemeyi açar ve sitemap üretir.

## Docker Desktop ve Cloudflare Tunnel ile yayın

Docker Compose, statik çıktıyı Nginx ile http://localhost:8080/ adresinde sunar. İsteğe bağlı tunnel profiliyle Cloudflare Tunnel üzerinden erişim sağlanabilir.

Kaynak kodu veya `public/` altındaki ekran görüntüleri değiştiğinde Docker image'ını yeniden derleyin. Docker Desktop'taki Start/Restart mevcut image'ı açar; dosya değişikliklerini otomatik almaz. Proje klasöründe:

```powershell
docker compose --env-file .env.docker --profile tunnel up --build --wait --wait-timeout 120
```

Bu komut güncel kaynakları Node 22 ile typecheck/build/verify kontrollerinden geçirir, Türkçe/İngilizce/Rusça rotaları ve `public/` görsellerini Nginx image'ına koyar, yayın servislerini açar ve web sağlık kontrolünü bekler. `.env.docker`, `VITE_SITE_URL=https://sshakho.com` ve `VITE_ALLOW_INDEX=true` ile canonical, hreflang, sitemap ve indekslemeyi etkinleştirir. Kaynak dosyaları container'a canlı bağlanmaz.

Yeni kurulumda .env.docker.example dosyasını .env.docker olarak kopyalayın. CLOUDFLARED_TOKEN_FILE değerine token dosyasının yolunu girin. Compose, dosyayı container içine secret olarak bağlar.

Çalışma durumunu ve son hata mesajlarını kontrol etmek için:

```powershell
docker compose --env-file .env.docker --profile tunnel ps
docker compose --env-file .env.docker --profile tunnel logs --tail 50
```

## Sayfalar ve JavaScript olmadan içerik

| İçerik | Türkçe | İngilizce | Rusça |
| --- | --- | --- | --- |
| Ana sayfa | `/` | `/en/` | `/ru/` |
| Operasyon platformu | `/projects/logistics-operations/` | `/en/projects/logistics-operations/` | `/ru/projects/logistics-operations/` |
| Gerçek zamanlı iş birliği | `/projects/real-time-collaboration/` | `/en/projects/real-time-collaboration/` | `/ru/projects/real-time-collaboration/` |
| Badhabinot | `/projects/badhabinot/` | `/en/projects/badhabinot/` | `/ru/projects/badhabinot/` |
| Lojistik asistanı | `/projects/logistics-assistant/` | `/en/projects/logistics-assistant/` | `/ru/projects/logistics-assistant/` |
| Mailops | `/projects/mailops/` | `/en/projects/mailops/` | `/ru/projects/mailops/` |
| OtoMARK | `/projects/otomark/` | `/en/projects/otomark/` | `/ru/projects/otomark/` |

Dil, bölüm ve proje gezinmesi gerçek bağlantılar kullanır. Doğrudan URL, tarayıcı geri düğmesi ve anchor bağlantıları native davranır. Her dilde bilinmeyen sayfa için 404 içeriği vardır.

Geliştirme sunucusu HTML'i `src/entry-server.tsx` üzerinden server-render eder. Build önce istemci varlıklarını, ardından geçici `.prerender/entry-server.js` paketini üretir; `scripts/prerender.mjs` tüm veri tanımlı sayfaları `dist/` altında statik HTML'e dönüştürür. `src/main.tsx` bu içeriği hydrate eder. JavaScript kapalıyken ana metinler, detay sayfaları, bölüm bağlantıları ve mailto bağlantıları kullanılabilir; mobil için `noscript` gezinmesi de sunulur. Menü, e-posta kopyalama ve canlı animasyonlar JavaScript gerektirir.

Kaydırma anlatımı en az 1100×650 px görünümde kurulur. İş birliği, Badhabinot ve lojistik asistanı görselleri `pinSpacing: false` ile anlatım boyunca sabitlenir; küçük/kısa görünümde normal akışa döner. Operasyon haritası bağımsız native sticky düzen kullanır ve üç başlığın gerçek konumuna göre katman değiştirir; kısa görünümde normal akışa döner. Sistem ağı ve dört ana projenin sürekli animasyonları masaüstü ve mobilde otomatik çalışır; oynat/duraklat veya hareket tercihi kontrolü yoktur. Sistem hareket tercihi ve eski `portfolio-motion` depolama değeri uygulanmaz. HTML kabuğu `data-motion="full"` taşır. Ekran dışındaki canlı sahneler ve görünmeyen sekme yalnız kaynak kullanımı için bekler; görünür olduğunda kendiliğinden devam eder. Metinler animasyon izlemeye bağlı değildir. Aşamalar, cleanup, araştırma durakları ve JavaScript'siz alternatifler [hareket sistemi belgesinde](docs/motion-system.md) açıklanır.

Araştırma bölümünün doğal örümcek ağı ayrı bir kaydırma sahnesidir. Tek örümcek, ilk metin okunurken 01'de bekler; sonraki başlıklara yaklaşıldığında iplikler üzerindeki üç açık yolla 02, 03 ve 04'e geçer. Sayfa durduğunda hareket etmez; otomatik tur veya süreye bağlı ilerleme yoktur. Kaydırma konumu mobilde de durakları belirler; geometri metin vurgusuyla değişmez. Diğer beş ambient tür, ana sayfanın altı SVG'sinde ve dört ana detayda otomatik hareketini sürdürür. Görsellerin altındaki tekrarlanan kavramsal/sentetik sunum notları kaldırılmıştır; dört birincil kaynak bağlantısı, proje durumları ve uygulanan/planlanan mimari lejantları korunur.

## İçerik düzenleme

| Dosya / alan | Düzenlenen içerik |
| --- | --- |
| `src/content.ts` → `profile` | İsim, unvan, konum, e-posta, doğrulanmış sosyal bağlantılar ve kamusal CV aksiyonu |
| `projects`, `otherProjects` | Proje açıklamaları, uygulanan/planlanan kapsam, durum ve doğrulanmış bağlantılar |
| `skills`, `timeline`, `languages` | Yetkinlik grupları, doğrulanmış deneyim/eğitim ve dil seviyeleri |
| `copy` | Ortak TR/EN metinleri |
| `src/interface-copy.ts` | Arayüz, erişilebilirlik, menü, hata ve geri bildirim metinleri |
| `src/data/storyboard.ts` | Dört ana sahne, sahne sırası/adımları, `cinemaCopy` ve mühendislik katmanları |
| `src/data/architectures.ts` | Altı projenin kaynak destekli bileşen/bağlantı şemaları ve olgunluk lejantı |
| `src/data/research.ts` | Birincil kaynak URL'si, yayıncı, yıl, erişim tarihi ve proje ilişkisi olan araştırma ifadeleri |
| `src/sections/` | Ana sayfa, araştırma, sistem sahneleri, mühendislik, iletişim ve proje detay düzenleri |
| `src/seo.ts` | Dil ve projeye göre metadata, yapılandırılmış veri ve route üretimi |
| `src/visuals/` | Özgün ağ, lojistik, iş birliği, poz, asistan ve mimari SVG'leri |
| `src/visuals/ResearchTopology.tsx` | Organik araştırma ağı, dört numaralı durak, üç açık iplik yolu ve tek örümcek |
| `src/sections/ResearchSection.tsx` | Kaynak metinleri, dört numaralı araştırma ifadesi ve aktif bağlam |
| `src/motion/useResearchScroll.ts` | Tüm genişliklerde native kaydırma/okuma çizgisi, durakta bekleme, kısa geçiş ve yerleşim ölçümü |
| `src/sections/OperationsChapter.tsx` | Yeşil harita, üç numaralı başlık ve genişletilmiş Katkım düzeni |
| `src/motion/useOperationsScroll.ts` | Başlık ölçümü, harita katmanı seçimi, native anchor hizası ve cleanup |
| `src/visuals/world-map.ts` | Natural Earth kıyı geometrisi ve deterministik projeksiyon |
| `src/motion/useCinematicMotion.ts` | Responsive GSAP zaman çizgileri ve cleanup |
| `src/motion/useAmbientMotion.ts` | Sürekli sahne animasyonları, görünürlük kontrolü ve cleanup |
| `src/styles/` | Sinema, detay, mimari ve mühendislik bölüm stilleri |
| `src/visuals/EarlierSystem.tsx` | Mailops ve OtoMARK için ayrı özgün, kaynak kapsamını koruyan görseller |
| `src/ProjectVisual.tsx`, `src/FlowDiagram.tsx` | Önceki revizyondan korunan bileşenler; yeni ana sayfa ve detay akışında kullanılmaz |

Yeni çalışma için `content.ts` içindeki `defineProject({...})` örneğini kullanın: ana proje `ProjectId`/`projects` kaydına, diğer çalışma `otherProjects` dizisine eklenir. Benzersiz `id` ve URL'ye uygun `slug`, bütün metinlerde TR/EN, ayrı `implemented` ve `planned` listeleri gerekir. `outputs` doğrulanmış çıktı yoksa `null`; doğrulanmamış repository/demo URL'leri de `null` kalır. Detay URL'leri, dil bağlantıları, metadata ve build rotaları bu veriden otomatik oluşur.

Ana sayfanın dört çekirdek bölümü `storyboard.ts` içindeki `systemChapters` ile sıralanır; yalnız `featuredProjectIds` değiştirerek bu sahne sırası değişmez. Yeni bir çekirdek sahne için mevcut `SceneKind` eşlemesini kullanın; yeni görsel türünde `SystemScene`, storyboard ve ilgili hareket builder'ını birlikte genişletin. Mimariyi `architectures.ts` içine kaynak ve hazır/planlanan durumlarıyla ekleyin. Diğer çalışmaların ana sayfa listesi `otherProjects` verisinden oluşur. Şimdiki sunum özgün kavramsal SVG'leri kullanır; `image` alanı tek başına bu sahneleri değiştirmez.

`profile.socialLinks` içine TR/EN `label`, `ariaLabel` ve doğrulanmış `url` eklemek iletişim bağlantısını gösterir. Yeni araştırma ifadesini merkez veri dosyasına ve kaynak belgesine birlikte ekleyin; kaynak bulgusunu kişisel proje sonucuna çevirmeyin. Her içerik değişikliğinden sonra typecheck, build, verify; görsel değişiklikten sonra tarayıcı, otomatik hareket ve görünürlük kontrolü gerekir.

## Tasarım token'ları ve fontlar

`src/index.css` başındaki `:root` token'ları renk, tipografi ve boşluk sistemini yönetir:

| Token | Varsayılan |
| --- | --- |
| `--ink` | `#0b0d10` ana zemin |
| `--surface` / `--surface-2` | `#14191f` / `#1a2027` görsel katmanlar |
| `--paper` / `--muted` | `#f3f1e9` / `#a8afba` metin |
| `--accent` | `#d7ff64` vurgu ve focus |
| `--light` | `#f0efe7` açık bölüm |
| `--gutter` | `clamp(24px, 4vw, 80px)` dış boşluk |
| `--header-height` | `84px` başlangıç değeri; mobilde uyarlanır |

`src/fonts.css` yalnız Manrope ve IBM Plex Mono ailelerini yükler. Türkçe karakterleri içeren yerel WOFF2 alt kümeleri ve OFL lisansları `public/fonts/` içindedir; fontlar harici isteğe ihtiyaç duymaz. Sistem fontları fallback olarak tanımlıdır. Renk değişikliğinde focus, metin ve açık bölüm kontrastını tekrar denetleyin.

Özgün favicon `public/favicon.svg`, düzenlenebilir paylaşım görseli `public/share-image.svg`, sosyal metadata'da kullanılan 1200×630 PNG `public/share-image.png` içindedir. Windows'ta PNG'nin metin tabanlı eşdeğerini yeniden üretmek için `scripts/render-share-image.ps1` çalıştırılabilir. İsim/unvan değiştiğinde bu görselleri de güncelleyin.

## Gizlilik ve yayın hazırlığı

Gizli projeler nötr başlık ve anonim açıklamalarla sunulur. Şirket içi ekranlar, gerçek operasyon verisi, erişim bilgileri, private depo adresleri ve izin verilmemiş ürün adları kamusal veriye eklenmez. Bir görseli CSS ile gizlemek paylaşımı engellemez: `public/`, istemci JavaScript'i, HTML ve metadata kamusal çıktıdır.

Orijinal CV ve teknik rapor PDF'leri, ham çıkarımlar ve inceleme görüntüleri repo veya `public/` içine kopyalanmadı. Telefon ve doğum tarihi yayımlanmadı. `profile.cvDownload` `null` olduğu için “CV iste” mailto aksiyonu görünür. Yalnız incelenmiş kamusal CV sürümü onaylandığında dosyayı ekleyip alanı güncelleyin; aksiyon TR/EN indirme metnine ve download davranışına geçer. Kopyalama başarısızlığı arayüzde bildirilir. Proje ayrıntısı/demo talebi paylaşım izni veya erişim garantisi değildir.

## SEO yapılandırması ve hosting gereksinimleri

`.env.example`, yerel önizleme için kamuya açık iki değişken içerir. Uygulamanın API anahtarı veya e-posta servisi yoktur; Cloudflare connector token'ı ayrı dosyada tutulur. Yerel önizleme için gerektiğinde örneği `.env.local` dosyasına kopyalayın:

```dotenv
VITE_SITE_URL=
VITE_ALLOW_INDEX=false
```

Alan adı boşken canonical, dil alternatifi URL'si veya sitemap üretilmez. Yerel varsayılan HTML `noindex, nofollow`, robots dosyası `Disallow: /` kullanır. Yayındaki `.env.docker`, `https://sshakho.com` canonical adresini, hreflang URL'lerini, sitemap'i ve indekslemeyi etkinleştirir. Ortam değişikliklerinden sonra yeniden build gerekir; yerel önizleme yapılandırması varsayılan noindex halinde kalır.

Yayındaki Nginx image'ı yalnız `dist/` çıktısını sunar; `.prerender/` server paketi dağıtılmaz. Her route dizininin kendi `index.html` dosyası sunulur; bilinmeyen yollar HTTP **404** ve dile uygun `404.html`, `en/404.html` veya `ru/404.html` yanıtını alır. Bütün istekleri kök `index.html` dosyasına yönlendiren SPA rewrite kullanmayın; bu davranış dil, detay içeriği, JavaScript olmadan gezinme ve 404 durum kodunu bozar. Vite production preview aynı route/404 davranışını uygular.

## Lighthouse ölçümünü tekrarlama

Lighthouse CLI bu çalışma sırasında proje bağımlılıklarında, bundled runtime paketlerinde veya PATH üzerinde bulunmadı. Lighthouse puanı burada elde edilmiş sonuç olarak sunulmaz. Chrome kuruluyken, production preview açık durumda aşağıdaki komut daha sonra yerelde çalıştırılabilir; `pnpm dlx` aracı indirir ve headless Chrome başlatır:

```sh
pnpm dlx lighthouse http://localhost:4180/ --only-categories=performance,accessibility,seo --output=html,json --output-path=docs/lighthouse-mobile --chrome-flags=--headless
```

İngilizce ana sayfa ve dört çekirdek proje detayında da tekrarlayın. CLI ve çıktı seçenekleri [resmî Lighthouse dokümanında](https://github.com/GoogleChrome/lighthouse#using-the-node-cli) açıklanır. Hedef mobil Performance ≥90, Accessibility ve SEO ≥95'tir; preview'nin kasıtlı `noindex` ayarı indekslenebilirlik değerlendirmesini etkiler. Yayındaki `https://sshakho.com` ayrıca ölçülmelidir.

Raporla birlikte Lighthouse / Chrome sürümü, URL, cihaz emülasyonu, throttling, tarih ve test ortamını kaydedin. LCP ≤2,5 sn, CLS ≤0,1 ve INP ≤200 ms saha hedefleridir. Lighthouse laboratuvar ölçümü gerçek kullanıcıların 75. yüzdelik INP sonucunu veya tam WCAG 2.2 AA uyumluluğunu kanıtlamaz; klavye, sistem hareket tercihi altında otomatik oynatma, metin büyütme ve tarayıcı kontrollerini de QA raporuna ekleyin.
