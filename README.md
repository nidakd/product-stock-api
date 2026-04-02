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

- `docs/screenshots/` — Teslim kanıtları: database, UI, API swagger

## Çalıştırma Adımları

### Ön Koşullar
- PostgreSQL servisinin çalışıyor olması (varsayılan: localhost:5432, user: postgres, password: postgres)
- Node.js v22+ (npm)
- .NET 10.0 SDK

### Backend (API) Başlatma

```bash
cd api
ASPNETCORE_ENVIRONMENT=Development dotnet run
```

- API http://localhost:5000 üzerinde başlar
- Swagger UI: http://localhost:5000/swagger/index.html
- Veritabanı otomatik olarak oluşturulur ve seeded edilir

### Frontend (React) Başlatma

```bash
cd web
npm install  # İlk çalıştırmada
npm run dev
```

- Frontend http://localhost:5173 üzerinde çalışır
- API endpoint'lerine otomatik bağlanır

### Proje Kullanımı

1. **Ürün Ekle**: Form alanlarını doldur ve "Ürün Ekle" butonuna tıkla
2. **Ürün Listele**: İlk yüklemede veritabanındaki tüm ürünler gösterilir
3. **Ürün Ara**: "Ara" kutusuna ürün adını yazarak filtrele
4. **Ürün Düzenle**: Tabloda "Düzenle" butonuna tıkla, modal formu doldur
5. **Ürün Sil**: Tabloda "Sil" butonuna tıkla, onay modalını doğrula

## API Dokümantasyonu

Tüm API endpointleri **Swagger UI** ile belgelenmiştir:
```
http://localhost:5000/swagger/index.html
```

### Endpointler

| Method | URL | Açıklama |
|--------|-----|----------|
| GET | `/api/products` | Tüm ürünleri getir |
| GET | `/api/products/{id}` | Spesifik ürünü ID ile getir |
| POST | `/api/products` | Yeni ürün ekle (Name, Price, StockQuantity) |
| PUT | `/api/products/{id}` | Ürünü güncelle |
| DELETE | `/api/products/{id}` | Ürün sil |

### Örnek İstek

**POST /api/products:**
```json
{
  "name": "Monitor",
  "price": 2500.00,
  "stockQuantity": 10
}
```

**PUT /api/products/{id}:**
```json
{
  "name": "Updated Monitor",
  "price": 2800.00,
  "stockQuantity": 8
}
```

## Teknoloji Stack

**Backend:**
- .NET 10.0 Web API
- Entity Framework Core 10.0
- PostgreSQL (Npgsql)
- Swagger/OpenAPI

**Frontend:**
- React 18 (Vite)
- Axios
- CSS3 (Dark theme)

**Veritabanı:**
- PostgreSQL 12+
- Automatic schema creation on startup
- Seed data (3 sample products)

## Teslim Kanitlari

Proje tamamlık kanıtları `docs/screenshots/` klasöründe:

- **`api_swagger.png`** — Swagger UI ile API dokümantasyonu (tüm 5 endpoint)
- **`database_products.png`** — PostgreSQL veritabanı (pgAdmin sorgu sonucu)
- **`ui_dashboard_chrome.png`** — React UI dashboard (Chrome tarayıcısı)

## Calistirma Notu

`api/appsettings.json` icindeki `DefaultConnection` degerini kendi PostgreSQL kullanici adina ve sifrena gore gerekirse guncelle. Veritabani adi varsayilan olarak `product_stock` olarak olusturulur.
