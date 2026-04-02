# Product Stock Homework

Bu klasor, bootcamp odevi icin sifirdan olusturulan bagimsiz projedir.
Amac: .NET Web API + React ile basit urun stok yonetim sistemi gelistirmek.

Backend tarafinda PostgreSQL kullaniliyor. Uygulama ilk calistiginda veritabani yoksa otomatik olusturur; sadece PostgreSQL servisinin calisiyor olmasi yeterlidir. Varsayilan baglanti cizgisi `api/appsettings.json` icindedir.

## Klasor Yapisi

- `api/` : Backend (.NET Web API)
- `web/` : Frontend (React)
- `docs/` : Proje notlari, plan, todo ve teslim dokumanlari

## Odev Kapsami (Kisa)

Zorunlu:
- Product modeli (Id, Name, Price, StockQuantity)
- API endpointleri:
  - GET /api/products
  - GET /api/products/{id}
  - POST /api/products
  - DELETE /api/products/{id}
- React arayuzunde listeleme, ekleme, silme
- Veri saklama: PostgreSQL + Entity Framework Core

Ekstra:
- Arama
- Hata yonetimi
- Daha iyi UI

## Dokumanlar

- `docs/TODO.md`
- `docs/PROJECT_PLAN.md`
- `docs/GIT_WORKFLOW.md`

## Calistirma Notu

`api/appsettings.json` icindeki `DefaultConnection` degerini kendi PostgreSQL kullanici adina ve sifrena gore gerekirse guncelle. Veritabani adi varsayilan olarak `product_stock` olarak olusturulur.
