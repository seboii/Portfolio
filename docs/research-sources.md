# Araştırma kaynakları ve görsele dönüşüm

Erişim ve doğrulama tarihi: **6 Ekim 2026**. Kamusal araştırma verisi `src/data/research.ts` içinde tek yerde tutulur. Dört sinyalin başlığı ve açıklaması Türkçe/İngilizcedir; kaynak adı, yayıncı, yıl, URL, erişim tarihi, ilgili sistem ve görsel türü yapılandırılmıştır.

Bu katman, sistemlerin neden ilgi çekici olduğunu açıklayan **sektörel bağlamdır**. Bir dış rapor kişisel katkıyı, kullanılan modeli, tamamlanmış özelliği veya performansı doğrulamaz. Proje gerçekleri yerel PDF/kanıt denetimine bağlıdır. Başlıklar ve görsel akışlar özgün editoryal yorumdur; kaynak metninden doğrudan alıntı değildir.

## Sahneye taşınan dört sinyal

| Sinyal / veri kimliği | Doğrulanan bilgi ve birincil kaynak | Neden / nerede | Özgün görsel yorum |
| --- | --- | --- | --- |
| Riskler görünür olduğunda / `logistics-resilience` | [DHL Logistics Trend Radar 8.0 resmî duyurusu](https://group.dhl.com/en/media-relations/press-releases/2026/ai-takes-action-while-people-remain-at-the-center-of-logistics-finds-dhl-logistics-trend-radar.html), **24 Eylül 2026**. “AI Analytics” ve “Supply Chain Diversification” açıklamaları esas alındı. | Araştırma sahnesinden lojistik operasyon bölümüne geçiş. Kesintiler ve dayanıklılık için bağlam sağlar. | Sentetik rota ağı, gecikme düğümü ve alternatif yol. Bu yorum, operasyon projesinde yapay zekâ analitiği uygulandığı anlamına gelmez. |
| Mesafeden bağlantıya / `realtime-connections` | [W3C WebRTC Recommendation](https://www.w3.org/TR/2025/REC-webrtc-20250313/), **13 Mart 2025**; Abstract, Introduction ve §4.1. Medya/veri aktarımı ve bağlantı kurulumunun ayrı sinyalleşmeyle koordine edilmesi okundu. | Gerçek zamanlı iletişim bölümü. Teknolojinin kapsamını açıklar. | Uç noktalar, iletişim yolları ve temsili paketler. Topoloji uygulamanın gerçek dağıtım şeması değildir; sıfır gecikme iddiası yoktur. |
| Hareket → Veri / `movement-to-data` | [Ultralytics COCO-Pose dokümantasyonu](https://docs.ultralytics.com/datasets/pose/coco), Key Features ve Dataset YAML. **COCO Keypoints 2017** şemasındaki 17 nokta ve `(x, y, visibility)` yapısı doğrulandı. | Badhabinot'a geçiş. Poz verisinin nasıl temsil edildiğini açıklar. | Özgün insan silüeti, 17 nokta, bağlantılar ve sentetik hareket izi. Nokta sayısı şemadır; proje doğruluğu/hızı/başarısı değildir. |
| Ölçüm. Bağlam. Sınırlar. / `bounded-intelligence` | [Stanford HAI 2026 AI Index resmî bulguları](https://hai.stanford.edu/news/inside-the-ai-index-12-takeaways-from-the-2026-report), **13 Nisan 2026**, açılış değerlendirmesi. | Lojistik asistanının mimari bölümüne geçiş. Ölçüm ve yönetim sorununu görünür kılar. | Bağlam sınırı ve ayrı araç düğümleri içeren özgün hat. Düğümler araştırma bulgusu veya çalışan otonom ajan kanıtı değildir. Uygulama temeli ile planlanan yapay zekâ kabiliyetleri ayrı gösterilmelidir. |

`year` alanı normalde kaynağın yayın/sürüm yılıdır. Poz sinyalindeki **2017**, COCO veri kümesi sürümüdür; dinamik Ultralytics sayfasının yayın tarihi olarak sunulmamalıdır. Sayfa erişim tarihi ayrıca 2026-10-06 olarak kayıtlıdır. WebRTC için değişebilen ana adres yerine tarihli Recommendation bağlantısı kullanılır.

## İncelenen tamamlayıcı birincil kaynaklar

- [World Economic Forum — Future of Jobs Report 2025, resmî bulgular](https://www.weforum.org/publications/the-future-of-jobs-report-2025/digest/): sayfa tarihi **7 Ocak 2025**. İşveren beklentileri arasında yapay zekâ/büyük veri, ağlar/siber güvenlik ve teknolojik okuryazarlık öne çıkıyor. Bu bir işveren anketi ve 2025–2030 beklentisidir. Dört görsel sinyalin bütünlüğü için ayrıca bir işgücü istatistiği eklenmedi; kişisel beceri puanı çıkarılmadı. Yayın serisi listesi 8 Ocak gösterdiğinden kaynak belgesinin kendi tarihi esas alındı.
- [Lewis ve diğerleri — Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401): ilk gönderim **22 Mayıs 2020**, NeurIPS 2020; güncel arXiv sürümü 12 Nisan 2021. Çalışma, parametrik dil modeliyle harici vektör indeksinden getirmeyi birleştirir. Bu, önerilen bilgi hattı için kavramsal bağlamdır. Lojistik asistanında RAG'ın tamamlandığını kanıtlamaz; çalışmanın sonuçları portfolyo performansına aktarılmadı.
- [Microsoft Learn — Semantic Kernel Function Choice Behavior](https://learn.microsoft.com/en-us/semantic-kernel/concepts/ai-services/chat-completion/function-calling/function-choice-behaviors): görünür son güncelleme **6 Mayıs 2025**. Modele sunulan fonksiyonlar liste/filtreyle seçilebilir. Araç sınırı görseli için düşünsel destek sağlar. Tek başına fonksiyon reklamı erişim kontrolü veya güvenlik garantisi değildir; Semantic Kernel kişisel projede kullanılmış teknoloji olarak eklenmedi.
- [Stanford HAI — 2026 AI Index rapor sayfası](https://hai.stanford.edu/ai-index/2026-ai-index-report): 2026 sürümünün mevcut olduğu ayrıca doğrulandı. Kamusal sinyal için raporun kurum tarafından yayımlanan bulguları kullanıldı.

## Erişim sınırları ve dışarıda bırakılanlar

- DHL 8.0 tam rapor PDF bağlantısı tarayıcı araştırma aracında dahili hata verdi. Tam PDF okunmuş gibi davranılmadı; sadece erişilebilen resmî duyurunun açık açıklamaları kullanıldı. Sürüm ve tarih bu duyuruda doğrudan doğrulandı.
- Stanford rapor PDF'si araçta yaklaşık **38 MB** içerik sınırı nedeniyle açılamadı. Tam rapor sayfalarına dair atıf yapılmadı; kurumsal rapor sayfası ve tarihli resmî bulgular okundu.
- Ultralytics'in güncel sayfası daha yeni YOLO sürümlerini de anlatır. Bu durum yerel CV'deki **YOLOv8** bilgisini değiştirmez. Kamusal araştırma sadece modelden bağımsız 17 nokta şemasını kullanır; güncel model ölçümleri kopyalanmaz.
- Kullanıcı sayısı, müşteri sayısı, doğruluk yüzdesi, işlem hızı, gelir, proje performans artışı veya işgücü kaybı gibi büyük sayılar bu katmana eklenmedi. **30 FPS** araştırma kaynağıyla kişisel sonuç olarak doğrulanmadı ve sinyallerde kullanılmadı.

## Kaynak ve telif uygulaması

Rapor kapağı, harita, grafik, ekran görüntüsü, COCO fotoğrafı, model ağırlığı veya üçüncü taraf görsel varlık indirilmedi/kullanılmadı. Kaynakların anlamı kısa biçimde yeniden ifade edildi. Her kaynak için iki dilde metin ve bu açıklamanın toplamı sınırlı tutuldu; hiçbir kaynaktan uzun pasaj taşınmadı. SVG/HTML görsellerinin geometrisi özgündür, veri sentetiktir ve kaynağın grafiğini yeniden üretmez. UI'da ilgili `source`, `publisher`, `year` ve gerçek `url` aynı sinyalle birlikte gösterilmelidir.
