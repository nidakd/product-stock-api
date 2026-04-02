# Product Stock Management

Bu proje, .NET Web API + React ile geliştirilmiş bir ürün stok yönetim sistemidir. PostgreSQL otomatik oluşturulur ve seed edilir.

## Özellikler

- CRUD işlemleri (Create, Read, Update, Delete)
- Ürün adı ile arama ve filtreleme
- Delete onay modal'ı
- Para formatı (TRY cinsinden)
- Boş liste mesajı
- Responsive dark theme UI
- API logging ve hata yönetimi
- DTO validasyonu

## Klasör Yapısı

- `api/` — .NET 10.0 Web API + EF Core
- `web/` — React + Vite
- `docs/screenshots/` — Teslim kanıtları

## Hızlı Başlangıç

Projeyi kontrol etmek için iki terminal aç:

1. API: `http://localhost:5000`
2. UI: `http://localhost:5173`

**Backend:**
```bash
cd api
ASPNETCORE_ENVIRONMENT=Development dotnet run
```
- API: http://localhost:5000
- Swagger: http://localhost:5000/swagger/index.html

**Frontend:**
```bash
cd web
npm install && npm run dev
```
- UI: http://localhost:5173

Eğer `5173` doluysa eski `vite` process'ini kapatıp tekrar başlat.

## API Endpointleri

| Method | URL | İşlem |
|--------|-----|-------|
| GET | `/api/products` | Tüm ürünler |
| GET | `/api/products/{id}` | Ürün detayı |
| POST | `/api/products` | Yeni ürün ekle |
| PUT | `/api/products/{id}` | Ürünü güncelle |
| DELETE | `/api/products/{id}` | Ürün sil |

**Örnek İstek:**
```json
{
  "name": "Laptop",
  "price": 49999.00,
  "stockQuantity": 5
}
```

## Stack

- **Backend:** .NET 10.0, EF Core, PostgreSQL (Npgsql), Swagger
- **Frontend:** React 18, Axios, Vite, CSS3
- **Database:** PostgreSQL (otomatik oluştur + seed)

## Teslim Kanıtları

- `docs/screenshots/api_swagger.png` — Swagger API dokümantasyonu
- `docs/screenshots/database_products.png` — PostgreSQL veritabanı
- `docs/screenshots/ui_dashboard_chrome.png` — React dashboard UI
